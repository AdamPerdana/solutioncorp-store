-- CreateTable
CREATE TABLE `daily_visitors` (
    `visitorId` VARCHAR(36) NOT NULL,
    `day` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `daily_visitors_day_idx`(`day`),
    PRIMARY KEY (`visitorId`, `day`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
