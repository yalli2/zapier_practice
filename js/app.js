/* =========================================================
   Zap 연습장 — 앱 엔진 (라우팅, 진행도, 위젯, 도우미)
   ========================================================= */
const KEY = 'zap_practice_v1';
let S = { xp: 0, prog: {}, done: {} };
try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) S = Object.assign(S, saved); } catch (e) { }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };

const $ = s => document.querySelector(s);
const main = $('#main');
let current = null;      // 현재 미션
let openDone = {};       // 완료된 단계 다시 열기

/* ---------- 공용 ---------- */
function toast(t) { const el = $('#toast'); el.innerHTML = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2200); }
const COPY = [];
function copyBtn(text) { COPY.push(text); return `<button class="copy" data-copy="${COPY.length - 1}">복사</button>`; }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  const t = COPY[+b.dataset.copy];
  const ok = () => { b.textContent = '복사됨 ✓'; setTimeout(() => b.textContent = '복사', 1400); };
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, () => fallbackCopy(t, ok)); else fallbackCopy(t, ok);
});
function fallbackCopy(t, ok) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) { } ta.remove(); }

function promptHTML(p) { return `<div class="prompt">${copyBtn(p.text)}<span class="tag">✻ ${esc(p.tag)}</span>${esc(p.text)}</div>`; }

/* ---------- XP / 진행 ---------- */
function updateHUD() {
  const lv = Math.floor(S.xp / 100) + 1;
  $('#lvBadge').textContent = 'Lv.' + lv;
  $('#xpFill').style.width = (S.xp % 100) + '%';
  $('#xpText').textContent = S.xp + ' XP';
  const n = MISSIONS.filter(m => S.done[m.id]).length, pct = Math.round(n / MISSIONS.length * 100);
  $('#doneCount').textContent = `${n} / ${MISSIONS.length}`;
  $('#ring').style.background = `conic-gradient(var(--zap) ${pct}%, var(--line2) ${pct}%)`;
  $('#ringText').textContent = pct + '%';
}
function renderNav() {
  const nav = $('#missionNav'); nav.innerHTML = '';
  CHAPTERS.forEach(c => {
    nav.insertAdjacentHTML('beforeend', `<div class="chap">${c.name}</div>`);
    MISSIONS.filter(m => m.ch === c.id).forEach(m => {
      const n = MISSIONS.indexOf(m);
      nav.insertAdjacentHTML('beforeend', `<button class="mnav ${S.done[m.id] ? 'done' : ''} ${current && current.id === m.id ? 'on' : ''}" data-go="${m.id}"><span class="st">${S.done[m.id] ? '✓' : m.emoji}</span><span>${n}. ${esc(m.title)}</span></button>`);
    });
  });
}
function badgeState() { return BADGES.map(b => ({ ...b, on: b.need.every(id => S.done[id]) })); }

/* ---------- 라우터 ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-go]'); if (!a) return;
  e.preventDefault(); location.hash = a.dataset.go; $('#sidebar').classList.remove('open');
});
window.addEventListener('hashchange', route);
$('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');
$('#resetBtn').onclick = () => { if (confirm('모든 진행 상황과 XP를 초기화할까요?')) { S = { xp: 0, prog: {}, done: {} }; save(); updateHUD(); route(); } };

function route() {
  const id = (location.hash || '#home').slice(1);
  document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('on', a.dataset.go === id));
  const m = MISSIONS.find(x => x.id === id);
  current = m || null; openDone = {};
  if (m) renderMission(m);
  else if (id === 'prompts') renderPrompts();
  else if (id === 'glossary') renderGlossary();
  else if (id === 'facts') renderFacts();
  else renderHome();
  renderNav(); updateHUD(); refreshHelper();
  window.scrollTo(0, 0);
}

/* ---------- 홈 ---------- */
function renderHome() {
  const next = MISSIONS.find(m => !S.done[m.id]) || MISSIONS[0];
  main.innerHTML = `<section class="hero">
    <span class="pill claude">✻ Claude × ⚡ Zapier</span>
    <h1>따라 하며 배우는<br>Zapier 자동화 퀘스트</h1>
    <p class="lead">21개의 미션을 하나씩 클리어하면서 Zapier의 모든 핵심 기능을 직접 만져 보고, <b>Claude와 어떻게 손발을 맞추는지</b> 체험해요. 실제 계정 없이도 안전하게 연습할 수 있는 시뮬레이터입니다.</p>
    <div class="hero-flow"><span class="node">📝 상담 신청</span><span class="arr">→</span><span class="node z">⚡ Zapier가 옮기고</span><span class="arr">→</span><span class="node c">✻ Claude가 판단하고</span><span class="arr">→</span><span class="node z">⚡ Zapier가 실행</span><span class="arr">→</span><span class="node">🙋 사람은 승인만</span></div>
    <button class="btn" data-go="${next.id}">${MISSIONS.every(m => S.done[m.id]) ? '처음부터 복습하기' : Object.keys(S.done).length ? '이어서 하기' : '첫 미션 시작'} → ${next.emoji} ${esc(next.title)}</button>
  </section>
  <h2>Claude와 Zapier가 협업하는 3가지 방식</h2>
  <div class="grid3 modes" style="margin-bottom:24px">
    <div class="mode"><div class="n">①</div><h3>Zap 안에 Claude</h3><p class="muted">AI by Zapier, Anthropic (Claude) 앱으로 Zap 중간에서 요약·분류·글쓰기</p><span class="pill">미션 15</span></div>
    <div class="mode"><div class="n">②</div><h3>Claude 안에 Zapier</h3><p class="muted">Zapier MCP로 Claude 채팅에서 9,000+ 앱을 직접 움직이기</p><span class="pill">미션 17·18</span></div>
    <div class="mode"><div class="n">③</div><h3>Claude가 설계자</h3><p class="muted">Zap 구조, 필터 조건, 코드, 프롬프트, 에이전트 지시문을 Claude와 함께 만들기</p><span class="pill">모든 미션의 ✻ 박스</span></div>
  </div>
  <div class="card"><h2>사용법</h2><ul style="margin:0;padding-left:20px">
    <li>왼쪽 목록에서 미션을 고르고, <b>개념 → Claude 협업 팁 → 실습 단계</b> 순서로 진행해요.</li>
    <li>막히면 단계마다 있는 <b>✻ 힌트</b> 버튼이나 오른쪽 아래 <b>Claude 도우미</b>를 눌러 보세요.</li>
    <li>✻ 프롬프트 상자의 <b>복사</b> 버튼으로 실제 Claude에 바로 붙여넣어 쓸 수 있어요. 모아 보기는 <a href="#prompts" data-go="prompts">프롬프트 도서관</a>.</li>
    <li>단계마다 10 XP, 미션 완료 시 30 XP. 진행 상황은 이 브라우저에 저장돼요.</li></ul></div>
  <div class="card"><h2>배지</h2><div class="badges">${badgeState().map(b => `<span class="badge ${b.on ? '' : 'off'}">${b.ic} ${b.n}</span>`).join('')}</div></div>
  <p class="disclaimer">이 사이트는 학습용 시뮬레이터이며 Zapier 또는 Anthropic의 공식 사이트가 아닙니다. 화면 속 메뉴·이벤트 이름은 2026년 11월 기준 공식 문서를 참고했으며, 실제 화면과 요금 정책은 바뀔 수 있어요. 예시의 이름·이메일·금액은 모두 가상 데이터입니다.</p>`;
}

/* ---------- 미션 ---------- */
function renderMission(m) {
  const idx = MISSIONS.indexOf(m);
  const prog = S.prog[m.id] || 0;
  const ch = CHAPTERS.find(c => c.id === m.ch);
  main.innerHTML = `<div class="m-head"><div class="m-emoji">${m.emoji}</div><div>
      <div class="m-meta"><span class="pill">${ch.name}</span><span class="pill zap">미션 ${idx}</span><span class="pill">⏱ ${m.time}</span>${S.done[m.id] ? '<span class="pill ok">✓ 완료</span>' : ''}</div>
      <h1>${esc(m.title)}</h1><p class="lead" style="margin:0">${esc(m.sum)}</p></div></div>
    <div class="card concept"><h2>📘 개념 잡기</h2>${m.concept}</div>
    <div class="claude-box"><h3><span class="claude-dot">✻</span> Claude와 협업하기</h3><p style="margin:0">${m.claude.role}</p>${m.claude.prompts.map(promptHTML).join('')}</div>
    <h2 style="margin-top:26px">🛠️ 실습 <span class="muted" style="font-size:15px;font-weight:500">${Math.min(prog, m.steps.length)} / ${m.steps.length} 단계</span></h2>
    <div class="steps" id="steps"></div><div id="endbox"></div>`;
  const wrap = $('#steps');
  m.steps.forEach((st, i) => {
    const state = i < prog ? 'done' : i === prog ? 'active' : 'locked';
    const el = h(`<div class="step ${state}"><div class="step-h"><span class="step-n">${state === 'done' ? '✓' : i + 1}</span><span class="step-t">${esc(st.t)}</span>
      ${state !== 'locked' ? `<button class="hint-btn">✻ 힌트</button>` : '<span class="muted" style="margin-left:auto;font-size:13px">🔒</span>'}</div></div>`);
    wrap.appendChild(el);
    if (state === 'locked') return;
    el.querySelector('.hint-btn').onclick = e => { e.stopPropagation(); showHint(m, st); };
    const body = () => {
      const b = h(`<div class="step-b"><div class="step-guide">${st.g}</div><div class="w"></div><div class="fb"></div></div>`);
      el.appendChild(b);
      const fbEl = b.querySelector('.fb');
      const fb = (msg, kind) => { fbEl.className = 'fb show ' + kind; fbEl.innerHTML = msg; if (kind === 'bad') { b.querySelector('.w').classList.add('shake'); setTimeout(() => b.querySelector('.w').classList.remove('shake'), 400); } };
      let fired = false;
      const done = () => { if (fired) return; fired = true; if (state === 'active') completeStep(m, i); else toast('🔁 복습 완료!'); };
      renderWidget(b.querySelector('.w'), st, done, fb);
    };
    if (state === 'active') body();
    else {
      el.querySelector('.step-h').style.cursor = 'pointer';
      el.querySelector('.step-h').title = '눌러서 다시 해 보기';
      el.querySelector('.step-h').onclick = () => { const ex = el.querySelector('.step-b'); if (ex) ex.remove(); else body(); };
    }
  });
  if (prog >= m.steps.length) renderEnd(m);
}

function completeStep(m, i) {
  S.prog[m.id] = Math.max(S.prog[m.id] || 0, i + 1);
  S.xp += 10; save(); updateHUD(); toast('+10 XP ⚡');
  const last = S.prog[m.id] >= m.steps.length;
  if (last && !S.done[m.id]) {
    const before = badgeState().filter(b => b.on).map(b => b.id);
    S.done[m.id] = true; S.xp += 30; save();
    const newB = badgeState().filter(b => b.on && !before.includes(b.id));
    setTimeout(() => { confetti(); toast(newB.length ? `🎖️ 새 배지: ${newB.map(b => b.ic + ' ' + b.n).join(', ')}` : '🎉 미션 완료! +30 XP'); }, 900);
  }
  setTimeout(() => {
    if (current !== m) return;
    const y = window.scrollY; renderMission(m); renderNav(); updateHUD(); refreshHelper(); window.scrollTo(0, y);
    const act = document.querySelector('.step.active') || $('#endbox');
    if (act) act.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1300);
}

function renderEnd(m) {
  const idx = MISSIONS.indexOf(m), next = MISSIONS[idx + 1];
  $('#endbox').innerHTML = `<div class="complete"><div class="big">${idx === MISSIONS.length - 1 ? '🏆' : '🎉'}</div><h2>미션 완료!</h2>
    <p class="muted">완료한 단계 제목을 누르면 언제든 다시 연습할 수 있어요.</p>
    <div class="badges" style="justify-content:center">${badgeState().filter(b => b.need.includes(m.id)).map(b => `<span class="badge ${b.on ? '' : 'off'}">${b.ic} ${b.n}</span>`).join('')}</div>
    <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${next ? `<button class="btn" data-go="${next.id}">다음 미션 → ${next.emoji} ${esc(next.title)}</button>` : `<button class="btn" data-go="home">홈으로</button>`}<button class="btn ghost" data-go="prompts">✻ 프롬프트 도서관</button></div></div>`;
}

/* ---------- 위젯 ---------- */
function renderWidget(w, st, done, fb) {
  if (st.type === 'lab') return LABS[st.lab](w, st.p || {}, done, fb);
  if (st.type === 'choice') {
    w.innerHTML = `<div class="choices ${st.options.length > 3 ? 'cols2' : ''}">${st.options.map((o, i) => `<button class="choice" data-i="${i}"><span class="ic">${o.ic || '•'}</span><span>${o.l}${o.d ? `<small>${o.d}</small>` : ''}</span></button>`).join('')}</div>`;
    w.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (i === st.answer) { w.querySelectorAll('.choice').forEach(x => x.disabled = true); b.classList.add('right'); fb('정답! ' + (st.ok || ''), 'ok'); done(); }
      else { b.classList.add('wrong'); fb((st.why && st.why[i]) || '다시 생각해 보세요.', 'bad'); }
    });
  }
  if (st.type === 'sequence') {
    const order = shuffle(st.items.map((t, i) => ({ t, i }))); const picked = [];
    const draw = () => {
      w.innerHTML = `<div class="grid2"><div><label class="lbl" style="margin-top:0">보기 (순서대로 누르세요)</label><div class="seq-pool">${order.filter(o => !picked.includes(o)).map(o => `<button class="seq-item" data-i="${o.i}">${esc(o.t)}</button>`).join('') || '<div class="seq-empty">모두 골랐어요</div>'}</div></div>
        <div><label class="lbl" style="margin-top:0">내가 정한 순서</label><div class="seq-out">${picked.map((o, k) => `<div class="seq-item"><b>${k + 1}</b>${esc(o.t)}</div>`).join('') || '<div class="seq-empty">여기에 순서가 쌓여요</div>'}</div>
        <button class="btn ghost sm" style="margin-top:8px">↺ 다시</button></div></div>`;
      w.querySelectorAll('.seq-pool .seq-item').forEach(b => b.onclick = () => {
        picked.push(order.find(o => o.i === +b.dataset.i)); draw();
        if (picked.length === st.items.length) {
          if (picked.every((o, k) => o.i === k)) { fb('순서 완벽! 이 순서만 기억하면 실제 설정도 5분이면 끝나요.', 'ok'); done(); }
          else { const k = picked.findIndex((o, k) => o.i !== k); fb(`${k + 1}번째부터 순서가 달라요. ↺ 다시를 눌러 재도전!`, 'bad'); }
        }
      });
      w.querySelector('.btn').onclick = () => { picked.length = 0; draw(); };
    };
    draw();
  }
  if (st.type === 'pairs') {
    const left = st.pairs.map((p, i) => ({ t: p[0], i })), right = shuffle(st.pairs.map((p, i) => ({ t: p[1], i })));
    let sel = null; const matched = new Set();
    w.innerHTML = `<div class="pairs"><div class="col">${left.map(o => `<button class="pair" data-l="${o.i}">${esc(o.t)}</button>`).join('')}</div><div class="col">${right.map(o => `<button class="pair" data-r="${o.i}">${esc(o.t)}</button>`).join('')}</div></div>`;
    w.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { if (matched.has(+b.dataset.l)) return; w.querySelectorAll('[data-l]').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = +b.dataset.l; });
    w.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      const r = +b.dataset.r; if (matched.has(r)) return;
      if (sel === null) { fb('먼저 왼쪽 용어를 누르세요.', 'info'); return; }
      if (r === sel) {
        matched.add(r); b.classList.add('matched'); const l = w.querySelector(`[data-l="${sel}"]`); l.classList.remove('sel'); l.classList.add('matched'); sel = null;
        if (matched.size === st.pairs.length) { fb('모두 맞혔어요!', 'ok'); done(); } else fb('좋아요! 계속해 보세요.', 'info');
      } else { b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 500); fb('짝이 아니에요. 다시!', 'bad'); }
    });
  }
  if (st.type === 'fill' || st.type === 'config') {
    const isCfg = st.type === 'config';
    w.innerHTML = (isCfg ? `<div class="box"><div class="box-h">⏰ Schedule by Zapier</div><div style="padding:6px 14px 14px">` : '<div>') +
      st.fields.map((f, i) => `<label class="lbl">${f.l}</label>${isCfg ? `<select class="input" data-i="${i}"><option value="">— 선택 —</option>${f.o.map(o => `<option>${o}</option>`).join('')}</select>` : `<input class="input" data-i="${i}" placeholder="${f.ph || ''}" style="max-width:220px">`}`).join('') +
      (isCfg ? '</div></div>' : '</div>') + `<button class="btn" style="margin-top:12px">확인</button>`;
    const check = () => {
      const bad = st.fields.filter((f, i) => { const raw = w.querySelector(`[data-i="${i}"]`).value.trim(); return isCfg ? raw !== f.a : !f.a.includes(raw.replace(/[\s,]/g, '')); });
      if (!bad.length) { fb('정답!', 'ok'); done(); } else fb(isCfg ? '설정을 다시 확인하세요: ' + bad.map(f => f.l).join(', ') : '아쉬워요. 다시 계산해 보세요. (힌트 버튼 참고)', 'bad');
    };
    w.querySelector('.btn').onclick = check;
    w.querySelectorAll('input').forEach(x => x.onkeydown = e => { if (e.key === 'Enter') check(); });
  }
}

/* ---------- Claude 도우미 ---------- */
const panel = $('#claudePanel');
$('#claudeFab').onclick = () => { panel.hidden = !panel.hidden; if (!panel.hidden) refreshHelper(); };
$('#cpClose').onclick = () => panel.hidden = true;
function cpMsg(html, cls = 'a') { const b = $('#cpBody'); const m = h(`<div class="msg ${cls}" style="max-width:100%"></div>`); m.innerHTML = html; b.appendChild(m); b.scrollTop = 1e5; return m; }
function refreshHelper() {
  if (panel.hidden) return;
  const b = $('#cpBody'); b.innerHTML = '';
  if (!current) { cpMsg('안녕하세요! 저는 이 연습장의 Claude 도우미예요. 미션을 열면 그 미션에 맞는 팁과 힌트를 드릴게요. ✻'); return; }
  const prog = S.prog[current.id] || 0, st = current.steps[prog];
  cpMsg(`<b>${esc(current.title)}</b>에서 제 역할:<br>${current.claude.role}`);
  if (st) cpMsg(`지금 단계: <b>${esc(st.t)}</b><br><button class="btn sm claude" style="margin-top:6px" id="cpHint">힌트 보기</button>`);
  else cpMsg('이 미션은 완료했어요! 다음 미션으로 가 볼까요? 🎉');
  const hb = $('#cpHint'); if (hb) hb.onclick = () => showHint(current, st);
}
async function showHint(m, st) {
  panel.hidden = false; refreshHelper();
  const t = cpMsg('<span class="typing"><i></i><i></i><i></i></span>'); await sleep(500); t.remove();
  cpMsg('💡 ' + st.hint);
}

/* ---------- 도서관 / 사전 / 메모 ---------- */
function renderPrompts() {
  main.innerHTML = `<h1>✻ 프롬프트 도서관</h1><p class="lead">모든 미션의 Claude 협업 프롬프트를 모았어요. 복사해서 실제 Claude에 붙여넣고, 괄호나 예시 부분만 내 상황에 맞게 바꿔 쓰세요.</p>
    <input class="input search" placeholder="🔍 검색 (예: 필터, 코드, MCP)" id="q"><div id="lib"></div>`;
  const draw = q => {
    $('#lib').innerHTML = MISSIONS.flatMap(m => m.claude.prompts.map(p => ({ m, p }))).filter(({ m, p }) => !q || (m.title + p.tag + p.text).toLowerCase().includes(q.toLowerCase()))
      .map(({ m, p }) => `<div class="lib-item"><div style="display:flex;gap:8px;align-items:center"><span>${m.emoji}</span><a href="#${m.id}" data-go="${m.id}" style="font-weight:600;text-decoration:none">${esc(m.title)}</a></div>${promptHTML(p)}</div>`).join('') || '<p class="muted">검색 결과가 없어요.</p>';
  };
  $('#q').oninput = e => draw(e.target.value); draw('');
}
function renderGlossary() {
  main.innerHTML = `<h1>📖 용어 사전</h1><p class="lead">Zapier 화면에서 자주 보는 용어를 한눈에.</p><input class="input search" placeholder="🔍 용어 검색" id="q"><div class="card" id="gl"></div>`;
  const draw = q => { $('#gl').innerHTML = GLOSSARY.filter(g => !q || (g[0] + g[1]).toLowerCase().includes(q.toLowerCase())).map(g => `<div class="gl"><b>${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join('') || '<p class="muted">없어요.</p>'; };
  $('#q').oninput = e => draw(e.target.value); draw('');
}
function renderFacts() {
  const F = [
    ['Task로 세지 않는 것', '트리거, Filter·Paths, 오류·중단된 단계, 실행되지 않은 단계, Tables·Interfaces 단계, Formatter·Delay·Looping·Sub-Zap·Digest 단계', 'https://help.zapier.com/hc/en-us/articles/8496196837261', 'Zapier 도움말: How is task usage measured'],
    ['Zapier MCP 비용', '성공한 도구 호출 1번 = 2 Task, 실패한 호출은 0', 'https://help.zapier.com/hc/en-us/articles/8496196837261', 'Zapier 도움말: Tasks in Zapier'],
    ['Zap 단계 수 한도', 'Paths 안의 단계를 포함해 Zap 하나에 최대 100단계 (넘치면 Sub-Zap으로 분리)', 'https://help.zapier.com/hc/en-us/articles/8496288555917', 'Zapier 도움말: Paths'],
    ['무료 플랜', '월 100 Task, 2단계 Zap, Zap·Tables·Forms 무제한 / Professional은 월 $19.99부터 (요금제 페이지 기준)', 'https://zapier.com/pricing', 'Zapier Pricing'],
    ['Tables · Interfaces · MCP', '모든 Zapier 요금제에 포함', 'https://sdtimes.com/zapier-adds-copilot-assistant-and-enterprise-grade-governance-to-ai-orchestration-platform/', 'SD Times 보도'],
    ['Next Gen Zaps', '2026년 얼리 액세스. 얼리 액세스 기간 실행은 무료, 2026년 12월 1일부터 Task 과금 시작 예정', 'https://zapier.com/mcp', 'Zapier MCP 페이지'],
    ['Zapier MCP를 Claude에 연결', 'mcp.zapier.com → + New MCP Server → Claude 선택 → + Add tool → 계정 연결·Configure → Connect', 'https://zapier.com/blog/automate-claude-zapier-mcp/', 'Zapier 블로그: How to automate Claude safely with Zapier MCP'],
    ['Claude Code에서 추가', 'claude mcp add --transport http "Zapier-MCP" https://mcp.zapier.com/api/v1/connect', 'https://www.developersdigest.tech/mcp-servers/zapier', 'Developers Digest MCP 목록'],
    ['Anthropic (Claude) 앱', 'Send Message 액션 (User Message, System, Model, Memory Key 등)', 'https://zapier.com/apps/anthropic-claude/integrations', 'Zapier 앱 디렉터리']
  ];
  main.innerHTML = `<h1>💰 요금·한도 메모</h1><p class="lead">미션에서 쓰인 숫자와 정책의 출처예요. <b>2026년 11월 기준</b>으로 정리했고 바뀔 수 있으니, 실제로 쓰기 전에 링크에서 최신 내용을 확인하세요.</p>
    <div class="card">${F.map(f => `<div class="gl"><b>${esc(f[0])}</b><span>${esc(f[1])}<br><a href="${f[2]}" target="_blank" rel="noopener" style="font-size:13px">↗ ${esc(f[3])}</a></span></div>`).join('')}</div>`;
}

/* ---------- 컨페티 ---------- */
function confetti() {
  const c = $('#confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#FF5B1F', '#FFA24D', '#C9643F', '#14945E', '#2F6FEB', '#FFD166'];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 4, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6 }));
  let f = 0;
  (function tick() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else x.clearRect(0, 0, c.width, c.height);
  })();
}

route();
