/*
  Warnings:

  - You are about to drop the column `certificateId` on the `EmployeeSkills` table. All the data in the column will be lost.
  - Made the column `employeeSkillId` on table `Certificates` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EmployeeSkills" DROP CONSTRAINT "EmployeeSkills_certificateId_fkey";

-- DropIndex
DROP INDEX "EmployeeSkills_certificateId_key";

-- AlterTable
ALTER TABLE "Certificates" ALTER COLUMN "employeeSkillId" SET NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeSkills" DROP COLUMN "certificateId";

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_employeeSkillId_fkey" FOREIGN KEY ("employeeSkillId") REFERENCES "EmployeeSkills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
