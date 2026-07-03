// 장비 시스템 (해금/장착/능력치 보너스/렌더링)

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
  const newly = EQUIPMENT.filter(
    eq => state.level >= eq.unlockLevel && !state.equipment.includes(eq.id),
  );
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
  // '장비 겉모습 숨기기'가 켜져 있으면 전투 중에도 숨김 (능력치는 그대로 적용됨)
  const fighting = enemies.length > 0 && !isKnockedOut() && !isDancing() && !isCoding();
  const visible = fighting && !state.hideEquipmentVisuals;

  EQUIP_SLOTS.forEach(slot => {
    petEquipImgs[slot.id].classList.toggle('shown', !!state.equipped[slot.id] && visible);
  });
}

function toggleEquipmentVisibility() {
  state.hideEquipmentVisuals = !state.hideEquipmentVisuals;
  updateCombatGearVisibility();
  updateEquipVisibilityToggleLabel();
  addLog(
    state.hideEquipmentVisuals
      ? '🚫 장비 겉모습을 숨깁니다 (능력치는 유지)'
      : '👁 장비 겉모습을 다시 표시합니다',
  );
  saveState();
}

function updateEquipVisibilityToggleLabel() {
  if (!equipVisibilityToggleEl) return;

  equipVisibilityToggleEl.textContent = state.hideEquipmentVisuals
    ? '🚫 장비 겉모습 숨김'
    : '👁 장비 겉모습 표시';
  equipVisibilityToggleEl.classList.toggle('active', state.hideEquipmentVisuals);
}

function renderEquipmentGrid() {
  updateEquipVisibilityToggleLabel();
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
      name.textContent = unlocked
        ? eq.name
        : eq.source === 'gacha'
          ? `??? (${eq.rarity})`
          : eq.name;
      card.appendChild(name);

      const bonusText = Object.entries(eq.bonus)
        .map(([k, v]) => `+${v} ${EQUIP_BONUS_LABELS[k]}`)
        .join(' · ');
      const bonusEl = document.createElement('div');
      bonusEl.className = 'eq-bonus';
      bonusEl.textContent = unlocked
        ? bonusText
        : eq.source === 'gacha'
          ? '상자에서만 획득'
          : bonusText;
      card.appendChild(bonusEl);

      const status = document.createElement('div');
      status.className = 'acc-status';
      status.textContent = equipped
        ? '장착중 (클릭해서 해제)'
        : unlocked
          ? '클릭해서 장착'
          : eq.source === 'gacha'
            ? '상자에서 랜덤 획득'
            : eq.price !== undefined
              ? `상점에서 구매 (${eq.price}🪙)`
              : `Lv.${eq.unlockLevel} 필요`;
      card.appendChild(status);

      if (unlocked) card.addEventListener('click', () => equipItem(eq.id));

      grid.appendChild(card);
    });

    eqGridEl.appendChild(grid);
  });
}