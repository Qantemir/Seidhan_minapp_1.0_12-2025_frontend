import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          // Яркий белый цвет с тенью для лучшей видимости на темном фоне
          "border-t-white border-r-white/50 border-b-white/30 border-l-transparent",
          // Добавляем свечение для лучшей видимости
          "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
          className
        )}
        aria-label="Загрузка"
        role="status"
      >
        <span className="sr-only">Загрузка...</span>
      </div>
    </div>
  );
}

