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

export const separacaoData: SeparacaoData[] = [
  {
    turno: "1 TURNO",
    dataHora: "07/08/2025 14:09:59",
    pnp: "Sem PNP Creme / Hidro",
    detalhesPnp: "N/A",
    observacaoPnp: "N/A",
    mista2: "Controlado",
    mista3: "Controlado",
    ccme: "Controlado. Atuação nos materiais sem saldos e criação de saldos.",
    buffer: "Controlado.",
    contagem: "Contamos 11 itens Lista pronta de 10 itens para 2º turno.",
    ab3: "Controlado",
    retrabalho: "340672 - Aguardando o desbloqueio da qualidade, material na zona mista de HIDRO.",
    camposTarefas: "Em Atuação.",
    rim: "Sem Demanda.",
    observacaoGeral: "Parada desde 09:00 do PIG03 para manutenção corretiva. Tivemos dificuldade na disponibilidade de gaiolas.",
    qtdLinhas: "Hidro: 9, Cremes: 10"
  },
  {
    turno: "2 TURNO",
    dataHora: "07/08/2025 22:08:43",
    pnp: "Sem PNP Creme / Hidro",
    detalhesPnp: "N/A",
    observacaoPnp: "N/A",
    mista2: "Esteira e piso com baixa demanda",
    mista3: "Esteira e piso com baixa demanda",
    ccme: "44 Pallets reintegra. ✅ 03 Saldos solicitados✅ Inventário 70700000469452 Físico/Sistemico ✅ Reintegrado. Obs: Todos os itens que recebi no turno sem saldo foram planilhados ✅",
    buffer: "Abastecido e organizado",
    contagem: "1 item contado - Oportunidade na lista deixada pelo 1T (itens ja contados)",
    ab3: "Expansão-Cremes-Hidros: demanda controlada",
    retrabalho: "340662 - Abastecimento iniciado (1/5 paletes no abastecido) ✅ 340641 - Em abastecimento na H1 ✅ 340672 - Abastecido na H1✅ 340664 - Abastecida na H1✅",
    camposTarefas: "Sem informação",
    rim: "Sem demanda",
    observacaoGeral: "",
    qtdLinhas: "Hidro: 9, Cremes: 10"
  },
  {
    turno: "3 TURNO",
    dataHora: "07/08/2025 06:11:14",
    pnp: "Sem PNP Creme / Hidro",
    detalhesPnp: "N/A",
    observacaoPnp: "N/A",
    mista2: "Controlada.",
    mista3: "Controlada.",
    ccme: "Atuamos controlado.",
    buffer: "Controlado.",
    contagem: "13 itens . Lista com 10 itens para o 1° turno .",
    ab3: "Controlado.",
    retrabalho: "340662 - Abastecido .",
    camposTarefas: "R$22.795,19",
    rim: "",
    observacaoGeral: "",
    qtdLinhas: "Hidro: 8, Cremes: 10"
  }
];

export const getTurnos = (): string[] => {
  return Array.from(new Set(separacaoData.map(item => item.turno)));
};

export const getKPISummary = (turnoFilter: string = 'todos') => {
  const filteredData = turnoFilter === 'todos' 
    ? separacaoData 
    : separacaoData.filter(item => item.turno === turnoFilter);

  const totalLinhas = filteredData.reduce((acc, item) => {
    const hidro = parseInt(item.qtdLinhas.match(/Hidro: (\d+)/)?.[1] || '0');
    const cremes = parseInt(item.qtdLinhas.match(/Cremes: (\d+)/)?.[1] || '0');
    return acc + hidro + cremes;
  }, 0);

  const avgLinhasPorTurno = filteredData.length > 0 ? Math.round(totalLinhas / filteredData.length) : 0;
  
  const turnosAtivos = filteredData.length;
  const statusControlado = filteredData.filter(item => 
    item.mista2.toLowerCase().includes('controlado') || 
    item.mista3.toLowerCase().includes('controlado')
  ).length;

  return {
    totalLinhas,
    avgLinhasPorTurno,
    turnosAtivos,
    statusControlado,
    eficiencia: turnosAtivos > 0 ? Math.round((statusControlado / turnosAtivos) * 100) : 0
  };
};