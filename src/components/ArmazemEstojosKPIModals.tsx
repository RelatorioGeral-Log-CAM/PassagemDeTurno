import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detalhes das Linhas que Rodaram
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.turno}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {item.dataHora.split(' ')[0]}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Linhas que rodaram:</span>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {item.qtdLinhasRodaram}
                  </Badge>
                </div>
                
                {item.linha && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Detalhes: </span>
                    {item.linha}
                  </div>
                )}
              </div>
            </div>
          ))}
          
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