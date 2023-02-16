-- DropForeignKey
ALTER TABLE "EmployeeSkills" DROP CONSTRAINT "EmployeeSkills_certificateId_fkey";

-- AlterTable
ALTER TABLE "EmployeeSkills" ALTER COLUMN "certificateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
