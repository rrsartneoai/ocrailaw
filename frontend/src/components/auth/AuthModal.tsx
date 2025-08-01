
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const { toast } = useToast();

  const handleEmailAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) throw error;
      
      setStep('verify');
      toast({
        title: "Kod wysłany!",
        description: "Sprawdź swoją skrzynkę email i wprowadź kod weryfikacyjny.",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać kodu email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      
      setStep('verify');
      toast({
        title: "SMS wysłany!",
        description: "Wprowadź kod otrzymany w SMS.",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać SMS.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp(
        email 
          ? { email, token: code, type: 'email' }
          : { phone, token: code, type: 'sms' }
      );
      
      if (error) throw error;
      
      toast({
        title: "Zalogowano pomyślnie!",
        description: "Witamy w systemie.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nieprawidłowy kod weryfikacyjny.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zalogować przez Google.",
        variant: "destructive",
      });
    }
  };

  if (step === 'verify') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wprowadź kod weryfikacyjny</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Kod weryfikacyjny</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <Button 
              onClick={handleVerifyCode} 
              disabled={isLoading || !code}
              className="w-full"
            >
              {isLoading ? "Weryfikacja..." : "Zweryfikuj kod"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setStep('login')}
              className="w-full"
            >
              Powrót
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Logowanie / Rejestracja</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="social" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">SMS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Szybkie logowanie</CardTitle>
                <CardDescription>Zaloguj się przez swoje konto społecznościowe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleGoogleAuth} 
                  variant="outline" 
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Kontynuuj z Google
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </CardTitle>
                <CardDescription>Otrzymasz kod weryfikacyjny na email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="email">Adres email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.com"
                  />
                </div>
                <Button 
                  onClick={handleEmailAuth} 
                  disabled={isLoading || !email}
                  className="w-full"
                >
                  {isLoading ? "Wysyłanie..." : "Wyślij kod na email"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="phone" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  SMS
                </CardTitle>
                <CardDescription>Otrzymasz kod weryfikacyjny przez SMS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 123 456 789"
                  />
                </div>
                <Button 
                  onClick={handlePhoneAuth} 
                  disabled={isLoading || !phone}
                  className="w-full"
                >
                  {isLoading ? "Wysyłanie..." : "Wyślij kod SMS"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
