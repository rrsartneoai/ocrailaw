
-- Rozszerzenie tabeli embeddings o dodatkowe pola dla lepszego zarządzania
ALTER TABLE public.embeddings 
ADD COLUMN IF NOT EXISTS document_name text,
ADD COLUMN IF NOT EXISTS file_size integer,
ADD COLUMN IF NOT EXISTS file_type text,
ADD COLUMN IF NOT EXISTS chunk_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_status text DEFAULT 'completed';

-- Dodanie indeksów dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_embeddings_document_name ON public.embeddings(document_name);
CREATE INDEX IF NOT EXISTS idx_embeddings_user_status ON public.embeddings(user_id, processing_status);
CREATE INDEX IF NOT EXISTS idx_embeddings_source_type ON public.embeddings(source_type);

-- Tabela dla sesji RAG (historia konwersacji z kontekstem)
CREATE TABLE IF NOT EXISTS public.rag_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Nowa sesja RAG',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- RLS dla rag_sessions
ALTER TABLE public.rag_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own RAG sessions" 
  ON public.rag_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own RAG sessions" 
  ON public.rag_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RAG sessions" 
  ON public.rag_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RAG sessions" 
  ON public.rag_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Tabela dla wiadomości RAG z referencjami do źródeł
CREATE TABLE IF NOT EXISTS public.rag_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.rag_sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  sources jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- RLS dla rag_messages
ALTER TABLE public.rag_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their own RAG sessions" 
  ON public.rag_messages 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.rag_sessions 
    WHERE rag_sessions.id = rag_messages.session_id 
    AND rag_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages in their own RAG sessions" 
  ON public.rag_messages 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.rag_sessions 
    WHERE rag_sessions.id = rag_messages.session_id 
    AND rag_sessions.user_id = auth.uid()
  ));

-- Trigger dla updated_at w rag_sessions
CREATE TRIGGER rag_sessions_updated_at
  BEFORE UPDATE ON public.rag_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Funkcja do zarządzania sesjami RAG
CREATE OR REPLACE FUNCTION public.create_rag_session(session_title text DEFAULT 'Nowa sesja RAG')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_session_id uuid;
BEGIN
  INSERT INTO public.rag_sessions (user_id, title)
  VALUES (auth.uid(), session_title)
  RETURNING id INTO new_session_id;
  
  RETURN new_session_id;
END;
$$;

-- Funkcja do czyszczenia starych embeddings
CREATE OR REPLACE FUNCTION public.cleanup_old_embeddings(days_old integer DEFAULT 90)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.embeddings 
  WHERE created_at < (now() - interval '1 day' * days_old)
  AND processing_status = 'completed';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
