
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, FileText, Shield, Zap, Bot, Brain, Users, Globe, AlertTriangle, Database } from "lucide-react";
import { Link } from "react-router-dom";

const PrawoAsystent = () => {
  const features = [
    {
      icon: Bell,
      title: "Monitoring Zmian Prawnych",
      description: "Proaktywny system alertów o zmianach w prawie wpływających na Twoją kancelarię",
      route: "/legal-monitoring",
      status: "active",
      alerts: 3
    },
    {
      icon: FileText,
      title: "Analizator Umów",
      description: "Inteligentna analiza różnic między wersjami umów z rekomendacjami negocjacyjnymi",
      route: "/contract-analyzer",
      status: "active",
      alerts: 0
    },
    {
      icon: Database,
      title: "Baza Wiedzy RAG",
      description: "System RAG z Gemini Flash 2.0 do zarządzania dokumentami i zaawansowanych zapytań AI",
      route: "/knowledge-base",
      status: "active",
      alerts: 0
    },
    {
      icon: Bot,
      title: "Multimodalny Asystent",
      description: "Asystent AI obsługujący tekst, audio i dokumenty z pełną transkrypcją i analizą",
      route: "/multimodal-assistant",
      status: "coming-soon",
      alerts: 0
    }
  ];

  const stats = [
    { label: "Aktywne alerty", value: "7", change: "+3" },
    { label: "Przeanalizowane umowy", value: "24", change: "+12" },
    { label: "Dokumenty w RAG", value: "156", change: "+45" },
    { label: "Dokładność analiz", value: "97%", change: "+2%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">PrawoAsystent AI</h1>
                <p className="text-gray-400 text-sm">Inteligentny system wsparcia kancelarii prawnych</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500 text-white">
                System aktywny
              </Badge>
              <Button variant="outline" className="text-white border-white/20">
                Ustawienia
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {feature.alerts > 0 && (
                      <Badge className="bg-red-500 text-white">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {feature.alerts}
                      </Badge>
                    )}
                    <Badge className={feature.status === "active" ? "bg-green-500" : "bg-amber-500"}>
                      {feature.status === "active" ? "Aktywne" : "Wkrótce"}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                {feature.status === "active" ? (
                  <Link to={feature.route}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      Otwórz moduł
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Wkrótce dostępne
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Ostatnia Aktywność
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: "2 min temu",
                  action: "Nowy dokument w RAG",
                  description: "Dodano orzeczenie SN do bazy wiedzy - 156 nowych embeddings",
                  type: "update"
                },
                {
                  time: "5 min temu",
                  action: "Zapytanie RAG",
                  description: "Użytkownik zapytał o prawo budowlane - znaleziono 5 podobnych dokumentów",
                  type: "analysis"
                },
                {
                  time: "15 min temu",
                  action: "Zakończono analizę umowy",
                  description: "Umowa najmu - znaleziono 3 punkty do negocjacji",
                  type: "analysis"
                },
                {
                  time: "1 godz. temu",
                  action: "Nowy alert prawny",
                  description: "Wykryto zmianę w Prawie Budowlanym wpływającą na 5 dokumentów",
                  type: "alert"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === "alert" ? "bg-red-500/20" :
                    activity.type === "analysis" ? "bg-blue-500/20" : "bg-green-500/20"
                  }`}>
                    {activity.type === "alert" && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    {activity.type === "analysis" && <FileText className="h-4 w-4 text-blue-400" />}
                    {activity.type === "update" && <Database className="h-4 w-4 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">{activity.action}</h4>
                      <span className="text-gray-400 text-sm">{activity.time}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrawoAsystent;
