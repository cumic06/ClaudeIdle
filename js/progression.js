// 경험치 획득 및 레벨업

function gainExp(amount) {
  state.exp += amount;
  floatText(`+${amount} EXP`, petPos.x + 10, petPos.y - 10);

  while (state.exp >= expToNext(state.level)) {
    state.exp -= expToNext(state.level);
    levelUp();
  }

  updateHUD();
}

function levelUp() {
  state.level += 1;
  state.stats.hp += 5;
  state.curHp = maxHp();
  state.stats.atk += 1;
  state.stats.spd += 0.4;
  if (state.level % 3 === 0) state.stats.luk += 1;

  const coinReward = 3 + Math.floor(state.level / 2);
  state.coins += coinReward;

  addLog(`⭐ 레벨업! Lv.${state.level} 달성 (+${coinReward}🪙)`);
  showLevelUpPopup(state.level);

  checkAccessoryUnlocks();
  checkEquipmentUnlocks();

  const rareDropChance = 0.02 + state.stats.luk * 0.003;
  if (!state.accessories.includes('halo-rare') && Math.random() < rareDropChance) {
    state.accessories.push('halo-rare');
    addLog('✨ 희귀 액세서리 [???홀로그램 후광]을 발견했습니다!');
    queueUnlockPopup(ACCESSORIES.find(a => a.id === 'halo-rare'));
  }

  renderAccessoryGrid();
  renderEquipmentGrid();
  checkAchievements();
  saveState(); // 레벨업은 즉시 저장 (15초 주기·종료 저장이 누락돼도 진행 보존)
}