/*
  Warnings:

  - A unique constraint covering the columns `[EmployeeSkillId]` on the table `Certificates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EmployeeSkills" DROP CONSTRAINT "EmployeeSkills_certificateId_fkey";

-- DropIndex
DROP INDEX "EmployeeSkills_certificateId_key";

-- AlterTable
ALTER TABLE "Certificates" ADD COLUMN     "EmployeeSkillId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Certificates_EmployeeSkillId_key" ON "Certificates"("EmployeeSkillId");

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_EmployeeSkillId_fkey" FOREIGN KEY ("EmployeeSkillId") REFERENCES "EmployeeSkills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
