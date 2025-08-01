
import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "./AuthDialog";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  sources: Array<{
    content: string;
    similarity: number;
    document_name: string;
    chunk_index: number;
  }>;
}

const EnhancedChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Witaj! Jestem LexiCore RAG z Gemini Flash 2.0 - Twoim zaawansowanym asystentem prawnym AI. Mam dostęp do bazy wiedzy kancelarii i mogę odpowiadać na pytania na podstawie Twoich dokumentów. Jak mogę Ci pomóc?",
      sender: "bot",
      timestamp: new Date(),
      sources: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !currentSessionId) {
      createNewSession();
    }
  }, [user]);

  const createNewSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('gemini-rag', {
        body: {
          action: 'create_session',
          userId: user.id,
          content: 'Nowa sesja RAG'
        }
      });

      if (error) throw error;
      setCurrentSessionId(data.session_id);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!user) {
      toast({
        title: "Wymagane logowanie",
        description: "Musisz być zalogowany, aby korzystać z asystenta RAG",
        variant: "destructive"
      });
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      sources: []
    };

    setMessages(prev => [...prev, newMessage]);
    const currentQuery = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-rag', {
        body: {
          action: 'rag_query',
          query: currentQuery,
          userId: user.id,
          sessionId: currentSessionId
        }
      });

      if (error) throw error;

      const botResponse: Message = {
        id: messages.length + 2,
        text: data.response || "Przepraszam, nie mogłem wygenerować odpowiedzi.",
        sender: "bot",
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, botResponse]);

      // Show quality indicator
      if (data.query_context?.best_similarity) {
        const similarity = Math.round(data.query_context.best_similarity * 100);
        toast({
          title: "Odpowiedź wygenerowana",
          description: `Najlepsze dopasowanie: ${similarity}% (${data.query_context.documents_searched} dokumentów przeszukanych)`,
        });
      }
    } catch (error) {
      console.error('RAG query error:', error);
      
      const fallbackResponse: Message = {
        id: messages.length + 2,
        text: "Przepraszam, wystąpił problem z systemem RAG. Spróbuj ponownie później.",
        sender: "bot",
        timestamp: new Date(),
        sources: []
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Błąd systemu AI",
        description: "Nie udało się połączyć z systemem RAG",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    setIsOpen(false);
  };

  const handleAuthSuccess = (authUser: any) => {
    toast({
      title: "Zalogowano pomyślnie",
      description: "Możesz teraz korzystać z pełnej funkcjonalności RAG",
    });
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">LexiCore RAG + Gemini Flash 2.0</h2>
              <p className="text-purple-100 text-sm">Asystent Prawny AI z bazą wiedzy</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user && (
              <Badge className="bg-green-500 text-white">
                RAG Aktywny
              </Badge>
            )}
            {!user && (
              <AuthDialog onAuthSuccess={handleAuthSuccess} />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl p-4 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-100'
              }`}>
                <div className="flex items-start space-x-3">
                  {message.sender === 'bot' && (
                    <Brain className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    
                    {/* Show sources for bot messages */}
                    {message.sender === 'bot' && message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-blue-400 font-medium">
                            Źródła z bazy wiedzy:
                          </span>
                        </div>
                        <div className="space-y-2">
                          {message.sources.map((source, idx) => (
                            <div key={idx} className="bg-slate-600/50 p-2 rounded text-sm">
                              <p className="text-gray-300 mb-1">{source.content}</p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                                  {source.document_name}
                                </Badge>
                                <Badge className="bg-green-500/20 text-green-300 text-xs">
                                  Podobieństwo: {(source.similarity * 100).toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 p-4 rounded-lg max-w-xs">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-gray-300">Analizuję bazę wiedzy...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900 border-t border-slate-700">
          {!user && (
            <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
              <p className="text-amber-200 text-sm">
                Musisz być zalogowany, aby korzystać z systemu RAG
              </p>
            </div>
          )}
          <div className="flex space-x-2 max-w-4xl mx-auto">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={user ? "Zadaj pytanie na podstawie bazy wiedzy..." : "Zaloguj się, aby korzystać z RAG"}
              className="flex-1 bg-slate-800 border-slate-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={!user}
            />
            <Button 
              onClick={sendMessage} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!user || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <Brain className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          </Button>
          
          {/* RAG Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">RAG</span>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-96 h-[600px] bg-slate-800 rounded-lg shadow-2xl border border-slate-700 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-white/20 rounded">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">LexiCore RAG</h3>
                <p className="text-purple-100 text-xs">Gemini Flash 2.0</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {user && (
                <Badge className="bg-green-500 text-white text-xs">RAG</Badge>
              )}
              {!user && (
                <AuthDialog onAuthSuccess={handleAuthSuccess} />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={openFullscreen}
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18-5h-3a2 2 0 0 1 2 2v3m0 6v3a2 2 0 0 1-2 2h-3m-6 0H5a2 2 0 0 1-2-2v-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages - abbreviated for compact view */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.slice(-5).map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-gray-100'
                }`}>
                  {message.sender === 'bot' && (
                    <div className="flex items-center mb-1">
                      <Brain className="h-3 w-3 text-purple-400 mr-1" />
                      <span className="text-xs text-purple-400">LexiCore RAG</span>
                    </div>
                  )}
                  <p>{message.text.length > 150 ? message.text.substring(0, 150) + '...' : message.text}</p>
                  {message.sources && message.sources.length > 0 && (
                    <Badge className="mt-1 bg-blue-500/20 text-blue-300 text-xs">
                      {message.sources.length} źródeł
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-3 w-3 text-purple-400" />
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={user ? "Zapytaj RAG..." : "Zaloguj się"}
                className="flex-1 bg-slate-700 border-slate-600 text-white text-sm h-9"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!user}
              />
              <Button 
                onClick={sendMessage} 
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 h-9 w-9 p-0"
                disabled={!user || isTyping}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedChatBubble;
