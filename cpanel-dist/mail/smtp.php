<?php
namespace Wisgshl\Inquiry;

function sendInquiryMail(string $recipient, string $subject, string $body, string $replyTo): bool {
    $paths = array_filter([
        getenv('WISGSHL_SMTP_CONFIG') ?: null,
        dirname(__DIR__, 2) . '/.private/smtp.php',
        dirname(__DIR__, 2) . '/.wisgshl/smtp.php',
    ]);
    $config = null;
    foreach ($paths as $path) {
        if (is_file($path) && is_readable($path)) {
            $config = require $path;
            break;
        }
    }
    if (!is_array($config) || empty($config['username']) || empty($config['password'])) {
        error_log('[WISGSHL] Private SMTP configuration is missing.');
        return false;
    }
    require_once __DIR__ . '/PHPMailer/Exception.php';
    require_once __DIR__ . '/PHPMailer/SMTP.php';
    require_once __DIR__ . '/PHPMailer/PHPMailer.php';
    try {
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $config['host'] ?? 'mail.privateemail.com';
        $mail->Port = (int) ($config['port'] ?? 465);
        $mail->SMTPAuth = true;
        $mail->Username = $config['username'];
        $mail->Password = $config['password'];
        $mail->SMTPSecure = ($config['encryption'] ?? 'ssl') === 'tls'
            ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
            : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->SMTPDebug = 0;
        $mail->Timeout = 20;
        $mail->Timelimit = 25;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->setFrom($config['from'] ?? $config['username'], $config['from_name'] ?? 'WISGSHL');
        $mail->addAddress($recipient);
        $mail->addReplyTo($replyTo);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->isHTML(false);
        return $mail->send();
    } catch (\Throwable $exception) {
        // Do not expose credentials, SMTP exchanges or detailed errors to visitors.
        error_log('[WISGSHL] SMTP send failed: ' . get_class($exception));
        return false;
    }
}
