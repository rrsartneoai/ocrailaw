
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Sparkles, Code, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from './GlassCard';

const snippetTemplates = {
  'react-component': {
    name: 'React Component',
    description: 'Funkcjonalny komponent React z hooks',
    template: `import React, { useState, useEffect } from 'react';

interface {{ComponentName}}Props {
  // Dodaj propsy tutaj
}

const {{ComponentName}}: React.FC<{{ComponentName}}Props> = () => {
  const [state, setState] = useState('');

  useEffect(() => {
    // Logika inicjalizacji
  }, []);

  return (
    <div className="{{className}}">
      <h1>{{ComponentName}}</h1>
      {/* Treść komponentu */}
    </div>
  );
};

export default {{ComponentName}};`
  },
  'api-endpoint': {
    name: 'API Endpoint',
    description: 'Express.js endpoint z walidacją',
    template: `import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Walidacja danych wejściowych
export const validate{{EndpointName}} = [
  body('{{fieldName}}').notEmpty().withMessage('{{fieldName}} jest wymagane'),
  // Dodaj więcej walidacji
];

// Handler endpointu
export const {{endpointName}} = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { {{fieldName}} } = req.body;

    // Logika biznesowa
    const result = await processData({{fieldName}});

    res.status(200).json({
      success: true,
      data: result,
      message: '{{EndpointName}} wykonane pomyślnie'
    });
  } catch (error) {
    console.error('Error in {{endpointName}}:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd serwera'
    });
  }
};`
  },
  'database-model': {
    name: 'Database Model',
    description: 'Model bazy danych z Prisma/TypeORM',
    template: `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('{{tableName}}')
export class {{ModelName}} {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  {{fieldName}}: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Repository lub Service
export class {{ModelName}}Service {
  async create{{ModelName}}(data: Partial<{{ModelName}}>): Promise<{{ModelName}}> {
    // Implementacja tworzenia
    return new {{ModelName}}();
  }

  async find{{ModelName}}ById(id: string): Promise<{{ModelName}} | null> {
    // Implementacja wyszukiwania
    return null;
  }

  async update{{ModelName}}(id: string, data: Partial<{{ModelName}}>): Promise<{{ModelName}}> {
    // Implementacja aktualizacji
    return new {{ModelName}}();
  }

  async delete{{ModelName}}(id: string): Promise<boolean> {
    // Implementacja usuwania
    return true;
  }
}`
  },
  'custom-hook': {
    name: 'Custom React Hook',
    description: 'Hook do zarządzania stanem i side effects',
    template: `import { useState, useEffect, useCallback } from 'react';

interface Use{{HookName}}Options {
  // Opcje konfiguracyjne
}

interface Use{{HookName}}Return {
  data: any[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const use{{HookName}} = (options?: Use{{HookName}}Options): Use{{HookName}}Return => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Logika pobierania danych
      const response = await fetch('/api/{{endpoint}}');
      const result = await response.json();
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh
  };
};`
  }
};

const SnippetGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = snippetTemplates[templateKey as keyof typeof snippetTemplates];
    
    // Wyciągnij zmienne z szablonu (wszystko w {{}}})
    const variableMatches = template.template.match(/\{\{([^}]+)\}\}/g);
    const newVariables: Record<string, string> = {};
    
    variableMatches?.forEach(match => {
      const varName = match.replace(/[{}]/g, '');
      if (!newVariables[varName]) {
        newVariables[varName] = '';
      }
    });
    
    setVariables(newVariables);
    setGeneratedCode('');
  };

  const generateSnippet = () => {
    if (!selectedTemplate) {
      toast.error('Wybierz szablon!');
      return;
    }

    setIsGenerating(true);
    
    // Symulacja generowania (w rzeczywistości można by użyć API Gemini)
    setTimeout(() => {
      const template = snippetTemplates[selectedTemplate as keyof typeof snippetTemplates];
      let code = template.template;
      
      // Zastąp zmienne wartościami
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        code = code.replace(regex, value || key);
      });
      
      setGeneratedCode(code);
      setIsGenerating(false);
      toast.success('Snippet wygenerowany!');
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    toast.success('Kod skopiowany do schowka!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadSnippet = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Snippet pobrany!');
  };

  return (
    <section id="snippet-generator" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border border-purple-500/30 mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Generator Snippetów AI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Twórz kod
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              w kilka sekund
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Wykorzystaj moc AI do generowania gotowych fragmentów kodu. 
            Wybierz szablon, dostosuj parametry i otrzymaj profesjonalny kod.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel konfiguracji */}
          <GlassCard className="p-6" intensity="medium">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="h-5 w-5" />
                Konfiguracja Snippetu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wybór szablonu */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wybierz szablon
                </label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue placeholder="Wybierz szablon kodu" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(snippetTemplates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-400">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Zmienne szablonu */}
              {Object.keys(variables).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Parametry szablonu
                  </label>
                  <div className="space-y-3">
                    {Object.entries(variables).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-400 mb-1">
                          {key}
                        </label>
                        <Input
                          value={value}
                          onChange={(e) => setVariables(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }))}
                          placeholder={`Wartość dla ${key}`}
                          className="bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dodatkowy prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dodatkowe instrukcje (opcjonalne)
                </label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Opisz dodatkowe wymagania dla generowanego kodu..."
                  className="bg-slate-800/50 border-slate-600 text-white resize-none"
                  rows={4}
                />
              </div>

              {/* Przycisk generowania */}
              <Button
                onClick={generateSnippet}
                disabled={!selectedTemplate || isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generowanie...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generuj Snippet
                  </>
                )}
              </Button>
            </CardContent>
          </GlassCard>

          {/* Panel wyniku */}
          <GlassCard className="p-6" intensity="medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Wygenerowany Kod
                </CardTitle>
                {generatedCode && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={downloadSnippet}
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedCode ? (
                <div className="relative">
                  <pre className="bg-slate-900/50 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto border border-slate-600">
                    <code className="text-gray-300 whitespace-pre-wrap">
                      {generatedCode}
                    </code>
                  </pre>
                  
                  {/* Tagi technologii */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedTemplate && (
                      <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {snippetTemplates[selectedTemplate as keyof typeof snippetTemplates].name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      TypeScript
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Ready to use
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {selectedTemplate 
                      ? 'Kliknij "Generuj Snippet" aby stworzyć kod'
                      : 'Wybierz szablon aby rozpocząć'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default SnippetGenerator;
