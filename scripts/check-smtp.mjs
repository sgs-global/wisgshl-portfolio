// Authenticate to the configured SMTP account and QUIT. Never submits a message.
import { readFile } from "node:fs/promises";
import tls from "node:tls";

const config = await readFile(".private/smtp.php", "utf8");
const setting = (name) => {
  const match = config.match(new RegExp(`'${name}'\\s*=>\\s*'([^']*)'`));
  if (!match) throw new Error(`Missing ${name} in private SMTP configuration.`);
  return match[1];
};
const host = setting("host");
const port = Number(config.match(/'port'\s*=>\s*(\d+)/)?.[1] ?? 465);
const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: true });
let buffer = "";
const replies = [];
const waiting = [];
let failure;
socket.setTimeout(15000, () => socket.destroy(new Error("SMTP connection timed out.")));
socket.on("data", (chunk) => {
  buffer += chunk.toString("utf8");
  const lines = buffer.split("\r\n");
  buffer = lines.pop();
  for (const line of lines) {
    const match = /^(\d{3}) /.exec(line);
    if (!match) continue;
    const code = Number(match[1]);
    const task = waiting.shift();
    if (task) task.resolve(code); else replies.push(code);
  }
});
socket.on("error", (error) => {
  failure = error;
  while (waiting.length) waiting.shift().reject(error);
});
const readReply = () => failure ? Promise.reject(failure) : replies.length ? Promise.resolve(replies.shift()) : new Promise((resolve, reject) => waiting.push({ resolve, reject }));
const command = async (text, expected) => {
  socket.write(`${text}\r\n`);
  const code = await readReply();
  if (code !== expected) throw new Error(`SMTP check rejected with status ${code}. No message submitted.`);
};
try {
  if (await readReply() !== 220) throw new Error("SMTP server did not greet the connection.");
  await command("EHLO sgsitc.com", 250);
  await command("AUTH LOGIN", 334);
  await command(Buffer.from(setting("username")).toString("base64"), 334);
  await command(Buffer.from(setting("password")).toString("base64"), 235);
  await command("QUIT", 221);
  console.log("SMTP TLS connection and authentication succeeded. No email was sent.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally { socket.destroy(); }
