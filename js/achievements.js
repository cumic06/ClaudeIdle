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

// 계열(chain)당 카드 1장만 노출: 현재 목표(첫 미달성 단계)를 보여주고,
// 달성하면 같은 자리에 다음 단계가 나타난다. 전 단계 완료 시 마지막 업적을 완료 상태로 표시.
function renderAchievementGrid() {
  if (!achievementGridEl) return;
  achievementGridEl.innerHTML = '';

  const chains = new Map();
  ACHIEVEMENTS.forEach(a => {
    const key = a.chain || a.id;
    if (!chains.has(key)) chains.set(key, []);
    chains.get(key).push(a);
  });

  chains.forEach(tiers => {
    const current = tiers.find(a => !state.achievements.includes(a.id));
    const shown = current || tiers[tiers.length - 1];
    const doneCount = tiers.filter(a => state.achievements.includes(a.id)).length;
    const stepLabel = tiers.length > 1 ? ` · ${doneCount}/${tiers.length}단계` : '';

    const card = createCard({
      classes: 'no-click ' + (current ? 'locked' : 'equipped'),
      previewClass: 'achievement-preview',
      previewText: shown.icon,
      name: shown.name,
      status: current ? `${shown.desc} (미달성)${stepLabel}` : `${shown.desc}${stepLabel} 완료!`,
    });

    achievementGridEl.appendChild(card);
  });
}