
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Shield, Clock, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisType: string;
  price: number;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  analysisType, 
  price,
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          analysisType,
          amount: price * 100, // Stripe expects amount in cents
          currency: 'pln'
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.open(data.url, '_blank');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Błąd płatności",
        description: "Nie udało się zainicjować płatności. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayUPayment = async () => {
    setIsLoading(true);
    try {
      // Integracja z PayU
      const { data, error } = await supabase.functions.invoke('create-payu-payment', {
        body: {
          analysisType,
          amount: price * 100,
          currency: 'PLN'
        }
      });

      if (error) throw error;

      if (data?.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Błąd płatności",
        description: "Nie udało się zainicjować płatności PayU. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrzelewy24Payment = async () => {
    setIsLoading(true);
    try {
      // Integracja z Przelewy24
      const { data, error } = await supabase.functions.invoke('create-p24-payment', {
        body: {
          analysisType,
          amount: price * 100,
          currency: 'PLN'
        }
      });

      if (error) throw error;

      if (data?.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Błąd płatności",
        description: "Nie udało się zainicjować płatności Przelewy24. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Wybierz metodę płatności</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Podsumowanie zamówienia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span>Analiza prawna ({analysisType})</span>
                <span className="font-semibold">{price} zł</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Razem:</span>
                <span>{price} zł</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Metody płatności</h3>
            
            {/* Stripe */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Button
                  onClick={handleStripePayment}
                  disabled={isLoading}
                  className="w-full justify-between"
                  variant="outline"
                >
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Karta płatnicza (Stripe)</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, BLIK</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Polecane</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* PayU */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Button
                  onClick={handlePayUPayment}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <div className="flex items-center">
                    <div className="bg-orange-500 text-white p-2 rounded mr-3">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">PayU</div>
                      <div className="text-sm text-gray-500">Szybkie płatności online</div>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Przelewy24 */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Button
                  onClick={handlePrzelewy24Payment}
                  disabled={isLoading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <div className="flex items-center">
                    <div className="bg-red-500 text-white p-2 rounded mr-3">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Przelewy24</div>
                      <div className="text-sm text-gray-500">Bezpieczne płatności</div>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Info */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Płatności są w pełni zabezpieczone i szyfrowane</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
