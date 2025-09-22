export interface ExpedicaoData {
  turno: string;
  dataHora: string;
  palletsExpedidos: string;
  programados: string;
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
  dedutivel: string;
  fplog: string;
}

export const loadExpedicaoData = async (): Promise<ExpedicaoData[]> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}expedicao-data.tsv`);
    if (!response.ok) {
      throw new Error('Failed to load TSV data');
    }
    
    const text = await response.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split('\t');
    
    return lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        turno: values[0] || '',
        dataHora: values[1] || '',
        palletsExpedidos: values[2] || '',
        programados: values[3] || '',
        totalCargas: values[4] || '',
        emDescida: values[5] || '',
        zonaMista: values[6] || '',
        pisoNovoArmazem: values[7] || '',
        fifo1: values[8] || '',
        fifo2: values[9] || '',
        fifo3: values[10] || '',
        fifo4: values[11] || '',
        fifo5: values[12] || '',
        observacao: values[13] || '',
        responsavel: values[14] || '',
        dedutivel: values[15] || '',
        fplog: values[16] || ''
      };
    });
  } catch (error) {
    console.error('Error loading TSV data:', error);
    return [];
  }
};

export const getAvailableExpedicaoDates = (data: ExpedicaoData[]): string[] => {
  return Array.from(new Set(
    data.map(item => {
      const dateOnly = item.dataHora.split(' ')[0];
      // Converter de DD/MM/YYYY para YYYY-MM-DD se necessário
      if (dateOnly.includes('/')) {
        const parts = dateOnly.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      return dateOnly;
    })
  )).sort().reverse();
};

export const getExpedicaoTurnos = (): string[] => {
  return ['TURNO 1', 'TURNO 2', 'TURNO 3'];
};

export const getKPISummaryExpedicao = (data: ExpedicaoData[], turnoFilter: string = 'todos', selectedDate?: string) => {
  const toIsoDate = (dateStr: string) => {
    const dateOnly = dateStr.split(' ')[0];
    if (dateOnly.includes('/')) {
      const parts = dateOnly.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return dateOnly;
  };

  const byTurno = turnoFilter === 'todos' ? data : data.filter(item => item.turno === turnoFilter);

  const datasetForTotals = selectedDate
    ? byTurno.filter(item => toIsoDate(item.dataHora) === selectedDate)
    : byTurno;

  const totalPallets = datasetForTotals.reduce((acc, item) => {
    const pallets = parseInt((item.palletsExpedidos?.toString() || '0').split('/')[0]);
    return acc + (isNaN(pallets) ? 0 : pallets);
  }, 0);

  const totalCargas = datasetForTotals.reduce((acc, item) => {
    const cargas = parseInt(item.totalCargas || '0');
    return acc + (isNaN(cargas) ? 0 : cargas);
  }, 0);

  const totalDedutivel = datasetForTotals.reduce((acc, item) => {
    const dedutivel = parseInt(item.dedutivel || '0');
    return acc + (isNaN(dedutivel) ? 0 : dedutivel);
  }, 0);

  const totalFplog = datasetForTotals.reduce((acc, item) => {
    const fplog = parseInt(item.fplog || '0');
    return acc + (isNaN(fplog) ? 0 : fplog);
  }, 0);

  const turnosAtivos = datasetForTotals.length;

  let totalProgramado = 0;
  if (selectedDate) {
    const currentDate = new Date(selectedDate);
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    const previousDateStr = previousDate.toISOString().split('T')[0];

    // Buscar apenas o TURNO 2 do dia anterior (onde são inseridos os programados)
    const previousDayTurno2 = data.filter(item => 
      toIsoDate(item.dataHora) === previousDateStr && item.turno === 'TURNO 2'
    );

    totalProgramado = previousDayTurno2.reduce((acc, item) => {
      const prog = parseInt(item.programados || '0');
      return acc + (isNaN(prog) ? 0 : prog);
    }, 0);
  } else {
    // Quando não há data selecionada, buscar apenas TURNO 2 para programados
    const turno2Data = data.filter(item => item.turno === 'TURNO 2');
    totalProgramado = turno2Data.reduce((acc, item) => {
      const prog = parseInt(item.programados || '0');
      return acc + (isNaN(prog) ? 0 : prog);
    }, 0);
  }

  const avgPalletsPorTurno = turnosAtivos > 0 ? Math.round(totalPallets / turnosAtivos) : 0;
  const avgCargasPorTurno = turnosAtivos > 0 ? Math.round(totalCargas / turnosAtivos) : 0;

  return {
    totalPallets,
    totalProgramado,
    totalCargas,
    totalDedutivel,
    totalFplog,
    avgPalletsPorTurno,
    avgCargasPorTurno,
    turnosAtivos,
    eficiencia: totalProgramado > 0 ? Math.round((totalPallets / totalProgramado) * 100) : 0
  };
};