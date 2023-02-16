/*
  Warnings:

  - Made the column `isManager` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "EmployeeSkills_skillId_key";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "isManager" SET NOT NULL;
