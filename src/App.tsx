import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { AdminViewProvider } from '@/contexts/AdminViewContext';
import { StoreStatusProvider } from '@/contexts/StoreStatusContext';
import { StoreSleepOverlay } from '@/components/StoreSleepOverlay';
import { Toaster } from '@/components/ui/sonner';
import { initTelegram, getUserId, isAdmin, waitForTelegramInitData } from '@/lib/telegram';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ADMIN_IDS } from '@/types/api';
import { useAdminView } from '@/contexts/AdminViewContext';

// Pages
import { CatalogPage } from '@pages/CatalogPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { AdminOrdersPage } from '@pages/AdminOrdersPage';
import { AdminOrderDetailPage } from '@pages/AdminOrderDetailPage';
import { AdminCatalogPage } from '@pages/AdminCatalogPage';
import { AdminCategoryPage } from '@pages/AdminCategoryPage';
import { AdminBroadcastPage } from '@pages/AdminBroadcastPage';
import { AdminStoreSettingsPage } from '@pages/AdminStoreSettingsPage';
import { AdminHelpPage } from '@pages/AdminHelpPage';
import NotFound from '@pages/NotFound';

// React Query Devtools (только в development)
let ReactQueryDevtools: React.ComponentType<{ initialIsOpen?: boolean }> | null = null;
if (import.meta.env.DEV) {
  import('@tanstack/react-query-devtools').then((mod) => {
    ReactQueryDevtools = mod.ReactQueryDevtools;
  });
}

function InitTelegram() {
  useEffect(() => {
    initTelegram();

    // Prefetch критичных данных при старте приложения
    const prefetchCriticalData = async () => {
      try {
        await queryClient.prefetchQuery({
          queryKey: queryKeys.catalog,
          queryFn: () => api.getCatalog(),
          staleTime: 5 * 60 * 1000,
        });
      } catch (error) {
        // Ошибки prefetch не критичны, игнорируем
      }
    };

    prefetchCriticalData();
  }, []);

  return null;
}

function HomePageRedirect() {
  const navigate = useNavigate();
  const { forceClientView } = useAdminView();
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      await waitForTelegramInitData(2000);
      const currentUserId = getUserId();
      setUserId(currentUserId);
      setChecking(false);
    };
    checkAdmin();
  }, []);

  const isUserAdmin = userId ? isAdmin(userId, ADMIN_IDS) : false;

  useEffect(() => {
    if (!checking && isUserAdmin && !forceClientView) {
      navigate('/admin/orders', { replace: true });
    }
  }, [checking, isUserAdmin, forceClientView, navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-cyan-400 border-r-cyan-500 border-b-cyan-300 border-l-transparent shadow-[0_0_30px_rgba(34,211,238,0.8),0_0_60px_rgba(34,211,238,0.4)] ring-2 ring-cyan-400/30"></div>
      </div>
    );
  }

  if (isUserAdmin && !forceClientView) {
    return null;
  }

  return <CatalogPage />;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AdminViewProvider>
          <StoreStatusProvider>
            <InitTelegram />
            <Routes>
              <Route path="/" element={<HomePageRedirect />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/order/:orderId" element={<AdminOrderDetailPage />} />
              <Route path="/admin/catalog" element={<AdminCatalogPage />} />
              <Route path="/admin/catalog/:categoryId" element={<AdminCategoryPage />} />
              <Route path="/admin/broadcast" element={<AdminBroadcastPage />} />
              <Route path="/admin/store" element={<AdminStoreSettingsPage />} />
              <Route path="/admin/help" element={<AdminHelpPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!isAdminRoute && <StoreSleepOverlay />}
            <Toaster />
            {import.meta.env.DEV && ReactQueryDevtools && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </StoreStatusProvider>
        </AdminViewProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

