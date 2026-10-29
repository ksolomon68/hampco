<?php
/**
 * HAMPCO Backend API Endpoint
 * Handles MySQL persistence for site sections, events, galleries, popup, contact inquiries, and uploads.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    $pdo = getDbConnection();
    initDatabaseSchema($pdo);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection/initialization failed: ' . $e->getMessage()
    ]);
    exit;
}

switch ($action) {
    case 'test':
        try {
            $stmt = $pdo->query("SELECT DATABASE() as db, VERSION() as version");
            $info = $stmt->fetch();
            echo json_encode([
                'success' => true,
                'message' => 'MySQL connection established successfully!',
                'database' => $info['db'],
                'version' => $info['version']
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;

    case 'get_all':
        try {
            $stmt = $pdo->query("SELECT `section_key`, `content` FROM `hampco_site_data`");
            $rows = $stmt->fetchAll();
            $data = [];
            foreach ($rows as $row) {
                $decoded = json_decode($row['content'], true);
                $data[$row['section_key']] = $decoded !== null ? $decoded : $row['content'];
            }
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to load site data: ' . $e->getMessage()
            ]);
        }
        break;

    case 'save_section':
        $rawInput = file_get_contents('php://input');
        $payload = json_decode($rawInput, true);

        if (!$payload) {
            $payload = $_POST;
        }

        $section = $payload['section'] ?? '';
        $data = $payload['data'] ?? null;

        if (!$section || $data === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Missing section name or data payload.'
            ]);
            exit;
        }

        $allowedSections = ['popup', 'events', 'galleries', 'site_content'];
        if (!in_array($section, $allowedSections, true)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid section name: ' . htmlspecialchars($section)
            ]);
            exit;
        }

        try {
            $jsonContent = is_string($data) ? $data : json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $stmt = $pdo->prepare("
                INSERT INTO `hampco_site_data` (`section_key`, `content`)
                VALUES (:key, :content)
                ON DUPLICATE KEY UPDATE `content` = :update_content, `updated_at` = CURRENT_TIMESTAMP
            ");
            $stmt->execute([
                ':key' => $section,
                ':content' => $jsonContent,
                ':update_content' => $jsonContent
            ]);

            echo json_encode([
                'success' => true,
                'section' => $section,
                'message' => "Section '{$section}' saved to MySQL database successfully."
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to save section: ' . $e->getMessage()
            ]);
        }
        break;

    case 'contact':
        $rawInput = file_get_contents('php://input');
        $payload = json_decode($rawInput, true);
        if (!$payload) {
            $payload = $_POST;
        }

        $name = trim($payload['name'] ?? '');
        $email = trim($payload['email'] ?? '');
        $phone = trim($payload['phone'] ?? '');
        $message = trim($payload['message'] ?? '');

        if (!$name || !$email || !$message) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Name, email, and message are required.'
            ]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO `hampco_contacts` (`name`, `email`, `phone`, `message`)
                VALUES (:name, :email, :phone, :message)
            ");
            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':phone' => $phone,
                ':message' => $message
            ]);

            // Dispatch email notification to Carrie Simon
            $toEmail = defined('NOTIFICATION_EMAIL') ? NOTIFICATION_EMAIL : 'carrie.simon.hampco@gmail.com';
            $subject = "New HAMPCO Website Inquiry from " . $name;
            $fromHost = $_SERVER['SERVER_NAME'] ?? 'hampcoinc.org';

            $headers = [
                'From: HAMPCO Website <no-reply@' . $fromHost . '>',
                'Reply-To: ' . $name . ' <' . $email . '>',
                'X-Mailer: PHP/' . phpversion(),
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8'
            ];

            $submittedAt = date('F j, Y, g:i a T');
            $safeName = htmlspecialchars($name);
            $safeEmail = htmlspecialchars($email);
            $safePhone = $phone ? htmlspecialchars($phone) : 'Not provided';
            $safeMessage = nl2br(htmlspecialchars($message));

            $emailBody = "
            <html>
            <head>
              <meta charset='UTF-8'>
              <title>New Website Inquiry</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
                .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .header { background: #dc2626; color: #ffffff; padding: 24px 28px; }
                .header h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; }
                .header p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }
                .content { padding: 28px; }
                .field { margin-bottom: 18px; }
                .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
                .value { font-size: 15px; color: #0f172a; font-weight: 600; }
                .value a { color: #dc2626; text-decoration: none; }
                .message-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-top: 6px; font-size: 14px; color: #334155; line-height: 1.6; }
                .footer { background: #f1f5f9; padding: 16px 28px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class='card'>
                <div class='header'>
                  <h2>HAMPCO, Inc. — New Website Inquiry</h2>
                  <p>Received {$submittedAt}</p>
                </div>
                <div class='content'>
                  <div class='field'>
                    <div class='label'>Visitor Name</div>
                    <div class='value'>{$safeName}</div>
                  </div>
                  <div class='field'>
                    <div class='label'>Email Address</div>
                    <div class='value'><a href='mailto:{$safeEmail}'>{$safeEmail}</a></div>
                  </div>
                  <div class='field'>
                    <div class='label'>Telephone Number</div>
                    <div class='value'>{$safePhone}</div>
                  </div>
                  <div class='field'>
                    <div class='label'>Inquiry Details</div>
                    <div class='message-box'>{$safeMessage}</div>
                  </div>
                </div>
                <div class='footer'>
                  You can click <strong>Reply</strong> in your email client to respond directly to {$safeName} ({$safeEmail}).<br>
                  This inquiry has also been archived to your MySQL database (<code>hampco_contacts</code>).
                </div>
              </div>
            </body>
            </html>
            ";

            $mailSent = @mail($toEmail, $subject, $emailBody, implode("\r\n", $headers));

            echo json_encode([
                'success' => true,
                'message' => 'Thank you for contacting HAMPCO, Inc. Your inquiry has been sent to Carrie Simon and saved.',
                'email_dispatched' => $mailSent
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to record inquiry: ' . $e->getMessage()
            ]);
        }
        break;

    case 'get_contacts':
        try {
            $stmt = $pdo->query("SELECT * FROM `hampco_contacts` ORDER BY `created_at` DESC LIMIT 100");
            $contacts = $stmt->fetchAll();
            echo json_encode([
                'success' => true,
                'contacts' => $contacts
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to fetch contacts: ' . $e->getMessage()
            ]);
        }
        break;

    case 'upload':
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'No file was uploaded.'
            ]);
            exit;
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Upload error code: ' . $file['error']
            ]);
            exit;
        }

        // Limit size to 15MB
        if ($file['size'] > 15 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'File size exceeds maximum limit of 15MB.'
            ]);
            exit;
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
        if (!in_array($ext, $allowedExtensions, true)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Unsupported file format: ' . htmlspecialchars($ext)
            ]);
            exit;
        }

        // Target directory in public/html root
        $targetDir = dirname(__DIR__) . '/uploads';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $fileName = 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $destination = $targetDir . '/' . $fileName;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $url = 'uploads/' . $fileName;
            echo json_encode([
                'success' => true,
                'url' => $url,
                'filename' => $fileName
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to save uploaded file on server.'
            ]);
        }
        break;

    default:
        echo json_encode([
            'success' => true,
            'message' => 'HAMPCO API is online.',
            'database' => DB_NAME,
            'user' => DB_USER
        ]);
        break;
}

