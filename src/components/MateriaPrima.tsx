import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiltroGeral } from "./FiltroGeral";
import { loadMateriaPrimaData, getAvailableMateriaPrimaDates, getKPISummaryMateriaPrima, type MateriaPrimaData } from "@/utils/materiaPrimaTsvLoader";
import { Clock, Truck, Package, AlertCircle, CheckCircle2, Info, Users, BarChart3, TrendingUp, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "./KPICard";

// Função para formatar datas brasileiras
const formatBrazilianDate = (dateStr: string) => {
  const dateOnly = dateStr.split(' ')[0];
  if (dateOnly.includes('/')) {
    return dateOnly; // Já está no formato DD/MM/YYYY
  }
  return dateOnly;
};

export const MateriaPrima = () => {
  const [selectedTurno, setSelectedTurno] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [materiaPrimaData, setMateriaPrimaData] = useState<MateriaPrimaData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadMateriaPrimaData();
      setMateriaPrimaData(data);
      const dates = getAvailableMateriaPrimaDates(data);
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    };
    loadData();
  }, []);
  
  const filteredData = materiaPrimaData.filter(item => {
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

  const kpiMateriaPrima = getKPISummaryMateriaPrima(filteredData, selectedTurno);

  const renderDataCard = (data: MateriaPrimaData) => (
    <Card className="shadow-card hover:shadow-modern transition-all duration-300 hover:scale-[1.02] border-accent/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>{data.turno}</span>
          </CardTitle>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="outline" className="bg-secondary/10">
              {formatBrazilianDate(data.dataHora)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {data.responsavel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <Tabs defaultValue="docas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="docas" className="text-xs sm:text-sm p-2">Docas</TabsTrigger>
            <TabsTrigger value="recebimento" className="text-xs sm:text-sm p-2">Recebimento</TabsTrigger>
            <TabsTrigger value="waves" className="text-xs sm:text-sm p-2">Waves</TabsTrigger>
            <TabsTrigger value="contagem" className="text-xs sm:text-sm p-2">Qualidade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="docas" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <InfoRow label="Doca 19" value={data.doca19 || '0'} icon={Truck} />
              <InfoRow label="Doca 20" value={data.doca20 || '0'} icon={Truck} />
              <InfoRow label="Doca 21" value={data.doca21 || '0'} icon={Truck} />
              <InfoRow label="Doca 22" value={data.doca22 || '0'} icon={Truck} />
              <InfoRow label="Doca 23" value={data.doca23 || '0'} icon={Truck} />
              <InfoRow label="Doca 24" value={data.doca24 || '0'} icon={Truck} />
              <InfoRow label="Doca 25" value={data.doca25 || '0'} icon={Truck} />
              <InfoRow label="Doca 26" value={data.doca26 || '0'} icon={Truck} />
            </div>
          </TabsContent>
          
          <TabsContent value="recebimento" className="space-y-3 mt-4">
            <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white animate-glow">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm opacity-90">Agendadas</p>
                  <p className="text-xl font-bold">{data.agendadas}</p>
                </div>
                <Package className="h-6 w-6 opacity-80" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Recebidas</p>
                  <p className="text-xl font-bold">{data.recebidas}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 opacity-80" />
              </div>
            </div>
            <InfoRow label="Back Log" value={data.backLog || 'Sem informações'} icon={AlertCircle} />
            <InfoRow label="Lançadas" value={data.lancadas || 'Sem informações'} icon={CheckCircle2} />
            <InfoRow label="Pendentes de TU" value={data.pendentesTu || 'Sem informações'} icon={AlertCircle} />
            <InfoRow label="NF Pendentes" value={data.nfPendentes || 'Sem informações'} icon={AlertCircle} />
          </TabsContent>
          
          <TabsContent value="waves" className="space-y-3 mt-4">
            <InfoRow label="Wave em Separação" value={data.waveSeparacao || 'Sem informações'} icon={Package} />
            <InfoRow label="Wave em Pesagem" value={data.wavePesagem || 'Sem informações'} icon={BarChart3} />
            <InfoRow label="Wave na Eclusa" value={data.waveEclusa || 'Sem informações'} icon={Package} />
            <InfoRow label="Waves Separadas" value={data.wavesSeparadas || 'Sem informações'} icon={CheckCircle2} />
            <InfoRow label="Wave em Fila" value={data.waveFila || 'Sem informações'} icon={AlertCircle} />
          </TabsContent>
          
          <TabsContent value="contagem" className="space-y-3 mt-4">
            <div className="bg-gradient-to-r from-secondary to-primary rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm opacity-90">Qualidade Solicitados</p>
                  <p className="text-xl font-bold">{data.qualidadeSolicitados}</p>
                </div>
                <Users className="h-6 w-6 opacity-80" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Qualidade Atendidos</p>
                  <p className="text-xl font-bold">{data.qualidadeAtendidos}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 opacity-80" />
              </div>
            </div>
            <InfoRow label="Itens Contados" value={data.itensContados || '0'} icon={BarChart3} />
            <InfoRow label="Itens Recontados" value={data.itensRecontados || '0'} icon={AlertCircle} />
            
            {data.observacoes && (
              <div className="mt-4">
                <InfoRow label="Observações" value={data.observacoes} icon={Info} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-3 sm:p-6 border border-border/50">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 animate-slide-up">
          Matéria Prima
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up">
          Controle e gestão de recebimento de matéria prima por turno
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

      {/* KPIs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 animate-slide-up">
        <KPICard
          title="Total Agendadas"
          value={kpiMateriaPrima.totalAgendadas}
          subtitle="Entregas do dia"
          icon={Package}
          gradient="primary"
        />
        <KPICard
          title="Total Recebidas"
          value={kpiMateriaPrima.totalRecebidas}
          subtitle="Entregas processadas"
          icon={CheckCircle2}
          gradient="secondary"
        />
      </div>

      {/* Data Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-4 transition-all duration-500">
        {filteredData.map((data, index) => (
          <div key={`${data.turno}-${data.dataHora}-${index}`} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
            {renderDataCard(data)}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium text-muted-foreground">Nenhum dado encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Não há dados disponíveis para o filtro selecionado.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  icon: any;
}

const InfoRow = ({ label, value, icon: Icon }: InfoRowProps) => {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/30 border-border/50 text-muted-foreground transition-all duration-300 hover:bg-muted/50 hover:shadow-sm animate-slide-up">
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
        <p className="text-sm font-medium mt-1 break-words">{value}</p>
      </div>
    </div>
  );
};