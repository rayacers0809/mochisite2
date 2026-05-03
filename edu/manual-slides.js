// 모찌서버 스태프 교육 메뉴얼 슬라이드 데이터
// 교육팀 관리자가 admin 페이지에서 수정 가능
// Firestore 'edu_manual' 컬렉션의 'slides' 문서에 저장

const MANUAL_SLIDES = [
  // ========== 표지 ==========
  {
    order: 1,
    type: 'cover',
    title: '모찌서버 스태프 교육 메뉴얼',
    subtitle: 'STAFF TRAINING MANUAL',
    chapter: null
  },

  // ========== 관리팀 디스코드 ==========
  {
    order: 2,
    type: 'links',
    title: '관리팀 디스코드',
    chapter: null,
    items: [
      { label: '모찌서버 디스코드', url: 'http://discord.gg/TcbhYYfDVS' },
      { label: '모찌서버 팩션방', url: 'http://discord.gg/ZmxbDS8Fwa' },
      { label: '모찌서버 관리팀', url: 'http://discord.gg/c6VbVxAA5v' },
      { label: '모찌서버 고객센터', url: 'http://discord.gg/CdRFkNHBhm' }
    ]
  },

  // ========== 1. 서버내 실무 교육 (챕터 표지) ==========
  {
    order: 3,
    type: 'chapter',
    title: '1. 서버 내 실무 교육',
    subtitle: '휴대폰 기능',
    chapter: 1
  },

  // ========== K-관리 메뉴 각 기능 ==========
  {
    order: 4,
    type: 'list',
    title: 'K - 관리 - 관리자 메뉴 각 기능',
    chapter: 1,
    items: [
      { num: '1-1', title: '#고유번호 살리기', note: '유저 요청이 있을시' },
      { num: '1-2', title: '#여러명 끌고가기', note: '웬만하면 사용X', highlight: 'warning' },
      { num: '1-3', title: '[관리자] 무적모드', note: 'rp 및 좀비존, 사냥터 이용시 사용 불가', highlight: 'warning' },
      { num: '1-4', title: '보안 오브젝트 삭제', note: '핵접속시 사용 이외 사용X', highlight: 'warning' }
    ]
  },

  // ========== K-관리-이동 좌표 관련 ==========
  {
    order: 5,
    type: 'list',
    title: 'K - 관리 - 이동 - 좌표 관련 기능',
    chapter: 1,
    items: [
      { num: '2-1', title: '좌표 확인', note: '팩션요청으로 차량 비콘 및 옷장 비콘 생성요청시' },
      { num: '2-2', title: '좌표로 텔레포트', note: '이용X', highlight: 'danger' }
    ]
  },

  // ========== K-관리-이동 기능 ==========
  {
    order: 6,
    type: 'list',
    title: 'K - 관리 - 이동 기능',
    chapter: 1,
    items: [
      { num: '3-1', title: '[스태프] 노클립', note: '이용X 노클립은 F2 노클립 사용', highlight: 'danger' },
      { num: '3-2', title: '관리자 사유지', note: '수영하고 싶을때 이용' },
      { num: '3-3', title: '혼자있고 싶은 곳', note: '우울하고 힘들때 이용' },
      { num: '3-4', title: '관리자 술집', note: '2층에서 스태프 스킨 이용 가능' }
    ]
  },

  // ========== K-관리-역할 관리 기능 ==========
  {
    order: 7,
    type: 'list',
    title: 'K - 관리 - 역할 관리 기능',
    chapter: 1,
    items: [
      { num: '4-1', title: '권한 추가', note: '팩션 직급 추가 해주는 것' },
      { num: '4-2', title: '권한 삭제', note: '팩션 직급 제거 해주는 것' }
    ]
  },

  // ========== K-관리-밴 & 추방 기능 ==========
  {
    order: 8,
    type: 'list',
    title: 'K - 관리 - 밴 & 추방 기능',
    chapter: 1,
    items: [
      { num: '5-1', title: '[관리자] 구금', note: '관리자 구금 넣는 것' },
      { num: '5-2', title: '[관리자] 구금해제', note: '관리자 구금 해제하는 것' },
      { num: '5-3', title: '임시차단', note: '사용 금지', highlight: 'danger' },
      { num: '5-4', title: '임시차단(해제)', note: '사용 금지', highlight: 'danger' },
      { num: '5-5', title: '플레이어 게임추방', note: '버그로 유저 요청시 (웬만하면 F7 눌러서 이용)' },
      { num: '5-6', title: '차단', note: '팩션해체 및 차단해야 되는 유저들 한테 이용' },
      { num: '5-7', title: '차단(해제)', note: '차단 해제시 이용' }
    ]
  },

  {
    order: 9,
    type: 'list',
    title: 'K - 관리 - 밴 & 추방 기능 (계속)',
    chapter: 1,
    items: [
      { num: '5-8', title: '[추노기록] 작성', note: '권구 및 물품회수 등 인게임에 유저들이 없을 때' },
      { num: '5-9', title: '[추노기록] 삭제', note: '권구 및 물품회수 등 완료 되었을 때 해제 [추노기록 꼭 삭제하기]', highlight: 'warning' },
      { num: '5-10', title: '[경고] 추가', note: '이용X', highlight: 'danger' },
      { num: '5-11', title: '[경고] 조회/삭제', note: '이용X', highlight: 'danger' }
    ]
  },

  {
    order: 10,
    type: 'list',
    title: 'K - 관리 - 기타',
    chapter: 1,
    items: [
      { num: '', title: 'K - 관리 - 생성', note: '이용X', highlight: 'danger' },
      { num: '', title: 'K - 관리 - 차량', note: '이용X', highlight: 'danger' },
      { num: '', title: 'K - 관리 - [mochi] 빌립스', note: '웬만하면 이용' }
    ]
  },

  // ========== 2. 단축키 (챕터 표지) ==========
  {
    order: 11,
    type: 'chapter',
    title: '2. 단축키',
    subtitle: '넘버패드 & F7번',
    chapter: 2
  },

  // ========== 2-1. 넘버패드 단축키 ==========
  {
    order: 12,
    type: 'list',
    title: '2-1. 넘버패드 단축키',
    chapter: 2,
    items: [
      { num: '1-1', title: '끌고가기 단축키', note: 'num 7' },
      { num: '1-2', title: '수갑묶기 단축키', note: 'num 4' },
      { num: '1-3', title: '오브젝트 및 치장 제거', note: 'ALT + num 7' },
      { num: '1-4', title: '차량제거', note: 'ALT + num 8' }
    ],
    footer: '※ 1-3과 1-4는 ALT+(+/-)로 삭제 범위 조절 가능'
  },

  // ========== 2-2. F7번 단축키 ==========
  {
    order: 13,
    type: 'list',
    title: '2-2. F7번 단축키',
    chapter: 2,
    items: [
      { num: '1', title: '물품회수 진행', note: 'F7 누른 후 "유저관리"에서 물품회수 진행' },
      { num: '2', title: '메광으로, 시청으로', note: '각각 위치로 TP됨' }
    ]
  },

  // ========== 3. 사이드공지 교육 ==========
  {
    order: 14,
    type: 'chapter',
    title: '3. 사이드공지 교육',
    subtitle: '/관리팀 명령어 사용법',
    chapter: 3
  },

  {
    order: 15,
    type: 'content',
    title: '사이드공지 작성법',
    chapter: 3,
    sections: [
      {
        heading: '명령어',
        content: '/관리팀 <말할 내용>'
      },
      {
        heading: '주요 사용 케이스',
        content: '메인광장 및 메차 인근 소음공해 관련 사이드공지 1회로 진행',
        highlight: 'primary'
      },
      {
        heading: '예시',
        content: '/관리팀 메인광장 근처에서 소음공해 자제 바랍니다'
      }
    ]
  },

  // ========== 4. 전체채팅 기본 교육 ==========
  {
    order: 16,
    type: 'chapter',
    title: '4. 전체채팅 기본 교육',
    subtitle: '유저 응대 양식',
    chapter: 4
  },

  {
    order: 17,
    type: 'content',
    title: '기본 원칙',
    chapter: 4,
    sections: [
      {
        heading: '⚠️ 절대 금지',
        content: '인게임 내에서 유저들과 반말 및 친목 절대금지 [발각시 즉시해임]',
        highlight: 'danger'
      },
      {
        heading: '✅ 허용',
        content: '기본적인 인사는 가능'
      }
    ]
  },

  {
    order: 18,
    type: 'content',
    title: 'TP/소환 양식 (3회 공지)',
    chapter: 4,
    sections: [
      {
        heading: '안내',
        content: '유저에게 TP 또는 소환을 하게 될 경우 아래의 방법으로 3회 공지 후 진행'
      },
      {
        heading: '양식 1 - 계신지 확인',
        content: '<이름 및 유저 고번>님 계신가요?'
      },
      {
        heading: '양식 2 - RP 중 확인',
        content: '<이름 및 유저 고번>님 RP중인가요?'
      },
      {
        heading: '양식 3 - 사건처리',
        content: '<이름 및 유저 고번>님 사건처리를 위해 잠시 TP타겠습니다'
      },
      {
        heading: '양식 4 - 물품회수',
        content: '<이름 및 유저 고번>님 물품회수를 위해 잠시 TP타겠습니다'
      },
      {
        heading: '양식 5 - 일반 TP',
        content: '<이름 및 유저 고번>님 잠시 TP타겠습니다'
      }
    ]
  },

  {
    order: 19,
    type: 'example',
    title: '실제 작성 예시',
    chapter: 4,
    examples: [
      {
        label: '계신지 확인 (3회)',
        lines: [
          '수댕이 1973님 계신가요?',
          '수댕이 1973님 계신가요?',
          '수댕이 1973님 계신가요?'
        ]
      },
      {
        label: 'RP 중 확인 (3회)',
        lines: [
          '수댕이 1973님 RP중이신가요?',
          '수댕이 1973님 RP중이신가요?',
          '수댕이 1973님 RP중이신가요?'
        ]
      },
      {
        label: '물품회수 안내 (3회)',
        lines: [
          '수댕이 1973님 물품회수를 위해 잠시 TP타겠습니다.',
          '수댕이 1973님 물품회수를 위해 잠시 TP타겠습니다.',
          '수댕이 1973님 물품회수를 위해 잠시 TP타겠습니다.'
        ]
      }
    ]
  },

  // ========== 5. 디스코드 실무 교육 ==========
  {
    order: 20,
    type: 'chapter',
    title: '5. 디스코드 실무 교육',
    subtitle: '모든 디스코드 채널은 수시로 확인바랍니다',
    chapter: 5
  },

  {
    order: 21,
    type: 'list',
    title: '본서버 디스코드',
    chapter: 5,
    items: [
      { num: '1', title: '뉴비재인증', note: '디스코드 서버 목록, 인게임 접속 화면, 양식에 맞는 디스코드 별명 변경 — 3가지 조건 충족시 시민권한 지급' },
      { num: '2', title: '권한삭제', note: '무조건 팩션쿨타임 권한 지급', highlight: 'warning' }
    ]
  },

  {
    order: 22,
    type: 'list',
    title: '관리팀 디스코드',
    chapter: 5,
    items: [
      { num: '1', title: '물품회수 완료시', note: '[물품회수] 디스코드에 무조건 작성하기', highlight: 'warning' },
      { num: '2', title: '패치 요청', note: '차량패치요청, 패치요청, 법률요청 등 작성하기' },
      { num: '3', title: '서버관련 건의사항', note: '"건의사항"에 작성' },
      { num: '4', title: '개인사정으로 접속 못할시', note: '"휴가신청"에 무조건 작성', highlight: 'warning' },
      { num: '5', title: '출근 및 퇴근시', note: '무조건 "출퇴근"에 작성하기 (모찌 실적봇) /출퇴근', highlight: 'warning' },
      { num: '6', title: '사건처리 완료시', note: '"사건처리"에 작성하기 (모찌 실적봇) /사처등록' },
      { num: '7', title: '팩션감사 기간', note: '30분에 한번씩 "팩션감사"에 서버인원 스크린샷 후 작성' },
      { num: '8', title: '트럭기사 버그 및 벨 오류 발생시', note: '본인 돈을 유저에게 주고 "돈-복구"에 작성' }
    ]
  },

  {
    order: 23,
    type: 'content',
    title: '팩션 디스코드',
    chapter: 5,
    sections: [
      {
        heading: '기본',
        content: '팩션 디스코드방은 담당 관리진이 아닐 경우 할 일이 없으나 가끔 패치요청이 올라올 경우 해당 요청만 관리팀 디스코드 패치요청에 올리기'
      }
    ]
  },

  {
    order: 24,
    type: 'list',
    title: '고객센터 디스코드',
    chapter: 5,
    items: [
      { num: '1', title: '문의가 시작되었을 경우', note: '안녕하세요, 모찌서버 운영팀 OOO입니다 무엇을 도와드릴까요?' },
      { num: '2', title: '문의 대응 도중 모르는 상황', note: '잠시만 기다려주시면 답변 도와드리겠습니다. → 위에 채팅 작성 후 (!@모찌 운영팀 태그)' },
      { num: '3', title: '오래된 문의를 늦게 답변할 경우', note: '답변이 늦어져 죄송합니다. <해당 상황에 맞는 답변>' },
      { num: '4', title: '문의 종료할 때', note: '추가 문의사항 있으신가요? → 작성 이후 문의사항이 없을 때 → "문의 종료 하겠습니다." → 이후 (문의종료) 작성' }
    ]
  },

  // ========== 6. 스태프 규칙 ==========
  {
    order: 25,
    type: 'chapter',
    title: '6. 스태프 규칙',
    subtitle: '필독 사항',
    chapter: 6
  },

  {
    order: 26,
    type: 'rules',
    title: '스태프 절대 금지 사항',
    chapter: 6,
    rules: [
      { text: '인게임 내에서 유저들과 반말 및 친목 절대 금지', warning: '발각시 즉시해임' },
      { text: '피크타임 때 RP 절대 금지' },
      { text: '팩션물품 판매 절대 금지' },
      { text: '권한 넣어서 몰래 총기 빼기 절대 금지', warning: '발각시 즉시해임' },
      { text: '권력 남용 절대 금지' },
      { text: '스태프콜 꼭 읽고 받기' },
      { text: '임의판단 절대 금지', subtext: '(모르면 물어보기)' }
    ]
  },

  // ========== 마무리 ==========
  {
    order: 27,
    type: 'closing',
    title: '교육 완료',
    subtitle: '교육 메뉴얼 종료',
    chapter: null,
    message: '본 교육 내용을 숙지하고 모찌서버 운영팀의 일원으로서\n책임감 있는 활동 부탁드립니다.'
  }
];

// Firestore에 업로드용
const MANUAL_DATA = {
  version: '1.0',
  lastUpdated: '2026-05-04',
  totalSlides: MANUAL_SLIDES.length,
  slides: MANUAL_SLIDES
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANUAL_SLIDES, MANUAL_DATA };
}
