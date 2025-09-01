export interface MateriaPrimaData {
  turno: string;
  dataHora: string;
  responsavel: string;
  doca19: string;
  doca20: string;
  doca21: string;
  doca22: string;
  doca23: string;
  doca24: string;
  doca25: string;
  doca26: string;
  agendadas: string;
  recebidas: string;
  backLog: string;
  backLog2: string;
  recebidas2: string;
  lancadas: string;
  pendentesTu: string;
  nfPendentes: string;
  qualidadeSolicitados: string;
  qualidadeAtendidos: string;
  waveSeparacao: string;
  wavePesagem: string;
  waveEclusa: string;
  wavesSeparadas: string;
  waveFila: string;
  itensContados: string;
  itensRecontados: string;
  observacoes: string;
}

export const loadMateriaPrimaData = async (): Promise<MateriaPrimaData[]> => {
  try {
    const response = await fetch (`${import.meta.env.BASE_URL}materia-prima-data.tsv`)
    if (!response.ok) {
      throw new Error('Failed to load TSV data');
    }
    
    const text = await response.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split('\t');
    
    const data = lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        turno: values[0] || '',
        dataHora: values[1] || '',
        responsavel: values[2] || '',
        doca19: values[3] || '',
        doca20: values[4] || '',
        doca21: values[5] || '',
        doca22: values[6] || '',
        doca23: values[7] || '',
        doca24: values[8] || '',
        doca25: values[9] || '',
        doca26: values[10] || '',
        agendadas: values[11] || '',
        recebidas: values[12] || '',
        backLog: values[13] || '',
        backLog2: values[14] || '',
        recebidas2: values[15] || '',
        lancadas: values[16] || '',
        pendentesTu: values[17] || '',
        nfPendentes: values[18] || '',
        qualidadeSolicitados: values[19] || '',
        qualidadeAtendidos: values[20] || '',
        waveSeparacao: values[21] || '',
        wavePesagem: values[22] || '',
        waveEclusa: values[23] || '',
        wavesSeparadas: values[24] || '',
        waveFila: values[25] || '',
        itensContados: values[26] || '',
        itensRecontados: values[27] || '',
        observacoes: values[28] || ''
      };
    });


    return data;
  } catch (error) {
    console.error('Error loading TSV data:', error);
    return [];
  }
};

export const getAvailableMateriaPrimaDates = (data: MateriaPrimaData[]): string[] => {
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

export const getMateriaPrimaTurnos = (): string[] => {
  return ['TURNO 1', 'TURNO 2', 'TURNO 3'];
};

export const getKPISummaryMateriaPrima = (data: MateriaPrimaData[], selectedTurno?: string) => {
  const filteredData = selectedTurno === 'todos' 
    ? data 
    : data.filter(item => item.turno === selectedTurno);

  // Para agendadas/recebidas, pegar o primeiro valor do dia (não somar por turno)
  // Agrupar por data
  const dataGroups = filteredData.reduce((acc, item) => {
    const dateOnly = item.dataHora.split(' ')[0];
    if (!acc[dateOnly]) {
      acc[dateOnly] = [];
    }
    acc[dateOnly].push(item);
    return acc;
  }, {} as Record<string, MateriaPrimaData[]>);

  // Para cada dia, pegar o primeiro valor de agendadas e recebidas (não somar)
  let totalAgendadas = 0;
  let totalRecebidas = 0;
  
  Object.values(dataGroups).forEach(dayData => {
    if (dayData.length > 0) {
      const firstEntry = dayData[0];
      totalAgendadas = parseInt(firstEntry.agendadas) || 0;
      totalRecebidas = parseInt(firstEntry.recebidas) || 0;
    }
  });

  const totalBacklog = filteredData.reduce((acc, item) => 
    acc + (parseInt(item.backLog) || 0), 0);

  const totalLancadas = filteredData.reduce((acc, item) => 
    acc + (parseInt(item.lancadas) || 0), 0);

  const totalPendentes = filteredData.reduce((acc, item) => 
    acc + (parseInt(item.pendentesTu) || 0), 0);

  const totalNfPendentes = filteredData.reduce((acc, item) => 
    acc + (parseInt(item.nfPendentes) || 0), 0);

  const qualidadeSolicitados = filteredData.reduce((acc, item) => 
    acc + (parseInt(item.qualidadeSolicitados) || 0), 0);

  const qualidadeAtendidos = filteredData.reduce((acc, item) => 
    acc + (parseInt(item.qualidadeAtendidos) || 0), 0);

  const turnosAtivos = filteredData.length;

  return {
    totalAgendadas,
    totalRecebidas,
    totalBacklog,
    totalLancadas,
    totalPendentes,
    totalNfPendentes,
    qualidadeSolicitados,
    qualidadeAtendidos,
    turnosAtivos,
    dataByTurno: filteredData.map(item => ({
      turno: item.turno,
      dataHora: item.dataHora,
      agendadas: item.agendadas,
      recebidas: item.recebidas,
      qualidadeSolicitados: item.qualidadeSolicitados,
      qualidadeAtendidos: item.qualidadeAtendidos
    }))
  };
};