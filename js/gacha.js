// 상자(가챠) 시스템

let activeChest = null;

function spawnChest() {
  if (activeChest) return;

  const bounds = stageEl.getBoundingClientRect();
  const w = 32,
    h = 26;
  const x = Math.random() * Math.max(20, bounds.width - w);
  const y = Math.random() * Math.max(20, bounds.height - h);

  const el = document.createElement('div');
  el.className = 'chest';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.addEventListener('click', openChest);
  stageEl.appendChild(el);

  const timer = setTimeout(() => {
    if (activeChest && activeChest.el === el) {
      el.remove();
      if (activeChest.autoTimer) clearTimeout(activeChest.autoTimer);
      activeChest = null;
    }
  }, CHEST_DESPAWN_MS);

  // 자동 상자 수집기 보유 시: 잠깐 뒤 자동으로 수집·개봉 (등장을 눈으로 볼 여유는 준다)
  let autoTimer = null;
  if (hasAutomation('autoChest')) {
    el.classList.add('auto');
    autoTimer = setTimeout(() => {
      if (activeChest && activeChest.el === el) {
        addLog('🤖 자동 수집기가 상자를 열었습니다');
        openChest();
      }
    }, AUTO_CHEST_COLLECT_DELAY_MS);
  }

  activeChest = { el, timer, autoTimer };
}

function openChest() {
  if (!activeChest) return;

  clearTimeout(activeChest.timer);
  if (activeChest.autoTimer) clearTimeout(activeChest.autoTimer);
  activeChest.el.remove();
  activeChest = null;

  showGachaRoll();
}

function showGachaRoll() {
  if (!gachaRollOverlayEl) {
    grantGachaReward(rollGacha());
    return;
  }

  gachaRollOverlayEl.classList.add('show');
  gachaRollOverlayEl.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    gachaRollOverlayEl.classList.remove('show');
    gachaRollOverlayEl.setAttribute('aria-hidden', 'true');
    grantGachaReward(rollGacha());
  }, GACHA_ROLL_DURATION_MS);
}

function rollGacha() {
  const pool = [
    ...GACHA_EQUIPMENT.map(item => ({ kind: 'equip', item })),
    ...GACHA_SKINS.map(item => ({ kind: 'skin', item })),
  ];
  const weighted = pool.flatMap(entry =>
    Array(GACHA_RARITY_WEIGHTS[entry.item.rarity] || 10).fill(entry),
  );

  return weighted[Math.floor(Math.random() * weighted.length)];
}

function grantGachaReward({ kind, item }) {
  state.chestsOpened += 1;

  const owned =
    kind === 'equip' ? state.equipment.includes(item.id) : state.skins.includes(item.id);

  if (owned) {
    const refund = GACHA_DUPLICATE_REFUND[item.rarity] || 15;
    gainCoins(refund);
    addLog(`🎁 상자 개봉: ${item.name} (이미 보유 중 → +${refund}🪙 전환)`);
    showToast(`중복! ${item.name} → +${refund}🪙`, { icon: '🎁' });
  } else {
    if (kind === 'equip') state.equipment.push(item.id);
    else state.skins.push(item.id);

    addLog(`🎁 상자에서 ${item.name} 획득! (${item.rarity})`);
    queueUnlockPopup({ ...item, rare: item.rarity !== 'common' });

    if (kind === 'equip') renderEquipmentGrid();
    else renderShopGrid();
    renderShopEquipGrid();
  }

  checkAchievements();
  updateHUD();
  saveState();
}