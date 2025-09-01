import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TurnoFilterProps {
  selectedTurno: string;
  onTurnoChange: (turno: string) => void;
  turnos: string[];
}

export const TurnoFilter = ({ selectedTurno, onTurnoChange, turnos }: TurnoFilterProps) => {
  return (
    <Card className="p-4 shadow-card animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Filter className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Filtros Avançados</h3>
            <p className="text-sm text-muted-foreground">Opções detalhadas de filtragem</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Select value={selectedTurno} onValueChange={onTurnoChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Selecionar turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Turnos</SelectItem>
              {turnos
                .filter((turno) => turno && turno.trim() !== '')
                .map((turno) => (
                  <SelectItem key={turno} value={turno}>
                    {turno}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {selectedTurno !== 'todos' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTurnoChange('todos')}
              className="hover:bg-accent/10 w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};