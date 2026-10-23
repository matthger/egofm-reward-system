FROM node:22-alpine
WORKDIR /app
CMD ["./scripts/wait-and-run.sh", "npx", "nx", "serve", "frontend", "--host", "0.0.0.0", "--poll=1000"]
