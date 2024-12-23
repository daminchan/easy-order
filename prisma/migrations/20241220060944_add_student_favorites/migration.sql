-- CreateTable
CREATE TABLE "StudentFavorite" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentFavorite_studentId_idx" ON "StudentFavorite"("studentId");

-- CreateIndex
CREATE INDEX "StudentFavorite_productId_idx" ON "StudentFavorite"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFavorite_studentId_productId_key" ON "StudentFavorite"("studentId", "productId");

-- AddForeignKey
ALTER TABLE "StudentFavorite" ADD CONSTRAINT "StudentFavorite_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFavorite" ADD CONSTRAINT "StudentFavorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
