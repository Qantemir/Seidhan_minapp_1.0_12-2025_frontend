import { Button } from '@/components/ui/button';
import { ArrowLeft } from '@/components/icons';

interface OrderHeaderProps {
  shortOrderId: string;
  onBack: () => void;
}

export const OrderHeader = ({ shortOrderId, onBack }: OrderHeaderProps) => (
  <header
    className="sticky glass border-b border-border/50 px-3 py-2.5 sm:px-4 sm:py-4 shadow-glow relative overflow-hidden"
    style={{
      top: 'calc(env(safe-area-inset-top, 0px) + var(--tg-header-height, 0px))',
      zIndex: 5,
    }}
  >
    {/* Декоративный градиентный фон */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    <div className="absolute top-0 right-0 w-40 h-40 bg-accent/3 rounded-full blur-3xl pointer-events-none" />
    
    <div className="flex items-center gap-2 sm:gap-3 relative z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onBack} 
        className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-primary/20 transition-all duration-300"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent truncate">
          Заказ #{shortOrderId}
        </h1>
      </div>
    </div>
  </header>
);

