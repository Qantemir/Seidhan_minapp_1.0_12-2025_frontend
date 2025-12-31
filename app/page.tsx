'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CatalogPage } from '@pages/CatalogPage';
import { getUserId, isAdmin, waitForTelegramInitData } from '@/lib/telegram';
import { ADMIN_IDS } from '@/types/api';
import { useAdminView } from '@/contexts/AdminViewContext';

export default function HomePage() {
  const router = useRouter();
  const { forceClientView } = useAdminView();
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // Ждем загрузки данных Telegram перед проверкой админа
  useEffect(() => {
    const checkAdmin = async () => {
      // Ждем инициализации Telegram данных (максимум 2 секунды)
      await waitForTelegramInitData(2000);
      const currentUserId = getUserId();
      setUserId(currentUserId);
      setChecking(false);
    };
    checkAdmin();
  }, []);

  const isUserAdmin = userId ? isAdmin(userId, ADMIN_IDS) : false;

  useEffect(() => {
    // Перенаправляем на админку админов
    if (!checking && isUserAdmin && !forceClientView) {
      router.replace('/admin');
    }
  }, [checking, isUserAdmin, forceClientView, router]);

  // Показываем загрузку пока проверяем админа
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-blue-500 border-r-cyan-500 border-b-blue-400 border-l-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.6),0_0_40px_rgba(6,182,212,0.4)] ring-2 ring-blue-500/40"></div>
      </div>
    );
  }

  // Редирект обрабатывается для админов
  if (isUserAdmin && !forceClientView) {
    return null; // Редирект обрабатывается
  }

  return <CatalogPage />;
}

