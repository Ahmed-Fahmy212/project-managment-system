-- AlterTable
ALTER TABLE "Cloumn" ALTER COLUMN "projectId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "order" SERIAL NOT NULL;

-- CreateIndex
CREATE INDEX "Task_columnId_idx" ON "Task"("columnId");
