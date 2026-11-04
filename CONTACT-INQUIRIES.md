# Contact page and product inquiries

## What changed

The contact page has a shorter header and a simplified form. Name, company, business email, product category and requirements are required. Country/region and company website are explicitly optional. Phone, quantity, customization and delivery destination are also optional to make the first inquiry easier. Preferred contact method and the agreement checkbox have been removed.

Clicking anywhere on a product category card opens the same form in a native dialog, with the category selected. The form shows two relevant optional requirement fields for each category. All entered information, including the selected category, is included in the email. Escape, the close button and the backdrop dismiss the dialog; focus returns to the product card.

The recipient confirmed by the site owner is **info@globalsgs.com**. Subjects use `[WISGSHL] CATEGORY inquiry - COMPANY [REFERENCE]`. Reply-To is the customer's validated email, so the team can reply directly. No user-supplied email headers or recipients are accepted.

## Authenticated SMTP and cPanel deployment

Inquiries use Namecheap Private Email with PHPMailer 7.1.1, `mail.privateemail.com`, port **465**, implicit TLS (the provider calls this SSL), and authenticated username **info@globalsgs.com**. The From and recipient are both **info@globalsgs.com**. Reply-To is the customer's email. TLS certificate verification is enabled; SMTP passwords and exchanges are never included in browser responses or logs. The supported settings are documented by [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/1179/2175/general-private-email-configuration-for-mail-clients-and-mobile-devices/).

The password is stored locally in **`.private/smtp.php`**. Git ignores this directory, and the build never copies it to `out` or `cpanel-dist`. Do not move it into `public`, `cpanel-dist`, JavaScript, `.cpanel.yml`, or a Git commit. Rotate the password shared in chat before production use and update the local and server private configurations.

### One-time private configuration on cPanel

1. Open cPanel File Manager and go to `/home/alltradebd/` (above the site's document root).
2. Create the hidden directory `.wisgshl` there. Enable Show Hidden Files if needed.
3. Upload the local `.private/smtp.php` file as **`/home/alltradebd/.wisgshl/smtp.php`**. Alternatively, copy `config/smtp.example.php` there and enter the current mailbox password privately in File Manager. Use restrictive file permissions readable by the account's PHP process (typically 600; folder 700).
4. Keep this file outside `/home/alltradebd/sgsitc.com/`. Future Git deployments leave it untouched.
5. Use supported PHP 8.x with OpenSSL enabled for the domain. Ensure outbound TCP port 465 is permitted. If using a different private path, set the hosting environment variable `WISGSHL_SMTP_CONFIG` to its absolute filename.

### Deploy website changes

Run `npm.cmd run deploy:prepare`, commit the source plus all `cpanel-dist` changes, and push. In cPanel select **Update from Remote**, then **Deploy HEAD Commit**. The package includes `inquiry.php`, `mail/smtp.php` and the three upstream PHPMailer classes with their license. `.htaccess` in `mail/` denies direct HTTP access to those helper files. There is no Composer install required on cPanel.

The private SMTP file is deliberately not deployed via Git. Without it, the form returns a delivery-unavailable error and offers the prefilled email fallback. No visitor will see SMTP credentials or server responses.

### Local development and the former HTTP 405

`npm run dev` now starts a PHP backend on `127.0.0.1:8767` alongside Next.js. A development-only rewrite sends `/inquiry.php` to that backend; production remains a static export with cPanel executing PHP. Restart any previously running Next.js process once to pick up the new startup command.

The launcher uses `PHP_BINARY` if supplied, otherwise installed `php`, or the temporary portable PHP runtime used during this session if available. If needed, install PHP with OpenSSL and set `PHP_BINARY` to its executable. The portable Windows runtime gets a local trust bundle from Node's trusted roots; certificate verification is never disabled.

Use the normal `npm run dev` command rather than starting Next.js directly. Local valid form submissions use the real configured SMTP account and will send email. A missing/invalid form POST through the bridge returns HTTP 422, verifying that PHP is now handling it rather than the former Next.js HTTP 405.

### Verification

- `node scripts/check-smtp.mjs` verifies TLS and SMTP authentication from `.private/smtp.php` and then quits. It never sends MAIL FROM, RCPT TO, or DATA and does not send an email.
- `node scripts/verify-inquiry-endpoint.mjs PATH_TO_PHP` tests all five categories, message contents, optional fields, validation and failure handling with a temporary mock transport.
- `node scripts/verify-smtp-transport.mjs PATH_TO_PHP` exercises the real PHPMailer implementation against a temporary local TLS SMTP sink with dummy credentials. No external email is sent. Requires OpenSSL command-line tools (`OPENSSL_BINARY` can select the executable).

The Namecheap TLS connection and authentication were verified successfully. The real PHPMailer transport passed local TLS/authentication/message tests. Inbox delivery has not been tested: no real email was sent during setup.

The UI only reports success after the SMTP server accepts the inquiry. SMTP acceptance does not guarantee inbox placement, so check the recipient's inbox/spam folder after the first authorized live submission.

## Office and headquarters

The Shenzhen office address and map search link are centralized in `components/inquiryConfig.ts`:

No. 27, Tongyu Rich Industry Zone, Ganqing, Longgang District, Shenzhen City, Guangdong Province, China.

The supplied address is used for the embedded map and an always-visible external Google Maps search link. The map preview has a useful address fallback while loading. The exact building pin has not been independently established: a Google Maps share link, place ID or verified coordinates can replace the search when supplied. Google Maps [search URLs](https://developers.google.com/maps/documentation/urls/get-started) support address queries without an API key.

The headquarters block states Hong Kong, China; the International Trade Division is in Longgang, Shenzhen, and the R&D & Manufacturing Base is in Guzhen, Zhongshan. No unprovided Hong Kong street address or pinpoint coordinates were invented.

## Files and checks

- `components/ContactForm.tsx`: shared form, validation UI, direct submission and failure fallback.
- `components/inquiryConfig.ts`: destination email, office address and product requirement fields.
- `components/ProductCategories.tsx` and its CSS module: accessible product popup.
- `components/OfficeMap.tsx`: embedded address map and loading fallback.
- `app/contact/page.tsx`, `app/globals.css`: contact content and responsive layout.
- `app/privacy/page.tsx`: updated description of inquiry handling.
- `public/inquiry.php`: server-side validation and email composition; `public/mail/smtp.php`: private-config loading and authenticated SMTP sending.
- `scripts/verify-inquiry-endpoint.mjs`: PHP integration tests using a temporary local SMTP transport mock; no real email is sent. Run with `node scripts/verify-inquiry-endpoint.mjs PATH_TO_PHP`.
- `scripts/verify-contact.mjs`: browser tests using local Chrome CDP and intercepted email requests. Requires the export served at `127.0.0.1:8765` and a test Chrome CDP session at port 9229.

Local validation covers PHP syntax, all five product subjects and detailed message bodies, recipient, reply-to, Unicode, optional fields, invalid requests, rate limits and mail failure. Browser tests cover all five popups, category preselection, captured requirements, failure recovery, keyboard closing/focus return, address/map configuration and 768/390/320px layouts.

Nothing was published and no real email was sent during implementation.
