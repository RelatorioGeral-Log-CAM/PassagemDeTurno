import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SeparacaoData } from "@/utils/tsvLoader";

interface LinhasModalProps {
  data: SeparacaoData[];
  children: React.ReactNode;
}

export const LinhasModal = ({ data, children }: LinhasModalProps) => {
  const linhasPorTurno = data.map(item => {
    const hidro = parseInt(item.qtdLinhas.match(/Hidro: (\d+)/)?.[1] || '0');
    const cremes = parseInt(item.qtdLinhas.match(/Cremes: (\d+)/)?.[1] || '0');
    return {
      turno: item.turno,
      hidro,
      cremes,
      total: hidro + cremes,
      dataHora: item.dataHora
    };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Detalhes das Linhas por Turno
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {linhasPorTurno.map((item, index) => (
            <Card key={index} className="border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {item.turno}
                  </div>
                  <Badge variant="outline">{item.dataHora.split(' ')[0]}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-primary/10 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Hidro</p>
                    <p className="text-xl font-bold text-primary">{item.hidro}</p>
                  </div>
                  <div className="text-center bg-secondary/10 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Cremes</p>
                    <p className="text-xl font-bold text-secondary">{item.cremes}</p>
                  </div>
                  <div className="text-center bg-accent/10 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-accent">{item.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PNPModalProps {
  data: SeparacaoData[];
  children: React.ReactNode;
}

export const PNPModal = ({ data, children }: PNPModalProps) => {
  const pnpData = data.filter(item => !item.pnp.toLowerCase().includes('sem pnp'));

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Detalhes das Paradas (PNP)
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
                    <p className="text-sm">{item.pnp}</p>
                  </div>
                  {item.detalhesPnp && (
                    <div className="bg-orange-500/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-600 mb-1">Detalhes:</p>
                      <p className="text-sm">{item.detalhesPnp}</p>
                    </div>
                  )}
                  {item.observacaoPnp && (
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-600 mb-1">Observação:</p>
                      <p className="text-sm">{item.observacaoPnp}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium">Sem PNP Registradas</p>
              <p className="text-sm text-muted-foreground">Todos os turnos operaram sem paradas não programadas.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};