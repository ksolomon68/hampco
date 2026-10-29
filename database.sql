-- ========================================================
-- HAMPCO, Inc. MySQL Database Setup Script
-- Database: hampcoinc_carrie
-- User:     hampcoinc_keisha
-- ========================================================

-- 1. Site dynamic data (Popup announcements, events, galleries, site content)
CREATE TABLE IF NOT EXISTS `hampco_site_data` (
    `section_key` VARCHAR(64) NOT NULL PRIMARY KEY,
    `content` LONGTEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Contact form visitor inquiries
CREATE TABLE IF NOT EXISTS `hampco_contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(100) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

