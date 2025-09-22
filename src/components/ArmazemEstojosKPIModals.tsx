import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from "lucide-react";
import { type ArmazemEstojosData } from "@/utils/armazemEstojosTsvLoader";

interface LinhasRodaramModalProps {
  data: ArmazemEstojosData[];
  children: React.ReactNode;
}

export const LinhasRodaramModal = ({ data, children }: LinhasRodaramModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detalhes das Linhas que Rodaram por Turno
          </DialogTitle>
          <DialogDescription>
            Visualize quantas linhas operaram em cada turno organizadas por período
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Agrupar por turno dinamicamente */}
          {Array.from(new Set(data.map(item => item.turno))).sort().map(turno => {
            const turnoData = data.filter(item => item.turno === turno);
            if (turnoData.length === 0) return null;
            
            return (
              <div key={turno} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Badge variant="default" className="text-sm font-semibold">
                    {turno}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {turnoData.length} registro(s)
                  </span>
                </div>
                
                {turnoData.map((item, index) => (
                  <div key={index} className="ml-4 border-l-2 border-primary/20 pl-4 py-2 bg-muted/30 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {item.dataHora.split(' ')[0]}
                      </span>
                      <Badge variant="secondary" className="text-base font-bold">
                        {item.qtdLinhasRodaram} linhas
                      </Badge>
                    </div>
                    
                    {item.linha && item.linha.trim() !== '' && item.linha.toLowerCase() !== 'n/a' && (
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Detalhes: </span>
                        <span className="text-muted-foreground">{item.linha}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          
          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};