# WISGSHL portfolio

Next.js static website deployed to cPanel with an authenticated PHP SMTP inquiry handler.

## Local development

```powershell
npm install
npm run dev
```

The development command starts Next.js and PHP together. PHP with OpenSSL is required; set `PHP_BINARY` to your PHP executable if it is not on PATH. Local SMTP settings are in `.private/smtp.php`, which Git ignores.

## One-time cPanel email setup

1. In cPanel File Manager, enable **Show Hidden Files** and go to `/home/alltradebd/`.
2. Create `.wisgshl` and upload the local `.private/smtp.php` file there as `/home/alltradebd/.wisgshl/smtp.php`.
3. Keep it outside the website directory `/home/alltradebd/sgsitc.com/`. Suggested permissions are 700 for the folder and 600 for the file, readable by the account's PHP process.
4. Enable a supported PHP 8.x version and OpenSSL for the domain. Outgoing SMTP port 465 must be allowed by hosting.

The recipient and authenticated sender are `info@globalsgs.com`. The customer's email is used as Reply-To. Credentials are not part of Git, the static build, or the deployment package. Future deployments preserve this private file. `config/smtp.example.php` is a non-secret template if configuring it manually.

## Update GitHub and deploy to cPanel

Run these commands from the project folder after editing:

```powershell
npm.cmd run deploy:prepare
git add -A -- app components public scripts config cpanel-dist .gitignore .cpanel.yml next.config.ts package.json package-lock.json README.md CONTACT-INQUIRIES.md
git commit -m "Update portfolio website"
git push origin main
```

`deploy:prepare` runs lint, TypeScript/build checks, creates the static export and refreshes **`cpanel-dist/`**. Commit the generated files as well as the source: cPanel copies the deployment folder and does not build Next.js.

In **cPanel → Git Version Control → Manage → Pull or Deploy**:

1. Click **Update from Remote** for `https://github.com/sgs-global/wisgshl-portfolio.git`, branch `main`.
2. Click **Deploy HEAD Commit** and wait for completion.
3. Confirm **Last Deployed SHA** matches `git rev-parse HEAD` locally.
4. Hard-refresh the website. Check the separate Phone/WhatsApp links and make one authorized inquiry submission to verify inbox delivery.

Deployment tasks copy `cpanel-dist/` to `/home/alltradebd/sgsitc.com/`. This must be the domain's document root in cPanel. Pulling updates and deploying are separate actions; GitHub pushes alone do not publish the site with this configuration.

If email submission fails, confirm the private configuration path, PHP/OpenSSL and outbound port 465, then inspect the PHP error log. Never put the password in public files to troubleshoot. See [CONTACT-INQUIRIES.md](CONTACT-INQUIRIES.md) for detailed setup and testing commands.
