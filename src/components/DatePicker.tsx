import { useState } from "react";
import { format, parse } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  availableDates?: string[];
  placeholder?: string;
}

export const DatePicker = ({ selectedDate, onDateChange, availableDates = [], placeholder = "Selecionar data" }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  // Converter datas disponíveis para objetos Date
  const availableDateObjects = availableDates.map(dateStr => {
    try {
      // As datas já vêm no formato YYYY-MM-DD do carregador
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
    if (date && onDateChange && isDaySelectable(date)) {
      // Converter para YYYY-MM-DD para manter consistência
      const dateStr = format(date, "yyyy-MM-dd");
      onDateChange(dateStr);
      setOpen(false);
    }
  };

  const isDayAvailable = (day: Date) => {
    // Permitir hover em todas as datas, mas apenas clique nas disponíveis
    return true;
  };

  const isDaySelectable = (day: Date) => {
    if (availableDateObjects.length === 0) return true;
    return availableDateObjects.some(availableDate => 
      format(availableDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[200px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDateObject}
          onSelect={handleDateSelect}
          disabled={(day) => !isDaySelectable(day)}
          initialFocus
          className="pointer-events-auto"
          locale={pt}
        />
      </PopoverContent>
    </Popover>
  );
};