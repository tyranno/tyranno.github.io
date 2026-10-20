// 게임 목록 — 새 게임은 여기에 한 칸 추가 + games/<id>/ 폴더에 그림만 넣으면 카드·페이지가 생김
//
// 폴더에 넣을 그림 (이름 고정)
//   games/<id>/icon.webp    아이콘 (256×256)
//   games/<id>/banner.webp  카드 맨 위 그림 (1024×500)
//   shots에 적은 화면 그림들 (가로 1280 정도)
//   그림 줄이기: node tools/chrome.js webp <원본.png> <결과.webp> <가로 크기>
//
// 새 앱을 비공개 테스트로 올릴 때: 플레이 콘솔에서 구글 그룹을 새로 만들어 테스터 목록에 넣고,
//   아래 ★ 칸(package, group, groupName, playName)을 그 앱 것으로 바꾸기
//
// status: 'testing' = 🧪 테스터 모집 중 (테스터 되는 법 3단계가 나옴)
//         'released' = ✅ 출시 (테스터 안내 대신 플레이 스토어 바로가기가 나옴)
window.GAMES = [
  {
    id: 'toktok-flip',
    name: '톡톡 뒤집기',
    tagline: '눈 달린 말랑말랑 돌을 뒤집는 리버시 퍼즐',
    chips: ['300단계 이야기', '아이템 대전', '매일 새 퍼즐'],
    status: 'testing',
    color: '#22C07A',
    // 게임 페이지 맨 위 소개 (짧게 두세 줄)
    intro: [
      '상대 돌을 내 돌 사이에 끼우면 톡톡 뒤집혀요.',
      '규칙은 1분이면 배우고, 깊이는 끝이 없어요!',
    ],
    features: [
      { icon: '🗺️', title: '300단계 이야기', text: '27개 세계, 세계마다 새로운 판 장치' },
      { icon: '🎁', title: '아이템 대전', text: '폭탄 돌·거울 돌… 컴퓨터도 아이템을 써요' },
      { icon: '📅', title: '매일 새 퍼즐', text: '쉬움·보통·어려움, 달력에 도장 모으기' },
      { icon: '⚔️', title: '등급전', text: '18급부터 9단까지 실력 올리기' },
      { icon: '🎨', title: '꾸미기', text: '고양이 돌, 행성 돌, 우주 판…' },
      { icon: '📴', title: '인터넷 없이 OK', text: '결제 없음 · 한 폰으로 2인용도 돼요' },
    ],
    shots: [
      { file: 'shot-1-menu.webp', caption: '첫 화면' },
      { file: 'shot-3-game.webp', caption: '대전' },
      { file: 'shot-2-map.webp', caption: '300단계 지도' },
      { file: 'shot-4-item.webp', caption: '아이템 대전' },
      { file: 'shot-5-today.webp', caption: '오늘의 퍼즐' },
      { file: 'shot-6-shop.webp', caption: '상점' },
      { file: 'shot-7-friends.webp', caption: '캐릭터 모으기' },
    ],
    // ★ 앱마다 다른 것 — 새로 추가할 때 꼭 바꾸기
    package: 'com.tyranno.othello',       // 플레이 콘솔의 패키지 이름 → 테스터 주소·스토어 주소가 저절로 만들어짐
    group: 'toktok-flip-testers',         // 구글 그룹 아이디 (groups.google.com/g/ 뒤 부분)
    groupName: 'TokTok Flip Testers',     // 구글 그룹 화면에 나오는 이름 (안내 그림에 들어감)
    playName: 'TokTok Flip - Reversi Puzzle', // 테스터 페이지에 나오는 영어 앱 이름 (안내 그림에 들어감)
    privacy: 'https://github.com/tyranno/othello/blob/master/docs/privacy.md',
  },
];

// 패키지 이름·그룹 아이디로 주소 만들기 (손으로 고칠 필요 없음)
window.GAMES.forEach((g) => {
  g.links = {
    group: `https://groups.google.com/g/${g.group}`,
    tester: `https://play.google.com/apps/testing/${g.package}`,
    store: `https://play.google.com/store/apps/details?id=${g.package}`,
    privacy: g.privacy,
  };
});

// 의견 받을 곳 (모든 게임 같이 씀)
window.SITE = {
  name: '만들어 봤어',
  email: 'tyranno1223@gmail.com',
};
