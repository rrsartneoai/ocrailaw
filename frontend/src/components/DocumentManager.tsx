
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Upload, Trash2, Search, Download, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Document {
  document_name: string;
  file_size: number;
  file_type: string;
  created_at: string;
  chunk_count: number;
}

const DocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserDocuments();
    }
  }, [user]);

  const loadUserDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('gemini-rag', {
        body: {
          action: 'get_user_documents',
          userId: user.id
        }
      });

      if (error) throw error;

      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować dokumentów",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Błąd",
        description: "Obsługiwane są tylko pliki PDF",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Błąd",
        description: "Plik nie może być większy niż 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        try {
          const { data, error } = await supabase.functions.invoke('gemini-rag', {
            body: {
              action: 'store_document',
              content: content,
              userId: user.id,
              documentName: file.name,
              fileSize: file.size,
              fileType: file.type
            }
          });

          clearInterval(progressInterval);
          setUploadProgress(100);

          if (error) throw error;

          toast({
            title: "Sukces",
            description: `Dokument "${file.name}" został dodany do bazy wiedzy`,
          });

          // Reload documents
          await loadUserDocuments();
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      };

      reader.onerror = () => {
        clearInterval(progressInterval);
        throw new Error('Błąd odczytu pliku');
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać dokumentu do bazy wiedzy",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDeleteDocument = async (documentName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('gemini-rag', {
        body: {
          action: 'delete_document',
          content: documentName,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Sukces",
        description: `Dokument "${documentName}" został usunięty`,
      });

      // Reload documents
      await loadUserDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć dokumentu",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc =>
    doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Zaloguj się, aby zarządzać dokumentami</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zarządzanie Bazą Wiedzy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dodaj dokumenty PDF do bazy wiedzy
                </p>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="max-w-sm mx-auto"
                />
              </div>
              {uploading && (
                <div className="mt-4 max-w-sm mx-auto">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Przetwarzanie: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj dokumentów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Dokumenty w Bazie Wiedzy ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Ładowanie dokumentów...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nie znaleziono dokumentów' : 'Brak dokumentów w bazie wiedzy'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{doc.document_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{doc.chunk_count} fragmentów</span>
                        <span>•</span>
                        <span>{new Date(doc.created_at).toLocaleDateString('pl-PL')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {doc.file_type?.split('/')[1]?.toUpperCase() || 'PDF'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteDocument(doc.document_name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
