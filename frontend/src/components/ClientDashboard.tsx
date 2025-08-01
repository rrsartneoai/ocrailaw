
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, MessageCircle, User, BarChart3, Upload, History } from "lucide-react";
import DocumentManager from "./DocumentManager";

interface UserStats {
  totalDocuments: number;
  totalQueries: number;
  totalSessions: number;
  lastActivity: string;
}

interface RecentActivity {
  id: string;
  type: 'document' | 'query' | 'session';
  title: string;
  timestamp: string;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStats>({
    totalDocuments: 0,
    totalQueries: 0,
    totalSessions: 0,
    lastActivity: 'Nigdy'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Pobranie statystyk dokumentów
      const { data: documents, error: docsError } = await supabase
        .from('embeddings')
        .select('document_name, created_at')
        .eq('user_id', user.id)
        .not('document_name', 'is', null);

      if (docsError) throw docsError;

      // Pobranie statystyk sesji RAG
      const { data: sessions, error: sessionsError } = await supabase
        .from('rag_sessions')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Pobranie wiadomości RAG
      const { data: messages, error: messagesError } = await supabase
        .from('rag_messages')
        .select('id, created_at, session_id')
        .in('session_id', sessions?.map(s => s.id) || [])
        .eq('role', 'user');

      if (messagesError) throw messagesError;

      // Unikalne dokumenty
      const uniqueDocuments = documents?.reduce((acc, doc) => {
        if (!acc.find(d => d.document_name === doc.document_name)) {
          acc.push(doc);
        }
        return acc;
      }, [] as typeof documents) || [];

      // Aktualizacja statystyk
      setStats({
        totalDocuments: uniqueDocuments.length,
        totalQueries: messages?.length || 0,
        totalSessions: sessions?.length || 0,
        lastActivity: sessions?.[0]?.updated_at ? 
          new Date(sessions[0].updated_at).toLocaleDateString('pl-PL') : 'Nigdy'
      });

      // Przygotowanie ostatniej aktywności
      const activities: RecentActivity[] = [];
      
      // Dodaj ostatnie dokumenty
      uniqueDocuments.slice(0, 3).forEach(doc => {
        activities.push({
          id: doc.document_name,
          type: 'document',
          title: `Dodano dokument: ${doc.document_name}`,
          timestamp: doc.created_at
        });
      });

      // Dodaj ostatnie sesje
      sessions?.slice(0, 3).forEach(session => {
        activities.push({
          id: session.id,
          type: 'session',
          title: `Sesja RAG: ${session.title}`,
          timestamp: session.created_at
        });
      });

      // Sortuj według daty
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych dashboardu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Musisz być zalogowany, aby wyświetlić panel klienta.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Panel Klienta</h1>
          <p className="text-gray-400">Witaj, {user.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Dokumenty</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalDocuments}</div>
              <p className="text-xs text-gray-400">w bazie wiedzy</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Zapytania</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalQueries}</div>
              <p className="text-xs text-gray-400">zadanych pytań</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Sesje RAG</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
              <p className="text-xs text-gray-400">rozmów z AI</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Ostatnia aktywność</CardTitle>
              <History className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-white">{stats.lastActivity}</div>
              <p className="text-xs text-gray-400">ostatnie użycie</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              Przegląd
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-slate-700">
              Dokumenty
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-slate-700">
              Historia RAG
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Ostatnia aktywność</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-400 text-center py-4">Ładowanie...</p>
                  ) : recentActivity.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Brak aktywności</p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
                          {activity.type === 'document' && <FileText className="h-4 w-4 text-blue-400" />}
                          {activity.type === 'session' && <MessageCircle className="h-4 w-4 text-green-400" />}
                          {activity.type === 'query' && <BarChart3 className="h-4 w-4 text-purple-400" />}
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.title}</p>
                            <p className="text-gray-400 text-xs">
                              {new Date(activity.timestamp).toLocaleDateString('pl-PL', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Szybkie akcje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = '/knowledge-base'}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Dodaj nowy dokument
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.location.href = '/prawo-asystent'}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Rozpocznij rozmowę RAG
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-600 text-white hover:bg-slate-700"
                    onClick={loadDashboardData}
                  >
                    Odśwież dane
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManager />
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Historia sesji RAG</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  Funkcjonalność historii sesji RAG zostanie wkrótce dodana.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
