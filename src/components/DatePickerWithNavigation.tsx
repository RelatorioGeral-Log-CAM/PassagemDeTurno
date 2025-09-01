import { EnhancedDatePicker } from "@/components/EnhancedDatePicker";
import { QuickDateNavigation } from "@/components/QuickDateNavigation";

interface DatePickerWithNavigationProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  availableDates?: string[];
  placeholder?: string;
  showQuickNavigation?: boolean;
}

export const DatePickerWithNavigation = ({ 
  selectedDate, 
  onDateChange, 
  availableDates = [], 
  placeholder = "Selecionar data",
  showQuickNavigation = true
}: DatePickerWithNavigationProps) => {
  return (
    <div className="space-y-4">
      {/* Seletor de data principal */}
      <EnhancedDatePicker
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        availableDates={availableDates}
        placeholder={placeholder}
      />
      
      {/* Navegação rápida embaixo do calendário */}
      {showQuickNavigation && selectedDate && (
        <QuickDateNavigation
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          availableDates={availableDates}
        />
      )}
    </div>
  );
};