export interface RecebimentoMeData {
  data: string;
  veiculosProgramados: string;
  veiculosExtras: string;
  antecipados: string;
  noShow: string;
  reprogramados: string;
  totalVeiculosD: string;
  // Turno 1
  veiculosRecebido1T: string;
  palletsRecebidos1T: string;
  qualidadeSolicitados1T: string;
  qualidadeEntregues1T: string;
  qualidadeReintegrados1T: string;
  qualidadeEmDecida1T: string;
  chamadosAbertos1T: string;
  chamadosResolvidos1T: string;
  observacoes1T: string;
  // Turno 2
  veiculosRecebido2T: string;
  palletsRecebidos2T: string;
  qualidadeSolicitados2T: string;
  qualidadeEntregues2T: string;
  qualidadeReintegrados2T: string;
  qualidadeEmDecida2T: string;
  chamadosAbertos2T: string;
  chamadosResolvidos2T: string;
  observacoes2T: string;
  // Turno 3
  veiculosRecebidos3T: string;
  palletsRecebidos3T: string;
  qualidadeSolicitados3T: string;
  qualidadeEntregues3T: string;
  qualidadeReintegrados3T: string;
  qualidadeEmDecida3T: string;
  chamadosAbertos3T: string;
  chamadosResolvidos3T: string;
  observacoes3T: string;
}

export const loadRecebimentoMeData = async (): Promise<RecebimentoMeData[]> => {
  try {
    const response = await fetch (`${import.meta.env.BASE_URL}recebimento-me-data.tsv`)
    if (!response.ok) {
      throw new Error('Failed to load TSV data');
    }
    
    const text = await response.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split('\t');
    
    return lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        data: values[0] || '',
        veiculosProgramados: values[1] || '',
        veiculosExtras: values[2] || '',
        antecipados: values[3] || '',
        noShow: values[4] || '',
        reprogramados: values[5] || '',
        totalVeiculosD: values[6] || '',
        // Turno 1
        veiculosRecebido1T: values[7] || '',
        palletsRecebidos1T: values[8] || '',
        qualidadeSolicitados1T: values[9] || '',
        qualidadeEntregues1T: values[10] || '',
        qualidadeReintegrados1T: values[11] || '',
        qualidadeEmDecida1T: values[12] || '',
        chamadosAbertos1T: values[13] || '',
        chamadosResolvidos1T: values[14] || '',
        observacoes1T: values[15] || '',
        // Turno 2
        veiculosRecebido2T: values[16] || '',
        palletsRecebidos2T: values[17] || '',
        qualidadeSolicitados2T: values[18] || '',
        qualidadeEntregues2T: values[19] || '',
        qualidadeReintegrados2T: values[20] || '',
        qualidadeEmDecida2T: values[21] || '',
        chamadosAbertos2T: values[22] || '',
        chamadosResolvidos2T: values[23] || '',
        observacoes2T: values[24] || '',
        // Turno 3
        veiculosRecebidos3T: values[25] || '',
        palletsRecebidos3T: values[26] || '',
        qualidadeSolicitados3T: values[27] || '',
        qualidadeEntregues3T: values[28] || '',
        qualidadeReintegrados3T: values[29] || '',
        qualidadeEmDecida3T: values[30] || '',
        chamadosAbertos3T: values[31] || '',
        chamadosResolvidos3T: values[32] || '',
        observacoes3T: values[33] || ''
      };
    });
  } catch (error) {
    console.error('Error loading TSV data:', error);
    return [];
  }
};

export const getAvailableRecebimentoMeDates = (data: RecebimentoMeData[]): string[] => {
  return Array.from(new Set(
    data
      .filter(item => item.data && item.data.trim() !== '')
      .map(item => {
        const dateOnly = item.data.split(' ')[0];
        
        // Verifique se a data já está no formato YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
          return dateOnly; // Não precisa converter
        }
        
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

export const getRecebimentoMeTurnos = (): string[] => {
  return ['TURNO 1', 'TURNO 2', 'TURNO 3'];
};

export const getKPISummaryRecebimentoMe = (data: RecebimentoMeData[], turnoFilter: string = 'todos') => {
  const filteredData = data.filter(item => 
    item.data && item.data.trim() !== '' && 
    (item.veiculosRecebido1T !== '' || item.veiculosRecebido2T !== '' || item.veiculosRecebidos3T !== '')
  );

  let totalVeiculosProgramados = 0;
  let totalVeiculosRecebidos = 0;
  let totalPallets = 0;

  filteredData.forEach(item => {
    // Somar veículos programados (não depende do filtro de turno)
    totalVeiculosProgramados += parseInt(item.veiculosProgramados || '0');

    // Somar veículos recebidos e pallets por turno
    if (turnoFilter === 'todos' || turnoFilter === 'TURNO 1') {
      totalVeiculosRecebidos += parseInt(item.veiculosRecebido1T || '0');
      totalPallets += parseInt(item.palletsRecebidos1T || '0');
    }
    if (turnoFilter === 'todos' || turnoFilter === 'TURNO 2') {
      totalVeiculosRecebidos += parseInt(item.veiculosRecebido2T || '0');
      totalPallets += parseInt(item.palletsRecebidos2T || '0');
    }
    if (turnoFilter === 'todos' || turnoFilter === 'TURNO 3') {
      totalVeiculosRecebidos += parseInt(item.veiculosRecebidos3T || '0');
      totalPallets += parseInt(item.palletsRecebidos3T || '0');
    }
  });

  const avgVeiculosPorDia = filteredData.length > 0 ? Math.round(totalVeiculosRecebidos / filteredData.length) : 0;
  const avgPalletsPorDia = filteredData.length > 0 ? Math.round(totalPallets / filteredData.length) : 0;
  
  const diasAtivos = filteredData.length;

  return {
    totalVeiculosProgramados,
    totalVeiculosRecebidos,
    totalPallets,
    avgVeiculosPorDia,
    avgPalletsPorDia,
    diasAtivos,
    eficiencia: totalVeiculosRecebidos > 0 ? Math.round((totalPallets / totalVeiculosRecebidos) * 100) / 100 : 0
  };
};