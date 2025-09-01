import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays, addMonths, subMonths } from "date-fns";
import { pt } from "date-fns/locale";

interface QuickDateNavigationProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  availableDates?: string[];
}

export const QuickDateNavigation = ({ selectedDate, onDateChange, availableDates = [] }: QuickDateNavigationProps) => {
  if (!selectedDate || !onDateChange) return null;

  const currentDate = new Date(selectedDate + 'T00:00:00');
  
  const findNextAvailableDate = (startDate: Date, direction: 'next' | 'prev') => {
    if (availableDates.length === 0) return null;
    
    // Ordenação cronológica das datas
    const sortedDates = [...availableDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const currentIndex = sortedDates.findIndex(date => date === selectedDate);
    
    if (direction === 'next' && currentIndex < sortedDates.length - 1) {
      return sortedDates[currentIndex + 1];
    }
    if (direction === 'prev' && currentIndex > 0) {
      return sortedDates[currentIndex - 1];
    }
    return null;
  };

  const handleNavigation = (type: 'prev-day' | 'next-day' | 'prev-month' | 'next-month') => {
    let newDate: Date;
    
    switch (type) {
      case 'prev-day':
        const prevAvailable = findNextAvailableDate(currentDate, 'prev');
        if (prevAvailable) {
          onDateChange(prevAvailable);
          return;
        }
        newDate = subDays(currentDate, 1);
        break;
      case 'next-day':
        const nextAvailable = findNextAvailableDate(currentDate, 'next');
        if (nextAvailable) {
          onDateChange(nextAvailable);
          return;
        }
        newDate = addDays(currentDate, 1);
        break;
      case 'prev-month':
        newDate = subMonths(currentDate, 1);
        break;
      case 'next-month':
        newDate = addMonths(currentDate, 1);
        break;
      default:
        return;
    }
    
    const dateStr = format(newDate, "yyyy-MM-dd");
    onDateChange(dateStr);
  };

  const isAtBoundary = (direction: 'start' | 'end') => {
    if (availableDates.length === 0) return false;
    // Ordenação cronológica das datas
    const sortedDates = [...availableDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const currentIndex = sortedDates.findIndex(date => date === selectedDate);
    
    if (direction === 'start') {
      return currentIndex === 0;
    } else {
      return currentIndex === sortedDates.length - 1;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-secondary/20 rounded-xl border border-primary/10 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('prev-month')}
          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-300 shadow-card"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('prev-day')}
          disabled={isAtBoundary('start')}
          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-300 shadow-card disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-bold text-dark-blue">
          {format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(currentDate, "EEEE", { locale: pt })}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('next-day')}
          disabled={isAtBoundary('end')}
          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-300 shadow-card disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation('next-month')}
          className="h-8 w-8 p-0 hover:bg-accent hover:scale-110 transition-all duration-300 shadow-card"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};