import { Shield } from "lucide-react";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
}

const Logo = ({ variant = "default", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32,
  };

  const textColor = variant === "light" ? "text-primary-foreground" : "text-primary";
  const accentColor = variant === "light" ? "text-accent" : "text-accent";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`p-2 rounded-xl ${variant === "light" ? "bg-primary-foreground/10" : "bg-primary/10"}`}>
          <Shield className={accentColor} size={iconSizes[size]} strokeWidth={2.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-soft" />
      </div>
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} font-display font-bold ${textColor} leading-tight`}>
          Aadhaar<span className={accentColor}>SmartFlow</span>
        </span>
        <span className={`text-xs ${variant === "light" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          Demographic Update System
        </span>
      </div>
    </div>
  );
};

export default Logo;
