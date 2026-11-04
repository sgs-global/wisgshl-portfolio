// Local-only PHP integration tests. mail() is replaced in a temporary router;
// no messages leave this machine. Usage: node scripts/verify-inquiry-endpoint.mjs PATH_TO_PHP
import { spawn } from "node:child_process";
import { mkdtemp, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

const php = process.argv[2] ?? "php";
const directory = await mkdtemp(path.join(tmpdir(), "wisgshl-mail-test-"));
const capture = path.join(directory, "captured.json");
const endpoint = path.resolve("public/inquiry.php");
const quote = (value) => `'${value.replaceAll("\\", "/").replaceAll("'", "\\'")}'`;
const router = path.join(directory, "router.php");
await writeFile(router, `<?php
namespace Wisgshl\\Inquiry {
  function sendInquiryMail($to, $subject, $body, $replyTo) {
    $headers = ['Reply-To' => $replyTo];
    file_put_contents(${quote(capture)}, json_encode(compact('to','subject','body','headers')));
    return !isset($_GET['mock_fail']);
  }
  function sys_get_temp_dir() { return ${quote(directory)}; }
}
namespace {
  $requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  if ($requestPath === '/qa-reset') {
    foreach (glob(${quote(directory)} . '/wisgshl-inquiry-*') as $file) unlink($file);
    echo 'reset'; return;
  }
  if ($requestPath === '/inquiry.php') { require ${quote(endpoint)}; return; }
  return false;
}
`.replaceAll("Wisgshl\\\\Inquiry", "Wisgshl\\Inquiry"));
const child = spawn(php, ["-n", "-S", "127.0.0.1:8766", "-t", path.resolve("out"), router], { stdio: "ignore" });
child.on("error", (error) => { console.error(error); process.exitCode = 1; });
const origin = "http://127.0.0.1:8766";
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { ready = (await fetch(`${origin}/qa-reset`)).ok; } catch {}
    if (ready) break;
    await pause(100);
  }
  assert.ok(ready, "PHP mock server did not start");
  const payload = { name: "Test Customer", company: "Example Importer", email: "buyer@example.com", category: "LED Floodlights", message: "Exterior lighting project", country: "", website: "", specifications: { power: "100 W requested", installation: "Warehouse exterior" } };
  const post = (body, suffix = "", extraHeaders = {}) => fetch(`${origin}/inquiry.php${suffix}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, ...extraHeaders }, body: JSON.stringify(body) });
  assert.equal((await fetch(`${origin}/inquiry.php`)).status, 405);
  assert.equal((await post(payload, "", { Origin: "https://unrelated.example" })).status, 403);
  assert.equal((await post({ ...payload, email: "invalid" })).status, 422);
  assert.equal((await post({ ...payload, email: "buyer@example.com\r\nBcc:other@example.com" })).status, 422);
  assert.equal((await post({ ...payload, category: "Unknown" })).status, 422);
  assert.equal((await post({ ...payload, website_check: "bot" })).status, 422);
  assert.equal((await post({ ...payload, specifications: "invalid" })).status, 422);
  assert.equal((await post({ ...payload, message: "a".repeat(21000) })).status, 413);
  const categories = ["LED Floodlights", "Portable Power Stations", "Solar Street Lights", "LED Street Lights", "LED Strip Lights"];
  for (const category of categories) {
    const response = await post({ ...payload, category, name: "Buyer 测试" });
    assert.equal(response.status, 200, category);
    assert.equal((await response.json()).ok, true);
    const mail = JSON.parse(await readFile(capture, "utf8"));
    const subject = mail.subject;
    const body = mail.body;
    assert.equal(mail.to, "info@globalsgs.com");
    assert.equal(mail.headers["Reply-To"], "buyer@example.com");
    assert.ok(subject.includes(category) && subject.includes("Example Importer"));
    assert.ok(body.includes(category) && body.includes("Buyer 测试") && body.includes("Country / region: Not provided"));
    if (category === "LED Floodlights") assert.ok(body.includes("100 W requested") && body.includes("Warehouse exterior"));
  }
  assert.equal((await post(payload)).status, 429);
  await fetch(`${origin}/qa-reset`);
  const failure = await post(payload, "?mock_fail=1");
  assert.equal(failure.status, 503);
  assert.equal((await failure.json()).ok, false);
  console.log("PASS: all five product subjects, recipient, reply-to, Unicode, optional fields, product requirements, validation, rate limit and mail-failure handling. No email was sent.");
} finally {
  child.kill();
}
