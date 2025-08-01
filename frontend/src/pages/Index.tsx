
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Shield, Clock, CheckCircle, Star, Users, Gavel, Search } from "lucide-react";
import { useState } from "react";
import OrderForm from "@/components/OrderForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LawFirmIntegrationExample } from "@/components/law-firm/LawFirmIntegrationExample";

const Index = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showLawFirmSearch, setShowLawFirmSearch] = useState(false);

  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Ekspresowa analiza",
      description: "Otrzymaj profesjonalną analizę prawną w ciągu 24 godzin"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Gwarancja jakości",
      description: "Wszystkie analizy przygotowywane przez doświadczonych prawników"
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Kompleksowe pisma",
      description: "Gotowe pisma procesowe dostosowane do Twojej sprawy"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Doświadczenie",
      description: "Ponad 1000 zadowolonych klientów i rozwiązanych spraw"
    }
  ];

  const examples = [
    {
      type: "Pismo z komornika",
      price: "od 89 zł",
      description: "Analiza pisma komorniczego i przygotowanie odpowiedzi",
      popular: true
    },
    {
      type: "Wezwanie z sądu",
      price: "od 129 zł",
      description: "Kompleksowa analiza dokumentów sądowych"
    },
    {
      type: "Umowa/Reklamacja",
      price: "od 69 zł",
      description: "Przegląd umów i przygotowanie reklamacji"
    }
  ];

  if (showOrderForm) {
    return <OrderForm onBack={() => setShowOrderForm(false)} />;
  }

  if (showLawFirmSearch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowLawFirmSearch(false)}
              className="mb-4"
            >
              ← Powrót do głównej strony
            </Button>
          </div>
          <LawFirmIntegrationExample />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-600/20 text-blue-100 border-blue-400/30 hover:bg-blue-600/30 transition-colors">
              <Gavel className="w-4 h-4 mr-2" />
              Nowoczesna kancelaria prawna online
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Szybka analiza prawna
              <span className="block text-3xl lg:text-5xl mt-2">dokumentów online</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Wgraj swoje pismo, otrzymaj profesjonalną analizę prawną i gotowe pisma procesowe w ciągu 24 godzin
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowOrderForm(true)}
              >
                Zamów analizę teraz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg rounded-xl"
                onClick={() => setShowLawFirmSearch(true)}
              >
                Znajdź kancelarię
                <Search className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">od 69 zł</div>
                <div className="text-sm text-blue-200">za analizę</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Gwarancja jakości</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>24h realizacja</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>Bezpieczne płatności</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Przykładowe sprawy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Zobacz, w jakich sprawach możemy Ci pomóc
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {examples.map((example, index) => (
              <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${example.popular ? 'ring-2 ring-yellow-400' : ''}`}>
                {example.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black">
                    <Star className="w-4 h-4 mr-1" />
                    Popularne
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-gray-900">{example.type}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">{example.price}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 mb-4">
                    {example.description}
                  </CardDescription>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowOrderForm(true)}
                  >
                    Zamów analizę
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Dlaczego warto nas wybrać?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profesjonalna pomoc prawna dostępna online 24/7
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Potrzebujesz pomocy prawnej?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Nie czekaj - każdy dzień może być kluczowy w Twojej sprawie
          </p>
          <Button 
            size="lg" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={() => setShowOrderForm(true)}
          >
            Rozpocznij analizę teraz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
