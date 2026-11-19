/* =========================================================
   Zap 연습장 — 미션 데이터
   type: choice | multi | sequence | pairs | fill | config | lab
   ========================================================= */

const CHAPTERS = [
  { id: 'c1', name: '1부 · 시작하기' },
  { id: 'c2', name: '2부 · 로직과 데이터' },
  { id: 'c3', name: '3부 · 개발자 도구' },
  { id: 'c4', name: '4부 · Zapier 플랫폼' },
  { id: 'c5', name: '5부 · Claude 협업 심화' },
  { id: 'c6', name: '6부 · 운영과 실전' }
];

/* 시뮬레이터에서 쓰는 앱 카탈로그 (실제 Zapier 앱/이벤트 이름 기준) */
const APPS = {
  'Google Forms':      { ic: '📝', triggers: ['New Form Response', 'New or Updated Form Response'], actions: ['Create Response'] },
  'Gmail':             { ic: '✉️', triggers: ['New Email', 'New Labeled Email', 'New Attachment'], actions: ['Send Email', 'Create Draft', 'Reply to Email', 'Add Label to Email'] },
  'Google Sheets':     { ic: '📊', triggers: ['New Spreadsheet Row', 'New or Updated Spreadsheet Row'], actions: ['Create Spreadsheet Row', 'Update Spreadsheet Row', 'Lookup Spreadsheet Row'] },
  'Slack':             { ic: '💬', triggers: ['New Message Posted to Channel', 'New Mention'], actions: ['Send Channel Message', 'Send Direct Message', 'Add Reminder'] },
  'Google Calendar':   { ic: '📅', triggers: ['New Event', 'Event Start'], actions: ['Create Detailed Event', 'Quick Add Event', 'Find Event'] },
  'Notion':            { ic: '📓', triggers: ['New Database Item'], actions: ['Create Database Item', 'Update Database Item'] },
  'Schedule by Zapier':{ ic: '⏰', triggers: ['Every Hour', 'Every Day', 'Every Week', 'Every Month'], actions: [] },
  'Webhooks by Zapier':{ ic: '🪝', triggers: ['Catch Hook', 'Catch Raw Hook', 'Retrieve Poll'], actions: ['POST', 'GET', 'PUT', 'Custom Request'] },
  'Anthropic (Claude)':{ ic: '✻', triggers: [], actions: ['Send Message'] },
  'Zapier Tables':     { ic: '🗂️', triggers: ['New Record', 'Updated Record'], actions: ['Create Record', 'Update Record', 'Find Record'] },
  'Zapier Interfaces': { ic: '🧩', triggers: ['New Form Submission'], actions: [] }
};

/* 공통 샘플 데이터: 어학원 상담 신청 */
const SAMPLE_LEAD = {
  '이름': '김민지',
  '이메일': 'minji.kim@example.com',
  '희망과정': 'DELE B1',
  '언어': '스페인어',
  '지역': '서울',
  '문의내용': '주말반이 있나요? 내년 5월 시험 목표입니다.',
  '제출시각': '2026-11-20T09:12:00'
};

const LEADS = [
  { id: 1, 이름: '김민지', 언어: '스페인어', 희망과정: 'DELE B1',   지역: '서울', 예산: 400000, 문의내용: '주말반이 있나요? 내년 5월 시험 목표입니다.' },
  { id: 2, 이름: '박준호', 언어: '영어',     희망과정: 'TOEIC Speaking', 지역: '부산', 예산: 250000, 문의내용: '회사에서 점수가 필요해요. 빨리 시작하고 싶습니다.' },
  { id: 3, 이름: '이서연', 언어: '스페인어', 희망과정: 'DELE A2',   지역: '서울', 예산: 300000, 문의내용: '아이가 국제학교 다니는데 같이 배울 수 있나요?' },
  { id: 4, 이름: 'Carlos', 언어: '프랑스어', 희망과정: 'DELF A1',   지역: '경기', 예산: 350000, 문의내용: 'Je voudrais commencer en décembre.' },
  { id: 5, 이름: '최하늘', 언어: '스페인어', 희망과정: '여행 스페인어', 지역: '서울', 예산: 150000, 문의내용: '내년 2월 남미 여행 가요!' },
  { id: 6, 이름: '정우성', 언어: '영어',     희망과정: '문법 기초', 지역: '서울', 예산: 200000, 문의내용: '환불 규정이 궁금합니다. 불만이 있어요.' }
];

const MISSIONS = [
/* ------------------------------------------------------------------ */
{
  id: 'm0', ch: 'c1', emoji: '👋', title: 'Zapier와 Claude, 첫 만남', time: '5분',
  sum: 'Zapier가 무엇이고, Claude와 어떻게 역할을 나누는지 알아봅니다.',
  concept: `<p><b>Zapier</b>는 9,000개가 넘는 앱을 이어 주는 자동화 플랫폼이에요. “A가 일어나면 B를 해라”를 코드 없이 만들어 두면, 내가 자는 동안에도 알아서 돌아갑니다. 이 자동화 하나를 <b>Zap</b>이라고 불러요.</p>
  <ul>
    <li><b>Trigger(트리거)</b> — Zap을 출발시키는 사건. 예) 상담 신청서가 새로 제출됨</li>
    <li><b>Action(액션)</b> — 트리거 뒤에 Zapier가 대신 해 주는 일. 예) Slack에 알림 보내기</li>
    <li><b>Task(태스크)</b> — 액션이 <u>성공적으로</u> 한 번 실행된 것. 요금은 태스크 수로 계산돼요.</li>
  </ul>
  <div class="scenario">🧠 <b>Claude = 생각하는 머리</b> (읽고, 요약하고, 분류하고, 글을 써요)<br>🦾 <b>Zapier = 움직이는 손발</b> (앱 사이로 데이터를 옮기고, 정해진 시간에 반복해요)<br>둘을 합치면 “생각하고 행동하는” 자동화가 됩니다.</div>`,
  claude: {
    role: '이 연습장에서는 Claude와 Zapier를 세 가지 방식으로 함께 씁니다. ① Zap 안에 Claude를 넣기(AI 단계) ② Claude 채팅에서 Zapier를 부르기(Zapier MCP) ③ Claude에게 Zap 설계·코드를 맡기기.',
    prompts: [
      { tag: '처음 시작할 때 Claude에게', text: '나는 어학원을 운영하고 있어. 매일 반복하는 업무를 적어 줄 테니, Zapier로 자동화할 수 있는 것과 Claude(AI)가 판단해야 하는 것으로 나눠 표로 정리해 줘.\n\n- 홈페이지 상담 신청 확인\n- 수강생에게 수업 리마인더 보내기\n- 월말 매출 정리' }
    ]
  },
  steps: [
    { t: '용어 짝 맞추기', g: '왼쪽 용어를 누른 뒤, 알맞은 설명을 오른쪽에서 고르세요.', type: 'pairs',
      pairs: [['Zap', '트리거와 액션으로 이뤄진 자동화 한 개'], ['Trigger', 'Zap을 출발시키는 사건'], ['Action', '트리거 뒤에 대신 수행하는 일'], ['Task', '성공한 액션 실행 1회 (요금 단위)']],
      hint: 'Task는 “성공한 액션 실행 횟수”예요. 트리거가 몇 번 확인했는지와는 상관없어요.' },
    { t: '누가 할 일일까? (1)', g: '“상담 문의 메일을 읽고 <b>급한 문의인지 판단</b>”하는 일은 누구에게 맡기는 게 좋을까요?', type: 'choice',
      options: [{ ic: '✻', l: 'Claude', d: '글을 이해하고 판단·분류하는 일' }, { ic: '⚡', l: 'Zapier 단독', d: '정해진 규칙대로 데이터 이동' }, { ic: '🙋', l: '사람이 매번 직접', d: '자동화하지 않음' }],
      answer: 0, why: ['', '규칙(“제목에 ‘급함’이 있으면”)만으로는 문장의 뉘앙스를 판단하기 어려워요.', '자동화할 수 있는 일이에요! Claude가 1차로 판단하고, 애매하면 사람이 보면 돼요.'],
      hint: '문장의 의미를 이해해야 하는 일은 AI의 몫이에요.' },
    { t: '누가 할 일일까? (2)', g: '“매주 월요일 오전 9시에 <b>지난주 상담 목록을 시트에서 가져와 Slack에 올리기</b>”는요?', type: 'choice',
      options: [{ ic: '⚡', l: 'Zapier', d: '정해진 시간에 앱 사이 데이터 이동' }, { ic: '✻', l: 'Claude만으로 충분', d: '채팅에서 매주 직접 요청' }],
      answer: 0, why: ['', 'Claude 채팅은 내가 말을 걸 때만 움직여요. “매주 정해진 시간”에 스스로 도는 일은 Zapier(Schedule)가 잘해요.'],
      hint: '내가 노트북을 덮어도 계속 돌아가야 하는 일 → Zapier!' },
    { t: 'Claude × Zapier 협업 3가지 방식', g: '각 상황에 맞는 협업 방식을 짝지어 보세요.', type: 'pairs',
      pairs: [['Zap 안의 AI 단계', '새 문의가 오면 Claude가 자동으로 요약해 시트에 기록'], ['Zapier MCP', 'Claude 채팅에서 “내일 일정 잡아 줘”라고 말하면 캘린더에 실제로 등록'], ['Claude에게 설계 맡기기', '“이런 자동화 만들고 싶어”라고 설명하고 Zap 구조·코드를 받아 내기']],
      hint: 'MCP는 “Claude가 Zapier의 손발을 빌려 쓰는 통로”라고 생각하면 쉬워요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm1', ch: 'c1', emoji: '⚡', title: '첫 Zap 만들기: 트리거 → 액션', time: '10분',
  sum: '상담 신청서가 들어오면 Slack으로 알림을 보내는 Zap을 직접 조립합니다.',
  concept: `<p>Zap 편집기는 위에서 아래로 단계를 쌓는 구조예요. 맨 위 <b>Trigger</b>, 그 아래로 <b>Action</b>들이 이어집니다. 각 단계는 <b>앱 선택 → 이벤트 선택 → 계정 연결 → 설정(데이터 매핑) → 테스트</b> 순서로 채워요.</p>
  <div class="scenario">🎯 <b>오늘의 시나리오</b><br>홈페이지의 상담 신청서(Google Forms)가 제출되면 → Slack <code>#상담</code> 채널에 “새 문의 도착!” 알림 보내기</div>`,
  claude: {
    role: '어떤 앱의 어떤 트리거/액션을 써야 할지 막막할 때 Claude에게 “트리거–액션 쌍”을 물어보세요. 이름이 정확할수록 Zapier 검색창에서 바로 찾을 수 있어요.',
    prompts: [{ tag: 'Zap 설계 요청', text: 'Zapier로 아래 자동화를 만들고 싶어. 트리거 앱/이벤트, 액션 앱/이벤트, 각 단계에서 매핑해야 할 필드를 순서대로 알려 줘.\n\n"구글 폼으로 상담 신청이 들어오면 슬랙 #상담 채널에 신청자 이름, 희망 과정, 이메일을 보내기"' }]
  },
  steps: [
    { t: '트리거 고르기', g: '“상담 신청서가 새로 제출되면”에 해당하는 <b>트리거 앱과 이벤트</b>를 고르세요.', type: 'lab', lab: 'appPick',
      p: { role: 'trigger', app: 'Google Forms', event: 'New Form Response' },
      hint: '신청서는 Google Forms에 있어요. “새 응답”이 들어올 때 출발해야 하니 New Form Response!' },
    { t: '액션 고르기', g: '“Slack #상담 채널에 알림 보내기”에 해당하는 <b>액션 앱과 이벤트</b>를 고르세요.', type: 'lab', lab: 'appPick',
      p: { role: 'action', app: 'Slack', event: 'Send Channel Message' },
      hint: '채널에 보내는 거니까 Direct Message가 아니라 Channel Message예요.' },
    { t: '계정 연결은 안전하게', g: 'Zapier에 Slack 계정을 연결할 때 가장 안전한 방법은?', type: 'choice',
      options: [{ ic: '🔐', l: 'Zapier의 “Sign in” 버튼으로 공식 로그인 창(OAuth)을 열어 승인한다', d: '비밀번호가 Zapier에 저장되지 않음' }, { ic: '📋', l: 'Slack 비밀번호를 Claude 채팅에 붙여넣고 대신 연결해 달라고 한다', d: '' }, { ic: '📧', l: '동료에게 내 계정 비밀번호를 메일로 보내 연결을 부탁한다', d: '' }],
      answer: 0, why: ['', '비밀번호·API 키는 AI 채팅에 붙여넣지 마세요. Zapier MCP도 OAuth로 연결해서 원본 키를 붙여넣을 필요가 없어요.', '계정 정보는 절대 공유하지 않아요.'],
      hint: '공식 로그인 팝업에서 권한을 “허용”하는 방식이 OAuth예요.' },
    { t: '데이터 매핑', g: '트리거에서 가져온 <b>샘플 데이터</b>를 Slack 메시지의 각 칸에 연결하세요. (Zapier에서는 칸을 클릭하면 이전 단계 데이터가 목록으로 떠요.)', type: 'lab', lab: 'mapping',
      p: { targets: [['신청자 이름 칸', '이름'], ['희망 과정 칸', '희망과정'], ['연락처 칸', '이메일']] },
      hint: '칸 이름과 의미가 같은 데이터를 고르면 돼요. 연락처 = 이메일!' },
    { t: '테스트하고 게시하기', g: 'Zapier는 <b>트리거 테스트 → 액션 테스트 → Publish</b> 순서로 켭니다. 버튼을 순서대로 눌러 Zap을 켜 보세요.', type: 'lab', lab: 'testPublish',
      hint: '순서가 중요해요. 트리거 샘플을 먼저 가져와야 액션을 테스트할 수 있어요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm2', ch: 'c1', emoji: '🧾', title: 'Task 계산과 Zap History', time: '8분',
  sum: '요금의 기준이 되는 Task를 계산하고, 실행 기록에서 오류를 찾아 고칩니다.',
  concept: `<p>Zapier 요금은 <b>Task(성공한 액션 실행)</b> 수로 결정돼요. 그래서 “무엇이 Task로 세어지지 않는지” 아는 게 비용 절약의 핵심입니다.</p>
  <ul>
    <li>❌ Task 아님: <b>트리거</b>, <b>Filter·Paths</b>, 오류나 중단(Halt)된 단계, 필터에 막혀 실행되지 않은 단계</li>
    <li>❌ Task 아님: <b>Formatter, Delay, Looping, Sub-Zap, Digest, Tables, Interfaces</b> 같은 Zapier 내장 앱 단계</li>
    <li>✅ Task: Gmail 발송, Slack 메시지, 시트 행 추가처럼 <b>외부 앱에서 실제로 성공한 액션</b></li>
    <li>✅ Zapier MCP는 성공한 도구 호출 1번에 <b>2 Task</b></li>
  </ul>
  <p><b>Zap History</b>에서는 모든 실행 기록(성공·필터됨·오류·중단)을 볼 수 있고, 오류가 난 실행은 원인을 고친 뒤 <b>Replay</b>로 다시 돌릴 수 있어요.</p>`,
  claude: {
    role: 'Zap History의 오류 메시지는 영어라 헷갈릴 때가 많아요. 오류 내용을 그대로 복사해 Claude에게 붙여넣으면 원인과 해결 순서를 알려 줘요. (단, 개인정보·API 키는 지우고 붙여넣으세요.)',
    prompts: [{ tag: '오류 해석 요청', text: 'Zapier Zap History에서 아래 오류가 났어. 원인이 뭔지, Zap 편집기에서 어떤 단계를 어떻게 고치면 되는지 순서대로 알려 줘.\n\n단계: Slack – Send Channel Message\n오류: channel_not_found' }]
  },
  steps: [
    { t: 'Task 세기', g: '아래 Zap이 <b>10번 실행</b>됐고, 그중 <b>6번만 필터를 통과</b>했어요. 모든 액션은 성공했습니다. 사용한 Task는 몇 개일까요?<div class="zap-ed" style="margin-top:10px;padding:14px">' +
        '<div class="zstep"><div class="zh"><div class="zi">📝</div><div><div class="zk">1. TRIGGER</div><div class="zt">Google Forms · New Form Response</div></div></div></div><div class="zline"></div>' +
        '<div class="zstep"><div class="zh"><div class="zi">🔤</div><div><div class="zk">2. ACTION</div><div class="zt">Formatter · 이름 대소문자 정리</div></div></div></div><div class="zline"></div>' +
        '<div class="zstep"><div class="zh"><div class="zi">🚦</div><div><div class="zk">3. FILTER</div><div class="zt">지역이 “서울”일 때만 계속</div></div></div></div><div class="zline"></div>' +
        '<div class="zstep"><div class="zh"><div class="zi">💬</div><div><div class="zk">4. ACTION</div><div class="zt">Slack · Send Channel Message</div></div></div></div><div class="zline"></div>' +
        '<div class="zstep"><div class="zh"><div class="zi">✉️</div><div><div class="zk">5. ACTION</div><div class="zt">Gmail · Send Email</div></div></div></div></div>',
      type: 'fill', fields: [{ l: '사용한 Task 수', a: ['12'], ph: '숫자만 입력' }],
      hint: '트리거·Formatter·Filter는 0이에요. 필터를 통과한 6번 × (Slack + Gmail) = ?' },
    { t: 'Zap History에서 오류 고치기', g: '실행 기록 중 <b>오류(Errored)</b>가 난 줄을 눌러 원인을 확인하고, 알맞은 해결책을 고른 뒤 <b>Replay</b> 하세요.', type: 'lab', lab: 'history',
      hint: 'channel_not_found = 보내려는 채널을 못 찾았다는 뜻. 채널 이름이 바뀌었거나 Zapier 봇이 채널에 없을 때 나요.' },
    { t: '자동 재시도 기능', g: '일시적인 서버 오류로 실패한 단계를 Zapier가 <b>자동으로 다시 시도</b>하게 하는 기능은?', type: 'choice',
      options: [{ ic: '🔁', l: 'Autoreplay', d: '실패한 단계를 일정 간격으로 자동 재시도' }, { ic: '🗑️', l: 'Delete History', d: '' }, { ic: '⏸️', l: 'Turn off Zap', d: '' }],
      answer: 0, why: ['', '기록을 지우면 원인 파악도 못 해요.', 'Zap을 끄면 이후 신청도 놓쳐요.'], hint: '“자동 리플레이”예요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm3', ch: 'c2', emoji: '🚦', title: 'Filter: 조건에 맞을 때만', time: '8분',
  sum: '조건 빌더로 원하는 신청만 통과시키는 필터를 만듭니다.',
  concept: `<p><b>Filter by Zapier</b>는 조건을 만족할 때만 다음 단계로 넘어가게 하는 관문이에요. 필터에 막힌 실행은 Task를 쓰지 않아요. 그래서 <b>가장 까다로운 필터를 트리거 바로 뒤</b>에 두면 비용이 줄어요.</p>
  <ul><li><b>AND</b> — 모든 조건을 동시에 만족해야 통과</li><li><b>OR</b> — 조건 중 하나만 만족해도 통과</li><li>조건 종류: Text(Contains, Exactly matches…), Number(Greater than…), Exists 등</li></ul>`,
  claude: {
    role: '말로 된 규칙을 Zapier 필터 조건으로 바꾸는 일은 Claude가 잘해요. 특히 AND/OR 조합이 복잡할 때 표로 받아 보세요.',
    prompts: [{ tag: '필터 조건 변환', text: '다음 규칙을 Zapier Filter 조건(필드 / 조건 종류 / 값, AND·OR 그룹)으로 바꿔 줘.\n"스페인어 과정 중에서 서울 지역 신청만 원장에게 알림"' }]
  },
  steps: [
    { t: '필터 조건 만들기', g: '목표: <b>언어가 “스페인어”이고, 지역이 “서울”</b>인 신청만 통과시키세요. 조건을 바꾸면 아래 표가 실시간으로 바뀝니다.', type: 'lab', lab: 'filter',
      p: { target: [1, 3, 5] },
      hint: '조건 2개를 AND로 묶으세요. ① 언어 · (Text) Exactly matches · 스페인어 ② 지역 · (Text) Exactly matches · 서울' },
    { t: 'AND와 OR', g: '“예산이 300,000원 이상<b>이거나</b> 희망과정에 DELE가 들어간 신청”을 고르려면 두 조건을 어떻게 묶어야 할까요?', type: 'choice',
      options: [{ ic: '🔗', l: 'OR로 묶는다', d: '하나만 맞아도 통과' }, { ic: '➕', l: 'AND로 묶는다', d: '둘 다 맞아야 통과' }],
      answer: 0, why: ['', '“~이거나”는 하나만 만족해도 된다는 뜻이에요.'], hint: '“또는/이거나” = OR' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm4', ch: 'c2', emoji: '🔀', title: 'Paths: 상황별로 갈라지기', time: '10분',
  sum: '언어별로 담당 선생님에게 다른 알림이 가도록 분기를 설계합니다.',
  concept: `<p>Filter가 “통과/정지”라면, <b>Paths by Zapier</b>는 “갈림길”이에요. 각 Path마다 조건과 그 뒤에 이어지는 액션을 따로 가질 수 있어요. Paths 단계 자체도 Task를 쓰지 않고, <b>실행된 Path 안의 액션만</b> Task로 세어요.</p>
  <div class="scenario">🎯 스페인어 문의 → 후안샘 / 영어 문의 → 영어팀 / 그 외 → 원장실</div>`,
  claude: {
    role: '분기가 많아지면 빠뜨리는 경우가 생겨요. Claude에게 “빠진 경우(엣지 케이스)가 없는지” 점검을 맡겨 보세요.',
    prompts: [{ tag: '분기 점검', text: '아래 Zapier Paths 설계에서 어느 Path에도 들어가지 않는 경우가 있는지, 두 Path에 동시에 들어가는 경우가 있는지 찾아 줘.\nPath A: 언어 = 스페인어\nPath B: 언어 = 영어\nPath C: 언어 ≠ 스페인어' }]
  },
  steps: [
    { t: '세 갈래 Path 설정', g: '각 Path의 조건을 정한 뒤 <b>▶ 실행</b>을 누르세요. 6건의 문의가 모두 <b>목표 담당자</b>에게 정확히 가야 성공!', type: 'lab', lab: 'paths',
      hint: 'Path A: 언어 · Exactly matches · 스페인어 / Path B: 언어 · Exactly matches · 영어 / Path C: 언어 · Exactly matches · 프랑스어. (C를 “스페인어가 아님”으로 하면 영어 문의가 B와 C에 중복으로 들어가요!)' },
    { t: 'Path 순서의 함정', g: 'Path A에 <b>Delay 1일</b>이 있고 Path B는 즉시 Slack을 보냅니다. 두 Path가 동시에 조건을 만족하면 어떻게 될까요?', type: 'choice',
      options: [{ ic: '⏳', l: 'Path B도 Path A가 끝날 때까지 기다릴 수 있다', d: 'Path는 순서대로 처리돼요' }, { ic: '⚡', l: 'Path B는 항상 즉시 실행된다', d: '' }],
      answer: 0, why: ['', 'Zapier 도움말에 따르면 앞쪽 Path의 Delay가 뒤쪽 Path를 붙잡아 둘 수 있어요. 급한 Path를 앞에 두세요.'], hint: '급한 알림은 앞쪽 Path에!' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm5', ch: 'c2', emoji: '🔤', title: 'Formatter: 데이터 다듬기', time: '10분',
  sum: '대소문자, 이메일 추출, 날짜·숫자 형식, 조회표를 직접 돌려 봅니다.',
  concept: `<p>앱마다 데이터 모양이 달라서, 그대로 옮기면 지저분해지기 쉬워요. <b>Formatter by Zapier</b>는 Text / Numbers / Date &amp; Time / Utilities 네 가지 도구로 데이터를 다듬어요. 그리고 <b>Task를 쓰지 않아요!</b></p>
  <ul><li>Text: Titlecase, Extract Email Address, Split Text, Trim Whitespace…</li><li>Numbers: Format Number, Format Currency…</li><li>Date &amp; Time: Format (날짜 형식 바꾸기)</li><li>Utilities: Lookup Table (값 → 다른 값 대응표)</li></ul>`,
  claude: {
    role: '“이 입력을 이 출력으로 바꾸고 싶다”를 예시로 보여 주면, Claude가 어떤 Formatter 변환을 어떤 순서로 쓰면 되는지 알려 줘요. Formatter로 안 되는 복잡한 변환은 Code 단계용 코드로 받아요.',
    prompts: [{ tag: '변환 레시피 요청', text: 'Zapier Formatter로 아래처럼 바꾸고 싶어. 필요한 Transform과 옵션을 순서대로 알려 줘. Formatter로 불가능하면 Code by Zapier(JavaScript) 코드로 줘.\n\n입력: "2026-11-20T09:12:00"\n원하는 출력: "2026년 11월 20일"' }]
  },
  steps: [
    { t: 'Formatter 실험실', g: '각 도전 과제의 <b>입력</b>을 <b>목표 출력</b>으로 바꾸는 Transform을 고르세요. 결과가 목표와 같아지면 통과! (5개 모두)', type: 'lab', lab: 'formatter',
      hint: '이름 → Titlecase / 이메일 → Extract Email Address / 날짜 → Date Format / 과정→가격 → Lookup Table / 큰 숫자 → Format Number' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm6', ch: 'c2', emoji: '⏰', title: 'Schedule · Delay · Digest', time: '8분',
  sum: '정해진 시간에 실행하고, 기다렸다 실행하고, 모아서 한 번에 보내기.',
  concept: `<ul><li><b>Schedule by Zapier</b> — 매시간/매일/매주/매월 정해진 시각에 Zap을 출발시키는 트리거</li>
  <li><b>Delay by Zapier</b> — <i>Delay For</i>(얼마 동안 기다리기), <i>Delay Until</i>(특정 시각까지 기다리기), <i>Delay After Queue</i>(앞 실행이 끝날 때까지 줄 서기)</li>
  <li><b>Digest by Zapier</b> — 여러 건을 모아 두었다가 정해진 때에 한 번에 내보내기 (일일 요약 메일 등)</li></ul>`,
  claude: {
    role: 'Schedule로 매일 데이터를 모은 뒤 Claude(AI 단계)에게 요약을 맡기면 “아침 브리핑” 자동화가 완성돼요.',
    prompts: [{ tag: '요약 단계 프롬프트', text: '아래는 어제 들어온 상담 문의 목록이야. 원장이 1분 안에 읽을 수 있게\n1) 총 건수 2) 과정별 건수 3) 오늘 바로 연락해야 할 문의 3건(이유 포함)\n으로 요약해 줘.\n\n{{Digest 출력}}' }]
  },
  steps: [
    { t: '매주 월요일 9시 보고', g: '“매주 월요일 오전 9시에 지난주 상담 현황 보고”가 되도록 Schedule 트리거를 설정하세요.', type: 'config',
      fields: [{ l: 'Trigger event', o: ['Every Hour', 'Every Day', 'Every Week', 'Every Month'], a: 'Every Week' }, { l: 'Day of the Week', o: ['Monday', 'Tuesday', 'Friday', 'Sunday'], a: 'Monday' }, { l: 'Time of Day', o: ['12am', '6am', '9am', '6pm'], a: '9am' }],
      hint: '주 단위 → Every Week, 월요일 → Monday, 오전 9시 → 9am' },
    { t: '수업 하루 전 리마인더', g: '수업 등록(트리거) 후 <b>수업 시작 24시간 전</b>에 리마인더 문자를 보내려면 어떤 Delay를 쓸까요?', type: 'choice',
      options: [{ ic: '📍', l: 'Delay Until', d: '특정 날짜·시각까지 기다림 (예: 수업시각 - 1일)' }, { ic: '⏱️', l: 'Delay For', d: '정해진 시간만큼 기다림' }, { ic: '🚶', l: 'Delay After Queue', d: '앞선 실행이 끝날 때까지 줄 서기' }],
      answer: 0, why: ['', 'Delay For는 “등록 후 N시간”이라 수업 날짜마다 기다릴 시간이 달라져요.', '줄 서기는 동시에 몰리는 실행을 순서대로 처리할 때 써요.'], hint: '목표 시각이 정해져 있다면 Until!' },
    { t: '하루치 모아 보내기', g: '상담 문의가 올 때마다 알림이 오면 정신없어요. <b>하루치를 모아 오후 6시에 한 번</b> 보내려면?', type: 'choice',
      options: [{ ic: '📦', l: 'Digest by Zapier', d: '모았다가 정해진 때 방출' }, { ic: '🚦', l: 'Filter by Zapier', d: '' }, { ic: '🔤', l: 'Formatter by Zapier', d: '' }],
      answer: 0, why: ['', 'Filter는 통과/정지만 결정해요.', 'Formatter는 모양만 바꿔요.'], hint: 'Digest = 요약본·다이제스트' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm7', ch: 'c3', emoji: '🪝', title: 'Webhooks: 어떤 서비스든 연결', time: '10분',
  sum: 'Catch Hook URL로 데이터를 받고, JSON 구조를 이해합니다.',
  concept: `<p>Zapier에 없는 앱이나 내가 만든 사이트(예: GitHub Pages 학습 사이트)도 <b>Webhooks by Zapier</b>로 연결할 수 있어요.</p>
  <ul><li><b>Catch Hook</b>(트리거) — Zapier가 고유 URL을 만들어 주고, 그 URL로 데이터가 들어오면 Zap 출발</li>
  <li><b>POST / GET / PUT / Custom Request</b>(액션) — Zap에서 다른 서비스로 데이터를 보내거나 받아 옴</li>
  <li>데이터는 보통 <b>JSON</b> 형식: <code>{"name": "김민지", "score": 92}</code></li></ul>`,
  claude: {
    role: '내 사이트에 “퀴즈 점수를 Zapier로 보내는 코드”가 필요할 때, Claude에게 웹훅 URL과 원하는 필드를 알려 주면 fetch 코드를 바로 써 줘요.',
    prompts: [{ tag: '웹훅 전송 코드 요청', text: '내 GitHub Pages 학습 사이트에서 학생이 퀴즈를 끝내면 Zapier Catch Hook URL로 이름, 단원, 점수를 JSON으로 POST하는 JavaScript 코드를 써 줘.\nURL: https://hooks.zapier.com/hooks/catch/000000/xxxxxx/\n실패해도 화면이 멈추지 않게 try/catch로 감싸 줘.' }]
  },
  steps: [
    { t: 'Catch Hook으로 데이터 받기', g: '아래 웹훅 시뮬레이터에서 JSON을 고쳐 <b>name, unit, score</b> 세 필드를 모두 담아 보내 보세요. 형식이 틀리면 Zapier가 받지 못해요!', type: 'lab', lab: 'webhook',
      hint: '{"name": "김민지", "unit": "Unidad 3", "score": 92} 처럼 키는 큰따옴표, 항목 사이엔 쉼표!' },
    { t: '보낼 때는 어떤 메서드?', g: 'Zap에서 다른 서비스로 <b>새 데이터를 만들어 보내는</b> 웹훅 액션으로 가장 일반적인 것은?', type: 'choice',
      options: [{ ic: '📤', l: 'POST', d: '새 데이터 전송' }, { ic: '📥', l: 'GET', d: '데이터 가져오기' }, { ic: '♻️', l: 'PUT', d: '기존 데이터 교체' }],
      answer: 0, why: ['', 'GET은 가져올 때 써요.', 'PUT은 이미 있는 데이터를 통째로 바꿀 때 써요.'], hint: '“보낸다” = POST' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm8', ch: 'c3', emoji: '💻', title: 'Code by Zapier + Claude가 짜 준 코드', time: '12분',
  sum: 'Claude에게 코드를 받아 Code 단계에서 직접 실행해 봅니다.',
  concept: `<p>Formatter로 안 되는 변환은 <b>Code by Zapier</b>(JavaScript 또는 Python)로 해결해요. 이전 단계 값은 <code>inputData</code>(Python은 <code>input_data</code>)로 받고, 결과는 <code>output</code>에 객체로 담아 돌려줘요. 돌려준 필드는 다음 단계에서 매핑할 수 있어요.</p>
  <div class="scenario">💡 코딩을 몰라도 괜찮아요. <b>입력 예시와 원하는 출력 예시</b>만 Claude에게 주면 Code 단계용 코드를 써 줘요. 여러분은 붙여넣고 테스트만 하면 됩니다.</div>`,
  claude: {
    role: 'Claude에게 코드를 부탁할 때는 ① Zapier Code 단계용이라는 것 ② inputData의 키 이름 ③ 원하는 output 형태를 꼭 알려 주세요.',
    prompts: [{ tag: 'Code 단계 코드 요청', text: 'Zapier "Code by Zapier"(Run JavaScript) 단계에 넣을 코드를 써 줘.\ninputData.fullName = "kim minji", inputData.phone = "010-1234-5678"\n원하는 output:\n- name: "Kim Minji" (단어 첫 글자 대문자)\n- phoneIntl: "+82-10-1234-5678" (맨 앞 0을 빼고 +82-)\n외부 라이브러리 없이 output 객체로 반환해 줘.' }]
  },
  steps: [
    { t: '코드 실행해 보기', g: '왼쪽은 이전 단계에서 들어온 <b>inputData</b>예요. 코드를 직접 쓰거나 <b>“✻ Claude가 써 준 코드 붙여넣기”</b>를 눌러 실행하세요. output이 목표와 같으면 통과!', type: 'lab', lab: 'code',
      hint: '막히면 Claude 코드 붙여넣기 → ▶ Run을 누르세요. 그다음 코드를 한 줄씩 읽어 보는 게 진짜 공부예요.' },
    { t: 'AI 코드 검증 습관', g: 'Claude가 써 준 코드를 Zap에 넣기 전에 꼭 해야 할 일은?', type: 'choice',
      options: [{ ic: '🧪', l: 'Zapier에서 샘플 데이터로 Test 해 보고 결과를 확인한다', d: '' }, { ic: '🚀', l: 'AI가 쓴 코드니 바로 Publish 한다', d: '' }],
      answer: 0, why: ['', 'AI 코드도 틀릴 수 있어요. 특히 빈 값(전화번호 없음 등)이 들어올 때를 테스트하세요.'], hint: '테스트 없이 켜지 않기!' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm9', ch: 'c3', emoji: '🔁', title: 'Looping: 목록을 하나씩', time: '8분',
  sum: '여러 개가 묶인 데이터를 하나씩 풀어 반복 실행합니다.',
  concept: `<p>한 번의 신청에 “스페인어, 영어, 프랑스어”처럼 여러 값이 들어오면? <b>Looping by Zapier</b>가 목록을 하나씩 꺼내 그 뒤 단계를 <b>값마다 반복</b> 실행해 줘요.</p>
  <ul><li><b>Create Loop From Text</b> — 쉼표 등 구분자로 나뉜 텍스트를 반복</li><li><b>Create Loop From Line Items</b> — 앱이 주는 목록(라인 아이템)을 반복</li><li>Looping 단계 자체는 Task가 아니지만, <b>루프 안의 액션은 반복 횟수만큼</b> Task를 써요.</li></ul>`,
  claude: {
    role: '루프 안에서 Claude(AI 단계)를 돌리면 항목마다 맞춤 문장을 만들 수 있어요. 단, 반복 횟수만큼 Task가 늘어나니 횟수 제한을 걸어 두세요.',
    prompts: [{ tag: '루프 설계 상담', text: 'Zapier에서 "희망언어: 스페인어, 영어, 프랑스어"처럼 들어온 값을 언어마다 Notion 데이터베이스에 한 줄씩 넣고 싶어. Looping by Zapier 설정값(이벤트, 구분자)과 예상 Task 수를 알려 줘.' }]
  },
  steps: [
    { t: '루프 설정', g: '입력값 <code>스페인어, 영어, 프랑스어</code>를 언어별로 하나씩 Notion에 기록하도록 Looping을 설정하고 실행해 보세요.', type: 'lab', lab: 'loop',
      hint: '텍스트에서 만드니까 Create Loop From Text, 구분자는 쉼표(,)' },
    { t: '루프의 Task', g: '위 루프(3회 반복) 안에 <b>Notion 기록</b> 1개 액션이 있다면, 1번 실행에 쓰는 Task는?', type: 'fill', fields: [{ l: 'Task 수', a: ['3'], ph: '숫자' }],
      hint: 'Looping 자체는 0, 루프 안 액션 1개 × 3회' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm10', ch: 'c4', emoji: '🗂️', title: 'Zapier Tables: 내장 데이터베이스', time: '10분',
  sum: '레코드를 추가·수정하고, 변경이 Zap을 깨우는 모습과 AI 필드를 체험합니다.',
  concept: `<p><b>Zapier Tables</b>는 Zapier 안의 표 형식 데이터베이스예요. 스프레드시트처럼 쓰지만 <b>레코드가 추가·수정되면 바로 Zap을 출발</b>시킬 수 있고, 버튼 필드·AI 필드 같은 자동화 전용 기능이 있어요. 모든 요금제에 포함되며 Tables 단계는 Task를 쓰지 않아요.</p>`,
  claude: {
    role: 'Tables의 AI 필드에 프롬프트를 넣으면 행마다 Claude류 AI가 요약·분류를 채워 줘요. 어떤 열을 만들지 설계를 Claude에게 맡겨 보세요.',
    prompts: [{ tag: '테이블 설계 요청', text: '어학원 상담 관리를 Zapier Tables로 하려고 해. 필요한 필드(이름, 타입, 예시)를 표로 설계해 줘. 상태 필드는 드롭다운으로, AI가 채울 "요약" 필드도 하나 넣어 줘.' }]
  },
  steps: [
    { t: '레코드 다루기', g: '아래 테이블에서 세 가지를 해 보세요: ① 새 레코드 추가 ② 아무 레코드의 상태를 <b>“등록완료”</b>로 바꿔 Zap 깨우기 ③ <b>✻ AI 요약 실행</b>', type: 'lab', lab: 'tables',
      hint: '상태 드롭다운을 “등록완료”로 바꾸면 “Updated Record” 트리거가 동작해요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm11', ch: 'c4', emoji: '🧩', title: 'Zapier Interfaces: 폼과 페이지', time: '10분',
  sum: '컴포넌트를 조립해 상담 신청 폼을 만들고 제출해 봅니다.',
  concept: `<p><b>Zapier Interfaces</b>로 코딩 없이 폼, 고객 포털, 내부용 페이지를 만들 수 있어요. 폼 제출은 바로 Tables에 저장되거나 Zap을 출발시켜요. 크리에이터링크 같은 홈페이지에 링크로 연결해 쓸 수도 있어요.</p>`,
  claude: {
    role: '폼 질문 문구, 드롭다운 선택지, 제출 후 안내 문구를 Claude에게 맡기면 빠르게 완성돼요.',
    prompts: [{ tag: '폼 문구 요청', text: '어학원 상담 신청 폼에 들어갈 항목을 만들어 줘. 각 항목의 라벨, 입력 타입(텍스트/이메일/드롭다운/긴 글), 필수 여부, 드롭다운 선택지를 표로. 제출 후 감사 문구도 2문장으로.' }]
  },
  steps: [
    { t: '폼 조립하기', g: '왼쪽 팔레트에서 컴포넌트를 눌러 폼을 만드세요. 필요한 것: <b>이름(Text) · 이메일(Email) · 희망과정(Dropdown) · 제출 버튼</b>. 다 넣었으면 미리보기에서 제출해 보세요.', type: 'lab', lab: 'interface',
      hint: '4개를 모두 추가하면 미리보기 아래 “제출”이 활성화돼요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm12', ch: 'c4', emoji: '🤖', title: 'Zapier Chatbots', time: '10분',
  sum: '지식 자료를 넣은 상담 챗봇을 설정하고, 리드 수집까지 시험합니다.',
  concept: `<p><b>Zapier Chatbots</b>는 내 자료(FAQ 문서 등)를 지식으로 넣은 AI 챗봇을 만들어 웹사이트에 붙이는 기능이에요. 대화 중 받은 이메일 같은 정보는 <b>Zap으로 넘겨</b> 시트·CRM에 저장할 수 있어요.</p>
  <ul><li><b>Directive(지시문)</b> — 챗봇의 역할·말투·금지사항</li><li><b>Knowledge source</b> — 답변 근거가 될 자료</li><li><b>Lead capture</b> — 대화 중 연락처를 받아 Zap으로 전달</li></ul>`,
  claude: {
    role: '챗봇 지시문(Directive)은 Claude와 함께 쓰면 좋아요. “모르는 건 모른다고 하고 상담 신청으로 안내”처럼 안전장치를 꼭 넣으세요.',
    prompts: [{ tag: '챗봇 지시문 작성', text: '어학원 홈페이지 상담 챗봇의 지시문을 써 줘.\n- 말투: 친절한 존댓말, 3문장 이내\n- 근거: 첨부한 FAQ에 있는 내용만 답변\n- FAQ에 없거나 수강료 할인 협상은 "상담 신청"으로 안내하고 이메일을 받기\n- 개인정보는 이메일 외에 묻지 않기' }]
  },
  steps: [
    { t: '챗봇 설정 & 대화 테스트', g: '지시문을 쓰고, 지식 자료(FAQ)를 연결한 뒤, 오른쪽 미리보기에서 질문을 <b>2개 이상</b> 해 보세요. “상담 신청”이라고 하면 리드 수집 Zap이 동작해요.', type: 'lab', lab: 'chatbot',
      hint: '지시문 20자 이상 + FAQ 체크 + 질문 2개! 예) “수강료 얼마예요?”, “환불 규정 알려 주세요”' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm13', ch: 'c4', emoji: '🗺️', title: 'Canvas: 업무 흐름 지도', time: '8분',
  sum: '업무 전체를 그림으로 그리고, 자동화할 지점을 표시합니다.',
  concept: `<p><b>Zapier Canvas</b>는 업무 흐름을 도형과 화살표로 그리는 기획 도구예요. 사람이 하는 일, Zap, Table, Interface, Agent를 한 장에 그려서 <b>어디를 자동화할지</b> 먼저 결정해요. Copilot에게 설명하면 다이어그램 초안을 그려 주기도 해요.</p>`,
  claude: {
    role: '자동화를 바로 만들기 전에 Claude와 “현재 업무 흐름 → 병목 → 자동화 후보”를 먼저 정리하면 실패가 줄어요.',
    prompts: [{ tag: '업무 흐름 분석', text: '우리 어학원의 상담→등록 과정이야. 단계별로 걸리는 시간과 병목을 추정하고, Zapier(Interfaces/Tables/Zaps/Agents)로 자동화할 지점을 표시한 흐름도를 텍스트로 그려 줘.\n\n문의 접수 → 원장이 확인 → 레벨테스트 안내 → 일정 조율 → 결제 → 수업 배정' }]
  },
  steps: [
    { t: '흐름도 그리기', g: '팔레트에서 노드를 눌러 흐름을 만드세요. 조건: <b>노드 5개 이상</b>, 그중 <b>Interface · Table · AI 단계</b>가 하나씩 포함. 노드를 눌러 ⚡자동화 표시도 해 보세요(2개 이상).', type: 'lab', lab: 'canvas',
      hint: '“✻ Copilot으로 초안 그리기”를 누르면 예시 흐름이 그려져요. 그다음 ⚡ 표시만 해도 돼요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm14', ch: 'c4', emoji: '🪄', title: 'Copilot: 말로 Zap 만들기', time: '8분',
  sum: '자연어 설명으로 Zap 초안을 만들고, 좋은 설명의 공식을 익힙니다.',
  concept: `<p><b>Zapier Copilot</b>은 Zaps, Canvas, Tables, Interfaces, Agents 곳곳에 들어 있는 AI 도우미예요. “이럴 때 이렇게 해 줘”라고 설명하면 단계를 제안해요. 결과가 좋으려면 설명이 구체적이어야 해요.</p>
  <div class="scenario">📐 <b>좋은 설명 공식</b> = <b>언제</b>(트리거 앱·사건) + <b>조건</b>(어떤 경우만) + <b>무엇을</b>(액션 앱·행동) + <b>어떤 데이터로</b></div>`,
  claude: {
    role: 'Copilot에 넣을 설명이 막연하면, 먼저 Claude에게 다듬어 달라고 하세요. Claude는 빠진 정보(어느 채널? 어떤 시트?)를 되물어 줘요.',
    prompts: [{ tag: 'Copilot용 설명 다듬기', text: '아래 아이디어를 Zapier Copilot에 붙여넣을 한 문단짜리 명확한 자동화 설명으로 바꿔 줘. 트리거 앱/이벤트, 조건, 액션 앱/이벤트, 매핑할 필드를 꼭 포함하고, 빠진 정보가 있으면 먼저 질문해 줘.\n\n아이디어: "상담 오면 정리해서 알려주는 거"' }]
  },
  steps: [
    { t: 'Copilot에게 설명하기', g: '만들고 싶은 자동화를 한국어로 설명하고 <b>생성</b>을 눌러 보세요. 단계가 <b>3개 이상</b>인 Zap 초안이 나오면 통과! (예시 버튼도 있어요)', type: 'lab', lab: 'copilot',
      hint: '예) “구글 폼에 상담이 들어오면 스페인어 문의만 골라 Claude로 요약하고 슬랙으로 알려 줘”' },
    { t: '어느 설명이 더 좋을까?', g: 'Copilot이 더 정확한 Zap을 만들 설명은?', type: 'choice',
      options: [{ ic: '🅰️', l: '“메일 오면 정리해 줘”', d: '' }, { ic: '🅱️', l: '“Gmail에 ‘상담’ 라벨 메일이 오면, 보낸 사람·제목·본문 요약을 Google Sheets ‘상담목록’ 시트에 한 행으로 추가해 줘”', d: '' }],
      answer: 1, why: ['어떤 메일인지, 어디에 무엇을 정리할지 빠져 있어요.', ''], hint: '언제 + 조건 + 무엇을 + 어떤 데이터로' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm15', ch: 'c5', emoji: '✻', title: 'Zap 안에 Claude 넣기 (AI 단계)', time: '12분',
  sum: 'AI by Zapier / Anthropic (Claude) 단계의 프롬프트와 출력 필드를 설계합니다.',
  concept: `<p>Zap 중간에 AI 단계를 넣으면 “생각하는 Zap”이 돼요. 두 가지 방법이 있어요.</p>
  <ul><li><b>AI by Zapier</b> — Zapier 내장 AI 단계. 프롬프트와 <b>출력 필드</b>(예: 카테고리, 긴급도)를 정해 두면 다음 단계에서 그 필드를 바로 매핑할 수 있어요.</li>
  <li><b>Anthropic (Claude) 앱</b> — <i>Send Message</i> 액션으로 Claude에게 직접 메시지를 보내요. User Message, System, Model, Memory Key 같은 칸이 있고 Anthropic 계정(API) 연결이 필요해요.</li></ul>
  <div class="scenario">🔑 핵심: 프롬프트에 <b>이전 단계 데이터(예: {{문의내용}})를 꼭 매핑</b>하고, 답을 <b>정해진 형식</b>으로 받으세요. 그래야 다음 단계(Paths 등)에서 쓸 수 있어요.</div>`,
  claude: {
    role: 'AI 단계의 프롬프트는 “사람에게 일을 맡기는 지시서”처럼 쓰세요: 역할 → 입력 데이터 → 할 일 → 출력 형식 → 예외 처리.',
    prompts: [{ tag: 'AI 단계 프롬프트 템플릿', text: '너는 어학원 상담 매니저야.\n아래 문의를 읽고 정해진 형식으로만 답해.\n\n[문의]\n이름: {{이름}}\n희망과정: {{희망과정}}\n내용: {{문의내용}}\n\n[출력]\n카테고리: 수강문의 / 환불·불만 / 기타 중 하나\n긴급도: 높음 / 보통 / 낮음 중 하나\n답장초안: 2문장, 존댓말' }]
  },
  steps: [
    { t: '어떤 앱을 쓸까?', g: '내 Anthropic API 계정으로 <b>Claude 모델을 직접 지정</b>해 메시지를 보내고 싶어요. 어떤 액션을 고를까요?', type: 'lab', lab: 'appPick',
      p: { role: 'action', app: 'Anthropic (Claude)', event: 'Send Message' }, hint: 'Anthropic (Claude) 앱의 Send Message!' },
    { t: '프롬프트 실험실', g: '프롬프트를 작성하고 출력 필드를 정한 뒤 <b>3건의 문의에 실행</b>해 보세요. 좋은 결과의 조건: ① <b>{{문의내용}}</b> 매핑 ② 출력 필드 <b>2개 이상</b> ③ 카테고리 선택지를 프롬프트에 명시', type: 'lab', lab: 'prompt',
      hint: '변수 칩을 눌러 {{문의내용}}을 넣고, 출력 필드에 “카테고리”, “긴급도”를 추가하세요. 프롬프트에 “수강문의 / 환불·불만 / 기타”를 써 주면 완벽!' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm16', ch: 'c5', emoji: '🕵️', title: 'Zapier Agents + 사람 승인', time: '12분',
  sum: '스스로 판단하는 AI 에이전트를 최소 권한으로 설정하고, 사람 승인 흐름을 체험합니다.',
  concept: `<p><b>Zapier Agents</b>는 지시문과 도구(앱 액션)를 받아 <b>스스로 순서를 정해 일하는 AI 팀원</b>이에요. 채팅으로 부르거나 Zap 트리거로 깨울 수 있고, 활동 기록이 남아요.</p>
  <ul><li>🔒 <b>최소 권한</b> — 꼭 필요한 도구만 주기 (예: 메일 “초안”은 OK, “발송”은 사람 승인 후)</li><li>🙋 <b>Human-in-the-loop</b> — 중요한 행동 전에 사람의 승인을 받는 장치</li></ul>`,
  claude: {
    role: '에이전트 지시문을 Claude에게 검토받으세요. “이 지시문으로 생길 수 있는 사고 시나리오 5가지와 막는 방법”을 물으면 위험한 권한을 찾아 줘요.',
    prompts: [{ tag: '에이전트 지시문 점검', text: '아래 Zapier Agent 지시문과 도구 목록을 검토해 줘. 잘못 동작할 수 있는 시나리오 5가지와, 지시문·권한을 어떻게 바꾸면 막을 수 있는지 알려 줘.\n\n지시문: 새 상담 메일이 오면 답장을 보내고 시트에 기록해.\n도구: Gmail(Send Email, Delete Email), Google Sheets(Create Row)' }]
  },
  steps: [
    { t: '에이전트 만들기', g: '상담 메일 응대 에이전트를 설정하세요. 조건: 지시문 30자 이상, <b>Gmail 초안 작성</b> 도구 포함, <b>삭제</b> 도구 제외, <b>메일 발송은 끄거나 사람 승인 켜기</b>. 그다음 ▶ 테스트 실행!', type: 'lab', lab: 'agent',
      hint: '“메일 보내기” 도구를 빼거나, “보내기 전 사람 승인”을 켜세요. 삭제 도구는 꼭 꺼야 해요.' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm17', ch: 'c5', emoji: '🔌', title: 'Zapier MCP: Claude에게 손발 달기', time: '15분',
  sum: 'MCP 서버를 만들고, 권한을 제한하고, Claude 채팅에서 실제 앱을 움직여 봅니다.',
  concept: `<p><b>Zapier MCP</b>는 Claude 같은 AI가 Zapier에 연결된 수천 개 앱의 액션을 <b>도구(tool)</b>로 쓸 수 있게 해 주는 통로예요. Claude 채팅에서 “내일 오후 3시 레벨테스트 일정 잡아 줘”라고 하면 Claude가 Google Calendar 도구를 호출해 실제로 일정을 만들어요.</p>
  <ul><li>설정: <code>mcp.zapier.com</code> → <b>+ New MCP Server</b> → 클라이언트로 <b>Claude</b> 선택 → <b>+ Add tool</b>로 앱·액션 고르기 → 계정 연결 → <b>Connect</b>로 Claude에 추가</li>
  <li>안전: 앱·액션 단위로 허용 범위를 정해요 (예: 초안은 OK, 발송·삭제는 NO). 언제든 권한 회수 가능, OAuth라 API 키를 붙여넣지 않아요.</li>
  <li>비용: 성공한 도구 호출 <b>1번 = 2 Task</b> (실패한 호출은 0)</li>
  <li>Claude Code 사용자는 터미널에서 <code>claude mcp add --transport http "Zapier-MCP" https://mcp.zapier.com/api/v1/connect</code> 형태로 추가할 수 있어요.</li></ul>`,
  claude: {
    role: 'MCP가 연결되면 Claude에게 “일”을 말로 시키면 돼요. 단, 실제 앱이 움직이므로 처음엔 “실행 전에 무엇을 할지 먼저 보여 줘”라고 요청하는 습관을 들이세요.',
    prompts: [
      { tag: '안전한 MCP 요청 습관', text: 'Zapier 도구를 써서 다음 일을 해 줘. 단, 실제로 실행하기 전에 어떤 도구를 어떤 값으로 호출할지 먼저 목록으로 보여 주고 내 확인을 받아.\n\n1) 내일 오후 3시 김민지님 레벨테스트 일정을 캘린더에 30분으로 등록\n2) 김민지님께 일정 안내 메일 "초안" 작성 (발송하지 말 것)' }
    ]
  },
  steps: [
    { t: 'MCP 서버 설정 순서', g: 'Zapier MCP를 Claude에 연결하는 순서대로 눌러 보세요.', type: 'sequence',
      items: ['mcp.zapier.com 대시보드에 접속', '+ New MCP Server를 누르고 클라이언트로 Claude 선택', '+ Add tool에서 앱을 검색하고 쓸 액션 선택', '앱 계정 연결(OAuth) 후 액션별 Configure 저장', '상단 Connect를 눌러 안내대로 Claude 계정에 서버 추가'],
      hint: '서버 만들기 → 도구 고르기 → 계정 연결 → Claude에 붙이기' },
    { t: '권한 범위 정하기', g: '상황: “Claude가 메일 <b>검색과 초안 작성</b>, 캘린더 <b>일정 조회·생성</b>은 해도 되지만, 메일 <b>발송과 삭제</b>는 절대 안 됨.” 알맞게 켜고 끄세요.', type: 'lab', lab: 'mcpScope',
      hint: 'Send Email, Delete Email만 끄고 나머지 4개는 켜요.' },
    { t: 'Claude 채팅에서 Zapier 쓰기', g: '아래는 Zapier MCP가 연결된 Claude 채팅 시뮬레이터예요. 추천 요청을 눌러 <b>2번 이상</b> 일을 시켜 보고, 도구 호출과 Task 사용량을 관찰하세요.', type: 'lab', lab: 'mcpChat',
      hint: '도구 호출 카드(🔧)가 실제로 Zapier를 거쳐 앱을 움직이는 부분이에요.' },
    { t: 'MCP Task 계산', g: 'Claude가 한 번의 요청을 처리하면서 <b>도구 호출 3번이 성공</b>하고 <b>1번은 실패</b>했어요. 사용한 Task는?', type: 'fill', fields: [{ l: 'Task 수', a: ['6'], ph: '숫자' }],
      hint: '성공 1번 = 2 Task, 실패는 0' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm18', ch: 'c5', emoji: '🚀', title: 'Next Gen Zaps: Claude가 만들고 배포', time: '12분',
  sum: 'Claude 채팅에서 설계한 워크플로를 Zap으로 배포하고, 버전 관리까지 체험합니다.',
  concept: `<p><b>Next Gen Zaps</b>(2026년 얼리 액세스)는 Claude 같은 MCP 클라이언트에서 말로 설계한 워크플로를 <b>Zapier에 배포해 노트북을 덮어도 계속 돌아가게</b> 하는 새 방식이에요.</p>
  <ul><li>Zapier MCP만으로는 “내가 시킬 때” 실행 → Next Gen Zaps는 배포 후 <b>스스로 계속</b> 실행</li>
  <li>편집기·코드·AI 어느 쪽으로 만들어도 같은 워크플로로 모이고, 루프·여러 Path 같은 고급 로직 지원</li>
  <li><b>Workflow Manager</b>에서 단계별 실행 상태를 보고, 에이전트가 고친 내용은 <b>새 버전</b>으로 기록돼 무엇이 바뀌었는지 확인 가능</li>
  <li>💰 Zapier 안내에 따르면 얼리 액세스 동안은 무료이고 <b>2026년 12월 1일부터 Task 과금</b>이 시작돼요. 실제 사용 전 최신 안내를 꼭 확인하세요.</li></ul>`,
  claude: {
    role: 'Claude에게 “설계 → 확인 → 배포”를 나눠서 시키세요. 배포 전 계획을 보여 달라고 하면 실수를 줄일 수 있어요.',
    prompts: [{ tag: '워크플로 설계·배포 요청', text: 'Zapier로 다음 워크플로를 설계해 줘. 바로 배포하지 말고 먼저 단계 목록(트리거, 각 액션, 조건, 예상 Task 수)을 보여 줘. 내가 승인하면 Next Gen Zap으로 배포해 줘.\n\n"매일 아침 8시에 지난 24시간 상담 문의(Zapier Tables)를 Claude가 요약해서 Slack #원장실에 올리기"' }]
  },
  steps: [
    { t: '설계 → 승인 → 배포 → 자동 수리', g: 'Claude 채팅으로 워크플로를 만들고 배포해 보세요. 배포 후 생기는 문제를 에이전트가 고치면, 바뀐 내용을 검토하고 승인해야 해요.', type: 'lab', lab: 'nextgen',
      hint: '버튼을 순서대로 누르면 돼요. 마지막 “변경 내용 검토”가 핵심!' },
    { t: 'MCP 단독 vs Next Gen Zaps', g: '“매일 아침 8시에 <b>내가 없어도</b> 요약이 올라와야 한다.” 무엇이 필요할까요?', type: 'choice',
      options: [{ ic: '🚀', l: 'Next Gen Zap(또는 일반 Zap)으로 배포', d: '스스로 정해진 시간에 실행' }, { ic: '💬', l: 'Zapier MCP만 연결해 두고 매일 아침 Claude에게 요청', d: '' }],
      answer: 0, why: ['', 'MCP 단독은 내가 Claude에게 말할 때만 움직여요.'], hint: '“내가 없어도” = 배포된 Zap' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm19', ch: 'c6', emoji: '🛠️', title: '운영의 기술: Sub-Zap·Storage·버전·오류 처리', time: '8분',
  sum: '자동화가 많아질 때 필요한 관리 기능을 정리합니다.',
  concept: `<ul><li><b>Sub-Zap</b> — 여러 Zap에서 반복되는 단계를 따로 떼어 재사용 (Zap은 최대 100단계, 넘치면 Sub-Zap으로 분리)</li>
  <li><b>Storage by Zapier</b> — 실행과 실행 사이에 작은 값(카운터, 마지막 처리 번호 등)을 저장</li>
  <li><b>Versions</b> — Zap을 고칠 때마다 버전이 남아 이전 상태로 되돌릴 수 있음</li>
  <li><b>Error handler(오류 처리 경로)</b> — 특정 단계가 실패하면 대신 실행할 경로 (예: 실패 시 관리자에게 알림)</li>
  <li><b>Folders & 공유</b> — Zap을 폴더로 정리하고 팀원과 공유</li></ul>`,
  claude: {
    role: 'Zap이 10개를 넘으면 Claude에게 목록을 주고 “중복 단계, Sub-Zap 후보, 이름 규칙”을 정리해 달라고 하세요.',
    prompts: [{ tag: 'Zap 정리 컨설팅', text: '내 Zap 목록과 단계야. 중복되는 단계를 Sub-Zap으로 묶을 후보, Task를 줄일 방법(필터 위치 등), Zap 이름 짓는 규칙과 폴더 구조를 제안해 줘.\n\n(Zap 목록 붙여넣기)' }]
  },
  steps: [
    { t: '기능 짝 맞추기', g: '상황에 맞는 기능을 연결하세요.', type: 'pairs',
      pairs: [['Sub-Zap', '여러 Zap이 똑같이 쓰는 “학생 정보 정리” 단계를 한 곳에서 관리'], ['Storage by Zapier', '“오늘 몇 번째 문의인지” 숫자를 실행마다 1씩 올리며 기억'], ['Versions', '어제 고친 뒤로 이상해진 Zap을 이전 상태로 되돌리기'], ['Error handler', 'Slack 전송이 실패하면 대신 원장에게 문자 보내기']],
      hint: '재사용=Sub-Zap, 기억=Storage, 되돌리기=Versions, 실패 대비=Error handler' }
  ]
},
/* ------------------------------------------------------------------ */
{
  id: 'm20', ch: 'c6', emoji: '🏆', title: '최종 프로젝트: 상담 자동화 시스템', time: '15분',
  sum: '지금까지 배운 기능을 조합해 어학원 상담 자동화 시스템을 완성합니다.',
  concept: `<p>마지막 미션! 홈페이지 상담 신청부터 원장 보고까지 <b>전 과정을 Zapier 플랫폼 + Claude</b>로 설계해 보세요. 각 단계에 가장 알맞은 도구를 고르면, 실제 문의 한 건이 시스템을 통과하는 모습을 볼 수 있어요.</p>`,
  claude: {
    role: '실전에서는 이 설계도를 Claude에게 그대로 주고 “빠진 예외 처리와 예상 월 Task 수”를 계산해 달라고 하세요.',
    prompts: [{ tag: '시스템 검토 요청', text: '아래 Zapier 상담 자동화 설계를 검토해 줘.\n1) 실패할 수 있는 지점과 예외 처리 방법\n2) 하루 문의 20건 기준 예상 월 Task 수(계산 과정 포함)\n3) 개인정보 보호 관점에서 주의할 점\n\n(설계도 붙여넣기)' }]
  },
  steps: [
    { t: '시스템 조립', g: '8개 단계 각각에 알맞은 도구를 고르고 <b>▶ 시스템 가동</b>을 누르세요.', type: 'lab', lab: 'capstone',
      hint: '접수=Interfaces, 저장=Tables, 분석=AI(Claude), 분기=Paths, 알림=Slack, 답장=Gmail 초안, 검토=사람 승인, 보고=Schedule+AI' }
  ]
}
];

/* 배지 */
const BADGES = [
  { id: 'b1', ic: '⚡', n: '첫 Zap', need: ['m1'] },
  { id: 'b2', ic: '🧮', n: 'Task 회계사', need: ['m2'] },
  { id: 'b3', ic: '🧠', n: '로직 마스터', need: ['m3', 'm4', 'm5', 'm6'] },
  { id: 'b4', ic: '🛠️', n: '개발자 도구', need: ['m7', 'm8', 'm9'] },
  { id: 'b5', ic: '🏗️', n: '플랫폼 빌더', need: ['m10', 'm11', 'm12', 'm13', 'm14'] },
  { id: 'b6', ic: '✻', n: 'Claude 협업가', need: ['m15', 'm16', 'm17', 'm18'] },
  { id: 'b7', ic: '🏆', n: '자동화 아키텍트', need: ['m20'] }
];

const GLOSSARY = [
  ['Zap', '트리거 1개 + 액션 여러 개로 이뤄진 자동화 워크플로'],
  ['Trigger', 'Zap을 출발시키는 사건. Instant(앱이 즉시 알려 줌)와 Polling(Zapier가 주기적으로 확인) 방식이 있음'],
  ['Action', '트리거 뒤에 실행되는 작업. Search 액션은 데이터를 찾기만 함'],
  ['Task', '성공한 액션 실행 1회. 요금 계산 단위'],
  ['Step', 'Zap 안의 한 단계(트리거, 액션, 필터 등). Zap 하나에 최대 100단계'],
  ['Field mapping', '이전 단계 데이터를 다음 단계의 입력 칸에 연결하는 것'],
  ['Zap History', 'Zap 실행 기록. 성공·필터됨·오류·중단 상태와 Replay 제공'],
  ['Autoreplay', '실패한 단계를 자동으로 다시 시도하는 설정'],
  ['Filter', '조건을 만족할 때만 다음 단계로 진행'],
  ['Paths', '조건에 따라 여러 갈래로 분기'],
  ['Formatter', '텍스트·숫자·날짜를 다듬는 내장 도구 (Task 아님)'],
  ['Delay', '기다렸다가 다음 단계 실행 (For / Until / After Queue)'],
  ['Digest', '여러 건을 모았다가 한 번에 내보내기'],
  ['Schedule', '정해진 주기에 Zap을 출발시키는 트리거'],
  ['Webhook', 'URL로 데이터를 주고받는 방식. Catch Hook으로 받고 POST 등으로 보냄'],
  ['Code by Zapier', 'JavaScript/Python 코드 단계. inputData로 받고 output으로 반환'],
  ['Looping', '목록의 항목마다 뒤 단계를 반복 실행'],
  ['Sub-Zap', '여러 Zap에서 재사용하는 단계 묶음'],
  ['Storage', '실행 사이에 작은 값을 저장'],
  ['Tables', 'Zapier 내장 데이터베이스'],
  ['Interfaces', '코드 없이 만드는 폼·페이지·포털'],
  ['Chatbots', '내 자료를 아는 AI 챗봇, 웹사이트에 삽입 가능'],
  ['Canvas', '업무 흐름을 그리는 기획용 다이어그램 도구'],
  ['Copilot', 'Zapier 곳곳에 있는 AI 빌드 도우미'],
  ['Agents', '지시문과 도구를 받아 스스로 일하는 AI 팀원'],
  ['Human-in-the-loop', 'AI의 중요한 행동 전에 사람 승인을 받는 장치'],
  ['AI by Zapier', 'Zap 안의 내장 AI 단계. 프롬프트와 출력 필드 설정'],
  ['Anthropic (Claude) 앱', 'Zapier의 Claude 연동 앱. Send Message 액션 등'],
  ['MCP', 'Model Context Protocol. AI가 외부 도구를 쓰는 표준 통로'],
  ['Zapier MCP', 'Claude 등 AI가 Zapier의 앱 액션을 도구로 쓰게 해 주는 MCP 서버'],
  ['Next Gen Zaps', 'AI 클라이언트에서 설계해 배포할 수 있는 새 Zap 방식 (2026년 얼리 액세스)'],
  ['OAuth', '비밀번호를 넘기지 않고 공식 로그인 창에서 권한만 허용하는 연결 방식']
];
