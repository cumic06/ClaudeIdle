// 업적 시스템

/* ---------- 업적 ---------- */

function checkAchievements() {
  const newly = ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id) && a.check(state));
  if (!newly.length) return;

  newly.forEach(a => {
    state.achievements.push(a.id);
    addLog(`🏆 업적 달성: ${a.name}`);
    showToast(`업적 달성: ${a.name}`, { icon: a.icon, variant: 'gold', sub: a.desc });
  });

  renderAchievementGrid();
}

function renderAchievementGrid() {
  if (!achievementGridEl) return;
  achievementGridEl.innerHTML = '';

  ACHIEVEMENTS.forEach(a => {
    const unlocked = state.achievements.includes(a.id);

    const card = document.createElement('div');
    card.className = 'acc-card no-click' + (unlocked ? ' equipped' : ' locked');

    const preview = document.createElement('div');
    preview.className = 'acc-preview achievement-preview';
    preview.textContent = a.icon;
    card.appendChild(preview);

    const name = document.createElement('div');
    name.className = 'acc-name';
    name.textContent = a.name;
    card.appendChild(name);

    const status = document.createElement('div');
    status.className = 'acc-status';
    status.textContent = unlocked ? a.desc : `${a.desc} (미달성)`;
    card.appendChild(status);

    achievementGridEl.appendChild(card);
  });
}