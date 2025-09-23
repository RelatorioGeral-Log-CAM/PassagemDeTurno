export interface ArmazemEstojosData {
  turno: string;
  dataHora: string;
  cargasProgramadas: string;
  cargasRecebidos: string;
  cargasPendentes: string;
  palletsArmazenados: string;
  palletsMovimentados: string;
  materialSecundario: string;
  palletsDeME: string;
  qualidade: string;
  reportarPNP: string;
  linha: string;
  tempoParada: string;
  qtdPecas: string;
  responsabilidade: string;
  observacoesPNP: string;
  qtdLinhasRodaram: string;
  ccme: string;
  bufferPapelao: string;
  contagem: string;
  retrabalho: string;
  camposTransitorios: string;
  rim: string;
  observacoesGerais: string;
}

export const loadArmazemEstojosData = async (): Promise<ArmazemEstojosData[]> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}armazem-estojos-data.tsv`);
    if (!response.ok) {
      throw new Error ("Falha ao carregar armazem-estojos-data.tsv ")
    }
    const text = await response.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split('\t');
    
    return lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        turno: values[0] || '',
        dataHora: values[1] || '',
        cargasProgramadas: values[2] || '',
        cargasRecebidos: values[3] || '',
        cargasPendentes: values[4] || '',
        palletsArmazenados: values[5] || '',
        palletsMovimentados: values[6] || '',
        materialSecundario: values[7] || '',
        palletsDeME: values[8] || '',
        qualidade: values[9] || '',
        reportarPNP: values[10] || '',
        linha: values[11] || '',
        tempoParada: values[12] || '',
        qtdPecas: values[13] || '',
        responsabilidade: values[14] || '',
        observacoesPNP: values[15] || '',
        qtdLinhasRodaram: values[16] || '',
        ccme: values[17] || '',
        bufferPapelao: values[18] || '',
        contagem: values[19] || '',
        retrabalho: values[20] || '',
        camposTransitorios: values[21] || '',
        rim: values[22] || '',
        observacoesGerais: values[23] || '',
      };
    });
  } catch (error) {
    console.error('Erro ao carregar dados de Armazém Estojos:', error);
    return [];
  }
};

export const getAvailableDates = (data: ArmazemEstojosData[]): string[] => {
  const dates = data.map(item => {
    const dateOnly = item.dataHora.split(' ')[0];
    if (dateOnly.includes('/')) {
      const parts = dateOnly.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return dateOnly;
  });
  
  const uniqueDates = Array.from(new Set(dates)).filter(date => date);
  return uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};

export const getKPISummaryArmazemEstojos = (data: ArmazemEstojosData[], selectedTurno: string = 'todos') => {
  if (data.length === 0) {
    return {
      totalCargasProgramadas: 0,
      totalCargasRecebidas: 0,
      totalPalletsArmazenados: 0,
      totalPalletsMovimentados: 0,
      totalLinhasRodaram: 0,
      totalCamposTransitorios: 0
    };
  }

  const filteredData = selectedTurno === 'todos' ? data : data.filter(item => item.turno === selectedTurno);

  const totalCargasProgramadas = filteredData.reduce((sum, item) => sum + (parseInt(item.cargasProgramadas) || 0), 0);
  const totalCargasRecebidas = filteredData.reduce((sum, item) => sum + (parseInt(item.cargasRecebidos) || 0), 0);
  const totalPalletsArmazenados = filteredData.reduce((sum, item) => sum + (parseInt(item.palletsArmazenados) || 0), 0);
  const totalPalletsMovimentados = filteredData.reduce((sum, item) => sum + (parseInt(item.palletsMovimentados) || 0), 0);
  const totalLinhasRodaram = filteredData.reduce((sum, item) => sum + (parseInt(item.qtdLinhasRodaram) || 0), 0);
  const totalCamposTransitorios = filteredData.reduce((sum, item) => sum + (parseInt(item.camposTransitorios) || 0), 0);
  return {
    totalCargasProgramadas,
    totalCargasRecebidas,
    totalPalletsArmazenados,
    totalPalletsMovimentados,
    totalLinhasRodaram,
    totalCamposTransitorios
  };
};

export const getTempoSemPNPArmazemEstojos = (data: ArmazemEstojosData[]) => {
  // Filtrar dados onde há PNP reportado (não vazio, não N/A, não "sem pnp")
  const dadosComPnp = data.filter(item => 
    item.reportarPNP && 
    !item.reportarPNP.toLowerCase().includes('sem pnp') &&
    !item.reportarPNP.toLowerCase().includes('n/a') &&
    item.reportarPNP.trim() !== '' &&
    item.reportarPNP.trim() !== '-'
  );

  let ultimoPnp: Date | null = null;
  
  if (dadosComPnp.length > 0) {
    // Ordenar por data mais recente
    const dadosOrdenados = dadosComPnp.sort((a, b) => {
      const dateA = new Date(a.dataHora.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
      const dateB = new Date(b.dataHora.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
      return dateB.getTime() - dateA.getTime();
    });
    
    const ultimoRegistro = dadosOrdenados[0];
    ultimoPnp = new Date(ultimoRegistro.dataHora.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
  }

  const agora = new Date();
  const tempoSemPnp = ultimoPnp ? agora.getTime() - ultimoPnp.getTime() : 0;
  
  // Converter para dias e horas
  const diasSemPnp = Math.floor(tempoSemPnp / (1000 * 60 * 60 * 24));
  const horasSemPnp = Math.floor((tempoSemPnp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  let statusText = 'Sem histórico de PNP';
  if (ultimoPnp) {
    if (diasSemPnp > 0) {
      statusText = `${diasSemPnp}d ${horasSemPnp}h sem PNP`;
    } else {
      statusText = `${horasSemPnp}h sem PNP`;
    }
  }
  
  return {
    status: statusText,
    ultimoPnp,
    horasSemPnp: Math.floor(tempoSemPnp / (1000 * 60 * 60))
  };
};