
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Play, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const APIShowcase = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const apiExamples = {
    get: {
      method: "GET",
      endpoint: "/api/v1/law-firms/123",
      description: "Pobierz kancelarię po ID",
      response: `{
  "data": {
    "type": "law-firms",
    "id": "123",
    "attributes": {
      "name": "Kowalski & Associates",
      "tax_number": "1234567890",
      "city": "Warszawa",
      "specializations": ["corporate", "tax"],
      "lawyers_count": 12
    },
    "relationships": {
      "lawyers": {
        "data": [
          {"type": "lawyers", "id": "456"}
        ]
      }
    }
  },
  "included": [
    {
      "type": "lawyers",
      "id": "456",
      "attributes": {
        "full_name": "Jan Kowalski",
        "specializations": ["corporate"]
      }
    }
  ]
}`
    },
    search: {
      method: "GET",
      endpoint: "/api/v1/law-firms?q=warszawa&specialization=corporate",
      description: "Wyszukaj kancelarie",
      response: `{
  "data": [
    {
      "type": "law-firms",
      "id": "123",
      "attributes": {
        "name": "Kowalski & Associates",
        "city": "Warszawa",
        "rating": 4.8
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  },
  "links": {
    "self": "/api/v1/law-firms?page=1",
    "next": "/api/v1/law-firms?page=2"
  }
}`
    },
    create: {
      method: "POST",
      endpoint: "/api/v1/law-firms",
      description: "Utwórz nową kancelarię",
      response: `{
  "data": {
    "type": "law-firms",
    "id": "789",
    "attributes": {
      "name": "Nowa Kancelaria Sp. z o.o.",
      "tax_number": "9876543210",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "meta": {
    "created_at": "2024-01-15T10:30:00Z"
  }
}`
    }
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    toast.success("Kod skopiowany do schowka!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="api" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            API w akcji
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Zobacz jak proste jest korzystanie z naszego API. 
            Standardowe endpointy RESTful z pełną dokumentacją JSON:API.
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Przykłady API</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="get" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
                <TabsTrigger value="get" className="data-[state=active]:bg-blue-500">
                  GET Request
                </TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-green-500">
                  Search
                </TabsTrigger>
                <TabsTrigger value="create" className="data-[state=active]:bg-amber-500">
                  POST Create
                </TabsTrigger>
              </TabsList>

              {Object.entries(apiExamples).map(([key, example]) => (
                <TabsContent key={key} value={key} className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-sm ${
                          example.method === 'GET' ? 'text-blue-400 border-blue-400' :
                          example.method === 'POST' ? 'text-green-400 border-green-400' :
                          'text-amber-400 border-amber-400'
                        }`}
                      >
                        {example.method}
                      </Badge>
                      <code className="text-gray-300 font-mono bg-slate-700 px-3 py-1 rounded">
                        {example.endpoint}
                      </code>
                    </div>
                    
                    <p className="text-gray-400">{example.description}</p>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Odpowiedź JSON:</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(example.response, key)}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === key ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
                        <code className="text-gray-300">{example.response}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default APIShowcase;
