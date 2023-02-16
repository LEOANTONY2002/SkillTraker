/*
  Warnings:

  - A unique constraint covering the columns `[certificateId]` on the table `EmployeeSkills` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EmployeeSkills" DROP CONSTRAINT "EmployeeSkills_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSkills_certificateId_key" ON "EmployeeSkills"("certificateId");

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
