export interface HoraHoraData {
  data: string;
  h22: number;
  h23: number;
  h00: number;
  h01: number;
  h02: number;
  h03: number;
  h04: number;
  h05: number;
  media3T: number;
  total3T: number;
  h06: number;
  h07: number;
  h08: number;
  h09: number;
  h10: number;
  h11: number;
  h12: number;
  h13: number;
  media1T: number;
  total1T: number;
  h14: number;
  h15: number;
  h16: number;
  h17: number;
  h18: number;
  h19: number;
  h20: number;
  h21: number;
  media2T: number;
  total2T: number;
}

export const loadRecebimentoMeData = async (): Promise<HoraHoraData[]> => {
  try {
    // CORREÇÃO APLICADA AQUI: Adicionando import.meta.env.BASE_URL
    const response = await fetch(`${import.meta.env.BASE_URL}expedicao-hora-hora-data.tsv`);
    if (!response.ok) {
      throw new Error('Failed to load TSV data');
    }
    
    const text = await response.text();
    const lines = text.trim().split('\n');
    
    return lines.slice(1).map(line => {
      const values = line.split('\t');
      return {
        data: values[0] || '',
        h22: parseInt(values[1] || '0') || 0,
        h23: parseInt(values[2] || '0') || 0,
        h00: parseInt(values[3] || '0') || 0,
        h01: parseInt(values[4] || '0') || 0,
        h02: parseInt(values[5] || '0') || 0,
        h03: parseInt(values[6] || '0') || 0,
        h04: parseInt(values[7] || '0') || 0,
        h05: parseInt(values[8] || '0') || 0,
        media3T: parseInt(values[9] || '0') || 0,
        total3T: parseInt(values[10] || '0') || 0,
        h06: parseInt(values[11] || '0') || 0,
        h07: parseInt(values[12] || '0') || 0,
        h08: parseInt(values[13] || '0') || 0,
        h09: parseInt(values[14] || '0') || 0,
        h10: parseInt(values[15] || '0') || 0,
        h11: parseInt(values[16] || '0') || 0,
        h12: parseInt(values[17] || '0') || 0,
        h13: parseInt(values[18] || '0') || 0,
        media1T: parseInt(values[19] || '0') || 0,
        total1T: parseInt(values[20] || '0') || 0,
        h14: parseInt(values[21] || '0') || 0,
        h15: parseInt(values[22] || '0') || 0,
        h16: parseInt(values[23] || '0') || 0,
        h17: parseInt(values[24] || '0') || 0,
        h18: parseInt(values[25] || '0') || 0,
        h19: parseInt(values[26] || '0') || 0,
        h20: parseInt(values[27] || '0') || 0,
        h21: parseInt(values[28] || '0') || 0,
        media2T: parseInt(values[29] || '0') || 0,
        total2T: parseInt(values[30] || '0') || 0,
      };
    });
  } catch (error) {
    console.error('Error loading hora hora TSV data:', error);
    return [];
  }
};

export const getHoraHoraByDate = (data: HoraHoraData[], selectedDate: string): HoraHoraData | null => {
  const targetDate = selectedDate;
  
  return data.find(item => {
    // Converter a data do item de DD/MM/YYYY para YYYY-MM-DD para comparação
    const dateOnly = item.data;
    let itemDate = dateOnly;
    if (dateOnly.includes('/')) {
      const parts = dateOnly.split('/');
      if (parts.length === 3) {
        itemDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    
    return itemDate === targetDate;
  }) || null;
};

export const getHourlyDataForChart = (horaHoraData: HoraHoraData | null) => {
  if (!horaHoraData) return [];

  return [
    { hora: '22h', pallets: horaHoraData.h22, turno: 'Turno 3' },
    { hora: '23h', pallets: horaHoraData.h23, turno: 'Turno 3' },
    { hora: '00h', pallets: horaHoraData.h00, turno: 'Turno 3' },
    { hora: '01h', pallets: horaHoraData.h01, turno: 'Turno 3' },
    { hora: '02h', pallets: horaHoraData.h02, turno: 'Turno 3' },
    { hora: '03h', pallets: horaHoraData.h03, turno: 'Turno 3' },
    { hora: '04h', pallets: horaHoraData.h04, turno: 'Turno 3' },
    { hora: '05h', pallets: horaHoraData.h05, turno: 'Turno 3' },
    { hora: '06h', pallets: horaHoraData.h06, turno: 'Turno 1' },
    { hora: '07h', pallets: horaHoraData.h07, turno: 'Turno 1' },
    { hora: '08h', pallets: horaHoraData.h08, turno: 'Turno 1' },
    { hora: '09h', pallets: horaHoraData.h09, turno: 'Turno 1' },
    { hora: '10h', pallets: horaHoraData.h10, turno: 'Turno 1' },
    { hora: '11h', pallets: horaHoraData.h11, turno: 'Turno 1' },
    { hora: '12h', pallets: horaHoraData.h12, turno: 'Turno 1' },
    { hora: '13h', pallets: horaHoraData.h13, turno: 'Turno 1' },
    { hora: '14h', pallets: horaHoraData.h14, turno: 'Turno 2' },
    { hora: '15h', pallets: horaHoraData.h15, turno: 'Turno 2' },
    { hora: '16h', pallets: horaHoraData.h16, turno: 'Turno 2' },
    { hora: '17h', pallets: horaHoraData.h17, turno: 'Turno 2' },
    { hora: '18h', pallets: horaHoraData.h18, turno: 'Turno 2' },
    { hora: '19h', pallets: horaHoraData.h19, turno: 'Turno 2' },
    { hora: '20h', pallets: horaHoraData.h20, turno: 'Turno 2' },
    { hora: '21h', pallets: horaHoraData.h21, turno: 'Turno 2' },
  ];
};