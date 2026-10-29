<?php
/**
 * HAMPCO configuration.
 * No passwords live in this file. Secrets are loaded from a file that sits
 * OUTSIDE public_html and outside git:
 *
 *   /home/hampcoinc/hampco-secrets.php
 *
 * That file returns an array with two keys: 'db_pass' and 'admin_hash'.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'hampcoinc_carrie');
define('DB_USER', 'hampcoinc_keisha');
define('DB_CHARSET', 'utf8mb4');

$hampcoSecrets = [];
$hampcoSecretsFile = dirname(__DIR__, 2) . '/hampco-secrets.php';
if (is_readable($hampcoSecretsFile)) {
    $loaded = require $hampcoSecretsFile;
    if (is_array($loaded)) {
        $hampcoSecrets = $loaded;
    }
}
define('DB_PASS', (string) ($hampcoSecrets['db_pass'] ?? ''));
define('ADMIN_PASSWORD_HASH', (string) ($hampcoSecrets['admin_hash'] ?? ''));
unset($hampcoSecrets, $hampcoSecretsFile, $loaded);

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed.'
            ]);
            exit;
        }
    }
    return $pdo;
}

function initDatabaseSchema($pdo) {
    // 1. hampco_site_data table for site content, popup, events, galleries
    $sqlSiteData = "CREATE TABLE IF NOT EXISTS `hampco_site_data` (
        `section_key` VARCHAR(64) NOT NULL PRIMARY KEY,
        `content` LONGTEXT NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlSiteData);

    // 2. hampco_contacts table for contact inquiries
    $sqlContacts = "CREATE TABLE IF NOT EXISTS `hampco_contacts` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(100) DEFAULT NULL,
        `message` TEXT NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlContacts);
}

