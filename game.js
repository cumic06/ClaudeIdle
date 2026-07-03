const SAVE_KEY = 'claudePetGame.save.v3';

// 시크릿 모드·쿠키 전면 차단 환경에서는 localStorage 접근 자체가 throw → 안전 래퍼
// (loadState가 파일 상단의 `let state = loadState()`에서 즉시 실행되므로 그보다 먼저 선언)
const storage = (() => {
  try {
    const t = '__claudePet_test__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);

    return localStorage;
  } catch {
    return null;
  }
})();

const PET_SPRITE = 'assets/sprites/pet.png';

const ACCESSORIES = [
  { id: 'none',        name: '맨머리 (기본)',            unlockLevel: 1,  overlay: null },
  { id: 'glasses',     name: '개발자 선글라스',          unlockLevel: 5,  overlay: 'assets/sprites/acc-glasses.png' },
  { id: 'ballcap',     name: '해커톤 볼캡',              unlockLevel: 8,  overlay: 'assets/sprites/acc-ballcap.png' },
  { id: 'headphones',  name: '코딩 헤드폰',              unlockLevel: 10, overlay: 'assets/sprites/acc-headphones.png' },
  { id: 'strawhat',    name: '휴가 밀짚모자',            unlockLevel: 13, overlay: 'assets/sprites/acc-strawhat.png' },
  { id: 'crown',       name: '시니어 크라운',            unlockLevel: 15, overlay: 'assets/sprites/acc-crown.png' },
  { id: 'cap',         name: '졸업 캡',                  unlockLevel: 20, overlay: 'assets/sprites/acc-cap.png' },
  { id: 'bandana',     name: '레드 반다나',              unlockLevel: 22, overlay: 'assets/sprites/acc-bandana.png' },
  { id: 'eyepatch',    name: '버그헌터 안대',            unlockLevel: 25, overlay: 'assets/sprites/acc-eyepatch.png' },
  { id: 'headband',    name: '포커스 헤어밴드',          unlockLevel: 28, overlay: 'assets/sprites/acc-headband.png' },
  { id: 'beanie',      name: '심야코딩 비니',            unlockLevel: 31, overlay: 'assets/sprites/acc-beanie.png' },
  { id: 'ribbon',      name: '커밋 리본',                unlockLevel: 34, overlay: 'assets/sprites/acc-ribbon.png' },
  { id: 'flowercrown', name: '스프린트 꽃관',            unlockLevel: 37, overlay: 'assets/sprites/acc-flowercrown.png' },
  { id: 'catears',     name: '디버그 고양이 귀',         unlockLevel: 40, overlay: 'assets/sprites/acc-catears.png' },
  { id: 'bunnyears',   name: '스탠드업 토끼 귀',         unlockLevel: 42, overlay: 'assets/sprites/acc-bunnyears.png' },
  { id: 'santahat',    name: '연말 배포 산타모자',       unlockLevel: 44, overlay: 'assets/sprites/acc-santahat.png' },
  { id: 'partyhat',    name: '릴리즈 파티모자',          unlockLevel: 46, overlay: 'assets/sprites/acc-partyhat.png' },
  { id: 'wizardhat',   name: '아키텍트 마법사모자',      unlockLevel: 48, overlay: 'assets/sprites/acc-wizardhat.png' },
  { id: 'goggles',     name: '딥다이브 고글',            unlockLevel: 50, overlay: 'assets/sprites/acc-goggles.png' },
  { id: 'halo-rare',   name: '???홀로그램 후광 (희귀)',  unlockLevel: 0,  overlay: null, rare: true, halo: true },
];

const PET_SKINS = [
  { id: 'default', name: '기본 클로드',       price: 0,   icon: '🐾', body: 'assets/sprites/pet-body.png',        armLeft: 'assets/sprites/pet-arm-left.png',        armRight: 'assets/sprites/pet-arm-right.png' },
  { id: 'zombie',  name: '좀비 클로드',       price: 150, icon: '🧟', body: 'assets/sprites/pet-body-zombie.png', armLeft: 'assets/sprites/pet-arm-left-zombie.png', armRight: 'assets/sprites/pet-arm-right-zombie.png' },
  { id: 'dark',    name: '다크모드 클로드',   price: 200, icon: '🌙', body: 'assets/sprites/pet-body-dark.png',   armLeft: 'assets/sprites/pet-arm-left-dark.png',   armRight: 'assets/sprites/pet-arm-right-dark.png' },
  { id: 'rich',    name: '부자 클로드',       price: 300, icon: '💰', body: 'assets/sprites/pet-body-rich.png',   armLeft: 'assets/sprites/pet-arm-left-rich.png',   armRight: 'assets/sprites/pet-arm-right-rich.png' },
  { id: 'neon',    name: '네온 클로드',       price: 400, icon: '⚡', body: 'assets/sprites/pet-body-neon.png',   armLeft: 'assets/sprites/pet-arm-left-neon.png',   armRight: 'assets/sprites/pet-arm-right-neon.png' },
  { id: 'matrix',  name: '매트릭스 클로드',   price: 550, icon: '🟢', body: 'assets/sprites/pet-body-matrix.png', armLeft: 'assets/sprites/pet-arm-left-matrix.png', armRight: 'assets/sprites/pet-arm-right-matrix.png' },
];

const STAT_UPGRADES = [
  { id: 'hp',  label: '❤ HP',  icon: '❤', step: 5,   basePrice: 8,  priceGrowth: 1.16 },
  { id: 'atk', label: '⚔ ATK', icon: '⚔', step: 1,   basePrice: 12, priceGrowth: 1.2 },
  { id: 'spd', label: '🏃 SPD', icon: '🏃', step: 0.2, basePrice: 10, priceGrowth: 1.2 },
  { id: 'luk', label: '🍀 LUK', icon: '🍀', step: 1,   basePrice: 15, priceGrowth: 1.22 },
];

const EQUIP_SLOTS = [
  { id: 'weapon', name: '무기', icon: '🗡' },
  { id: 'shield', name: '방패', icon: '🛡' },
  { id: 'armor',  name: '갑옷', icon: '🥋' },
];

const EQUIP_BONUS_LABELS = { atk: 'ATK', def: 'DEF', hp: 'HP' };

const EQUIPMENT = [
  { id: 'sword-wood',    slot: 'weapon', name: '나무 검',         unlockLevel: 3,  bonus: { atk: 2 },  sprite: 'assets/sprites/eq-sword-wood.png' },
  { id: 'sword-steel',   slot: 'weapon', name: '강철 검',         unlockLevel: 8,  bonus: { atk: 5 },  sprite: 'assets/sprites/eq-sword-steel.png' },
  { id: 'sword-laser',   slot: 'weapon', name: '레이저 블레이드', unlockLevel: 14, bonus: { atk: 9 },  sprite: 'assets/sprites/eq-sword-laser.png' },
  { id: 'sword-legend',  slot: 'weapon', name: '전설의 디버거',   unlockLevel: 20, bonus: { atk: 15 }, sprite: 'assets/sprites/eq-sword-legend.png' },
  { id: 'sword-plasma',  slot: 'weapon', name: '플라즈마 소드',   unlockLevel: 26, bonus: { atk: 20 }, sprite: 'assets/sprites/eq-sword-plasma.png' },
  { id: 'sword-void',    slot: 'weapon', name: '보이드 세이버',   unlockLevel: 38, bonus: { atk: 28 }, sprite: 'assets/sprites/eq-sword-void.png' },
  { id: 'shield-wood',   slot: 'shield', name: '나무 방패',       unlockLevel: 5,  bonus: { def: 1 },  sprite: 'assets/sprites/eq-shield-wood.png' },
  { id: 'shield-iron',   slot: 'shield', name: '강철 방패',       unlockLevel: 10, bonus: { def: 2 },  sprite: 'assets/sprites/eq-shield-iron.png' },
  { id: 'shield-energy', slot: 'shield', name: '에너지 방패',     unlockLevel: 16, bonus: { def: 4 },  sprite: 'assets/sprites/eq-shield-energy.png' },
  { id: 'shield-mythic', slot: 'shield', name: '신화의 방패',     unlockLevel: 24, bonus: { def: 6 },  sprite: 'assets/sprites/eq-shield-mythic.png' },
  { id: 'shield-aegis',  slot: 'shield', name: '이지스 방패',     unlockLevel: 36, bonus: { def: 9 },  sprite: 'assets/sprites/eq-shield-aegis.png' },
  { id: 'armor-leather',   slot: 'armor', name: '가죽 갑옷',         unlockLevel: 6,  bonus: { hp: 15 },  sprite: 'assets/sprites/eq-armor-leather.png' },
  { id: 'armor-iron',      slot: 'armor', name: '강철 갑옷',         unlockLevel: 12, bonus: { hp: 35 },  sprite: 'assets/sprites/eq-armor-iron.png' },
  { id: 'armor-mythril',   slot: 'armor', name: '미스릴 갑옷',       unlockLevel: 18, bonus: { hp: 70 },  sprite: 'assets/sprites/eq-armor-mythril.png' },
  { id: 'armor-dragon',    slot: 'armor', name: '드래곤 스케일 갑주', unlockLevel: 22, bonus: { hp: 110 }, sprite: 'assets/sprites/eq-armor-dragon.png' },
  { id: 'armor-celestial', slot: 'armor', name: '천상의 갑주',        unlockLevel: 34, bonus: { hp: 165 }, sprite: 'assets/sprites/eq-armor-celestial.png' },
  // 상점 구매 전용 (레벨 무관, 코인으로 구매)
  { id: 'sword-diamond',  slot: 'weapon', name: '다이아몬드 소드', price: 450, bonus: { atk: 24 },  sprite: 'assets/sprites/eq-sword-diamond.png' },
  { id: 'shield-crystal', slot: 'shield', name: '크리스탈 방패',   price: 380, bonus: { def: 7 },   sprite: 'assets/sprites/eq-shield-crystal.png' },
  { id: 'armor-phoenix',  slot: 'armor',  name: '불사조 갑옷',     price: 550, bonus: { hp: 140 },  sprite: 'assets/sprites/eq-armor-phoenix.png' },
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
  { msg: '🐛 버그 폭풍! 몬스터가 몰려온다', run: () => { for (let i = 0; i < 4; i++) spawnEnemy({ force: true }); } },
  { msg: '💰 황금 몬스터 출현! 잡으면 EXP 대박', run: () => spawnEnemy({ golden: true, force: true }) },
  { msg: '☄ 유성우가 내린다 (+10 EXP)', run: () => meteorShower() },
  { msg: '👾 보스 몬스터 출현!!', run: () => spawnEnemy({ boss: true, force: true }) },
  { msg: '🪙 커밋 보너스! 코인을 획득했습니다', run: () => gainCoins(5 + Math.floor(Math.random() * 6)) },
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
const GROGGY_DURATION_MS = 8000;
const DEATH_EXP_LOSS_RATE = 0.3;
const DEATH_SCATTER_RADIUS = 240;

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
const eqGridEl = document.getElementById('eq-grid');
const petArmLeftEl = document.getElementById('pet-arm-left');
const petArmRightEl = document.getElementById('pet-arm-right');
const shopGridEl = document.getElementById('shop-grid');
const shopEquipGridEl = document.getElementById('shop-equip-grid');
const statUpgradeGridEl = document.getElementById('stat-upgrade-grid');
const petEquipImgs = {
  weapon: document.getElementById('pet-eq-weapon'),
  shield: document.getElementById('pet-eq-shield'),
  armor: document.getElementById('pet-eq-armor'),
};
const toastStackEl = document.getElementById('toast-stack');
const deathOverlayEl = document.getElementById('death-overlay');
const deathTimerEl = document.getElementById('death-timer');
const levelupOverlayEl = document.getElementById('levelup-overlay');
const unlockOverlayEl = document.getElementById('unlock-overlay');
const levelupFlashEl = document.getElementById('levelup-flash');

function freshState() {
  return {
    level: 1,
    exp: 0,
    stats: { hp: 20, atk: 3, spd: 3, luk: 3 },
    curHp: 20,
    accessories: ['none'],
    equippedAccessory: 'none',
    equipment: [],
    equipped: { weapon: null, shield: null, armor: null },
    coins: 0,
    skins: ['default'],
    equippedSkin: 'default',
    statUpgrades: { hp: 0, atk: 0, spd: 0, luk: 0 },
    monstersCaught: 0,
    totalPlaySeconds: 0,
    lastSeen: Date.now(),
  };
}

function loadState() {
  const raw = storage ? storage.getItem(SAVE_KEY) : null;

  if (!raw) return freshState();

  try {
    return Object.assign(freshState(), JSON.parse(raw));
  } catch {
    return freshState();
  }
}

function saveState() {
  state.lastSeen = Date.now();

  if (!storage) return;

  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    flashSaveIndicator();
  } catch {
    document.getElementById('save-indicator').textContent = '💾 저장 실패';
  }
}

/* ---------- 세이브 코드 내보내기 / 불러오기 (수동 백업) ---------- */

function exportSave() {
  state.lastSeen = Date.now();
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  const ta = document.getElementById('save-code');
  ta.value = code;
  ta.select();
  if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
  showToast('세이브 코드 복사됨', { icon: '📤', sub: '메모장 등 안전한 곳에 보관하세요' });
  addLog('📤 세이브 코드를 내보냈습니다');
}

function importSave() {
  const code = document.getElementById('save-code').value.trim();

  if (!code) {
    showToast('세이브 코드를 먼저 붙여넣어주세요', { icon: '⚠' });

    return;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(code))));
    if (typeof parsed.level !== 'number' || parsed.level < 1 || !parsed.stats) throw new Error('invalid save');

    state = Object.assign(freshState(), parsed);
    checkAccessoryUnlocks(false);
    checkEquipmentUnlocks(false);
    if (typeof state.curHp !== 'number' || state.curHp <= 0) state.curHp = maxHp();
    state.curHp = Math.min(state.curHp, maxHp());
    applyAccessoryVisual(currentAccessory());
    applyEquipmentVisuals();
    applySkinVisual(currentSkin());
    renderAccessoryGrid();
    renderEquipmentGrid();
    renderShopGrid();
    renderShopEquipGrid();
    renderStatUpgradeGrid();
    updateHUD();
    updatePlaytime();
    saveState();
    showToast(`세이브 불러오기 완료 (Lv.${state.level})`, { icon: '📥', variant: 'gold' });
    addLog(`📥 세이브를 불러왔습니다 (Lv.${state.level})`);
  } catch {
    showToast('세이브 코드가 올바르지 않습니다', { icon: '⚠', variant: 'rare' });
  }
}

function flashSaveIndicator() {
  const el = document.getElementById('save-indicator');
  el.textContent = '💾 저장됨';

  setTimeout(() => { el.textContent = '💾 자동저장 대기중'; }, 1200);
}

function expToNext(level) {
  return Math.floor(10 * Math.pow(level, 1.4));
}

/* ---------- 장비 시스템 ---------- */

function equipBonus(stat) {
  return EQUIP_SLOTS.reduce((sum, slot) => {
    const item = EQUIPMENT.find(e => e.id === state.equipped[slot.id]);

    return sum + (item && item.bonus[stat] ? item.bonus[stat] : 0);
  }, 0);
}

function maxHp() {
  return state.stats.hp + equipBonus('hp');
}

function petAtk() {
  return state.stats.atk + equipBonus('atk');
}

function checkEquipmentUnlocks(announce = true) {
  const newly = EQUIPMENT.filter(eq => state.level >= eq.unlockLevel && !state.equipment.includes(eq.id));
  newly.forEach(eq => state.equipment.push(eq.id));

  if (!announce) {
    // 세이브 로드 시 소급 해금: 팝업 없이 조용히 처리
    if (newly.length) addLog(`⚔ 해금된 장비 ${newly.length}종을 불러왔습니다`);

    return;
  }

  newly.forEach(eq => {
    addLog(`⚔ 새 장비 해금: ${eq.name}`);
    queueUnlockPopup(eq);
  });
}

function equipItem(id) {
  const item = EQUIPMENT.find(e => e.id === id);
  if (!item || !state.equipment.includes(id)) return;

  const wasEquipped = state.equipped[item.slot] === id;
  state.equipped[item.slot] = wasEquipped ? null : id;
  state.curHp = Math.min(state.curHp, maxHp());
  addLog(wasEquipped ? `⚔ 장비 해제: ${item.name}` : `⚔ 장비 장착: ${item.name}`);
  applyEquipmentVisuals();
  renderEquipmentGrid();
  updateHUD();
  saveState();
}

function applyEquipmentVisuals() {
  EQUIP_SLOTS.forEach(slot => {
    const img = petEquipImgs[slot.id];
    const item = EQUIPMENT.find(e => e.id === state.equipped[slot.id]);

    if (item) img.src = item.sprite;
  });

  updateCombatGearVisibility();
}

function updateCombatGearVisibility() {
  // 장비는 전투 중에만 입는다 (평시·코딩·춤·KO 시 전부 해제 상태로 표시)
  const fighting = enemies.length > 0 && !isKnockedOut() && !isDancing() && !isCoding();

  EQUIP_SLOTS.forEach(slot => {
    petEquipImgs[slot.id].classList.toggle('shown', !!state.equipped[slot.id] && fighting);
  });
}

function renderEquipmentGrid() {
  eqGridEl.innerHTML = '';

  EQUIP_SLOTS.forEach(slot => {
    const title = document.createElement('div');
    title.className = 'eq-slot-title';
    title.textContent = `${slot.icon} ${slot.name}`;
    eqGridEl.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'acc-grid eq-grid';

    EQUIPMENT.filter(e => e.slot === slot.id).forEach(eq => {
      const unlocked = state.equipment.includes(eq.id);
      const equipped = state.equipped[slot.id] === eq.id;

      const card = document.createElement('div');
      card.className = 'acc-card' + (equipped ? ' equipped' : '') + (!unlocked ? ' locked' : '');

      const preview = document.createElement('div');
      preview.className = 'acc-preview eq-preview';
      const img = document.createElement('img');
      img.src = eq.sprite;
      img.style.filter = unlocked ? '' : 'grayscale(1) brightness(.35)';
      preview.appendChild(img);
      card.appendChild(preview);

      const name = document.createElement('div');
      name.className = 'acc-name';
      name.textContent = eq.name;
      card.appendChild(name);

      const bonusText = Object.entries(eq.bonus)
        .map(([k, v]) => `+${v} ${EQUIP_BONUS_LABELS[k]}`)
        .join(' · ');
      const bonusEl = document.createElement('div');
      bonusEl.className = 'eq-bonus';
      bonusEl.textContent = bonusText;
      card.appendChild(bonusEl);

      const status = document.createElement('div');
      status.className = 'acc-status';
      status.textContent = equipped
        ? '장착중 (클릭해서 해제)'
        : unlocked
          ? '클릭해서 장착'
          : (eq.price !== undefined ? `🛒 상점에서 구매 (${eq.price}🪙)` : `Lv.${eq.unlockLevel} 필요`);
      card.appendChild(status);

      if (unlocked) card.addEventListener('click', () => equipItem(eq.id));

      grid.appendChild(card);
    });

    eqGridEl.appendChild(grid);
  });
}

function addLog(msg) {
  const div = document.createElement('div');
  div.className = 'line';
  div.textContent = msg;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;

  while (logEl.childElementCount > 40) logEl.removeChild(logEl.firstChild);
}

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
      m.style.left = (bounds.width * 0.25 + Math.random() * bounds.width * 0.7) + 'px';
      m.style.top = (Math.random() * bounds.height * 0.3) + 'px';
      stageEl.appendChild(m);
      setTimeout(() => m.remove(), 1250);
    }, i * 260);
  }

  gainExp(10);
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

let levelupPopupTimer = null;

function showLevelUpPopup(level) {
  if (levelupFlashEl) {
    levelupFlashEl.classList.remove('show');
    void levelupFlashEl.offsetWidth; // reflow → 애니메이션 재시작
    levelupFlashEl.classList.add('show');
  }

  const gains = ['+5 HP', '+1 ATK', '+0.4 SPD'];
  if (level % 3 === 0) gains.push('+1 LUK');

  document.getElementById('levelup-level').textContent = `Lv.${level} 달성`;
  document.getElementById('levelup-gains').textContent = gains.join(' · ');

  levelupOverlayEl.classList.remove('show');
  void levelupOverlayEl.offsetWidth; // reflow → 애니메이션 재시작
  levelupOverlayEl.classList.add('show');

  clearTimeout(levelupPopupTimer);
  levelupPopupTimer = setTimeout(() => levelupOverlayEl.classList.remove('show'), 1900);
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

  const isEquip = !!acc.slot;

  const card = document.createElement('div');
  card.className = 'unlock-card' + (acc.rare ? ' rare' : '');

  const eyebrow = document.createElement('div');
  eyebrow.className = 'unlock-eyebrow';
  eyebrow.innerHTML = acc.rare
    ? '<span class="star">★</span> RARE SKIN! <span class="star">★</span>'
    : `<span class="star">★</span> ${isEquip ? 'NEW GEAR' : 'NEW SKIN'} <span class="star">★</span>`;
  card.appendChild(eyebrow);

  const preview = document.createElement('div');
  preview.className = 'unlock-preview' + (isEquip ? ' equip' : '');
  if (acc.halo) {
    const glow = document.createElement('div');
    glow.className = 'halo-mini';
    preview.appendChild(glow);
  }
  if (isEquip) {
    const item = document.createElement('img');
    item.src = acc.sprite;
    preview.appendChild(item);
  } else {
    const base = document.createElement('img');
    base.src = PET_SPRITE;
    preview.appendChild(base);
    if (acc.overlay) {
      const ov = document.createElement('img');
      ov.src = acc.overlay;
      preview.appendChild(ov);
    }
  }
  card.appendChild(preview);

  const name = document.createElement('div');
  name.className = 'unlock-name';
  name.textContent = acc.name;
  card.appendChild(name);

  const sub = document.createElement('div');
  sub.className = 'unlock-sub';
  if (isEquip) {
    const bonusText = Object.entries(acc.bonus)
      .map(([k, v]) => `+${v} ${EQUIP_BONUS_LABELS[k]}`)
      .join(' · ');
    sub.textContent = `Lv.${acc.unlockLevel} 달성 보상 (${bonusText})`;
  } else {
    sub.textContent = acc.rare ? '희귀 액세서리 획득!' : `Lv.${acc.unlockLevel} 달성 보상`;
  }
  card.appendChild(sub);

  const hint = document.createElement('div');
  hint.className = 'unlock-hint';
  hint.textContent = isEquip ? '클릭하여 계속 · ⚔ 장비 버튼에서 장착' : '클릭하여 계속 · 📦 스킨 버튼에서 장착';
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
  state.curHp = maxHp();
  state.stats.atk += 1;
  state.stats.spd += 0.4;
  if (state.level % 3 === 0) state.stats.luk += 1;

  const coinReward = 3 + Math.floor(state.level / 2);
  state.coins += coinReward;

  addLog(`⭐ 레벨업! Lv.${state.level} 달성 (+${coinReward}🪙)`);
  showLevelUpPopup(state.level);

  checkAccessoryUnlocks();
  checkEquipmentUnlocks();

  const rareDropChance = 0.02 + state.stats.luk * 0.003;
  if (!state.accessories.includes('halo-rare') && Math.random() < rareDropChance) {
    state.accessories.push('halo-rare');
    addLog('✨ 희귀 액세서리 [???홀로그램 후광]을 발견했습니다!');
    queueUnlockPopup(ACCESSORIES.find(a => a.id === 'halo-rare'));
  }

  renderAccessoryGrid();
  renderEquipmentGrid();
  saveState(); // 레벨업은 즉시 저장 (15초 주기·종료 저장이 누락돼도 진행 보존)
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

/* ---------- 재화(커밋 코인) & 상점 (구매형 스킨 · 능력치 강화) ---------- */

function gainCoins(amount, x, y) {
  state.coins += amount;
  floatText(`+${amount}🪙`, x ?? petPos.x + 10, y ?? petPos.y - 24, '#ffd54a');
  updateHUD();
}

function currentSkin() {
  return PET_SKINS.find(s => s.id === state.equippedSkin) || PET_SKINS[0];
}

function applySkinVisual(skin) {
  petImgEl.src = skin.body;
  petArmLeftEl.src = skin.armLeft;
  petArmRightEl.src = skin.armRight;
}

function buySkin(id) {
  const skin = PET_SKINS.find(s => s.id === id);
  if (!skin || state.skins.includes(id)) return;

  if (state.coins < skin.price) {
    showToast('코인이 부족합니다', { icon: '🪙' });

    return;
  }

  state.coins -= skin.price;
  state.skins.push(id);
  state.equippedSkin = id;
  addLog(`🛒 스킨 구매: ${skin.name} (-${skin.price}🪙)`);
  showToast(`${skin.name} 구매 완료!`, { icon: skin.icon, variant: 'gold' });
  applySkinVisual(skin);
  renderShopGrid();
  updateHUD();
  saveState();
}

function equipSkin(id) {
  if (!state.skins.includes(id)) return;

  state.equippedSkin = id;
  addLog(`🛒 스킨 장착: ${PET_SKINS.find(s => s.id === id).name}`);
  applySkinVisual(currentSkin());
  renderShopGrid();
  saveState();
}

function renderShopGrid() {
  shopGridEl.innerHTML = '';

  PET_SKINS.forEach(skin => {
    const owned = state.skins.includes(skin.id);
    const equipped = state.equippedSkin === skin.id;
    const afford = state.coins >= skin.price;

    const card = document.createElement('div');
    card.className = 'acc-card' + (equipped ? ' equipped' : '') + (!owned && !afford ? ' locked' : '');

    const preview = document.createElement('div');
    preview.className = 'acc-preview';
    const img = document.createElement('img');
    img.src = skin.body;
    preview.appendChild(img);
    card.appendChild(preview);

    const name = document.createElement('div');
    name.className = 'acc-name';
    name.textContent = `${skin.icon} ${skin.name}`;
    card.appendChild(name);

    const status = document.createElement('div');
    status.className = 'acc-status';
    status.textContent = equipped ? '장착중' : (owned ? '클릭해서 장착' : `${skin.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`);
    card.appendChild(status);

    if (owned) card.addEventListener('click', () => equipSkin(skin.id));
    else if (afford) card.addEventListener('click', () => buySkin(skin.id));

    shopGridEl.appendChild(card);
  });
}

function buyEquipment(id) {
  const item = EQUIPMENT.find(e => e.id === id);
  if (!item || item.price === undefined || state.equipment.includes(id)) return;

  if (state.coins < item.price) {
    showToast('코인이 부족합니다', { icon: '🪙' });

    return;
  }

  state.coins -= item.price;
  state.equipment.push(id);
  addLog(`🛒 장비 구매: ${item.name} (-${item.price}🪙)`);
  showToast(`${item.name} 구매 완료!`, { icon: '⚔', variant: 'gold', sub: '⚔ 장비 메뉴에서 장착하세요' });
  renderShopEquipGrid();
  renderEquipmentGrid();
  updateHUD();
  saveState();
}

function renderShopEquipGrid() {
  shopEquipGridEl.innerHTML = '';

  EQUIPMENT.filter(eq => eq.price !== undefined).forEach(eq => {
    const owned = state.equipment.includes(eq.id);
    const equipped = state.equipped[eq.slot] === eq.id;
    const afford = state.coins >= eq.price;

    const card = document.createElement('div');
    card.className = 'acc-card' + (equipped ? ' equipped' : '') + (!owned && !afford ? ' locked' : '');

    const preview = document.createElement('div');
    preview.className = 'acc-preview eq-preview';
    const img = document.createElement('img');
    img.src = eq.sprite;
    preview.appendChild(img);
    card.appendChild(preview);

    const name = document.createElement('div');
    name.className = 'acc-name';
    name.textContent = eq.name;
    card.appendChild(name);

    const bonusText = Object.entries(eq.bonus)
      .map(([k, v]) => `+${v} ${EQUIP_BONUS_LABELS[k]}`)
      .join(' · ');
    const bonusEl = document.createElement('div');
    bonusEl.className = 'eq-bonus';
    bonusEl.textContent = bonusText;
    card.appendChild(bonusEl);

    const status = document.createElement('div');
    status.className = 'acc-status';
    status.textContent = owned
      ? (equipped ? '장착중' : '보유 중 · 클릭해서 장착')
      : `${eq.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`;
    card.appendChild(status);

    if (owned) card.addEventListener('click', () => { equipItem(eq.id); renderShopEquipGrid(); });
    else if (afford) card.addEventListener('click', () => buyEquipment(eq.id));

    shopEquipGridEl.appendChild(card);
  });
}

function buyStatUpgrade(id) {
  const def = STAT_UPGRADES.find(s => s.id === id);
  const count = state.statUpgrades[id] || 0;
  const price = Math.round(def.basePrice * Math.pow(def.priceGrowth, count));

  if (state.coins < price) {
    showToast('코인이 부족합니다', { icon: '🪙' });

    return;
  }

  state.coins -= price;
  state.statUpgrades[id] = count + 1;
  state.stats[id] = Math.round((state.stats[id] + def.step) * 10) / 10;
  if (id === 'hp') state.curHp = maxHp();
  else state.curHp = Math.min(state.curHp, maxHp());

  addLog(`💪 능력치 강화: ${def.label} +${def.step} (-${price}🪙)`);
  showToast(`${def.label} 강화 완료!`, { icon: def.icon, variant: 'gold' });
  renderStatUpgradeGrid();
  updateHUD();
  saveState();
}

function renderStatUpgradeGrid() {
  statUpgradeGridEl.innerHTML = '';

  STAT_UPGRADES.forEach(def => {
    const count = state.statUpgrades[def.id] || 0;
    const price = Math.round(def.basePrice * Math.pow(def.priceGrowth, count));
    const afford = state.coins >= price;
    const curVal = def.id === 'spd' ? state.stats[def.id].toFixed(1) : state.stats[def.id];

    const row = document.createElement('div');
    row.className = 'stat-upgrade-row';

    const label = document.createElement('div');
    label.className = 'stat-upgrade-label';
    label.textContent = `${def.label} ${curVal}`;
    row.appendChild(label);

    const btn = document.createElement('button');
    btn.className = 'menu-btn stat-upgrade-btn' + (afford ? '' : ' disabled');
    btn.textContent = `+${def.step} (${price}🪙)`;
    btn.disabled = !afford;
    if (afford) btn.addEventListener('click', () => buyStatUpgrade(def.id));
    row.appendChild(btn);

    statUpgradeGridEl.appendChild(row);
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

function spawnEnemy(opts = {}) {
  if (enemies.length >= MAX_ENEMIES && !opts.force) return;

  // 황금/보스는 스프라이트 시트(bug) 대신 단일 타일만 사용 (틴트·확대가 깔끔함)
  const pool = (opts.golden || opts.boss) ? ENEMY_TYPES.filter(t => t.kind === 'tile') : ENEMY_TYPES;
  const type = pool[Math.floor(Math.random() * pool.length)];
  const bounds = stageEl.getBoundingClientRect();
  const scale = opts.boss ? 1.9 : 1;
  const w = (type.width || 56) * scale;
  const h = (type.height || 56) * scale;
  const x = Math.random() * Math.max(20, bounds.width - w);
  const y = Math.random() * Math.max(20, bounds.height - h);

  const wrap = document.createElement('div');
  wrap.className = 'enemy-wrap';
  wrap.style.left = x + 'px';
  wrap.style.top = y + 'px';

  const sprite = document.createElement('div');
  sprite.className = 'enemy-sprite ' + (type.kind === 'bug' ? 'bug' : 'tile');
  if (type.kind === 'tile') {
    sprite.style.backgroundImage = `url("${type.sprite}")`;

    if (opts.boss) {
      sprite.style.width = w + 'px';
      sprite.style.height = h + 'px';
      sprite.style.backgroundSize = `${w}px ${h}px`;
    }
  }
  if (opts.golden) sprite.classList.add('golden');
  if (opts.boss) sprite.classList.add('boss');
  wrap.appendChild(sprite);

  const hpbar = document.createElement('div');
  hpbar.className = 'enemy-hpbar';
  const hpfill = document.createElement('div');
  hpfill.className = 'fill';
  hpbar.appendChild(hpfill);
  wrap.appendChild(hpbar);

  stageEl.appendChild(wrap);

  const baseHp = 8 + state.level * 3;
  const maxHp = Math.round(baseHp * (opts.boss ? 6 : opts.golden ? 2 : 1));
  enemies.push({
    wrap, sprite, hpfill,
    x, y, w, h,
    hp: maxHp, maxHp,
    atk: Math.round((1 + Math.floor(state.level * 0.7)) * (opts.boss ? 1.6 : 1)),
    attackTimer: Math.random() * ENEMY_ATTACK_COOLDOWN,
    expMul: opts.boss ? 3 : opts.golden ? 4 : 1,
    speedMul: opts.golden ? 1.8 : opts.boss ? 0.7 : 1,
    isBoss: !!opts.boss,
    isGolden: !!opts.golden,
    type,
  });

  if (opts.boss) shakeStage();
}

function damageEnemy(target, amount, crit = false) {
  target.hp -= amount;
  target.hpfill.style.width = `${Math.max(0, (target.hp / target.maxHp) * 100)}%`;

  if (crit) {
    floatText(`-${amount} CRIT!`, target.x + target.w / 2, target.y - 18, '#ff9f43', 'big');
    spawnParticles(target.x + target.w / 2, target.y + target.h / 2, ['#ff9f43', '#ffd54a'], 6);
  } else {
    floatText(`-${amount}`, target.x + target.w / 2, target.y - 14, '#ffd54a');
  }

  target.sprite.classList.add('hit');
  setTimeout(() => target.sprite.classList.remove('hit'), 120);

  if (target.hp <= 0) killEnemy(target);
}

let comboCount = 0;
let lastKillAt = 0;

function killEnemy(target) {
  const cx = target.x + target.w / 2;
  const cy = target.y + target.h / 2;
  spawnParticles(cx, cy, target.isGolden
    ? ['#ffd54a', '#fff2b0', '#f0a878']
    : ['#ff6b6b', '#ffd54a', '#7fd88f', '#57d7f2'], target.isBoss ? 22 : 12);

  if (target.isBoss) {
    floatText(`👾 보스 ${target.type.name} 격파!!`, target.x, target.y - 30, '#ff9f43', 'big');
    shakeStage();
  } else {
    floatText(`${target.type.name} 처치!`, target.x, target.y - 26);
  }

  target.wrap.remove();
  enemies = enemies.filter(e => e !== target);
  state.monstersCaught += 1;

  // 4초 안에 연속 처치하면 콤보 (보너스 EXP)
  const now = Date.now();
  comboCount = now - lastKillAt < 4000 ? comboCount + 1 : 1;
  lastKillAt = now;
  if (comboCount >= 2) floatText(`COMBO x${comboCount}!`, cx - 24, target.y - 48, '#8b6bff', 'big');

  const exp = Math.floor((3 + target.maxHp / 4) * (target.expMul || 1)) + (comboCount >= 2 ? comboCount : 0);
  gainExp(exp);

  const coinGain = target.isBoss ? 12 : target.isGolden ? 6 : 1 + Math.floor(Math.random() * 2);
  gainCoins(coinGain, cx, target.y - 42);

  if (target.isBoss) addLog(`👾 보스 ${target.type.name} 격파!! (+${exp} EXP · +${coinGain}🪙)`);
  else if (target.isGolden) addLog(`💰 황금 ${target.type.name} 처치! EXP 대박 (+${exp} EXP · +${coinGain}🪙)`);
  else addLog(`⚔ ${target.type.name} 처치! (총 ${state.monstersCaught}마리)`);

  updateHUD();
}

function damagePet(amount, from) {
  if (isKnockedOut()) return;

  const reduced = Math.max(1, amount - equipBonus('def'));
  state.curHp -= reduced;
  floatText(`-${reduced}`, petPos.x + 30, petPos.y - 12, '#ff6b6b');
  petBodyEl.classList.add('hurt');
  setTimeout(() => petBodyEl.classList.remove('hurt'), 150);

  if (state.curHp <= 0) {
    state.curHp = 0;
    knockedOutUntil = Date.now() + KO_DURATION_MS;
    petBodyEl.classList.add('ko');
    scatterEnemiesOnDeath();
    addLog(`💀 ${from.type.name}에게 당했다... ${KO_DURATION_MS / 1000}초 후 부활`);

    setTimeout(() => {
      state.curHp = maxHp();
      petBodyEl.classList.remove('ko');
      applyDeathPenalty();
      updateHUD();
    }, KO_DURATION_MS);
  }

  updateHUD();
}

function isKnockedOut() {
  return Date.now() < knockedOutUntil;
}

// 쓰러지는 순간 주변 몬스터 일부가 흩어져 부활 직후 즉사 재차징을 완화한다
function scatterEnemiesOnDeath() {
  const cx = petPos.x + 48;
  const cy = petPos.y + 30;
  const nearby = enemies.filter(e => Math.hypot(e.x + e.w / 2 - cx, e.y + e.h / 2 - cy) <= DEATH_SCATTER_RADIUS);

  if (!nearby.length) return;

  const removeCount = Math.max(1, Math.ceil(nearby.length / 2));
  const toRemove = [...nearby].sort(() => Math.random() - 0.5).slice(0, removeCount);

  toRemove.forEach(e => {
    spawnParticles(e.x + e.w / 2, e.y + e.h / 2, ['#8b6bff', '#a78bfa', '#57d7f2'], 8);
    e.wrap.classList.add('vanish'); // wrap엔 애니메이션이 없어 sprite의 enemy-bob과 충돌하지 않는다
    setTimeout(() => e.wrap.remove(), 260);
  });

  enemies = enemies.filter(e => !toRemove.includes(e));
  addLog(`💨 쓰러지자 주변 몬스터 ${toRemove.length}마리가 흩어졌다`);
}

function updateDeathOverlay() {
  const remaining = knockedOutUntil - Date.now();
  const show = remaining > 0;
  deathOverlayEl.classList.toggle('show', show);

  if (show) deathTimerEl.textContent = `${(remaining / 1000).toFixed(1)}초 후 부활`;
}

/* ---------- 로그라이트 사망 페널티 (EXP 손실 → 레벨 다운 가능 + 그로기) ---------- */

function applyDeathPenalty() {
  // 페널티 1: 현재 레벨 필요 EXP의 30% 손실. 부족하면 레벨 다운 + 스탯 롤백
  const loss = Math.floor(expToNext(state.level) * DEATH_EXP_LOSS_RATE);
  state.exp -= loss;

  let leveledDown = false;
  while (state.exp < 0 && state.level > 1) {
    // levelUp()의 역연산
    state.stats.hp -= 5;
    state.stats.atk -= 1;
    state.stats.spd -= 0.4;
    if (state.level % 3 === 0) state.stats.luk -= 1;
    state.level -= 1;
    state.exp += expToNext(state.level);
    leveledDown = true;
  }
  if (state.exp < 0) state.exp = 0;
  state.curHp = Math.min(state.curHp, maxHp());

  // 페널티 2: 8초간 그로기 — 공격력·이동속도 50%
  applyBuff('atkMul', 0.5, GROGGY_DURATION_MS);
  applyBuff('spdMul', 0.5, GROGGY_DURATION_MS);
  petBodyEl.classList.add('groggy');
  setTimeout(() => petBodyEl.classList.remove('groggy'), GROGGY_DURATION_MS);

  floatText('💫 그로기...', petPos.x + 10, petPos.y - 24, '#a78bfa');

  if (leveledDown) {
    addLog(`💀 부활... EXP -${loss} → 레벨 하락! Lv.${state.level} · ${GROGGY_DURATION_MS / 1000}초 그로기`);
    showToast(`부활 페널티: Lv.${state.level}로 하락!`, { icon: '💀', variant: 'rare', sub: `EXP -${loss} · ${GROGGY_DURATION_MS / 1000}초간 공격·속도 50%`, duration: 4200 });
  } else {
    addLog(`💀 부활... EXP -${loss} · ${GROGGY_DURATION_MS / 1000}초 그로기 (공격·속도 50%)`);
    showToast(`부활 페널티: EXP -${loss}`, { icon: '💀', sub: `${GROGGY_DURATION_MS / 1000}초간 공격·속도 50%`, duration: 4200 });
  }

  saveState();
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

    const critChance = 0.05 + state.stats.luk * 0.005;
    const isCrit = Math.random() < critChance;
    let dmg = Math.max(1, Math.round(petAtk() * buffMul('atkMul'))) + Math.floor(Math.random() * 3);

    if (isCrit) {
      dmg *= 2;
      shakeStage();
    }

    damageEnemy(target, dmg, isCrit);
    petAnimEl.classList.add('lunge');
    setTimeout(() => petAnimEl.classList.remove('lunge'), 140);
  }

  enemies.forEach(e => {
    const d = Math.hypot(e.x + e.w / 2 - (petPos.x + 48), e.y + e.h / 2 - (petPos.y + 30));

    if (d > ENEMY_ATTACK_RANGE) {
      const dirX = (petPos.x + 48) - (e.x + e.w / 2);
      const dirY = (petPos.y + 30) - (e.y + e.h / 2);
      const len = Math.hypot(dirX, dirY) || 1;
      const speed = ENEMY_MOVE_SPEED * (e.speedMul || 1);
      e.x += (dirX / len) * speed * dt;
      e.y += (dirY / len) * speed * dt;
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
  const hpMax = maxHp();
  const atkBonus = equipBonus('atk');
  const hpBonus = equipBonus('hp');

  document.getElementById('level').textContent = state.level;
  document.getElementById('exp-text').textContent = `${Math.floor(state.exp)} / ${expToNext(state.level)}`;
  document.getElementById('exp-fill').style.width = `${(state.exp / expToNext(state.level)) * 100}%`;
  document.getElementById('hp-text').textContent = `${Math.ceil(state.curHp)} / ${hpMax}`;
  document.getElementById('hp-fill').style.width = `${(state.curHp / hpMax) * 100}%`;

  document.getElementById('sd-level').textContent = state.level;
  document.getElementById('sd-exp').textContent = `${Math.floor(state.exp)} / ${expToNext(state.level)}`;
  document.getElementById('sd-hp').textContent = `${Math.ceil(state.curHp)} / ${hpMax}` + (hpBonus ? ` (+${hpBonus})` : '');
  document.getElementById('sd-atk').textContent = atkBonus ? `${state.stats.atk} (+${atkBonus})` : state.stats.atk;
  document.getElementById('sd-def').textContent = equipBonus('def');
  document.getElementById('sd-spd').textContent = state.stats.spd.toFixed(1);
  document.getElementById('sd-luk').textContent = state.stats.luk;
  document.getElementById('sd-caught').textContent = state.monstersCaught;
  document.getElementById('sd-acc').textContent = `${state.accessories.length} / ${ACCESSORIES.length}`;
  document.getElementById('sd-eq').textContent = `${state.equipment.length} / ${EQUIPMENT.length}`;
  document.getElementById('sd-coins').textContent = state.coins;
  document.getElementById('coin-display').textContent = `🪙 ${state.coins}`;
  document.getElementById('shop-coin-balance').textContent = state.coins;
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

/* ---------- 팝업 (버튼 → 중앙 모달) ---------- */

const popupOverlayEl = document.getElementById('popup-overlay');
let activePopup = null;

function openPopup(name) {
  const target = document.getElementById(`popup-${name}`);
  if (!target) return;

  popupOverlayEl.querySelectorAll('.popup-window').forEach(el => {
    el.classList.toggle('hidden', el !== target);
  });
  popupOverlayEl.classList.add('show');
  popupOverlayEl.setAttribute('aria-hidden', 'false');
  activePopup = name;

  // display:none 상태에서는 scrollHeight가 0이라, 열린 뒤에 맨 아래로 내린다
  if (name === 'terminal') logEl.scrollTop = logEl.scrollHeight;

  // 상점은 코인 잔액에 따라 구매 가능 여부가 바뀌므로 열 때마다 새로 그린다
  if (name === 'shop') { renderShopGrid(); renderShopEquipGrid(); renderStatUpgradeGrid(); }
}

function closePopup() {
  popupOverlayEl.classList.remove('show');
  popupOverlayEl.setAttribute('aria-hidden', 'true');
  activePopup = null;
}

document.querySelectorAll('[data-popup]').forEach(el => {
  el.addEventListener('click', () => openPopup(el.dataset.popup));
});

popupOverlayEl.addEventListener('click', e => {
  if (e.target === popupOverlayEl || e.target.closest('.popup-close')) closePopup();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activePopup) closePopup();
});

function scheduleNextEvent() {
  const delay = 10000 + Math.random() * 15000;
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

  if (!isKnockedOut() && state.curHp < maxHp()) {
    state.curHp = Math.min(maxHp(), state.curHp + 1 + maxHp() * 0.01);
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
  updateCombatGearVisibility();
  updateDeathOverlay();

  if (Date.now() - lastTickSecond >= 1000) {
    lastTickSecond = Date.now();
    tickSecond();
  }

  requestAnimationFrame(loop);
}

function init() {
  addLog('$ node growth.ts --mode=idle');
  addLog('claude-pet 이(가) 자라기 시작했습니다.');

  checkAccessoryUnlocks(false);   // 이미 도달한 레벨의 액세서리를 로드 시점에 조용히 소급 해금
  checkEquipmentUnlocks(false);

  if (typeof state.curHp !== 'number' || state.curHp <= 0) state.curHp = maxHp();

  applyAccessoryVisual(currentAccessory());
  applyEquipmentVisuals();
  applySkinVisual(currentSkin());
  grantOfflineProgress();
  renderAccessoryGrid();
  renderEquipmentGrid();
  renderShopGrid();
  renderShopEquipGrid();
  renderStatUpgradeGrid();
  updateHUD();
  updatePlaytime();
  scheduleNextEvent();
  spawnEnemy();

  requestAnimationFrame(loop);
  setInterval(saveState, 15000);
  // beforeunload는 모바일·탭 강제종료에서 안 불릴 수 있어 pagehide/visibilitychange로 보강
  window.addEventListener('beforeunload', saveState);
  window.addEventListener('pagehide', saveState);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveState();
  });

  document.getElementById('btn-export-save').addEventListener('click', exportSave);
  document.getElementById('btn-import-save').addEventListener('click', importSave);

  if (!storage) {
    document.getElementById('save-indicator').textContent = '⚠ 자동저장 불가 (브라우저 설정)';
    addLog('⚠ 저장소를 사용할 수 없습니다. 시크릿 모드/쿠키 차단 여부를 확인하세요.');
    showToast('저장소를 사용할 수 없습니다', {
      icon: '⚠', variant: 'rare', duration: 6500,
      sub: '시크릿 모드/쿠키 차단 확인 · 스탯 팝업에서 세이브 코드로 백업 가능',
    });
  }
}

init();
