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
  // 그림 속 구글 화면 글 — 영어를 고른 사람은 구글 화면도 영어로 보일 테니 맞춰 그림
  const WORDS = {
    ko: { groups: '☰   Google 그룹스', join: '그룹 가입', convo: '대화', noConvo: '아직 대화가 없습니다.', display: '표시 이름', cancel: '취소', install: '설치', here: '여기!', again: '한 번 더!', installMark: '설치!' },
    en: { groups: '☰   Google Groups', join: 'Join group', convo: 'Conversations', noConvo: 'No conversations yet.', display: 'Display name', cancel: 'Cancel', install: 'Install', here: 'Here!', again: 'Again!', installMark: 'Install!' },
  };

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
    // 말풍선 폭: 한글은 넓고 영어는 좁게
    const lw = [...label].reduce((n, c) => n + (/[가-힣]/.test(c) ? 16 : c === ' ' ? 5 : 9.5), 0) + 26;
    let t = '';
    if (tail === 'left') t = `<path d="M${lx + 2} ${ly + 11} l-10 5 l10 5 z" fill="${PINK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    if (tail === 'up') t = `<path d="M${lx + 18} ${ly + 2} l6 -10 l6 10 z" fill="${PINK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    if (tail === 'right') t = `<path d="M${lx + lw - 2} ${ly + 11} l10 5 l-10 5 z" fill="${PINK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const ring = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h / 2, 16)}" fill="none" stroke="${PINK}" stroke-width="4"/>`;
    if (!label) return ring; // 말풍선 없이 테두리만
    return `${ring}
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
  function groupPage(g, lang) {
    const w = WORDS[lang] || WORDS.ko;
    const name = wrap(g.groupName, 24);
    let y = 82;
    let s = name.map((l) => { const t = text(20, y, l, { size: 19, bold: true, fill: '#202124' }); y += 24; return t; }).join('');
    const by = y + 4;
    s += `<rect x="20" y="${by}" width="108" height="38" rx="19" fill="${G_BLUE}"/>` + text(74, by + 25, w.join, { size: 15, bold: true, fill: '#fff', anchor: 'middle' });
    s += `<line x1="0" y1="${by + 62}" x2="${W}" y2="${by + 62}" stroke="#e8eaed"/>`;
    s += text(20, by + 92, w.convo, { size: 14, bold: true, fill: '#202124' });
    s += text(20, by + 116, w.noConvo, { size: 13 });
    s += mark(12, by - 8, 124, 54, w.here, 160, by + 3, 'left');
    return screen(by + 140, s, { bar: w.groups, label: '구글 그룹 화면에서 그룹 가입 누르기' });
  }

  // 1단계-나: 작은 창 → 한 번 더 '그룹 가입'
  function groupDialog(g, lang) {
    const w = WORDS[lang] || WORDS.ko;
    let s = `<rect width="${W}" height="280" fill="#8d8a9e"/>`;
    s += `<rect x="18" y="26" width="264" height="200" rx="14" fill="#fff"/>`;
    s += text(36, 60, w.join, { size: 18, bold: true, fill: '#202124' });
    s += text(36, 84, wrap(g.groupName, 30)[0], { size: 13 });
    s += text(36, 114, w.display, { size: 12 });
    s += `<rect x="36" y="122" width="228" height="32" rx="6" fill="none" stroke="#dadce0" stroke-width="1.5"/>`;
    s += text(150, 196, w.cancel, { size: 14, bold: true, fill: G_BLUE, anchor: 'middle' });
    s += `<rect x="182" y="174" width="88" height="36" rx="18" fill="${G_BLUE}"/>` + text(226, 197, w.join, { size: 14, bold: true, fill: '#fff', anchor: 'middle' });
    s += mark(175, 167, 102, 50, w.again, 166, 236, 'up');
    return screen(280, s, { label: '작은 창에서 한 번 더 그룹 가입 누르기' });
  }

  // 2단계: 테스터 페이지 (영어) → 'Become a tester'
  function testerPage(g, lang) {
    const w = WORDS[lang] || WORDS.ko;
    const name = wrap(g.playName, 30);
    let y = 80;
    let s = name.map((l) => { const t = text(20, y, l, { size: 16, bold: true, fill: '#202124' }); y += 21; return t; }).join('');
    s += text(20, y + 12, 'Become a tester to get early', { size: 13 });
    s += text(20, y + 30, 'access to new features.', { size: 13 });
    const by = y + 50;
    s += `<rect x="20" y="${by}" width="160" height="40" rx="8" fill="${G_BLUE}"/>` + text(100, by + 26, 'Become a tester', { size: 15, bold: true, fill: '#fff', anchor: 'middle' });
    s += mark(12, by - 8, 176, 56, w.here, 206, by + 4, 'left');
    return screen(by + 76, s, { bar: 'Google Play', label: '테스터 페이지에서 Become a tester 누르기' });
  }

  // 3단계-가: "You are a tester." → 글 가운데 파란 'download it on Google Play'
  function testerDone(g, lang) {
    const w = WORDS[lang] || WORDS.ko;
    let s = text(20, 80, 'You are a tester.', { size: 18, bold: true, fill: '#202124' });
    s += text(20, 110, "You'll receive an update to the app", { size: 13 });
    s += text(20, 128, 'if you already have it installed.', { size: 13 });
    s += text(20, 156, "If you don't have the app installed,", { size: 13 });
    s += text(20, 178, 'download it on Google Play.', { size: 15, bold: true, fill: G_BLUE, underline: true });
    s += text(20, 206, 'Note: It can take a while…', { size: 13 });
    s += mark(10, 161, 222, 27, w.here, 196, 214, 'up');
    return screen(258, s, { bar: 'Google Play', label: '글 가운데 파란 download it on Google Play 누르기' });
  }

  // 3단계-나: 플레이 스토어 → '설치'
  function storePage(g, lang) {
    const w = WORDS[lang] || WORDS.ko;
    const id = 'i' + (++uid);
    let s = `<defs><clipPath id="${id}"><rect x="20" y="62" width="64" height="64" rx="16"/></clipPath></defs>`;
    s += `<image href="games/${g.id}/icon.webp" x="20" y="62" width="64" height="64" clip-path="url(#${id})"/>`;
    s += `<rect x="20" y="62" width="64" height="64" rx="16" fill="none" stroke="#dadce0"/>`;
    s += text(98, 100, g.name, { size: 19, bold: true, fill: '#202124' });
    s += `<rect x="20" y="146" width="260" height="40" rx="20" fill="${G_GREEN}"/>` + text(150, 172, w.install, { size: 16, bold: true, fill: '#fff', anchor: 'middle' });
    s += mark(12, 138, 276, 56, w.installMark, 116, 206, 'up');
    return screen(250, s, { bar: 'Google Play', label: '플레이 스토어에서 설치 누르기' });
  }

  // '이런 화면이 나오면' 칸의 작은 그림 (실제 오류 화면을 간단히 다시 그림)
  const PROBLEM = {
    // 구글 그룹: 로그인 안 된 상태 → '권한이 없습니다' (오른쪽 위 '로그인' 단추가 단서)
    groupDenied: (w, ko, gm) => {
      // 실제 화면: 그룹 이름 + '소유자 및 관리자에게 문의' + 금지 표시 + 안내 글, 오른쪽 위 파란 '로그인'
      let s = `<rect x="214" y="8" width="74" height="30" rx="15" fill="${G_BLUE}"/>` + text(251, 28, ko ? '로그인' : 'Sign in', { size: 13, bold: true, fill: '#fff', anchor: 'middle' });
      s += text(18, 74, gm.groupName, { size: 18, fill: '#202124' });
      s += `<rect x="18" y="84" width="150" height="26" rx="4" fill="#fff" stroke="#dadce0"/>` + text(93, 101, ko ? '소유자 및 관리자에게 문의' : 'Contact owners and managers', { size: 10, bold: true, fill: G_BLUE, anchor: 'middle' });
      s += `<circle cx="150" cy="148" r="18" fill="none" stroke="#bdc1c6" stroke-width="4"/><line x1="138" y1="160" x2="162" y2="136" stroke="#bdc1c6" stroke-width="4" stroke-linecap="round"/>`;
      (ko ? ['이 콘텐츠에 액세스할 권한이 없습니다'] : ["You don't have permission", 'to access this content']).forEach((l, i) => { s += text(150, 194 + i * 18, l, { size: 14, bold: true, fill: '#202124', anchor: 'middle' }); });
      s += text(150, ko ? 216 : 234, ko ? '액세스하려면 그룹 소유자 및 관리자에게 문의…' : 'Contact the group owners and managers…', { size: 11, anchor: 'middle' });
      s += mark(209, 3, 84, 40, '', 0, 0);
      return { h: ko ? 236 : 252, s, bar: ko ? '☰  그룹' : '☰  Groups' };
    },
    // 테스터 페이지: 그룹 가입이 아직 반영 전
    notAvailable: () => {
      let s = text(20, 82, 'App not available', { size: 18, bold: true, fill: '#202124' });
      s += text(20, 110, 'This app is not available for', { size: 13 });
      s += text(20, 128, 'your account.', { size: 13 });
      return { h: 160, s, bar: 'Google Play' };
    },
    // 플레이 스토어 앱: 아직 반영 전이거나 계정이 다름
    notFound: (w, ko) => {
      // 실제 화면: 위성 그림 + '항목을 찾을 수 없습니다.' + 파란 '다시 시도' + 아래 '기다리는 동안 즐길 수 있는 게임'
      let s = text(150, 78, '🛰️', { size: 48, anchor: 'middle', fill: '#202124' });
      s += text(150, 118, ko ? '항목을 찾을 수 없습니다.' : 'Item not found.', { size: 15, fill: '#202124', anchor: 'middle' });
      s += `<rect x="100" y="132" width="100" height="34" rx="17" fill="${G_BLUE}"/>` + text(150, 154, ko ? '다시 시도' : 'Try again', { size: 13, bold: true, fill: '#fff', anchor: 'middle' });
      s += `<line x1="0" y1="188" x2="${W}" y2="188" stroke="#e8eaed"/>`;
      s += text(18, 214, ko ? '기다리는 동안 즐길 수 있는 게임' : 'Games to play while you wait', { size: 13, bold: true, fill: '#202124' });
      return { h: 232, s };
    },
  };
  function problem(kind, lang, g) {
    const p = PROBLEM[kind](WORDS[lang] || WORDS.ko, lang !== 'en', g);
    return screen(p.h, p.s, { bar: p.bar, label: kind });
  }

  window.drawGuide = { groupPage, groupDialog, testerPage, testerDone, storePage, problem };
})();
