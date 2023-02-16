-- DropForeignKey
ALTER TABLE "Certificates" DROP CONSTRAINT "Certificates_employeeSkillId_fkey";

-- AddForeignKey
ALTER TABLE "EmployeeSkills" ADD CONSTRAINT "EmployeeSkills_id_fkey" FOREIGN KEY ("id") REFERENCES "Certificates"("employeeSkillId") ON DELETE RESTRICT ON UPDATE CASCADE;
