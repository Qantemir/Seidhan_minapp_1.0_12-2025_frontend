/**
 * API Route для проксирования webhook запросов от Telegram Bot API на бэкенд.
 * 
 * Проблема: Telegram отправляет webhook на URL фронтенда, но Next.js rewrites
 * не могут проксировать POST запросы на внешние URL между контейнерами.
 * 
 * Решение: Этот route handler проксирует POST запросы на бэкенд.
 */

import { NextRequest, NextResponse } from 'next/server';

// Получаем URL бэкенда из переменных окружения
function getBackendUrl(): string {
  // Приоритет: NEXT_PUBLIC_API_URL > NEXT_PUBLIC_VITE_API_URL > VITE_API_URL
  const apiUrl = 
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.NEXT_PUBLIC_VITE_API_URL || 
    process.env.VITE_API_URL;

  if (!apiUrl) {
    // Fallback: если переменная не установлена, используем localhost (для разработки)
    const backendPort = process.env.PORT || process.env.BACKEND_PORT || '8080';
    return `http://localhost:${backendPort}`;
  }

  // Нормализуем URL
  let normalizedUrl = String(apiUrl).trim().replace(/^["']|["']$/g, '');

  // Если это полный URL, используем как есть
  if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
    // Убираем /api в конце, если есть, так как мы добавим /bot/webhook
    return normalizedUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }

  // Если это относительный путь, используем localhost
  if (normalizedUrl.startsWith('/')) {
    const backendPort = process.env.PORT || process.env.BACKEND_PORT || '8080';
    // Убираем /api в конце, если есть
    const path = normalizedUrl.replace(/\/api\/?$/, '');
    return `http://localhost:${backendPort}${path}`;
  }

  // Голый домен - добавляем https://
  return `https://${normalizedUrl.replace(/^\/+/, '').replace(/\/api\/?$/, '')}`;
}

export async function POST(request: NextRequest) {
  try {
    const backendBaseUrl = getBackendUrl();
    // getBackendUrl уже возвращает URL без /api, добавляем его
    const webhookUrl = `${backendBaseUrl}/api/bot/webhook`;

    // Получаем тело запроса
    const body = await request.text();
    
    // Получаем заголовки (копируем важные заголовки от Telegram)
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Копируем заголовки от исходного запроса (если есть)
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    // Проксируем запрос на бэкенд
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: body || undefined,
    });

    // Получаем ответ от бэкенда
    const responseData = await response.text();
    
    // Логируем ошибки (если статус не 200)
    if (!response.ok) {
      console.error(
        `[Webhook Proxy] Ошибка от бэкенда: ${response.status} ${response.statusText}`,
        responseData.substring(0, 200)
      );
    }
    
    // Возвращаем ответ с теми же заголовками и статусом
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('[Webhook Proxy] Ошибка при проксировании webhook на бэкенд:', error);
    // Возвращаем ok: true для Telegram, чтобы он не повторял запрос
    return NextResponse.json(
      { ok: true, error: 'Internal server error' },
      { status: 200 }
    );
  }
}

// Обрабатываем OPTIONS запросы для CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

