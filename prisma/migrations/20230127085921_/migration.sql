/*
  Warnings:

  - You are about to drop the column `EmployeeSkillId` on the `Certificates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeSkillId]` on the table `Certificates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Certificates" DROP CONSTRAINT "Certificates_EmployeeSkillId_fkey";

-- DropIndex
DROP INDEX "Certificates_EmployeeSkillId_key";

-- AlterTable
ALTER TABLE "Certificates" DROP COLUMN "EmployeeSkillId",
ADD COLUMN     "employeeSkillId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Certificates_employeeSkillId_key" ON "Certificates"("employeeSkillId");

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_employeeSkillId_fkey" FOREIGN KEY ("employeeSkillId") REFERENCES "EmployeeSkills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
