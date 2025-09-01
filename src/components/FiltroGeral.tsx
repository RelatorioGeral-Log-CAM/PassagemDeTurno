import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter, RotateCcw, Calendar, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModernDatePicker } from "./ModernDatePicker";
import { QuickDateNavigation } from "./QuickDateNavigation";
interface FiltroGeralProps {
  selectedTurno: string;
  onTurnoChange: (turno: string) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  availableDates?: string[];
}

export const FiltroGeral = ({ selectedTurno, onTurnoChange, selectedDate, onDateChange, availableDates = [] }: FiltroGeralProps) => {
  const turnos = ['TURNO 1', 'TURNO 2', 'TURNO 3'];
  
  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl blur-sm animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl animate-fade-in" />
      
      <Card className="relative p-3 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-background/80 via-background/90 to-background/95 border-2 border-primary/20 hover:border-primary/30 transition-all duration-500 shadow-2xl hover:shadow-glow animate-scale-in rounded-xl sm:rounded-2xl overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-xl animate-pulse delay-1000" />
        
        <div className="relative space-y-3 sm:space-y-6">
          {/* Modern Header - Mobile Optimized */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary rounded-lg sm:rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                <div className="relative p-1.5 sm:p-2.5 bg-gradient-primary rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Controle Inteligente
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex">
                  <Sparkles className="h-3 w-3" />
                  Filtragem em tempo real
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground hidden sm:inline">Ativo</span>
            </div>
          </div>

          {/* Modern Filters Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Modern Date Picker - Mobile Optimized */}
            {onDateChange && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <label className="text-xs sm:text-sm font-semibold text-foreground">
                    Período de Análise
                  </label>
                </div>
                <ModernDatePicker
                  selectedDate={selectedDate}
                  onDateChange={onDateChange}
                  availableDates={availableDates}
                />
                <div className="pt-2">
                  <QuickDateNavigation
                    selectedDate={selectedDate}
                    onDateChange={onDateChange}
                    availableDates={availableDates}
                  />
                </div>
              </div>
            )}
            
            {/* Modern Turno Filter - Mobile Optimized */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <label className="text-xs sm:text-sm font-semibold text-foreground">
                  Turno Operacional
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg sm:rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                <Select value={selectedTurno} onValueChange={onTurnoChange}>
                  <SelectTrigger className="relative h-10 sm:h-12 bg-gradient-to-r from-background/90 to-background/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-lg sm:rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 text-xs sm:text-sm font-medium">
                    <SelectValue placeholder="Selecionar turno operacional" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl rounded-lg sm:rounded-xl">
                    <SelectItem value="todos" className="hover:bg-primary/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full" />
                        <span className="text-xs sm:text-sm">Todos os Turnos</span>
                      </div>
                    </SelectItem>
                    {turnos.map((turno) => (
                      <SelectItem key={turno} value={turno} className="hover:bg-primary/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-xs sm:text-sm">{turno}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
          </div>

          {/* Modern Clear Button - Mobile Optimized */}
          {(selectedTurno !== 'todos' || selectedDate) && (
            <div className="flex justify-center pt-3 sm:pt-4 border-t border-border/30">
              <Button
                variant="outline"
                onClick={() => {
                  onTurnoChange('todos');
                  if (onDateChange && availableDates.length > 0) {
                    onDateChange(availableDates[0]); // Primeira data na lista (mais recente)
                  }
                }}
                className="group relative px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-destructive/10 to-orange-500/10 hover:from-destructive/20 hover:to-orange-500/20 border-2 border-destructive/30 hover:border-destructive/50 rounded-lg sm:rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 text-xs sm:text-sm font-medium"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-orange-500/5 rounded-lg sm:rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                <div className="relative flex items-center space-x-2">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Limpar Filtros</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};