// API Types для интеграции с Python бэкендом

export interface Category {
  id: string;
  name: string;
}

export interface CategoryPayload {
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  description?: string;
  image?: string;
  available: boolean;
  quantity: number; // Количество на складе
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  /** @deprecated Используйте images[0] вместо image. Поле оставлено для обратной совместимости. */
  image?: string;
  /** Массив изображений товара. Первый элемент (images[0]) - основное изображение. */
  images?: string[];
  variants?: ProductVariant[];
  price?: number;
  available: boolean;
}

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  /** @deprecated Используйте images. Поле оставлено для обратной совместимости с API. */
  image?: string;
  /** Массив изображений товара. Первый элемент (images[0]) - основное изображение. */
  images?: string[];
  category_id: string;
  available: boolean;
  variants?: ProductVariant[];
}

export interface CatalogResponse {
  categories: Category[];
  products: Product[];
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Cart {
  user_id: number;
  items: CartItem[];
  total_amount: number;
}

export interface OrderItem {
  product_id: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'новый'
  | 'принят' 
  | 'отказано';

export interface Order {
  id: string;
  user_id: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  comment?: string;
  delivery_type?: string;
  payment_type?: string;
  status: OrderStatus;
  rejection_reason?: string; // Причина отказа (если статус "отказано")
  items: OrderItem[];
  total_amount: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  can_edit_address: boolean;
  payment_receipt_file_id?: string;
  payment_receipt_url?: string;
  payment_receipt_filename?: string;
  delivery_time_slot?: string; // Временной промежуток доставки (например, "13:00-14:00")
}

export type BroadcastSegment = 'all' ;

export interface BroadcastRequest {
  title: string;
  message: string;
  segment: BroadcastSegment;
  link?: string;
}

export interface BroadcastResponse {
  success: boolean;
  sent_count: number;
  total_count: number;
  failed_count: number;
}

export interface AdminCategoryDetail {
  category: Category;
  products: Product[];
}

// Упрощенная модель заказа для списка (без полных items и лишних полей)
export interface OrderSummary {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items_count: number; // Количество товаров в заказе
}

export interface AdminOrdersResponse {
  orders: OrderSummary[];
  next_cursor?: string | null;
}

export interface StoreStatus {
  is_sleep_mode: boolean;
  sleep_message?: string;
  // sleep_until и payment_link убраны, т.к. не используются
}

export interface UpdateStoreStatusRequest {
  sleep: boolean;
  message?: string;
  // sleep_until убран, т.к. не используется
}

// UpdatePaymentLinkRequest удален, т.к. payment_link больше не используется

export interface CreateOrderRequest {
  name: string;
  phone: string;
  address: string;
  comment?: string;
  delivery_type?: string;
  payment_type?: string;
  payment_receipt?: File;
}

export interface UpdateAddressRequest {
  address: string;
}

export interface UpdateStatusRequest {
  status: OrderStatus;
  rejection_reason?: string; // Причина отказа (обязательна для статуса "отказано")
  delivery_time_slot?: string; // Временной промежуток доставки (например, "13:00-14:00")
}


export interface ApiError {
  error: string;
  message: string;
  status_code: number;
  detail?: string;
}

// API Client Configuration
// Нормализуем API URL так, чтобы:
// - абсолютные http/https адреса использовались как есть;
// - пути, начинающиеся с '/', оставались относительными (для прокси и одинакового origin);
// - голые домены/поддомены получали https://;
// - путь всегда заканчивался на /api.

// Утилита для получения env переменных (используется только для ADMIN_IDS)
// Работает аналогично тому, как читается API_URL - напрямую из import.meta.env
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const viteKey = `VITE_${key}`;
  
  // В Vite переменные VITE_* доступны через import.meta.env на клиенте
  // Они инжектируются во время сборки
  let value = import.meta.env[viteKey];
  
  // Если значение пустая строка, считаем что переменная не установлена
  if (value === '' || value === undefined || value === null) {
    value = null;
  } else {
    value = String(value).trim();
    // Если после trim пусто, тоже считаем что не установлено
    if (value === '') {
      value = null;
    }
  }
  
  const result = value || defaultValue;
  
  // Отладочная информация (только ошибки)
  if (key === 'ADMIN_IDS') {
    const isProduction = typeof window !== 'undefined' && (
      window.location.hostname.includes('railway.app') || 
      window.location.hostname.includes('vercel.app') ||
      import.meta.env.PROD
    );
    
    if (!result || result === '') {
      if (isProduction) {
        console.error('[ENV Debug] ❌ ADMIN_IDS не загружен!', {
          key,
          viteKey,
          'import.meta.env[VITE_ADMIN_IDS]': import.meta.env[viteKey],
          result: result || '(пусто)',
        });
      }
    }
  }
  
  return result;
};

// Чтение API URL с приоритетом: VITE_API_URL > '/api'
// В Vite переменные VITE_* доступны через import.meta.env на клиенте
const rawApiUrl = (
  import.meta.env.VITE_API_URL || 
  '/api'
).replace(/^["']|["']$/g, '').trim();

const normalizeApiBaseUrl = (value: string) => {
  if (!value) return '/api';
  // Абсолютный URL
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value.replace(/\/$/, '');
  }
  // Относительный путь (оставляем для прокси и same-origin)
  if (value.startsWith('/')) {
    return value;
  }
  // Голый домен — добавляем https://
  return `https://${value.replace(/^\/+/, '')}`;
};

let apiBaseUrl = normalizeApiBaseUrl(rawApiUrl)
  // Убираем возможный /app из пути (если фронтенд развернут в подпапке)
  .replace(/\/app\/api/g, '/api')
  .replace(/\/app$/g, '');

if (!apiBaseUrl.endsWith('/api')) {
  apiBaseUrl = apiBaseUrl.replace(/\/$/, '') + '/api';
}

// ВАЖНО: Если используется относительный путь '/api', но мы в production на Railway,
// это означает, что переменная окружения не установлена!
if (apiBaseUrl === '/api' && typeof window !== 'undefined') {
  const isProduction = window.location.hostname.includes('railway.app') || 
                       window.location.hostname.includes('vercel.app') ||
                       import.meta.env.PROD;
  if (isProduction) {
    console.error('[API Config] ❌ КРИТИЧЕСКАЯ ОШИБКА: Используется относительный путь /api в production!');
    console.error('[API Config] ❌ Установите переменную окружения в Railway!');
    console.error('[API Config] ❌ Поддерживаемые переменные:');
    console.error('[API Config]    - VITE_API_URL (рекомендуется)');
    console.error('[API Config] ❌ Пример: VITE_API_URL=https://your-backend.up.railway.app/api');
  }
}

export const API_BASE_URL = apiBaseUrl;

// Admin user IDs (должен совпадать с config.py в Python боте)
// Читаем аналогично API_URL - напрямую из import.meta.env с fallback
const adminIdsString = (
  import.meta.env.VITE_ADMIN_IDS || 
  ''
).replace(/^["']|["']$/g, '').trim();

export const ADMIN_IDS = adminIdsString
  ? adminIdsString
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id))
  : [];


// Предупреждение, если ADMIN_IDS пуст (только в production)
if (typeof window !== 'undefined') {
  if (ADMIN_IDS.length === 0) {
    const isProduction = window.location.hostname.includes('railway.app') || 
                         window.location.hostname.includes('vercel.app') ||
                         import.meta.env.PROD;
    
    if (isProduction) {
      console.error('[ADMIN_IDS] ❌ КРИТИЧЕСКАЯ ОШИБКА: ADMIN_IDS пуст! Автоматический редирект для админов не будет работать.');
      console.error('[ADMIN_IDS] ❌ Установите переменную окружения в Railway:');
      console.error('[ADMIN_IDS]    VITE_ADMIN_IDS=123456789,987654321');
      console.error('[ADMIN_IDS] ❌ Диагностика:', {
        'import.meta.env.VITE_ADMIN_IDS': import.meta.env.VITE_ADMIN_IDS || '(не установлено)',
        'adminIdsString': adminIdsString || '(пусто)',
        'PROD': import.meta.env.PROD,
      });
      console.error('[ADMIN_IDS] ❌ ВАЖНО: В Vite переменные VITE_* инжектируются во время СБОРКИ!');
      console.error('[ADMIN_IDS] ❌ Убедитесь, что переменная установлена в Railway ДО сборки приложения.');
    }
  }
}
