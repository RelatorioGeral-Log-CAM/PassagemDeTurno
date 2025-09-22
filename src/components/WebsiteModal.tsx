import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface WebsiteModalProps {
  url: string;
  title: string;
  buttonText: string;
  children?: React.ReactNode;
}

export function WebsiteModal({ url, title, buttonText, children }: WebsiteModalProps) {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (children) {
    return (
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-3 text-xs bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
      onClick={handleClick}
    >
      <ExternalLink className="h-3 w-3 mr-1" />
      {buttonText}
    </Button>
  );
}