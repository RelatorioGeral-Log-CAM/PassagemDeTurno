export interface CampoTransitorioData {
  data: string;
  expedicao0a4: string;
  expedicao5: string;
  expedicao6a14: string;
  expedicao15: string;
  expedicao16a29: string;
  expedicao30: string;
  expedicaoMais30: string;
  expedicaoTotal: string;
  expedicao999: string;
  mp0a4: string;
  mp5: string;
  mp6a14: string;
  mp15: string;
  mp16a29: string;
  mp30: string;
  mpMais30: string;
  mpTotal: string;
  mp999: string;
  separacao0a4: string;
  separacao5: string;
  separacao6a14: string;
  separacao15: string;
  separacao16a29: string;
  separacao30: string;
  separacaoMais30: string;
  separacaoTotal: string;
  separacao999: string;
  recebimento0a4: string;
  recebimento5: string;
  recebimento6a14: string;
  recebimento15: string;
  recebimento16a29: string;
  recebimento30: string;
  recebimentoMais30: string;
  recebimentoTotal: string;
  recebimento999: string;
  armEstojo0a4: string;
  armEstojo5: string;
  armEstojo6a14: string;
  armEstojo15: string;
  armEstojo16a29: string;
  armEstojo30: string;
  armEstojoMais30: string;
  armEstojoTotal: string;
  armEstojo999: string;
}

export const loadCampoTransitorioData = async (): Promise<CampoTransitorioData[]> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}999.tsv`);
    if (!response.ok) {
      throw new Error('Failed to load TSV data');
    }
    
    const text = await response.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split('\t');
    
    const data = lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        data: values[0] || '',
        expedicao0a4: values[1] || '',
        expedicao5: values[2] || '',
        expedicao6a14: values[3] || '',
        expedicao15: values[4] || '',
        expedicao16a29: values[5] || '',
        expedicao30: values[6] || '',
        expedicaoMais30: values[7] || '',
        expedicaoTotal: values[8] || '',
        expedicao999: values[9] || '',
        mp0a4: values[10] || '',
        mp5: values[11] || '',
        mp6a14: values[12] || '',
        mp15: values[13] || '',
        mp16a29: values[14] || '',
        mp30: values[15] || '',
        mpMais30: values[16] || '',
        mpTotal: values[17] || '',
        mp999: values[18] || '',
        separacao0a4: values[19] || '',
        separacao5: values[20] || '',
        separacao6a14: values[21] || '',
        separacao15: values[22] || '',
        separacao16a29: values[23] || '',
        separacao30: values[24] || '',
        separacaoMais30: values[25] || '',
        separacaoTotal: values[26] || '',
        separacao999: values[27] || '',
        recebimento0a4: values[28] || '',
        recebimento5: values[29] || '',
        recebimento6a14: values[30] || '',
        recebimento15: values[31] || '',
        recebimento16a29: values[32] || '',
        recebimento30: values[33] || '',
        recebimentoMais30: values[34] || '',
        recebimentoTotal: values[35] || '',
        recebimento999: values[36] || '',
        armEstojo0a4: values[37] || '',
        armEstojo5: values[38] || '',
        armEstojo6a14: values[39] || '',
        armEstojo15: values[40] || '',
        armEstojo16a29: values[41] || '',
        armEstojo30: values[42] || '',
        armEstojoMais30: values[43] || '',
        armEstojoTotal: values[44] || '',
        armEstojo999: values[45] || ''
      };
    });

    return data;
  } catch (error) {
    console.error('Error loading TSV data:', error);
    return [];
  }
};

export const getAvailableCampoTransitorioDates = (data: CampoTransitorioData[]): string[] => {
  return Array.from(new Set(
    data.map(item => {
      const dateOnly = item.data;
      // Converter de DD/MM/YYYY para YYYY-MM-DD se necessário
      if (dateOnly.includes('/')) {
        const parts = dateOnly.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      return dateOnly;
    })
  )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};