FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]