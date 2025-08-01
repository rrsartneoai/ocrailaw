
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      throw new Error("No file provided");
    }

    // Tutaj byłaby integracja z OCR API (np. Google Vision API, Tesseract, etc.)
    // Na razie zwracamy symulowany tekst
    const mockOcrText = `
    SĄD REJONOWY W WARSZAWIE
    Sygnatura akt: XII C 123/2024
    
    WEZWANIE DO ZAPŁATY
    
    Na podstawie art. 484 § 1 Kodeksu postępowania cywilnego wzywa się dłużnika:
    Jan Kowalski
    ul. Przykładowa 123, 00-001 Warszawa
    
    do zapłaty na rzecz wierzyciela kwoty 5.000,00 zł tytułem zadłużenia wraz z odsetkami
    w terminie 7 dni od doręczenia niniejszego wezwania.
    
    W razie nie wykonania zobowiązania w wyznaczonym terminie, zostanie przeciwko Panu
    wystawiony nakaz zapłaty w postępowaniu nakazowym.
    `;

    return new Response(JSON.stringify({ 
      text: mockOcrText.trim(),
      confidence: 0.95 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
