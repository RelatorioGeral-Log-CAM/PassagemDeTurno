import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Eye,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import type { CampoTransitorioData } from "@/utils/campoTransitorioTsvLoader";

interface CampoTransitorioCardProps {
  category: {
    key: string;
    name: string;
  };
  currentData: any;
  previousData?: any;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  showComparative: boolean;
  comparativeType?: 'none' | 'd-1' | '7days' | 'monthly';
  onToggleComparative: () => void;
}

export const CampoTransitorioCard = ({
  category,
  currentData,
  previousData,
  icon: IconComponent,
  gradient,
  showComparative,
  comparativeType = 'none',
  onToggleComparative
}: CampoTransitorioCardProps) => {
  const [individualComparative, setIndividualComparative] = useState(false);
  const periods = [
    { key: '0a4', name: '0-4d', fullName: '0 a 4 dias' },
    { key: '5', name: '5d', fullName: '5 dias' },
    { key: '6a14', name: '6-14d', fullName: '6 a 14 dias' },
    { key: '15', name: '15d', fullName: '15 dias' },
    { key: '16a29', name: '16-29d', fullName: '16 a 29 dias' },
    { key: '30', name: '30d', fullName: '30 dias' },
    { key: 'mais30', name: '+30d', fullName: '+ 30 dias' },
    { key: 'total', name: 'Total', fullName: 'Total' },
    { key: '999', name: '999', fullName: '999' }
  ];

  const formatCurrency = (value: string) => {
    if (!value || value === 'R$ 0,00') return 'R$ 0,00';
    return value;
  };

  const parseValue = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  };

  const calculatePercentageChange = (current: string, previous: string): number => {
    const currentVal = parseValue(current);
    const previousVal = parseValue(previous);
    
    if (previousVal === 0) return currentVal > 0 ? 100 : 0;
    const change = ((currentVal - previousVal) / previousVal) * 100;
    
    // Limitar valores extremos para exibição mais limpa
    if (Math.abs(change) > 999) {
      return change > 0 ? 999 : -999;
    }
    
    return change;
  };

  const getGradientClass = () => {
    const gradientMap: Record<string, string> = {
      primary: 'from-primary via-primary/90 to-primary/70',
      secondary: 'from-secondary via-secondary/90 to-secondary/70',
      accent: 'from-accent via-accent/90 to-accent/70',
      muted: 'from-muted via-muted/90 to-muted/70'
    };
    return gradientMap[gradient] || gradientMap.primary;
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/90 border border-accent/20 shadow-elegant hover:shadow-glow transition-all duration-500 backdrop-blur-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-4 relative">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-br ${getGradientClass()} rounded-xl shadow-modern animate-glow`}>
              <IconComponent className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Análise Financeira Detalhada
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={individualComparative ? "default" : "outline"}
              size="sm"
              onClick={() => setIndividualComparative(!individualComparative)}
              className="relative overflow-hidden transition-all duration-300 hover:scale-105"
              disabled={!previousData}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparativo
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-all duration-300">
                  <Eye className="h-4 w-4 mr-2" />
                  Detalhes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                    Detalhes Completos - {category.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {periods.map((period) => {
                      const currentValue = formatCurrency(currentData[period.key]);
                      const previousValue = previousData ? formatCurrency(previousData[period.key]) : null;
                      const percentageChange = previousValue ? calculatePercentageChange(currentValue, previousValue) : null;
                      
                      return (
                        <div key={period.key} className="bg-muted/30 rounded-lg p-4 border">
                          <div className="text-sm font-semibold text-muted-foreground mb-2">
                            {period.fullName}
                          </div>
                          <div className="text-lg font-bold text-foreground mb-1">
                            {currentValue}
                          </div>
                          {previousValue && percentageChange !== null && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>Anterior: {previousValue}</div>
                              <div className={`flex items-center gap-1 ${
                                percentageChange <= 0 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {percentageChange <= 0 ? (
                                  <ArrowDownRight className="h-3 w-3" />
                                ) : (
                                  <ArrowUpRight className="h-3 w-3" />
                                )}
                                {Math.abs(percentageChange).toFixed(1)}%
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {periods.map((period) => {
            const currentValue = formatCurrency(currentData[period.key]);
            const previousValue = previousData ? formatCurrency(previousData[period.key]) : null;
            const percentageChange = previousValue ? calculatePercentageChange(currentValue, previousValue) : null;
            // Invertido: valores maiores = vermelho (ruim), valores menores = verde (bom)
            const isGood = percentageChange !== null ? percentageChange <= 0 : null;
            
            return (
              <div
                key={period.key}
                className="group/item relative bg-gradient-to-br from-background/50 via-background/30 to-muted/20 rounded-xl p-4 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-modern backdrop-blur-sm"
              >
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {period.name}
                    </span>
                    {(showComparative || individualComparative) && percentageChange !== null && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isGood 
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-600 border border-red-500/20'
                      }`}>
                        {isGood ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {Math.abs(percentageChange).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-base font-bold text-foreground leading-tight">
                      {currentValue}
                    </div>
                    
                    {(showComparative || individualComparative) && previousValue && (
                      <div className="text-xs text-muted-foreground">
                        Anterior: {previousValue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(showComparative || individualComparative) && previousData && (
          <>
            <Separator className="my-6 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            
            <div className="bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-accent" />
                <h4 className="text-sm font-bold text-foreground">Análise Comparativa - {category.name}</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Melhor performance (menor custo) */}
                <div className="bg-green-50/50 dark:bg-green-900/10 rounded-lg p-3 border border-green-200/50 dark:border-green-800/30">
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Melhor Performance</div>
                  <div className="text-sm font-bold text-green-800 dark:text-green-300">
                    {periods.reduce((best, period) => {
                      const change = calculatePercentageChange(currentData[period.key], previousData[period.key]);
                      return change < best.change ? { period: period.fullName, change } : best;
                    }, { period: '', change: Infinity }).period}
                  </div>
                </div>
                
                {/* Pior performance (maior custo) */}
                <div className="bg-red-50/50 dark:bg-red-900/10 rounded-lg p-3 border border-red-200/50 dark:border-red-800/30">
                  <div className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">Pior Performance</div>
                  <div className="text-sm font-bold text-red-800 dark:text-red-300">
                    {periods.reduce((worst, period) => {
                      const change = calculatePercentageChange(currentData[period.key], previousData[period.key]);
                      return change > worst.change ? { period: period.fullName, change } : worst;
                    }, { period: '', change: -Infinity }).period}
                  </div>
                </div>
                
                {/* Status geral */}
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/30">
                  <div className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">
                    {comparativeType === '7days' ? 'Status (7 dias)' : 
                     comparativeType === 'monthly' ? 'Status (30 dias)' : 
                     'Status Geral'}
                  </div>
                  <div className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    {(() => {
                      const changes = periods.map(p => calculatePercentageChange(currentData[p.key], previousData[p.key]));
                      const decreases = changes.filter(c => c <= 0).length;
                      const total = changes.length;
                      return decreases > total/2 ? 'Otimização' : decreases < total/2 ? 'Aumento' : 'Estável';
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};