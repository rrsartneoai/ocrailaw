
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Brain, Zap, Shield } from "lucide-react";

const AIHeroSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Bot className="h-4 w-4 mr-2" />
            Wprowadzamy LexiCore RAG
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Asystent AI
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            LexiCore RAG
          </span>
          dla Twojej Kancelarii
        </h2>

        <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Pierwsza w Polsce implementacja technologii RAG (Retrieval-Augmented Generation) 
          dedykowana kancelariom prawnym. Połączenie mocy sztucznej inteligencji z Twoją 
          prywatną bazą wiedzy prawniczej.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-3 text-gray-300 bg-slate-800/30 rounded-lg p-4">
            <Brain className="h-6 w-6 text-purple-400" />
            <span>AI + Twoja wiedza</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300 bg-slate-800/30 rounded-lg p-4">
            <Zap className="h-6 w-6 text-blue-400" />
            <span>80% oszczędności czasu</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300 bg-slate-800/30 rounded-lg p-4">
            <Shield className="h-6 w-6 text-green-400" />
            <span>Pełna poufność</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 text-lg"
          >
            Przetestuj LexiCore RAG
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
          >
            <Bot className="mr-2 h-5 w-5" />
            Zobacz demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIHeroSection;
