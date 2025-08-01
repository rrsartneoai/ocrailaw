
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Users, Shield, Clock, Zap, FileText, MessageCircle, Calendar, Lock } from "lucide-react";

const ModulesSection = () => {
  const modules = [
    {
      id: 1,
      title: "Asystent na Stronę WWW",
      icon: Globe,
      targetUser: "Potencjalni klienci",
      securityLevel: "Publiczny",
      securityColor: "bg-green-500",
      features: [
        "Czatbot dostępny 24/7",
        "Generowanie leadów",
        "Wstępna kwalifikacja spraw",
        "Integracja z kalendarzem",
        "Automatyczne zbieranie danych kontaktowych"
      ],
      benefits: [
        "50% więcej leadów",
        "Obsługa poza godzinami pracy",
        "Kwalifikacja wysokiej jakości"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 2,
      title: "Panel Komunikacji z Klientem",
      icon: Users,
      targetUser: "Obecni klienci",
      securityLevel: "Wysoki",
      securityColor: "bg-amber-500",
      features: [
        "Bezpieczny panel po zalogowaniu",
        "Status sprawy w czasie rzeczywistym",
        "Automatyczne przypomnienia",
        "Dostęp do dokumentów sprawy",
        "Podsumowania komunikacji"
      ],
      benefits: [
        "70% mniej zapytań telefonicznych",
        "Wyższa satysfakcja klientów",
        "Automatyzacja rutynowych zadań"
      ],
      gradient: "from-amber-500 to-orange-500"
    },
    {
      id: 3,
      title: "Wewnętrzny Asystent Prawny",
      icon: Shield,
      targetUser: "Zespół kancelarii",
      securityLevel: "Maksymalny",
      securityColor: "bg-red-500",
      features: [
        "Przeszukiwanie całej bazy wiedzy",
        "Analiza i streszczanie dokumentów",
        "Wsparcie w pisaniu pism",
        "Porównywanie dokumentów",
        "System 'second brain'"
      ],
      benefits: [
        "80% oszczędności czasu na research",
        "Konsystentność jakości pism",
        "Zachowanie know-how kancelarii"
      ],
      gradient: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section id="modules" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trzy Moduły. Jeden System.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            LexiCore RAG dostosowuje się do każdego aspektu pracy kancelarii,
            zapewniając odpowiedni poziom bezpieczeństwa i funkcjonalności.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Card key={module.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group relative overflow-hidden">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className={`${module.securityColor} text-white`}>
                    {module.securityLevel}
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl mb-2">{module.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  Dedykowany dla: {module.targetUser}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-6">
                {/* Features */}
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Funkcjonalności
                  </h4>
                  <ul className="space-y-2">
                    {module.features.map((feature, index) => (
                      <li key={index} className="text-gray-400 text-sm flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-amber-400" />
                    Korzyści biznesowe
                  </h4>
                  <div className="space-y-2">
                    {module.benefits.map((benefit, index) => (
                      <div key={index} className={`text-sm p-2 rounded-lg bg-gradient-to-r ${module.gradient} bg-opacity-10 text-white`}>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className={`w-full bg-gradient-to-r ${module.gradient} hover:opacity-90 text-white`}>
                  Dowiedz się więcej
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
