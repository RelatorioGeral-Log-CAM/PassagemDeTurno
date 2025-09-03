export interface SeparacaoData {
  turno: string;
  dataHora: string;
  pnp: string;
  detalhesPnp: string;
  observacaoPnp: string;
  mista2: string;
  mista3: string;
  ccme: string;
  buffer: string;
  contagem: string;
  ab3: string;
  retrabalho: string;
  camposTarefas: string;
  rim: string;
  observacaoGeral: string;
  qtdLinhas: string;
}

export const loadSeparacaoData = async (): Promise<SeparacaoData[]> => {
  try {
    const response = await fetch (`${import.meta.env.BASE_URL}separacao-data.tsv`)
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
        pnp: values[2] || '',
        detalhesPnp: values[3] || '',
        observacaoPnp: values[4] || '',
        mista2: values[5] || '',
        mista3: values[6] || '',
        ccme: values[7] || '',
        buffer: values[8] || '',
        contagem: values[9] || '',
        ab3: values[10] || '',
        retrabalho: values[11] || '',
        camposTarefas: values[12] || '',
        rim: values[13] || '',
        observacaoGeral: values[14] || '',
        qtdLinhas: values[15] || ''
      };
    });
  } catch (error) {
    console.error('Error loading TSV data:', error);
    return [];
  }
};

export const getAvailableDates = (data: SeparacaoData[]): string[] => {
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

export const getTurnos = (): string[] => {
  return ['TURNO 1', 'TURNO 2', 'TURNO 3'];
};

// Função para calcular tempo sem PNP
export const getTempoSemPNP = (allData: SeparacaoData[]) => {
  // Ordenar dados por data/hora (mais recente primeiro)
  const sortedData = allData.slice().sort((a, b) => {
    const dateA = new Date(a.dataHora.split(' ')[0].split('/').reverse().join('-') + ' ' + (a.dataHora.split(' ')[1] || '00:00:00'));
    const dateB = new Date(b.dataHora.split(' ')[0].split('/').reverse().join('-') + ' ' + (b.dataHora.split(' ')[1] || '00:00:00'));
    return dateB.getTime() - dateA.getTime();
  });

  let ultimoPnpCremes: Date | null = null;
  let ultimoPnpHidro: Date | null = null;

  // Procurar o último PNP em cada fábrica
  for (const item of sortedData) {
    if (item.pnp === 'Reportar PNP') {
      // Verificar se é PNP de Cremes ou Hidro baseado na linha nos detalhes
      const linhaMatch = item.detalhesPnp.match(/Linha:\s*(Cremes\s+([CH]\d+)|Hidro\s+([CH]\d+)|([CH]\d+))/i);
      if (linhaMatch) {
        let linha = '';
        if (linhaMatch[2]) {
          // Formato "Linha: Cremes C7"
          linha = linhaMatch[2].toUpperCase();
        } else if (linhaMatch[3]) {
          // Formato "Linha: Hidro H1"
          linha = linhaMatch[3].toUpperCase();
        } else if (linhaMatch[4]) {
          // Formato "Linha: C7" ou "Linha: H1"
          linha = linhaMatch[4].toUpperCase();
        }
        
        if (linha) {
          const itemDate = new Date(item.dataHora.split(' ')[0].split('/').reverse().join('-') + ' ' + (item.dataHora.split(' ')[1] || '00:00:00'));
          
          if (linha.startsWith('C') && !ultimoPnpCremes) {
            // É linha de Cremes (C1-C13)
            ultimoPnpCremes = itemDate;
          } else if (linha.startsWith('H') && !ultimoPnpHidro) {
            // É linha de Hidro (H1-H9)
            ultimoPnpHidro = itemDate;
          }
        }
      }
    }
  }

  const agora = new Date();
  
  // Calcular tempo sem PNP em horas
  const tempoSemPnpCremes = ultimoPnpCremes 
    ? Math.floor((agora.getTime() - ultimoPnpCremes.getTime()) / (1000 * 60 * 60))
    : null;
  
  const tempoSemPnpHidro = ultimoPnpHidro 
    ? Math.floor((agora.getTime() - ultimoPnpHidro.getTime()) / (1000 * 60 * 60))
    : null;

  return {
    cremes: {
      tempoHoras: tempoSemPnpCremes,
      ultimoPnp: ultimoPnpCremes,
      status: tempoSemPnpCremes === null ? 'Sem histórico de PNP' : `${tempoSemPnpCremes}h sem PNP`
    },
    hidro: {
      tempoHoras: tempoSemPnpHidro,
      ultimoPnp: ultimoPnpHidro,
      status: tempoSemPnpHidro === null ? 'Sem histórico de PNP' : `${tempoSemPnpHidro}h sem PNP`
    }
  };
};


export const getKPISummarySeparacao = (data: SeparacaoData[], selectedTurno?: string) => {
  const filteredData = selectedTurno === 'todos' 
    ? data 
    : data.filter(item => item.turno === selectedTurno);

  const totalLinhas = filteredData.reduce((acc, item) => {
    const hidro = parseInt(item.qtdLinhas.match(/Hidro: (\d+)/)?.[1] || '0');
    const cremes = parseInt(item.qtdLinhas.match(/Cremes: (\d+)/)?.[1] || '0');
    return acc + hidro + cremes;
  }, 0);

  const turnosAtivos = filteredData.length;
  
  const comPnp = filteredData.filter(item => 
    !item.pnp.toLowerCase().includes('sem pnp')
  ).length;

  const semPnp = filteredData.length - comPnp;

  // Eficiência baseada no PNP
  let eficiencia = 100;
  if (comPnp > 0) {
    // Se teve PNP, calcular eficiência baseada na quantidade de paradas
    // Considerando que cada PNP reduz a eficiência
    const paradasPorTurno = comPnp / turnosAtivos;
    eficiencia = Math.max(0, Math.round(100 - (paradasPorTurno * 20))); // Cada parada reduz 20%
  }

  const temPnp = comPnp > 0;

  return {
    totalLinhas,
    turnosAtivos,
    comPnp,
    semPnp,
    eficiencia,
    temPnp,
    dataByTurno: filteredData.map(item => {
      const hidro = parseInt(item.qtdLinhas.match(/Hidro: (\d+)/)?.[1] || '0');
      const cremes = parseInt(item.qtdLinhas.match(/Cremes: (\d+)/)?.[1] || '0');
      return {
        turno: item.turno,
        dataHora: item.dataHora,
        hidro,
        cremes,
        total: hidro + cremes,
        temPnp: !item.pnp.toLowerCase().includes('sem pnp'),
        pnp: item.pnp,
        detalhesPnp: item.detalhesPnp,
        observacaoPnp: item.observacaoPnp
      };
    })
  };
};