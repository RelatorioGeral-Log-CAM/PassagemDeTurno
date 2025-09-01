import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";  
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, BarChart3, TrendingUp, Activity, Package, CalendarIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { loadHoraHoraData, getHoraHoraByDate, getHourlyDataForChart, type HoraHoraData } from "@/utils/horaHoraTsvLoader";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HoraHoraDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const chartConfig = {
  pallets: {
    label: "Pallets",
    color: "hsl(var(--primary))",
  },
  turno1: {
    label: "Turno 1",
    color: "hsl(var(--primary))",
  },
  turno2: {
    label: "Turno 2", 
    color: "hsl(var(--secondary))",
  },
  turno3: {
    label: "Turno 3",
    color: "hsl(var(--accent))",
  },
};

export const HoraHoraDashboard = ({ isOpen, onClose, selectedDate }: HoraHoraDashboardProps) => {
  const [horaHoraData, setHoraHoraData] = useState<HoraHoraData[]>([]);
  const [currentDayData, setCurrentDayData] = useState<HoraHoraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(new Date(selectedDate));
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadHoraHoraData();
      setHoraHoraData(data);
      
      // Criar lista de datas disponíveis
      const dates = data.map(d => new Date(d.data)).sort((a, b) => a.getTime() - b.getTime());
      setAvailableDates(dates);
      
      setLoading(false);
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (horaHoraData.length > 0 && internalSelectedDate) {
      const dateString = format(internalSelectedDate, 'yyyy-MM-dd');
      const dayData = getHoraHoraByDate(horaHoraData, dateString);
      setCurrentDayData(dayData);
    }
  }, [horaHoraData, internalSelectedDate]);

  // Sincronizar com a data externa inicialmente
  useEffect(() => {
    if (selectedDate) {
      setInternalSelectedDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const hourlyChartData = getHourlyDataForChart(currentDayData);

  // Dados por turno para visualização
  const turnoData = currentDayData ? [
    { 
      turno: "Turno 1 (06h-13h)", 
      total: currentDayData.total1T,
      media: currentDayData.media1T,
      color: "hsl(var(--primary))"
    },
    { 
      turno: "Turno 2 (14h-21h)", 
      total: currentDayData.total2T,
      media: currentDayData.media2T,
      color: "hsl(var(--secondary))"
    },
    { 
      turno: "Turno 3 (22h-05h)", 
      total: currentDayData.total3T,
      media: currentDayData.media3T,
      color: "hsl(var(--accent))"
    }
  ] : [];

  const totalDia = currentDayData ? currentDayData.total1T + currentDayData.total2T + currentDayData.total3T : 0;
  const mediaDia = turnoData.length > 0 ? Math.round(totalDia / 24) : 0;

  // Encontrar pico de produção
  const picoProducao = hourlyChartData.reduce((max, current) => 
    current.pallets > max.pallets ? current : max, 
    { hora: '', pallets: 0, turno: '' }
  );

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Carregando Dashboard Hora a Hora...
            </DialogTitle>
          </DialogHeader>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentDayData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Dashboard Hora a Hora
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Dados não encontrados
            </h3>
            <p className="text-muted-foreground">
              Não há dados disponíveis para a data selecionada: {format(internalSelectedDate, "dd/MM/yyyy")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Dashboard Hora a Hora
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !internalSelectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {internalSelectedDate ? format(internalSelectedDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={internalSelectedDate}
                  onSelect={(date) => date && setInternalSelectedDate(date)}
                  disabled={(date) => !availableDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Métricas Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalDia}</div>
                <p className="text-xs text-muted-foreground">pallets expedidos</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Média por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{mediaDia}</div>
                <p className="text-xs text-muted-foreground">pallets/hora</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Pico de Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{picoProducao.pallets}</div>
                <p className="text-xs text-muted-foreground">às {picoProducao.hora}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Melhor Turno</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {turnoData.reduce((max, current) => current.total > max.total ? current : max, turnoData[0])?.turno.split(' ')[1] || '-'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {turnoData.reduce((max, current) => current.total > max.total ? current : max, turnoData[0])?.total || 0} pallets
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Área - Produção por Hora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Produção por Hora
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorPallets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                    <XAxis 
                      dataKey="hora" 
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                      interval={1}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="pallets" 
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPallets)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance por Turno */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras por Turno */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance por Turno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={turnoData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="turno" 
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="total" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Detalhes dos Turnos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Detalhes dos Turnos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {turnoData.map((turno, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: turno.color }}
                        />
                        <span className="font-medium text-sm">{turno.turno}</span>
                      </div>
                      <Badge variant="secondary">{turno.total} pallets</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground ml-5">
                      Média: {turno.media} pallets/hora
                    </div>
                    {index < turnoData.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Botão para Fechar */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Fechar Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};