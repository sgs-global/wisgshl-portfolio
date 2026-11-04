<?php
// Copy to /home/alltradebd/.wisgshl/smtp.php on cPanel, outside the website root.
// For local development, use .private/smtp.php (ignored by Git).
return [
    'host' => 'mail.privateemail.com',
    'port' => 465,
    'encryption' => 'ssl',
    'username' => 'info@globalsgs.com',
    'password' => 'REPLACE_WITH_MAILBOX_PASSWORD',
    'from' => 'info@globalsgs.com',
    'from_name' => 'WISGSHL',
];
