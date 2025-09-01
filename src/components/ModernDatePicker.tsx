import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ModernDatePickerProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  availableDates?: string[];
  placeholder?: string;
}

export const ModernDatePicker = ({ 
  selectedDate, 
  onDateChange, 
  availableDates = [], 
  placeholder = "Selecionar período" 
}: ModernDatePickerProps) => {
  const [open, setOpen] = useState(false);

  // Converter datas disponíveis para objetos Date
  const availableDateObjects = availableDates.map(dateStr => {
    try {
      return new Date(dateStr + 'T00:00:00');
    } catch {
      return null;
    }
  }).filter(Boolean) as Date[];

  // Converter a data selecionada para objeto Date para o calendário
  const selectedDateObject = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined;

  // Formatar para exibição (DD/MM/YYYY)
  const formatDisplayDate = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr + 'T00:00:00');
      return format(dateObj, "dd/MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onDateChange) {
      const dateStr = format(date, "yyyy-MM-dd");
      onDateChange(dateStr);
      setOpen(false);
    }
  };

  // Função para verificar se uma data está disponível
  const isDayAvailable = (day: Date) => {
    if (availableDateObjects.length === 0) return true;
    return availableDateObjects.some(availableDate => 
      format(availableDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
  };


  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "relative w-full h-12 justify-start text-left font-medium bg-gradient-to-r from-background/90 to-background/95 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="relative">
                <CalendarIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                {selectedDate && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              
              <div className="flex-1">
                {selectedDate ? (
                  <div>
                    <div className="text-sm font-semibold">
                      {formatDisplayDate(selectedDate)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Período ativo
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm">{placeholder}</div>
                    <div className="text-xs text-muted-foreground">
                      Clique para selecionar
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-150" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0 border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-xl rounded-xl" align="start">
          <div className="relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-xl" />
            
            
            <Calendar
              mode="single"
              selected={selectedDateObject}
              onSelect={handleDateSelect}
              disabled={(day) => !isDayAvailable(day)}
              initialFocus
              locale={pt}
              className="p-4 pointer-events-auto"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};