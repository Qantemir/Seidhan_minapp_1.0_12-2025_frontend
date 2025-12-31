// Утилита для роутинга с React Router
import { useCallback } from 'react';
import { useNavigate as useReactRouterNavigate, useLocation as useReactRouterLocation, useParams as useReactRouterParams } from 'react-router-dom';

// Хук для навигации
export function useNavigate() {
  const navigate = useReactRouterNavigate();
  
  return useCallback((to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      // Если передано число, делаем go back/forward
      if (to === -1) {
        navigate(-1);
      } else if (to === 1) {
        navigate(1);
      }
    } else {
      // Если строка, делаем навигацию
      if (options?.replace) {
        navigate(to, { replace: true });
      } else {
        navigate(to);
      }
    }
  }, [navigate]);
}

// Хук для получения текущего пути
export function useLocation() {
  return useReactRouterLocation();
}

// Хук для получения параметров маршрута
export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return useReactRouterParams() as T;
}
