import { ExternalLink, BarChart3, CheckCircle, TrendingUp, Building2, ActivityIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const connectionItems = [
  {
    title: "Contagem Cíclica",
    description: "Controle e monitoramento de inventário em tempo real",
    url: "https://lookerstudio.google.com/reporting/ef8ec540-97f4-4e67-87c5-0a5501919338/page/qRdAD",
    icon: BarChart3,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50"
  },
  {
    title: "Tarefas e Recursos",
    description: "Gestão integrada de atividades e recursos",
    url: "https://lookerstudio.google.com/u/0/reporting/27f01ce4-7d9d-4f31-9ec0-7db3d6fc6b4d/page/p_65j02zsgsd",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50"
  },
  {
    title: "Aderência EXP",
    description: "Análise de performance e aderência aos processos de expedição",
    url: "https://lookerstudio.google.com/u/0/reporting/baad54f9-106f-4eba-ad55-a5c748f52384/page/p_gsqxeljqnd",
    icon: TrendingUp,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50"
  },
  {
    title: "Plano de ação",
    description: "Análise técnica para a visualização do plano de ação",
    url: "",
    icon: ActivityIcon,
    gradient: "from-red-500 to-yellow-500",
    bgGradient: "from-red-50 to-yellow-50 dark:from-red-950/50 dark:to-yellow-950/50"
  }

];

export const Conexoes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl border border-accent/20 shadow-elegant backdrop-blur-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur animate-glow" />
                  <div className="relative p-4 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl shadow-modern">
                    <Building2 className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent flex items-center gap-3">
                    Conexões
                    <ExternalLink className="h-6 w-6 text-primary animate-pulse" />
                  </h1>
                  <p className="text-base text-muted-foreground font-medium mt-2 max-w-md">
                    Acesso rápido aos sistemas integrados • Dashboard de Conectividade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {connectionItems.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <Card 
                key={item.title}
                className={`
                  group relative overflow-hidden bg-gradient-to-br ${item.bgGradient} 
                  border border-accent/20 shadow-elegant backdrop-blur-sm 
                  hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 
                  cursor-pointer animate-fade-in
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                
                <CardContent className="relative p-6 space-y-4">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                      <div className={`relative p-3 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    className={`
                      w-full mt-4 bg-gradient-to-r ${item.gradient} text-white border-0 
                      hover:shadow-lg hover:scale-105 transition-all duration-300
                      group-hover:shadow-xl
                    `}
                    onClick={() => {
                      // TODO: Implement navigation logic
                      window.open(item.url, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Acessar Sistema
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border-accent/20 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/30 rounded-xl">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Sistemas Integrados
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Todos os sistemas estão integrados com nosso dashboard principal para fornecer 
                    uma visão unificada das operações logísticas. Acesse rapidamente qualquer 
                    módulo necessário através dos links acima.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                      Tempo Real
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">
                      Integrado
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
                      Seguro
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};