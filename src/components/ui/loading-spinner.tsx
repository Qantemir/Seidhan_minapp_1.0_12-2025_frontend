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
          // Яркий бирюзовый цвет для максимальной видимости
          "border-t-cyan-400 border-r-cyan-500 border-b-cyan-300 border-l-transparent",
          // Усиленное свечение для лучшей заметности
          "shadow-[0_0_30px_rgba(34,211,238,0.8),0_0_60px_rgba(34,211,238,0.4)]",
          // Дополнительная обводка для контраста
          "ring-2 ring-cyan-400/30",
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

