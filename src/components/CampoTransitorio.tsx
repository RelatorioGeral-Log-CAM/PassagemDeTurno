import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePickerWithNavigation } from "@/components/DatePickerWithNavigation";
import { CampoTransitorioCard } from "@/components/CampoTransitorioCard";
import { loadCampoTransitorioData, getAvailableCampoTransitorioDates, type CampoTransitorioData } from "@/utils/campoTransitorioTsvLoader";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Truck, 
  Users, 
  Archive,
  BarChart3,
  Calendar,
  Activity,
  Sparkles
} from "lucide-react";

type ComparativeType = 'none' | 'd-1' | '7days' | 'monthly';

export const CampoTransitorio = () => {
  const [data, setData] = useState<CampoTransitorioData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<CampoTransitorioData[]>([]);
  const [comparativeType, setComparativeType] = useState<ComparativeType>('none');
  const [previousData, setPreviousData] = useState<CampoTransitorioData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const loadedData = await loadCampoTransitorioData();
      setData(loadedData);
      
      const dates = getAvailableCampoTransitorioDates(loadedData);
      setAvailableDates(dates);
      
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate && data.length > 0) {
      // Calculate current data based on comparative type
      let currentData: CampoTransitorioData[] = [];
      let comparisonData: CampoTransitorioData[] = [];
      
      if (comparativeType === 'none' || comparativeType === 'd-1') {
        // For no comparison or D-1, show single day data
        const filtered = data.filter(item => {
          const itemDate = item.data;
          if (itemDate.includes('/')) {
            const parts = itemDate.split('/');
            if (parts.length === 3) {
              const convertedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              return convertedDate === selectedDate;
            }
          }
          return itemDate === selectedDate;
        });
        currentData = filtered;
        
        if (comparativeType === 'd-1') {
          // D-1 comparison: find the last date with actual data
          const currentDateIndex = availableDates.indexOf(selectedDate);
          for (let i = currentDateIndex + 1; i < availableDates.length; i++) {
            const candidateDate = availableDates[i];
            const candidateFiltered = data.filter(item => {
              const itemDate = item.data;
              if (itemDate.includes('/')) {
                const parts = itemDate.split('/');
                if (parts.length === 3) {
                  const convertedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                  return convertedDate === candidateDate;
                }
              }
              return itemDate === candidateDate;
            });
            
            if (candidateFiltered.length > 0) {
              comparisonData = candidateFiltered;
              break;
            }
          }
        }
      } else if (comparativeType === '7days') {
        // For 7 days: consolidate current 7 days and previous 7 days
        const selectedDateObj = new Date(selectedDate);
        const currentPeriodDates: string[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(selectedDateObj);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          currentPeriodDates.push(dateStr);
        }
        currentData = consolidateDataForDates(currentPeriodDates);
        comparisonData = calculateConsolidatedData(selectedDate, 7, 7);
      } else if (comparativeType === 'monthly') {
        // For 30 days: consolidate current 30 days and previous 30 days
        const selectedDateObj = new Date(selectedDate);
        const currentPeriodDates: string[] = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date(selectedDateObj);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          currentPeriodDates.push(dateStr);
        }
        currentData = consolidateDataForDates(currentPeriodDates);
        comparisonData = calculateConsolidatedData(selectedDate, 30, 30);
      }
      
      setFilteredData(currentData);
      setPreviousData(comparisonData);
    }
  }, [selectedDate, data, availableDates, comparativeType]);

  const calculateConsolidatedData = (fromDate: string, currentDays: number, previousDays: number): CampoTransitorioData[] => {
    const selectedDateObj = new Date(fromDate);
    
    // Get dates for current period (including selected date, going backwards)
    // Ex: se hoje é 18, para 7 dias: 18, 17, 16, 15, 14, 13, 12
    const currentPeriodDates: string[] = [];
    for (let i = 0; i < currentDays; i++) {
      const date = new Date(selectedDateObj);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      currentPeriodDates.push(dateStr);
    }
    
    // Get dates for previous period (the days immediately before current period)
    // Ex: continuando do exemplo acima, para os 7 dias anteriores: 11, 10, 9, 8, 7, 6, 5
    const previousPeriodDates: string[] = [];
    for (let i = currentDays; i < currentDays + previousDays; i++) {
      const date = new Date(selectedDateObj);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      previousPeriodDates.push(dateStr);
    }
    
    // Consolidate previous period data for comparison
    const previousPeriodData = consolidateDataForDates(previousPeriodDates);
    
    // Return previous period data for comparison
    return previousPeriodData;
  };

  const consolidateDataForDates = (dates: string[]): CampoTransitorioData[] => {
    const relevantData = data.filter(item => {
      const itemDate = item.data;
      let convertedDate = itemDate;
      
      if (itemDate.includes('/')) {
        const parts = itemDate.split('/');
        if (parts.length === 3) {
          convertedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      
      return dates.includes(convertedDate);
    });

    if (relevantData.length === 0) return [];

    // Consolidate all data into a single record
    const consolidated: CampoTransitorioData = {
      data: dates[0], // Use first date as reference
      expedicao0a4: consolidateValues(relevantData.map(d => d.expedicao0a4)),
      expedicao5: consolidateValues(relevantData.map(d => d.expedicao5)),
      expedicao6a14: consolidateValues(relevantData.map(d => d.expedicao6a14)),
      expedicao15: consolidateValues(relevantData.map(d => d.expedicao15)),
      expedicao16a29: consolidateValues(relevantData.map(d => d.expedicao16a29)),
      expedicao30: consolidateValues(relevantData.map(d => d.expedicao30)),
      expedicaoMais30: consolidateValues(relevantData.map(d => d.expedicaoMais30)),
      expedicaoTotal: consolidateValues(relevantData.map(d => d.expedicaoTotal)),
      expedicao999: consolidateValues(relevantData.map(d => d.expedicao999)),
      mp0a4: consolidateValues(relevantData.map(d => d.mp0a4)),
      mp5: consolidateValues(relevantData.map(d => d.mp5)),
      mp6a14: consolidateValues(relevantData.map(d => d.mp6a14)),
      mp15: consolidateValues(relevantData.map(d => d.mp15)),
      mp16a29: consolidateValues(relevantData.map(d => d.mp16a29)),
      mp30: consolidateValues(relevantData.map(d => d.mp30)),
      mpMais30: consolidateValues(relevantData.map(d => d.mpMais30)),
      mpTotal: consolidateValues(relevantData.map(d => d.mpTotal)),
      mp999: consolidateValues(relevantData.map(d => d.mp999)),
      separacao0a4: consolidateValues(relevantData.map(d => d.separacao0a4)),
      separacao5: consolidateValues(relevantData.map(d => d.separacao5)),
      separacao6a14: consolidateValues(relevantData.map(d => d.separacao6a14)),
      separacao15: consolidateValues(relevantData.map(d => d.separacao15)),
      separacao16a29: consolidateValues(relevantData.map(d => d.separacao16a29)),
      separacao30: consolidateValues(relevantData.map(d => d.separacao30)),
      separacaoMais30: consolidateValues(relevantData.map(d => d.separacaoMais30)),
      separacaoTotal: consolidateValues(relevantData.map(d => d.separacaoTotal)),
      separacao999: consolidateValues(relevantData.map(d => d.separacao999)),
      recebimento0a4: consolidateValues(relevantData.map(d => d.recebimento0a4)),
      recebimento5: consolidateValues(relevantData.map(d => d.recebimento5)),
      recebimento6a14: consolidateValues(relevantData.map(d => d.recebimento6a14)),
      recebimento15: consolidateValues(relevantData.map(d => d.recebimento15)),
      recebimento16a29: consolidateValues(relevantData.map(d => d.recebimento16a29)),
      recebimento30: consolidateValues(relevantData.map(d => d.recebimento30)),
      recebimentoMais30: consolidateValues(relevantData.map(d => d.recebimentoMais30)),
      recebimentoTotal: consolidateValues(relevantData.map(d => d.recebimentoTotal)),
      recebimento999: consolidateValues(relevantData.map(d => d.recebimento999)),
      armEstojo0a4: consolidateValues(relevantData.map(d => d.armEstojo0a4)),
      armEstojo5: consolidateValues(relevantData.map(d => d.armEstojo5)),
      armEstojo6a14: consolidateValues(relevantData.map(d => d.armEstojo6a14)),
      armEstojo15: consolidateValues(relevantData.map(d => d.armEstojo15)),
      armEstojo16a29: consolidateValues(relevantData.map(d => d.armEstojo16a29)),
      armEstojo30: consolidateValues(relevantData.map(d => d.armEstojo30)),
      armEstojoMais30: consolidateValues(relevantData.map(d => d.armEstojoMais30)),
      armEstojoTotal: consolidateValues(relevantData.map(d => d.armEstojoTotal)),
      armEstojo999: consolidateValues(relevantData.map(d => d.armEstojo999))
    };

    return [consolidated];
  };

  const consolidateValues = (values: string[]): string => {
    let total = 0;
    
    values.forEach(value => {
      if (value && value !== 'R$ 0,00') {
        const numericValue = parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        if (!isNaN(numericValue)) {
          total += numericValue;
        }
      }
    });
    
    return total === 0 ? 'R$ 0,00' : total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const createCategoryData = (item: CampoTransitorioData, prefix: string) => {
    const categoryMap: Record<string, any> = {
      'expedicao': {
        '0a4': item.expedicao0a4,
        '5': item.expedicao5,
        '6a14': item.expedicao6a14,
        '15': item.expedicao15,
        '16a29': item.expedicao16a29,
        '30': item.expedicao30,
        'mais30': item.expedicaoMais30,
        'total': item.expedicaoTotal,
        '999': item.expedicao999,
        icon: Truck,
        gradient: 'primary'
      },
      'mp': {
        '0a4': item.mp0a4,
        '5': item.mp5,
        '6a14': item.mp6a14,
        '15': item.mp15,
        '16a29': item.mp16a29,
        '30': item.mp30,
        'mais30': item.mpMais30,
        'total': item.mpTotal,
        '999': item.mp999,
        icon: Package,
        gradient: 'secondary'
      },
      'separacao': {
        '0a4': item.separacao0a4,
        '5': item.separacao5,
        '6a14': item.separacao6a14,
        '15': item.separacao15,
        '16a29': item.separacao16a29,
        '30': item.separacao30,
        'mais30': item.separacaoMais30,
        'total': item.separacaoTotal,
        '999': item.separacao999,
        icon: Users,
        gradient: 'accent'
      },
      'recebimento': {
        '0a4': item.recebimento0a4,
        '5': item.recebimento5,
        '6a14': item.recebimento6a14,
        '15': item.recebimento15,
        '16a29': item.recebimento16a29,
        '30': item.recebimento30,
        'mais30': item.recebimentoMais30,
        'total': item.recebimentoTotal,
        '999': item.recebimento999,
        icon: TrendingUp,
        gradient: 'primary'
      },
      'armEstojo': {
        '0a4': item.armEstojo0a4,
        '5': item.armEstojo5,
        '6a14': item.armEstojo6a14,
        '15': item.armEstojo15,
        '16a29': item.armEstojo16a29,
        '30': item.armEstojo30,
        'mais30': item.armEstojoMais30,
        'total': item.armEstojoTotal,
        '999': item.armEstojo999,
        icon: Archive,
        gradient: 'secondary'
      }
    };

    return categoryMap[prefix];
  };

  const categories = [
    { key: 'expedicao', name: 'Expedição' },
    { key: 'mp', name: 'Matéria Prima' },
    { key: 'separacao', name: 'Separação' },
    { key: 'recebimento', name: 'Recebimento' },
    { key: 'armEstojo', name: 'Armazém Estojo' }
  ];

  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getComparativeLabel = (): string => {
    const selectedDateObj = new Date(selectedDate);
    
    switch (comparativeType) {
      case 'd-1':
        const previousDate = getPreviousDateForDisplay();
        return previousDate ? `Comparando com: ${formatDateForDisplay(previousDate)}` : '';
      case '7days':
        // Calculate date ranges for 7-day comparison
        const currentStart7 = new Date(selectedDateObj);
        const currentEnd7 = new Date(selectedDateObj);
        currentEnd7.setDate(currentEnd7.getDate() - 6);
        
        const previousStart7 = new Date(selectedDateObj);
        previousStart7.setDate(previousStart7.getDate() - 7);
        const previousEnd7 = new Date(selectedDateObj);
        previousEnd7.setDate(previousEnd7.getDate() - 13);
        
        return `Período atual (${currentEnd7.toLocaleDateString('pt-BR')} - ${currentStart7.toLocaleDateString('pt-BR')}) vs anterior (${previousEnd7.toLocaleDateString('pt-BR')} - ${previousStart7.toLocaleDateString('pt-BR')})`;
      case 'monthly':
        // Calculate date ranges for 30-day comparison  
        const currentStart30 = new Date(selectedDateObj);
        const currentEnd30 = new Date(selectedDateObj);
        currentEnd30.setDate(currentEnd30.getDate() - 29);
        
        const previousStart30 = new Date(selectedDateObj);
        previousStart30.setDate(previousStart30.getDate() - 30);
        const previousEnd30 = new Date(selectedDateObj);
        previousEnd30.setDate(previousEnd30.getDate() - 59);
        
        return `Período atual (${currentEnd30.toLocaleDateString('pt-BR')} - ${currentStart30.toLocaleDateString('pt-BR')}) vs anterior (${previousEnd30.toLocaleDateString('pt-BR')} - ${previousStart30.toLocaleDateString('pt-BR')})`;
      default:
        return '';
    }
  };

  const getPreviousDateForDisplay = (): string | null => {
    const currentDateIndex = availableDates.indexOf(selectedDate);
    
    // Look for the next available date with actual data
    for (let i = currentDateIndex + 1; i < availableDates.length; i++) {
      const candidateDate = availableDates[i];
      const candidateFiltered = data.filter(item => {
        const itemDate = item.data;
        if (itemDate.includes('/')) {
          const parts = itemDate.split('/');
          if (parts.length === 3) {
            const convertedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            return convertedDate === candidateDate;
          }
        }
        return itemDate === candidateDate;
      });
      
      // If we found data for this date, return it
      if (candidateFiltered.length > 0) {
        return candidateDate;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl border border-accent/20 shadow-elegant backdrop-blur-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur animate-glow" />
                  <div className="relative p-4 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl shadow-modern">
                    <DollarSign className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent flex items-center gap-3">
                    Campo Transitório
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                      <TrendingUp className="h-6 w-6 text-secondary animate-bounce" />
                    </div>
                  </h1>
                  <p className="text-base text-muted-foreground font-medium mt-2 max-w-md">
                    Análise Financeira Avançada • Dashboard Executivo • 2025
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <DatePickerWithNavigation
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
            </div>

            {/* Global Controls */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-accent/20">
              <Button
                variant={comparativeType === 'd-1' ? "default" : "outline"}
                onClick={() => setComparativeType(comparativeType === 'd-1' ? 'none' : 'd-1')}
                className="transition-all duration-300 hover:scale-105"
                disabled={!getPreviousDateForDisplay()}
              >
                <Activity className="h-4 w-4 mr-2" />
                Comparativo D-1
              </Button>
              
              <Button
                variant={comparativeType === '7days' ? "default" : "outline"}
                onClick={() => setComparativeType(comparativeType === '7days' ? 'none' : '7days')}
                className="transition-all duration-300 hover:scale-105"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Comp. 7 dias
              </Button>
              
              <Button
                variant={comparativeType === 'monthly' ? "default" : "outline"}
                onClick={() => setComparativeType(comparativeType === 'monthly' ? 'none' : 'monthly')}
                className="transition-all duration-300 hover:scale-105"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Comp. Mensal
              </Button>
              
              {comparativeType !== 'none' && (
                <Badge variant="outline" className="bg-muted/30 text-muted-foreground">
                  {getComparativeLabel()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Data Grid */}
        {filteredData.length > 0 && (
          <div className="space-y-8">
            {categories.map((category) => {
              const currentItem = filteredData[0];
              const previousItem = previousData.length > 0 ? previousData[0] : null;
              const categoryData = createCategoryData(currentItem, category.key);
              const previousCategoryData = previousItem ? createCategoryData(previousItem, category.key) : null;

              return (
                <CampoTransitorioCard
                  key={category.key}
                  category={category}
                  currentData={categoryData}
                  previousData={previousCategoryData}
                  icon={categoryData.icon}
                  gradient={categoryData.gradient}
                  showComparative={comparativeType !== 'none'}
                  comparativeType={comparativeType}
                  onToggleComparative={() => {}} // Botão individual agora não afeta o geral
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 border-accent/20 shadow-elegant backdrop-blur-sm">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl" />
                  <div className="relative p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl">
                    <DollarSign className="h-16 w-16 text-muted-foreground mx-auto" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Aguardando Dados Financeiros
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Selecione uma data válida no seletor acima para visualizar a análise 
                  detalhada dos dados do Campo Transitório.
                </p>
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">
                    💡 Dica: Use os controles de navegação para explorar diferentes períodos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};