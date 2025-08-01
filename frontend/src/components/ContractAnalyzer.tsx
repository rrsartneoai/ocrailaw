
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, AlertTriangle, CheckCircle, Copy, Download, Zap } from "lucide-react";

const ContractAnalyzer = () => {
  const [originalContract, setOriginalContract] = useState("");
  const [revisedContract, setRevisedContract] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockAnalysisResult = [
    {
      location: "Paragraf 3.2 - Terminy płatności",
      summary: "Zmieniono termin płatności z 30 dni na 45 dni",
      risk_level: "MEDIUM",
      recommendation: "Zaproponuj kontrpropozycję",
      counter_proposal: "Zaproponować kompromis: 35 dni z upustem 2% za wcześniejszą płatność"
    },
    {
      location: "Paragraf 7.1 - Odpowiedzialność",
      summary: "Dodano klauzulę ograniczającą odpowiedzialność wykonawcy do 50% wartości umowy",
      risk_level: "HIGH",
      recommendation: "Odrzuć i przywróć oryginał",
      counter_proposal: "Odpowiedzialność nie może być ograniczona poniżej 100% wartości umowy"
    },
    {
      location: "Paragraf 4.3 - Warunki dostawy",
      summary: "Dodano możliwość dostawy częściowej bez zgody zamawiającego",
      risk_level: "HIGH",
      recommendation: "Wymaga dalszej dyskusji",
      counter_proposal: "Dostawa częściowa możliwa tylko za pisemną zgodą zamawiającego"
    },
    {
      location: "Paragraf 2.1 - Opis przedmiotu",
      summary: "Doprecyzowano specyfikację techniczną produktu",
      risk_level: "LOW",
      recommendation: "Zaakceptuj",
      counter_proposal: null
    }
  ];

  const handleAnalyzeContracts = async () => {
    if (!originalContract.trim() || !revisedContract.trim()) {
      alert("Proszę wypełnić oba pola z tekstami umów");
      return;
    }

    setIsAnalyzing(true);
    
    // Symulacja wywołania API
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH": return "bg-red-500";
      case "MEDIUM": return "bg-amber-500";
      case "LOW": return "bg-green-500";
      case "CRITICAL": return "bg-red-700";
      default: return "bg-gray-500";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "HIGH":
      case "CRITICAL":
        return <AlertTriangle className="h-4 w-4" />;
      case "LOW":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Można dodać toast notification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Analizator Umów i Negocjacji
          </h1>
          <p className="text-gray-400 text-lg">
            Inteligentna analiza różnic między wersjami umów z rekomendacjami negocjacyjnymi
          </p>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="analyze">Analiza Umów</TabsTrigger>
            <TabsTrigger value="history">Historia Analiz</TabsTrigger>
            <TabsTrigger value="templates">Szablony</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Wersja Oryginalna (Wzorzec)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF/DOCX
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Z biblioteki
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Wklej tutaj tekst oryginalnej umowy..."
                      value={originalContract}
                      onChange={(e) => setOriginalContract(e.target.value)}
                      className="min-h-[400px] bg-slate-700/50 border-slate-600 text-gray-100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Wersja Klienta (Do Analizy)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF/DOCX
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Wklej tutaj tekst zmienionej umowy od klienta..."
                      value={revisedContract}
                      onChange={(e) => setRevisedContract(e.target.value)}
                      className="min-h-[400px] bg-slate-700/50 border-slate-600 text-gray-100"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={handleAnalyzeContracts}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-5 w-5 mr-2 animate-spin" />
                    Analizuję różnice...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Generuj Raport Różnic
                  </>
                )}
              </Button>
            </div>

            {analysisResult && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Raport Analizy Różnic</CardTitle>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Eksport PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Kopiuj raport
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.map((change, index) => (
                      <Card key={index} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-1">{change.location}</h4>
                              <p className="text-gray-300 text-sm mb-2">{change.summary}</p>
                            </div>
                            <Badge className={`${getRiskBadgeColor(change.risk_level)} text-white ml-4`}>
                              {getRiskIcon(change.risk_level)}
                              <span className="ml-1">{change.risk_level}</span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Label className="text-gray-400 text-xs">REKOMENDACJA:</Label>
                              <p className="text-white font-medium">{change.recommendation}</p>
                              
                              {change.counter_proposal && (
                                <div className="mt-2 p-3 bg-blue-900/30 rounded border-l-4 border-blue-500">
                                  <Label className="text-blue-400 text-xs">KONTRPROPOZYCJA:</Label>
                                  <p className="text-gray-200 text-sm mt-1">{change.counter_proposal}</p>
                                </div>
                              )}
                            </div>
                            
                            {change.counter_proposal && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(change.counter_proposal)}
                                className="ml-4"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Historia Analiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Brak przeprowadzonych analiz</p>
                  <p className="text-sm">Twoje przyszłe analizy umów będą tutaj zapisywane</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Szablony Umów</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Funkcja w przygotowaniu</p>
                  <p className="text-sm">Wkrótce będziesz mógł zapisywać i używać szablonów umów</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContractAnalyzer;
