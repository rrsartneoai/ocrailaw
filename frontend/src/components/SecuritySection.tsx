
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileCheck, Server, Key, UserCheck, AlertTriangle } from "lucide-react";

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Tajemnica Zawodowa",
      description: "Pełne zachowanie tajemnicy adwokackiej i radcowskiej",
      details: [
        "Hosting on-premise lub dedykowana chmura prywatna w UE",
        "Szyfrowanie end-to-end",
        "Segregacja danych według klientów"
      ],
      level: "Krytyczny"
    },
    {
      icon: Lock,
      title: "Kontrola Dostępu",
      description: "Zaawansowany system uprawnień oparty na rolach (RBAC)",
      details: [
        "Indywidualne profile dostępu",
        "Dwuetapowa weryfikacja (2FA)",
        "Automatyczne logowanie sesji"
      ],
      level: "Wysoki"
    },
    {
      icon: Eye,
      title: "Anonimizacja Danych",
      description: "Automatyczne usuwanie danych osobowych z ogólnej bazy",
      details: [
        "Inteligentne rozpoznawanie PII",
        "Pseudonimizacja w bazach treningowych",
        "Zgodność z RODO"
      ],
      level: "Wysoki"
    },
    {
      icon: FileCheck,
      title: "Ślad Audytowy",
      description: "Pełne logowanie wszystkich działań w systemie",
      details: [
        "Rejestrowanie każdego zapytania",
        "Timestamping i podpisy cyfrowe",
        "Raportowanie zgodności"
      ],
      level: "Średni"
    }
  ];

  const complianceStandards = [
    { name: "RODO", description: "Rozporządzenie o Ochronie Danych Osobowych" },
    { name: "ISO 27001", description: "Międzynarodowy standard bezpieczeństwa informacji" },
    { name: "SOC 2", description: "Kontrole bezpieczeństwa dla dostawców usług" },
    { name: "Tajemnica Zawodowa", description: "Zgodność z kodeksami etyki zawodowej" }
  ];

  return (
    <section id="security" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bezpieczeństwo i Etyka
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            LexiCore RAG został zaprojektowany z myślą o najwyższych standardach 
            bezpieczeństwa i zgodności z wymogami zawodu prawniczego.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-red-500/20 mr-4">
                      <feature.icon className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <Badge 
                    className={`${
                      feature.level === 'Krytyczny' ? 'bg-red-500' :
                      feature.level === 'Wysoki' ? 'bg-orange-500' : 'bg-yellow-500'
                    } text-white`}
                  >
                    {feature.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-gray-300 text-sm flex items-start">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance Standards */}
        <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <UserCheck className="h-6 w-6 mr-3 text-green-400" />
              Standardy Zgodności
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceStandards.map((standard, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <FileCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{standard.name}</h4>
                    <p className="text-gray-400 text-sm">{standard.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warning about AI limitations */}
        <Card className="mt-8 bg-amber-900/20 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Ważne zastrzeżenia prawne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              LexiCore RAG jest narzędziem wspomagającym pracę prawników, ale nie zastępuje 
              profesjonalnej oceny prawnej. Wszystkie odpowiedzi generowane przez system 
              wymagają weryfikacji przez wykwalifikowanego prawnika przed użyciem w praktyce zawodowej.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SecuritySection;
