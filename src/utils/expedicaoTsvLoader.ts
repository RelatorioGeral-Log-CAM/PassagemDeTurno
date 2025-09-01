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

export const loadExpedicaoData = async (): Promise<ExpedicaoData[]> => {
  try {
    // CORREÇÃO APLICADA AQUI: Adicionando import.meta.env.BASE_URL
    const response = await fetch (`${import.meta.env.BASE_URL}expedicao-data.tsv`)
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
        responsavel: values[13] || ''
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

export const getKPISummaryExpedicao = (data: ExpedicaoData[], turnoFilter: string = 'todos') => {
  const filteredData = turnoFilter === 'todos' 
    ? data 
    : data.filter(item => item.turno === turnoFilter);

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