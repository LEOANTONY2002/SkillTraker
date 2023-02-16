/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Publishers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Publishers_name_key" ON "Publishers"("name");
