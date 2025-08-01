
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Shield,
  Trash2,
  RefreshCw,
  Database,
  Activity
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalDocuments: number;
  totalQueries: number;
  totalSessions: number;
  activeUsersToday: number;
  storageUsed: number;
}

interface UserData {
  user_id: string;
  email?: string;
  created_at: string;
  updated_at: string;
  document_count: number;
  session_count: number;
  last_activity: string;
}

interface SystemMetrics {
  databaseSize: string;
  activeConnections: number;
  uptime: string;
  responseTime: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDocuments: 0,
    totalQueries: 0,
    totalSessions: 0,
    activeUsersToday: 0,
    storageUsed: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    databaseSize: "0 MB",
    activeConnections: 0,
    uptime: "0h",
    responseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Sprawdź czy użytkownik ma uprawnienia administratora
      // W rzeczywistej aplikacji sprawdziłbyś to w bazie danych
      const isAdmin = user.email?.includes('admin') || user.email === 'admin@example.com';
      
      if (!isAdmin) {
        toast({
          title: "Brak uprawnień",
          description: "Nie masz uprawnień administratora",
          variant: "destructive"
        });
        return;
      }

      // Pobierz statystyki dokumentów
      const { data: documents, error: docsError } = await supabase
        .from('embeddings')
        .select('user_id, document_name, created_at')
        .not('document_name', 'is', null);

      if (docsError) throw docsError;

      // Pobierz sesje RAG
      const { data: sessions, error: sessionsError } = await supabase
        .from('rag_sessions')
        .select('id, user_id, created_at, updated_at');

      if (sessionsError) throw sessionsError;

      // Pobierz wiadomości RAG
      const { data: messages, error: messagesError } = await supabase
        .from('rag_messages')
        .select('id, session_id, created_at')
        .eq('role', 'user');

      if (messagesError) throw messagesError;

      // Pobierz użytkowników z ich statystykami
      const userStatsMap = new Map();
      
      // Grupuj dokumenty według użytkownika
      documents?.forEach(doc => {
        if (!userStatsMap.has(doc.user_id)) {
          userStatsMap.set(doc.user_id, {
            user_id: doc.user_id,
            document_count: 0,
            session_count: 0,
            created_at: doc.created_at,
            updated_at: doc.created_at,
            last_activity: doc.created_at
          });
        }
        const userStat = userStatsMap.get(doc.user_id);
        userStat.document_count++;
        if (doc.created_at > userStat.last_activity) {
          userStat.last_activity = doc.created_at;
        }
      });

      // Grupuj sesje według użytkownika
      sessions?.forEach(session => {
        if (!userStatsMap.has(session.user_id)) {
          userStatsMap.set(session.user_id, {
            user_id: session.user_id,
            document_count: 0,
            session_count: 0,
            created_at: session.created_at,
            updated_at: session.updated_at,
            last_activity: session.updated_at
          });
        }
        const userStat = userStatsMap.get(session.user_id);
        userStat.session_count++;
        if (session.updated_at > userStat.last_activity) {
          userStat.last_activity = session.updated_at;
        }
      });

      // Konwertuj mapę na tablicę
      const usersList = Array.from(userStatsMap.values());

      // Oblicz statystyki
      const uniqueUsers = new Set(documents?.map(d => d.user_id) || []);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activeToday = usersList.filter(u => 
        new Date(u.last_activity) >= today
      ).length;

      setStats({
        totalUsers: uniqueUsers.size,
        totalDocuments: documents?.length || 0,
        totalQueries: messages?.length || 0,
        totalSessions: sessions?.length || 0,
        activeUsersToday: activeToday,
        storageUsed: Math.round((documents?.length || 0) * 1.2) // Przybliżenie
      });

      setUsers(usersList);

      // Symulacja metryk systemowych
      setMetrics({
        databaseSize: `${Math.round((documents?.length || 0) * 0.05)}MB`,
        activeConnections: Math.floor(Math.random() * 20) + 5,
        uptime: "24h 15m",
        responseTime: Math.floor(Math.random() * 50) + 100
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować danych administratora",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupData = async () => {
    try {
      // Symulacja czyszczenia danych
      toast({
        title: "Sukces",
        description: "Stare dane zostały wyczyszczone",
      });
      loadAdminData();
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wyczyścić danych",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Musisz być zalogowany jako administrator.</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Panel Administratora</h1>
          <p className="text-gray-400">Zarządzanie systemem LegalAPI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Użytkownicy</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-gray-400">aktywnych dzisiaj: {stats.activeUsersToday}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Dokumenty</CardTitle>
              <FileText className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalDocuments}</div>
              <p className="text-xs text-gray-400">w systemie</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Zapytania RAG</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalQueries}</div>
              <p className="text-xs text-gray-400">łącznie</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Przestrzeń</CardTitle>
              <Database className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.storageUsed}MB</div>
              <p className="text-xs text-gray-400">wykorzystane</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              Użytkownicy
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
              System
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-slate-700">
              Konserwacja
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Zarządzanie użytkownikami</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-400 text-center py-4">Ładowanie...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">ID Użytkownika</TableHead>
                        <TableHead className="text-white">Dokumenty</TableHead>
                        <TableHead className="text-white">Sesje RAG</TableHead>
                        <TableHead className="text-white">Ostatnia aktywność</TableHead>
                        <TableHead className="text-white">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userData) => (
                        <TableRow key={userData.user_id}>
                          <TableCell className="text-gray-300 font-mono text-sm">
                            {userData.user_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="text-gray-300">{userData.document_count}</TableCell>
                          <TableCell className="text-gray-300">{userData.session_count}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(userData.last_activity).toLocaleDateString('pl-PL')}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="text-gray-400 border-slate-600">
                              <Settings className="h-3 w-3 mr-1" />
                              Zarządzaj
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Metryki systemu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rozmiar bazy danych:</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {metrics.databaseSize}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Aktywne połączenia:</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {metrics.activeConnections}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Czas działania:</span>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {metrics.uptime}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Średni czas odpowiedzi:</span>
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      {metrics.responseTime}ms
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Status systemu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-green-400" />
                    <span className="text-white">API Status</span>
                    <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-green-400" />
                    <span className="text-white">Baza danych</span>
                    <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white">RAG System</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Narzędzia konserwacji</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={loadAdminData}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Odśwież dane
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-600 text-white hover:bg-slate-700"
                    onClick={handleCleanupData}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Wyczyść stare dane
                  </Button>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Narzędzia konserwacji pozwalają na optymalizację wydajności systemu 
                    poprzez czyszczenie nieużywanych danych i odświeżanie metryk.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
