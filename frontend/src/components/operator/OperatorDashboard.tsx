
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Download,
  MessageSquare
} from 'lucide-react';

interface Case {
  id: string;
  client_email: string;
  document_name: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  assigned_operator?: string;
  analysis_type: string;
  description?: string;
}

const OperatorDashboard = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      // W rzeczywistości to byłaby tabela "cases" lub podobna
      // Na razie symulujemy dane
      const mockCases: Case[] = [
        {
          id: '1',
          client_email: 'klient@example.com',
          document_name: 'pismo_komornika.pdf',
          status: 'pending',
          priority: 'high',
          created_at: new Date().toISOString(),
          analysis_type: 'premium',
          description: 'Pismo od komornika w sprawie długu 5000 zł'
        },
        {
          id: '2',
          client_email: 'jan@kowalski.pl',
          document_name: 'wezwanie_do_zaplaty.jpg',
          status: 'in_progress',
          priority: 'medium',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          assigned_operator: 'operator1',
          analysis_type: 'standard',
          description: 'Wezwanie do zapłaty za usługi prawne'
        }
      ];
      
      setCases(mockCases);
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać spraw",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignCase = async (caseId: string) => {
    try {
      // Logika przypisania sprawy do operatora
      setCases(prev => prev.map(c => 
        c.id === caseId 
          ? { ...c, status: 'in_progress' as const, assigned_operator: 'current_operator' }
          : c
      ));
      
      toast({
        title: "Sprawa przypisana",
        description: "Sprawa została przypisana do Ciebie",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się przypisać sprawy",
        variant: "destructive",
      });
    }
  };

  const completeCase = async (caseId: string) => {
    try {
      setCases(prev => prev.map(c => 
        c.id === caseId 
          ? { ...c, status: 'completed' as const }
          : c
      ));
      
      toast({
        title: "Sprawa zakończona",
        description: "Analiza została oznaczona jako zakończona",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zakończyć sprawy",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Oczekuje';
      case 'in_progress': return 'W toku';
      case 'completed': return 'Zakończone';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Ładowanie...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Panel Operatora</h1>
        <p className="text-gray-600">Zarządzaj sprawami i analizami prawniczymi</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Oczekujące ({cases.filter(c => c.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="in_progress">W toku ({cases.filter(c => c.status === 'in_progress').length})</TabsTrigger>
          <TabsTrigger value="completed">Zakończone ({cases.filter(c => c.status === 'completed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {cases.filter(c => c.status === 'pending').map((case_) => (
            <Card key={case_.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {case_.document_name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(case_.priority)}>
                      {case_.priority === 'high' ? 'Wysoki' : case_.priority === 'medium' ? 'Średni' : 'Niski'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(case_.status)}
                      {getStatusText(case_.status)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {case_.client_email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(case_.created_at).toLocaleDateString('pl-PL')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Typ analizy:</strong> {case_.analysis_type}
                  </div>
                  {case_.description && (
                    <div>
                      <strong>Opis:</strong> {case_.description}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => assignCase(case_.id)} size="sm">
                      Przypisz do mnie
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Pobierz dokument
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {cases.filter(c => c.status === 'in_progress').map((case_) => (
            <Card key={case_.id} className="border-blue-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {case_.document_name}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(case_.status)}
                    {getStatusText(case_.status)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {case_.client_email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(case_.created_at).toLocaleDateString('pl-PL')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Typ analizy:</strong> {case_.analysis_type}
                  </div>
                  {case_.description && (
                    <div>
                      <strong>Opis:</strong> {case_.description}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => completeCase(case_.id)} size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Oznacz jako wykonane
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Komunikacja z klientem
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Pobierz dokument
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {cases.filter(c => c.status === 'completed').map((case_) => (
            <Card key={case_.id} className="border-green-200 hover:shadow-md transition-shadow opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {case_.document_name}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(case_.status)}
                    {getStatusText(case_.status)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {case_.client_email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(case_.created_at).toLocaleDateString('pl-PL')}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OperatorDashboard;
