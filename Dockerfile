# Dockerfile для фронтенда Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Объявляем ARG для переменных окружения, которые нужны во время сборки
# Railway автоматически передает переменные окружения как build args
ARG VITE_API_URL
ARG VITE_PUBLIC_URL
ARG VITE_ADMIN_IDS
ARG VITE_PAYMENT_LINK

# Устанавливаем переменные окружения из ARG для использования во время сборки
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL
ENV VITE_ADMIN_IDS=$VITE_ADMIN_IDS
ENV VITE_PAYMENT_LINK=$VITE_PAYMENT_LINK

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходники
COPY . .

# Собираем Vite приложение
RUN yarn build

# Production образ с nginx для статических файлов
FROM nginx:alpine AS runner

WORKDIR /app

# Копируем собранные статические файлы из dist
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx для SPA (чтобы все маршруты работали)
RUN echo 'server { \
    listen 8080; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
