import { memo, useCallback, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminViewContext } from '@/contexts/AdminViewContext';
import type { LucideIcon } from 'lucide-react';
import { Boxes, Megaphone, Moon, Package, UserRound, LifeBuoy } from '@/components/icons';
import { useLocation, useNavigate } from '@/lib/router';

export interface AdminHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

const NAV_LINKS: Array<{
  to: string;
  label: string;
  icon: LucideIcon;
}> = [
  { to: '/admin', label: 'Заказы', icon: Package },
  { to: '/admin/catalog', label: 'Каталог', icon: Boxes },
  { to: '/admin/broadcast', label: 'Рассылка', icon: Megaphone },
  { to: '/admin/store', label: 'Режим сна', icon: Moon },
  { to: '/admin/help', label: 'Помощь', icon: LifeBuoy },
];

export const AdminHeader = memo(({ title, description, icon }: AdminHeaderProps) => {
  const Icon = icon ?? Package;
  const location = useLocation();
  const navigate = useNavigate();
  
  // Безопасный доступ к контексту без выбрасывания ошибки
  const adminViewContext = useContext(AdminViewContext);
  const setForceClientView = adminViewContext?.setForceClientView;

  const isActive = useCallback((path: string) => {
    const pathname = location?.pathname || '/';
    if (path === '/admin') {
      return pathname === '/admin' || pathname === '/admin/orders';
    }
    return pathname === path;
  }, [location?.pathname]);

  const handleClientMode = useCallback(() => {
    if (setForceClientView) {
      setForceClientView(true);
    }
    if (navigate) {
      navigate('/');
    }
  }, [setForceClientView, navigate]);

  return (
    <header className="glass border-b border-border/50 p-4 sm:p-5 space-y-4 shadow-glow relative overflow-hidden">
      {/* Декоративный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-3 border border-primary/30 shadow-sm glow-primary" aria-hidden>
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
              Админ-панель
            </p>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {title || 'Админ-панель'}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1.5">
                {description}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
          onClick={handleClientMode}
        >
          <UserRound className="h-4 w-4" />
          <span className="hidden sm:inline">Режим клиента</span>
          <span className="sm:hidden">Клиент</span>
        </Button>
      </div>

      <nav className="flex flex-wrap gap-2 relative z-10" aria-label="Навигация по админке">
        {NAV_LINKS.map(link => {
          if (!link || !link.to || !link.label) return null;
          const LinkIcon = link.icon;
          const active = isActive(link.to);
          return (
            <Button
              key={link.to}
              size="sm"
              variant={active ? 'default' : 'outline'}
              className={cn(
                'flex items-center gap-2 transition-all duration-300',
                active && 'glow-hover shadow-sm'
              )}
              onClick={() => navigate?.(link.to)}
              aria-current={active ? 'page' : undefined}
            >
              {LinkIcon && <LinkIcon className="h-4 w-4" />}
              {link.label}
            </Button>
          );
        })}
      </nav>
    </header>
  );
});

AdminHeader.displayName = 'AdminHeader';
