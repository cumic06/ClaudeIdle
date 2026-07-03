// HUD·팝업 wiring, 버전 체크, 메인 루프, 초기화 (엔트리 포인트 — 반드시 마지막에 로드)

function updateHUD() {
  const hpMax = maxHp();
  const atkBonus = equipBonus('atk');
  const hpBonus = equipBonus('hp');

  document.getElementById('level').textContent = state.level;
  document.getElementById('exp-text').textContent =
    `${Math.floor(state.exp)} / ${expToNext(state.level)}`;
  document.getElementById('exp-fill').style.width =
    `${(state.exp / expToNext(state.level)) * 100}%`;
  document.getElementById('hp-text').textContent = `${Math.ceil(state.curHp)} / ${hpMax}`;
  document.getElementById('hp-fill').style.width = `${(state.curHp / hpMax) * 100}%`;

  document.getElementById('sd-level').textContent = state.level;
  document.getElementById('sd-exp').textContent =
    `${Math.floor(state.exp)} / ${expToNext(state.level)}`;
  document.getElementById('sd-hp').textContent =
    `${Math.ceil(state.curHp)} / ${hpMax}` + (hpBonus ? ` (+${hpBonus})` : '');
  document.getElementById('sd-atk').textContent = atkBonus
    ? `${state.stats.atk} (+${atkBonus})`
    : state.stats.atk;
  document.getElementById('sd-def').textContent = equipBonus('def');
  document.getElementById('sd-spd').textContent = state.stats.spd.toFixed(1);
  document.getElementById('sd-luk').textContent = state.stats.luk;
  document.getElementById('sd-caught').textContent = state.monstersCaught;
  document.getElementById('sd-acc').textContent =
    `${state.accessories.length} / ${ACCESSORIES.length}`;
  document.getElementById('sd-eq').textContent = `${state.equipment.length} / ${EQUIPMENT.length}`;
  document.getElementById('sd-chests').textContent = state.chestsOpened;
  document.getElementById('sd-achievements').textContent =
    `${state.achievements.length} / ${ACHIEVEMENTS.length}`;
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
  addLog(
    `🌙 자리를 비운 사이 ${Math.floor(cappedSeconds / 60)}분 동안 성장했습니다 (+${idleExp} EXP)`,
  );
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
  if (name === 'shop') {
    renderShopGrid();
    renderShopEquipGrid();
    renderStatUpgradeGrid();
  }
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

/* ---------- 상점 내부 탭 (스탯 강화 / 스킨 / 장비) ---------- */

function openShopTab(name) {
  document
    .querySelectorAll('.shop-tab')
    .forEach(btn => btn.classList.toggle('active', btn.dataset.shopTab === name));
  document
    .querySelectorAll('.shop-tab-panel')
    .forEach(el => el.classList.toggle('hidden', el.id !== `shop-panel-${name}`));
}

document.querySelectorAll('.shop-tab').forEach(btn => {
  btn.addEventListener('click', () => openShopTab(btn.dataset.shopTab));
});

/* ---------- 배포 버전 확인 (오래 열어둔 탭에 새 버전 알림) ---------- */

const versionBannerEl = document.getElementById('version-banner');

async function checkVersion() {
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;

    const data = await res.json();
    if (data.version && data.version !== GAME_VERSION) showVersionMismatch();
  } catch {
    // 오프라인 등 네트워크 오류는 무시
  }
}

function showVersionMismatch() {
  if (!versionBannerEl || versionBannerEl.classList.contains('show')) return;

  versionBannerEl.classList.add('show');
  versionBannerEl.setAttribute('aria-hidden', 'false');
}

document.getElementById('btn-version-reload').addEventListener('click', () => location.reload());

function scheduleNextEvent() {
  const delay = 10000 + Math.random() * 15000;
  setTimeout(() => {
    const event = IDLE_EVENTS[Math.floor(Math.random() * IDLE_EVENTS.length)];
    addLog(event.msg);
    const sp = event.msg.indexOf(' ');
    showToast(sp > 0 ? event.msg.slice(sp + 1) : event.msg, {
      icon: sp > 0 ? event.msg.slice(0, sp) : '›',
    });
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

  chestSpawnCountdown -= dt;
  if (chestSpawnCountdown <= 0 && !activeChest) {
    chestSpawnCountdown =
      CHEST_MIN_INTERVAL_S + Math.random() * (CHEST_MAX_INTERVAL_S - CHEST_MIN_INTERVAL_S);
    spawnChest();
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

  checkAccessoryUnlocks(false); // 이미 도달한 레벨의 액세서리를 로드 시점에 조용히 소급 해금
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
  renderAchievementGrid();
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
    else checkVersion(); // 오래 열어둔 탭으로 돌아왔을 때 새 배포가 있었는지 확인
  });

  setInterval(checkVersion, VERSION_CHECK_INTERVAL_MS);

  document.getElementById('btn-export-save').addEventListener('click', exportSave);
  document.getElementById('btn-import-save').addEventListener('click', importSave);
  document.getElementById('btn-reset-game').addEventListener('click', handleResetClick);
  equipVisibilityToggleEl.addEventListener('click', toggleEquipmentVisibility);

  if (!storage) {
    document.getElementById('save-indicator').textContent = '⚠ 자동저장 불가 (브라우저 설정)';
    addLog('⚠ 저장소를 사용할 수 없습니다. 시크릿 모드/쿠키 차단 여부를 확인하세요.');
    showToast('저장소를 사용할 수 없습니다', {
      icon: '⚠',
      variant: 'rare',
      duration: 6500,
      sub: '시크릿 모드/쿠키 차단 확인 · 스탯 팝업에서 세이브 코드로 백업 가능',
    });
  }
}

init();