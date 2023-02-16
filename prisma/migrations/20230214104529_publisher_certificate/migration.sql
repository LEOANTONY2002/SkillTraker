/*
  Warnings:

  - You are about to drop the column `publisher` on the `Certificates` table. All the data in the column will be lost.
  - Added the required column `publisherId` to the `Certificates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificates" DROP COLUMN "publisher",
ADD COLUMN     "publisherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publishers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
