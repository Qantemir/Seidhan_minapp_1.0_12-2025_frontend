 'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';
import type { CatalogResponse } from '@/types/api';

export const CATALOG_QUERY_KEY = queryKeys.catalog;

/**
 * Хук для получения каталога товаров
 * 
 * Оптимизирован для производительности:
 * - staleTime: 5 минут - каталог меняется редко, можно кэшировать дольше
 * - refetchOnMount: false (использует кэш если данные свежие)
 * - refetchOnWindowFocus: false (экономит запросы)
 * - Нет автоматического polling - каталог обновляется только вручную или при монтировании
 */
export function useCatalog() {
  return useQuery<CatalogResponse>({
    queryKey: CATALOG_QUERY_KEY,
    queryFn: () => api.getCatalog(),
    // Увеличен staleTime до 5 минут - каталог меняется редко
    staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
    gcTime: 15 * 60 * 1000, // 15 минут кэш
    // Не перезапрашивать автоматически - каталог обновляется только при явном запросе
    refetchOnMount: false, // Используем кэш если данные свежие (staleTime)
    refetchOnWindowFocus: false, // Экономим запросы
    refetchInterval: false, // Нет автоматического polling - каталог обновляется редко
    // Если сервер вернул 304 Not Modified, React Query использует кэш через staleTime
    // Благодаря staleTime (2 минуты), кэш будет использован даже при ошибке 304
    retry: (failureCount, error) => {
      // Не повторять запрос при 304 Not Modified
      if (error instanceof Error && error.message === 'NOT_MODIFIED') {
        return false;
      }
      return failureCount < 1; // Одна попытка повтора для других ошибок
    },
  });
}

