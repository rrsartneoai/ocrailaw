
-- Create embeddings table for RAG system
CREATE TABLE public.embeddings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  embedding vector(768),
  metadata jsonb DEFAULT '{}',
  source_type text NOT NULL DEFAULT 'document',
  source_id uuid,
  user_id uuid REFERENCES auth.users,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- RLS policies for embeddings
CREATE POLICY "Users can view their own embeddings" 
  ON public.embeddings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own embeddings" 
  ON public.embeddings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own embeddings" 
  ON public.embeddings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own embeddings" 
  ON public.embeddings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for vector similarity search
CREATE INDEX embeddings_embedding_idx ON public.embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION public.match_embeddings(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10,
  user_id_param uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  source_type text,
  source_id uuid,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    embeddings.id,
    embeddings.content,
    embeddings.metadata,
    embeddings.source_type,
    embeddings.source_id,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM public.embeddings
  WHERE 
    (user_id_param IS NULL OR embeddings.user_id = user_id_param)
    AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER embeddings_updated_at
  BEFORE UPDATE ON public.embeddings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
