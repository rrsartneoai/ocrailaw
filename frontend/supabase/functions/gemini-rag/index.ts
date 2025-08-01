
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the authorization token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { query, sessionId } = await req.json();
    console.log('RAG Query:', query, 'Session ID:', sessionId);

    if (!query || typeof query !== 'string') {
      throw new Error('Query is required and must be a string');
    }

    // Generate embedding for the user query using Gemini
    const geminiApiKey = 'AIzaSyDbqFSRtuETTCQnQQARvsllJV6H573z_Hg'; // Your provided API key
    
    const embeddingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "models/embedding-001",
          content: {
            parts: [{ text: query }]
          }
        })
      }
    );

    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.text();
      console.error('Gemini embedding error:', errorData);
      throw new Error(`Failed to generate embedding: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.embedding.values;

    console.log('Generated query embedding, length:', queryEmbedding.length);

    // Search for similar documents using vector similarity
    const { data: similarDocs, error: searchError } = await supabaseClient.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5,
      user_id_filter: user.id
    });

    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error(`Search failed: ${searchError.message}`);
    }

    console.log('Found similar documents:', similarDocs?.length || 0);

    // Prepare context from similar documents
    const context = similarDocs
      ?.map((doc: any) => `Document: ${doc.document_name || 'Unknown'}\nContent: ${doc.content}`)
      .join('\n\n---\n\n') || '';

    console.log('Context length:', context.length);

    // Generate response using Gemini
    const chatResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Jesteś profesjonalnym asystentem prawniczym AI. Odpowiadaj tylko w języku polskim. 
              
Bazując na poniższym kontekście z dokumentów użytkownika, odpowiedz na pytanie użytkownika w sposób precyzyjny i pomocny.

KONTEKST Z DOKUMENTÓW:
${context}

PYTANIE UŻYTKOWNIKA:
${query}

INSTRUKCJE:
- Odpowiadaj tylko na podstawie udostępnionego kontekstu
- Jeśli nie ma wystarczających informacji w kontekście, powiedz to jasno
- Używaj profesjonalnego, ale przystępnego języka
- Uwzględnij źródła dokumentów w odpowiedzi jeśli są dostępne
- Jeśli pytanie dotyczy prawa, podaj konkretne odniesienia z dokumentów`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!chatResponse.ok) {
      const errorData = await chatResponse.text();
      console.error('Gemini chat error:', errorData);
      throw new Error(`Failed to generate response: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    const answer = chatData.candidates?.[0]?.content?.parts?.[0]?.text || 'Przepraszam, nie udało się wygenerować odpowiedzi.';

    // Prepare sources information
    const sources = similarDocs?.map((doc: any) => ({
      document_name: doc.document_name || 'Unknown Document',
      similarity: doc.similarity,
      source_type: doc.source_type || 'document'
    })) || [];

    console.log('Generated answer length:', answer.length);
    console.log('Sources count:', sources.length);

    // Save the conversation to database if sessionId is provided
    if (sessionId) {
      try {
        // Save user message
        await supabaseClient.from('rag_messages').insert({
          session_id: sessionId,
          role: 'user',
          content: query,
          sources: []
        });

        // Save assistant response
        await supabaseClient.from('rag_messages').insert({
          session_id: sessionId,
          role: 'assistant', 
          content: answer,
          sources: sources
        });

        // Update session timestamp
        await supabaseClient
          .from('rag_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', sessionId);
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Don't throw error here, still return the response
      }
    }

    return new Response(
      JSON.stringify({
        answer,
        sources,
        context_used: context.length > 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-rag function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
