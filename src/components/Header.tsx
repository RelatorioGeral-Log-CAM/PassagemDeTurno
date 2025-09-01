import { Building2, Clock, Users, Package, Truck, Archive, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary shadow-modern border-b border-border">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:h-20 items-start sm:items-center justify-between gap-2 sm:gap-4 py-2 sm:py-0">
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white flex-shrink-0" />
              <div className="text-white min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg lg:text-2xl font-bold leading-tight truncate">
                  Passagem de Turno - Logística CAM
                </h1>
                <p className="text-xs sm:text-sm opacity-90 font-medium hidden sm:block">Grupo Boticário</p>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max pb-1 sm:pb-0" role="tablist" aria-label="Navegação principal">
              <Button
                variant={currentPage === 'dashboard' ? 'secondary' : 'outline'}
                onClick={() => onNavigate('dashboard')}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 whitespace-nowrap text-xs sm:text-sm"
                aria-label="Dashboard"
                aria-current={currentPage === 'dashboard' ? 'page' : undefined}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <Button
                variant={currentPage === 'separacao' ? 'secondary' : 'outline'}
                onClick={() => onNavigate('separacao')}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 whitespace-nowrap text-xs sm:text-sm"
                aria-label="Separação"
                aria-current={currentPage === 'separacao' ? 'page' : undefined}
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Separação</span>
              </Button>
              <Button
                variant={currentPage === 'materia-prima' ? 'secondary' : 'outline'}
                onClick={() => onNavigate('materia-prima')}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 whitespace-nowrap text-xs sm:text-sm"
                aria-label="Matéria Prima"
                aria-current={currentPage === 'materia-prima' ? 'page' : undefined}
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">M. Prima</span>
              </Button>
              <Button
                variant={currentPage === 'expedicao' ? 'secondary' : 'outline'}
                onClick={() => onNavigate('expedicao')}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 whitespace-nowrap text-xs sm:text-sm"
                aria-label="Expedição"
                aria-current={currentPage === 'expedicao' ? 'page' : undefined}
              >
                <Truck className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Expedição</span>
              </Button>
              <Button
                variant={currentPage === 'recebimento-me' ? 'secondary' : 'outline'}
                onClick={() => onNavigate('recebimento-me')}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 whitespace-nowrap text-xs sm:text-sm"
                aria-label="Recebimento ME"
                aria-current={currentPage === 'recebimento-me' ? 'page' : undefined}
              >
                <Archive className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Receb. ME</span>
              </Button>
              <Button
                variant={currentPage === 'armazem-estojos' ? 'secondary' : 'outline'}
                onClick={() => onNavigate('armazem-estojos')}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 whitespace-nowrap text-xs sm:text-sm"
                aria-label="Armazém Estojos"
                aria-current={currentPage === 'armazem-estojos' ? 'page' : undefined}
              >
                <Boxes className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Arm. Estojos</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};