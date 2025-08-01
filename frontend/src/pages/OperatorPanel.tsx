
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import OperatorDashboard from '@/components/operator/OperatorDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const OperatorPanel = () => {
  const { user } = useAuth();

  // Sprawdzanie uprawnień operatora
  const isOperator = user?.app_metadata?.role === 'operator' || user?.email?.includes('operator');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2 text-orange-500" />
              Dostęp ograniczony
            </CardTitle>
            <CardDescription>
              Musisz być zalogowany, aby uzyskać dostęp do panelu operatora.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Zaloguj się</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isOperator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2 text-red-500" />
              Brak uprawnień
            </CardTitle>
            <CardDescription>
              Nie masz uprawnień do panelu operatora. Skontaktuj się z administratorem.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <OperatorDashboard />;
};

export default OperatorPanel;
