import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  gradient = 'primary',
  className 
}: KPICardProps) => {
  const gradientClasses = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-secondary',
    accent: 'bg-gradient-to-br from-accent to-accent/80'
  };

  return (
    <Card className={cn(
      "relative overflow-hidden shadow-card hover:shadow-modern transition-all duration-300 hover:-translate-y-1 animate-slide-up group",
      className
    )}>
      <div className={cn(
        "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
        gradientClasses[gradient]
      )} />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    trend.isPositive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-full",
            gradientClasses[gradient],
            "animate-float"
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};