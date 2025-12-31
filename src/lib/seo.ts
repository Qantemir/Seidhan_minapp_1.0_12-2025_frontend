// Кэшируем нормализованный baseUrl
const cachedBaseUrl: string | null = null;
const trailingSlashRegex = /\/$/;

// Получаем baseUrl из текущего домена (динамически)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return "https://miniapp.local";
};

export const siteConfig = {
  name: "Mini Shop",
  shortName: "Mini Shop",
  description:
    "Mini Shop — современный Telegram-магазин с каталогом, корзиной и быстрым оформлением заказа.",
  keywords: [
    "telegram shop",
    "mini app",
    "онлайн магазин",
    "доставка",
    "каталог товаров",
    "telegram mini app",
  ],
  locale: "ru_RU",
  get baseUrl() {
    return getBaseUrl();
  },
  ogImage: "https://dummyimage.com/1200x630/0B0C10/66FCF1&text=Mini+Shop",
  contactEmail: "support@miniapp.local",
};

const httpRegex = /^https?:\/\//;

export const buildCanonicalUrl = (path?: string) => {
  const base = siteConfig.baseUrl;
  if (!path) return base;
  if (httpRegex.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

