// 헤드리스 크롬으로 그림 줄이기 · 사이트 화면 찍기
//   그림 줄이기: node tools/chrome.js webp <원본.png> <결과.webp> <가로 크기> [<원본2> <결과2> <가로2> ...]
//               (결과 이름이 .jpg면 JPG로 — 카톡 미리보기 그림용)
//   화면 찍기:   node tools/chrome.js shot <주소> <결과.png> <가로> <세로> [full | parts]
// 크롬은 한 번에 하나만 띄우고, 끝나면 하위 프로세스까지 모두 끈다 (이 컴퓨터는 메모리가 빠듯함)
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9338;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fileUrl = (p) => 'file:///' + path.resolve(p).replace(/\\/g, '/');

async function withChrome(job) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'grae-game-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  const killTree = () => { try { if (process.platform === 'win32') execSync('taskkill /pid ' + chrome.pid + ' /T /F', { stdio: 'ignore' }); else chrome.kill(); } catch (e) { /* 이미 꺼짐 */ } };
  process.on('exit', killTree);
  try {
    let page;
    for (let k = 0; k < 50 && !page; k++) { await sleep(200); try { page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((p) => p.type === 'page'); } catch { /* 대기 */ } }
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));
    let id = 0; const w = new Map();
    ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (w.has(m.id)) { w.get(m.id)(m); w.delete(m.id); } });
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; w.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const m = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (m.result && m.result.exceptionDetails) throw new Error(m.result.exceptionDetails.text); return m.result && m.result.result && m.result.result.value; };
    await job({ send, ev });
    ws.close();
  } finally {
    killTree();
    // 크롬이 파일을 늦게 놓아서 바로 지우면 실패할 때가 있음 → 조금 기다렸다가, 안 지워져도 넘어감
    await sleep(800);
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { /* 임시 폴더라 남아도 괜찮음 */ }
  }
}

async function toWebp({ send, ev }, src, out, width, quality) {
  await send('Page.navigate', { url: fileUrl(src) });
  await sleep(500);
  const data = await ev(`(async () => {
    const img = document.querySelector('img'); await img.decode();
    const w = ${width}, h = Math.round(img.naturalHeight * w / img.naturalWidth);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, w, h);
    return c.toDataURL('${/\.jpe?g$/i.test(out) ? 'image/jpeg' : 'image/webp'}', ${quality});
  })()`);
  fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  console.log(out, Math.round(fs.statSync(out).size / 1024) + 'KB');
}

async function shot({ send, ev }, url, out, width, height, full) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  // UA=... 를 주면 그 브라우저인 척 (예: 카톡 안 브라우저 확인: UA="... KAKAOTALK 10.0.0")
  if (process.env.UA) await send('Emulation.setUserAgentOverride', { userAgent: process.env.UA });
  await send('Page.navigate', { url });
  await sleep(1500);
  await ev('document.fonts.ready.then(() => true)');
  const total = await ev('document.documentElement.scrollHeight');
  // full = 페이지 전체 한 장, parts = 화면 높이씩 잘라 여러 장 (out-1.png, out-2.png …)
  const tops = full === 'parts' ? Array.from({ length: Math.ceil(total / height) }, (_, i) => i * height) : [0];
  for (const [i, y] of tops.entries()) {
    const clip = full ? { x: 0, y, width, height: full === 'full' ? total : Math.min(height, total - y), scale: 1 } : undefined;
    const m = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!full, clip });
    const file = full === 'parts' ? out.replace(/\.png$/, `-${i + 1}.png`) : out;
    fs.writeFileSync(file, Buffer.from(m.result.data, 'base64'));
    console.log(file);
  }
}

const [cmd, ...a] = process.argv.slice(2);
// webp는 '원본 결과 가로' 세 개씩 여러 번 이어 쓸 수 있음 (크롬은 한 번만 띄움)
if (cmd === 'webp') withChrome(async (c) => { for (let i = 0; i + 2 < a.length; i += 3) await toWebp(c, a[i], a[i + 1], +a[i + 2], 0.82); });
else if (cmd === 'shot') withChrome((c) => shot(c, a[0], a[1], +a[2], +a[3], a[4]));
else console.log('사용법은 파일 맨 위 설명을 보세요');
