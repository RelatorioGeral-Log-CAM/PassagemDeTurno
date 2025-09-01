import { useState, useEffect } from "react";
import { Activity, Sparkles, TrendingUp, Package, Users, Truck, Clock, BarChart3, Warehouse, CheckCircle2, AlertTriangle } from "lucide-react";
import { FiltroGeral } from "./FiltroGeral";
import { KPICard } from "./KPICard";
import { HoraHoraDashboard } from "./HoraHoraDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadSeparacaoData, getAvailableDates, getKPISummarySeparacao, type SeparacaoData } from "@/utils/tsvLoader";
import { loadMateriaPrimaData, getAvailableMateriaPrimaDates, getKPISummaryMateriaPrima, type MateriaPrimaData } from "@/utils/materiaPrimaTsvLoader";
import { loadExpedicaoData, getAvailableExpedicaoDates, getKPISummaryExpedicao, type ExpedicaoData } from "@/utils/expedicaoTsvLoader";
import { loadRecebimentoMeData, getAvailableRecebimentoMeDates, getKPISummaryRecebimentoMe, type RecebimentoMeData } from "@/utils/recebimentoMeTsvLoader";
import { loadArmazemEstojosData, getAvailableDates as getAvailableArmazemEstojosDates, getKPISummaryArmazemEstojos, type ArmazemEstojosData } from "@/utils/armazemEstojosTsvLoader";
import { LinhasRodaramModal } from "./ArmazemEstojosKPIModals";

// Função para formatar datas brasileiras
const formatBrazilianDate = (dateStr: string) => {
  const dateOnly = dateStr.split(' ')[0];
  if (dateOnly.includes('/')) {
    return dateOnly; // Já está no formato DD/MM/YYYY
  }
  return dateOnly;
};

export const Dashboard = () => {
  const [selectedTurno, setSelectedTurno] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [separacaoData, setSeparacaoData] = useState<SeparacaoData[]>([]);
  const [materiaPrimaData, setMateriaPrimaData] = useState<MateriaPrimaData[]>([]);
  const [expedicaoData, setExpedicaoData] = useState<ExpedicaoData[]>([]);
  const [recebimentoMeData, setRecebimentoMeData] = useState<RecebimentoMeData[]>([]);
  const [armazemEstojosData, setArmazemEstojosData] = useState<ArmazemEstojosData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [showHoraHora, setShowHoraHora] = useState(false);
  const [expandedMateriaPrima, setExpandedMateriaPrima] = useState<{[key: string]: boolean}>({});
  const [expandedExpedicao, setExpandedExpedicao] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const loadData = async () => {
      const [separacaoData, materiaPrimaData, expedicaoData, recebimentoMeData, armazemEstojosData] = await Promise.all([
        loadSeparacaoData(),
        loadMateriaPrimaData(),
        loadExpedicaoData(),
        loadRecebimentoMeData(),
        loadArmazemEstojosData()
      ]);
      
      setSeparacaoData(separacaoData);
      setMateriaPrimaData(materiaPrimaData);
      setExpedicaoData(expedicaoData);
      setRecebimentoMeData(recebimentoMeData);
      setArmazemEstojosData(armazemEstojosData);
      
      const separacaoDates = getAvailableDates(separacaoData);
      const materiaPrimaDates = getAvailableMateriaPrimaDates(materiaPrimaData);
      const expedicaoDates = getAvailableExpedicaoDates(expedicaoData);
      const recebimentoMeDates = getAvailableRecebimentoMeDates(recebimentoMeData);
      const armazemEstojosDates = getAvailableArmazemEstojosDates(armazemEstojosData);
      
      // Combinar datas únicas de todos os datasets
      const allDates = Array.from(new Set([...separacaoDates, ...materiaPrimaDates, ...expedicaoDates, ...recebimentoMeDates, ...armazemEstojosDates])).sort().reverse();
      setAvailableDates(allDates);
      
      if (allDates.length > 0) {
        setSelectedDate(allDates[0]);
      }
    };
    loadData();
  }, []);

  const filteredSeparacaoData = separacaoData.filter(item => {
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

  const filteredMateriaPrimaData = materiaPrimaData.filter(item => {
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

  const filteredExpedicaoData = expedicaoData.filter(item => {
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

  const filteredRecebimentoMeData = recebimentoMeData.filter(item => {
    if (!selectedDate) return true;
    
    // Converter a data do item de DD/MM/YYYY para YYYY-MM-DD para comparação
    const dateOnly = item.data.split(' ')[0];
    let itemDate = dateOnly;
    if (dateOnly.includes('/')) {
      const parts = dateOnly.split('/');
      if (parts.length === 3) {
        itemDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    
    return itemDate === selectedDate;
  });

  const filteredArmazemEstojosData = armazemEstojosData.filter(item => {
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

  const kpiSeparacao = getKPISummarySeparacao(filteredSeparacaoData, selectedTurno);
  const kpiMateriaPrima = getKPISummaryMateriaPrima(filteredMateriaPrimaData, selectedTurno);
  const kpiExpedicao = getKPISummaryExpedicao(filteredExpedicaoData, selectedTurno);
  const kpiRecebimentoMe = getKPISummaryRecebimentoMe(filteredRecebimentoMeData, selectedTurno);
  const kpiArmazemEstojos = getKPISummaryArmazemEstojos(filteredArmazemEstojosData, selectedTurno);

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header Section - Mobile Optimized */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3 sm:p-6 border border-border/50">
        <div className="max-w-4xl">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 animate-slide-up">
            Dashboard - Visão geral
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up">
            Monitore os relatórios principais de todas as áreas da logística em tempo real
          </p>
        </div>
      </div>

      {/* Filtros */}
      <FiltroGeral
        selectedTurno={selectedTurno}
        onTurnoChange={setSelectedTurno}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        availableDates={availableDates}
      />

      {/* Separação KPIs */}
      {filteredSeparacaoData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-accent rounded-lg animate-glow">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Separação - KPIs
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Sistema de Performance • 2025</p>
              </div>
            </div>
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <KPICard
              title="Total Linhas"
              value={kpiSeparacao.totalLinhas}
              subtitle="Hidro + Cremes"
              icon={Package}
              gradient="primary"
              className="col-span-1"
            />
            <KPICard
              title="Eficiência"
              value={`${kpiSeparacao.eficiencia}%`}
              subtitle={kpiSeparacao.temPnp ? "Baseada em PNP" : "Sem paradas"}
              icon={TrendingUp}
              gradient="accent"
              className="col-span-1"
            />
            <KPICard
              title="PNP Status"
              value={kpiSeparacao.temPnp ? "Teve PNP" : "Sem PNP"}
              subtitle="Status das paradas"
              icon={kpiSeparacao.temPnp ? AlertTriangle : CheckCircle2}
              gradient={kpiSeparacao.temPnp ? "accent" : "primary"}
              className="col-span-1"
            />
          </div>
          
          {/* Detalhes por Turno - Separação */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Detalhes por Turno:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {kpiSeparacao.dataByTurno.map((turno, index) => (
                <div key={index} className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-lg p-2 border border-primary/20">
                  <p className="text-xs font-medium text-muted-foreground">{turno.turno}</p>
                  <div className="flex justify-between text-xs">
                    <span>Hidro: <strong>{turno.hidro}</strong></span>
                    <span>Cremes: <strong>{turno.cremes}</strong></span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Total: <strong>{turno.total}</strong></span>
                    <span className={turno.temPnp ? "text-red-600" : "text-green-600"}>
                      {turno.temPnp ? "Com PNP" : "Sem PNP"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expedição KPIs */}
      {filteredExpedicaoData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-secondary rounded-lg animate-glow">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Expedição - KPIs
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Gestão de Expedição • 2025</p>
              </div>
            </div>
            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KPICard
              title="Total Pallets"
              value={kpiExpedicao.totalPallets}
              subtitle="Pallets expedidos"
              icon={Package}
              gradient="primary"
              className="col-span-1"
            />
            <KPICard
              title="Total Cargas"
              value={kpiExpedicao.totalCargas}
              subtitle="Cargas processadas"
              icon={Truck}
              gradient="secondary"
              className="col-span-1"
            />
            <KPICard
              title="Média Pallets/Turno"
              value={kpiExpedicao.avgPalletsPorTurno}
              subtitle="Por turno ativo"
              icon={TrendingUp}
              gradient="accent"
              className="col-span-1"
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
          
          {/* Detalhes dos turnos de expedição */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Detalhes por Turno:</h4>
            <div className="grid grid-cols-1 gap-3">
              {filteredExpedicaoData.map((turno, index) => (
                <div key={index} className="bg-gradient-to-r from-primary/10 to-secondary/20 rounded-lg p-3 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{turno.turno}</p>
                    <p className="text-xs text-muted-foreground">{turno.dataHora}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Pallets: </span>
                      <strong className="text-primary">{turno.palletsExpedidos.split('/')[0]}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cargas: </span>
                      <strong className="text-secondary">{turno.totalCargas}</strong>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-muted-foreground">Responsável: </span>
                    <strong>{turno.responsavel}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Matéria Prima KPIs */}
      {filteredMateriaPrimaData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-secondary to-primary rounded-lg animate-glow">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Matéria Prima - KPIs
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-secondary animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Operações de Recebimento • 2025</p>
              </div>
            </div>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            <KPICard
              title="Agendadas"
              value={kpiMateriaPrima.totalAgendadas}
              subtitle="Entregas do dia"
              icon={Package}
              gradient="primary"
              className="col-span-1"
            />
            <KPICard
              title="Recebidas"
              value={kpiMateriaPrima.totalRecebidas}
              subtitle="Processadas"
              icon={CheckCircle2}
              gradient="secondary"
              className="col-span-1"
            />
          </div>
          
          {/* Detalhes por Turno - Matéria Prima */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Detalhes por Turno:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {kpiMateriaPrima.dataByTurno.map((turno, index) => (
                <div key={index} className="bg-gradient-to-r from-primary/10 to-secondary/20 rounded-lg p-2 border border-primary/20">
                  <p className="text-xs font-medium text-muted-foreground">{turno.turno}</p>
                  <div className="flex justify-between text-xs">
                    <span>Agendadas: <strong>{turno.agendadas}</strong></span>
                    <span>Recebidas: <strong>{turno.recebidas}</strong></span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Qual.Solic: <strong>{turno.qualidadeSolicitados}</strong></span>
                    <span>Qual.Atend: <strong>{turno.qualidadeAtendidos}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recebimento ME Summary - Mobile Optimized */}
      {filteredRecebimentoMeData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-secondary rounded-lg animate-glow">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Recebimento ME
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium hidden sm:block">Materiais e Embalagens • 2025</p>
              </div>
            </div>
            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          
          {/* KPIs de Recebimento ME */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg p-3 text-center border border-primary/30">
              <p className="text-xs text-muted-foreground">Veículos Programados</p>
              <p className="text-lg font-bold text-primary">{kpiRecebimentoMe.totalVeiculosProgramados}</p>
              <p className="text-xs text-muted-foreground">programados</p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg p-3 text-center border border-primary/30">
              <p className="text-xs text-muted-foreground">Veículos Recebidos</p>
              <p className="text-lg font-bold text-primary">{kpiRecebimentoMe.totalVeiculosRecebidos}</p>
              <p className="text-xs text-muted-foreground">recebidos</p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg p-3 text-center border border-primary/30">
              <p className="text-xs text-muted-foreground">Total Pallets</p>
              <p className="text-lg font-bold text-primary">{kpiRecebimentoMe.totalPallets}</p>
              <p className="text-xs text-muted-foreground">processados</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filteredRecebimentoMeData.map((item, index) => {
              const totalVeiculos = (parseInt(item.veiculosRecebido1T || '0') + parseInt(item.veiculosRecebido2T || '0') + parseInt(item.veiculosRecebidos3T || '0'));
              const totalPallets = (parseInt(item.palletsRecebidos1T || '0') + parseInt(item.palletsRecebidos2T || '0') + parseInt(item.palletsRecebidos3T || '0'));
              
              return (
                <div key={`recebimento-${index}`} className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg p-3 sm:p-4 border border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-bounce-in">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">Recebimento do Dia</h4>
                      <p className="text-xs text-muted-foreground">{formatBrazilianDate(item.data)}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{totalVeiculos}</p>
                          <p className="text-xs text-muted-foreground">Veículos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{totalPallets}</p>
                          <p className="text-xs text-muted-foreground">Pallets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded p-2 text-center border border-primary/20">
                      <p className="text-xs text-muted-foreground">Turno 1</p>
                      <p className="font-semibold text-foreground text-sm">{item.veiculosRecebido1T || '0'} veículos</p>
                      <p className="text-xs text-muted-foreground">{item.palletsRecebidos1T || '0'} pallets</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded p-2 text-center border border-primary/20">
                      <p className="text-xs text-muted-foreground">Turno 2</p>
                      <p className="font-semibold text-foreground text-sm">{item.veiculosRecebido2T || '0'} veículos</p>
                      <p className="text-xs text-muted-foreground">{item.palletsRecebidos2T || '0'} pallets</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded p-2 text-center border border-primary/20">
                      <p className="text-xs text-muted-foreground">Turno 3</p>
                      <p className="font-semibold text-foreground text-sm">{item.veiculosRecebidos3T || '0'} veículos</p>
                      <p className="text-xs text-muted-foreground">{item.palletsRecebidos3T || '0'} pallets</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded p-2 text-center border border-red-500/20">
                      <p className="text-xs text-red-700">Chamados Abertos</p>
                      <p className="font-semibold text-red-700 text-sm">
                        {(parseInt(item.chamadosAbertos1T || '0') + parseInt(item.chamadosAbertos2T || '0') + parseInt(item.chamadosAbertos3T || '0'))}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded p-2 text-center border border-green-500/20">
                      <p className="text-xs text-green-700">Chamados Resolvidos</p>
                      <p className="font-semibold text-green-700 text-sm">
                        {(parseInt(item.chamadosResolvidos1T || '0') + parseInt(item.chamadosResolvidos2T || '0') + parseInt(item.chamadosResolvidos3T || '0'))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Armazém Estojos Summary - Mobile Optimized */}
      {filteredArmazemEstojosData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-accent to-secondary rounded-lg animate-glow">
                <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Armazém Estojos
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-accent animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium hidden sm:block">Controle de Armazenagem • 2025</p>
              </div>
            </div>
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </div>

          {/* KPIs Section */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg p-3 text-center border border-primary/30">
              <p className="text-xs text-muted-foreground">Cargas Programadas</p>
              <p className="text-lg font-bold text-primary">{kpiArmazemEstojos.totalCargasProgramadas}</p>
            </div>
            <div className="bg-gradient-to-br from-secondary/20 to-accent/10 rounded-lg p-3 text-center border border-secondary/30">
              <p className="text-xs text-muted-foreground">Cargas Recebidas</p>
              <p className="text-lg font-bold text-secondary">{kpiArmazemEstojos.totalCargasRecebidas}</p>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-lg p-3 text-center border border-accent/30">
              <p className="text-xs text-muted-foreground">Pallets Armazenados</p>
              <p className="text-lg font-bold text-accent">{kpiArmazemEstojos.totalPalletsArmazenados}</p>
            </div>
            <LinhasRodaramModal data={filteredArmazemEstojosData}>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-lg p-3 text-center border border-primary/30 cursor-pointer hover:shadow-lg transition-all">
                <p className="text-xs text-muted-foreground">Linhas que Rodaram</p>
                <p className="text-lg font-bold text-primary">{kpiArmazemEstojos.totalLinhasRodaram}</p>
              </div>
            </LinhasRodaramModal>
            <div className="bg-gradient-to-br from-secondary/20 to-accent/10 rounded-lg p-3 text-center border border-secondary/30">
              <p className="text-xs text-muted-foreground">Status PNP</p>
              <p className="text-lg font-bold text-secondary">
                {filteredArmazemEstojosData.filter(item => !item.reportarPNP.toLowerCase().includes('sem pnp')).length}
              </p>
              <p className="text-xs text-muted-foreground">
                {filteredArmazemEstojosData.filter(item => item.reportarPNP.toLowerCase().includes('sem pnp')).length} sem PNP
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filteredArmazemEstojosData.map((item, index) => (
              <div key={`armazem-${index}`} className="bg-gradient-to-br from-accent/10 to-secondary/20 rounded-lg p-3 sm:p-4 border border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 animate-bounce-in">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">{item.turno}</h4>
                    <p className="text-xs text-muted-foreground">{formatBrazilianDate(item.dataHora)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-accent">{item.cargasProgramadas}</p>
                        <p className="text-xs text-muted-foreground">Programadas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-accent">{item.palletsArmazenados}</p>
                        <p className="text-xs text-muted-foreground">Armazenados</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded p-2 text-center border border-primary/20">
                    <p className="text-xs text-muted-foreground">Cargas Programadas</p>
                    <p className="font-semibold text-foreground text-sm">{item.cargasProgramadas}</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/20 to-accent/10 rounded p-2 text-center border border-secondary/20">
                    <p className="text-xs text-muted-foreground">Cargas Recebidas</p>
                    <p className="font-semibold text-foreground text-sm">{item.cargasRecebidos}</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent/20 to-secondary/10 rounded p-2 text-center border border-accent/20">
                    <p className="text-xs text-muted-foreground">Pallets Armazenados</p>
                    <p className="font-semibold text-foreground text-sm">{item.palletsArmazenados}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Hora a Hora */}
      <HoraHoraDashboard 
        isOpen={showHoraHora}
        onClose={() => setShowHoraHora(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};