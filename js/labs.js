/* =========================================================
   Zap 연습장 — 인터랙티브 실험실(Labs)
   LABS[name](root, params, done, fb)
   ========================================================= */

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 조건 평가 (Filter / Paths 공용) ---------- */
const OPS = ['(Text) Exactly matches', '(Text) Does not exactly match', '(Text) Contains', '(Text) Does not contain', '(Text) Starts with', '(Number) Greater than', '(Number) Less than'];
const LEAD_FIELDS = ['언어', '지역', '희망과정', '예산', '이름', '문의내용'];
function evalRule(rec, r) {
  const raw = rec[r.f]; const v = String(raw ?? '').trim(); const x = String(r.v ?? '').trim();
  if (!r.f || !r.op) return false;
  switch (r.op) {
    case '(Text) Exactly matches': return v === x;
    case '(Text) Does not exactly match': return v !== x;
    case '(Text) Contains': return x !== '' && v.toLowerCase().includes(x.toLowerCase());
    case '(Text) Does not contain': return !v.toLowerCase().includes(x.toLowerCase());
    case '(Text) Starts with': return x !== '' && v.toLowerCase().startsWith(x.toLowerCase());
    case '(Number) Greater than': return x !== '' && !isNaN(+raw) && +raw > +x.replace(/,/g, '');
    case '(Number) Less than': return x !== '' && !isNaN(+raw) && +raw < +x.replace(/,/g, '');
  }
  return false;
}
function ruleRow(r, onChange, removable, onRemove) {
  const row = h(`<div class="rule">
    <select class="input f">${['<option value="">필드 선택</option>', ...LEAD_FIELDS.map(f => `<option ${r.f === f ? 'selected' : ''}>${f}</option>`)].join('')}</select>
    <select class="input o">${['<option value="">조건 선택</option>', ...OPS.map(o => `<option ${r.op === o ? 'selected' : ''}>${o}</option>`)].join('')}</select>
    <input class="input v" placeholder="값" value="${esc(r.v)}">
    ${removable ? '<button class="x" title="삭제">✕</button>' : '<span></span>'}</div>`);
  row.querySelector('.f').onchange = e => { r.f = e.target.value; onChange(); };
  row.querySelector('.o').onchange = e => { r.op = e.target.value; onChange(); };
  row.querySelector('.v').oninput = e => { r.v = e.target.value; onChange(); };
  if (removable) row.querySelector('.x').onclick = onRemove;
  return row;
}

const LABS = {};

/* ---------- 앱 & 이벤트 고르기 ---------- */
LABS.appPick = (root, p, done, fb) => {
  let app = null;
  const isTrig = p.role === 'trigger';
  const list = Object.keys(APPS).filter(a => (isTrig ? APPS[a].triggers : APPS[a].actions).length);
  const draw = () => {
    root.innerHTML = `<div class="zap-ed">
      <div class="zstep sel"><div class="zh"><div class="zi">${app ? APPS[app].ic : (isTrig ? '⚡' : '▶')}</div>
        <div><div class="zk">${isTrig ? '1. TRIGGER' : '2. ACTION'}</div><div class="zt">${app ? esc(app) + ' — 이벤트를 고르세요' : (isTrig ? 'Zap을 시작할 앱을 고르세요' : '실행할 앱을 고르세요')}</div></div></div>
        <div class="appgrid">${list.map(a => `<button class="appbtn ${a === app ? 'sel' : ''}" data-a="${esc(a)}"><span>${APPS[a].ic}</span>${esc(a)}</button>`).join('')}</div>
        ${app ? `<label class="lbl">${isTrig ? 'Trigger event' : 'Action event'}</label><div class="evlist">${(isTrig ? APPS[app].triggers : APPS[app].actions).map(ev => `<button class="choice" data-ev="${esc(ev)}"><span class="ic">${isTrig ? '⚡' : '▶'}</span><span>${esc(ev)}</span></button>`).join('')}</div>` : ''}
      </div></div>`;
    root.querySelectorAll('.appbtn').forEach(b => b.onclick = () => { app = b.dataset.a; draw(); });
    root.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => {
      const ev = b.dataset.ev;
      if (app === p.app && ev === p.event) { b.classList.add('right'); fb(`정답! <b>${esc(app)} · ${esc(ev)}</b> ${isTrig ? '트리거' : '액션'}로 설정했어요.`, 'ok'); done(); }
      else if (app !== p.app) { b.classList.add('wrong'); fb(`<b>${esc(app)}</b>은(는) 이 시나리오의 앱이 아니에요. 시나리오를 다시 읽어 보세요.`, 'bad'); }
      else { b.classList.add('wrong'); fb(`앱은 맞았어요! 이벤트가 달라요. “${esc(ev)}”가 아닌 다른 이벤트를 골라 보세요.`, 'bad'); }
    });
  };
  draw();
};

/* ---------- 데이터 매핑 ---------- */
LABS.mapping = (root, p, done, fb) => {
  const keys = Object.keys(SAMPLE_LEAD);
  const sel = {};
  root.innerHTML = `<div class="box"><div class="box-h">📝 1. Google Forms · New Form Response — 샘플 데이터</div><div style="padding:12px" class="datachips">${keys.map(k => `<span class="dchip"><b>${k}</b>${esc(SAMPLE_LEAD[k])}</span>`).join('')}</div></div>
    <div class="box" style="margin-top:12px"><div class="box-h">💬 2. Slack · Send Channel Message — 설정</div><div style="padding:12px 14px">
      <div class="maprow"><span class="k">Channel</span><span><code>#상담</code></span></div>
      ${p.targets.map((t, i) => `<div class="maprow"><span class="k">${t[0]}</span><select class="input" data-i="${i}"><option value="">— 데이터 선택 —</option>${keys.map(k => `<option>${k}</option>`).join('')}</select></div>`).join('')}
    </div></div>
    <div class="preview"><div class="muted" style="font-size:12.5px;margin-bottom:6px">미리보기</div><div class="slackmsg"><div class="av">Z</div><div><div class="nm">Zapier <small>APP</small></div><div class="pv"></div></div></div></div>
    <button class="btn" style="margin-top:12px">매핑 확인</button>`;
  const pv = root.querySelector('.pv');
  const upd = () => {
    const v = i => sel[i] ? `<b>${esc(SAMPLE_LEAD[sel[i]])}</b>` : '<span class="muted">(비어 있음)</span>';
    pv.innerHTML = `📩 새 상담 문의 도착!<br>• 이름: ${v(0)}<br>• 과정: ${v(1)}<br>• 연락처: ${v(2)}`;
  };
  root.querySelectorAll('select').forEach(s => s.onchange = () => { sel[s.dataset.i] = s.value; upd(); });
  upd();
  root.querySelector('.btn').onclick = () => {
    const wrong = p.targets.map((t, i) => sel[i] === t[1] ? null : t[0]).filter(Boolean);
    if (!wrong.length) { fb('완벽해요! 샘플 데이터가 알맞은 칸에 들어갔어요. 실제 실행 때는 신청자마다 값이 바뀌어 들어가요.', 'ok'); done(); }
    else fb(`다시 확인해 보세요: <b>${wrong.join(', ')}</b>`, 'bad');
  };
};

/* ---------- 테스트 & 게시 ---------- */
LABS.testPublish = (root, p, done, fb) => {
  let s = 0;
  root.innerHTML = `<div class="zap-ed">
    <div class="zstep" id="t1"><div class="zh"><div class="zi">📝</div><div style="flex:1"><div class="zk">1. TRIGGER</div><div class="zt">Google Forms · New Form Response</div></div><button class="btn sm ghost" data-b="1">Test trigger</button></div><div class="r"></div></div>
    <div class="zline"></div>
    <div class="zstep" id="t2"><div class="zh"><div class="zi">💬</div><div style="flex:1"><div class="zk">2. ACTION</div><div class="zt">Slack · Send Channel Message</div></div><button class="btn sm ghost" data-b="2">Test step</button></div><div class="r"></div></div>
    <div style="margin-top:16px;display:flex;align-items:center;gap:10px"><button class="btn" data-b="3">Publish</button><span class="pub muted">Zap 상태: <b>OFF</b></span></div></div>`;
  root.querySelectorAll('[data-b]').forEach(b => b.onclick = async () => {
    const n = +b.dataset.b;
    if (n !== s + 1) { fb(n === 2 ? '먼저 트리거를 테스트해서 샘플 데이터를 가져와야 해요.' : '먼저 각 단계를 테스트해야 안전하게 켤 수 있어요.', 'bad'); root.querySelector('.zap-ed').classList.add('shake'); setTimeout(() => root.querySelector('.zap-ed').classList.remove('shake'), 400); return; }
    s = n; b.disabled = true;
    if (n === 1) { const r = root.querySelector('#t1 .r'); r.innerHTML = '<div class="muted" style="margin-top:8px">⏳ 최근 응답을 찾는 중…</div>'; await sleep(700); r.innerHTML = `<div class="datachips" style="margin-top:8px">${Object.entries(SAMPLE_LEAD).slice(0, 4).map(([k, v]) => `<span class="dchip"><b>${k}</b>${esc(v)}</span>`).join('')}</div>`; root.querySelector('#t1').classList.add('ok'); fb('트리거 테스트 성공! 샘플 응답 1건을 찾았어요.', 'info'); }
    if (n === 2) { const r = root.querySelector('#t2 .r'); r.innerHTML = '<div class="muted" style="margin-top:8px">⏳ Slack으로 테스트 메시지 전송 중…</div>'; await sleep(800); r.innerHTML = `<div class="preview"><div class="slackmsg"><div class="av">Z</div><div><div class="nm">Zapier <small>#상담 · 방금</small></div>📩 새 상담 문의 도착!<br>• 이름: 김민지 • 과정: DELE B1 • 연락처: minji.kim@example.com</div></div></div>`; root.querySelector('#t2').classList.add('ok'); fb('액션 테스트 성공! 실제 Slack 채널에 테스트 메시지가 전송돼요. (테스트도 실제로 보내진다는 점 기억!)', 'info'); }
    if (n === 3) { root.querySelector('.pub').innerHTML = 'Zap 상태: <b style="color:var(--ok)">● ON</b> — 이제 새 신청이 올 때마다 자동 실행돼요'; fb('🎉 첫 Zap이 켜졌어요! 이제 여러분이 자는 동안에도 상담 알림이 도착합니다.', 'ok'); done(); }
  });
};

/* ---------- Zap History ---------- */
LABS.history = (root, p, done, fb) => {
  const runs = [
    { t: '11-20 09:12', st: 's', txt: '김민지 · DELE B1 → Slack 전송' },
    { t: '11-20 09:40', st: 'f', txt: '박준호 · 필터 조건 불일치(부산) — 중단' },
    { t: '11-20 10:05', st: 'e', txt: '이서연 · DELE A2 → Slack 전송 실패' },
    { t: '11-20 10:31', st: 's', txt: '최하늘 · 여행 스페인어 → Slack 전송' }
  ];
  const label = { s: 'Success', f: 'Filtered', e: 'Errored', h: 'Halted' };
  let open = false, fixed = false;
  const draw = () => {
    root.innerHTML = `<div class="tblwrap"><table class="tbl"><tr><th>시각</th><th>상태</th><th>내용</th></tr>${runs.map((r, i) => `<tr class="hrow" data-i="${i}"><td class="mono">${r.t}</td><td><span class="status ${r.st}">${label[r.st]}</span></td><td>${esc(r.txt)}</td></tr>`).join('')}</table></div><div class="det"></div>`;
    root.querySelectorAll('.hrow').forEach(tr => tr.onclick = () => {
      const r = runs[tr.dataset.i];
      if (r.st === 'e') { open = true; detail(); }
      else if (r.st === 'f') fb('Filtered는 오류가 아니에요. 필터 조건에 맞지 않아 멈춘 거라 Task도 쓰지 않았어요.', 'info');
      else fb('성공한 실행이에요. 오류가 난 줄을 찾아보세요.', 'info');
    });
    if (open) detail();
  };
  const detail = () => {
    const d = root.querySelector('.det');
    d.innerHTML = `<div class="box" style="margin-top:12px"><div class="box-h" style="background:var(--bad-l);color:#A32822">❌ Step 2 · Slack · Send Channel Message</div><div style="padding:12px 14px">
      <div class="mono" style="background:#1E1B19;color:#FFB4A8;padding:10px;border-radius:8px">Error: channel_not_found<br>The channel "#상담" could not be found.</div>
      <p style="margin:10px 0 6px"><b>어떻게 고칠까요?</b></p><div class="choices">
      ${shuffle(['Slack에서 채널 이름이 바뀌었는지 확인하고, Zap의 Channel 칸을 다시 선택한 뒤 Zapier 앱을 그 채널에 초대한다|1', 'Zap을 지우고 처음부터 새로 만든다|0', '트리거 앱을 Gmail로 바꾼다|0']).map(o => { const [l, a] = o.split('|'); return `<button class="choice" data-a="${a}"><span class="ic">🔧</span><span>${l}</span></button>`; }).join('')}</div>
      <button class="btn" style="margin-top:12px" ${fixed ? '' : 'disabled'} id="replay">↻ Replay</button></div></div>`;
    d.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      if (b.dataset.a === '1') { fixed = true; b.classList.add('right'); d.querySelector('#replay').disabled = false; fb('좋아요! 원인을 고쳤으니 이제 Replay로 그 실행만 다시 돌려 보세요.', 'info'); }
      else { b.classList.add('wrong'); fb('너무 큰 수술이에요. 오류 메시지가 가리키는 칸(채널)만 고치면 돼요.', 'bad'); }
    });
    d.querySelector('#replay').onclick = async () => {
      d.querySelector('#replay').disabled = true; d.querySelector('#replay').textContent = '⏳ 다시 실행 중…'; await sleep(900);
      runs[2].st = 's'; runs[2].txt = '이서연 · DELE A2 → Slack 전송 (Replay)'; open = false; draw();
      fb('Replay 성공! 놓친 상담 알림이 Slack에 도착했어요. 이렇게 Zap History는 “놓친 일을 되살리는 곳”이에요.', 'ok'); done();
    };
  };
  draw();
};

/* ---------- Filter ---------- */
LABS.filter = (root, p, done, fb) => {
  const st = { logic: 'AND', rules: [{ f: '언어', op: '', v: '' }] };
  let solved = false;
  const draw = () => {
    root.innerHTML = `<div class="box"><div class="box-h">🚦 Filter by Zapier — Only continue if…</div><div style="padding:12px 14px">
      <div class="rules"></div>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center"><button class="btn sm ghost add">+ 조건 추가</button>
      <span class="muted" style="font-size:13px">조건 연결:</span><select class="input" style="width:auto" id="lg"><option ${st.logic === 'AND' ? 'selected' : ''}>AND</option><option ${st.logic === 'OR' ? 'selected' : ''}>OR</option></select></div></div></div>
      <div class="tblwrap" style="margin-top:12px"><table class="tbl" id="tb"></table></div><div class="muted" style="font-size:13px;margin-top:6px" id="cnt"></div>`;
    const box = root.querySelector('.rules');
    st.rules.forEach((r, i) => {
      if (i > 0) box.appendChild(h(`<div class="andor">${st.logic}</div>`));
      box.appendChild(ruleRow(r, table, st.rules.length > 1, () => { st.rules.splice(i, 1); draw(); }));
    });
    root.querySelector('.add').onclick = () => { st.rules.push({ f: '', op: '', v: '' }); draw(); };
    root.querySelector('#lg').onchange = e => { st.logic = e.target.value; draw(); };
    table();
  };
  const table = () => {
    const pass = LEADS.filter(r => st.logic === 'AND' ? st.rules.every(x => evalRule(r, x)) : st.rules.some(x => evalRule(r, x))).map(r => r.id);
    root.querySelector('#tb').innerHTML = `<tr><th></th><th>이름</th><th>언어</th><th>지역</th><th>희망과정</th><th>예산</th></tr>` + LEADS.map(r => `<tr class="${pass.includes(r.id) ? 'pass' : 'fail'}"><td>${pass.includes(r.id) ? '✅' : '⛔'}</td><td>${r.이름}</td><td>${r.언어}</td><td>${r.지역}</td><td>${r.희망과정}</td><td>${r.예산.toLocaleString()}</td></tr>`).join('');
    root.querySelector('#cnt').textContent = `통과 ${pass.length}건 / 목표: 스페인어 + 서울 = ${p.target.length}건`;
    const ok = pass.length === p.target.length && p.target.every(id => pass.includes(id));
    if (ok && !solved) { solved = true; fb('정확해요! 스페인어·서울 신청 3건만 통과합니다. 나머지 3건은 Task를 쓰지 않고 멈춰요.', 'ok'); done(); }
  };
  draw();
};

/* ---------- Paths ---------- */
LABS.paths = (root, p, done, fb) => {
  const P = [
    { n: 'Path A', who: '👩‍🏫 후안샘 DM', r: { f: '언어', op: '', v: '' } },
    { n: 'Path B', who: '🇬🇧 영어팀 채널', r: { f: '언어', op: '', v: '' } },
    { n: 'Path C', who: '🏢 원장실 (그 외 언어)', r: { f: '언어', op: '', v: '' } }
  ];
  const expect = r => r.언어 === '스페인어' ? 0 : r.언어 === '영어' ? 1 : 2;
  root.innerHTML = `<div class="datachips" style="margin-bottom:12px">${LEADS.map(r => `<span class="dchip"><b>${r.이름}</b>${r.언어} · ${r.희망과정}</span>`).join('')}</div><div class="paths"></div><button class="btn" style="margin-top:12px" id="run">▶ 6건 실행</button>`;
  const wrap = root.querySelector('.paths');
  P.forEach((pt, i) => {
    const c = h(`<div class="pathcard"><h4>${pt.n} → ${pt.who}</h4><div class="r"></div><div class="bucket" id="bk${i}"></div></div>`);
    const rr = ruleRow(pt.r, () => { }, false); rr.style.gridTemplateColumns = '1fr'; rr.lastElementChild.remove();
    c.querySelector('.r').appendChild(rr); wrap.appendChild(c);
  });
  root.querySelector('#run').onclick = async () => {
    P.forEach((_, i) => root.querySelector('#bk' + i).innerHTML = '');
    let allOk = true; const lost = [];
    for (const r of LEADS) {
      const hit = P.map((pt, i) => evalRule(r, pt.r) ? i : -1).filter(i => i >= 0);
      const good = hit.length === 1 && hit[0] === expect(r);
      if (!good) allOk = false;
      if (!hit.length) lost.push(r.이름);
      hit.forEach(i => root.querySelector('#bk' + i).appendChild(h(`<span class="bchip ${i === expect(r) && hit.length === 1 ? 'good' : 'badc'}">${r.이름}·${r.언어}</span>`)));
      await sleep(180);
    }
    if (allOk) { fb('모든 문의가 정확한 담당자에게 갔어요! 각 Path 안의 액션만 Task를 써요.', 'ok'); done(); }
    else fb(`아직이에요. ${lost.length ? `어느 Path에도 못 간 문의: <b>${lost.join(', ')}</b>. ` : ''}빨간 칩은 잘못 갔거나 두 곳에 중복으로 간 문의예요.`, 'bad');
  };
};

/* ---------- Formatter ---------- */
LABS.formatter = (root, p, done, fb) => {
  const T = {
    'Text · Titlecase': s => s.toLowerCase().replace(/(^|\s)\S/g, m => m.toUpperCase()),
    'Text · Uppercase': s => s.toUpperCase(),
    'Text · Lowercase': s => s.toLowerCase(),
    'Text · Trim Whitespace': s => s.trim(),
    'Text · Extract Email Address': s => (s.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [''])[0],
    'Text · Extract Number': s => (s.match(/-?\d+(\.\d+)?/) || [''])[0],
    'Text · Split Text (공백 기준 첫 조각)': s => s.split(' ')[0],
    'Numbers · Format Number (1,000 형식)': s => isNaN(+s) ? s : Number(s).toLocaleString('en-US'),
    'Date/Time · Format → YYYY년 M월 D일': s => { const d = new Date(s); return isNaN(d) ? '(날짜 아님)' : `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`; },
    'Date/Time · Format → MM/DD/YYYY': s => { const d = new Date(s); return isNaN(d) ? '(날짜 아님)' : `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`; },
    'Utilities · Lookup Table (과정→수강료)': s => ({ 'DELE B1': '350000', 'DELE A2': '300000', 'DELF A1': '320000' }[s.trim()] ?? '(표에 없음)')
  };
  const C = [
    { n: '이름 정리', i: 'kim MINJI', o: 'Kim Minji' },
    { n: '이메일만 뽑기', i: '연락은 minji.kim@example.com 으로 부탁드려요', o: 'minji.kim@example.com' },
    { n: '한국식 날짜', i: '2026-11-20T09:12:00', o: '2026년 11월 20일' },
    { n: '과정 → 수강료', i: 'DELE B1', o: '350000' },
    { n: '읽기 쉬운 숫자', i: '1250000', o: '1,250,000' }
  ];
  const ok = new Set();
  root.innerHTML = C.map((c, k) => `<div class="box" style="margin-bottom:10px"><div class="box-h">🔤 도전 ${k + 1} · ${c.n} <span class="st" style="float:right"></span></div><div style="padding:10px 14px">
    <div class="grid2"><div><label class="lbl" style="margin-top:0">입력</label><code>${esc(c.i)}</code></div><div><label class="lbl" style="margin-top:0">목표 출력</label><code>${esc(c.o)}</code></div></div>
    <label class="lbl">Transform</label><select class="input" data-k="${k}"><option value="">— 변환 선택 —</option>${Object.keys(T).map(t => `<option>${t}</option>`).join('')}</select>
    <div style="margin-top:8px">출력: <code class="out">—</code></div></div></div>`).join('');
  root.querySelectorAll('select').forEach(s => s.onchange = () => {
    const k = +s.dataset.k, c = C[k], box = s.closest('.box');
    const out = s.value ? T[s.value](c.i) : '—';
    box.querySelector('.out').textContent = out;
    const good = out === c.o;
    box.querySelector('.st').textContent = good ? '✅ 통과' : (s.value ? '❌' : '');
    box.style.borderColor = good ? '#9BD8BC' : '';
    good ? ok.add(k) : ok.delete(k);
    if (ok.size === C.length) { fb('Formatter 5종 정복! 실제 Zap에서는 여러 Formatter 단계를 이어 붙여 더 복잡한 변환도 해요. 그리고 전부 Task 0개!', 'ok'); done(); }
  });
};

/* ---------- Webhook ---------- */
LABS.webhook = (root, p, done, fb) => {
  const url = 'https://hooks.zapier.com/hooks/catch/000000/practice/';
  root.innerHTML = `<div class="box"><div class="box-h">🪝 Webhooks by Zapier · Catch Hook</div><div style="padding:12px 14px">
    <label class="lbl" style="margin-top:0">Zapier가 만들어 준 웹훅 URL (연습용 가짜 주소)</label><code>${url}</code>
    <label class="lbl">보낼 데이터 (JSON) — score가 빠져 있어요!</label>
    <textarea class="input mono" rows="5">{
  "name": "김민지",
  "unit": "Unidad 3"
}</textarea>
    <button class="btn" style="margin-top:10px">📤 POST로 보내기</button>
    <div class="recv" style="margin-top:12px"></div></div></div>
    <details style="margin-top:12px"><summary style="cursor:pointer;font-weight:600;color:var(--claude)">✻ Claude가 써 준 “내 사이트 → Zapier” 전송 코드 보기</summary>
    <pre class="code">// 퀴즈가 끝났을 때 호출하세요
async function sendScore(name, unit, score) {
  try {
    await fetch('${url}', {
      method: 'POST',
      // Content-Type을 따로 지정하지 않으면 브라우저 CORS 사전요청 없이 전송돼요.
      // Zapier Catch Hook은 JSON 문자열 본문도 필드로 풀어 줍니다.
      body: JSON.stringify({ name, unit, score })
    });
  } catch (e) {
    console.warn('점수 전송 실패', e); // 화면은 멈추지 않게
  }
}</pre></details>`;
  root.querySelector('.btn').onclick = async () => {
    const recv = root.querySelector('.recv');
    let data;
    try { data = JSON.parse(root.querySelector('textarea').value); }
    catch (e) { recv.innerHTML = ''; fb('JSON 형식 오류예요. 키와 문자열은 큰따옴표(")로 감싸고, 항목 사이에 쉼표(,)가 있는지, 마지막 항목 뒤엔 쉼표가 없는지 확인하세요.', 'bad'); return; }
    recv.innerHTML = '<span class="muted">⏳ 전송 중…</span>'; await sleep(600);
    const keys = Object.keys(data);
    recv.innerHTML = `<div class="muted" style="font-size:13px;margin-bottom:6px">✅ Zapier가 받은 데이터 (다음 단계에서 매핑 가능)</div><div class="datachips">${keys.map(k => `<span class="dchip"><b>${esc(k)}</b>${esc(typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k])}</span>`).join('')}</div>`;
    const need = ['name', 'unit', 'score'].filter(k => !(k in data));
    if (need.length) fb(`잘 받았지만 <b>${need.join(', ')}</b> 필드가 빠졌어요. JSON에 추가해서 다시 보내 보세요.`, 'bad');
    else { fb('완벽! Catch Hook이 name, unit, score를 받았어요. 이제 이 값을 Sheets나 Tables에 기록하는 액션을 이어 붙이면 “학생 점수 자동 기록”이 완성돼요.', 'ok'); done(); }
  };
};

/* ---------- Code by Zapier ---------- */
LABS.code = (root, p, done, fb) => {
  const input = { fullName: 'kim minji', phone: '010-1234-5678' };
  const target = { name: 'Kim Minji', phoneIntl: '+82-10-1234-5678' };
  const starter = `// inputData.fullName, inputData.phone 을 사용하세요\nconst name = inputData.fullName;      // TODO: 단어 첫 글자 대문자로\nconst phoneIntl = inputData.phone;   // TODO: +82-10-1234-5678 형식으로\n\noutput = { name, phoneIntl };`;
  const claudeCode = `// ✻ Claude가 작성한 코드\nconst name = inputData.fullName\n  .toLowerCase()\n  .split(' ')\n  .map(w => w.charAt(0).toUpperCase() + w.slice(1))\n  .join(' ');\n\n// 맨 앞 0을 빼고 국가번호 +82를 붙입니다\nconst phoneIntl = '+82-' + inputData.phone.replace(/^0/, '');\n\noutput = { name, phoneIntl };`;
  root.innerHTML = `<div class="grid2" style="grid-template-columns:1fr 1.6fr"><div>
      <label class="lbl" style="margin-top:0">inputData (이전 단계에서 매핑)</label><pre class="out" style="color:#F5EDE6">${esc(JSON.stringify(input, null, 2))}</pre>
      <label class="lbl">목표 output</label><pre class="out" style="color:#F5EDE6">${esc(JSON.stringify(target, null, 2))}</pre></div>
    <div><label class="lbl" style="margin-top:0">Code by Zapier · Run JavaScript</label><textarea class="codebox" spellcheck="false">${esc(starter)}</textarea>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn dark" id="run">▶ Run (Test)</button><button class="btn claude" id="ai">✻ Claude가 써 준 코드 붙여넣기</button></div>
      <pre class="out" id="res">// 실행 결과가 여기에 나와요</pre></div></div>`;
  const ta = root.querySelector('textarea');
  root.querySelector('#ai').onclick = () => { ta.value = claudeCode; fb('Claude 코드를 붙여넣었어요. 이제 ▶ Run으로 테스트해 보세요. 실제로도 “붙여넣기 → 테스트” 순서를 꼭 지켜요!', 'info'); };
  root.querySelector('#run').onclick = () => {
    const res = root.querySelector('#res');
    try {
      try { delete window.output; } catch (e) { window.output = undefined; }
      const fn = new Function('inputData', ta.value + '\n;return (typeof output !== "undefined") ? output : undefined;');
      const out = fn(JSON.parse(JSON.stringify(input)));
      res.style.color = '#9FE3BE'; res.textContent = 'output = ' + JSON.stringify(out, null, 2);
      if (out && out.name === target.name && out.phoneIntl === target.phoneIntl) { fb('테스트 통과! output의 name, phoneIntl 필드를 다음 단계(예: 문자 발송)에서 매핑할 수 있어요.', 'ok'); done(); }
      else fb('실행은 됐지만 output이 목표와 달라요. 값을 비교해 보세요.', 'bad');
    } catch (e) { res.style.color = '#FFB4A8'; res.textContent = '❌ ' + e.name + ': ' + e.message; fb('코드 오류가 났어요. 오류 메시지를 Claude에게 그대로 보여 주면 고쳐 줘요.', 'bad'); }
  };
};

/* ---------- Looping ---------- */
LABS.loop = (root, p, done, fb) => {
  const val = '스페인어, 영어, 프랑스어';
  root.innerHTML = `<div class="box"><div class="box-h">🔁 Looping by Zapier</div><div style="padding:12px 14px">
    <div>입력값: <code>${val}</code></div>
    <div class="grid2"><div><label class="lbl">Action event</label><select class="input" id="ev"><option value="">선택</option><option>Create Loop From Text</option><option>Create Loop From Line Items</option><option>Create Loop From Numbers</option></select></div>
    <div><label class="lbl">Delimiter (구분자)</label><select class="input" id="dl"><option value="">선택</option><option value=",">쉼표 ( , )</option><option value=";">세미콜론 ( ; )</option><option value=" ">공백</option><option value="\\n">줄바꿈</option></select></div></div>
    <button class="btn" style="margin-top:12px">▶ 실행</button><div class="log" style="margin-top:12px;display:none"></div></div></div>`;
  root.querySelector('.btn').onclick = async () => {
    const ev = root.querySelector('#ev').value, dl = root.querySelector('#dl').value, log = root.querySelector('.log');
    if (!ev || !dl) { fb('이벤트와 구분자를 모두 골라 주세요.', 'bad'); return; }
    if (ev !== 'Create Loop From Text') { fb(ev === 'Create Loop From Numbers' ? 'Numbers는 “1부터 10까지”처럼 숫자 범위를 반복할 때 써요.' : 'Line Items는 앱이 목록 형태로 준 데이터(주문 상품 목록 등)에 써요. 지금은 쉼표로 이어진 “텍스트”예요.', 'bad'); return; }
    const parts = val.split(dl === '\\n' ? '\n' : dl).map(s => s.trim()).filter(Boolean);
    log.style.display = 'block'; log.innerHTML = '';
    for (let i = 0; i < parts.length; i++) { log.appendChild(h(`<div class="logrow"><span class="t">#${i + 1}</span><span>📓 Notion · Create Database Item → <b>${esc(parts[i])}</b></span></div>`)); await sleep(350); }
    if (parts.length === 3) { fb('3번 반복해서 언어마다 한 줄씩 기록했어요!', 'ok'); done(); }
    else fb(`구분자가 맞지 않아 ${parts.length}번만 반복됐어요. 입력값을 나누는 기호를 다시 보세요.`, 'bad');
  };
};

/* ---------- Tables ---------- */
LABS.tables = (root, p, done, fb) => {
  const rows = [
    { n: '김민지', c: 'DELE B1', s: '신규', q: '주말반이 있나요? 내년 5월 시험 목표입니다.', ai: '' },
    { n: '박준호', c: 'TOEIC Speaking', s: '상담중', q: '회사에서 점수가 필요해요. 빨리 시작하고 싶습니다.', ai: '' },
    { n: 'Carlos', c: 'DELF A1', s: '신규', q: 'Je voudrais commencer en décembre.', ai: '' }
  ];
  const f = { add: false, upd: false, ai: false };
  let fin = false;
  const AIS = { '김민지': '주말반 희망 · 2027년 5월 DELE 응시 목표', '박준호': '업무용 점수 필요 · 빠른 시작 희망(긴급)', 'Carlos': '12월 시작 희망 · 프랑스어로 문의(불어 응대 필요)' };
  const draw = () => {
    root.innerHTML = `<div class="box"><div class="box-h">🗂️ 상담DB (Zapier Tables)</div>
      <div class="tblwrap" style="border:0;border-radius:0"><table class="tbl"><tr><th>이름</th><th>과정</th><th>상태</th><th>문의</th><th>✻ AI 요약 <small>(AI 필드)</small></th></tr>
      ${rows.map((r, i) => `<tr><td>${esc(r.n)}</td><td>${esc(r.c)}</td><td><select class="input" style="padding:4px 6px" data-i="${i}">${['신규', '상담중', '등록완료', '보류'].map(s => `<option ${s === r.s ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td style="font-size:13px">${esc(r.q)}</td><td class="ai">${esc(r.ai) || '<span class="muted">—</span>'}</td></tr>`).join('')}</table></div>
      <div style="padding:12px 14px;display:grid;grid-template-columns:1fr 1fr 1.6fr auto;gap:8px;border-top:1px solid var(--line2)"><input class="input" id="nn" placeholder="이름"><input class="input" id="nc" placeholder="과정"><input class="input" id="nq" placeholder="문의 내용"><button class="btn sm" id="add">+ 레코드</button></div>
      <div style="padding:0 14px 12px"><button class="btn claude sm" id="ai">✻ AI 요약 실행</button></div></div>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><span class="pill ${f.add ? 'ok' : ''}">${f.add ? '✅' : '⬜'} 레코드 추가</span><span class="pill ${f.upd ? 'ok' : ''}">${f.upd ? '✅' : '⬜'} 상태 변경으로 Zap 실행</span><span class="pill ${f.ai ? 'ok' : ''}">${f.ai ? '✅' : '⬜'} AI 필드 실행</span></div>
      <div class="log" id="lg" style="margin-top:10px"></div>`;
    root.querySelector('#add').onclick = () => {
      const n = root.querySelector('#nn').value.trim(), c = root.querySelector('#nc').value.trim(), q = root.querySelector('#nq').value.trim();
      if (!n || !c) { fb('이름과 과정을 입력하세요.', 'bad'); return; }
      rows.push({ n, c, s: '신규', q: q || '(내용 없음)', ai: '' }); f.add = true; draw();
      log('⚡ <b>New Record</b> 트리거 → Zap 실행: Slack #상담 “새 레코드: ' + esc(n) + '”'); check();
    };
    root.querySelectorAll('select[data-i]').forEach(s => s.onchange = () => {
      const r = rows[s.dataset.i]; r.s = s.value;
      if (s.value === '등록완료') { f.upd = true; draw(); log(`⚡ <b>Updated Record</b> 트리거 → Zap 실행: ${esc(r.n)}님 환영 메일 초안 작성 + 수업 배정 시트 기록`); check(); }
    });
    root.querySelector('#ai').onclick = async () => {
      const b = root.querySelector('#ai'); b.disabled = true; b.textContent = '✻ 요약 중…';
      for (const r of rows) { await sleep(250); r.ai = AIS[r.n] || `${r.c} 희망 · ${r.q.slice(0, 18)}${r.q.length > 18 ? '…' : ''}`; }
      f.ai = true; draw(); log('✻ AI 필드가 모든 레코드의 요약을 채웠어요 (Tables 단계는 Task 0)'); check();
    };
  };
  const logs = [];
  const log = m => { logs.unshift(`<div class="logrow"><span class="t">now</span><span>${m}</span></div>`); const el = root.querySelector('#lg'); if (el) el.innerHTML = logs.join(''); };
  const check = () => { root.querySelector('#lg').innerHTML = logs.join(''); if (f.add && f.upd && f.ai && !fin) { fin = true; fb('Tables 3종 체험 완료! 레코드 변화가 곧 Zap의 출발 신호가 된다는 게 핵심이에요.', 'ok'); done(); } };
  draw();
};

/* ---------- Interfaces ---------- */
LABS.interface = (root, p, done, fb) => {
  const PAL = [
    { k: 'text', ic: '🔤', n: 'Text input', lbl: '이름' },
    { k: 'email', ic: '📧', n: 'Email input', lbl: '이메일' },
    { k: 'dropdown', ic: '🔽', n: 'Dropdown', lbl: '희망과정' },
    { k: 'long', ic: '📝', n: 'Long text', lbl: '문의 내용' },
    { k: 'check', ic: '☑️', n: 'Checkbox', lbl: '개인정보 수집·이용 동의' },
    { k: 'submit', ic: '🟧', n: 'Submit button', lbl: '상담 신청하기' }
  ];
  const comps = [];
  const need = ['text', 'email', 'dropdown', 'submit'];
  const draw = () => {
    const has = k => comps.some(c => c.k === k);
    root.innerHTML = `<div class="grid2" style="grid-template-columns:220px 1fr"><div><label class="lbl" style="margin-top:0">컴포넌트 팔레트</label><div style="display:flex;flex-direction:column;gap:6px">${PAL.map(c => `<button class="appbtn" data-k="${c.k}"><span>${c.ic}</span>${c.n}</button>`).join('')}</div>
      <div style="margin-top:10px;font-size:13px">${need.map(k => `<div>${has(k) ? '✅' : '⬜'} ${PAL.find(x => x.k === k).n}</div>`).join('')}</div></div>
      <div><label class="lbl" style="margin-top:0">미리보기 — 상담 신청 페이지</label><div class="preview" style="margin-top:0;min-height:240px"><h3 style="margin-bottom:10px">📮 다인 어학원 상담 신청</h3>
      ${comps.length ? comps.map((c, i) => `<div style="position:relative;margin-bottom:8px">${render(c)}<button class="x" data-r="${i}" style="position:absolute;right:-6px;top:-8px;border:0;background:#fff;border-radius:50%;color:var(--mute)">✕</button></div>`).join('') : '<p class="muted">왼쪽에서 컴포넌트를 눌러 추가하세요.</p>'}
      </div><div class="log" id="lg" style="margin-top:10px;display:none"></div></div></div>`;
    root.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
      const c = PAL.find(x => x.k === b.dataset.k);
      if (c.k === 'submit' && has('submit')) { fb('제출 버튼은 하나면 충분해요.', 'info'); return; }
      if (c.k === 'submit') comps.push(c); else { const si = comps.findIndex(x => x.k === 'submit'); si >= 0 ? comps.splice(si, 0, c) : comps.push(c); }
      draw();
    });
    root.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { comps.splice(+b.dataset.r, 1); draw(); });
    const sb = root.querySelector('.sbm');
    if (sb) sb.onclick = async () => {
      const miss = need.filter(k => !has(k));
      if (miss.length) { fb('아직 필요한 컴포넌트가 있어요: ' + miss.map(k => PAL.find(x => x.k === k).n).join(', '), 'bad'); return; }
      const lg = root.querySelector('#lg'); lg.style.display = 'block'; lg.innerHTML = '';
      for (const m of ['📨 폼 제출됨 (김민지 · DELE B1)', '🗂️ Zapier Tables “상담DB”에 레코드 생성 (Task 0)', '⚡ Zap 트리거: New Form Submission', '💬 Slack #상담 알림 전송 (Task 1)']) { lg.appendChild(h(`<div class="logrow"><span>${m}</span></div>`)); await sleep(380); }
      fb('폼 → 데이터베이스 → 알림까지 코드 한 줄 없이 연결됐어요! 이 페이지 링크를 홈페이지 버튼에 걸면 끝.', 'ok'); done();
    };
  };
  const render = c => {
    if (c.k === 'text') return `<label class="lbl" style="margin-top:0">${c.lbl}</label><input class="input" value="김민지">`;
    if (c.k === 'email') return `<label class="lbl" style="margin-top:0">${c.lbl}</label><input class="input" value="minji.kim@example.com">`;
    if (c.k === 'dropdown') return `<label class="lbl" style="margin-top:0">${c.lbl}</label><select class="input"><option>DELE B1</option><option>DELE A2</option><option>여행 스페인어</option></select>`;
    if (c.k === 'long') return `<label class="lbl" style="margin-top:0">${c.lbl}</label><textarea class="input" rows="2">주말반이 있나요?</textarea>`;
    if (c.k === 'check') return `<label style="font-size:14px"><input type="checkbox" checked> ${c.lbl}</label>`;
    if (c.k === 'submit') return `<button class="btn sbm" style="width:100%;justify-content:center">${c.lbl}</button>`;
  };
  draw();
};

/* ---------- Chatbots ---------- */
LABS.chatbot = (root, p, done, fb) => {
  let asked = 0, wantEmail = false, fin = false;
  root.innerHTML = `<div class="grid2"><div>
    <label class="lbl" style="margin-top:0">챗봇 이름</label><input class="input" id="nm" value="다인 상담봇">
    <label class="lbl">Directive (지시문)</label><textarea class="input" id="dir" rows="4" placeholder="예) 너는 어학원 상담 직원이야. 친절한 존댓말로 3문장 이내로 답해. 자료에 없는 내용은 상담 신청으로 안내해."></textarea>
    <label class="lbl">Knowledge sources (지식 자료)</label>
    <label style="display:block"><input type="checkbox" class="kn" value="faq"> 📄 자주 묻는 질문(FAQ).pdf</label>
    <label style="display:block"><input type="checkbox" class="kn" value="price"> 💰 수강료표 (예시 데이터)</label>
    <label style="display:block"><input type="checkbox" class="kn" value="time"> 🗓️ 시간표</label>
    <label class="lbl">Lead capture</label><label><input type="checkbox" id="lead" checked> 대화 중 이메일을 받으면 Zap으로 전달</label>
  </div><div><div class="chat" style="height:400px"><div class="chat-top"><span class="claude-dot">✻</span><span id="bn">다인 상담봇</span> <span class="pill" style="margin-left:auto">미리보기</span></div>
    <div class="chat-log"><div class="msg a">안녕하세요! 무엇을 도와드릴까요? 😊</div></div>
    <div class="chat-in"><input class="input" placeholder="질문을 입력하세요"><button class="btn sm">보내기</button></div></div>
    <div class="sugg">${['수강료 얼마예요?', '주말반 있나요?', '환불 규정 알려 주세요', '상담 신청할게요'].map(s => `<button>${s}</button>`).join('')}</div></div></div>`;
  const logEl = root.querySelector('.chat-log'), inp = root.querySelector('.chat-in input');
  root.querySelector('#nm').oninput = e => root.querySelector('#bn').textContent = e.target.value || '챗봇';
  const kn = () => [...root.querySelectorAll('.kn:checked')].map(x => x.value);
  const add = (t, c) => { const m = h(`<div class="msg ${c}"></div>`); m.innerHTML = t; logEl.appendChild(m); logEl.scrollTop = 1e5; return m; };
  const answer = q => {
    const K = kn(), dirOk = root.querySelector('#dir').value.trim().length >= 20;
    if (wantEmail && /@/.test(q)) { wantEmail = false; return ['감사합니다! 담당 선생님이 하루 안에 연락드릴게요. 📮', root.querySelector('#lead').checked ? '⚡ Lead capture → Zap 실행: Tables “상담DB” 저장 + Slack 알림' : null]; }
    if (/상담|신청|등록/.test(q)) { wantEmail = true; return ['상담 신청을 도와드릴게요. 연락받으실 이메일 주소를 알려 주세요.']; }
    const pre = (!dirOk ? '<span class="muted" style="font-size:12px">(지시문이 짧아 말투·범위가 들쭉날쭉할 수 있어요)</span><br>' : '');
    if (/수강료|가격|얼마|비용/.test(q)) return [pre + (K.includes('price') ? '수강료표 기준(예시)으로 DELE B1 과정은 월 350,000원이에요. 정확한 금액은 상담 시 안내드려요.' : '죄송해요, 수강료 자료가 연결되어 있지 않아 정확히 답하기 어려워요. 상담 신청을 남겨 주시면 안내드릴게요.')];
    if (/주말|시간|요일|시간표/.test(q)) return [pre + (K.includes('time') ? '네! 토요일 오전 10시 반과 일요일 오후 2시 반이 있어요(예시).' : '시간표 자료가 없어 확인이 어려워요. 상담 신청으로 안내드릴게요.')];
    if (/환불|취소/.test(q)) return [pre + (K.includes('faq') ? 'FAQ 기준으로 수업 시작 전에는 전액, 시작 후에는 남은 회차 기준으로 환불돼요(예시).' : 'FAQ 자료가 없어 규정을 확인할 수 없어요. 상담 신청을 남겨 주세요.')];
    return [pre + (K.length ? '자료에서 찾을 수 없는 질문이에요. 상담 신청을 남겨 주시면 선생님이 직접 답해 드릴게요.' : '(지식 자료가 하나도 연결되지 않았어요) 일반적인 답만 드릴 수 있어요.')];
  };
  const send = async q => {
    q = q.trim(); if (!q) return; add(esc(q), 'u'); inp.value = '';
    const t = add('<span class="typing"><i></i><i></i><i></i></span>', 'a'); await sleep(650); t.remove();
    const [a, sys] = answer(q); add(a, 'a'); if (sys) add(sys, 'sys');
    asked++;
    const okCfg = root.querySelector('#dir').value.trim().length >= 20 && kn().includes('faq');
    if (!fin && asked >= 2 && okCfg) { fin = true; fb('챗봇 완성! 지식 자료가 있을 때와 없을 때 답이 어떻게 달라지는지 체크박스를 바꿔 가며 더 실험해 보세요.', 'ok'); done(); }
    else if (asked >= 2 && !okCfg) fb('대화는 잘 되지만 설정이 부족해요: 지시문 20자 이상 + FAQ 자료 연결이 필요해요.', 'bad');
  };
  root.querySelector('.chat-in .btn').onclick = () => send(inp.value);
  inp.onkeydown = e => { if (e.key === 'Enter') send(inp.value); };
  root.querySelectorAll('.sugg button').forEach(b => b.onclick = () => send(b.textContent));
};

/* ---------- Canvas ---------- */
LABS.canvas = (root, p, done, fb) => {
  const PAL = [['human', '🙋', '사람: 문의 확인'], ['iface', '🧩', 'Interface: 상담 폼'], ['table', '🗂️', 'Table: 상담DB'], ['ai', '✻', 'AI: 문의 분류'], ['paths', '🔀', 'Paths: 언어별 분기'], ['slack', '💬', 'Slack 알림'], ['mail', '✉️', '답장 초안'], ['cal', '📅', '레벨테스트 일정'], ['pay', '💳', '결제'], ['agent', '🕵️', 'Agent: 일정 조율']];
  let nodes = [], fin = false;
  const draw = () => {
    root.innerHTML = `<div class="palette">${PAL.map(x => `<button data-k="${x[0]}">${x[1]} ${x[2]}</button>`).join('')}</div>
      <div class="cv">${nodes.length ? nodes.map((n, i) => `${i ? '<span class="cvarrow">→</span>' : ''}<span class="cvnode ${n.auto ? 'auto' : ''}" data-i="${i}" title="눌러서 ⚡자동화 표시">${n.auto ? '⚡' : ''}${n.ic} ${n.n}<button class="del" data-d="${i}">✕</button></span>`).join('') : '<span class="muted">팔레트에서 노드를 눌러 흐름을 그리세요</span>'}</div>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn claude sm" id="cp">✻ Copilot으로 초안 그리기</button><button class="btn ghost sm" id="clr">지우기</button></div>
      <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap" id="ck"></div>`;
    root.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const x = PAL.find(y => y[0] === b.dataset.k); nodes.push({ k: x[0], ic: x[1], n: x[2], auto: false }); draw(); });
    root.querySelectorAll('.cvnode').forEach(el => el.onclick = e => { if (e.target.dataset.d !== undefined) return; nodes[el.dataset.i].auto = !nodes[el.dataset.i].auto; draw(); });
    root.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { nodes.splice(+b.dataset.d, 1); draw(); });
    root.querySelector('#cp').onclick = async () => {
      nodes = []; draw();
      for (const k of ['iface', 'table', 'ai', 'paths', 'slack', 'human', 'cal', 'pay']) { const x = PAL.find(y => y[0] === k); nodes.push({ k, ic: x[1], n: x[2], auto: false }); draw(); await sleep(160); }
      fb('Copilot이 초안을 그렸어요. 이제 자동화할 노드를 눌러 ⚡ 표시해 보세요. (사람 확인 단계는 사람에게 남겨 두는 것도 설계예요!)', 'info');
    };
    root.querySelector('#clr').onclick = () => { nodes = []; draw(); };
    const c = { n5: nodes.length >= 5, iface: nodes.some(n => n.k === 'iface'), table: nodes.some(n => n.k === 'table'), ai: nodes.some(n => n.k === 'ai'), auto: nodes.filter(n => n.auto).length >= 2 };
    root.querySelector('#ck').innerHTML = [['n5', '노드 5개+'], ['iface', 'Interface'], ['table', 'Table'], ['ai', 'AI 단계'], ['auto', '⚡ 2개+']].map(([k, l]) => `<span class="pill ${c[k] ? 'ok' : ''}">${c[k] ? '✅' : '⬜'} ${l}</span>`).join('');
    if (Object.values(c).every(Boolean) && !fin) { fin = true; fb('업무 지도 완성! 실제 Canvas에서는 ⚡ 노드를 바로 Zap으로 만들어 연결할 수 있어요.', 'ok'); done(); }
  };
  draw();
};

/* ---------- Copilot ---------- */
LABS.copilot = (root, p, done, fb) => {
  const TRIG = [
    [/구글\s*폼|google\s*forms?|폼에|폼으로|신청서/i, '📝', 'Google Forms', 'New Form Response'],
    [/gmail|지메일|메일이 오면|메일이 들어오면|이메일이 오면|메일 오면/i, '✉️', 'Gmail', 'New Email'],
    [/매일|매주|매달|매월|아침마다|정기적으로|스케줄/i, '⏰', 'Schedule by Zapier', 'Every Day'],
    [/시트에 (새 )?행이|시트에 추가되면/i, '📊', 'Google Sheets', 'New Spreadsheet Row'],
    [/테이블|tables/i, '🗂️', 'Zapier Tables', 'New Record'],
    [/웹훅|webhook/i, '🪝', 'Webhooks by Zapier', 'Catch Hook'],
    [/캘린더에 (새 )?일정이|일정이 생기면/i, '📅', 'Google Calendar', 'New Event']
  ];
  const ACT = [
    [/슬랙|slack/i, '💬', 'Slack', 'Send Channel Message'],
    [/답장 초안|초안/i, '✉️', 'Gmail', 'Create Draft'],
    [/메일(로|을)? (보내|알려|발송)|이메일(로|을)? (보내|알려|발송)/i, '✉️', 'Gmail', 'Send Email'],
    [/시트에 (기록|저장|추가|정리)|스프레드시트|구글 시트/i, '📊', 'Google Sheets', 'Create Spreadsheet Row'],
    [/캘린더|일정(을)? (잡|등록|만들)/i, '📅', 'Google Calendar', 'Create Detailed Event'],
    [/노션|notion/i, '📓', 'Notion', 'Create Database Item']
  ];
  const ex = ['구글 폼에 상담이 들어오면 스페인어 문의만 골라 Claude로 요약하고 슬랙으로 알려 줘', '매일 아침 8시에 테이블의 어제 문의를 요약해서 메일로 보내 줘', 'Gmail에 상담 메일이 오면 내용을 분류해서 구글 시트에 기록하고 답장 초안을 만들어 줘'];
  root.innerHTML = `<div class="chat" style="height:auto"><div class="chat-top"><span>🪄</span> Copilot</div><div style="padding:12px">
    <textarea class="input" rows="3" placeholder="예) 구글 폼에 상담이 들어오면 …"></textarea>
    <div class="sugg">${ex.map(e => `<button>${e}</button>`).join('')}</div>
    <button class="btn" style="margin-top:10px">✨ Zap 초안 생성</button></div></div><div class="out" style="margin-top:12px"></div>`;
  const ta = root.querySelector('textarea');
  root.querySelectorAll('.sugg button').forEach(b => b.onclick = () => ta.value = b.textContent);
  root.querySelector('.btn').onclick = async () => {
    const q = ta.value.trim(), out = root.querySelector('.out');
    if (q.length < 8) { fb('조금 더 자세히 설명해 주세요. 언제 + 무엇을!', 'bad'); return; }
    out.innerHTML = '<div class="muted">🪄 Copilot이 생각하는 중…</div>'; await sleep(800);
    let trig = null, tpos = 1e9;
    TRIG.forEach(t => { const m = q.match(t[0]); if (m && m.index < tpos) { tpos = m.index; trig = t; } });
    if (trig && trig[2] === 'Schedule by Zapier' && /매주/.test(q)) trig = [trig[0], trig[1], trig[2], 'Every Week'];
    const steps = [];
    if (trig) steps.push({ k: 'TRIGGER', ic: trig[1], t: `${trig[2]} · ${trig[3]}` });
    if (trig && trig[2] === 'Schedule by Zapier' && /테이블|시트|어제|지난/.test(q)) steps.push({ k: 'ACTION', ic: '🗂️', t: /테이블/.test(q) ? 'Zapier Tables · Find Records (기간 조건)' : 'Google Sheets · Lookup Spreadsheet Rows' });
    const cond = q.match(/([가-힣A-Za-z0-9 ]{1,12}?)(만|인 경우|일 때만)\s/);
    if (cond) steps.push({ k: 'FILTER', ic: '🚦', t: `Filter · “${cond[1].trim()}” 조건일 때만 계속` });
    if (/별로|분기|경우에 따라/.test(q)) steps.push({ k: 'PATHS', ic: '🔀', t: 'Paths · 조건별 분기' });
    if (/claude|요약|분류|정리해|번역|분석/i.test(q)) steps.push({ k: 'ACTION', ic: '✻', t: /claude/i.test(q) ? 'Anthropic (Claude) · Send Message (요약/분류)' : 'AI by Zapier · 프롬프트 (요약/분류)' });
    const acts = ACT.map(a => ({ a, m: q.match(a[0]) })).filter(x => x.m && !(trig && x.a[2] === trig[2] && x.a[2] !== 'Gmail')).sort((x, y) => x.m.index - y.m.index);
    const seen = new Set();
    acts.forEach(({ a }) => { const key = a[2] + a[3]; if (seen.has(key)) return; if (a[3] === 'Send Email' && seen.has('GmailCreate Draft')) return; seen.add(key); steps.push({ k: 'ACTION', ic: a[1], t: `${a[2]} · ${a[3]}` }); });
    const qs = [];
    if (!trig) qs.push('언제 시작할까요? (예: 폼 제출 시, 메일 수신 시, 매일 아침)');
    if (!steps.some(s => s.k === 'ACTION')) qs.push('무엇을 해 드릴까요? (예: 슬랙 알림, 시트 기록, 메일 발송)');
    if (steps.some(s => s.t.startsWith('Slack'))) qs.push('어느 Slack 채널로 보낼까요?');
    out.innerHTML = `<div class="zap-ed">${steps.map((s, i) => `${i ? '<div class="zline"></div>' : ''}<div class="zstep"><div class="zh"><div class="zi">${s.ic}</div><div><div class="zk">${i + 1}. ${s.k}</div><div class="zt">${esc(s.t)}</div></div></div></div>`).join('') || '<p class="muted">단계를 만들 수 없었어요.</p>'}</div>
      ${qs.length ? `<div class="msg a" style="max-width:100%;margin-top:10px">🪄 Copilot의 질문<br>${qs.map(x => '• ' + x).join('<br>')}</div>` : ''}`;
    if (steps.length >= 3 && trig) { fb(`Copilot이 ${steps.length}단계 Zap 초안을 만들었어요! 실제 Copilot도 이렇게 초안을 만든 뒤 빠진 정보를 되물어요. 질문에 답하며 다듬어 가는 게 요령!`, 'ok'); done(); }
    else fb('초안이 아직 빈약해요. “언제(트리거) + 조건 + 무엇을(액션 2개 이상)”을 넣어 다시 설명해 보세요.', 'bad');
  };
};

/* ---------- AI 프롬프트 실험실 ---------- */
LABS.prompt = (root, p, done, fb) => {
  const leads = [LEADS[1], LEADS[3], LEADS[5]];
  const R = {
    2: { cat: '수강문의', urg: '높음', rep: '박준호님, 문의 감사합니다. TOEIC Speaking 빠른 시작 일정을 오늘 중 안내드리겠습니다.', sum: '업무용 점수 필요, 빠른 시작 희망', lang: '한국어' },
    4: { cat: '수강문의', urg: '보통', rep: 'Bonjour Carlos ! 12월 DELF A1 반 일정을 곧 안내드리겠습니다.', sum: '12월 시작 희망', lang: '프랑스어' },
    6: { cat: '환불·불만', urg: '높음', rep: '정우성님, 불편을 드려 죄송합니다. 환불 규정을 안내드리고 원장이 직접 연락드리겠습니다.', sum: '환불 규정 문의, 불만 있음', lang: '한국어' }
  };
  const loose = { 2: '문의', 4: 'Question / 요청', 6: '불만 제기' };
  const fields = [];
  let fin = false;
  root.innerHTML = `<div class="box"><div class="box-h">✻ AI 단계 · 프롬프트</div><div style="padding:12px 14px">
    <div class="sugg" style="margin:0 0 6px">${['{{이름}}', '{{희망과정}}', '{{문의내용}}'].map(v => `<button data-v="${v}">+ ${v}</button>`).join('')}</div>
    <textarea class="input" rows="7" id="pr">너는 어학원 상담 매니저야.
아래 문의를 읽고 분류해 줘.

이름: {{이름}}</textarea>
    <label class="lbl">출력 필드 (다음 단계에서 매핑할 이름)</label>
    <div style="display:flex;gap:8px"><input class="input" id="fn" placeholder="예) 카테고리"><button class="btn sm ghost" id="fa">+ 필드</button></div>
    <div class="datachips" id="fl" style="margin-top:8px"></div>
    <div id="chk" style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"></div>
    <button class="btn claude" id="run" style="margin-top:12px">▶ 3건에 실행</button></div></div><div id="res" style="margin-top:12px"></div>`;
  const pr = root.querySelector('#pr');
  const status = () => {
    const t = pr.value;
    const c = { v: t.includes('{{문의내용}}'), f: fields.length >= 2, cat: /수강문의/.test(t) && /(환불|불만)/.test(t) };
    root.querySelector('#chk').innerHTML = [['v', '{{문의내용}} 매핑'], ['f', '출력 필드 2개+'], ['cat', '카테고리 선택지 명시']].map(([k, l]) => `<span class="pill ${c[k] ? 'ok' : ''}">${c[k] ? '✅' : '⬜'} ${l}</span>`).join('');
    return c;
  };
  const drawF = () => { root.querySelector('#fl').innerHTML = fields.map((f, i) => `<span class="dchip"><b>${esc(f)}</b><a href="#" data-x="${i}" style="color:inherit;text-decoration:none">✕</a></span>`).join('') || '<span class="muted" style="font-size:13px">아직 없음 → 결과가 긴 문장 하나로만 나와요</span>'; root.querySelectorAll('[data-x]').forEach(a => a.onclick = e => { e.preventDefault(); fields.splice(+a.dataset.x, 1); drawF(); status(); }); };
  root.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const s = pr.selectionStart ?? pr.value.length; pr.value = pr.value.slice(0, s) + b.dataset.v + pr.value.slice(s); pr.focus(); status(); });
  pr.oninput = status;
  const addF = () => { const v = root.querySelector('#fn').value.trim(); if (v && !fields.includes(v)) fields.push(v); root.querySelector('#fn').value = ''; drawF(); status(); };
  root.querySelector('#fa').onclick = addF; root.querySelector('#fn').onkeydown = e => { if (e.key === 'Enter') addF(); };
  drawF(); status();
  const val = (f, id, c) => {
    const r = R[id];
    if (/카테고리|분류|유형/.test(f)) return c.cat ? r.cat : loose[id];
    if (/긴급|우선/.test(f)) return r.urg;
    if (/답장|초안|회신/.test(f)) return r.rep;
    if (/요약/.test(f)) return r.sum;
    if (/언어/.test(f)) return r.lang;
    return '(무엇을 넣을지 프롬프트에 설명이 없어 추측함)';
  };
  root.querySelector('#run').onclick = async () => {
    const c = status(), res = root.querySelector('#res');
    res.innerHTML = '<div class="muted">✻ Claude가 3건을 처리하는 중…</div>'; await sleep(900);
    if (!c.v) { res.innerHTML = `<div class="tblwrap"><table class="tbl"><tr><th>문의자</th><th>AI 출력</th></tr>${leads.map(l => `<tr><td>${l.이름}</td><td class="ai">문의해 주셔서 감사합니다. 어떤 내용인지 알려 주시면 분류해 드릴게요.</td></tr>`).join('')}</table></div>`; fb('AI가 문의 내용을 못 받았어요! 프롬프트에 {{문의내용}}을 넣지 않으면 AI는 아무것도 모르는 상태예요.', 'bad'); return; }
    if (!c.f) { res.innerHTML = `<div class="tblwrap"><table class="tbl"><tr><th>문의자</th><th>AI 출력 (한 덩어리)</th></tr>${leads.map(l => `<tr><td>${l.이름}</td><td class="ai">${esc(R[l.id].sum)}인 것 같고, ${c.cat ? R[l.id].cat : loose[l.id]}로 보입니다. 답장은 이렇게 해 보세요: ${esc(R[l.id].rep)}</td></tr>`).join('')}</table></div>`; fb('내용은 좋은데 한 문단으로 섞여 나와서 다음 단계(Paths)에서 “카테고리”만 꺼내 쓸 수 없어요. 출력 필드를 2개 이상 정하세요.', 'bad'); return; }
    res.innerHTML = `<div class="tblwrap"><table class="tbl"><tr><th>문의자</th>${fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr>${leads.map(l => `<tr><td>${l.이름}<div class="muted" style="font-size:12px">${esc(l.문의내용)}</div></td>${fields.map(f => `<td class="ai">${esc(val(f, l.id, c))}</td>`).join('')}</tr>`).join('')}</table></div>`;
    if (!c.cat) { fb('구조는 좋아요! 그런데 카테고리 이름이 “문의”, “Question / 요청”처럼 매번 달라요. 프롬프트에 “수강문의 / 환불·불만 / 기타 중 하나”라고 선택지를 적어 주세요. 그래야 Paths 조건이 정확히 맞아요.', 'bad'); return; }
    if (!fin) { fin = true; fb('훌륭한 프롬프트! 데이터 매핑 + 정해진 선택지 + 출력 필드 = 다음 단계에서 믿고 쓸 수 있는 AI 결과예요.', 'ok'); done(); }
  };
};

/* ---------- Agents ---------- */
LABS.agent = (root, p, done, fb) => {
  const TOOLS = [['find', 'Gmail · Find Email', '메일 검색·읽기'], ['draft', 'Gmail · Create Draft', '답장 초안 작성'], ['send', 'Gmail · Send Email', '메일 발송'], ['del', 'Gmail · Delete Email', '메일 삭제'], ['row', 'Google Sheets · Create Spreadsheet Row', '상담 기록'], ['dm', 'Slack · Send Direct Message', '담당자에게 DM']];
  const on = { find: true, draft: false, send: true, del: true, row: true, dm: false };
  let fin = false;
  root.innerHTML = `<div class="grid2"><div>
    <label class="lbl" style="margin-top:0">에이전트 이름</label><input class="input" value="상담 메일 도우미">
    <label class="lbl">Instructions (지시문)</label><textarea class="input" id="ins" rows="5">새 상담 메일이 오면 처리해.</textarea>
    <label class="lbl">Trigger</label><select class="input"><option>Gmail · New Labeled Email (상담 라벨)</option><option>채팅에서 직접 호출</option></select>
  </div><div><div class="box"><div class="box-h">🧰 Tools (도구 권한)</div>${TOOLS.map(t => `<div class="trow"><div class="tn">${t[1]}<small>${t[2]}</small></div><label class="switch"><input type="checkbox" data-t="${t[0]}" ${on[t[0]] ? 'checked' : ''}><span></span></label></div>`).join('')}
    <div class="trow" style="background:var(--warn-l)"><div class="tn">🙋 보내기 전 사람 승인<small>Human-in-the-loop</small></div><label class="switch"><input type="checkbox" id="hitl"><span></span></label></div></div></div></div>
    <button class="btn" style="margin-top:12px" id="run">▶ 테스트 실행</button><div class="log" id="lg" style="margin-top:12px;display:none"></div>`;
  root.querySelectorAll('[data-t]').forEach(c => c.onchange = () => on[c.dataset.t] = c.checked);
  root.querySelector('#run').onclick = async () => {
    const ins = root.querySelector('#ins').value.trim(), hitl = root.querySelector('#hitl').checked;
    const warn = [];
    if (ins.length < 30) warn.push('지시문이 너무 짧아요(30자 이상). 무엇을, 어떤 기준으로, 무엇은 하지 말지 적어 주세요.');
    if (!on.draft) warn.push('답장 초안을 쓰려면 <b>Gmail · Create Draft</b> 도구가 필요해요.');
    if (on.del) warn.push('🚨 <b>Delete Email</b> 권한이 켜져 있어요. 이 업무에 삭제는 필요 없어요 — 최소 권한!');
    if (on.send && !hitl) warn.push('🚨 <b>Send Email</b>이 승인 없이 켜져 있어요. AI가 잘못된 답장을 바로 보낼 수 있어요. 끄거나 사람 승인을 켜세요.');
    const lg = root.querySelector('#lg'); lg.style.display = 'block';
    if (warn.length) { lg.innerHTML = warn.map(w => `<div class="logrow"><span>⚠️</span><span>${w}</span></div>`).join(''); fb('안전 점검에서 막혔어요. 위 경고를 해결해 주세요.', 'bad'); return; }
    lg.innerHTML = '';
    const steps = ['📩 트리거: “상담” 라벨 메일 도착 (보낸 사람: 박준호)', '🔎 Gmail · Find Email → 본문 읽기', '🧠 판단: TOEIC Speaking 수강문의 · 긴급도 높음', on.row ? '📊 Google Sheets · 상담 기록 행 추가' : null, '✍️ Gmail · Create Draft → 답장 초안 작성', on.dm ? '💬 Slack · 담당자에게 DM' : null].filter(Boolean);
    for (const s of steps) { lg.appendChild(h(`<div class="logrow"><span class="t">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span><span>${s}</span></div>`)); await sleep(420); }
    if (on.send && hitl) {
      const r = h(`<div class="logrow" style="background:var(--warn-l)"><span>⏸️</span><span>사람 승인 대기: “박준호님께 답장 발송” <button class="btn sm" style="margin-left:6px">✅ 승인</button> <button class="btn sm ghost">✋ 거절</button></span></div>`);
      lg.appendChild(r);
      const [a, b] = r.querySelectorAll('button');
      a.onclick = () => { r.innerHTML = '<span>✅</span><span>승인됨 → Gmail · Send Email 발송 완료</span>'; finish(); };
      b.onclick = () => { r.innerHTML = '<span>✋</span><span>거절됨 → 초안으로 남겨 둠. 에이전트가 거절 사유를 기록</span>'; finish(); };
    } else { lg.appendChild(h('<div class="logrow"><span>📝</span><span>발송 권한 없음 → 초안함에 저장. 사람이 검토 후 직접 발송</span></div>')); finish(); }
  };
  const finish = () => { if (fin) return; fin = true; fb('안전한 에이전트 완성! 일은 AI가 하고, 중요한 결정은 사람이 하는 구조예요.', 'ok'); done(); };
};

/* ---------- MCP 권한 ---------- */
LABS.mcpScope = (root, p, done, fb) => {
  const T = [['gf', 'Gmail · Find Email', true], ['gd', 'Gmail · Create Draft', true], ['gs', 'Gmail · Send Email', false], ['gx', 'Gmail · Delete Email', false], ['cf', 'Google Calendar · Find Event', true], ['cc', 'Google Calendar · Create Detailed Event', true]];
  root.innerHTML = `<div class="box"><div class="box-h">🔌 mcp.zapier.com · My Claude Server · Tools</div>${T.map(t => `<div class="trow"><div class="tn">${t[1]}</div><label class="switch"><input type="checkbox" data-k="${t[0]}" checked><span></span></label></div>`).join('')}</div><button class="btn" style="margin-top:12px">💾 Save</button>`;
  root.querySelector('.btn').onclick = () => {
    const bad = T.filter(t => root.querySelector(`[data-k="${t[0]}"]`).checked !== t[2]);
    if (!bad.length) { fb('완벽한 권한 설계! 이제 Claude가 실수로 “보내 줘”라는 말을 오해해도 메일이 나가지 않아요. 이 설정은 Zapier에서 한 번 정하면 그 서버를 쓰는 AI 도구 모두에 적용돼요.', 'ok'); done(); }
    else fb('다시 보세요: ' + bad.map(t => `<b>${t[1]}</b>`).join(', '), 'bad');
  };
};

/* ---------- MCP 채팅 ---------- */
LABS.mcpChat = (root, p, done, fb) => {
  let tasks = 0, calls = 0, fin = false;
  const S = [
    { q: '내일 일정 뭐 있는지 알려 줘', re: /일정.*(뭐|알려|확인)|내일 일정/, tool: 'google_calendar_find_events', args: '{ "start": "2026-11-21T00:00", "end": "2026-11-21T23:59" }', res: '2 events found', a: '내일 일정은 2개예요.\n• 10:00 박준호님 TOEIC 첫 수업\n• 16:00 KCIS 스페인어 수업\n오후 1~4시가 비어 있어요.' },
    { q: '내일 오후 3시에 김민지님 레벨테스트 30분 잡아 줘', re: /(잡아|등록|만들어).*|레벨테스트/, tool: 'google_calendar_create_detailed_event', args: '{ "summary": "김민지님 레벨테스트", "start": "2026-11-21T15:00", "end": "2026-11-21T15:30" }', res: 'event created', a: '캘린더에 등록했어요 ✅\n“김민지님 레벨테스트” 11/21(토) 15:00–15:30' },
    { q: '김민지님께 레벨테스트 안내 메일 초안 써 줘', re: /초안/, tool: 'gmail_create_draft', args: '{ "to": "minji.kim@example.com", "subject": "[다인] 레벨테스트 안내" }', res: 'draft saved', a: 'Gmail 초안함에 저장했어요 ✉️\n제목: [다인] 레벨테스트 안내\n“김민지님, 11월 21일 오후 3시 레벨테스트 일정을 안내드립니다…”\n보내기 전에 한 번 확인해 주세요.' },
    { q: '그 메일 바로 보내 줘', re: /보내|발송/, deny: true, a: '죄송해요, 이 MCP 서버에는 메일 발송(Send Email) 권한이 꺼져 있어서 보낼 수 없어요. Gmail 초안함에서 확인 후 직접 보내 주세요. (권한이 없어서 Task도 쓰이지 않았어요)' },
    { q: '이번 주 상담 메일 몇 통 왔어?', re: /몇 통|메일.*(왔|찾)/, tool: 'gmail_find_email', args: '{ "query": "label:상담 newer_than:7d" }', res: '5 messages', a: '이번 주 “상담” 라벨 메일은 5통이에요. 그중 2통(환불 문의, TOEIC 급한 문의)은 아직 답장이 없어요.' }
  ];
  root.innerHTML = `<div class="chat"><div class="chat-top"><span class="claude-dot">✻</span> Claude <span class="pill zap" style="margin-left:6px">🔌 Zapier MCP 연결됨</span><span class="pill" style="margin-left:auto" id="tk">Task 0</span></div>
    <div class="chat-log"><div class="msg sys">Zapier MCP 도구 4개 사용 가능: Gmail(Find, Draft) · Calendar(Find, Create)</div></div>
    <div class="chat-in"><input class="input" placeholder="Claude에게 일을 시켜 보세요"><button class="btn sm claude">보내기</button></div></div>
    <div class="sugg">${S.map(s => `<button>${s.q}</button>`).join('')}</div>`;
  const log = root.querySelector('.chat-log'), inp = root.querySelector('.chat-in input');
  const add = (t, c) => { const m = h(`<div class="msg ${c}"></div>`); m.innerHTML = t; log.appendChild(m); log.scrollTop = 1e5; return m; };
  const send = async q => {
    q = q.trim(); if (!q) return; inp.value = ''; add(esc(q), 'u');
    const s = S.find(x => x.q === q) || S.find(x => x.re.test(q));
    const t = add('<span class="typing"><i></i><i></i><i></i></span>', 'a'); await sleep(600); t.remove();
    if (!s) { add('이 연습장에서는 아래 추천 요청으로 체험할 수 있어요. 실제 Claude에서는 연결한 앱·액션 범위 안에서 자유롭게 요청할 수 있어요.', 'a'); return; }
    if (s.deny) { add(esc(s.a), 'a'); fb('권한 범위 밖의 요청은 Claude가 실행할 수 없어요. 앞 단계에서 정한 권한이 이렇게 지켜 줘요.', 'info'); return; }
    add(`🔧 ${s.tool}\n${esc(s.args)}`, 'tool'); await sleep(700);
    add(`↩︎ ${s.res}`, 'tool'); tasks += 2; calls++; root.querySelector('#tk').textContent = 'Task ' + tasks;
    await sleep(300); add(esc(s.a), 'a');
    if (calls >= 2 && !fin) { fin = true; fb(`Claude가 Zapier 도구를 ${calls}번 호출해 실제 앱을 움직였어요. 성공한 호출마다 2 Task씩 → 지금까지 ${tasks} Task. 추천 요청 중 “바로 보내 줘”도 눌러 보세요!`, 'ok'); done(); }
  };
  root.querySelector('.chat-in .btn').onclick = () => send(inp.value);
  inp.onkeydown = e => { if (e.key === 'Enter') send(inp.value); };
  root.querySelectorAll('.sugg button').forEach(b => b.onclick = () => send(b.textContent));
};

/* ---------- Next Gen Zaps ---------- */
LABS.nextgen = (root, p, done, fb) => {
  root.innerHTML = `<div class="grid2" style="grid-template-columns:1.2fr 1fr"><div class="chat" style="height:470px"><div class="chat-top"><span class="claude-dot">✻</span> Claude <span class="pill zap" style="margin-left:6px">🔌 Zapier MCP</span></div><div class="chat-log"></div><div class="chat-in" id="act"></div></div>
    <div><div class="box"><div class="box-h">🧭 Workflow Manager</div><div id="wm" style="padding:12px 14px"><span class="muted">아직 배포된 워크플로가 없어요.</span></div></div></div></div>`;
  const log = root.querySelector('.chat-log'), act = root.querySelector('#act'), wm = root.querySelector('#wm');
  const add = (t, c) => { const m = h(`<div class="msg ${c}"></div>`); m.innerHTML = t; log.appendChild(m); log.scrollTop = 1e5; };
  const btn = (label, fn, cls = 'claude') => { act.innerHTML = ''; const b = h(`<button class="btn ${cls}" style="width:100%;justify-content:center">${label}</button>`); b.onclick = () => { b.disabled = true; fn(); }; act.appendChild(b); };
  const typing = async ms => { const t = h('<div class="msg a"><span class="typing"><i></i><i></i><i></i></span></div>'); log.appendChild(t); log.scrollTop = 1e5; await sleep(ms); t.remove(); };
  btn('① 요청 보내기: “매일 아침 8시 상담 요약을 Slack에…”', async () => {
    add('매일 아침 8시에 지난 24시간 상담 문의(Zapier Tables)를 요약해서 Slack #원장실에 올리는 워크플로 만들어 줘. 배포 전에 계획 먼저 보여 줘.', 'u');
    await typing(900);
    add('계획을 정리했어요. 확인해 주세요 👇\n\n1. ⏰ Schedule · Every Day 08:00 (KST)\n2. 🗂️ Zapier Tables · 상담DB에서 최근 24시간 레코드 찾기\n3. ✻ AI 단계 · 건수/과정별/긴급 3건 요약\n4. 💬 Slack · #원장실에 메시지\n\n예상 Task: Tables 0 + AI 1 + Slack 1 = 하루 약 2 Task\n승인하시면 Next Gen Zap으로 배포할게요.', 'a');
    btn('② ✅ 계획 승인하고 배포', async () => {
      add('좋아요, 배포해 줘.', 'u'); await typing(700);
      add('🔧 deploy_workflow → “상담 아침 브리핑” v1', 'tool');
      add('배포했어요! 이제 노트북을 덮어도 매일 아침 8시에 실행돼요.', 'a');
      wm.innerHTML = `<b>상담 아침 브리핑</b> <span class="pill ok">● Running</span><div class="muted" style="font-size:13px;margin:4px 0 8px">v1 · 다음 실행 11/21 08:00</div><div class="log" id="wl"></div>`;
      btn('③ ⏩ 다음 날 아침으로 시간 넘기기', async () => {
        const wl = root.querySelector('#wl');
        for (const [s, c] of [['08:00 ⏰ Schedule 출발', ''], ['08:00 🗂️ 레코드 4건 찾음', ''], ['08:00 ✻ 요약 생성', ''], ['08:00 💬 Slack 전송 실패: channel_not_found', 'e']]) { wl.appendChild(h(`<div class="logrow"><span>${s}</span>${c ? '<span class="status e">Error</span>' : ''}</div>`)); await sleep(450); }
        await typing(800);
        add('🛠️ 오늘 아침 실행이 Slack 단계에서 실패했어요. 확인해 보니 #원장실 채널 이름이 #director로 바뀌었어요.\n수정안: Slack 채널 #원장실 → #director\n변경 내용을 검토하고 승인해 주시면 새 버전으로 배포하고 놓친 실행을 다시 돌릴게요.', 'a');
        btn('④ 🔍 변경 내용 검토 후 승인', async () => {
          add(`<div style="font-family:var(--mono);font-size:12.5px">step 4 · Slack · Send Channel Message<br><span style="color:var(--bad)">- channel: #원장실</span><br><span style="color:var(--ok)">+ channel: #director</span></div>`, 'a');
          add('확인했어요. 승인!', 'u'); await typing(700);
          add('🔧 publish_version → v2  ·  🔧 replay_run', 'tool');
          add('v2로 배포하고 오늘 아침 실행을 다시 돌렸어요. Slack #director에 요약이 올라갔어요 ✅', 'a');
          wm.innerHTML = `<b>상담 아침 브리핑</b> <span class="pill ok">● Running</span><div class="muted" style="font-size:13px;margin:4px 0 8px">v2 · 다음 실행 11/22 08:00</div><div class="log"><div class="logrow"><span class="t">v2</span><span>Slack 채널 #원장실 → #director (승인: 나)</span></div><div class="logrow"><span class="t">v1</span><span>최초 배포 (Claude via MCP)</span></div><div class="logrow"><span>08:00 재실행 성공</span><span class="status s">Success</span></div></div>`;
          act.innerHTML = '<div class="muted" style="padding:6px">🎉 완료! 설계 → 승인 → 배포 → 자동 수리 → 버전 기록</div>';
          fb('Next Gen Zaps의 핵심 흐름을 체험했어요. AI가 만들고 고치되, 무엇이 바뀌었는지는 버전 기록으로 사람이 확인해요.', 'ok'); done();
        });
      }, 'dark');
    });
  });
};

/* ---------- 최종 프로젝트 ---------- */
LABS.capstone = (root, p, done, fb) => {
  const ST = [
    ['접수', '홈페이지에서 상담 신청 받기', ['Zapier Interfaces 폼', 'Schedule by Zapier', 'Digest by Zapier']],
    ['저장', '신청 내용을 데이터베이스에 보관', ['Zapier Tables', 'Delay by Zapier', 'Looping by Zapier']],
    ['분석', '문의를 읽고 카테고리·긴급도 판단', ['AI 단계 (Claude) 분류·요약', 'Formatter by Zapier', 'Filter by Zapier']],
    ['분기', '카테고리별로 다른 처리', ['Paths by Zapier', 'Sub-Zap', 'Storage by Zapier']],
    ['알림', '담당 선생님에게 실시간 알림', ['Slack · Send Channel Message', 'Webhooks · GET', 'Digest by Zapier']],
    ['답장', '신청자에게 보낼 답장 준비', ['Gmail · Create Draft', 'Gmail · Send Email (즉시)', 'Gmail · Delete Email']],
    ['검토', '중요한 답장은 사람이 확인', ['사람 승인 (Human-in-the-loop)', '검토 없이 자동 발송', 'Autoreplay']],
    ['보고', '매일 아침 원장에게 요약 보고', ['Schedule + AI 요약 (Next Gen Zap)', 'Copilot', 'Canvas']]
  ];
  root.innerHTML = ST.map((s, i) => `<div class="stage"><span class="num">${i + 1}</span><div><b>${s[0]}</b><div class="muted" style="font-size:13px">${s[1]}</div></div><select class="input" data-i="${i}"><option value="">— 도구 선택 —</option>${shuffle(s[2]).map(o => `<option>${o}</option>`).join('')}</select></div>`).join('') +
    `<button class="btn" style="margin-top:14px" id="go">▶ 시스템 가동</button><div id="flow"></div>`;
  root.querySelector('#go').onclick = async () => {
    const sels = [...root.querySelectorAll('select')];
    const wrong = sels.filter((s, i) => s.value !== ST[i][2][0]);
    sels.forEach((s, i) => s.style.borderColor = s.value === ST[i][2][0] ? 'var(--ok)' : (s.value ? 'var(--bad)' : ''));
    if (wrong.length) { fb(`${wrong.length}개 단계를 다시 골라 보세요 (빨간 테두리). 각 미션에서 배운 도구를 떠올려 보세요!`, 'bad'); return; }
    const fl = root.querySelector('#flow');
    fl.innerHTML = `<div class="muted" style="margin-top:14px">📨 김민지님의 문의 “주말반 있나요? 내년 5월 시험 목표”가 시스템을 통과합니다…</div><div class="flowrun">${ST.map((s, i) => `${i ? '<span class="cvarrow">→</span>' : ''}<span class="fn" id="fn${i}">${s[0]}</span>`).join('')}</div><div class="log" id="cl" style="margin-top:10px"></div>`;
    const msgs = ['🧩 Interfaces 폼 제출', '🗂️ Tables 레코드 생성', '✻ Claude: 수강문의 · 긴급도 보통 · DELE B1', '🔀 Path A(스페인어·수강문의) 선택', '💬 Slack → 후안샘 알림', '✉️ 답장 초안 작성', '🙋 원장 승인 → 발송', '⏰ 내일 08:00 아침 브리핑에 포함'];
    for (let i = 0; i < ST.length; i++) { root.querySelector('#fn' + i).classList.add('lit'); root.querySelector('#cl').appendChild(h(`<div class="logrow"><span>${msgs[i]}</span></div>`)); await sleep(450); }
    fl.appendChild(h(`<div class="cert" id="cert"><div style="font-size:40px">🏆</div><h2>Zap 연습장 수료증</h2><div class="muted">Claude × Zapier 자동화 아키텍트 과정</div>
      <div class="nm" id="cn">이름을 입력하세요</div><div>위 사람은 Zapier의 트리거·액션부터 Filter, Paths, Formatter, Webhooks, Code, Tables, Interfaces, Chatbots, Canvas, Copilot, Agents, Zapier MCP, Next Gen Zaps까지 모든 미션을 완수하였기에 이 증서를 드립니다.</div>
      <div class="muted" style="margin-top:12px">${new Date().toLocaleDateString('ko-KR')}</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:14px" class="noprint"><input class="input" style="max-width:200px" placeholder="이름" id="ci"><button class="btn dark" id="pr">🖨️ 인쇄/저장</button></div></div>`));
    root.querySelector('#ci').oninput = e => root.querySelector('#cn').textContent = e.target.value || '이름을 입력하세요';
    root.querySelector('#pr').onclick = () => window.print();
    fb('시스템 완성! 문의 한 건이 사람 손을 거의 거치지 않고, 꼭 필요한 순간(승인)에만 사람이 개입했어요. 이게 Claude × Zapier 협업의 완성형이에요.', 'ok'); done();
  };
};
