const SAVE_KEY = 'claudePetGame.save.v3';

const PET_SPRITE = 'assets/sprites/pet.png';

const ACCESSORIES = [
  { id: 'none',       name: '맨머리 (기본)',            unlockLevel: 1,  overlay: null },
  { id: 'glasses',    name: '개발자 선글라스',          unlockLevel: 5,  overlay: 'assets/sprites/acc-glasses.png' },
  { id: 'ballcap',    name: '해커톤 볼캡',              unlockLevel: 8,  overlay: 'assets/sprites/acc-ballcap.png' },
  { id: 'headphones', name: '코딩 헤드폰',              unlockLevel: 10, overlay: 'assets/sprites/acc-headphones.png' },
  { id: 'strawhat',   name: '휴가 밀짚모자',            unlockLevel: 13, overlay: 'assets/sprites/acc-strawhat.png' },
  { id: 'crown',      name: '시니어 크라운',            unlockLevel: 15, overlay: 'assets/sprites/acc-crown.png' },
  { id: 'cap',        name: '졸업 캡',                  unlockLevel: 20, overlay: 'assets/sprites/acc-cap.png' },
  { id: 'halo-rare',  name: '???홀로그램 후광 (희귀)',  unlockLevel: 0,  overlay: null, rare: true, halo: true },
];

const ENEMY_TYPES = [
  { id: 'bug',    name: '버그',   kind: 'bug', width: 58, height: 50 },
  { id: 'mon-1',  name: '설인',   kind: 'tile', sprite: 'assets/sprites/enemy-1.png' },
  { id: 'mon-2',  name: '나비',   kind: 'tile', sprite: 'assets/sprites/enemy-2.png' },
  { id: 'mon-3',  name: '레드슬라임', kind: 'tile', sprite: 'assets/sprites/enemy-3.png' },
  { id: 'mon-4',  name: '박쥐',   kind: 'tile', sprite: 'assets/sprites/enemy-4.png' },
  { id: 'mon-5',  name: '물고기', kind: 'tile', sprite: 'assets/sprites/enemy-5.png' },
];

const IDLE_EVENTS = [
  { msg: '☕ 커피 브레이크! 잠시 속도가 빨라집니다', run: () => applyBuff('spdMul', 1.8, 6000) },
  { msg: '🔥 야근 발생... 잠시 느려집니다', run: () => applyBuff('spdMul', 0.5, 6000) },
  { msg: '🎉 커밋 완료! 보너스 EXP 획득', run: () => gainExp(6) },
  { msg: '🚨 몬스터 무리 출현!', run: () => { spawnEnemy(); spawnEnemy(); } },
];

const BUG_FRAME_WIDTH = 58;
const BUG_FRAME_COUNT = 3;

const MAX_ENEMIES = 3;
const SPAWN_INTERVAL = 5;
const PET_ATTACK_RANGE = 60;
const PET_ATTACK_COOLDOWN = 0.7;
const ENEMY_ATTACK_RANGE = 66;
const ENEMY_ATTACK_COOLDOWN = 1.2;
const ENEMY_MOVE_SPEED = 24;
const KO_DURATION_MS = 4000;

const CODING_MIN_MS = 4000;
const CODING_MAX_MS = 8000;
const DANCE_DURATION_MS = 2600;
const CODE_GLYPHS = ['{ }', ';', '</>', '=>', 'fix()', 'npm i', 'git push', 'console.log'];

let state = loadState();
let buffs = {};
let enemies = [];
let petPos = { x: 40, y: 40 };
let petTarget = null;
let facingLeft = false;
let lastFrame = performance.now();
let lastTickSecond = Date.now();
let spawnCountdown = 2;
let petAttackTimer = 0;
let knockedOutUntil = 0;
let codingUntil = 0;
let dancingUntil = 0;
let nextGlyphAt = 0;
let nextNoteAt = 0;

const stageEl = document.getElementById('stage');
const petSpriteEl = document.getElementById('pet-sprite');
const petBodyEl = document.getElementById('pet-body');
const petAnimEl = document.getElementById('pet-anim');
const petImgEl = document.getElementById('pet-img');
const petAccImgEl = document.getElementById('pet-acc-img');
const haloEl = document.getElementById('halo');
const laptopEl = document.getElementById('laptop');
const logEl = document.getElementById('log');
const accGridEl = document.getElementById('acc-grid');
const toastStackEl = document.getElementById('toast-stack');
const unlockOverlayEl = document.getElementById('unlock-overlay');
const levelupFlashEl = document.getElementById('levelup-flash');

function loadState() {
  const raw = localStorage.getItem(SAVE_KEY);
  const fresh = {
    level: 1,
    exp: 0,
    stats: { hp: 20, atk: 3, spd: 3, luk: 3 },
    curHp: 20,
    accessories: ['none'],
    equippedAccessory: 'none',
    monstersCaught: 0,
    totalPlaySeconds: 0,
    lastSeen: Date.now(),
  };

  if (!raw) return fresh;

  try {
    return Object.assign(fresh, JSON.parse(raw));
  } catch {
    return fresh;
  }
}

function saveState() {
  state.lastSeen = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  flashSaveIndicator();
}

function flashSaveIndicator() {
  const el = document.getElementById('save-indicator');
  el.textContent = '💾 저장됨';

  setTimeout(() => { el.textContent = '💾 자동저장 대기중'; }, 1200);
}

function expToNext(level) {
  return Math.floor(10 * Math.pow(level, 1.4));
}

function addLog(msg) {
  const div = document.createElement('div');
  div.className = 'line';
  div.textContent = msg;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;

  while (logEl.childElementCount > 40) logEl.removeChild(logEl.firstChild);
}

function floatText(text, x, y, color) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  if (color) el.style.color = color;
  stageEl.appendChild(el);
  setTimeout(() => el.remove(), 1150);
}

/* ---------- 게임 알림 (토스트 / 레벨업 배너 / 스킨 언락 팝업) ---------- */

function showToast(text, opts = {}) {
  if (!toastStackEl) return;
  const el = document.createElement('div');
  el.className = 'toast' + (opts.variant ? ` ${opts.variant}` : '');

  const icon = document.createElement('div');
  icon.className = 't-icon';
  icon.textContent = opts.icon || '›';
  el.appendChild(icon);

  const body = document.createElement('div');
  body.className = 't-body';
  const t = document.createElement('div');
  t.className = 't-text';
  t.textContent = text;
  body.appendChild(t);
  if (opts.sub) {
    const s = document.createElement('div');
    s.className = 't-sub';
    s.textContent = opts.sub;
    body.appendChild(s);
  }
  el.appendChild(body);

  toastStackEl.appendChild(el);
  while (toastStackEl.childElementCount > 4) toastStackEl.removeChild(toastStackEl.firstChild);

  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 400);
  }, opts.duration || 3000);
}

function showLevelUpBanner(level) {
  if (levelupFlashEl) {
    levelupFlashEl.classList.remove('show');
    void levelupFlashEl.offsetWidth; // reflow → 애니메이션 재시작
    levelupFlashEl.classList.add('show');
  }
  const banner = document.createElement('div');
  banner.className = 'levelup-banner';
  banner.innerHTML = `LEVEL UP!<small>Lv.${level} 달성</small>`;
  document.querySelector('.ide-window').appendChild(banner);
  setTimeout(() => banner.remove(), 1750);
}

let unlockQueue = [];
let unlockActive = false;

function queueUnlockPopup(acc) {
  unlockQueue.push(acc);
  if (!unlockActive) processUnlockQueue();
}

function processUnlockQueue() {
  if (unlockQueue.length === 0) { unlockActive = false; return; }
  unlockActive = true;
  showUnlockCard(unlockQueue.shift());
}

function showUnlockCard(acc) {
  if (!unlockOverlayEl) { processUnlockQueue(); return; }
  unlockOverlayEl.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'unlock-card' + (acc.rare ? ' rare' : '');

  const eyebrow = document.createElement('div');
  eyebrow.className = 'unlock-eyebrow';
  eyebrow.innerHTML = acc.rare
    ? '<span class="star">★</span> RARE SKIN! <span class="star">★</span>'
    : '<span class="star">★</span> NEW SKIN <span class="star">★</span>';
  card.appendChild(eyebrow);

  const preview = document.createElement('div');
  preview.className = 'unlock-preview';
  if (acc.halo) {
    const glow = document.createElement('div');
    glow.className = 'halo-mini';
    preview.appendChild(glow);
  }
  const base = document.createElement('img');
  base.src = PET_SPRITE;
  preview.appendChild(base);
  if (acc.overlay) {
    const ov = document.createElement('img');
    ov.src = acc.overlay;
    preview.appendChild(ov);
  }
  card.appendChild(preview);

  const name = document.createElement('div');
  name.className = 'unlock-name';
  name.textContent = acc.name;
  card.appendChild(name);

  const sub = document.createElement('div');
  sub.className = 'unlock-sub';
  sub.textContent = acc.rare ? '희귀 액세서리 획득!' : `Lv.${acc.unlockLevel} 달성 보상`;
  card.appendChild(sub);

  const hint = document.createElement('div');
  hint.className = 'unlock-hint';
  hint.textContent = '클릭하여 계속 · SKINS 탭에서 장착';
  card.appendChild(hint);

  unlockOverlayEl.appendChild(card);
  unlockOverlayEl.classList.add('show');

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    unlockOverlayEl.classList.remove('show');
    unlockOverlayEl.removeEventListener('click', close);
    setTimeout(processUnlockQueue, 340);
  };
  const timer = setTimeout(close, 4200);
  unlockOverlayEl.addEventListener('click', close);
}

function gainExp(amount) {
  state.exp += amount;
  floatText(`+${amount} EXP`, petPos.x + 10, petPos.y - 10);

  while (state.exp >= expToNext(state.level)) {
    state.exp -= expToNext(state.level);
    levelUp();
  }

  updateHUD();
}

function levelUp() {
  state.level += 1;
  state.stats.hp += 5;
  state.curHp = state.stats.hp;
  state.stats.atk += 1;
  state.stats.spd += 0.4;
  if (state.level % 3 === 0) state.stats.luk += 1;

  addLog(`⭐ 레벨업! Lv.${state.level} 달성`);
  showLevelUpBanner(state.level);

  checkAccessoryUnlocks();

  const rareDropChance = 0.02 + state.stats.luk * 0.003;
  if (!state.accessories.includes('halo-rare') && Math.random() < rareDropChance) {
    state.accessories.push('halo-rare');
    addLog('✨ 희귀 액세서리 [???홀로그램 후광]을 발견했습니다!');
    queueUnlockPopup(ACCESSORIES.find(a => a.id === 'halo-rare'));
  }

  renderAccessoryGrid();
}

function checkAccessoryUnlocks(announce = true) {
  const newly = [];
  ACCESSORIES.forEach(acc => {
    if (acc.rare) return;

    if (state.level >= acc.unlockLevel && !state.accessories.includes(acc.id)) {
      state.accessories.push(acc.id);
      newly.push(acc);
    }
  });

  if (!announce) {
    // 세이브 로드 시 소급 해금: 팝업 없이 조용히 처리
    if (newly.length) addLog(`📦 해금된 액세서리 ${newly.length}종을 불러왔습니다`);
    return;
  }

  newly.forEach(acc => {
    addLog(`📦 새 액세서리 해금: ${acc.name}`);
    queueUnlockPopup(acc);
  });
}

function equipAccessory(id) {
  if (!state.accessories.includes(id)) return;

  state.equippedAccessory = id;
  addLog(`👕 액세서리 장착: ${ACCESSORIES.find(a => a.id === id).name}`);
  applyAccessoryVisual(currentAccessory());
  renderAccessoryGrid();
  saveState();
}

function currentAccessory() {
  return ACCESSORIES.find(a => a.id === state.equippedAccessory) || ACCESSORIES[0];
}

function applyAccessoryVisual(acc) {
  if (acc.overlay) {
    petAccImgEl.src = acc.overlay;
    petAccImgEl.classList.add('shown');
  } else {
    petAccImgEl.classList.remove('shown');
  }

  haloEl.classList.toggle('active', !!acc.halo);
}

function renderAccessoryGrid() {
  accGridEl.innerHTML = '';

  ACCESSORIES.forEach(acc => {
    const unlocked = state.accessories.includes(acc.id);
    const equipped = state.equippedAccessory === acc.id;

    const card = document.createElement('div');
    card.className = 'acc-card' + (equipped ? ' equipped' : '') + (!unlocked ? ' locked' : '');

    const preview = document.createElement('div');
    preview.className = 'acc-preview';

    if (unlocked && acc.halo) {
      const glow = document.createElement('div');
      glow.className = 'halo-mini';
      preview.appendChild(glow);
    }

    const baseImg = document.createElement('img');
    baseImg.src = PET_SPRITE;
    baseImg.style.filter = unlocked ? '' : 'grayscale(1) brightness(.35)';
    preview.appendChild(baseImg);

    if (unlocked && acc.overlay) {
      const overlayImg = document.createElement('img');
      overlayImg.src = acc.overlay;
      preview.appendChild(overlayImg);
    }

    card.appendChild(preview);

    const name = document.createElement('div');
    name.className = 'acc-name';
    name.textContent = unlocked ? acc.name : (acc.rare ? '??? (희귀 드랍)' : acc.name);
    card.appendChild(name);

    const status = document.createElement('div');
    status.className = 'acc-status';
    status.textContent = equipped ? '장착중' : (unlocked ? '클릭해서 장착' : (acc.rare ? '레벨업 시 확률 드랍' : `Lv.${acc.unlockLevel} 필요`));
    card.appendChild(status);

    if (unlocked) card.addEventListener('click', () => equipAccessory(acc.id));

    accGridEl.appendChild(card);
  });
}

function applyBuff(key, mul, duration) {
  buffs[key] = { mul, until: Date.now() + duration };
}

function buffMul(key) {
  const b = buffs[key];
  if (!b) return 1;
  if (Date.now() > b.until) { delete buffs[key]; return 1; }

  return b.mul;
}

function pickNewTarget() {
  const bounds = stageEl.getBoundingClientRect();
  const maxX = Math.max(20, bounds.width - 100);
  const maxY = Math.max(20, bounds.height - 80);
  petTarget = { x: Math.random() * maxX, y: Math.random() * maxY };
}

function spawnEnemy() {
  if (enemies.length >= MAX_ENEMIES) return;

  const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
  const bounds = stageEl.getBoundingClientRect();
  const w = type.width || 56;
  const h = type.height || 56;
  const x = Math.random() * Math.max(20, bounds.width - w);
  const y = Math.random() * Math.max(20, bounds.height - h);

  const wrap = document.createElement('div');
  wrap.className = 'enemy-wrap';
  wrap.style.left = x + 'px';
  wrap.style.top = y + 'px';

  const sprite = document.createElement('div');
  sprite.className = 'enemy-sprite ' + (type.kind === 'bug' ? 'bug' : 'tile');
  if (type.kind === 'tile') sprite.style.backgroundImage = `url("${type.sprite}")`;
  wrap.appendChild(sprite);

  const hpbar = document.createElement('div');
  hpbar.className = 'enemy-hpbar';
  const hpfill = document.createElement('div');
  hpfill.className = 'fill';
  hpbar.appendChild(hpfill);
  wrap.appendChild(hpbar);

  stageEl.appendChild(wrap);

  const maxHp = 8 + state.level * 3;
  enemies.push({
    wrap, sprite, hpfill,
    x, y, w, h,
    hp: maxHp, maxHp,
    atk: 1 + Math.floor(state.level * 0.7),
    attackTimer: Math.random() * ENEMY_ATTACK_COOLDOWN,
    type,
  });
}

function damageEnemy(target, amount) {
  target.hp -= amount;
  target.hpfill.style.width = `${Math.max(0, (target.hp / target.maxHp) * 100)}%`;
  floatText(`-${amount}`, target.x + target.w / 2, target.y - 14, '#ffd54a');

  target.sprite.classList.add('hit');
  setTimeout(() => target.sprite.classList.remove('hit'), 120);

  if (target.hp <= 0) killEnemy(target);
}

function killEnemy(target) {
  floatText(`${target.type.name} 처치!`, target.x, target.y - 26);
  target.wrap.remove();
  enemies = enemies.filter(e => e !== target);
  state.monstersCaught += 1;
  gainExp(3 + Math.floor(target.maxHp / 4));
  addLog(`⚔ ${target.type.name} 처치! (총 ${state.monstersCaught}마리)`);
  updateHUD();
}

function damagePet(amount, from) {
  if (isKnockedOut()) return;

  state.curHp -= amount;
  floatText(`-${amount}`, petPos.x + 30, petPos.y - 12, '#ff6b6b');
  petBodyEl.classList.add('hurt');
  setTimeout(() => petBodyEl.classList.remove('hurt'), 150);

  if (state.curHp <= 0) {
    state.curHp = 0;
    knockedOutUntil = Date.now() + KO_DURATION_MS;
    petBodyEl.classList.add('ko');
    addLog(`💫 ${from.type.name}에게 당했다... ${KO_DURATION_MS / 1000}초 후 부활`);

    setTimeout(() => {
      state.curHp = state.stats.hp;
      petBodyEl.classList.remove('ko');
      addLog('💪 부활! 다시 싸운다');
      updateHUD();
    }, KO_DURATION_MS);
  }

  updateHUD();
}

function isKnockedOut() {
  return Date.now() < knockedOutUntil;
}

function nearestEnemy() {
  let best = null;
  let bestDist = Infinity;

  enemies.forEach(e => {
    const d = Math.hypot(e.x + e.w / 2 - (petPos.x + 48), e.y + e.h / 2 - (petPos.y + 30));
    if (d < bestDist) { bestDist = d; best = e; }
  });

  return { target: best, dist: bestDist };
}

function updateCombat(dt) {
  if (isKnockedOut()) return;

  petAttackTimer -= dt;

  const { target, dist } = nearestEnemy();

  if (target && dist <= PET_ATTACK_RANGE && petAttackTimer <= 0) {
    petAttackTimer = PET_ATTACK_COOLDOWN;
    const dmg = state.stats.atk + Math.floor(Math.random() * 3);
    damageEnemy(target, dmg);
    petAnimEl.classList.add('lunge');
    setTimeout(() => petAnimEl.classList.remove('lunge'), 140);
  }

  enemies.forEach(e => {
    const d = Math.hypot(e.x + e.w / 2 - (petPos.x + 48), e.y + e.h / 2 - (petPos.y + 30));

    if (d > ENEMY_ATTACK_RANGE) {
      const dirX = (petPos.x + 48) - (e.x + e.w / 2);
      const dirY = (petPos.y + 30) - (e.y + e.h / 2);
      const len = Math.hypot(dirX, dirY) || 1;
      e.x += (dirX / len) * ENEMY_MOVE_SPEED * dt;
      e.y += (dirY / len) * ENEMY_MOVE_SPEED * dt;
      e.wrap.style.left = e.x + 'px';
      e.wrap.style.top = e.y + 'px';
      e.sprite.style.transform = dirX < 0 ? 'scaleX(-1)' : '';
    } else {
      e.attackTimer -= dt;
      if (e.attackTimer <= 0) {
        e.attackTimer = ENEMY_ATTACK_COOLDOWN;
        damagePet(e.atk, e);
      }
    }

    if (e.type.kind === 'bug') {
      const frame = Math.floor(performance.now() / 150) % BUG_FRAME_COUNT;
      e.sprite.style.backgroundPositionX = `-${frame * BUG_FRAME_WIDTH}px`;
    }
  });
}

function isDancing() {
  return Date.now() < dancingUntil;
}

function isCoding() {
  return Date.now() < codingUntil;
}

function startDance() {
  dancingUntil = Date.now() + DANCE_DURATION_MS;
  stopCoding();
  petAnimEl.classList.add('dance');
  setTimeout(() => petAnimEl.classList.remove('dance'), DANCE_DURATION_MS);
}

function startCoding() {
  codingUntil = Date.now() + CODING_MIN_MS + Math.random() * (CODING_MAX_MS - CODING_MIN_MS);
  petAnimEl.classList.add('typing');
  laptopEl.classList.add('shown');
}

function stopCoding() {
  codingUntil = 0;
  petAnimEl.classList.remove('typing');
  laptopEl.classList.remove('shown');
}

function updateIdleAnimations() {
  const now = Date.now();

  if (isDancing() && now >= nextNoteAt) {
    nextNoteAt = now + 400;
    const note = Math.random() < 0.5 ? '🎵' : '🎶';
    floatText(note, petPos.x + 20 + Math.random() * 50, petPos.y - 12, '#8b6bff');
  }

  if (isCoding()) {
    if (enemies.length > 0) { stopCoding(); return; }

    if (now >= nextGlyphAt) {
      nextGlyphAt = now + 700 + Math.random() * 500;
      const glyph = CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)];
      floatText(glyph, petPos.x + 30 + Math.random() * 40, petPos.y + 40, '#7fd88f');
    }
  } else if (codingUntil !== 0) {
    stopCoding();
    pickNewTarget();
  }
}


function updateMovement(dt) {
  if (isKnockedOut()) return;

  updateIdleAnimations();

  if (isDancing()) return;

  const { target, dist } = nearestEnemy();

  if (target) {
    stopCoding();
    petTarget = { x: target.x + target.w / 2 - 48, y: target.y + target.h / 2 - 30 };
    if (dist <= PET_ATTACK_RANGE * 0.8) {
      facingLeft = target.x + target.w / 2 < petPos.x + 48;
      petSpriteEl.style.transform = `translate(${petPos.x}px, ${petPos.y}px)`;
      petBodyEl.classList.toggle('flip', facingLeft);

      return;
    }
  } else {
    if (isCoding()) return;

    if (!petTarget) pickNewTarget();
  }

  const speed = state.stats.spd * buffMul('spdMul') * 26;
  const dx = petTarget.x - petPos.x;
  const dy = petTarget.y - petPos.y;
  const d = Math.hypot(dx, dy);

  if (d < 4) {
    if (!target && codingUntil === 0) startCoding();
  } else {
    const step = Math.min(d, speed * dt);
    petPos.x += (dx / d) * step;
    petPos.y += (dy / d) * step;
    facingLeft = dx < 0;
  }

  petSpriteEl.style.transform = `translate(${petPos.x}px, ${petPos.y}px)`;
  petBodyEl.classList.toggle('flip', facingLeft);
}

function updateHUD() {
  document.getElementById('level').textContent = state.level;
  document.getElementById('exp-text').textContent = `${Math.floor(state.exp)} / ${expToNext(state.level)}`;
  document.getElementById('exp-fill').style.width = `${(state.exp / expToNext(state.level)) * 100}%`;
  document.getElementById('hp-text').textContent = `${Math.ceil(state.curHp)} / ${state.stats.hp}`;
  document.getElementById('hp-fill').style.width = `${(state.curHp / state.stats.hp) * 100}%`;

  document.getElementById('sd-level').textContent = state.level;
  document.getElementById('sd-exp').textContent = `${Math.floor(state.exp)} / ${expToNext(state.level)}`;
  document.getElementById('sd-hp').textContent = `${Math.ceil(state.curHp)} / ${state.stats.hp}`;
  document.getElementById('sd-atk').textContent = state.stats.atk;
  document.getElementById('sd-spd').textContent = state.stats.spd.toFixed(1);
  document.getElementById('sd-luk').textContent = state.stats.luk;
  document.getElementById('sd-caught').textContent = state.monstersCaught;
  document.getElementById('sd-acc').textContent = `${state.accessories.length} / ${ACCESSORIES.length}`;
}

function updatePlaytime() {
  const s = state.totalPlaySeconds;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const text = `⏱ ${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  document.getElementById('playtime').textContent = text;
  document.getElementById('sd-playtime').textContent = text.replace('⏱ ', '');
}

function grantOfflineProgress() {
  const elapsedMs = Date.now() - (state.lastSeen || Date.now());
  const cappedSeconds = Math.min(elapsedMs / 1000, 4 * 3600);
  if (cappedSeconds < 30) return;

  const idleExp = Math.floor(cappedSeconds / 3);
  gainExp(idleExp);
  addLog(`🌙 자리를 비운 사이 ${Math.floor(cappedSeconds / 60)}분 동안 성장했습니다 (+${idleExp} EXP)`);
}

let lastPetClick = 0;
petSpriteEl.addEventListener('click', () => {
  if (isKnockedOut()) return;

  if (enemies.length === 0 && !isDancing()) startDance();

  const now = Date.now();
  if (now - lastPetClick < 5000) return;
  lastPetClick = now;

  gainExp(1);
  floatText('🐾 쓰담쓰담', petPos.x, petPos.y - 20);
  addLog('🐾 쓰다듬어줬더니 신나서 춤을 춘다! (+1 EXP)');
});

document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    addLog('💡 그냥 장식용 버튼입니다. 저장 없이 종료되지 않아요.');
  });
});

function setActiveTab(tab) {
  document.querySelectorAll('.tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  document.querySelectorAll('.tree-item').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  document.querySelectorAll('.panel').forEach(el => el.classList.toggle('hidden', el.id !== `panel-${tab}`));
}

document.querySelectorAll('.tab, .tree-item').forEach(el => {
  el.addEventListener('click', () => setActiveTab(el.dataset.tab));
});

function scheduleNextEvent() {
  const delay = 12000 + Math.random() * 18000;
  setTimeout(() => {
    const event = IDLE_EVENTS[Math.floor(Math.random() * IDLE_EVENTS.length)];
    addLog(event.msg);
    const sp = event.msg.indexOf(' ');
    showToast(sp > 0 ? event.msg.slice(sp + 1) : event.msg, { icon: sp > 0 ? event.msg.slice(0, sp) : '›' });
    event.run();
    scheduleNextEvent();
  }, delay);
}

function tickSecond() {
  gainExp(0.5);
  state.totalPlaySeconds += 1;

  if (!isKnockedOut() && state.curHp < state.stats.hp) {
    state.curHp = Math.min(state.stats.hp, state.curHp + 1 + state.stats.hp * 0.01);
  }

  updatePlaytime();
  updateHUD();
}

function loop(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;

  spawnCountdown -= dt;
  if (spawnCountdown <= 0) {
    spawnCountdown = SPAWN_INTERVAL;
    spawnEnemy();
  }

  updateMovement(dt);
  updateCombat(dt);

  if (Date.now() - lastTickSecond >= 1000) {
    lastTickSecond = Date.now();
    tickSecond();
  }

  requestAnimationFrame(loop);
}

function init() {
  addLog('$ node growth.ts --mode=idle');
  addLog('claude-pet 이(가) 자라기 시작했습니다.');

  if (typeof state.curHp !== 'number' || state.curHp <= 0) state.curHp = state.stats.hp;

  checkAccessoryUnlocks(false);   // 이미 도달한 레벨의 액세서리를 로드 시점에 조용히 소급 해금
  applyAccessoryVisual(currentAccessory());
  grantOfflineProgress();
  renderAccessoryGrid();
  updateHUD();
  updatePlaytime();
  scheduleNextEvent();
  spawnEnemy();

  requestAnimationFrame(loop);
  setInterval(saveState, 15000);
  window.addEventListener('beforeunload', saveState);
}

init();
