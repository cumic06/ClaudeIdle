// 상점 (커밋 코인/스탯 강화/스킨·장비 구매)

/* ---------- 재화(커밋 코인) & 상점 (구매형 스킨 · 능력치 강화) ---------- */

function gainCoins(amount, x, y) {
  state.coins += amount;
  floatText(`+${amount}🪙`, x ?? petPos.x + 10, y ?? petPos.y - 24, '#ffd54a');
  updateHUD();
}

// 코인 차감 + 구매 통계 갱신. 잔액이 부족하면 토스트만 띄우고 false를 반환한다.
function spendCoins(price) {
  if (state.coins < price) {
    showToast('코인이 부족합니다', { icon: '🪙' });

    return false;
  }

  state.coins -= price;
  state.purchaseCount += 1;
  state.totalCoinsSpent += price;

  return true;
}

function healPercent(ratio) {
  const healed = Math.round(maxHp() * ratio);
  state.curHp = Math.min(maxHp(), state.curHp + healed);
  floatText(`+${healed} HP`, petPos.x + 10, petPos.y - 20, '#7fd88f');
  updateHUD();
}

// 대청소 이벤트 전용: 근처 몬스터 전부 제거 (사망 시 산개와 달리 전멸)
function clearAllEnemies() {
  if (!enemies.length) return;

  enemies.forEach(vanishEnemy);

  const cleared = enemies.length;
  enemies = [];
  addLog(`🧹 대청소! 몬스터 ${cleared}마리가 사라졌다`);
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
  if (!spendCoins(skin.price)) return;

  state.skins.push(id);
  state.equippedSkin = id;
  addLog(`🛒 스킨 구매: ${skin.name} (-${skin.price}🪙)`);
  showToast(`${skin.name} 구매 완료!`, { icon: skin.icon, variant: 'gold' });
  applySkinVisual(skin);
  renderShopGrid();
  checkAchievements();
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
    const isGacha = skin.source === 'gacha';
    const owned = state.skins.includes(skin.id);
    const equipped = state.equippedSkin === skin.id;
    const afford = !isGacha && state.coins >= skin.price;

    const card = createCard({
      classes: (equipped ? 'equipped' : '') + (!owned && !afford ? ' locked' : ''),
      previewNodes: [cardImg(skin.body, isGacha && !owned)],
      name: owned || !isGacha ? `${skin.icon} ${skin.name}` : `??? (${skin.rarity})`,
      status: equipped
        ? '장착중'
        : owned
          ? '클릭해서 장착'
          : isGacha
            ? '상자에서 랜덤 획득'
            : `${skin.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`,
      onClick: owned ? () => equipSkin(skin.id) : afford ? () => buySkin(skin.id) : undefined,
    });

    shopGridEl.appendChild(card);
  });
}

function buyEquipment(id) {
  const item = EQUIPMENT.find(e => e.id === id);
  if (!item || item.price === undefined || state.equipment.includes(id)) return;
  if (!spendCoins(item.price)) return;

  state.equipment.push(id);
  addLog(`🛒 장비 구매: ${item.name} (-${item.price}🪙)`);
  showToast(`${item.name} 구매 완료!`, {
    icon: '⚔',
    variant: 'gold',
    sub: '⚔ 장비 메뉴에서 장착하세요',
  });
  renderShopEquipGrid();
  renderEquipmentGrid();
  checkAchievements();
  updateHUD();
  saveState();
}

function renderShopEquipGrid() {
  shopEquipGridEl.innerHTML = '';

  EQUIPMENT.filter(eq => eq.price !== undefined).forEach(eq => {
    const owned = state.equipment.includes(eq.id);
    const equipped = state.equipped[eq.slot] === eq.id;
    const afford = state.coins >= eq.price;

    const card = createCard({
      classes: (equipped ? 'equipped' : '') + (!owned && !afford ? ' locked' : ''),
      previewClass: 'eq-preview',
      previewNodes: [cardImg(eq.sprite)],
      name: eq.name,
      bonus: equipBonusText(eq.bonus),
      status: owned
        ? equipped
          ? '장착중'
          : '보유 중 · 클릭해서 장착'
        : `${eq.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`,
      onClick: owned
        ? () => {
            equipItem(eq.id);
            renderShopEquipGrid();
          }
        : afford
          ? () => buyEquipment(eq.id)
          : undefined,
    });

    shopEquipGridEl.appendChild(card);
  });
}

/* ---------- 자동화 (레벨 도달 → 코인으로 1회 구매) ---------- */

function hasAutomation(id) {
  return state.automations.includes(id);
}

// 상자 레이더 보유 시 등장 간격을 줄인다 (main.js 루프에서 참조)
function chestIntervalMul() {
  return hasAutomation('chestRadar') ? CHEST_RADAR_INTERVAL_MUL : 1;
}

function buyAutomation(id) {
  const auto = AUTOMATIONS.find(a => a.id === id);
  if (!auto || hasAutomation(id)) return;

  if (state.level < auto.unlockLevel) {
    showToast(`Lv.${auto.unlockLevel} 도달 시 해금됩니다`, { icon: '🔒' });

    return;
  }

  if (!spendCoins(auto.price)) return;

  state.automations.push(id);
  addLog(`${auto.icon} 자동화 구매: ${auto.name} (-${auto.price}🪙)`);
  showToast(`${auto.name} 작동 시작!`, { icon: auto.icon, variant: 'gold', sub: auto.desc });
  renderAutomationGrid();
  checkAchievements();
  updateHUD();
  saveState();
}

function renderAutomationGrid() {
  if (!automationGridEl) return;
  automationGridEl.innerHTML = '';

  AUTOMATIONS.forEach(auto => {
    const owned = hasAutomation(auto.id);
    const unlocked = state.level >= auto.unlockLevel;
    const afford = state.coins >= auto.price;

    const card = createCard({
      classes: (owned ? 'equipped' : '') + (!owned && (!unlocked || !afford) ? ' locked' : ''),
      previewClass: 'achievement-preview',
      previewText: auto.icon,
      name: auto.name,
      bonus: auto.desc,
      status: owned
        ? '작동 중 ✓'
        : !unlocked
          ? `Lv.${auto.unlockLevel} 필요`
          : `${auto.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`,
      onClick: !owned && unlocked && afford ? () => buyAutomation(auto.id) : undefined,
    });

    automationGridEl.appendChild(card);
  });
}

function buyStatUpgrade(id) {
  const def = STAT_UPGRADES.find(s => s.id === id);
  const count = state.statUpgrades[id] || 0;
  const price = Math.round(def.basePrice * Math.pow(def.priceGrowth, count));

  if (!spendCoins(price)) return;

  state.statUpgrades[id] = count + 1;
  state.stats[id] = Math.round((state.stats[id] + def.step) * 10) / 10;
  if (id === 'hp') state.curHp = maxHp();
  else state.curHp = Math.min(state.curHp, maxHp());

  addLog(`💪 능력치 강화: ${def.label} +${def.step} (-${price}🪙)`);
  showToast(`${def.label} 강화 완료!`, { icon: def.icon, variant: 'gold' });
  renderStatUpgradeGrid();
  checkAchievements();
  updateHUD();
  saveState();
}

/* ---------- 능력치 강화 버튼 꾹 누르기 (연속 구매) ---------- */

const STAT_UPGRADE_HOLD_DELAY = 350; // 누른 후 연속 구매가 시작되기까지의 지연(ms)
const STAT_UPGRADE_HOLD_INTERVAL = 90; // 연속 구매 간격(ms)

let statUpgradeHoldId = null;
let statUpgradeHoldTimeout = null;
let statUpgradeHoldInterval = null;

function startStatUpgradeHold(id) {
  stopStatUpgradeHold();
  statUpgradeHoldId = id;
  buyStatUpgrade(id);
  statUpgradeHoldTimeout = setTimeout(() => {
    statUpgradeHoldInterval = setInterval(repeatStatUpgradeHold, STAT_UPGRADE_HOLD_INTERVAL);
  }, STAT_UPGRADE_HOLD_DELAY);
}

function repeatStatUpgradeHold() {
  const id = statUpgradeHoldId;
  if (!id) return stopStatUpgradeHold();

  const def = STAT_UPGRADES.find(s => s.id === id);
  const count = state.statUpgrades[id] || 0;
  const price = Math.round(def.basePrice * Math.pow(def.priceGrowth, count));

  if (state.coins < price) return stopStatUpgradeHold();

  buyStatUpgrade(id);
}

function stopStatUpgradeHold() {
  clearTimeout(statUpgradeHoldTimeout);
  clearInterval(statUpgradeHoldInterval);
  statUpgradeHoldTimeout = null;
  statUpgradeHoldInterval = null;
  statUpgradeHoldId = null;
}

// 버튼이 매 구매마다 다시 그려지므로, 떼는 동작은 특정 버튼이 아니라
// document/window에 걸어 재렌더링과 무관하게 항상 감지되게 한다.
document.addEventListener('pointerup', stopStatUpgradeHold);
document.addEventListener('pointercancel', stopStatUpgradeHold);
window.addEventListener('blur', stopStatUpgradeHold);

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
    if (afford)
      btn.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        e.preventDefault();
        startStatUpgradeHold(def.id);
      });
    row.appendChild(btn);

    statUpgradeGridEl.appendChild(row);
  });
}