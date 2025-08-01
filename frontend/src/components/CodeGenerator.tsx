
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CodeGenerator = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const codeExamples = {
    python: {
      name: "Python",
      install: "pip install law-firm-api-client",
      code: `from law_firm_api import LawFirmAPIClient

# Inicjalizacja klienta
client = LawFirmAPIClient(
    api_key="your-api-key",
    base_url="https://api.lawfirms.com"
)

# Wyszukiwanie kancelarii
async def search_law_firms():
    results = await client.search_law_firms(
        query="warszawa",
        specializations=["corporate", "tax"],
        page=1,
        per_page=20
    )
    
    for firm in results['data']:
        print(f"Kancelaria: {firm['attributes']['name']}")
        print(f"Miasto: {firm['attributes']['city']}")
        
# Pobieranie szczegółów kancelarii
async def get_law_firm_details(firm_id):
    firm = await client.get_law_firm(firm_id)
    
    return {
        'name': firm['data']['attributes']['name'],
        'lawyers': firm['included'],
        'specializations': firm['data']['attributes']['specializations']
    }

# Tworzenie nowej kancelarii
async def create_law_firm():
    new_firm = await client.create_law_firm({
        "name": "Nowa Kancelaria Sp. z o.o.",
        "tax_number": "1234567890",
        "address": {
            "street": "ul. Prawnicza 123",
            "city": "Warszawa",
            "postal_code": "00-001"
        },
        "contact": {
            "email": "kontakt@kancelaria.pl",
            "phone": "+48123456789"
        }
    })
    
    return new_firm['data']['id']`
    },
    javascript: {
      name: "JavaScript/Node.js",
      install: "npm install @lawfirm/api-client",
      code: `import { LawFirmAPIClient } from '@lawfirm/api-client';

// Inicjalizacja klienta
const client = new LawFirmAPIClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.lawfirms.com'
});

// Wyszukiwanie kancelarii
async function searchLawFirms() {
  try {
    const results = await client.searchLawFirms({
      query: 'warszawa',
      specializations: ['corporate', 'tax'],
      page: 1,
      perPage: 20
    });
    
    results.data.forEach(firm => {
      console.log(\`Kancelaria: \${firm.attributes.name}\`);
      console.log(\`Miasto: \${firm.attributes.city}\`);
    });
    
    return results;
  } catch (error) {
    console.error('Error searching law firms:', error);
    throw error;
  }
}

// Pobieranie szczegółów kancelarii
async function getLawFirmDetails(firmId) {
  try {
    const response = await client.getLawFirm(firmId);
    
    return {
      name: response.data.attributes.name,
      lawyers: response.included || [],
      specializations: response.data.attributes.specializations
    };
  } catch (error) {
    console.error('Error fetching law firm:', error);
    throw error;
  }
}

// Tworzenie nowej kancelarii
async function createLawFirm(firmData) {
  try {
    const newFirm = await client.createLawFirm({
      name: "Nowa Kancelaria Sp. z o.o.",
      taxNumber: "1234567890",
      address: {
        street: "ul. Prawnicza 123",
        city: "Warszawa",
        postalCode: "00-001"
      },
      contact: {
        email: "kontakt@kancelaria.pl",
        phone: "+48123456789"
      }
    });
    
    return newFirm.data.id;
  } catch (error) {
    console.error('Error creating law firm:', error);
    throw error;
  }
}`
    },
    curl: {
      name: "cURL",
      install: "Dostępne natychmiast w terminalu",
      code: `# Pobieranie listy kancelarii
curl -X GET "https://api.lawfirms.com/api/v1/law-firms?q=warszawa&specializations=corporate" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Accept: application/vnd.api+json"

# Pobieranie szczegółów kancelarii
curl -X GET "https://api.lawfirms.com/api/v1/law-firms/123" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Accept: application/vnd.api+json"

# Tworzenie nowej kancelarii
curl -X POST "https://api.lawfirms.com/api/v1/law-firms" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/vnd.api+json" \\
  -H "Accept: application/vnd.api+json" \\
  -d '{
    "name": "Nowa Kancelaria Sp. z o.o.",
    "tax_number": "1234567890",
    "address": {
      "street": "ul. Prawnicza 123",
      "city": "Warszawa",
      "postal_code": "00-001",
      "country": "PL"
    },
    "contact": {
      "email": "kontakt@kancelaria.pl",
      "phone": "+48123456789",
      "website": "https://kancelaria.pl"
    },
    "specialization_ids": []
  }'

# Wyszukiwanie z filtrami
curl -X GET "https://api.lawfirms.com/api/v1/law-firms" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Accept: application/vnd.api+json" \\
  -G \\
  -d "q=prawo korporacyjne" \\
  -d "city=Warszawa" \\
  -d "specializations=corporate" \\
  -d "specializations=tax" \\
  -d "page=1" \\
  -d "per_page=20" \\
  -d "sort=name" \\
  -d "order=asc"`
    }
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    toast.success("Kod skopiowany do schowka!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="generator" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Generator kodu SDK
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Gotowe do użycia przykłady kodu dla wszystkich popularnych języków programowania.
            Wybierz swój ulubiony język i rozpocznij integrację w kilka minut.
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 max-w-6xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-2xl">Przykłady SDK</CardTitle>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(codeExamples).map(([key, example]) => (
                    <SelectItem key={key} value={key}>
                      {example.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-semibold mb-1">Instalacja</h4>
                  <code className="text-gray-300 text-sm">
                    {codeExamples[selectedLanguage].install}
                  </code>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage].install, 'install')}
                  className="border-slate-600 text-gray-400 hover:text-white"
                >
                  {copiedCode === 'install' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Przykład użycia</h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(codeExamples[selectedLanguage].code, 'code')}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'code' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Kopiuj
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Pobierz
                    </Button>
                  </div>
                </div>
                <pre className="bg-slate-900 p-6 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                  <code className="text-gray-300">
                    {codeExamples[selectedLanguage].code}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CodeGenerator;
