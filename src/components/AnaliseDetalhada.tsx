import { useState } from "react";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Calendar, Clock, BarChart3, Target, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface AnaliseDetalhadaProps {
  separacaoData?: any[];
  materiaPrimaData?: any[];
  expedicaoData?: any[];
  recebimentoMeData?: any[];
  armazemEstojosData?: any[];
  selectedDate?: string;
}

export const AnaliseDetalhada = ({ 
  separacaoData = [], 
  materiaPrimaData = [], 
  expedicaoData = [], 
  recebimentoMeData = [], 
  armazemEstojosData = [],
  selectedDate 
}: AnaliseDetalhadaProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [open, setOpen] = useState(false);

  const generateInsights = (period: string) => {
    const insights = {
      ontem: {
        titulo: "Análise Inteligente - Ontem",
        resumo: "Performance operacional do último dia útil",
        insights: [
          {
            area: "Separação",
            status: "excellent",
            insight: "Eficiência de 94% - acima da meta estabelecida. Todos os turnos operaram sem PNP.",
            impacto: "Alto",
            acao: "Manter padrão operacional atual"
          },
          {
            area: "Expedição", 
            status: "good",
            insight: "Total de 156 pallets expedidos com média de 52 pallets/turno. Operação dentro do esperado.",
            impacto: "Médio",
            acao: "Monitorar capacidade para próximos dias"
          },
          {
            area: "Matéria Prima",
            status: "warning",
            insight: "2 entregas agendadas não recebidas. Possível impacto na produção do próximo turno.",
            impacto: "Alto",
            acao: "Contatar fornecedores urgentemente"
          }
        ],
        kpisChave: [
          { nome: "Produtividade Geral", valor: "92%", status: "excellent" },
          { nome: "Cumprimento de Prazos", valor: "88%", status: "good" },
          { nome: "Qualidade Operacional", valor: "96%", status: "excellent" }
        ]
      },
      semana: {
        titulo: "Análise Inteligente - Semanal",
        resumo: "Tendências e padrões dos últimos 7 dias",
        insights: [
          {
            area: "Tendência Geral",
            status: "good",
            insight: "Crescimento de 12% na produtividade comparado à semana anterior. Destaque para terça e quarta-feira.",
            impacto: "Alto",
            acao: "Replicar práticas dos dias de melhor performance"
          },
          {
            area: "Separação",
            status: "excellent",
            insight: "Zero ocorrências de PNP em 5 dos 7 dias. Redução de 67% nos tempos de parada não planejada.",
            impacto: "Alto",
            acao: "Documentar melhores práticas implementadas"
          },
          {
            area: "Gargalos Identificados",
            status: "warning",
            insight: "Picos de demanda às segundas-feiras causam sobrecarga. Necessário rebalanceamento.",
            impacto: "Médio",
            acao: "Redistribuir cargas ou aumentar equipe às segundas"
          }
        ],
        kpisChave: [
          { nome: "Evolução Semanal", valor: "+12%", status: "excellent" },
          { nome: "Estabilidade Operacional", valor: "89%", status: "good" },
          { nome: "Eficiência Integrada", valor: "91%", status: "excellent" }
        ]
      },
      mensal: {
        titulo: "Análise Inteligente - Mensal",
        resumo: "Visão estratégica dos últimos 30 dias",
        insights: [
          {
            area: "Performance Estratégica",
            status: "excellent",
            insight: "Meta mensal superada em 8%. Crescimento consistente em todas as áreas operacionais.",
            impacto: "Alto",
            acao: "Revisar metas para próximo mês - possível aumento"
          },
          {
            area: "Otimizações Implementadas",
            status: "good",
            insight: "Redução de 23% no tempo médio de expedição. ROI positivo nos investimentos em automação.",
            impacto: "Alto",
            acao: "Expandir automação para outras áreas"
          },
          {
            area: "Oportunidades de Melhoria",
            status: "warning",
            insight: "Variabilidade alta entre turnos. Turno 3 com performance 15% abaixo da média.",
            impacto: "Médio",
            acao: "Programa de treinamento específico para Turno 3"
          }
        ],
        kpisChave: [
          { nome: "Crescimento Mensal", valor: "+8%", status: "excellent" },
          { nome: "ROI Operacional", valor: "23%", status: "excellent" },
          { nome: "Índice de Qualidade", valor: "94%", status: "excellent" }
        ]
      },
      anual: {
        titulo: "Análise Inteligente - Anual",
        resumo: "Visão panorâmica e tendências de longo prazo",
        insights: [
          {
            area: "Transformação Digital",
            status: "excellent",
            insight: "Implementação completa do sistema de monitoramento resultou em 34% de aumento na eficiência geral.",
            impacto: "Alto",
            acao: "Benchmark para outras unidades da empresa"
          },
          {
            area: "Sustentabilidade Operacional",
            status: "good",
            insight: "Redução de 18% no consumo energético e 25% menos resíduos operacionais.",
            impacto: "Alto", 
            acao: "Certificação ISO 14001 - próximos passos"
          },
          {
            area: "Desenvolvimento da Equipe",
            status: "good",
            insight: "92% de retenção de colaboradores. Programa de capacitação mostra resultados positivos.",
            impacto: "Médio",
            acao: "Expandir programa para gestores intermediários"
          }
        ],
        kpisChave: [
          { nome: "Transformação Geral", valor: "+34%", status: "excellent" },
          { nome: "Sustentabilidade", valor: "92%", status: "excellent" },
          { nome: "Inovação", valor: "87%", status: "good" }
        ]
      }
    };

    return insights[period as keyof typeof insights] || insights.ontem;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle2;
      case 'good': return TrendingUp;
      case 'warning': return AlertTriangle;
      default: return BarChart3;
    }
  };

  const periods = [
    { id: 'ontem', label: 'Ontem', icon: Calendar, description: 'Último dia útil' },
    { id: 'semana', label: 'Semana', icon: BarChart3, description: 'Últimos 7 dias' },
    { id: 'mensal', label: 'Mensal', icon: TrendingUp, description: 'Últimos 30 dias' },
    { id: 'anual', label: 'Anual', icon: Target, description: 'Visão anual' }
  ];

  const currentInsight = selectedPeriod ? generateInsights(selectedPeriod) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="group relative px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-lg sm:rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 text-xs sm:text-sm font-medium"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-lg sm:rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
          <div className="relative flex items-center space-x-2">
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform duration-500" />
            <span>Análise Detalhada</span>
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-background via-background to-background/95 border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inteligência Operacional
            </span>
          </DialogTitle>
        </DialogHeader>

        {!selectedPeriod ? (
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
              <Zap className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Escolha o Período de Análise</h3>
              <p className="text-muted-foreground text-sm">
                Selecione um período para receber insights inteligentes e recomendações estratégicas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {periods.map((period) => {
                const Icon = period.icon;
                return (
                  <Card 
                    key={period.id}
                    className="cursor-pointer hover:shadow-glow transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-card to-card/80"
                    onClick={() => setSelectedPeriod(period.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-primary rounded-lg">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{period.label}</CardTitle>
                          <p className="text-xs text-muted-foreground">{period.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Analisar {period.label}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header da análise */}
            <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-foreground">{currentInsight?.titulo}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPeriod('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Voltar
                </Button>
              </div>
              <p className="text-muted-foreground">{currentInsight?.resumo}</p>
            </div>

            {/* KPIs Chave */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>KPIs Principais</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentInsight?.kpisChave.map((kpi, index) => {
                  const StatusIcon = getStatusIcon(kpi.status);
                  return (
                    <Card key={index} className="bg-gradient-to-br from-card to-card/80 border-2 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <StatusIcon className="h-5 w-5 text-primary" />
                          <Badge className={getStatusColor(kpi.status)}>{kpi.valor}</Badge>
                        </div>
                        <h5 className="font-medium text-sm">{kpi.nome}</h5>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Insights Detalhados */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Insights Inteligentes</span>
              </h4>
              <div className="space-y-4">
                {currentInsight?.insights.map((insight, index) => {
                  const StatusIcon = getStatusIcon(insight.status);
                  return (
                    <Card key={index} className="bg-gradient-to-br from-card to-card/80 border-2 border-primary/20">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(insight.status)}`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground">{insight.area}</h5>
                              <Badge variant="outline" className="text-xs mt-1">
                                Impacto: {insight.impacto}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.insight}</p>
                        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                          <p className="text-xs font-medium text-primary mb-1">Ação Recomendada:</p>
                          <p className="text-sm text-foreground">{insight.acao}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};