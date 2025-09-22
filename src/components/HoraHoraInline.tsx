import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Activity, Package } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, LabelList } from "recharts";
import { loadHoraHoraData, getHoraHoraByDate, getHourlyDataForChart, type HoraHoraData } from "@/utils/horaHoraTsvLoader";

interface HoraHoraInlineProps {
  selectedDate: string;
}

const chartConfig = {
  pallets: {
    label: "Pallets",
    color: "hsl(var(--primary))",
  },
};

export const HoraHoraInline = ({ selectedDate }: HoraHoraInlineProps) => {
  const [horaHoraData, setHoraHoraData] = useState<HoraHoraData[]>([]);
  const [currentDayData, setCurrentDayData] = useState<HoraHoraData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadHoraHoraData();
      setHoraHoraData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (horaHoraData.length > 0 && selectedDate) {
      const dayData = getHoraHoraByDate(horaHoraData, selectedDate);
      setCurrentDayData(dayData);
    }
  }, [horaHoraData, selectedDate]);

  if (loading) {
    return (
      <div className="mt-4 space-y-3 animate-pulse">
        <h4 className="text-sm font-medium text-muted-foreground">Hora a Hora:</h4>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="h-48 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!currentDayData) {
    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Hora a Hora:</h4>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Dados não disponíveis para {new Date(selectedDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    );
  }

  const hourlyChartData = getHourlyDataForChart(currentDayData);
  
  const turnoData = [
    { 
      turno: "Turno 1", 
      total: currentDayData.total1T,
      media: currentDayData.media1T,
    },
    { 
      turno: "Turno 2", 
      total: currentDayData.total2T,
      media: currentDayData.media2T,
    },
    { 
      turno: "Turno 3", 
      total: currentDayData.total3T,
      media: currentDayData.media3T,
    }
  ];

  const totalDia = currentDayData.total1T + currentDayData.total2T + currentDayData.total3T;
  const mediaDia = Math.round(totalDia / 24);

  // Encontrar pico de produção
  const picoProducao = hourlyChartData.reduce((max, current) => 
    current.pallets > max.pallets ? current : max, 
    { hora: '', pallets: 0, turno: '' }
  );

  // Melhor turno
  const melhorTurno = turnoData.reduce((max, current) => current.total > max.total ? current : max, turnoData[0]);

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Hora a Hora:
      </h4>
      
      {/* Métricas Compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total do Dia</p>
              <p className="text-lg font-bold text-primary">{totalDia}</p>
            </div>
            <Package className="h-4 w-4 text-primary" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg p-3 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Média/Hora</p>
              <p className="text-lg font-bold text-secondary">{mediaDia}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-3 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pico</p>
              <p className="text-lg font-bold text-accent">{picoProducao.pallets}</p>
              <p className="text-xs text-muted-foreground">{picoProducao.hora}</p>
            </div>
            <Activity className="h-4 w-4 text-accent" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Melhor Turno</p>
              <p className="text-lg font-bold text-foreground">{melhorTurno.turno}</p>
              <p className="text-xs text-muted-foreground">{melhorTurno.total} pallets</p>
            </div>
            <Badge variant="secondary" className="text-xs">{melhorTurno.media}/h</Badge>
          </div>
        </div>
      </div>

      {/* Gráficos Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Produção por Hora */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Produção por Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="hora" 
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="pallets" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Produção por Turno */}
        <Card className="border-border/50">
          <CardHeader className="pb-100">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Produção por Turno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnoData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="turno" 
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList 
                      dataKey="total" 
                      position='outside'
                      style={{ fontSize: '12px',fontWeight: '800', fill: 'hsl(var(--foreground))'}}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Turno Compacta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {turnoData.map((turno, index) => (
          <div key={index} className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">{turno.turno}</p>
              <Badge variant="outline" className="text-xs">{turno.total}</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span>Média: <strong>{turno.media}/h</strong></span>
              <span className={turno.total > 0 ? "text-green-600" : "text-muted-foreground"}>
                {turno.total > 0 ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};