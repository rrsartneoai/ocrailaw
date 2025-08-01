
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    loadDocuments();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('embeddings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować dokumentów",
        variant: "destructive"
      });
    }
  };

  const addDocument = async () => {
    if (!newDocument.trim() || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-rag', {
        body: {
          action: 'store_document',
          content: newDocument,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Dokument został dodany do bazy wiedzy"
      });

      setNewDocument('');
      loadDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać dokumentu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('embeddings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sukces",
        description: "Dokument został usunięty"
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć dokumentu",
        variant: "destructive"
      });
    }
  };

  const searchDocuments = async () => {
    if (!searchQuery.trim() || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-rag', {
        body: {
          action: 'rag_query',
          query: searchQuery,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Wyniki wyszukiwania",
        description: `Znaleziono ${data.sources?.length || 0} podobnych dokumentów`
      });

      console.log('Search results:', data);
    } catch (error) {
      console.error('Error searching documents:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przeszukać dokumentów",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">Musisz być zalogowany, aby zarządzać bazą wiedzy.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Baza Wiedzy RAG</h1>
        <p className="text-gray-400">Zarządzaj dokumentami dla systemu AI z Gemini Flash 2.0</p>
      </div>

      {/* Add New Document */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Dodaj Nowy Dokument
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newDocument}
            onChange={(e) => setNewDocument(e.target.value)}
            placeholder="Wklej treść dokumentu, artykułu prawnego, orzeczenia lub innych materiałów..."
            className="min-h-[200px] bg-slate-700 border-slate-600 text-white"
          />
          <Button 
            onClick={addDocument}
            disabled={isLoading || !newDocument.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isLoading ? 'Dodawanie...' : 'Dodaj do Bazy Wiedzy'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Search Documents */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Przeszukaj Bazę Wiedzy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zadaj pytanie lub wpisz zapytanie..."
              className="flex-1 bg-slate-700 border-slate-600 text-white"
            />
            <Button 
              onClick={searchDocuments}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Dokumenty w Bazie ({documents.length})
            </div>
            <Badge className="bg-blue-500">{documents.length} dokumentów</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Brak dokumentów w bazie wiedzy. Dodaj pierwszy dokument powyżej.
              </p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm mb-2">
                        {doc.content.substring(0, 200)}
                        {doc.content.length > 200 && '...'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Badge variant="outline" className="text-xs">
                          {doc.source_type}
                        </Badge>
                        <span>
                          {new Date(doc.created_at).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteDocument(doc.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
