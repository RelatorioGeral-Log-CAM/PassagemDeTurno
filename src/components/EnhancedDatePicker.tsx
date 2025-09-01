import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface EnhancedDatePickerProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  availableDates?: string[];
  placeholder?: string;
}

export const EnhancedDatePicker = ({ 
  selectedDate, 
  onDateChange, 
  availableDates = [], 
  placeholder = "Selecionar data"
}: EnhancedDatePickerProps) => {
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

  // Navegação rápida
  const handleQuickNavigation = (direction: 'prev' | 'next') => {
    if (!selectedDate || !onDateChange) return;
    
    const currentDate = new Date(selectedDate + 'T00:00:00');
    const newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    
    // Verificar se a nova data está disponível
    if (isDayAvailable(newDate)) {
      const dateStr = format(newDate, "yyyy-MM-dd");
      onDateChange(dateStr);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 shadow-card hover:shadow-glow transition-all duration-300 bg-gradient-glass backdrop-blur-sm border-primary/20 hover:border-primary/40 group",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span className="flex-1">
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-2 border-primary/10 shadow-glow" align="start">
        <Calendar
          mode="single"
          selected={selectedDateObject}
          onSelect={handleDateSelect}
          disabled={(day) => !isDayAvailable(day)}
          initialFocus
          locale={pt}
        />
      </PopoverContent>
    </Popover>
  );
};