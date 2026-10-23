FROM node:22-alpine AS builder
WORKDIR /app

COPY . .
RUN npm ci
RUN npx nx build backend

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/libs/shared/dist ./node_modules/@egofm-reward/shared
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
CMD ["node", "dist/src/main.js"]
