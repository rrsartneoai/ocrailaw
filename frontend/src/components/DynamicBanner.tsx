
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Brain, Code, Shield } from 'lucide-react';
import GlassCard from './GlassCard';

const bannerContent = [
  {
    title: "🚀 Nowy Generator Snippetów",
    subtitle: "Twórz kod w kilka sekund z AI",
    description: "Automatyczne generowanie fragmentów kodu dla różnych języków programowania",
    icon: Code,
    color: "from-blue-500 to-purple-600",
    action: "Wypróbuj teraz",
    link: "#snippet-generator"
  },
  {
    title: "🧠 LexiCore RAG AI",
    subtitle: "Inteligentny asystent prawniczy",
    description: "Zadawaj pytania prawne i otrzymuj odpowiedzi oparte na Twojej bazie wiedzy",
    icon: Brain,
    color: "from-purple-500 to-pink-600",
    action: "Rozpocznij rozmowę",
    link: "/prawo-asystent"
  },
  {
    title: "⚡ Superszybkie API",
    subtitle: "Integracja w 5 minut",
    description: "RESTful API z pełną dokumentacją i SDK dla wszystkich popularnych języków",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    action: "Zobacz API",
    link: "#api"
  },
  {
    title: "🔒 Enterprise Security",
    subtitle: "Bezpieczeństwo na najwyższym poziomie",
    description: "Szyfrowanie end-to-end, compliance z RODO i certyfikaty bezpieczeństwa",
    icon: Shield,
    color: "from-green-500 to-teal-600",
    action: "Dowiedz się więcej",
    link: "#security"
  }
];

const DynamicBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerContent.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const banner = bannerContent[currentBanner];
  const IconComponent = banner.icon;

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/50 to-purple-900/90"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard 
          className={`p-8 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          hoverable
          intensity="high"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Nowość
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {banner.title}
              </h2>
              
              <h3 className={`text-xl md:text-2xl font-semibold mb-4 bg-gradient-to-r ${banner.color} bg-clip-text text-transparent`}>
                {banner.subtitle}
              </h3>
              
              <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                {banner.description}
              </p>
              
              <Button
                size="lg"
                className={`bg-gradient-to-r ${banner.color} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                onClick={() => {
                  if (banner.link.startsWith('#')) {
                    document.querySelector(banner.link)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = banner.link;
                  }
                }}
              >
                {banner.action}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-shrink-0">
              <div className={`p-6 rounded-full bg-gradient-to-r ${banner.color} shadow-2xl animate-pulse`}>
                <IconComponent className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {bannerContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBanner
                    ? `bg-gradient-to-r ${banner.color} scale-125`
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default DynamicBanner;
