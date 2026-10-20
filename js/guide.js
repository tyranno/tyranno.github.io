// 테스터 되는 법 안내 그림 (실제 화면을 보고 깔끔하게 다시 그린 것)
// 게임 목록의 이름(groupName, playName, name)과 아이콘을 넣어 그리므로 게임마다 따로 그릴 필요 없음
// 개인 이메일·계정 정보는 그리지 않음
(function () {
  const INK = '#241b4b';
  const PINK = '#ff5c8a';
  const G_BLUE = '#1a73e8';   // 구글 화면의 파란색
  const G_GREEN = '#01875f';  // 플레이 스토어 설치 단추 색
  const G_GRAY = '#5f6368';
  const UI = "Roboto, 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
  const CUTE = "Jua, 'Malgun Gothic', sans-serif";
  const W = 300;
  let uid = 0;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const text = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" font-family="${o.font || UI}" font-size="${o.size || 13}" font-weight="${o.bold ? 700 : 400}" fill="${o.fill || G_GRAY}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.underline ? ' text-decoration="underline"' : ''}>${esc(s)}</text>`;

  // 폰 화면 틀: 둥근 테두리 + (있으면) 위쪽 막대
  function screen(h, inner, o = {}) {
    const id = 'g' + (++uid);
    const bar = o.bar
      ? `<rect width="${W}" height="44" fill="#f1f3f4"/><line x1="0" y1="44" x2="${W}" y2="44" stroke="#dadce0"/>` + text(18, 28, o.bar, { size: 15, fill: G_GRAY })
      : '';
    return `<svg viewBox="-4 -4 ${W + 8} ${h + 12}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.label || '')}">
<defs><clipPath id="${id}"><rect width="${W}" height="${h}" rx="18"/></clipPath></defs>
<rect y="5" width="${W}" height="${h}" rx="18" fill="${INK}"/>
<g clip-path="url(#${id})"><rect width="${W}" height="${h}" fill="${o.bg || '#fff'}"/>${bar}${inner}</g>
<rect width="${W}" height="${h}" rx="18" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
  }

  // 누를 곳 표시: 분홍 동그라미 테두리 + 말풍선
  function mark(x, y, w, h, label, lx, ly, tail) {
    const lw = label.length * 15 + 26;
    let t = '';
    if (tail === 'left') t = `<path d="M${lx + 2} ${ly + 11} l-10 5 l10 5 z" fill="${PINK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    if (tail === 'up') t = `<path d="M${lx + 18} ${ly + 2} l6 -10 l6 10 z" fill="${PINK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    if (tail === 'right') t = `<path d="M${lx + lw - 2} ${ly + 11} l10 5 l-10 5 z" fill="${PINK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h / 2, 16)}" fill="none" stroke="${PINK}" stroke-width="4"/>
${t}<rect x="${lx}" y="${ly}" width="${lw}" height="32" rx="16" fill="${PINK}" stroke="${INK}" stroke-width="2.5"/>
${text(lx + lw / 2, ly + 22, label, { font: CUTE, size: 17, fill: '#fff', anchor: 'middle' })}`;
  }

  // 긴 이름을 두 줄로 나누기 (대충 글자 수로)
  function wrap(s, max) {
    if (s.length <= max) return [s];
    const cut = s.lastIndexOf(' ', max);
    const i = cut > 0 ? cut : max;
    return [s.slice(0, i).trim(), s.slice(i).trim()];
  }

  // 1단계-가: 구글 그룹 화면 → '그룹 가입'
  function groupPage(g) {
    const name = wrap(g.groupName, 24);
    let y = 82;
    let s = name.map((l) => { const t = text(20, y, l, { size: 19, bold: true, fill: '#202124' }); y += 24; return t; }).join('');
    const by = y + 4;
    s += `<rect x="20" y="${by}" width="108" height="38" rx="19" fill="${G_BLUE}"/>` + text(74, by + 25, '그룹 가입', { size: 15, bold: true, fill: '#fff', anchor: 'middle' });
    s += `<line x1="0" y1="${by + 62}" x2="${W}" y2="${by + 62}" stroke="#e8eaed"/>`;
    s += text(20, by + 92, '대화', { size: 14, bold: true, fill: '#202124' });
    s += text(20, by + 116, '아직 대화가 없습니다.', { size: 13 });
    s += mark(12, by - 8, 124, 54, '여기!', 160, by + 3, 'left');
    return screen(by + 140, s, { bar: '☰   Google 그룹스', label: '구글 그룹 화면에서 그룹 가입 누르기' });
  }

  // 1단계-나: 작은 창 → 한 번 더 '그룹 가입'
  function groupDialog(g) {
    let s = `<rect width="${W}" height="280" fill="#8d8a9e"/>`;
    s += `<rect x="18" y="26" width="264" height="200" rx="14" fill="#fff"/>`;
    s += text(36, 60, '그룹 가입', { size: 18, bold: true, fill: '#202124' });
    s += text(36, 84, wrap(g.groupName, 30)[0], { size: 13 });
    s += text(36, 114, '표시 이름', { size: 12 });
    s += `<rect x="36" y="122" width="228" height="32" rx="6" fill="none" stroke="#dadce0" stroke-width="1.5"/>`;
    s += text(150, 196, '취소', { size: 14, bold: true, fill: G_BLUE, anchor: 'middle' });
    s += `<rect x="182" y="174" width="88" height="36" rx="18" fill="${G_BLUE}"/>` + text(226, 197, '그룹 가입', { size: 14, bold: true, fill: '#fff', anchor: 'middle' });
    s += mark(175, 167, 102, 50, '한 번 더!', 166, 236, 'up');
    return screen(280, s, { label: '작은 창에서 한 번 더 그룹 가입 누르기' });
  }

  // 2단계: 테스터 페이지 (영어) → 'Become a tester'
  function testerPage(g) {
    const name = wrap(g.playName, 30);
    let y = 80;
    let s = name.map((l) => { const t = text(20, y, l, { size: 16, bold: true, fill: '#202124' }); y += 21; return t; }).join('');
    s += text(20, y + 12, 'Become a tester to get early', { size: 13 });
    s += text(20, y + 30, 'access to new features.', { size: 13 });
    const by = y + 50;
    s += `<rect x="20" y="${by}" width="160" height="40" rx="8" fill="${G_BLUE}"/>` + text(100, by + 26, 'Become a tester', { size: 15, bold: true, fill: '#fff', anchor: 'middle' });
    s += mark(12, by - 8, 176, 56, '여기!', 206, by + 4, 'left');
    return screen(by + 76, s, { bar: 'Google Play', label: '테스터 페이지에서 Become a tester 누르기' });
  }

  // 3단계-가: "You are a tester." → 글 가운데 파란 'download it on Google Play'
  function testerDone(g) {
    let s = text(20, 80, 'You are a tester.', { size: 18, bold: true, fill: '#202124' });
    s += text(20, 110, "You'll receive an update to the app", { size: 13 });
    s += text(20, 128, 'if you already have it installed.', { size: 13 });
    s += text(20, 156, "If you don't have the app installed,", { size: 13 });
    s += text(20, 178, 'download it on Google Play.', { size: 15, bold: true, fill: G_BLUE, underline: true });
    s += text(20, 206, 'Note: It can take a while…', { size: 13 });
    s += mark(10, 161, 222, 27, '여기!', 196, 214, 'up');
    return screen(258, s, { bar: 'Google Play', label: '글 가운데 파란 download it on Google Play 누르기' });
  }

  // 3단계-나: 플레이 스토어 → '설치'
  function storePage(g) {
    const id = 'i' + (++uid);
    let s = `<defs><clipPath id="${id}"><rect x="20" y="62" width="64" height="64" rx="16"/></clipPath></defs>`;
    s += `<image href="games/${g.id}/icon.webp" x="20" y="62" width="64" height="64" clip-path="url(#${id})"/>`;
    s += `<rect x="20" y="62" width="64" height="64" rx="16" fill="none" stroke="#dadce0"/>`;
    s += text(98, 100, g.name, { size: 19, bold: true, fill: '#202124' });
    s += `<rect x="20" y="146" width="260" height="40" rx="20" fill="${G_GREEN}"/>` + text(150, 172, '설치', { size: 16, bold: true, fill: '#fff', anchor: 'middle' });
    s += mark(12, 138, 276, 56, '설치!', 116, 206, 'up');
    return screen(250, s, { bar: 'Google Play', label: '플레이 스토어에서 설치 누르기' });
  }

  window.drawGuide = { groupPage, groupDialog, testerPage, testerDone, storePage };
})();
