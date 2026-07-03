// 알림 UI (토스트/레벨업 팝업/언락 카드)

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
  if (unlockQueue.length === 0) {
    unlockActive = false;
    return;
  }
  unlockActive = true;
  showUnlockCard(unlockQueue.shift());
}

function showUnlockCard(acc) {
  if (!unlockOverlayEl) {
    processUnlockQueue();
    return;
  }
  unlockOverlayEl.innerHTML = '';

  const isEquip = !!acc.slot;
  const isSkin = !isEquip && !!acc.body;
  const isGacha = acc.source === 'gacha';

  const card = document.createElement('div');
  card.className = 'unlock-card' + (acc.rare ? ' rare' : '');

  const eyebrow = document.createElement('div');
  eyebrow.className = 'unlock-eyebrow';
  eyebrow.innerHTML = isGacha
    ? `<span class="star">★</span> ${(acc.rarity || '').toUpperCase()} 상자 보상 <span class="star">★</span>`
    : acc.rare
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
  } else if (isSkin) {
    const base = document.createElement('img');
    base.src = acc.body;
    preview.appendChild(base);
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
  if (isGacha) {
    sub.textContent = '상자에서 획득했습니다!';
  } else if (isEquip) {
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
  hint.textContent = isEquip
    ? '클릭하여 계속 · ⚔ 장비 버튼에서 장착'
    : '클릭하여 계속 · 📦 스킨 버튼에서 장착';
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