
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Code, Database, Search, Shield, Zap, CheckCircle, Users, Building2, Scale, Bot, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import APIShowcase from "@/components/APIShowcase";
import CodeGenerator from "@/components/CodeGenerator";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import AIHeroSection from "@/components/AIHeroSection";
import ModulesSection from "@/components/ModulesSection";
import SecuritySection from "@/components/SecuritySection";
import EnhancedChatBubble from "@/components/EnhancedChatBubble";
import AnimatedBackground from "@/components/AnimatedBackground";
import DynamicBanner from "@/components/DynamicBanner";
import GlassCard from "@/components/GlassCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated 3D Background */}
      <AnimatedBackground />
      
      <div className="relative z-10">
        <NavigationBar />
        <HeroSection />
        
        {/* Dynamic Banner */}
        <DynamicBanner />
        
        <StatsSection />
        <FeaturesSection />
        {/* <APIShowcase />
        <CodeGenerator /> */}
        
        {/* New AI Assistant Sections */}
        <AIHeroSection />
        <ModulesSection />
        <SecuritySection />
        
        {/* Enhanced Chat Bubble with RAG */}
        <EnhancedChatBubble />
        
        {/* Modern Footer with Glassmorphism */}
        <footer className="relative py-12">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard className="p-8" intensity="low">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg">
                      <Scale className="h-6 w-6 text-slate-900" />
                    </div>
                    <span className="text-xl font-bold text-white">LegalAPI</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Profesjonalny system API i AI dla nowoczesnych kancelarii prawniczych
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Produkt</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="hover:text-white transition-colors cursor-pointer">Dokumentacja API</li>
                    <li className="hover:text-white transition-colors cursor-pointer">SDK i Biblioteki</li>
                    <li className="hover:text-white transition-colors cursor-pointer">LexiCore RAG AI</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Generator Snippetów</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Wsparcie</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="hover:text-white transition-colors cursor-pointer">Centrum pomocy</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Dokumentacja</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Status API</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Kontakt</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Firma</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="hover:text-white transition-colors cursor-pointer">O nas</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Kariera</li>
                    <li className="hover:text-white transition-colors cursor-pointer">Polityka prywatności</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-gray-400 text-sm">
                © 2024 LegalAPI. Wszystkie prawa zastrzeżone. Powered by AI & Innovation.
              </div>
            </GlassCard>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
