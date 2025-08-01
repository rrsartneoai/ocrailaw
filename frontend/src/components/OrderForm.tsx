
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, FileText, Clock, Zap, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "@/components/upload/DocumentUpload";

interface OrderFormProps {
  onBack: () => void;
}

const OrderForm = ({ onBack }: OrderFormProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [analysisType, setAnalysisType] = useState("standard");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    description: "",
    acceptTerms: false
  });
  const { toast } = useToast();

  const analysisOptions = [
    {
      id: "standard",
      name: "Analiza Standard",
      price: "89 zł",
      time: "24-48h",
      icon: <FileText className="h-5 w-5" />,
      features: ["Podstawowa analiza dokumentu", "Identyfikacja problemów prawnych", "Ogólne zalecenia"]
    },
    {
      id: "premium",
      name: "Analiza Premium",
      price: "149 zł",
      time: "12-24h",
      icon: <Star className="h-5 w-5" />,
      features: ["Szczegółowa analiza", "Konkretne pisma procesowe", "Konsultacja telefoniczna", "Priorytet realizacji"],
      popular: true
    },
    {
      id: "express",
      name: "Analiza Express",
      price: "199 zł",
      time: "2-6h",
      icon: <Zap className="h-5 w-5" />,
      features: ["Natychmiastowa analiza", "Gotowe pisma w ciągu 6h", "Bezpośredni kontakt z prawnikiem", "Najwyższy priorytet"]
    }
  ];

  const handleFilesUploaded = (files: any[]) => {
    setUploadedFiles(files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "Błąd",
        description: "Proszę wgrać co najmniej jeden dokument",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Błąd", 
        description: "Proszę zaakceptować regulamin",
        variant: "destructive",
      });
      return;
    }

    // Simulate order submission
    toast({
      title: "Zamówienie złożone!",
      description: "Twoje zamówienie zostało przyjęte. Wkrótce otrzymasz potwierdzenie na e-mail.",
    });
  };

  const selectedOption = analysisOptions.find(option => option.id === analysisType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Powrót do strony głównej
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Zamów analizę prawną
            </h1>
            <p className="text-xl text-gray-600">
              Wgraj swoje dokumenty i wybierz rodzaj analizy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <DocumentUpload
              onFilesUploaded={handleFilesUploaded}
              maxFiles={5}
              maxSize={10}
            />

            {/* Analysis Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Wybierz rodzaj analizy</CardTitle>
                <CardDescription>
                  Dostosuj analizę do swoich potrzeb i budżetu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={analysisType} onValueChange={setAnalysisType}>
                  <div className="grid md:grid-cols-3 gap-4">
                    {analysisOptions.map((option) => (
                      <div key={option.id} className="relative">
                        <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                        <Label 
                          htmlFor={option.id}
                          className={`block cursor-pointer border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                            analysisType === option.id 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          } ${option.popular ? 'ring-2 ring-yellow-400' : ''}`}
                        >
                          {option.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-medium">
                                Popularne
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {option.icon}
                              <span className="font-semibold ml-2">{option.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-blue-600">{option.price}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {option.time}
                              </div>
                            </div>
                          </div>
                          
                          <ul className="space-y-1 text-sm text-gray-600">
                            {option.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Dane kontaktowe</CardTitle>
                <CardDescription>
                  Potrzebujemy tych danych, aby przesłać Ci wyniki analizy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Adres e-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="twoj@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Dodatkowy opis sprawy (opcjonalnie)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Opisz swoją sytuację, oczekiwania lub zadaj pytania..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Podsumowanie zamówienia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedOption?.name}</h3>
                    <p className="text-sm text-blue-700">Czas realizacji: {selectedOption?.time}</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{selectedOption?.price}</div>
                </div>
                
                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                    }
                  />
                  <Label htmlFor="terms" className="text-sm text-blue-800">
                    Akceptuję{" "}
                    <a href="#" className="underline hover:text-blue-600">
                      regulamin świadczenia usług
                    </a>{" "}
                    oraz{" "}
                    <a href="#" className="underline hover:text-blue-600">
                      politykę prywatności
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg"
                >
                  Zamów i zapłać {selectedOption?.price}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
