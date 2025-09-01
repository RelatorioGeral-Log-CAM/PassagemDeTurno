import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiltroGeral } from "./FiltroGeral";
import { loadArmazemEstojosData, getAvailableDates, getKPISummaryArmazemEstojos, type ArmazemEstojosData } from "@/utils/armazemEstojosTsvLoader";
import { KPICard } from "./KPICard";
import { LinhasRodaramModal } from "./ArmazemEstojosKPIModals";
import { Clock, Package, AlertCircle, CheckCircle2, Info, Truck, Warehouse, Archive, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Função para formatar datas brasileiras
const formatBrazilianDate = (dateStr: string) => {
  const dateOnly = dateStr.split(' ')[0];
  if (dateOnly.includes('/')) {
    return dateOnly; // Já está no formato DD/MM/YYYY
  }
  return dateOnly;
};

export const ArmazemEstojos = () => {
  const [selectedTurno, setSelectedTurno] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [armazemEstojosData, setArmazemEstojosData] = useState<ArmazemEstojosData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadArmazemEstojosData();
      setArmazemEstojosData(data);
      const dates = getAvailableDates(data);
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    };
    loadData();
  }, []);
  
  const filteredData = armazemEstojosData.filter(item => {
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

  const kpiArmazemEstojos = getKPISummaryArmazemEstojos(filteredData, selectedTurno);

  const renderDataCard = (data: ArmazemEstojosData) => (
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
        {/* Cargas e Pallets - Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white animate-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Cargas Programadas</p>
                <p className="text-2xl font-bold">{data.cargasProgramadas}</p>
              </div>
              <Truck className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary to-accent rounded-lg p-4 text-white animate-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Cargas Recebidas</p>
                <p className="text-2xl font-bold">{data.cargasRecebidos}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-accent to-primary rounded-lg p-4 text-white animate-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pallets Armazenados</p>
                <p className="text-2xl font-bold">{data.palletsArmazenados}</p>
              </div>
              <Warehouse className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="operacional" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="operacional" className="text-xs sm:text-sm p-2">Operacional I</TabsTrigger>
            <TabsTrigger value="qualidade" className="text-xs sm:text-sm p-2">Operacional II</TabsTrigger>
            <TabsTrigger value="observacoes" className="text-xs sm:text-sm p-2">Observações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operacional" className="space-y-3 mt-4">
            <InfoRow label="Cargas Recebidas" value={data.cargasRecebidos} icon={CheckCircle2} />
            <InfoRow label="Cargas Pendentes" value={data.cargasPendentes} icon={AlertCircle} />
            <InfoRow label="Linhas que rodaram" value={data.qtdLinhasRodaram} icon={Activity} />
            <InfoRow label="Material Secundário" value={data.materialSecundario} icon={Package} />
            <InfoRow label="Pallets de ME" value={data.palletsDeME} icon={Warehouse} />
            <InfoRow label="Status PNP" value={data.reportarPNP} icon={data.reportarPNP.toLowerCase().includes('sem pnp') ? CheckCircle2 : AlertCircle} />
          </TabsContent>
          
          <TabsContent value="qualidade" className="space-y-3 mt-4">
            <InfoRow label="Qualidade" value={data.qualidade} icon={CheckCircle2} />
            <InfoRow label="Reportar PNP" value={data.reportarPNP} icon={AlertCircle} />
            {!data.reportarPNP.toLowerCase().includes('sem pnp') && data.observacoesPNP && (
              <InfoRow label="Observações PNP" value={data.observacoesPNP} icon={Info} />
            )}
            <InfoRow label="CCME" value={data.ccme} icon={CheckCircle2} />
            <InfoRow label="Buffer de Papelão" value={data.bufferPapelao} icon={Package} />
            <InfoRow label="Contagem" value={data.contagem} icon={CheckCircle2} />
            <InfoRow label="Retrabalho" value={data.retrabalho} icon={AlertCircle} />
            <InfoRow label="RIM" value={data.rim || 'Sem informações'} icon={Info} />
          </TabsContent>
          
          <TabsContent value="observacoes" className="space-y-3 mt-4">
            <InfoRow label="Campos Transitórios / Tarefas Pendentes" value={data.camposTransitorios} icon={Info} />
            {data.observacoesGerais && (
              <InfoRow label="Observações Gerais" value={data.observacoesGerais} icon={AlertCircle} />
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
          Armazém de Estojos
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up">
          Controle de armazenagem e movimentação de estojos
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard
          title="Cargas Programadas"
          value={kpiArmazemEstojos.totalCargasProgramadas}
          icon={Truck}
          gradient="primary"
        />
        <KPICard
          title="Cargas Recebidas"
          value={kpiArmazemEstojos.totalCargasRecebidas}
          icon={CheckCircle2}
          gradient="secondary"
        />
        <KPICard
          title="Pallets Armazenados"
          value={kpiArmazemEstojos.totalPalletsArmazenados}
          icon={Warehouse}
          gradient="accent"
        />
        <LinhasRodaramModal data={filteredData}>
          <div className="cursor-pointer">
            <KPICard
              title="Linhas que Rodaram"
              value={kpiArmazemEstojos.totalLinhasRodaram}
              icon={Activity}
              gradient="primary"
            />
          </div>
        </LinhasRodaramModal>
        <KPICard
          title="Status PNP"
          value={filteredData.filter(item => !item.reportarPNP.toLowerCase().includes('sem pnp')).length}
          subtitle={`${filteredData.filter(item => item.reportarPNP.toLowerCase().includes('sem pnp')).length} sem PNP`}
          icon={AlertCircle}
          gradient="secondary"
        />
      </div>

      {/* Data Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-4 transition-all duration-500">
        {filteredData.map((data, index) => (
          <div key={`${data.turno}-${data.dataHora}`} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
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