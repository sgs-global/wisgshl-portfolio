// Exercises the real PHPMailer transport against a temporary local TLS SMTP sink.
// Uses dummy credentials only. Never contacts an external mail server.
import tls from "node:tls";
import { execFileSync, spawn } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";

const php = process.argv[2] ?? "php";
const openssl = process.env.OPENSSL_BINARY ?? (process.platform === "win32" ? "C:/Program Files/Git/usr/bin/openssl.exe" : "openssl");
const directory = await mkdtemp(path.join(tmpdir(), "wisgshl-smtp-test-"));
const cert = path.join(directory, "cert.pem");
const key = path.join(directory, "key.pem");
execFileSync(openssl, ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", cert, "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"], { stdio: "ignore" });
let message = "";
let authenticated = false;
const server = tls.createServer({ key: await readFile(key), cert: await readFile(cert) }, (socket) => {
  socket.write("220 localhost Test SMTP\r\n");
  let buffer = "", authStage = 0, dataMode = false;
  socket.on("data", (chunk) => {
    buffer += chunk.toString();
    while (buffer.includes("\r\n")) {
      const boundary = buffer.indexOf("\r\n");
      const line = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      if (dataMode) {
        if (line === ".") { dataMode = false; socket.write("250 Accepted locally\r\n"); }
        else message += `${line}\r\n`;
      } else if (authStage === 1) {
        assert.equal(Buffer.from(line, "base64").toString(), "dummy@example.test");
        authStage = 2; socket.write("334 UGFzc3dvcmQ6\r\n");
      } else if (authStage === 2) {
        assert.equal(Buffer.from(line, "base64").toString(), "dummy-test-secret");
        authStage = 0; authenticated = true; socket.write("235 Authenticated\r\n");
      } else if (line.startsWith("EHLO")) socket.write("250-localhost\r\n250 AUTH LOGIN\r\n");
      else if (line === "AUTH LOGIN") { authStage = 1; socket.write("334 VXNlcm5hbWU6\r\n"); }
      else if (line.startsWith("MAIL FROM:") || line.startsWith("RCPT TO:")) socket.write("250 OK\r\n");
      else if (line === "DATA") { assert.ok(authenticated); dataMode = true; socket.write("354 Send message\r\n"); }
      else if (line === "QUIT") socket.end("221 Bye\r\n");
      else socket.write("250 OK\r\n");
    }
  });
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const config = path.join(directory, "smtp.php");
await writeFile(config, `<?php return ['host'=>'localhost','port'=>${server.address().port},'encryption'=>'ssl','username'=>'dummy@example.test','password'=>'dummy-test-secret','from'=>'dummy@example.test'];`);
const phpPath = (value) => value.replaceAll("\\", "/").replaceAll("'", "\\'");
const args = ["-n", "-d", `openssl.cafile=${cert}`];
if (process.platform === "win32") args.push("-d", `extension_dir=${path.join(path.dirname(php), "ext")}`, "-d", "extension=openssl");
args.push("-r", `require '${phpPath(path.resolve("public/mail/smtp.php"))}'; exit(\\Wisgshl\\Inquiry\\sendInquiryMail('receiver@example.test','LED Floodlights inquiry','Test requirements: 100 W','customer@example.test') ? 0 : 1);`);
try {
  const child = spawn(php, args, { env: { ...process.env, WISGSHL_SMTP_CONFIG: config }, stdio: "pipe" });
  let error = "";
  child.stderr.on("data", (chunk) => { error += chunk.toString(); });
  const timer = setTimeout(() => child.kill(), 15000);
  const code = await new Promise((resolve, reject) => { child.on("exit", resolve); child.on("error", reject); });
  clearTimeout(timer);
  assert.equal(code, 0, error);
  assert.ok(authenticated);
  assert.ok(message.includes("From: WISGSHL <dummy@example.test>"));
  assert.ok(message.includes("To: receiver@example.test"));
  assert.ok(message.includes("Reply-To: customer@example.test"));
  assert.ok(message.includes("Subject: LED Floodlights inquiry"));
  assert.ok(message.includes(Buffer.from("Test requirements: 100 W").toString("base64")));
  console.log("PASS: real PHPMailer implicit TLS, certificate verification, SMTP authentication, From/To/Reply-To, subject and encoded requirements. Local dummy mail sink only.");
} finally { server.close(); }
