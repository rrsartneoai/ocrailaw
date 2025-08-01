
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import KnowledgeBase from '@/components/KnowledgeBase';

const KnowledgeBasePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/prawo-asystent">
              <Button variant="outline" className="text-white border-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Powrót do PrawoAsystent
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Baza Wiedzy RAG</h1>
              <p className="text-gray-400 text-sm">Powered by Gemini Flash 2.0</p>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <KnowledgeBase />
    </div>
  );
};

export default KnowledgeBasePage;
