import { cn } from "@/lib/utils"

interface LoadingPageProps {
  className?: string
  message?: string
  variant?: "default" | "minimal" | "fullscreen"
}

export function LoadingPage({ 
  className, 
  message = "Loading...", 
  variant = "default" 
}: LoadingPageProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
        </div>
      </div>
    )
  }

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground font-medium">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in",
      className
    )}>
      {/* Main Loading Animation */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
        
        {/* Spinning ring */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-foreground">{message}</h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
        </div>
      </div>

      {/* Decorative gradient background */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div 
          className="w-full h-full"
          style={{ 
            background: "var(--gradient-primary)",
            maskImage: "radial-gradient(circle at center, transparent 40%, black 70%)"
          }}
        />
      </div>
    </div>
  )
}