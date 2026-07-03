// 상점 (커밋 코인/스탯 강화/스킨·장비 구매)

/* ---------- 재화(커밋 코인) & 상점 (구매형 스킨 · 능력치 강화) ---------- */

function gainCoins(amount, x, y) {
  state.coins += amount;
  floatText(`+${amount}🪙`, x ?? petPos.x + 10, y ?? petPos.y - 24, '#ffd54a');
  updateHUD();
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

  enemies.forEach(e => {
    spawnParticles(e.x + e.w / 2, e.y + e.h / 2, ['#8b6bff', '#a78bfa', '#57d7f2'], 8);
    e.wrap.classList.add('vanish');
    setTimeout(() => e.wrap.remove(), 260);
  });

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

  if (state.coins < skin.price) {
    showToast('코인이 부족합니다', { icon: '🪙' });

    return;
  }

  state.coins -= skin.price;
  state.purchaseCount += 1;
  state.totalCoinsSpent += skin.price;
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

    const card = document.createElement('div');
    card.className =
      'acc-card' + (equipped ? ' equipped' : '') + (!owned && !afford ? ' locked' : '');

    const preview = document.createElement('div');
    preview.className = 'acc-preview';
    const img = document.createElement('img');
    img.src = skin.body;
    img.style.filter = owned || !isGacha ? '' : 'grayscale(1) brightness(.35)';
    preview.appendChild(img);
    card.appendChild(preview);

    const name = document.createElement('div');
    name.className = 'acc-name';
    name.textContent = owned || !isGacha ? `${skin.icon} ${skin.name}` : `??? (${skin.rarity})`;
    card.appendChild(name);

    const status = document.createElement('div');
    status.className = 'acc-status';
    status.textContent = equipped
      ? '장착중'
      : owned
        ? '클릭해서 장착'
        : isGacha
          ? '상자에서 랜덤 획득'
          : `${skin.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`;
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
  state.purchaseCount += 1;
  state.totalCoinsSpent += item.price;
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

    const card = document.createElement('div');
    card.className =
      'acc-card' + (equipped ? ' equipped' : '') + (!owned && !afford ? ' locked' : '');

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
      ? equipped
        ? '장착중'
        : '보유 중 · 클릭해서 장착'
      : `${eq.price}🪙 ${afford ? '· 클릭해서 구매' : '필요'}`;
    card.appendChild(status);

    if (owned)
      card.addEventListener('click', () => {
        equipItem(eq.id);
        renderShopEquipGrid();
      });
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
  state.purchaseCount += 1;
  state.totalCoinsSpent += price;
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