-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "columnId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Cloumn" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL DEFAULT 1,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER,

    CONSTRAINT "Cloumn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attachment_taskId_idx" ON "Attachment"("taskId");

-- CreateIndex
CREATE INDEX "Attachment_uploadedById_idx" ON "Attachment"("uploadedById");

-- CreateIndex
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "unique_team_project" ON "ProjectTeam"("teamId", "projectId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_authorUserId_idx" ON "Task"("authorUserId");

-- CreateIndex
CREATE INDEX "Task_assignedUserId_idx" ON "Task"("assignedUserId");

-- CreateIndex
CREATE INDEX "TaskAssignment_userId_idx" ON "TaskAssignment"("userId");

-- CreateIndex
CREATE INDEX "TaskAssignment_taskId_idx" ON "TaskAssignment"("taskId");

-- CreateIndex
CREATE INDEX "User_teamId_idx" ON "User"("teamId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Cloumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cloumn" ADD CONSTRAINT "Cloumn_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
