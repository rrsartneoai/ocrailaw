
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Shield, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Zap className="h-4 w-4 mr-2" />
            Nowa generacja API prawniczego
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Profesjonalny
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
            System API
          </span>
          dla Kancelarii
        </h1>

        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Zaawansowane rozwiązanie API z Domain-Driven Design, RESTful architekturą 
          i profesjonalnymi SDK dla wszystkich popularnych języków programowania.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold px-8 py-4 text-lg"
          >
            Rozpocznij integrację
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
          >
            <Code className="mr-2 h-5 w-5" />
            Zobacz dokumentację
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Shield className="h-6 w-6 text-green-400" />
            <span>Bezpieczeństwo enterprise</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Code className="h-6 w-6 text-blue-400" />
            <span>RESTful & JSON:API</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-gray-300">
            <Zap className="h-6 w-6 text-amber-400" />
            <span>Wysoka wydajność</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
