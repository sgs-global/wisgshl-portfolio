import { access, copyFile, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const exportDirectory = resolve(projectRoot, "out");
const deploymentDirectory = resolve(projectRoot, "cpanel-dist");

await access(exportDirectory);
await rm(deploymentDirectory, { recursive: true, force: true });
await mkdir(deploymentDirectory, { recursive: true });
await cp(exportDirectory, deploymentDirectory, { recursive: true });
await copyFile(resolve(projectRoot, ".htaccess"), resolve(deploymentDirectory, ".htaccess"));

console.log("cPanel package prepared in cpanel-dist/");
