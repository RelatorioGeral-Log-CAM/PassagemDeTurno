import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, Factory, Calendar } from "lucide-react";
import { type SeparacaoData } from "@/utils/tsvLoader";

interface PNPHistoricoModalProps {
  children: React.ReactNode;
  data: SeparacaoData[];
  fabrica: 'cremes' | 'hidro';
}

interface PNPRecord {
  dataHora: string;
  turno: string;
  linha: string;
  fabrica: 'cremes' | 'hidro';
  detalhes: string;
  observacao: string;
  diasAtras: number;
}

const getPNPHistorico = (data: SeparacaoData[], fabrica?: 'cremes' | 'hidro'): PNPRecord[] => {
  const pnpRecords: PNPRecord[] = [];

  // Ordenar dados por data/hora (mais recente primeiro)
  const sortedData = data.slice().sort((a, b) => {
    const dateA = new Date(a.dataHora.split(' ')[0].split('/').reverse().join('-') + ' ' + (a.dataHora.split(' ')[1] || '00:00:00'));
    const dateB = new Date(b.dataHora.split(' ')[0].split('/').reverse().join('-') + ' ' + (b.dataHora.split(' ')[1] || '00:00:00'));
    return dateB.getTime() - dateA.getTime();
  });

  const agora = new Date();

  for (const item of sortedData) {
    if (item.pnp === 'Reportar PNP') {
      // Verificar se é PNP de Cremes ou Hidro baseado na linha nos detalhes
      const linhaMatch = item.detalhesPnp.match(/Linha:\s*(Cremes\s+([CH]\d+)|Hidro\s+([CH]\d+)|([CH]\d+))/i);
      if (linhaMatch) {
        let linha = '';
        let tipoFabrica: 'cremes' | 'hidro' | null = null;
        
        if (linhaMatch[2]) {
          linha = linhaMatch[2].toUpperCase();
          tipoFabrica = 'cremes';
        } else if (linhaMatch[3]) {
          linha = linhaMatch[3].toUpperCase();
          tipoFabrica = 'hidro';
        } else if (linhaMatch[4]) {
          linha = linhaMatch[4].toUpperCase();
          if (linha.startsWith('C')) {
            tipoFabrica = 'cremes';
          } else if (linha.startsWith('H')) {
            tipoFabrica = 'hidro';
          }
        }
        
        if (tipoFabrica && (!fabrica || tipoFabrica === fabrica)) {
          const itemDate = new Date(item.dataHora.split(' ')[0].split('/').reverse().join('-') + ' ' + (item.dataHora.split(' ')[1] || '00:00:00'));
          const diasAtras = Math.floor((agora.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
          
          pnpRecords.push({
            dataHora: item.dataHora,
            turno: item.turno,
            linha,
            fabrica: tipoFabrica,
            detalhes: item.detalhesPnp,
            observacao: item.observacaoPnp || 'Sem observações',
            diasAtras
          });
        }
      }
    }
  }

  return pnpRecords;
};

export const PNPHistoricoModal = ({ children, data, fabrica }: PNPHistoricoModalProps) => {
  const [open, setOpen] = useState(false);
  
  const historicoCompleto = getPNPHistorico(data, fabrica);
  const fabricaLabel = fabrica === 'cremes' ? 'Cremes' : 'Hidro';
  const fabricaColor = fabrica === 'cremes' ? 'green' : 'blue';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className={`h-5 w-5 text-${fabricaColor}-500`} />
            Histórico de PNPs - Fábrica de {fabricaLabel}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {historicoCompleto.length === 0 ? (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Nenhum PNP encontrado</p>
                    <p className="text-sm">Não há histórico de PNPs para a fábrica de {fabricaLabel}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-sm">
                    {historicoCompleto.length} PNP{historicoCompleto.length !== 1 ? 's' : ''} encontrado{historicoCompleto.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                {historicoCompleto.map((pnp, index) => (
                  <Card key={index} className={`border-l-4 border-l-${fabricaColor}-500`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 text-${fabricaColor}-500`} />
                          Linha {pnp.linha}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {pnp.diasAtras === 0 ? 'Hoje' : `${pnp.diasAtras} dias atrás`}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pnp.dataHora}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {pnp.turno}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Detalhes do PNP:</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
                          {pnp.detalhes}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Observações:</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
                          {pnp.observacao}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};