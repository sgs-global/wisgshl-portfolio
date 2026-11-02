// Run against the local static server and a headless Chrome CDP session.
// node scripts/verify-inside-sgs.mjs (defaults: HTTP 8765, CDP 9229)
import { readdir, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";

const origin = process.env.GALLERY_QA_ORIGIN ?? "http://127.0.0.1:8765";
const targets = await (await fetch("http://127.0.0.1:9229/json")).json();
const socket = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let sequence = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const response = JSON.parse(data);
  if (!response.id) return;
  const task = pending.get(response.id);
  if (!task) return;
  pending.delete(response.id);
  if (response.error) task.reject(new Error(JSON.stringify(response.error)));
  else task.resolve(response.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
};
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const wait = async (expression) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await pause(100);
  }
  throw new Error(`Timed out: ${expression}`);
};
const region = (index) => `document.querySelectorAll('#inside-sgs [role="region"]')[${index}]`;
const row = (index) => `document.querySelectorAll('#inside-sgs article')[${index}]`;
const click = async (expression) => {
  const point = await evaluate(`(()=>{const r=(${expression}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", ...point, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", ...point, button: "left", clickCount: 1 });
};
const files = await readdir("public/images/assets/inside_sgs");
const matched = files.filter((file) => /^(team|manufacturing|quality|supply)_\d+\.(jpe?g|png|webp)$/i.test(file));
const counts = ["team", "manufacturing", "quality", "supply"].map((prefix) => matched.filter((file) => file.toLowerCase().startsWith(`${prefix}_`)).length);
try {
  await send("Page.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: origin });
  await wait(`document.querySelectorAll('#inside-sgs article').length===4 && document.querySelectorAll('#inside-sgs [role="region"]').length===4`);
  await pause(1200);
  assert.equal(await evaluate(`document.querySelectorAll('#inside-sgs select').length`), 0);
  for (let index = 0; index < counts.length; index++) {
    await evaluate(`${row(index)}.scrollIntoView({block:'center',behavior:'instant'})`);
    await pause(1000);
    await wait(`${row(index)}.className.includes('activeCategory')`);
    await wait(`${row(index)}.className.includes('visible') && getComputedStyle(${row(index)}.querySelector('h3')).opacity==='1'`);
    assert.equal(await evaluate(`document.querySelectorAll('#inside-sgs article[class*="activeCategory"]').length`), 1);
    assert.equal(await evaluate(`${region(index)}.querySelectorAll('[aria-label^="Show "]').length`), counts[index] > 1 ? counts[index] : 0);
    if (counts[index] > 1) {
      await click(`${region(index)}.querySelector('[aria-label^="Previous "]')`);
      await wait(`${region(index)}.querySelector('[class*="imageCount"]').textContent.startsWith('${String(counts[index]).padStart(2, "0")}')`);
      await click(`${region(index)}.querySelector('[aria-label^="Next "]')`);
      await wait(`${region(index)}.querySelector('[class*="imageCount"]').textContent.startsWith('01')`);
      const before = await evaluate(`Array.from(document.querySelectorAll('#inside-sgs [class*="imageCount"]')).map(x=>x.textContent)`);
      await click(`${region(index)}.querySelector('[aria-label^="Next "]')`);
      await wait(`${region(index)}.querySelector('[class*="imageCount"]').textContent.startsWith('02')`);
      const after = await evaluate(`Array.from(document.querySelectorAll('#inside-sgs [class*="imageCount"]')).map(x=>x.textContent)`);
      assert.deepEqual(after.filter((_, i) => i !== index - 1), before.filter((_, i) => i !== index - 1));
      await click(`${region(index)}.querySelectorAll('[aria-label^="Show "]')[${counts[index] - 1}]`);
      await wait(`${region(index)}.querySelector('[class*="imageCount"]').textContent.startsWith('${String(counts[index]).padStart(2, "0")}')`);
      await evaluate(`${region(index)}.focus()`);
      await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Home", code: "Home", windowsVirtualKeyCode: 36, nativeVirtualKeyCode: 36 });
      await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Home", code: "Home", windowsVirtualKeyCode: 36, nativeVirtualKeyCode: 36 });
      await wait(`${region(index)}.querySelector('[class*="imageCount"]').textContent.startsWith('01')`);
      // Visit every image and verify it decodes in the actual browser.
      for (let slide = 0; slide < counts[index]; slide++) {
        await evaluate(`${region(index)}.querySelectorAll('[aria-label^="Show "]')[${slide}].click()`);
        await wait(`(()=>{const images=Array.from(${region(index)}.querySelectorAll('img'));return images.length>=${slide + 1}&&images.every(x=>x.complete&&x.naturalWidth>0)})()`);
      }
    }
    console.log(`Category ${index + 1}: photo count, active highlight, navigation and image loading passed.`);
  }
  await evaluate(`${row(0)}.scrollIntoView({block:'center',behavior:'instant'})`);
  await pause(900);
  await click(`${region(0)}.querySelector('button')`);
  await wait(`document.querySelector('#inside-sgs dialog').open`);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await wait(`!document.querySelector('#inside-sgs dialog').open`);
  assert.equal(await evaluate(`document.activeElement.getAttribute('aria-label')`), "Expand team photograph");
  await mkdir("artifacts", { recursive: true });
  const desktop = await send("Page.captureScreenshot", { format: "png" });
  await writeFile("artifacts/inside-sgs-desktop.png", Buffer.from(desktop.data, "base64"));
  for (const width of [768, 390, 320]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: true });
    await pause(700);
    for (let index = 0; index < counts.length; index++) {
      await evaluate(`${row(index)}.scrollIntoView({block:'center',behavior:'instant'})`);
      await pause(750);
      assert.ok(await evaluate(`${row(index)}.getBoundingClientRect().right <= innerWidth+1`));
      assert.ok(await evaluate(`${row(index)}.getBoundingClientRect().left >= -1`));
      await wait(`${row(index)}.className.includes('activeCategory')`);
    }
    console.log(`Responsive checks passed: ${width}px, all category rows.`);
  }
  await evaluate(`${row(1)}.scrollIntoView({block:'center',behavior:'instant'})`);
  await pause(600);
  const swipePoint = await evaluate(`(()=>{const r=${region(1)}.getBoundingClientRect();return {x:r.x+r.width*.75,y:r.y+r.height*.4}})()`);
  const swipeBefore = await evaluate(`${region(1)}.querySelector('[class*="imageCount"]').textContent`);
  await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...swipePoint }] });
  await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: swipePoint.x - 100, y: swipePoint.y }] });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await wait(`${region(1)}.querySelector('[class*="imageCount"]').textContent!==${JSON.stringify(swipeBefore)}`);
  const mobile = await send("Page.captureScreenshot", { format: "png" });
  await writeFile("artifacts/inside-sgs-mobile.png", Buffer.from(mobile.data, "base64"));
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await pause(300);
  assert.equal(await evaluate(`document.querySelector('#inside-sgs').className.includes('motionReady')`), false);
  assert.ok(await evaluate(`parseFloat(getComputedStyle(${region(1)}.querySelector('[class*="slide"]')).transitionDuration) < .001`));
  assert.ok(await evaluate(`Array.from(document.querySelectorAll('#inside-sgs article')).every(x=>getComputedStyle(x.querySelector('[class*="visuals"]')).opacity==='1')`));
  for (const file of matched) {
    const response = await fetch(`${origin}/images/assets/inside_sgs/${encodeURIComponent(file)}`);
    assert.equal(response.status, 200, file);
    await response.arrayBuffer();
  }
  console.log(`PASS: ${matched.length} exact image URLs returned HTTP 200; lightbox focus, swipe, reduced motion and all responsive checks passed.`);
} finally {
  socket.close();
}
