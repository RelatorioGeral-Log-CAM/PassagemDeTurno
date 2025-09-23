import { useState, useEffect } from "react";
import { Activity, Sparkles, TrendingUp, Package, Users, Truck, Clock, BarChart3, Warehouse, CheckCircle2, AlertTriangle, FileText, Layers, Timer, ExternalLink, ArrowUpDown } from "lucide-react";
import { FiltroGeral } from "./FiltroGeral";
import { KPICard } from "./KPICard";
import { HoraHoraDashboard } from "./HoraHoraDashboard";
import { HoraHoraInline } from "./HoraHoraInline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadSeparacaoData, getAvailableDates, getKPISummarySeparacao, getTempoSemPNP, type SeparacaoData } from "@/utils/tsvLoader";
import { loadMateriaPrimaData, getAvailableMateriaPrimaDates, getKPISummaryMateriaPrima, type MateriaPrimaData } from "@/utils/materiaPrimaTsvLoader";
import { loadExpedicaoData, getAvailableExpedicaoDates, getKPISummaryExpedicao, type ExpedicaoData } from "@/utils/expedicaoTsvLoader";
import { loadRecebimentoMeData, getAvailableRecebimentoMeDates, getKPISummaryRecebimentoMe, type RecebimentoMeData } from "@/utils/recebimentoMeTsvLoader";
import { loadArmazemEstojosData, getAvailableDates as getAvailableArmazemEstojosDates, getKPISummaryArmazemEstojos, getTempoSemPNPArmazemEstojos, type ArmazemEstojosData } from "@/utils/armazemEstojosTsvLoader";
import { LinhasRodaramModal } from "./ArmazemEstojosKPIModals";
import { ArmazemEstojosPNPModal } from "./ArmazemEstojosPNPModal";
import { PNPHistoricoModal } from "./PNPHistoricoModal";
import { WebsiteModal } from "./WebsiteModal";

// Função para formatar datas brasileiras
const formatBrazilianDate = (dateStr: string) => {
  const dateOnly = dateStr.split(' ')[0];
  if (dateOnly.includes('/')) {
    return dateOnly; 
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
  const kpiExpedicao = getKPISummaryExpedicao(expedicaoData, selectedTurno, selectedDate);
  const kpiRecebimentoMe = getKPISummaryRecebimentoMe(filteredRecebimentoMeData, selectedTurno);
  const kpiArmazemEstojos = getKPISummaryArmazemEstojos(filteredArmazemEstojosData, selectedTurno);
  
  // Calcular tempo sem PNP usando todos os dados (não filtrados)
  const tempoSemPnp = getTempoSemPNP(separacaoData);
  const tempoSemPnpArmazemEstojos = getTempoSemPNPArmazemEstojos(armazemEstojosData);

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

          {/* Tempo sem PNP por Fábrica */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Tempo sem PNP por Fábrica:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PNPHistoricoModal data={separacaoData} fabrica="cremes">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800 transition-all hover:shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">Fábrica de Cremes</p>
                  </div>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{tempoSemPnp.cremes.status}</p>
                  {tempoSemPnp.cremes.ultimoPnp && (
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Último PNP: {tempoSemPnp.cremes.ultimoPnp.toLocaleString('pt-BR')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 opacity-70">
                    Clique para ver histórico completo
                  </p>
                </div>
              </PNPHistoricoModal>
              
              <PNPHistoricoModal data={separacaoData} fabrica="hidro">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Fábrica de Hidro</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{tempoSemPnp.hidro.status}</p>
                  {tempoSemPnp.hidro.ultimoPnp && (
                    <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                      Último PNP: {tempoSemPnp.hidro.ultimoPnp.toLocaleString('pt-BR')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 opacity-70">
                    Clique para ver histórico completo
                  </p>
                </div>
              </PNPHistoricoModal>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
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
              subtitle="Cargas Expedidas"
              icon={Truck}
              gradient="secondary"
              className="col-span-1"
            />
            <KPICard
              title="Dedutível"
              value={kpiExpedicao.totalDedutivel}
              subtitle="Pallets desceram"
              icon={Package}
              gradient="primary"
              className="col-span-1"
            />
            <KPICard
              title="FPLOG em Atraso"
              value={kpiExpedicao.totalFplogEmAtraso}
              subtitle="Cargas FPLOG"
              icon={AlertTriangle}
              gradient="accent"
              className="col-span-1"
            />
           <KPICard
              title="Mapa em Atraso"
              value={kpiExpedicao.totalMapaEmAtraso}
              subtitle="Cargas Mapa"
              icon={AlertTriangle}
              gradient="accent"
              className="col-span-1"
            />
           <KPICard
              title="Odisseia em Atraso"
              value={kpiExpedicao.totalOdisseiaEmAtraso}
              subtitle="Cargas Odisseia"
              icon={AlertTriangle}
              gradient="accent"
              className="col-span-1"
            />
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
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Pallets: </span>
                      <strong className="text-primary">{turno.palletsExpedidos.split('/')[0]}</strong>
                    </div>
                     <div>
                      <span className="text-muted-foreground">Cargas: </span>
                      <strong className="text-secondary">{turno.totalCargas}</strong>
                    </div>
                      <div>
                      <span className="text-muted-foreground">Dedutível: </span>
                      <strong className="text-primary">{turno.dedutivel.split('/')[0]}</strong>
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
          
          {/* Análise Hora a Hora */}
          <HoraHoraInline selectedDate={selectedDate} />
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
          
          {/* Recebimento */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Recebimento
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
              <KPICard
                title="NFs Recebidas"
                value={kpiMateriaPrima.totalNfRecebidas}
                subtitle="Notas fiscais"
                icon={FileText}
                gradient="accent"
                className="col-span-1"
              />
              <KPICard
                title="Lançadas"
                value={kpiMateriaPrima.totalLancadas}
                subtitle="Itens lançados"
                icon={TrendingUp}
                gradient="primary"
                className="col-span-1"
              />
            </div>
          </div>

          {/* Waves por Turno */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Waves por Turno
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 shadow-card hover:shadow-modern transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">Separação</h5>
                      <p className="text-xs text-muted-foreground">Waves em processo</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {kpiMateriaPrima.dataByTurno.map((turno, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-primary/5 rounded-md px-3 py-1">
                      <span className="text-xs font-medium text-muted-foreground">{turno.turno}</span>
                      <span className="text-sm font-bold text-primary">{turno.waves?.separacao || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4 border border-secondary/20 shadow-card hover:shadow-modern transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-secondary rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">Pesagem</h5>
                      <p className="text-xs text-muted-foreground">Waves em pesagem</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {kpiMateriaPrima.dataByTurno.map((turno, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-secondary/5 rounded-md px-3 py-1">
                      <span className="text-xs font-medium text-muted-foreground">{turno.turno}</span>
                      <span className="text-sm font-bold text-secondary">{turno.waves?.pesagem || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20 shadow-card hover:shadow-modern transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-accent rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">Fila</h5>
                      <p className="text-xs text-muted-foreground">Waves aguardando</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {kpiMateriaPrima.dataByTurno.map((turno, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-accent/5 rounded-md px-3 py-1">
                      <span className="text-xs font-medium text-muted-foreground">{turno.turno}</span>
                      <span className="text-sm font-bold text-accent">{turno.waves?.fila || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes por Turno - Matéria Prima */}
          <div className="mt-4 space-y-2">
            <h4 className="text-base font-medium text-muted-foreground">Detalhes por Turno:</h4>
            <div className="grid grid-cols-1 gap-3">
              {kpiMateriaPrima.dataByTurno.map((turno, index) => (
                <div key={index} className="bg-gradient-to-r from-secondary/10 to-accent/20 rounded-lg p-4 border border-secondary/20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold text-foreground">{turno.turno}</p>
                    <p className="text-sm text-muted-foreground">{turno.dataHora}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Agendadas: </span>
                      <strong className="text-primary text-base">{turno.agendadas}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recebidas: </span>
                      <strong className="text-secondary text-base">{turno.recebidas}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Qualidade Sol.: </span>
                      <strong className="text-accent text-base">{turno.qualidadeSolicitados}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Qualidade Atend.: </span>
                      <strong className="text-primary text-base">{turno.qualidadeAtendidos}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recebimento ME KPIs */}
      {filteredRecebimentoMeData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-primary to-secondary rounded-lg animate-glow">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Recebimento ME - KPIs
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Materiais e Embalagens • 2025</p>
              </div>
            </div>
            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          
          {/* Recebimento */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Recebimento
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <KPICard
                title="Veículos Programados"
                value={kpiRecebimentoMe.totalVeiculosProgramados}
                subtitle="Programados"
                icon={Package}
                gradient="primary"
                className="col-span-1"
              />
              <KPICard
                title="Veículos Recebidos"
                value={kpiRecebimentoMe.totalVeiculosRecebidos}
                subtitle="Processados"
                icon={CheckCircle2}
                gradient="secondary"
                className="col-span-1"
              />
              <KPICard
                title="Total Pallets"
                value={kpiRecebimentoMe.totalPallets}
                subtitle="Pallets processados"
                icon={Package}
                gradient="accent"
                className="col-span-1"
              />
                <KPICard
                title="Veículos Extras"
                value={kpiRecebimentoMe.totalVeiculosExtras}
                subtitle="Extras"
                icon={Truck}
                gradient="primary"
                className="col-span-1"
              />
                <KPICard
                title="Antecipados"
                value={kpiRecebimentoMe.totalAntecipados}
                subtitle="Antecipados"
                icon={Clock}
                gradient="secondary"
                className="col-span-1"
              />
              <KPICard
                title="No Show"
                value={kpiRecebimentoMe.totalNoShow}
                subtitle="Não compareceram"
                icon={AlertTriangle}
                gradient="accent"
                className="col-span-1"
              />
            </div>
            {/* Segunda linha de KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4">
              <KPICard
                title="Reprogramados"
                value={kpiRecebimentoMe.totalReprogramados}
                subtitle="Reagendados"
                icon={Timer}
                gradient="primary"
                className="col-span-1"
              />
            </div>
          </div>

          {/* Detalhes por Turno - Recebimento ME */}
            <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Detalhes por Turno:</h4>
            <div className="grid grid-cols-1 gap-3">
              {filteredRecebimentoMeData.flatMap((item, itemIndex) => {
                const turnos = [
                  {
                    turno: 'TURNO 1',
                    dataHora: formatBrazilianDate(item.data),
                    veiculos: parseInt(item.veiculosRecebido1T || '0'),
                    pallets: parseInt(item.palletsRecebidos1T || '0'),
                    chamadosAbertos: parseInt(item.chamadosAbertos1T || '0'),
                    chamadosResolvidos: parseInt(item.chamadosResolvidos1T || '0'),
                    key: `${itemIndex}-turno1`
                  },
                  {
                    turno: 'TURNO 2',
                    dataHora: formatBrazilianDate(item.data),
                    veiculos: parseInt(item.veiculosRecebido2T || '0'),
                    pallets: parseInt(item.palletsRecebidos2T || '0'),
                    chamadosAbertos: parseInt(item.chamadosAbertos2T || '0'),
                    chamadosResolvidos: parseInt(item.chamadosResolvidos2T || '0'),
                    key: `${itemIndex}-turno2`
                  },
                  {
                    turno: 'TURNO 3',
                    dataHora: formatBrazilianDate(item.data),
                    veiculos: parseInt(item.veiculosRecebidos3T || '0'),
                    pallets: parseInt(item.palletsRecebidos3T || '0'),
                    chamadosAbertos: parseInt(item.chamadosAbertos3T || '0'),
                    chamadosResolvidos: parseInt(item.chamadosResolvidos3T || '0'),
                    key: `${itemIndex}-turno3`
                  }
                ];
                return turnos;
              }).map((turno) => (
                <div key={turno.key} className="bg-gradient-to-r from-primary/10 to-secondary/20 rounded-lg p-3 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{turno.turno}</p>
                    <p className="text-xs text-muted-foreground">{turno.dataHora}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Veículos: </span>
                      <strong className="text-primary">{turno.veiculos}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pallets: </span>
                      <strong className="text-secondary">{turno.pallets}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cham. Abertos: </span>
                      <strong className="text-destructive">{turno.chamadosAbertos}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cham. Resolvidos: </span>
                      <strong className="text-green-600">{turno.chamadosResolvidos}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
         </div>
       )}

      {/* Armazém Estojos KPIs */}
      {filteredArmazemEstojosData.length > 0 && (
        <div className="bg-gradient-to-br from-card to-card/80 rounded-xl p-3 sm:p-6 border shadow-card animate-slide-up border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-accent to-primary rounded-lg animate-glow">
                <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground flex items-center gap-1 sm:gap-2">
                  Armazém Estojos - KPIs
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-accent animate-pulse" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Operações de Armazenagem • 2025</p>
              </div>
            </div>
            <Warehouse className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </div>
          
          {/* Armazenagem */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              Armazenagem
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
              <KPICard
                title="Cargas Programadas"
                value={kpiArmazemEstojos.totalCargasProgramadas}
                subtitle="Programadas"
                icon={Package}
                gradient="primary"
                className="col-span-1"
              />
              <KPICard
                title="Cargas Recebidas"
                value={kpiArmazemEstojos.totalCargasRecebidas}
                subtitle="Processadas"
                icon={CheckCircle2}
                gradient="secondary"
                className="col-span-1"
              />
              <KPICard
                title="Pallets Armazenados"
                value={kpiArmazemEstojos.totalPalletsArmazenados}
                subtitle="Armazenados"
                icon={Package}
                gradient="accent"
                className="col-span-1"
              />
              <KPICard
                title="Pallets Movimentados"
                value={kpiArmazemEstojos.totalPalletsMovimentados}
                subtitle="Movimentados"
                icon={Activity}
                gradient="primary"
                className="col-span-1"
              />
              <LinhasRodaramModal data={filteredArmazemEstojosData}>
                <KPICard
                  title="Linhas que Rodaram"
                  value={kpiArmazemEstojos.totalLinhasRodaram}
                  subtitle="Linhas ativas"
                  icon={TrendingUp}
                  gradient="secondary"
                  className="col-span-1"
                />
              </LinhasRodaramModal>
                <KPICard
                title="Campo Transitório"
                value={kpiArmazemEstojos.totalCamposTransitorios}
                subtitle="Tarefas transitórias"
                icon={ArrowUpDown}
                gradient="accent"
                className="col-span-1"
              />
            </div>
          </div>

          {/* Detalhes por Turno - Armazém Estojos */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Detalhes por Turno:</h4>
            <div className="space-y-3">
              {filteredArmazemEstojosData.map((item, index) => (
                <div key={`armazem-${index}`} className="bg-gradient-to-r from-accent/10 to-primary/20 rounded-lg p-4 border border-accent/20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">{item.turno}</p>
                    <p className="text-xs text-muted-foreground">{formatBrazilianDate(item.dataHora)}</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded p-3 text-center border border-primary/20">
                      <p className="text-xs text-muted-foreground font-semibold">Cargas Programadas</p>
                      <p className="text-lg font-bold text-foreground">{item.cargasProgramadas}</p>
                      <p className="text-xs text-muted-foreground">programadas</p>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/20 to-accent/10 rounded p-3 text-center border border-secondary/20">
                      <p className="text-xs text-muted-foreground font-semibold">Cargas Recebidas</p>
                      <p className="text-lg font-bold text-foreground">{item.cargasRecebidos}</p>
                      <p className="text-xs text-muted-foreground">recebidas</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded p-3 text-center border border-accent/20">
                      <p className="text-xs text-muted-foreground font-semibold">Pallets Armazenados</p>
                      <p className="text-lg font-bold text-foreground">{item.palletsArmazenados}</p>
                      <p className="text-xs text-muted-foreground">armazenados</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded p-3 text-center border border-primary/20">
                      <p className="text-xs text-muted-foreground font-semibold">Pallets Movimentados</p>
                      <p className="text-lg font-bold text-foreground">{item.palletsMovimentados}</p>
                      <p className="text-xs text-muted-foreground">movimentados</p>
                    </div>
                  </div>
                </div>
              ))}
             </div>
           </div>

           {/* Tempo sem PNP por Fábrica - Armazém Estojos */}
           <div className="mt-4 space-y-2">
             <h4 className="text-sm font-medium text-muted-foreground">Tempo sem PNP por Fábrica:</h4>
             <div className="grid grid-cols-1 gap-3">
               <ArmazemEstojosPNPModal data={armazemEstojosData}>
                 <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg cursor-pointer">
                   <div className="flex items-center space-x-2 mb-2">
                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                     <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Fábrica de Estojos</p>
                   </div>
                   <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{tempoSemPnpArmazemEstojos.status}</p>
                   {tempoSemPnpArmazemEstojos.ultimoPnp && (
                     <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                       Último PNP: {tempoSemPnpArmazemEstojos.ultimoPnp.toLocaleString('pt-BR')}
                     </p>
                   )}
                   <p className="text-xs text-muted-foreground mt-2 opacity-70">
                     Clique para ver histórico completo
                   </p>
                 </div>
               </ArmazemEstojosPNPModal>
             </div>
           </div>
         </div>
       )}

     </div>
   );
 };