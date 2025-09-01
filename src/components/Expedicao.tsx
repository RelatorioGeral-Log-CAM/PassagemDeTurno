import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Clock, Package, Truck, TrendingUp, BarChart3 } from "lucide-react";
import { FiltroGeral } from "./FiltroGeral";
import { KPICard } from "./KPICard";
import { HoraHoraDashboard } from "./HoraHoraDashboard";
import { loadExpedicaoData, getAvailableExpedicaoDates, getKPISummaryExpedicao, type ExpedicaoData } from "@/utils/expedicaoTsvLoader";

export const Expedicao = () => {
  const [selectedTurno, setSelectedTurno] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState<ExpedicaoData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHoraHora, setShowHoraHora] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await loadExpedicaoData();
      setData(loadedData);
      const dates = getAvailableExpedicaoDates(loadedData);
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesTurno = selectedTurno === 'todos' || item.turno === selectedTurno;
    
    if (!selectedDate) return matchesTurno;
    
    // Converter a data do item de DD/MM/YYYY para YYYY-MM-DD para comparação
    const dateOnly = item.dataHora.split(' ')[0];
    let itemDate = dateOnly;
    if (dateOnly.includes('/')) {
      const parts = dateOnly.split('/');
      if (parts.length === 3) {
        itemDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    
    const matchesDate = itemDate === selectedDate;
    return matchesTurno && matchesDate;
  });

  const kpiData = getKPISummaryExpedicao(filteredData, selectedTurno);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-3 sm:p-6 border border-border/50">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 animate-slide-up">
          Expedição
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up">
          Controle e gestão de expedição de produtos por turno
        </p>
      </div>

      {/* Filtros */}
      <FiltroGeral
        selectedTurno={selectedTurno}
        onTurnoChange={setSelectedTurno}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        availableDates={availableDates}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Pallets"
          value={kpiData.totalPallets}
          subtitle="Pallets expedidos"
          icon={Package}
        />
        <KPICard
          title="Total Cargas"
          value={kpiData.totalCargas}
          subtitle="Cargas processadas"
          icon={Truck}
        />
        <KPICard
          title="Média Pallets/Turno"
          value={kpiData.avgPalletsPorTurno}
          subtitle="Por turno ativo"
          icon={TrendingUp}
        />
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-accent to-accent/80 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-foreground">Análise Detalhada</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => setShowHoraHora(true)}
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium"
              size="sm"
            >
              <Clock className="h-4 w-4 mr-2" />
              Visualizar Hora a Hora
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Dashboard interativo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Dados - Mobile Optimized */}
      <div className="grid gap-4">
        {filteredData.map((item, index) => (
          <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 bg-gradient-glass border-primary/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {item.turno}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.dataHora}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {item.palletsExpedidos.split('/')[0]}
                  </div>
                  <p className="text-xs text-muted-foreground">Pallets</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Total de Cargas</h4>
                  <Badge variant="secondary" className="text-sm">
                    {item.totalCargas}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-foreground">Responsável</h4>
                  <Badge variant="outline" className="text-sm">
                    {item.responsavel}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Áreas de Trabalho - Mobile Optimized */}
              <div className="grid grid-cols-1 gap-4">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  {item.emDescida && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Em Descida</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg">
                        {item.emDescida.replace(/\*/g, '•')}
                      </div>
                    </div>
                  )}
                  
                  {item.zonaMista && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Zona Mista</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg">
                        {item.zonaMista.replace(/\*/g, '•')}
                      </div>
                    </div>
                  )}

                  {item.pisoNovoArmazem && item.pisoNovoArmazem !== "ZERADO" && item.pisoNovoArmazem !== "VAZIO" && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">Piso Novo Armazém</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg">
                        {item.pisoNovoArmazem.replace(/\*/g, '•')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna 2 - FIFOs */}
                <div className="space-y-4">
                  {[
                    { label: 'FIFO 1', value: item.fifo1 },
                    { label: 'FIFO 2', value: item.fifo2 },
                    { label: 'FIFO 3', value: item.fifo3 },
                    { label: 'FIFO 4', value: item.fifo4 },
                    { label: 'FIFO 5', value: item.fifo5 }
                  ].map((fifo, fifoIndex) => (
                    fifo.value && fifo.value !== "VAZIO" && fifo.value !== "ZERADO" && (
                      <div key={fifoIndex} className="space-y-2">
                        <h4 className="font-semibold text-sm text-foreground">{fifo.label}</h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg">
                          {fifo.value.replace(/\*/g, '•')}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Observações */}
              {item.observacao && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">Observações</h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 p-3 rounded-lg border border-primary/20">
                      {item.observacao.replace(/\*/g, '•')}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Hora a Hora */}
      <HoraHoraDashboard 
        isOpen={showHoraHora}
        onClose={() => setShowHoraHora(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};