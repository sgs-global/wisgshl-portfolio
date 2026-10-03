# GitHub and cPanel deployment

This project is configured as a static Next.js export. `npm run build` creates the production website in `out/`, and cPanel deploys that folder to the `sgsitc.com` document root.

## Requirements

- Node.js 20.9 or newer on the local computer and cPanel account.
- A GitHub repository.
- cPanel access with **Git Version Control** and Terminal/SSH enabled.
- The `sgsitc.com` document root set to `/home/alltradebd/sgsitc.com`.

The production destination is already configured as `/home/alltradebd/sgsitc.com/` in `.cpanel.yml`.

## 1. Publish the local repository to GitHub

Create an empty private repository on GitHub without adding a README, license, or `.gitignore`. Then run:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

For a private repository, configure an SSH deploy key in cPanel or use the private-repository access procedure supplied by the hosting provider.

## 2. Connect GitHub in cPanel

1. Open **cPanel → Files → Git Version Control**.
2. Choose **Create** and enable **Clone a Repository**.
3. Enter the GitHub clone URL.
4. Use a repository path outside the website folder, for example `/home/alltradebd/repositories/wisgshl`.
5. Open **Manage → Pull or Deploy**.
6. Select **Update from Remote**, then **Deploy HEAD Commit**.

cPanel reads `.cpanel.yml`, installs the locked dependencies, creates the static `out/` export, and copies it to `/home/alltradebd/sgsitc.com/`.

## 3. Publish later updates

On the local computer:

```bash
npm run production:check
git add .
git commit -m "Describe the website update"
git push origin main
```

Then in cPanel select **Update from Remote** and **Deploy HEAD Commit**.

For automatic push deployment, add the cPanel-managed repository as a second Git remote and push `main` to both GitHub and cPanel. cPanel's post-receive hook will run `.cpanel.yml` automatically. The exact SSH repository URL is shown by the hosting provider/cPanel account.

## Important checks before launch

- Confirm the Node.js version in cPanel is at least 20.9.
- Confirm `DEPLOYPATH` matches the domain's real document root.
- Enable the domain's SSL certificate and force HTTPS in cPanel.
- Upload `public/videos/company-introduction.mp4` before publishing the company video.
- Test the contact form, email links, map, navigation, video, and mobile layout on the live domain.
- The contact form opens the visitor's email application; it does not store submissions on the server.
