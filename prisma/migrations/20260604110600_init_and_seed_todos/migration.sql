-- CreateTable (Nếu chưa tồn tại)
CREATE TABLE IF NOT EXISTS "todos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- Seed dữ liệu mẫu cho bảng todos
INSERT INTO "todos" ("title", "description", "is_completed") VALUES
('Học Kubernetes', 'Cấu hình Cluster và triển khai PgBouncer', false),
('Cấu hình CI/CD', 'Cập nhật deploy workflow và Dockerfile sang pnpm', true),
('Tích hợp Prisma ORM', 'Chuyển đổi các câu lệnh truy vấn SQL sang Prisma client', true),
('Tạo tài liệu API', 'Tích hợp Swagger UI để kiểm thử trực quan các endpoint', false)
ON CONFLICT DO NOTHING;
