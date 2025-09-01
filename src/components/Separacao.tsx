import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiltroGeral } from "./FiltroGeral";
import { loadSeparacaoData, getAvailableDates, getKPISummarySeparacao, type SeparacaoData } from "@/utils/tsvLoader";
import { Clock, Package, AlertCircle, CheckCircle2, Info, Truck, Activity, TrendingUp, BarChart3, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "./KPICard";
import { LinhasModal, PNPModal } from "./SeparacaoKPIModals";

// Função para formatar datas brasileiras
const formatBrazilianDate = (dateStr: string) => {
  const dateOnly = dateStr.split(' ')[0];
  if (dateOnly.includes('/')) {
    return dateOnly; // Já está no formato DD/MM/YYYY
  }
  return dateOnly;
};

export const Separacao = () => {
  const [selectedTurno, setSelectedTurno] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [separacaoData, setSeparacaoData] = useState<SeparacaoData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadSeparacaoData();
      setSeparacaoData(data);
      const dates = getAvailableDates(data);
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    };
    loadData();
  }, []);
  
  const filteredData = separacaoData.filter(item => {
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

  const kpiSeparacao = getKPISummarySeparacao(filteredData, selectedTurno);

  const renderDataCard = (data: SeparacaoData) => (
    <Card className="shadow-card hover:shadow-modern transition-all duration-300 hover:scale-[1.02] border-accent/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>{data.turno}</span>
          </CardTitle>
          <Badge variant="outline" className="bg-secondary/10">
            {formatBrazilianDate(data.dataHora)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Qtd Linhas - Destaque */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white animate-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Quantidade de Linhas</p>
              <p className="text-2xl font-bold">{data.qtdLinhas}</p>
            </div>
            <Package className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <Tabs defaultValue="operacional" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="operacional" className="text-xs sm:text-sm p-2">Operacional I</TabsTrigger>
            <TabsTrigger value="qualidade" className="text-xs sm:text-sm p-2">Operacional II</TabsTrigger>
            <TabsTrigger value="observacoes" className="text-xs sm:text-sm p-2">Observações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operacional" className="space-y-3 mt-4">
            <InfoRow label="Mista 2" value={data.mista2} icon={Truck} />
            <InfoRow label="Mista 3" value={data.mista3} icon={Truck} />
            <InfoRow label="CCME" value={data.ccme} icon={CheckCircle2} />
            <InfoRow label="Buffer" value={data.buffer} icon={Package} />
            <InfoRow label="3AB" value={data.ab3} icon={Package} />
          </TabsContent>
          
          <TabsContent value="qualidade" className="space-y-3 mt-4">
            <InfoRow label="PNP" value={data.pnp} icon={AlertCircle} />
            {!data.pnp.toLowerCase().includes('sem pnp') && data.detalhesPnp && (
              <InfoRow label="Detalhes PNP" value={data.detalhesPnp} icon={Info} />
            )}
            {!data.pnp.toLowerCase().includes('sem pnp') && data.observacaoPnp && (
              <InfoRow label="Observação PNP" value={data.observacaoPnp} icon={AlertCircle} />
            )}
            <InfoRow label="Contagem" value={data.contagem} icon={CheckCircle2} />
            <InfoRow label="Retrabalho" value={data.retrabalho} icon={AlertCircle} />
            <InfoRow label="RIM" value={data.rim || 'Sem informações'} icon={Info} />
          </TabsContent>
          
          <TabsContent value="observacoes" className="space-y-3 mt-4">
            <InfoRow label="Campos e Tarefas" value={data.camposTarefas} icon={Info} />
            {data.observacaoGeral && (
              <InfoRow label="Observação Geral" value={data.observacaoGeral} icon={AlertCircle} />
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
          Detalhes da Separação
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up">
          Informações completas dos turnos de separação e controle operacional
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
        <LinhasModal data={filteredData}>
          <div className="cursor-pointer">
            <KPICard
              title="Total de Linhas"
              value={kpiSeparacao.totalLinhas}
              subtitle="Clique para ver detalhes"
              icon={Package}
              gradient="primary"
            />
          </div>
        </LinhasModal>
        
        <KPICard
          title="Eficiência"
          value={`${kpiSeparacao.eficiencia}%`}
          subtitle={kpiSeparacao.temPnp ? "Baseada em PNP" : "Sem paradas"}
          icon={TrendingUp}
          gradient="accent"
          trend={kpiSeparacao.eficiencia >= 80 ? { value: kpiSeparacao.eficiencia - 75, isPositive: true } : undefined}
        />
        
        <PNPModal data={filteredData}>
          <div className="cursor-pointer">
            <KPICard
              title="PNP Status"
              value={kpiSeparacao.temPnp ? "Teve PNP" : "Sem PNP"}
              subtitle="Clique para ver detalhes"
              icon={kpiSeparacao.temPnp ? AlertTriangle : CheckCircle2}
              gradient="primary"
            />
          </div>
        </PNPModal>
      </div>

      {/* Data Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-4 transition-all duration-500">
        {filteredData.map((data, index) => (
          <div key={data.turno} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
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