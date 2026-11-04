// Start Next.js plus the local PHP inquiry endpoint; no credentials reach the client.
import { spawn } from "node:child_process";
import { access, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { rootCertificates } from "node:tls";

const portable = path.join(tmpdir(), "wisgshl-php-qa", "php.exe");
let php = process.env.PHP_BINARY;
if (!php) {
  try { await access(portable); php = portable; } catch { php = "php"; }
}
const caFile = path.join(tmpdir(), "wisgshl-dev-ca.pem");
await writeFile(caFile, rootCertificates.join("\n"));
const phpArgs = ["-d", `openssl.cafile=${caFile}`];
if (php === portable) phpArgs.push("-d", `extension_dir=${path.join(path.dirname(php), "ext")}`, "-d", "extension=openssl");
phpArgs.push("-S", "127.0.0.1:8767", "-t", "public");
const backend = spawn(php, phpArgs, { stdio: "inherit" });
let frontend;
let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  frontend?.kill();
  backend.kill();
  process.exitCode = code;
};
backend.on("error", () => {
  console.error("PHP could not start. Install PHP with OpenSSL or set PHP_BINARY to your php executable.");
  stop(1);
});
backend.on("exit", (code) => { if (!stopping) stop(code || 1); });
// A GET is a readiness check only; it cannot send mail.
let ready = false;
for (let attempt = 0; attempt < 30 && !stopping; attempt++) {
  try { ready = (await fetch("http://127.0.0.1:8767/inquiry.php")).status === 405; } catch {}
  if (ready) break;
  await new Promise((resolve) => setTimeout(resolve, 100));
}
if (!ready) {
  console.error("Local inquiry server did not become ready on port 8767.");
  stop(1);
} else {
  console.log("Local inquiry server ready; /inquiry.php is proxied through Next.js.");
  frontend = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", ...process.argv.slice(2)], {
    stdio: "inherit", env: { ...process.env, WISGSHL_PHP_ORIGIN: "http://127.0.0.1:8767" },
  });
  frontend.on("error", () => stop(1));
  frontend.on("exit", (code) => stop(code ?? 0));
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
