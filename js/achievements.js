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

    const card = createCard({
      classes: 'no-click ' + (unlocked ? 'equipped' : 'locked'),
      previewClass: 'achievement-preview',
      previewText: a.icon,
      name: a.name,
      status: unlocked ? a.desc : `${a.desc} (미달성)`,
    });

    achievementGridEl.appendChild(card);
  });
}