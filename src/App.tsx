import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Separacao } from "@/components/Separacao";
import { MateriaPrima } from "@/components/MateriaPrima";
import { Expedicao } from "@/components/Expedicao";
import { RecebimentoMe } from "@/components/RecebimentoMe";
import { ArmazemEstojos } from "@/components/ArmazemEstojos";
import { CampoTransitorio } from "@/components/CampoTransitorio";
import { Conexoes } from "@/components/Conexoes";
import RegistroPresenca from "@/components/RegistroPresenca";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <MainApp />;
};

const MainApp = () => {
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
      case 'campo-transitorio':
        return <CampoTransitorio />;
      case 'conexoes':
        return <Conexoes />;
      case 'registro-presenca':
        return <RegistroPresenca />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Toaster />
      <Sonner />
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentPage={currentPage} onNavigate={handleNavigate} />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 h-16 flex items-center justify-between bg-gradient-primary shadow-modern border-b border-primary/10 backdrop-blur supports-[backdrop-filter]:bg-gradient-primary/95">
            <div className="flex items-center gap-3 px-6">
              <SidebarTrigger className="text-white hover:bg-white/10 border-white/20" />
              <div className="h-6 w-px bg-white/20" />
              <div className="text-white">
                <h1 className="text-lg font-bold leading-tight">
                  {currentPage === "dashboard" && "Dashboard"}
                  {currentPage === "separacao" && "Separação"}
                  {currentPage === "materia-prima" && "Matéria Prima"}
                  {currentPage === "expedicao" && "Expedição"}
                  {currentPage === "recebimento-me" && "Recebimento ME"}
                  {currentPage === "armazem-estojos" && "Armazém Estojos"}
                  {currentPage === "campo-transitorio" && "$ Campo Transitório"}
                  {currentPage === "conexoes" && "Conexões"}
                  {currentPage === "registro-presenca" && "Registro de Presença"}
                </h1>
                <p className="text-sm text-white/80 font-medium">
                  {currentPage === "dashboard" && "Visão geral dos processos"}
                  {currentPage === "separacao" && "Controle de separação de pedidos"}
                  {currentPage === "materia-prima" && "Recebimento de matéria prima"}
                  {currentPage === "expedicao" && "Gestão e controle de expedição"}
                  {currentPage === "recebimento-me" && "Materiais e embalagens"}
                  {currentPage === "armazem-estojos" && "Controle de armazenagem"}
                  {currentPage === "campo-transitorio" && "Análise financeira por categoria"}
                  {currentPage === "conexoes" && "Acesso rápido aos sistemas integrados"}
                  {currentPage === "registro-presenca" && "Sistema de controle de presença"}
                </p>
              </div>
            </div>
            <div className="px-6">
              <div className="glass rounded-lg px-4 py-2">
                <span className="text-white/90 text-sm font-medium">
                  Logística CAM
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-gradient-to-br from-muted/30 to-background">
            <div className="container mx-auto py-8 px-6">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
      </SidebarProvider>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;