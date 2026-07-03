// 액세서리(헤드기어) 시스템

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
    name.textContent = unlocked ? acc.name : acc.rare ? '??? (희귀 드랍)' : acc.name;
    card.appendChild(name);

    const status = document.createElement('div');
    status.className = 'acc-status';
    status.textContent = equipped
      ? '장착중'
      : unlocked
        ? '클릭해서 장착'
        : acc.rare
          ? '레벨업 시 확률 드랍'
          : `Lv.${acc.unlockLevel} 필요`;
    card.appendChild(status);

    if (unlocked) card.addEventListener('click', () => equipAccessory(acc.id));

    accGridEl.appendChild(card);
  });
}