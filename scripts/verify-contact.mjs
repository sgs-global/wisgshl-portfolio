// Browser checks against local static export; requests are intercepted and no email is sent.
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
const targets = await (await fetch("http://127.0.0.1:9229/json")).json();
const socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const captured = [];
let failNext = true;
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
socket.addEventListener("message", ({ data }) => {
  const response = JSON.parse(data);
  if (response.method === "Fetch.requestPaused") {
    const { requestId, request } = response.params;
    captured.push(JSON.parse(request.postData));
    const fail = failNext;
    failNext = false;
    void send("Fetch.fulfillRequest", { requestId, responseCode: fail ? 503 : 200,
      responseHeaders: [{ name: "Content-Type", value: "application/json" }],
      body: Buffer.from(JSON.stringify(fail ? { ok: false, error: "Mock mail server unavailable" } : { ok: true })).toString("base64"),
    });
  }
  if (!response.id) return;
  const task = pending.get(response.id);
  if (!task) return;
  pending.delete(response.id);
  if (response.error) task.reject(new Error(JSON.stringify(response.error)));
  else task.resolve(response.result);
});
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
};
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const wait = async (expression) => {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (await evaluate(expression)) return;
    await pause(100);
  }
  throw new Error(`Timed out: ${expression}`);
};
const click = async (expression) => {
  await evaluate(`(${expression}).scrollIntoView({block:'center',behavior:'instant'})`);
  const point = await evaluate(`(()=>{const r=(${expression}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", ...point, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...point, button: "left", clickCount: 1 });
};
const modal = `document.querySelector('#divisions dialog')`;
const form = `${modal}.querySelector('form')`;
const categories = ["LED Floodlights", "Portable Power Stations", "Solar Street Lights", "LED Street Lights", "LED Strip Lights"];
try {
  await send("Page.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/inquiry.php", requestStage: "Request" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: "http://127.0.0.1:8765/" });
  await wait(`document.querySelectorAll('#divisions button[aria-haspopup="dialog"]').length===5`);
  await pause(1000);
  for (let index = 0; index < categories.length; index++) {
    await click(`document.querySelectorAll('#divisions article h3')[${index}]`);
    await wait(`${modal}.open && ${form}?.querySelector('[name="category"]').value===${JSON.stringify(categories[index])}`);
    assert.equal(await evaluate(`${form}.querySelector('[name="country"]').required`), false);
    assert.equal(await evaluate(`${form}.querySelector('[name="website"]').required`), false);
    assert.equal(await evaluate(`${form}.querySelectorAll('input[type="checkbox"], [name="preferredContact"]').length`), 0);
    await evaluate(`(()=>{const f=${form};for(const [name,value] of Object.entries({name:'Test Buyer',company:'Example Buyer',email:'buyer@example.com',message:'Project requirements for QA',quantity:'250'})){f.elements[name].value=value;}f.querySelectorAll('input[name^="spec_"]').forEach(input=>input.value='Requested specification');})()`);
    await click(`${form}.querySelector('[type="submit"]')`);
    if (index === 0) {
      await wait(`${modal}.querySelector('[role="alert"]')!==null`);
      assert.ok((await evaluate(`${modal}.querySelector('[role="alert"] a').href`)).includes("LED%20Floodlights"));
      assert.equal(await evaluate(`${form}.querySelector('[name="message"]').value`), "Project requirements for QA");
      await click(`${form}.querySelector('[type="submit"]')`);
    }
    await wait(`${modal}.querySelector('[role="status"]')!==null`);
    const request = captured.at(-1);
    assert.equal(request.category, categories[index]);
    assert.equal(request.email, "buyer@example.com");
    assert.equal(request.country, "");
    assert.equal(Object.keys(request.specifications).length, 2);
    assert.ok(Object.values(request.specifications).every((value) => value === "Requested specification"));
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await wait(`!${modal}.open && document.body.style.overflow!=='hidden'`);
    assert.equal(await evaluate(`document.activeElement.getAttribute('aria-haspopup')`), "dialog");
    console.log(`${categories[index]}: popup, preselection, optional fields, specifications, submission and focus return passed.`);
  }
  await send("Page.navigate", { url: "http://127.0.0.1:8765/contact/" });
  await wait(`document.querySelector('.contact-locations')!==null`);
  assert.ok(await evaluate(`document.querySelector('.map-card iframe').src.includes('No.%2027')`));
  assert.ok(await evaluate(`document.querySelector('.map-caption address').textContent.includes('Tongyu Rich Industry Zone')`));
  assert.ok(await evaluate(`document.querySelector('.contact-locations').textContent.includes('Hong Kong, China')`));
  assert.ok(await evaluate(`document.querySelector('.contact-locations').textContent.includes('Guzhen, Zhongshan')`));
  await mkdir("artifacts", { recursive: true });
  let screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  await writeFile("artifacts/contact-desktop.png", Buffer.from(screenshot.data, "base64"));
  for (const width of [768, 390, 320]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: true });
    await pause(500);
    assert.ok(await evaluate(`document.documentElement.scrollWidth <= innerWidth + 1`));
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('.contact-page input,.contact-page select,.contact-page textarea')).every(x=>x.getBoundingClientRect().right<=innerWidth+1)`));
    await send("Page.navigate", { url: "http://127.0.0.1:8765/" });
    await wait(`document.querySelectorAll('#divisions article h3').length===5`);
    await click(`document.querySelector('#divisions article h3')`);
    await wait(`${modal}.open`);
    assert.ok(await evaluate(`${modal}.getBoundingClientRect().right <= innerWidth+1`));
    assert.ok(await evaluate(`${modal}.scrollWidth <= ${modal}.clientWidth+1`));
    if (width === 390) {
      screenshot = await send("Page.captureScreenshot", { format: "png" });
      await writeFile("artifacts/product-inquiry-mobile.png", Buffer.from(screenshot.data, "base64"));
    }
    await evaluate(`${modal}.close()`);
    await send("Page.navigate", { url: "http://127.0.0.1:8765/contact/" });
    await wait(`document.querySelector('.contact-locations')!==null`);
    console.log(`Contact page and inquiry popup responsive checks passed: ${width}px.`);
  }
  console.log("PASS: all product inquiries, failure recovery, address/map configuration, and responsive checks. Email requests were mocked.");
} finally {
  await send("Fetch.disable");
  socket.close();
}
