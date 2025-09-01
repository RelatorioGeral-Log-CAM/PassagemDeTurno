import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { Separacao } from "@/components/Separacao";
import { MateriaPrima } from "@/components/MateriaPrima";
import { Expedicao } from "@/components/Expedicao";
import { RecebimentoMe } from "@/components/RecebimentoMe";
import { ArmazemEstojos } from "@/components/ArmazemEstojos";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'separacao':
        return <Separacao />;
      case 'materia-prima':
        return <MateriaPrima />;
      case 'expedicao':
        return <Expedicao />;
      case 'recebimento-me':
        return <RecebimentoMe />;
      case 'armazem-estojos':
        return <ArmazemEstojos />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-background">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <main className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          {renderCurrentPage()}
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
