// 세이브 상태 관리 (로드/저장/내보내기·불러오기/리셋)

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

let state = loadState();
let buffs = {};
let enemies = [];
let petPos = { x: 40, y: 40 };
let petTarget = null;
let facingLeft = false;
let lastFrame = performance.now();
let lastTickSecond = Date.now();
let spawnCountdown = 2;
let chestSpawnCountdown = 20;
let petAttackTimer = 0;
let knockedOutUntil = 0;
let codingUntil = 0;
let dancingUntil = 0;
let nextGlyphAt = 0;
let nextNoteAt = 0;

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
    hideEquipmentVisuals: false,
    coins: 0,
    skins: ['default'],
    equippedSkin: 'default',
    statUpgrades: { hp: 0, atk: 0, spd: 0, luk: 0 },
    monstersCaught: 0,
    bossesKilled: 0,
    chestsOpened: 0,
    purchaseCount: 0,
    totalCoinsSpent: 0,
    achievements: [],
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
    if (typeof parsed.level !== 'number' || parsed.level < 1 || !parsed.stats)
      throw new Error('invalid save');

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
    renderAchievementGrid();
    updateHUD();
    updatePlaytime();
    saveState();
    showToast(`세이브 불러오기 완료 (Lv.${state.level})`, { icon: '📥', variant: 'gold' });
    addLog(`📥 세이브를 불러왔습니다 (Lv.${state.level})`);
  } catch {
    showToast('세이브 코드가 올바르지 않습니다', { icon: '⚠', variant: 'rare' });
  }
}

/* ---------- 처음부터 다시하기 (진행 상황 전체 초기화) ---------- */

let resetArmed = false;
let resetArmTimer = null;

function handleResetClick() {
  const btn = document.getElementById('btn-reset-game');

  if (!resetArmed) {
    resetArmed = true;
    btn.textContent = '정말요? 다시 클릭하면 초기화됩니다';
    btn.classList.add('danger-armed');
    clearTimeout(resetArmTimer);
    resetArmTimer = setTimeout(() => {
      resetArmed = false;
      btn.textContent = '새로 시작하기';
      btn.classList.remove('danger-armed');
    }, 4000);

    return;
  }

  clearTimeout(resetArmTimer);
  resetArmed = false;
  btn.textContent = '새로 시작하기';
  btn.classList.remove('danger-armed');
  resetGame();
}

function resetGame() {
  enemies.forEach(e => e.wrap.remove());
  enemies = [];
  buffs = {};
  petPos = { x: 40, y: 40 };
  petTarget = null;
  facingLeft = false;
  knockedOutUntil = 0;
  codingUntil = 0;
  dancingUntil = 0;
  comboCount = 0;
  lastKillAt = 0;
  spawnCountdown = 2;
  chestSpawnCountdown = 20;
  petAttackTimer = 0;

  if (activeChest) {
    clearTimeout(activeChest.timer);
    activeChest.el.remove();
    activeChest = null;
  }

  petBodyEl.classList.remove('ko', 'groggy', 'hurt', 'flip');
  petAnimEl.classList.remove('dance', 'typing', 'lunge');
  laptopEl.classList.remove('shown');
  deathOverlayEl.classList.remove('show');
  petSpriteEl.style.transform = `translate(${petPos.x}px, ${petPos.y}px)`;

  state = freshState();

  applyAccessoryVisual(currentAccessory());
  applyEquipmentVisuals();
  applySkinVisual(currentSkin());
  renderAccessoryGrid();
  renderEquipmentGrid();
  renderShopGrid();
  renderShopEquipGrid();
  renderStatUpgradeGrid();
  renderAchievementGrid();
  updateHUD();
  updatePlaytime();

  closePopup();
  addLog('🔄 처음부터 다시 시작합니다.');
  showToast('새로운 여정을 시작합니다!', { icon: '🔄', variant: 'gold' });
  saveState();
  spawnEnemy();
}

function flashSaveIndicator() {
  const el = document.getElementById('save-indicator');
  el.textContent = '💾 저장됨';

  setTimeout(() => {
    el.textContent = '💾 자동저장 대기중';
  }, 1200);
}

// Lv50까지는 기존 지수 곡선 그대로(이미 익숙한 페이스 유지),
// Lv50 이후는 선형에 가깝게 완만히 늘려 Lv100까지 부담 없이 이어지도록 한다.
// (그대로 지수 곡선을 이어가면 Lv100 단일 레벨업에만 ~6300exp가 필요해 사실상 그라인드가 됨)
const EXP_CURVE_BREAKPOINT = 50;
const EXP_CURVE_TAIL_GROWTH = 0.012;

function expToNext(level) {
  if (level <= EXP_CURVE_BREAKPOINT) return Math.floor(10 * Math.pow(level, 1.4));

  const base = 10 * Math.pow(EXP_CURVE_BREAKPOINT, 1.4);
  const stepsPastBreakpoint = level - EXP_CURVE_BREAKPOINT;

  return Math.floor(base * (1 + stepsPastBreakpoint * EXP_CURVE_TAIL_GROWTH));
}