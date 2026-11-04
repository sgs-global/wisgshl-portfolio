<?php
// cPanel PHP endpoint: keep mail recipients and headers server-controlled.
namespace Wisgshl\Inquiry;

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Please submit the inquiry form.']);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = strtolower((string) parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST));
$allowedHosts = [$host];
$loopback = ['localhost', '127.0.0.1', '[::1]'];
// Next's local proxy forwards to 127.0.0.1 while the browser may use localhost.
if (in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true) && in_array($host, $loopback, true)) {
    $allowedHosts = $loopback;
}
if ($origin !== '' && !in_array(strtolower((string) parse_url($origin, PHP_URL_HOST)), $allowedHosts, true)) {
    respond(403, ['ok' => false, 'error' => 'Please submit your inquiry from this website.']);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    respond(415, ['ok' => false, 'error' => 'Invalid request format.']);
}
$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) {
    respond(413, ['ok' => false, 'error' => 'Your inquiry is too long. Please shorten the message.']);
}
$data = json_decode($raw, true);
if (!is_array($data)) respond(400, ['ok' => false, 'error' => 'Invalid inquiry data.']);

function field(array $data, string $key, int $limit, bool $multiline = false): string {
    $value = $data[$key] ?? '';
    if (!is_string($value) || strlen($value) > $limit) {
        respond(422, ['ok' => false, 'error' => 'Please check your inquiry fields and their lengths.']);
    }
    $value = trim(str_replace("\0", '', $value));
    return $multiline ? $value : trim(preg_replace('/[\r\n\t]+/', ' ', $value));
}

if (field($data, 'website_check', 300) !== '') {
    respond(422, ['ok' => false, 'error' => 'Please leave the verification field empty.']);
}
$name = field($data, 'name', 480);
$company = field($data, 'company', 640);
$email = field($data, 'email', 200);
$category = field($data, 'category', 120);
$message = field($data, 'message', 15000, true);
if ($name === '' || $company === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'Please provide your name, company, valid email and product requirements.']);
}
// Explicitly reject header injection rather than normalizing an email address.
if (preg_match('/[\r\n\0]/', $data['email'] ?? '')) {
    respond(422, ['ok' => false, 'error' => 'Please enter a valid business email.']);
}
$categories = [
    'LED Floodlights' => ['power' => 'Required power / wattage', 'installation' => 'Installation / application'],
    'Portable Power Stations' => ['capacity' => 'Required capacity / output', 'equipment' => 'Equipment to power'],
    'Solar Street Lights' => ['mounting' => 'Pole height / installation', 'operation' => 'Lighting requirements'],
    'LED Street Lights' => ['power' => 'Required power / voltage', 'mounting' => 'Pole height / application'],
    'LED Strip Lights' => ['length' => 'Required length / voltage', 'light' => 'Light colour / installation'],
    'Other / OEM & ODM' => [],
];
if (!array_key_exists($category, $categories)) respond(422, ['ok' => false, 'error' => 'Please select a product category.']);
$specs = $data['specifications'] ?? [];
if (!is_array($specs)) respond(422, ['ok' => false, 'error' => 'Please check your product requirements.']);
$website = field($data, 'website', 1200);
if ($website !== '' && (!filter_var($website, FILTER_VALIDATE_URL) || !in_array(strtolower((string) parse_url($website, PHP_URL_SCHEME)), ['http', 'https'], true))) {
    respond(422, ['ok' => false, 'error' => 'Please enter a valid website URL or leave it empty.']);
}
$reference = strtoupper(bin2hex(random_bytes(5)));
$lines = [
    'WISGSHL PRODUCT INQUIRY', 'Reference: ' . $reference, 'Product category: ' . $category, '',
    'Full name: ' . $name, 'Company: ' . $company, 'Business email: ' . $email,
];
foreach (['phone' => 'Phone / WhatsApp', 'country' => 'Country / region', 'quantity' => 'Estimated quantity', 'customization' => 'Customization', 'destination' => 'Delivery destination'] as $key => $label) {
    $lines[] = $label . ': ' . (field($data, $key, 640) ?: 'Not provided');
}
$lines[] = 'Company website: ' . ($website ?: 'Not provided');
$lines[] = '';
$lines[] = $category . ' REQUIREMENTS';
foreach ($categories[$category] as $key => $label) {
    $lines[] = $label . ': ' . (field($specs, $key, 1200) ?: 'Not provided');
}
$lines[] = '';
$lines[] = 'Product details and requirements:';
$lines[] = $message;

// A small per-IP limit; only counters are stored, never the inquiry body.
$rateFile = sys_get_temp_dir() . '/wisgshl-inquiry-' . hash('sha256', __DIR__ . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
$handle = @fopen($rateFile, 'c+');
if ($handle === false || !flock($handle, LOCK_EX)) {
    if (is_resource($handle)) fclose($handle);
    respond(503, ['ok' => false, 'error' => 'Submission is temporarily unavailable. Please email info@globalsgs.com.']);
}
$rate = json_decode(stream_get_contents($handle) ?: '{}', true);
$now = time();
$recent = is_array($rate) && ($rate['start'] ?? 0) > $now - 600;
$count = $recent ? (int) ($rate['count'] ?? 0) : 0;
if ($count >= 5) {
    flock($handle, LOCK_UN); fclose($handle);
    header('Retry-After: 600');
    respond(429, ['ok' => false, 'error' => 'Too many inquiries. Please wait a few minutes or email us directly.']);
}
rewind($handle); ftruncate($handle, 0);
fwrite($handle, json_encode(['start' => $recent ? $rate['start'] : $now, 'count' => $count + 1]));
flock($handle, LOCK_UN); fclose($handle);

$recipient = 'info@globalsgs.com';
$subject = '[WISGSHL] ' . $category . ' inquiry - ' . $company . ' [' . $reference . ']';
if (!function_exists(__NAMESPACE__ . '\\sendInquiryMail')) require_once __DIR__ . '/mail/smtp.php';
$accepted = sendInquiryMail($recipient, $subject, implode("\r\n", $lines), $email);
if (!$accepted) respond(503, ['ok' => false, 'error' => 'Email delivery is temporarily unavailable. Please try again or email info@globalsgs.com directly.']);
respond(200, ['ok' => true, 'reference' => $reference]);
