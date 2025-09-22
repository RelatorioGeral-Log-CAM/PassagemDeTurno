import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, ExternalLink, Users, Clock, Smartphone } from "lucide-react";
import QRCode from "qrcode";

const RegistroPresenca = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  const presenceLink = "https://script.google.com/a/macros/grupoboticario.com.br/s/AKfycbxcbEoTfe5qWpsQNh-8c0T-A1GaV-FTOUtz5GqdgErSdTUvBglA-JeSiUXbcJqhPjpuhg/exec";

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrDataURL = await QRCode.toDataURL(presenceLink, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrDataURL);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    };

    generateQRCode();
  }, []);

  const handleAccessSystem = () => {
    window.open(presenceLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
              Registro de Presença
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Registre sua presença de forma rápida e segura através do QR Code ou acesso direto ao sistema
          </p>
        </div>

        {/* QR Code Card */}
        <div className="grid gap-6 mb-8">
          <Card className="bg-gradient-to-br from-background to-muted/20 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <QrCode className="h-6 w-6 text-primary" />
                QR Code de Acesso
              </CardTitle>
              <CardDescription className="text-base">
                Escaneie o código abaixo com seu smartphone para acessar o sistema de registro
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {/* QR Code Display */}
              <div className="p-6 bg-white rounded-xl shadow-inner border border-border/50">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code para Registro de Presença"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-muted rounded-lg">
                    <QrCode className="h-12 w-12 text-muted-foreground animate-pulse" />
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-foreground">Como usar:</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Abra a câmera do seu celular e aponte para o QR Code</span>
                </div>
              </div>

              {/* Direct Access Button */}
              <Button
                onClick={handleAccessSystem}
                className="w-full max-w-xs bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar Sistema Diretamente
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 border-blue-200/50 dark:from-blue-950/30 dark:to-blue-900/20 dark:border-blue-800/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Presença de Equipe</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                Registre a presença de toda a equipe de forma organizada e controlada
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/50 to-green-100/30 border-green-200/50 dark:from-green-950/30 dark:to-green-900/20 dark:border-green-800/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg text-green-700 dark:text-green-300">Controle de Horário</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600/80 dark:text-green-300/80">
                Mantenha o controle preciso dos horários de entrada e saída da equipe
              </p>
            </CardContent>
          </Card>
        </div>
    </div>
    </div>
  );
};

export default RegistroPresenca;