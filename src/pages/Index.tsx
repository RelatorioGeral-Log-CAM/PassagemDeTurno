import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Separacao } from "@/components/Separacao";
import { MateriaPrima } from "@/components/MateriaPrima";
import { Expedicao } from "@/components/Expedicao";
import { RecebimentoMe } from "@/components/RecebimentoMe";
import { ArmazemEstojos } from "@/components/ArmazemEstojos";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "separacao":
        return <Separacao />;
      case "materia-prima":
        return <MateriaPrima />;
      case "expedicao":
        return <Expedicao />;
      case "recebimento-me":
        return <RecebimentoMe />;
      case "armazem-estojos":
        return <ArmazemEstojos />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hover:bg-muted" />
              <div className="h-6 w-px bg-border" />
              <h1 className="font-semibold text-foreground">
                {currentPage === "dashboard" && "Dashboard - Visão Geral"}
                {currentPage === "separacao" && "Separação"}
                {currentPage === "materia-prima" && "Matéria Prima"}
                {currentPage === "expedicao" && "Expedição"}
                {currentPage === "recebimento-me" && "Recebimento ME"}
                {currentPage === "armazem-estojos" && "Armazém Estojos"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6 px-4">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
