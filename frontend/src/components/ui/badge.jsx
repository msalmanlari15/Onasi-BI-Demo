import * as React from "react"

const getVariantClasses = (variant) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  
  switch (variant) {
    case "default":
      return `${baseClasses} border-transparent bg-primary text-primary-foreground hover:bg-primary/90`;
    case "secondary":
      return `${baseClasses} border-transparent bg-muted text-muted-foreground hover:bg-muted/80`;
    case "destructive":
      return `${baseClasses} border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80`;
    case "outline":
      return `${baseClasses} border-border text-muted-foreground`;
    default:
      return `${baseClasses} border-transparent bg-primary text-primary-foreground hover:bg-primary/90`;
  }
};

function Badge({ className, variant = "default", ...props }) {
  const variantClasses = getVariantClasses(variant);
  const combinedClasses = className ? `${variantClasses} ${className}` : variantClasses;
  
  return <div className={combinedClasses} {...props} />;
}

export { Badge }
