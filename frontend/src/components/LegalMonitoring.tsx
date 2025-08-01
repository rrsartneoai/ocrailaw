
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertTriangle, CheckCircle, Clock, FileText, Search, Shield, Eye } from "lucide-react";

const LegalMonitoring = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Nowelizacja Prawa Budowlanego",
      date: "2024-07-20",
      status: "NEW",
      riskLevel: "HIGH",
      affectedSnippets: 5,
      summary: "Wprowadzono nowe wymogi dotyczące pozwoleń na budowę dla obiektów powyżej 500m²",
      category: "Prawo Budowlane"
    },
    {
      id: 2,
      title: "Zmiany w Kodeksie Pracy - telepracownik",
      date: "2024-07-18",
      status: "VIEWED",
      riskLevel: "MEDIUM",
      affectedSnippets: 12,
      summary: "Rozszerzono definicję telepracownika i wprowadzono nowe regulacje dotyczące pracy zdalnej",
      category: "Prawo Pracy"
    },
    {
      id: 3,
      title: "Ustawa o ochronie danych osobowych - poprawka",
      date: "2024-07-15",
      status: "ARCHIVED",
      riskLevel: "LOW",
      affectedSnippets: 2,
      summary: "Drobne korekty w zakresie procedur zgłaszania naruszeń",
      category: "RODO"
    }
  ]);

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "HIGH": return "bg-red-500";
      case "MEDIUM": return "bg-amber-500";
      case "LOW": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW": return <Bell className="h-4 w-4" />;
      case "VIEWED": return <Eye className="h-4 w-4" />;
      case "ARCHIVED": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const newAlertsCount = alerts.filter(alert => alert.status === "NEW").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Monitoring Zmian Prawnych
              </h1>
              <p className="text-gray-400 text-lg">
                Proaktywny system alertów o zmianach w prawie wpływających na Twoją kancelarię
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500 text-white px-4 py-2">
                <Bell className="h-4 w-4 mr-2" />
                {newAlertsCount} nowych alertów
              </Badge>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Search className="h-4 w-4 mr-2" />
                Konfiguruj źródła
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="alerts">Aktywne Alerty</TabsTrigger>
            <TabsTrigger value="sources">Źródła Monitoringu</TabsTrigger>
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      {getStatusIcon(alert.status)}
                      <span className="ml-2">{alert.title}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getRiskBadgeColor(alert.riskLevel)} text-white`}>
                        {alert.riskLevel === "HIGH" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {alert.riskLevel}
                      </Badge>
                      <Badge variant="outline" className="text-gray-400">
                        {alert.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{alert.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{alert.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      <FileText className="h-4 w-4 mr-1" />
                      <span className="text-sm">{alert.affectedSnippets} potencjalnie dotkniętych snippetów</span>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Zobacz szczegóły
                      </Button>
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                        Przejrzyj snippety
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Konfiguracja Źródeł</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Dziennik Ustaw RP", status: "active", lastUpdate: "2024-07-20 14:30" },
                    { name: "Orzecznictwo NSA", status: "active", lastUpdate: "2024-07-20 12:15" },
                    { name: "Komunikaty Ministerstwa Sprawiedliwości", status: "active", lastUpdate: "2024-07-20 09:45" },
                    { name: "Uchwały SN", status: "inactive", lastUpdate: "2024-07-19 16:20" }
                  ].map((source, index) => (
                    <Card key={index} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{source.name}</h4>
                          <Badge className={source.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                            {source.status === "active" ? "Aktywne" : "Nieaktywne"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">Ostatnia aktualizacja: {source.lastUpdate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Ustawienia Monitoringu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Częstotliwość sprawdzania</h4>
                    <p className="text-sm text-gray-400">Jak często system ma sprawdzać nowe zmiany</p>
                  </div>
                  <select className="bg-slate-600 text-white rounded px-3 py-2">
                    <option>Co 6 godzin</option>
                    <option>Co 12 godzin</option>
                    <option>Codziennie</option>
                    <option>Co 3 dni</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Próg ważności alertu</h4>
                    <p className="text-sm text-gray-400">Minimalna ważność zmian do zgłaszania</p>
                  </div>
                  <select className="bg-slate-600 text-white rounded px-3 py-2">
                    <option>Wszystkie zmiany</option>
                    <option>Średnie i wysokie</option>
                    <option>Tylko wysokie</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LegalMonitoring;
