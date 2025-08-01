
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";

const TimeCalculator = () => {
  const [lawyers, setLawyers] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(300);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [researchHours, setResearchHours] = useState(15);

  const calculateSavings = () => {
    const weeklyResearchHours = (researchHours / 100) * hoursPerWeek * lawyers;
    const timeSaved = weeklyResearchHours * 0.8; // 80% oszczędności
    const moneySaved = timeSaved * hourlyRate;
    const yearlySavings = moneySaved * 52;
    
    return {
      timeSaved: Math.round(timeSaved),
      moneySaved: Math.round(moneySaved),
      yearlySavings: Math.round(yearlySavings)
    };
  };

  const savings = calculateSavings();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Kalkulator Oszczędności
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sprawdź, ile czasu i pieniędzy zaoszczędzi Twoja kancelaria dzięki LexiCore RAG
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Calculator className="h-6 w-6 mr-3 text-blue-400" />
                Dane Twojej Kancelarii
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lawyers" className="text-gray-300">Liczba prawników</Label>
                  <Input
                    id="lawyers"
                    type="number"
                    value={lawyers}
                    onChange={(e) => setLawyers(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate" className="text-gray-300">Stawka godzinowa (PLN)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="100"
                    max="2000"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hoursPerWeek" className="text-gray-300">Godziny pracy tygodniowo</Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  min="10"
                  max="80"
                />
              </div>

              <div>
                <Label htmlFor="researchHours" className="text-gray-300">
                  % czasu na research i analizę dokumentów
                </Label>
                <Input
                  id="researchHours"
                  type="number"
                  value={researchHours}
                  onChange={(e) => setResearchHours(Number(e.target.value))}
                  className="bg-slate-700 border-slate-600 text-white"
                  min="5"
                  max="50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Średnio prawnik spędza 30-40% czasu na research
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-400" />
                  Oszczędności czasu tygodniowo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {savings.timeSaved} godzin
                </div>
                <p className="text-gray-300">
                  Dzięki automatyzacji research i analizy dokumentów
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-blue-400" />
                  Oszczędności finansowe tygodniowo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {savings.moneySaved.toLocaleString()} PLN
                </div>
                <p className="text-gray-300">
                  Czas zaoszczędzony na bardziej wartościowe zadania
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
                  Roczny ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {savings.yearlySavings.toLocaleString()} PLN
                </div>
                <p className="text-gray-300 mb-4">
                  Przewidywane oszczędności w skali roku
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Umów prezentację systemu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeCalculator;
