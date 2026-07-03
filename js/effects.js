// 연출 이펙트 (플로팅 텍스트/화면 셰이크/파티클/유성우)

function floatText(text, x, y, color, cls) {
  const el = document.createElement('div');
  el.className = 'float-text' + (cls ? ` ${cls}` : '');
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  if (color) el.style.color = color;
  stageEl.appendChild(el);
  setTimeout(() => el.remove(), 1150);
}

/* ---------- 액션 연출 (셰이크 / 파티클 / 유성우) ---------- */

function shakeStage() {
  stageEl.classList.remove('shake');
  void stageEl.offsetWidth; // reflow → 애니메이션 재시작
  stageEl.classList.add('shake');
}

function spawnParticles(x, y, colors, count = 10) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 20 + Math.random() * 34;
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist - 14}px`);
    stageEl.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

function meteorShower() {
  const bounds = stageEl.getBoundingClientRect();

  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      const m = document.createElement('div');
      m.className = 'meteor';
      m.textContent = '☄';
      m.style.left = bounds.width * 0.25 + Math.random() * bounds.width * 0.7 + 'px';
      m.style.top = Math.random() * bounds.height * 0.3 + 'px';
      stageEl.appendChild(m);
      setTimeout(() => m.remove(), 1250);
    }, i * 260);
  }

  gainExp(10);
}