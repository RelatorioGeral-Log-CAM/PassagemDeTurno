import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ArmazemEstojosData } from "@/utils/armazemEstojosTsvLoader";

interface ArmazemEstojosPNPModalProps {
  data: ArmazemEstojosData[];
  children: React.ReactNode;
}

export const ArmazemEstojosPNPModal = ({ data, children }: ArmazemEstojosPNPModalProps) => {
  const pnpData = data.filter(item => 
    item.reportarPNP && 
    !item.reportarPNP.toLowerCase().includes('sem pnp') &&
    !item.reportarPNP.toLowerCase().includes('n/a')
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Detalhes das Paradas (PNP) - Fábrica de Estojos
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pnpData.length > 0 ? (
            pnpData.map((item, index) => (
              <Card key={index} className="border-destructive/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-destructive" />
                      {item.turno}
                    </div>
                    <Badge variant="destructive">{item.dataHora.split(' ')[0]}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="bg-destructive/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-destructive mb-1">Motivo PNP:</p>
                    <p className="text-sm">{item.reportarPNP}</p>
                  </div>
                  {item.linha && (
                    <div className="bg-orange-500/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-600 mb-1">Linha:</p>
                      <p className="text-sm">{item.linha}</p>
                    </div>
                  )}
                  {item.tempoParada && (
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-600 mb-1">Tempo de Parada:</p>
                      <p className="text-sm">{item.tempoParada}</p>
                    </div>
                  )}
                  {item.observacoesPNP && (
                    <div className="bg-yellow-500/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-600 mb-1">Observações:</p>
                      <p className="text-sm">{item.observacoesPNP}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium">Sem PNP Registradas</p>
              <p className="text-sm text-muted-foreground">Todos os turnos da Fábrica de Estojos operaram sem paradas não programadas.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};