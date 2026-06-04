FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# --- TẦNG 1: BUILD CODE ---
FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY prisma ./prisma/
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod

# --- TẦNG 2: RUNTIME RUNNER ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]