import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiltroGeral } from "./FiltroGeral";
import { KPICard } from "./KPICard";
import { loadRecebimentoMeData, getAvailableRecebimentoMeDates, getKPISummaryRecebimentoMe, type RecebimentoMeData } from "@/utils/recebimentoMeTsvLoader";
import { Package, Truck, Users, AlertCircle, CheckCircle, Clock, Phone, FileText, Info, TrendingUp, Activity } from "lucide-react";

// Função para formatar datas brasileiras
const formatBrazilianDate = (dateStr: string) => {
  const dateOnly = dateStr.split(' ')[0];
  if (dateOnly.includes('/')) {
    return dateOnly; // Já está no formato DD/MM/YYYY
  }
  return dateOnly;
};

export const RecebimentoMe = () => {
  const [selectedTurno, setSelectedTurno] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState<RecebimentoMeData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recebimentoData = await loadRecebimentoMeData();
        setData(recebimentoData);
        
        const dates = getAvailableRecebimentoMeDates(recebimentoData);
        setAvailableDates(dates);
        
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error('Error loading recebimento ME data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = selectedDate 
    ? data.filter(item => {
        const itemDate = item.data;
        if (itemDate.includes('/')) {
          const parts = itemDate.split('/');
          if (parts.length === 3) {
            const formatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            return formatted === selectedDate;
          }
        }
        return itemDate === selectedDate;
      })
    : data;

  const dayData = filteredData.length > 0 ? filteredData[0] : null;
  const kpiData = getKPISummaryRecebimentoMe(filteredData, selectedTurno);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderTurnoCard = (data: RecebimentoMeData, turno: string, turnoLabel: string) => {
    const veiculos = data[`veiculosRecebido${turno}` as keyof RecebimentoMeData] || data[`veiculosRecebidos${turno}` as keyof RecebimentoMeData] || '0';
    const pallets = data[`palletsRecebidos${turno}` as keyof RecebimentoMeData] || '0';
    const qualidadeSolicitados = data[`qualidadeSolicitados${turno}` as keyof RecebimentoMeData] || '0';
    const qualidadeEntregues = data[`qualidadeEntregues${turno}` as keyof RecebimentoMeData] || '0';
    const qualidadeReintegrados = data[`qualidadeReintegrados${turno}` as keyof RecebimentoMeData] || '0';
    const qualidadeEmDecida = data[`qualidadeEmDecida${turno}` as keyof RecebimentoMeData] || '0';
    const chamadosAbertos = data[`chamadosAbertos${turno}` as keyof RecebimentoMeData] || '0';
    const chamadosResolvidos = data[`chamadosResolvidos${turno}` as keyof RecebimentoMeData] || '0';
    const observacoes = data[`observacoes${turno}` as keyof RecebimentoMeData] || '';

    // Se não há dados para o turno, não renderizar o card
    if (veiculos === '0' && pallets === '0' && !observacoes) {
      return (
        <Card className="shadow-card border-muted/50 opacity-60">
          <CardHeader className="bg-gradient-to-r from-muted/20 to-muted/10">
            <CardTitle className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>{turnoLabel}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Sem dados para este turno</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>{turnoLabel}</span>
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10">
              {formatBrazilianDate(data.data)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Veículos e Pallets - Destaque Principal */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-4 text-white animate-glow">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm opacity-90">Veículos</span>
                </div>
                <p className="text-2xl font-bold">{veiculos}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Package className="h-5 w-5" />
                  <span className="text-sm opacity-90">Pallets</span>
                </div>
                <p className="text-2xl font-bold">{pallets}</p>
              </div>
            </div>
          </div>
          
          {/* Controle de Qualidade */}
          <div className="bg-gradient-to-r from-secondary to-primary/80 rounded-lg p-4 text-white">
            <h4 className="text-sm font-medium mb-3 opacity-90 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Controle de Qualidade
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs opacity-75">Solicitados</p>
                <p className="text-lg font-bold">{qualidadeSolicitados}</p>
              </div>
              <div className="text-center">
                <p className="text-xs opacity-75">Entregues</p>
                <p className="text-lg font-bold">{qualidadeEntregues}</p>
              </div>
              <div className="text-center">
                <p className="text-xs opacity-75">Reintegrados</p>
                <p className="text-lg font-bold">{qualidadeReintegrados}</p>
              </div>
              <div className="text-center">
                <p className="text-xs opacity-75">Em Descida</p>
                <p className="text-lg font-bold">{qualidadeEmDecida}</p>
              </div>
            </div>
          </div>
          
          {/* Chamados */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-lg p-3 border border-red-500/20">
              <div className="flex items-center space-x-2 mb-1">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-700 font-medium">Abertos</span>
              </div>
              <p className="text-lg font-bold text-red-700">{chamadosAbertos}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Resolvidos</span>
              </div>
              <p className="text-lg font-bold text-green-700">{chamadosResolvidos}</p>
            </div>
          </div>
          
          {/* Observações */}
          {observacoes && (
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Observações</span>
              </div>
              <p className="text-sm text-blue-700 leading-relaxed">{observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-3 sm:p-6 border border-border/50">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 animate-slide-up">
          Recebimento ME
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground animate-slide-up">
          Controle e gestão de recebimento de materiais e embalagens por data
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

      {/* KPIs - Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Veículos Programados"
          value={kpiData.totalVeiculosProgramados}
          subtitle="Total programados"
          icon={Users}
        />
        <KPICard
          title="Veículos Recebidos"
          value={kpiData.totalVeiculosRecebidos}
          subtitle="Total recebidos"
          icon={Truck}
        />
        <KPICard
          title="Total Pallets"
          value={kpiData.totalPallets}
          subtitle="Pallets recebidos"
          icon={Package}
        />
      </div>

      {/* Cards por Turno - Sempre Visíveis */}
      {dayData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderTurnoCard(dayData, '1T', 'TURNO 1')}
          {renderTurnoCard(dayData, '2T', 'TURNO 2')}
          {renderTurnoCard(dayData, '3T', 'TURNO 3')}
        </div>
      )}

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