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
          // Цвет как у активных кнопок Telegram - синий/бирюзовый, хорошо виден на темном фоне
          "border-t-blue-500 border-r-cyan-500 border-b-blue-400 border-l-cyan-400",
          // Умеренное свечение для видимости
          "shadow-[0_0_20px_rgba(59,130,246,0.6),0_0_40px_rgba(6,182,212,0.4)]",
          // Обводка для контраста
          "ring-2 ring-blue-500/40",
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

