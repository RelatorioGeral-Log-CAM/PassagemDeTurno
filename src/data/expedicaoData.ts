export interface ExpedicaoData {
  turno: string;
  dataHora: string;
  palletsExpedidos: string;
  totalCargas: string;
  emDescida: string;
  zonaMista: string;
  pisoNovoArmazem: string;
  fifo1: string;
  fifo2: string;
  fifo3: string;
  fifo4: string;
  fifo5: string;
  observacao: string;
  responsavel: string;
}

export const expedicaoData: ExpedicaoData[] = [
  {
    turno: "TURNO 1",
    dataHora: "06/08/2025",
    palletsExpedidos: "27/11/1900",
    totalCargas: "8",
    emDescida: "* REGISTRO\n* DEVOLUÇÃO\n* 04 PALLETS PARA INVENTÁRIO",
    zonaMista: "",
    pisoNovoArmazem: "* DEVOLUÇÃO RÓTULO - AG. COLETA\n* DEVOLUÇÃO MP - AG. COLETA\n* ADER. PARANÁ (898824739) 05.08 - PEND. TM\n* ADER. REGISTRO (898824692) 05.08 - PEND. TM\n* 04 PLTS VARGINHA - FIFO5A (AGUARDANDO RESTANTE DO MAPA)\n* DEVOLUÇÃO FILME EM DESCIDA",
    fifo1: "* REGISTRO - PEND. CRIAR REMESSA\n* DEDUTÍVEL PAPEL E PA NÃO INFLAMÁVEL -SEPARADO\n* FPLOG - PEND. FATURAR",
    fifo2: "* DEVOLUÇÃO - EM DESCIDA\n* REGISTRO - PEND. CRIAR REMESSA",
    fifo3: "* SGC 898832842 - PEND. TM\n* AD. SGC 05/08 898833258 - PEND TM",
    fifo4: "* F1 - 47 PLT FIFO 4 - PEND. CRIAR REMESSA",
    fifo5: "* F1 - PEND. ESTORNO",
    observacao: "* 04 PLTS INVENTÁRIO EM DESCIDA - ITEM 415041.00\n* PEND. MAPEAR ADERÊNCIA SGC 06/08\n* ATUAÇÃO EM CAMPO TRANSITÓRIO E TAREFAS\n* DEVOLUÇÕES EM DESCIDA",
    responsavel: "Sandy Santos"
  },
  {
    turno: "TURNO 2",
    dataHora: "06/08/2025",
    palletsExpedidos: "02/10/1901",
    totalCargas: "19",
    emDescida: "REGISTRO 06/08\nVARGINHA 06/08\nAD SGC 06/08\nDEVOLUÇÃO",
    zonaMista: "DEVOLUÇÃO - 4 PALETES SEPARADOS E 1 PALETE PARA SEPARA\nDEVOLUÇÃO RÓTULO - AG. COLETA\nDEVOLUÇÃO MP - AG. COLETA\nADER. PARANÁ (898824739) 05.08 - PEND. TM\n04 PLT INVENTÁRIO - 415041.00",
    pisoNovoArmazem: "ZERADO",
    fifo1: "VARGINHA FINALIZADO - PENDENTE CRIAR REMESSA\n04 PLTS VARGINHA - FIFO5A (AGUARDANDO RESTANTE DO MAPA) - CRIAR REMESSA\nDEDUTÍVEL PAPEL E PA NÃO INFLAMÁVEL -SEPARADO\nFPLOG - PEND. FATURAR",
    fifo2: "DEVOLUÇÃO EM SEPARAÇÃO\nAD SGC 06.08 EM DESCIDA",
    fifo3: "VARGINHA FINALIZADO - PENDENTE SPLIT\nREGISTRO EM DESCIDA",
    fifo4: "F1 - PENDENTE CRIAR REMESSA\nF1 - PENDENTE CONTINUAR CARREGAMENTO\nF1 - 1 FILEIRA SEPARADA NO FIFO 5\nF1 - 1 FILEIRA PARA ESTORNAR",
    fifo5: "F1 - EM CARREGAMENTO\nF1 - 2 FILEIRAS SEPARADAS NO FIFO 5 SISTEMICO",
    observacao: "AREA DE DIVERGENCIA TEMOS 11 PALETES DE SOBRA DE VARGINHA - PENDENTE CRIAR REMESSA\nPENDENTE SOLICITAR A DESCIDA DE PARANÁ 06/08\nPENDENTE MAPEAR AD DO DIA 06/08\nPENDENTE CRIAR LISTA DO DIA 07/08: PARANÁ, SGC, REGISTRO,",
    responsavel: "Beatriz Suzart"
  }
];

export const getTurnosExpedicao = (): string[] => {
  return Array.from(new Set(expedicaoData.map(item => item.turno)));
};

export const getKPISummaryExpedicao = (turnoFilter: string = 'todos') => {
  const filteredData = turnoFilter === 'todos' 
    ? expedicaoData 
    : expedicaoData.filter(item => item.turno === turnoFilter);

  const totalPallets = filteredData.reduce((acc, item) => {
    // Extrair números da string de pallets expedidos
    const pallets = parseInt(item.palletsExpedidos.split('/')[0] || '0');
    return acc + pallets;
  }, 0);

  const totalCargas = filteredData.reduce((acc, item) => {
    return acc + parseInt(item.totalCargas || '0');
  }, 0);

  const avgPalletsPorTurno = filteredData.length > 0 ? Math.round(totalPallets / filteredData.length) : 0;
  const avgCargasPorTurno = filteredData.length > 0 ? Math.round(totalCargas / filteredData.length) : 0;
  
  const turnosAtivos = filteredData.length;

  return {
    totalPallets,
    totalCargas,
    avgPalletsPorTurno,
    avgCargasPorTurno,
    turnosAtivos,
    eficiencia: turnosAtivos > 0 ? Math.round((totalCargas / (turnosAtivos * 10)) * 100) : 0 // Assumindo 10 cargas como meta por turno
  };
};