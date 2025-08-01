
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Search, Shield, Code, Zap, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Database,
      title: "Domain-Driven Design",
      description: "Architektura oparta na domenie biznesowej z agregratami, encjami i obiektami wartości",
      color: "text-blue-400"
    },
    {
      icon: Search,
      title: "Zaawansowane wyszukiwanie",
      description: "Full-text search z Elasticsearch, filtrowanie i paginacja",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Bezpieczeństwo",
      description: "OAuth 2.0, JWT tokens, szyfrowanie danych i audyt bezpieczeństwa",
      color: "text-red-400"
    },
    {
      icon: Code,
      title: "RESTful API",
      description: "Zgodność z JSON:API, HATEOAS, versionowanie i dokumentacja OpenAPI",
      color: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Wysoka wydajność",
      description: "Cachowanie Redis, optymalizacja zapytań i horizontal scaling",
      color: "text-amber-400"
    },
    {
      icon: Users,
      title: "Multi-tenant",
      description: "Obsługa wielu kancelarii z izolacją danych i konfiguracji",
      color: "text-cyan-400"
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Zaawansowane funkcjonalności
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            System zbudowany z myślą o profesjonalnych kancelariach prawniczych,
            oferujący enterprise-grade funkcjonalności i niezawodność.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/50 mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
