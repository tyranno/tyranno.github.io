// 첫 화면(게임 카드)과 게임 페이지를 games.js 내용으로 그림
(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel) => document.querySelector(sel);
  const dir = (g) => `games/${g.id}/`;
  const STATUS = {
    testing: '<span class="chip status testing">🧪 테스터 모집 중</span>',
    released: '<span class="chip status released">✅ 출시</span>',
  };
  const ext = 'target="_blank" rel="noopener"';

  // 카톡 안 브라우저면 크롬으로 열라는 안내를 띄움 (카톡 브라우저는 구글 로그인이 안 돼 있음)
  function kakaoNotice() {
    const box = $('#kakao');
    if (!box || !/KAKAOTALK/i.test(navigator.userAgent)) return;
    $('#kakao-open').href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href);
    box.hidden = false;
  }

  // ---------- 첫 화면 ----------
  function renderHome() {
    $('#games').innerHTML = GAMES.map((g) => `
      <a class="card" href="game.html?id=${encodeURIComponent(g.id)}">
        <img class="banner" src="${dir(g)}banner.webp" alt="${esc(g.name)} 그림" loading="lazy" width="1024" height="500">
        <div class="body">
          <h3>${esc(g.name)}</h3>
          <p>${esc(g.tagline)}</p>
          ${STATUS[g.status] || ''}
        </div>
      </a>`).join('');
  }

  // ---------- 게임 페이지 ----------
  function renderGame() {
    const q = new URLSearchParams(location.search);
    let g = GAMES.find((x) => x.id === q.get('id'));
    // 미리 보기: 주소 뒤에 &preview=released 를 붙이면 출시 뒤 모습을 볼 수 있음
    if (g && STATUS[q.get('preview')]) g = { ...g, status: q.get('preview') };
    const main = $('#game');
    if (!g) {
      main.innerHTML = `<div class="box" style="margin-top:30px;text-align:center">
        <p>앗, 그런 페이지는 없어요 😅</p>
        <a class="btn" href="./">목록 보기</a></div>`;
      return;
    }
    document.title = `${g.name} — ${SITE.name}`;
    const testing = g.status === 'testing';
    if (testing && $('#kakao-text')) $('#kakao-text').textContent = '💬 카톡 안에서 열렸어요. 테스터가 되려면 크롬으로 열어 주세요!';

    const cta = testing
      ? `<a class="btn pink" href="#tester">🧪 테스터 되기 <span class="arrow">3단계 ↓</span></a>`
      : `<a class="btn green" href="${esc(g.links.store)}" ${ext}>▶ 플레이 스토어에서 받기</a>`;

    main.innerHTML = `
      <section class="hero">
        <img class="banner" src="${dir(g)}banner.webp" alt="${esc(g.name)} 그림" width="1024" height="500">
        <div class="head">
          <img class="icon" src="${dir(g)}icon.webp" alt="" width="76" height="76">
          <div>
            <h1>${esc(g.name)}</h1>
            <p class="tagline">${esc(g.tagline)}</p>
          </div>
        </div>
        <ul class="chips">${STATUS[g.status] ? `<li>${STATUS[g.status]}</li>` : ''}${(g.chips || []).map((c) => `<li class="chip">${esc(c)}</li>`).join('')}</ul>
        <div class="intro">${(g.intro || []).map((l) => `<p>${esc(l)}</p>`).join('')}</div>
        <div class="cta">${cta}<a class="btn white" href="#shots">📺 화면 구경</a></div>
      </section>

      <section class="section">
        <h2>🎮 이런 게임이에요</h2>
        <div class="features">${(g.features || []).map((f) => `
          <div class="feature"><div class="em">${f.icon}</div><b>${esc(f.title)}</b><span>${esc(f.text)}</span></div>`).join('')}
        </div>
      </section>

      <section class="section" id="shots">
        <h2>📺 화면 구경</h2>
        <div class="shots">${(g.shots || []).map((s) => `
          <figure class="shot">
            <button type="button" data-src="${dir(g)}${esc(s.file)}" aria-label="${esc(s.caption)} 크게 보기">
              <img src="${dir(g)}${esc(s.file)}" alt="${esc(s.caption)}" loading="lazy" width="1280" height="720">
            </button>
            <figcaption>${esc(s.caption)}</figcaption>
          </figure>`).join('')}
        </div>
        <p class="hint">👉 옆으로 넘겨 보세요 · 누르면 크게 보여요</p>
      </section>

      ${testing ? testerSection(g) : ''}

      <section class="section">
        <h2>🙏 꼭 지켜 주세요</h2>
        <div class="box rules">
          ${testing ? '<div class="rule"><span class="em">🗓️</span><div><b>14일 동안 지우지 말기</b><span>테스터가 14일 동안 깔아 둬야 정식 출시를 할 수 있어요</span></div></div>' : ''}
          <div class="rule red"><span class="em">🚫</span><div><b>광고는 누르지 말기</b><span>아는 사람이 누르면 부정 클릭이 돼서 광고 계정이 막혀요</span></div></div>
        </div>
      </section>

      <section class="section" id="talk">
        <h2>💌 의견 보내기</h2>
        <div class="box talk">
          <p>버그, 불편한 점, 좋았던 점… 뭐든 좋아요! 카톡으로 보내도 돼요.</p>
          <a class="btn blue" href="mailto:${SITE.email}?subject=${encodeURIComponent(`[${g.name}] 의견`)}">✉️ 메일 보내기</a>
          <span class="chip">${SITE.email}</span>
        </div>
      </section>`;

    $('#foot-extra').innerHTML = g.links.privacy ? `<a href="${esc(g.links.privacy)}" ${ext}>${esc(g.name)} 개인정보 처리방침</a>` : '';
    setupViewer();
  }

  function testerSection(g) {
    const d = window.drawGuide;
    const btn = (cls, href, label) => `<a class="btn ${cls} wide" href="${esc(href)}" ${ext}>${label} <span class="arrow">↗</span></a>`;
    return `
      <section class="section" id="tester">
        <h2>🧪 테스터 되는 법 <span class="tag">3단계</span></h2>
        <div class="box need">
          <div class="need-item"><span class="em">📱</span><div>안드로이드폰만 돼요<small>아이폰은 안 돼요 😢</small></div></div>
          <div class="need-item"><span class="em">👤</span><div>플레이 스토어에 쓰는 구글 계정으로<small>1번·2번 모두 같은 계정이어야 해요</small></div></div>
          <div class="need-item"><span class="em">💬</span><div>카톡에서 열었다면 크롬으로<small>로그인 안 된 화면이 나오면 ⋮ → '다른 브라우저로 열기'</small></div></div>
        </div>

        <ol class="steps">
          <li class="step">
            <div class="step-num">1</div>
            <div class="box">
              <h3>구글 그룹 가입</h3>
              <p class="say"><q>그룹 가입</q> 누르기 → 작은 창이 뜨면 한 번 더 <q>그룹 가입</q></p>
              <div class="pics">${d.groupPage(g)}<span class="then">↓</span>${d.groupDialog(g)}</div>
              ${btn('pink', g.links.group, '① 구글 그룹 열기')}
            </div>
          </li>
          <li class="step">
            <div class="step-num">2</div>
            <div class="box">
              <h3>테스터 되기</h3>
              <p class="say">영어 화면이 나와요. <q class="en">Become a tester</q> 누르기</p>
              <div class="pics">${d.testerPage(g)}</div>
              ${btn('blue', g.links.tester, '② 테스터 페이지 열기')}
              <p class="tip"><span class="em">⏳</span><span>'사용할 수 없음'이 뜨면 1번이 아직 반영 안 된 거예요. 몇 분 뒤 다시 열어 보세요.</span></p>
            </div>
          </li>
          <li class="step">
            <div class="step-num">3</div>
            <div class="box">
              <h3>설치하기</h3>
              <p class="say">이어서 나오는 글 <b>중간</b>의 파란 <q class="en">download it on Google Play</q> 누르고 → 설치</p>
              <div class="pics">${d.testerDone(g)}<span class="then">↓</span>${d.storePage(g)}</div>
              ${btn('green', g.links.store, '③ 설치 페이지 열기')}
              <p class="tip"><span class="em">🔍</span><span>스토어에서 검색하면 안 나와요. 꼭 파란 글씨나 위 단추로 들어가세요.</span></p>
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

  kakaoNotice();
  if ($('#games')) renderHome();
  if ($('#game')) renderGame();
})();
