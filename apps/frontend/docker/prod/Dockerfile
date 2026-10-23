FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx nx build frontend --configuration=production

FROM nginx:stable
COPY nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/frontend/dist/browser /usr/share/nginx/html
