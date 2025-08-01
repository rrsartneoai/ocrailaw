
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, Shield, Rocket, Calendar } from "lucide-react";

const ImplementationTimeline = () => {
  const phases = [
    {
      phase: 1,
      title: "MVP - Asystent na Stronę WWW",
      duration: "4-6 tygodni",
      status: "recommended",
      icon: Rocket,
      description: "Szybkie wdrożenie z niskim ryzykiem",
      goals: [
        "Uruchomienie chatbota na stronie kancelarii",
        "Integracja z danymi publicznymi",
        "Test technologii RAG w bezpiecznym środowisku",
        "Pierwsze dane o interakcjach z potencjalnymi klientami"
      ],
      deliverables: [
        "Działający chatbot na stronie WWW",
        "Panel administracyjny",
        "Podstawowe metryki i analytics",
        "Dokumentacja użytkownika"
      ],
      investment: "Niski"
    },
    {
      phase: 2,
      title: "Wewnętrzny Asystent Prawny",
      duration: "8-12 tygodni",
      status: "planning",
      icon: Users,
      description: "Główny moduł zwiększający produktywność",
      goals: [
        "Budowa potoku przetwarzania dokumentów wewnętrznych",
        "Wdrożenie dla grupy pilotażowej prawników",
        "Optymalizacja jakości odpowiedzi",
        "Szkolenie zespołu"
      ],
      deliverables: [
        "System przetwarzania dokumentów",
        "Interfejs wewnętrzny dla prawników",
        "Zaawansowane funkcje wyszukiwania",
        "Raporty wykorzystania systemu"
      ],
      investment: "Średni"
    },
    {
      phase: 3,
      title: "Panel Komunikacji z Klientem",
      duration: "10-16 tygodni",
      status: "future",
      icon: Shield,
      description: "Bezpieczny dostęp dla klientów kancelarii",
      goals: [
        "Integracja z systemem CRM/ERP",
        "Bezpieczny panel logowania dla klientów",
        "Separacja danych między klientami",
        "Automatyzacja komunikacji"
      ],
      deliverables: [
        "Panel klienta z uwierzytelnianiem",
        "Integracja z systemami kancelarii",
        "Automatyczne powiadomienia",
        "System zarządzania uprawnieniami"
      ],
      investment: "Wysoki"
    },
    {
      phase: 4,
      title: "Optymalizacja i Rozwój",
      duration: "Ciągły",
      status: "ongoing",
      icon: CheckCircle,
      description: "Ciągłe doskonalenie systemu",
      goals: [
        "Monitoring wydajności systemu",
        "Regularne aktualizacje bazy wiedzy",
        "Rozwój nowych funkcjonalności",
        "Aktualizacje modeli AI"
      ],
      deliverables: [
        "Miesięczne raporty wydajności",
        "Nowe funkcjonalności",
        "Aktualizacje bezpieczeństwa",
        "Wsparcie techniczne 24/7"
      ],
      investment: "Operacyjny"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'future': return 'bg-purple-500';
      case 'ongoing': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recommended': return 'Zalecany start';
      case 'planning': return 'W planach';
      case 'future': return 'Przyszłość';
      case 'ongoing': return 'Ciągły';
      default: return status;
    }
  };

  return (
    <section id="implementation" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Roadmapa Wdrożenia
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stopniowe wdrażanie LexiCore RAG dostosowane do potrzeb i możliwości Twojej kancelarii.
            Każda faza przynosi konkretne korzyści biznesowe.
          </p>
        </div>

        <div className="space-y-8">
          {phases.map((phase) => (
            <Card key={phase.phase} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <phase.icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl">
                        Faza {phase.phase}: {phase.title}
                      </CardTitle>
                      <p className="text-gray-400 mt-1">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${getStatusColor(phase.status)} text-white`}>
                      {getStatusText(phase.status)}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {phase.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Goals */}
                  <div>
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      Cele fazy
                    </h4>
                    <ul className="space-y-2">
                      {phase.goals.map((goal, index) => (
                        <li key={index} className="text-gray-400 text-sm flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                      Rezultaty
                    </h4>
                    <ul className="space-y-2">
                      {phase.deliverables.map((deliverable, index) => (
                        <li key={index} className="text-gray-400 text-sm flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-700">
                  <div className="text-gray-400">
                    <span className="text-sm">Inwestycja: </span>
                    <span className={`font-semibold ${
                      phase.investment === 'Niski' ? 'text-green-400' :
                      phase.investment === 'Średni' ? 'text-amber-400' : 
                      phase.investment === 'Wysoki' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {phase.investment}
                    </span>
                  </div>
                  
                  {phase.status === 'recommended' && (
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      Zacznij od tej fazy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-white text-xl text-center mb-4">
                Gotowy na rozpoczęcie?
              </h3>
              <p className="text-gray-300 text-center mb-6">
                Umów bezpłatną konsultację i zobacz, jak LexiCore RAG może 
                zrewolucjonizować pracę Twojej kancelarii.
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-3">
                Umów prezentację systemu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImplementationTimeline;
