 'use client';

/**
 * Хук для работы со статусом магазина
 * Использует React Query для кэширования и оптимизации запросов
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import type { StoreStatus } from '@/types/api';

/**
 * Хук для получения статуса магазина
 * 
 * Оптимизирован для производительности:
 * - Использует React Query для кэширования
 * - Минимальный polling (только когда приложение активно)
 * - Кэш на 5 минут (статус меняется очень редко)
 */
export function useStoreStatus() {
  const {
    data: status,
    isLoading: loading,
    refetch: refresh,
  } = useQuery<StoreStatus>({
    queryKey: queryKeys.storeStatus,
    queryFn: () => api.getStoreStatus(),
    staleTime: 5 * 60 * 1000, // 5 минут - статус меняется очень редко
    gcTime: 10 * 60 * 1000, // 10 минут кэш
    // Увеличен интервал polling до 5 минут - статус меняется редко
    // Polling только когда вкладка активна (refetchIntervalInBackground: false по умолчанию)
    refetchInterval: 5 * 60 * 1000, // Автоматический polling каждые 5 минут
    refetchIntervalInBackground: false, // Не делать запросы когда вкладка неактивна
    // Используем глобальные настройки для refetch, чтобы избежать конфликтов
    // и предотвратить 499 ошибки (client closed request) при быстрых переключениях
    refetchOnWindowFocus: false, // Используем глобальную настройку (false)
    refetchOnMount: false, // Используем глобальную настройку (false) - данные свежие благодаря staleTime
  });

  return {
    status: status || null,
    loading,
    refresh: async () => {
      await refresh();
    },
  };
}

