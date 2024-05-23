/*
  Warnings:

  - Added the required column `ownedCards` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `ownedCards` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
