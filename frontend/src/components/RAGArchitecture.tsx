import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Search, Brain, FileText, ArrowRight, Cpu, Cloud } from "lucide-react";
import { useState } from "react";

const RAGArchitecture = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Baza Wiedzy",
      icon: Database,
      description: "Twoje dokumenty, umowy, orzecznictwo i akta spraw",
      details: "Automatyczne przetwarzanie dokumentów PDF, DOCX, e-maili. Bezpieczne przechowywanie w bazie wektorowej."
    },
    {
      id: 2,
      title: "Embedding",
      icon: Cpu,
      description: "Konwersja dokumentów na wektory numeryczne",
      details: "Wykorzystanie najnowszych modeli embeddingowych do tworzenia semantycznych reprezentacji tekstów."
    },
    {
      id: 3,
      title: "Zapytanie",
      icon: Search,
      description: "Użytkownik zadaje pytanie w języku naturalnym",
      details: "Intuicyjny interfejs umożliwiający zadawanie pytań tak jak w rozmowie z prawnikiem."
    },
    {
      id: 4,
      title: "Wyszukiwanie",
      icon: FileText,
      description: "System znajduje najbardziej relevantne dokumenty",
      details: "Wyszukiwanie semantyczne w oparciu o podobieństwo wektorowe, nie tylko słowa kluczowe."
    },
    {
      id: 5,
      title: "Generowanie",
      icon: Brain,
      description: "AI tworzy precyzyjną odpowiedź opartą na faktach",
      details: "GPT-4 lub Claude 3 generuje odpowiedź wyłącznie w oparciu o znalezione dokumenty."
    }
  ];

  return (
    <section id="architecture" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Jak działa architektura RAG?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Retrieval-Augmented Generation łączy potęgę AI z Twoją unikalną bazą wiedzy prawniczej,
            zapewniając precyzyjne odpowiedzi oparte na rzeczywistych dokumentach.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {steps.map((step) => (
              <Card 
                key={step.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  activeStep === step.id 
                    ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-white text-lg">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activeStep === step.id ? 'bg-purple-500' : 'bg-slate-700'
                    }`}>
                      <step.icon className="h-5 w-5 text-white" />
                    </div>
                    {step.id}. {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:sticky lg:top-8">
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center">
                  {React.createElement(steps[activeStep - 1].icon, { className: "h-8 w-8 mr-3 text-purple-400" })}
                  {steps[activeStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {steps[activeStep - 1].details}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-semibold">
                    Krok {activeStep} z {steps.length}
                  </span>
                  <Button
                    onClick={() => setActiveStep(activeStep < steps.length ? activeStep + 1 : 1)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Następny krok
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RAGArchitecture;
