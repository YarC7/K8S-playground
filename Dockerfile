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

# Sửa lại dòng này để chỉ định ép build cho đúng ứng dụng API của bạn
# (Thay "api" bằng tên định danh project của bạn trong package.json nếu khác)
RUN pnpm --filter api run build

# --- TẦNG 2: RUNTIME RUNNER ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY prisma ./prisma/
RUN pnpm install --prod --frozen-lockfile

# 💡 GIẢI PHÁP AN TOÀN: Copy từ thư mục dist của sub-project sang thẳng root của runner
# Giả sử thư mục chứa code NestJS của bạn tên là apps/api
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]