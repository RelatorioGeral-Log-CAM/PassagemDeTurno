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
  dedutivel: string;
  fplogEmAtraso: string;
  mapaEmAtraso: string;
  odisseiaEmAtraso: string;
  
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
        totalCargas: values[3] || '',
        emDescida: values[4] || '',
        zonaMista: values[5] || '',
        pisoNovoArmazem: values[6] || '',
        fifo1: values[7] || '',
        fifo2: values[8] || '',
        fifo3: values[9] || '',
        fifo4: values[10] || '',
        fifo5: values[11] || '',
        observacao: values[12] || '',
        responsavel: values[13] || '',
        dedutivel: values[14] || '',
        fplogEmAtraso: values[15] || '',
        mapaEmAtraso: values[16] || '',
        odisseiaEmAtraso: values[17] || ''
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

 const turnosAtivos = datasetForTotals.length;

  const totalFplogEmAtraso = datasetForTotals.reduce((acc, item) => {
    const fplog = parseInt(item.fplogEmAtraso || '0');
    return acc + (isNaN(fplog) ? 0 : fplog);
  }, 0);

  const totalMapaEmAtraso = datasetForTotals.reduce((acc, item) => {
    const mapa = parseInt(item.mapaEmAtraso || '0');
    return acc + (isNaN(mapa) ? 0 : mapa);
  }, 0);

  const totalOdisseiaEmAtraso = datasetForTotals.reduce((acc, item) => {
    const odisseia = parseInt(item.odisseiaEmAtraso || '0');
    return acc + (isNaN(odisseia) ? 0 : odisseia);
  }, 0);

  const avgCargasPorTurno = turnosAtivos > 0 ? Math.round(totalCargas / turnosAtivos) : 0;

  return {
    totalPallets,
    totalCargas,
    totalDedutivel,
    totalFplogEmAtraso,
    totalMapaEmAtraso,
    totalOdisseiaEmAtraso,
    avgCargasPorTurno,
    turnosAtivos,
    eficiencia: turnosAtivos > 0 ? Math.round((totalCargas / turnosAtivos) * 100) / 10 : 0 // Eficiência baseada em cargas por turno
  };
};