import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface WebsiteModalProps {
  url: string;
  title: string;
  buttonText: string;
  children?: React.ReactNode;
}

export function WebsiteModal({ url, title, buttonText, children }: WebsiteModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 p-4">
          <div className="w-full h-full rounded-lg overflow-hidden border border-border/50 shadow-lg">
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}