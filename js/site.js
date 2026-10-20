// 첫 화면(게임 카드)과 게임 페이지를 games.js 내용으로 그림 · 한국어/영어 선택
(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => document.querySelector(sel);
  const dir = (g) => `games/${g.id}/`;
  const ext = 'target="_blank" rel="noopener"';
  const q = new URLSearchParams(location.search);

  // ---------- 언어 ----------
  // 고르는 순서: 주소의 ?lang= → 전에 고른 것 → 폰·브라우저 언어 (한국어가 아니면 영어)
  const LANGS = ['ko', 'en'];
  function pickLang() {
    if (LANGS.includes(q.get('lang'))) return q.get('lang');
    try { const saved = localStorage.getItem('lang'); if (LANGS.includes(saved)) return saved; } catch (e) { /* 저장 못 해도 괜찮음 */ }
    return /^ko/i.test(navigator.language || '') ? 'ko' : 'en';
  }
  const lang = pickLang();
  document.documentElement.lang = lang;

  // games.js의 { ko, en } 글을 고른 언어로 바꿈 (en이 없으면 한국어)
  function loc(v) {
    if (Array.isArray(v)) return v.map(loc);
    if (v && typeof v === 'object') {
      if ('ko' in v) return v[lang] !== undefined ? v[lang] : v.ko;
      const o = {}; for (const k in v) o[k] = loc(v[k]); return o;
    }
    return v;
  }

  // 화면에 나오는 고정 글
  const T = {
    ko: {
      sub: '직접 만든 앱·게임 모음<br>먼저 해 보고 알려 주세요!',
      list: '🎮 앱·게임 목록',
      feedback: '의견은',
      font: '글꼴: 주아체 (SIL Open Font License)',
      kakao: '💬 카톡 안에서 열렸어요. 크롬으로 열면 편해요!',
      kakaoTester: '💬 카톡 안에서 열렸어요. 테스터가 되려면 크롬으로 열어 주세요!',
      kakaoBtn: '크롬으로 열기',
      other: 'English',
      testing: '🧪 테스터 모집 중',
      released: '✅ 출시',
      pic: '그림',
      notFound: '앗, 그런 페이지는 없어요 😅',
      toList: '목록 보기',
      ctaTester: '🧪 테스터 되기 <span class="arrow">3단계 ↓</span>',
      ctaStore: '▶ 플레이 스토어에서 받기',
      ctaShots: '📺 화면 구경',
      about: '🎮 이런 게임이에요',
      shots: '📺 화면 구경',
      big: '크게 보기',
      hint: '👉 옆으로 넘겨 보세요 · 누르면 크게 보여요',
      rules: '🙏 꼭 지켜 주세요',
      r14: '<b>14일 동안 지우지 말기</b><span>테스터가 14일 동안 깔아 둬야 정식 출시를 할 수 있어요</span>',
      rAds: '<b>광고는 누르지 말기</b><span>아는 사람이 누르면 부정 클릭이 돼서 광고 계정이 막혀요</span>',
      talk: '💌 의견 보내기',
      talkText: '버그, 불편한 점, 좋았던 점… 뭐든 좋아요! 카톡으로 보내도 돼요.',
      mail: '✉️ 메일 보내기',
      mailSubject: '의견',
      privacy: '개인정보 처리방침',
      howTo: '🧪 테스터 되는 법 <span class="tag">3단계</span>',
      need1: '안드로이드폰만 돼요<small>아이폰은 안 돼요 😢</small>',
      need2: '플레이 스토어에 쓰는 구글 계정으로<small>1번·2번 모두 같은 계정이어야 해요</small>',
      need3: "카톡에서 열었다면 크롬으로<small>로그인 안 된 화면이 나오면 ⋮ → '다른 브라우저로 열기'</small>",
      s1: '구글 그룹 가입',
      s1say: '<q>그룹 가입</q> 누르기 → 작은 창이 뜨면 한 번 더 <q>그룹 가입</q>',
      s1btn: '① 구글 그룹 열기',
      s2: '테스터 되기',
      s2say: '영어 화면이 나와요. <q class="en">Become a tester</q> 누르기',
      s2btn: '② 테스터 페이지 열기',
      s2tip: "'사용할 수 없음'이 뜨면 1번이 아직 반영 안 된 거예요. 몇 분 뒤 다시 열어 보세요.",
      s3: '설치하기',
      s3say: '이어서 나오는 글 <b>중간</b>의 파란 <q class="en">download it on Google Play</q> 누르고 → 설치',
      s3btn: '③ 설치 페이지 열기',
      s3tip: '스토어에서 검색하면 안 나와요. 꼭 파란 글씨나 위 단추로 들어가세요.',
    },
    en: {
      sub: 'Apps &amp; games I made<br>Try them and let me know!',
      list: '🎮 Apps &amp; Games',
      feedback: 'Feedback:',
      font: 'Font: Jua (SIL Open Font License)',
      kakao: '💬 Opened inside KakaoTalk. It works better in Chrome!',
      kakaoTester: '💬 Opened inside KakaoTalk. Please open in Chrome to become a tester!',
      kakaoBtn: 'Open in Chrome',
      other: '한국어',
      testing: '🧪 Testers wanted',
      released: '✅ Out now',
      pic: 'image',
      notFound: "Oops, that page doesn't exist 😅",
      toList: 'See the list',
      ctaTester: '🧪 Become a tester <span class="arrow">3 steps ↓</span>',
      ctaStore: '▶ Get it on Google Play',
      ctaShots: '📺 Screenshots',
      about: "🎮 What's it like?",
      shots: '📺 Screenshots',
      big: 'enlarge',
      hint: '👉 Swipe sideways · Tap to enlarge',
      rules: '🙏 Please remember',
      r14: "<b>Keep it installed for 14 days</b><span>The app needs testers for 14 days before it can launch</span>",
      rAds: "<b>Please don't tap the ads</b><span>Taps from people I know count as invalid clicks and can get my ad account banned</span>",
      talk: '💌 Send feedback',
      talkText: 'Bugs, annoyances, things you liked… anything helps!',
      mail: '✉️ Send an email',
      mailSubject: 'Feedback',
      privacy: 'Privacy policy',
      howTo: '🧪 How to become a tester <span class="tag">3 steps</span>',
      need1: 'Android phones only<small>Sorry, no iPhone 😢</small>',
      need2: 'Use your Google Play account<small>Use the same account for steps 1 and 2</small>',
      need3: "Open it in Chrome<small>If you're not signed in (e.g. inside a chat app), choose 'Open in browser'</small>",
      s1: 'Join the Google Group',
      s1say: 'Tap <q>Join group</q> → when a small window pops up, tap <q>Join group</q> again',
      s1btn: '① Open the Google Group',
      s2: 'Become a tester',
      s2say: 'Tap <q class="en">Become a tester</q>',
      s2btn: '② Open the tester page',
      s2tip: "If it says it's not available, step 1 hasn't kicked in yet. Try again in a few minutes.",
      s3: 'Install',
      s3say: 'In the text that follows, tap the blue <q class="en">download it on Google Play</q> in the <b>middle</b> → Install',
      s3btn: '③ Open the install page',
      s3tip: "Searching the store won't find it. Use the blue link or the button above.",
    },
  }[lang];

  const status = (s) => (s === 'testing' || s === 'released') ? `<span class="chip status ${s}">${T[s]}</span>` : '';
  const siteName = loc(SITE.name);

  // 페이지에 박힌 글(data-t)과 언어 단추
  function setupPage() {
    document.querySelectorAll('[data-t]').forEach((el) => { el.innerHTML = el.dataset.t === 'name' ? esc(siteName) : T[el.dataset.t]; });
    const btn = $('#lang-btn');
    if (btn) {
      btn.textContent = T.other;
      btn.addEventListener('click', () => {
        const next = lang === 'ko' ? 'en' : 'ko';
        try { localStorage.setItem('lang', next); } catch (e) { /* 저장 못 해도 주소로 넘김 */ }
        const u = new URL(location.href); u.searchParams.set('lang', next); location.href = u.toString();
      });
    }
  }

  // 카톡 안 브라우저면 크롬으로 열라는 안내를 띄움 (카톡 브라우저는 구글 로그인이 안 돼 있음)
  function kakaoNotice() {
    const box = $('#kakao');
    if (!box || !/KAKAOTALK/i.test(navigator.userAgent)) return;
    $('#kakao-open').href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href);
    box.hidden = false;
  }

  // 같은 언어로 이어지게 링크에 ?lang= 붙이기
  const withLang = (href) => href + (href.includes('?') ? '&' : '?') + 'lang=' + lang;

  // ---------- 첫 화면 ----------
  function renderHome() {
    document.title = siteName;
    $('#games').innerHTML = GAMES.map((raw) => {
      const g = loc(raw);
      return `
      <a class="card" href="${withLang(`game.html?id=${encodeURIComponent(g.id)}`)}">
        <img class="banner" src="${dir(g)}banner.webp" alt="${esc(g.name)} ${T.pic}" loading="lazy" width="1024" height="500">
        <div class="body">
          <h3>${esc(g.name)}</h3>
          <p>${esc(g.tagline)}</p>
          ${status(g.status)}
        </div>
      </a>`;
    }).join('');
  }

  // ---------- 게임 페이지 ----------
  function renderGame() {
    const raw = GAMES.find((x) => x.id === q.get('id'));
    const main = $('#game');
    $('#home-link').href = withLang('./');
    if (!raw) {
      main.innerHTML = `<div class="box" style="margin-top:30px;text-align:center">
        <p>${T.notFound}</p>
        <a class="btn" href="${withLang('./')}">${T.toList}</a></div>`;
      return;
    }
    const g = loc(raw);
    // 미리 보기: 주소 뒤에 &preview=released 를 붙이면 출시 뒤 모습을 볼 수 있음
    if (['testing', 'released'].includes(q.get('preview'))) g.status = q.get('preview');
    document.title = `${g.name} — ${siteName}`;
    const testing = g.status === 'testing';
    if (testing) $('#kakao-text').textContent = T.kakaoTester;

    const cta = testing
      ? `<a class="btn pink" href="#tester">${T.ctaTester}</a>`
      : `<a class="btn green" href="${esc(g.links.store)}" ${ext}>${T.ctaStore}</a>`;

    main.innerHTML = `
      <section class="hero">
        <img class="banner" src="${dir(g)}banner.webp" alt="${esc(g.name)} ${T.pic}" width="1024" height="500">
        <div class="head">
          <img class="icon" src="${dir(g)}icon.webp" alt="" width="76" height="76">
          <div>
            <h1>${esc(g.name)}</h1>
            <p class="tagline">${esc(g.tagline)}</p>
          </div>
        </div>
        <ul class="chips"><li>${status(g.status)}</li>${(g.chips || []).map((c) => `<li class="chip">${esc(c)}</li>`).join('')}</ul>
        <div class="intro">${(g.intro || []).map((l) => `<p>${esc(l)}</p>`).join('')}</div>
        <div class="cta">${cta}<a class="btn white" href="#shots">${T.ctaShots}</a></div>
      </section>

      <section class="section">
        <h2>${T.about}</h2>
        <div class="features">${(g.features || []).map((f) => `
          <div class="feature"><div class="em">${f.icon}</div><b>${esc(f.title)}</b><span>${esc(f.text)}</span></div>`).join('')}
        </div>
      </section>

      <section class="section" id="shots">
        <h2>${T.shots}</h2>
        <div class="shots">${(g.shots || []).map((s) => `
          <figure class="shot">
            <button type="button" data-src="${dir(g)}${esc(s.file)}" aria-label="${esc(s.caption)} ${T.big}">
              <img src="${dir(g)}${esc(s.file)}" alt="${esc(s.caption)}" loading="lazy" width="1280" height="720">
            </button>
            <figcaption>${esc(s.caption)}</figcaption>
          </figure>`).join('')}
        </div>
        <p class="hint">${T.hint}</p>
      </section>

      ${testing ? testerSection(g) : ''}

      <section class="section">
        <h2>${T.rules}</h2>
        <div class="box rules">
          ${testing ? `<div class="rule"><span class="em">🗓️</span><div>${T.r14}</div></div>` : ''}
          <div class="rule red"><span class="em">🚫</span><div>${T.rAds}</div></div>
        </div>
      </section>

      <section class="section" id="talk">
        <h2>${T.talk}</h2>
        <div class="box talk">
          <p>${T.talkText}</p>
          <a class="btn blue" href="mailto:${SITE.email}?subject=${encodeURIComponent(`[${g.name}] ${T.mailSubject}`)}">${T.mail}</a>
          <span class="chip">${SITE.email}</span>
        </div>
      </section>`;

    $('#foot-extra').innerHTML = g.links.privacy ? `<a href="${esc(g.links.privacy)}" ${ext}>${esc(g.name)} ${T.privacy}</a>` : '';
    setupViewer();
  }

  function testerSection(g) {
    const d = window.drawGuide;
    const btn = (cls, href, label) => `<a class="btn ${cls} wide" href="${esc(href)}" ${ext}>${label} <span class="arrow">↗</span></a>`;
    return `
      <section class="section" id="tester">
        <h2>${T.howTo}</h2>
        <div class="box need">
          <div class="need-item"><span class="em">📱</span><div>${T.need1}</div></div>
          <div class="need-item"><span class="em">👤</span><div>${T.need2}</div></div>
          <div class="need-item"><span class="em">💬</span><div>${T.need3}</div></div>
        </div>

        <ol class="steps">
          <li class="step">
            <div class="step-num">1</div>
            <div class="box">
              <h3>${T.s1}</h3>
              <p class="say">${T.s1say}</p>
              <div class="pics">${d.groupPage(g, lang)}<span class="then">↓</span>${d.groupDialog(g, lang)}</div>
              ${btn('pink', g.links.group, T.s1btn)}
            </div>
          </li>
          <li class="step">
            <div class="step-num">2</div>
            <div class="box">
              <h3>${T.s2}</h3>
              <p class="say">${T.s2say}</p>
              <div class="pics">${d.testerPage(g, lang)}</div>
              ${btn('blue', g.links.tester, T.s2btn)}
              <p class="tip"><span class="em">⏳</span><span>${T.s2tip}</span></p>
            </div>
          </li>
          <li class="step">
            <div class="step-num">3</div>
            <div class="box">
              <h3>${T.s3}</h3>
              <p class="say">${T.s3say}</p>
              <div class="pics">${d.testerDone(g, lang)}<span class="then">↓</span>${d.storePage(g, lang)}</div>
              ${btn('green', g.links.store, T.s3btn)}
              <p class="tip"><span class="em">🔍</span><span>${T.s3tip}</span></p>
            </div>
          </li>
        </ol>
      </section>`;
  }

  // 화면 그림 크게 보기
  function setupViewer() {
    const v = $('#viewer');
    const img = v.querySelector('img');
    const close = () => { v.hidden = true; img.src = ''; };
    document.querySelectorAll('.shot button').forEach((b) => b.addEventListener('click', () => {
      img.src = b.dataset.src; img.alt = b.getAttribute('aria-label'); v.hidden = false;
    }));
    v.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  setupPage();
  kakaoNotice();
  if ($('#games')) renderHome();
  if ($('#game')) renderGame();
})();
