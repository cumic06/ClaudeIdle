// 전투 (몬스터 스폰/공격/사망/사망 페널티/유휴 애니메이션)

function applyBuff(key, mul, duration) {
  buffs[key] = { mul, until: Date.now() + duration };
}

function buffMul(key) {
  const b = buffs[key];
  if (!b) return 1;
  if (Date.now() > b.until) {
    delete buffs[key];
    return 1;
  }

  return b.mul;
}

function pickNewTarget() {
  const bounds = stageEl.getBoundingClientRect();
  const maxX = Math.max(20, bounds.width - 100);
  const maxY = Math.max(20, bounds.height - 80);
  petTarget = { x: Math.random() * maxX, y: Math.random() * maxY };
}

function spawnEnemy(opts = {}) {
  if (enemies.length >= MAX_ENEMIES && !opts.force) return;

  // 황금/보스는 스프라이트 시트(bug) 대신 단일 타일만 사용 (틴트·확대가 깔끔함)
  const pool = opts.golden || opts.boss ? ENEMY_TYPES.filter(t => t.kind === 'tile') : ENEMY_TYPES;
  const type = pool[Math.floor(Math.random() * pool.length)];
  const bounds = stageEl.getBoundingClientRect();
  const scale = opts.boss ? 1.9 : 1;
  const w = (type.width || 56) * scale;
  const h = (type.height || 56) * scale;
  const x = Math.random() * Math.max(20, bounds.width - w);
  const y = Math.random() * Math.max(20, bounds.height - h);

  const wrap = document.createElement('div');
  wrap.className = 'enemy-wrap';
  wrap.style.left = x + 'px';
  wrap.style.top = y + 'px';

  const sprite = document.createElement('div');
  sprite.className = 'enemy-sprite ' + (type.kind === 'bug' ? 'bug' : 'tile');
  if (type.kind === 'tile') {
    sprite.style.backgroundImage = `url("${type.sprite}")`;

    if (opts.boss) {
      sprite.style.width = w + 'px';
      sprite.style.height = h + 'px';
      sprite.style.backgroundSize = `${w}px ${h}px`;
    }
  }
  if (opts.golden) sprite.classList.add('golden');
  if (opts.boss) sprite.classList.add('boss');
  wrap.appendChild(sprite);

  const hpbar = document.createElement('div');
  hpbar.className = 'enemy-hpbar';
  const hpfill = document.createElement('div');
  hpfill.className = 'fill';
  hpbar.appendChild(hpfill);
  wrap.appendChild(hpbar);

  stageEl.appendChild(wrap);

  const baseHp = 8 + state.level * 3;
  const maxHp = Math.round(baseHp * (opts.boss ? 6 : opts.golden ? 2 : 1));
  enemies.push({
    wrap,
    sprite,
    hpfill,
    x,
    y,
    w,
    h,
    hp: maxHp,
    maxHp,
    atk: Math.round((1 + Math.floor(state.level * 0.7)) * (opts.boss ? 1.6 : 1)),
    attackTimer: Math.random() * ENEMY_ATTACK_COOLDOWN,
    expMul: opts.boss ? 3 : opts.golden ? 4 : 1,
    speedMul: opts.golden ? 1.8 : opts.boss ? 0.7 : 1,
    isBoss: !!opts.boss,
    isGolden: !!opts.golden,
    type,
  });

  if (opts.boss) shakeStage();
}

function damageEnemy(target, amount, crit = false) {
  target.hp -= amount;
  target.hpfill.style.width = `${Math.max(0, (target.hp / target.maxHp) * 100)}%`;

  if (crit) {
    floatText(`-${amount} CRIT!`, target.x + target.w / 2, target.y - 18, '#ff9f43', 'big');
    spawnParticles(target.x + target.w / 2, target.y + target.h / 2, ['#ff9f43', '#ffd54a'], 6);
  } else {
    floatText(`-${amount}`, target.x + target.w / 2, target.y - 14, '#ffd54a');
  }

  target.sprite.classList.add('hit');
  setTimeout(() => target.sprite.classList.remove('hit'), 120);

  if (target.hp <= 0) killEnemy(target);
}

let comboCount = 0;
let lastKillAt = 0;

function killEnemy(target) {
  const cx = target.x + target.w / 2;
  const cy = target.y + target.h / 2;
  spawnParticles(
    cx,
    cy,
    target.isGolden
      ? ['#ffd54a', '#fff2b0', '#f0a878']
      : ['#ff6b6b', '#ffd54a', '#7fd88f', '#57d7f2'],
    target.isBoss ? 22 : 12,
  );

  if (target.isBoss) {
    floatText(`👾 보스 ${target.type.name} 격파!!`, target.x, target.y - 30, '#ff9f43', 'big');
    shakeStage();
  } else {
    floatText(`${target.type.name} 처치!`, target.x, target.y - 26);
  }

  target.wrap.remove();
  enemies = enemies.filter(e => e !== target);
  state.monstersCaught += 1;
  if (target.isBoss) state.bossesKilled += 1;

  // 4초 안에 연속 처치하면 콤보 (보너스 EXP)
  const now = Date.now();
  comboCount = now - lastKillAt < 4000 ? comboCount + 1 : 1;
  lastKillAt = now;
  if (comboCount >= 2) floatText(`COMBO x${comboCount}!`, cx - 24, target.y - 48, '#8b6bff', 'big');

  const exp =
    Math.floor((3 + target.maxHp / 4) * (target.expMul || 1)) + (comboCount >= 2 ? comboCount : 0);
  gainExp(exp);

  const coinGain = target.isBoss ? 12 : target.isGolden ? 6 : 1 + Math.floor(Math.random() * 2);
  gainCoins(coinGain, cx, target.y - 42);

  if (target.isBoss) addLog(`👾 보스 ${target.type.name} 격파!! (+${exp} EXP · +${coinGain}🪙)`);
  else if (target.isGolden)
    addLog(`💰 황금 ${target.type.name} 처치! EXP 대박 (+${exp} EXP · +${coinGain}🪙)`);
  else addLog(`⚔ ${target.type.name} 처치! (총 ${state.monstersCaught}마리)`);

  checkAchievements();
  updateHUD();
}

function damagePet(amount, from) {
  if (isKnockedOut()) return;

  const reduced = Math.max(1, amount - equipBonus('def'));
  state.curHp -= reduced;
  floatText(`-${reduced}`, petPos.x + 30, petPos.y - 12, '#ff6b6b');
  petBodyEl.classList.add('hurt');
  setTimeout(() => petBodyEl.classList.remove('hurt'), 150);

  if (state.curHp <= 0) {
    state.curHp = 0;
    knockedOutUntil = Date.now() + KO_DURATION_MS;
    petBodyEl.classList.add('ko');
    scatterEnemiesOnDeath();
    addLog(`💀 ${from.type.name}에게 당했다... ${KO_DURATION_MS / 1000}초 후 부활`);

    setTimeout(() => {
      state.curHp = maxHp();
      petBodyEl.classList.remove('ko');
      applyDeathPenalty();
      updateHUD();
    }, KO_DURATION_MS);
  }

  updateHUD();
}

function isKnockedOut() {
  return Date.now() < knockedOutUntil;
}

// 몬스터를 파티클과 함께 사라지게 한다 (wrap DOM만 제거 — enemies 배열 정리는 호출측 책임).
// wrap엔 애니메이션이 없어 sprite의 enemy-bob과 충돌하지 않는다.
function vanishEnemy(e) {
  spawnParticles(e.x + e.w / 2, e.y + e.h / 2, ['#8b6bff', '#a78bfa', '#57d7f2'], 8);
  e.wrap.classList.add('vanish');
  setTimeout(() => e.wrap.remove(), 260);
}

// 쓰러지는 순간 주변 몬스터 일부가 흩어져 부활 직후 즉사 재차징을 완화한다
function scatterEnemiesOnDeath() {
  const cx = petPos.x + 48;
  const cy = petPos.y + 30;
  const nearby = enemies.filter(
    e => Math.hypot(e.x + e.w / 2 - cx, e.y + e.h / 2 - cy) <= DEATH_SCATTER_RADIUS,
  );

  if (!nearby.length) return;

  const removeCount = Math.max(1, Math.ceil(nearby.length / 2));
  const toRemove = [...nearby].sort(() => Math.random() - 0.5).slice(0, removeCount);

  toRemove.forEach(vanishEnemy);
  enemies = enemies.filter(e => !toRemove.includes(e));
  addLog(`💨 쓰러지자 주변 몬스터 ${toRemove.length}마리가 흩어졌다`);
}

function updateDeathOverlay() {
  const remaining = knockedOutUntil - Date.now();
  const show = remaining > 0;
  deathOverlayEl.classList.toggle('show', show);

  if (show) deathTimerEl.textContent = `${(remaining / 1000).toFixed(1)}초 후 부활`;
}

/* ---------- 로그라이트 사망 페널티 (EXP 손실 → 레벨 다운 가능 + 그로기) ---------- */

function applyDeathPenalty() {
  // 페널티 1: 현재 레벨 필요 EXP의 30% 손실. 부족하면 레벨 다운 + 스탯 롤백
  const loss = Math.floor(expToNext(state.level) * DEATH_EXP_LOSS_RATE);
  state.exp -= loss;

  let leveledDown = false;
  while (state.exp < 0 && state.level > 1) {
    // levelUp()의 역연산
    state.stats.hp -= 5;
    state.stats.atk -= 1;
    state.stats.spd -= 0.4;
    if (state.level % 3 === 0) state.stats.luk -= 1;
    state.level -= 1;
    state.exp += expToNext(state.level);
    leveledDown = true;
  }
  if (state.exp < 0) state.exp = 0;
  state.curHp = Math.min(state.curHp, maxHp());

  // 페널티 2: 8초간 그로기 — 공격력·이동속도 50%
  applyBuff('atkMul', 0.5, GROGGY_DURATION_MS);
  applyBuff('spdMul', 0.5, GROGGY_DURATION_MS);
  petBodyEl.classList.add('groggy');
  setTimeout(() => petBodyEl.classList.remove('groggy'), GROGGY_DURATION_MS);

  floatText('💫 그로기...', petPos.x + 10, petPos.y - 24, '#a78bfa');

  if (leveledDown) {
    addLog(
      `💀 부활... EXP -${loss} → 레벨 하락! Lv.${state.level} · ${GROGGY_DURATION_MS / 1000}초 그로기`,
    );
    showToast(`부활 페널티: Lv.${state.level}로 하락!`, {
      icon: '💀',
      variant: 'rare',
      sub: `EXP -${loss} · ${GROGGY_DURATION_MS / 1000}초간 공격·속도 50%`,
      duration: 4200,
    });
  } else {
    addLog(`💀 부활... EXP -${loss} · ${GROGGY_DURATION_MS / 1000}초 그로기 (공격·속도 50%)`);
    showToast(`부활 페널티: EXP -${loss}`, {
      icon: '💀',
      sub: `${GROGGY_DURATION_MS / 1000}초간 공격·속도 50%`,
      duration: 4200,
    });
  }

  saveState();
}

function nearestEnemy() {
  let best = null;
  let bestDist = Infinity;

  enemies.forEach(e => {
    const d = Math.hypot(e.x + e.w / 2 - (petPos.x + 48), e.y + e.h / 2 - (petPos.y + 30));
    if (d < bestDist) {
      bestDist = d;
      best = e;
    }
  });

  return { target: best, dist: bestDist };
}

function updateCombat(dt) {
  if (isKnockedOut()) return;

  petAttackTimer -= dt;

  const { target, dist } = nearestEnemy();

  if (target && dist <= PET_ATTACK_RANGE && petAttackTimer <= 0) {
    petAttackTimer = PET_ATTACK_COOLDOWN;

    const critChance = 0.05 + state.stats.luk * 0.005;
    const isCrit = Math.random() < critChance;
    let dmg = Math.max(1, Math.round(petAtk() * buffMul('atkMul'))) + Math.floor(Math.random() * 3);

    if (isCrit) {
      dmg *= 2;
      shakeStage();
    }

    damageEnemy(target, dmg, isCrit);
    petAnimEl.classList.add('lunge');
    setTimeout(() => petAnimEl.classList.remove('lunge'), 140);
  }

  enemies.forEach(e => {
    const d = Math.hypot(e.x + e.w / 2 - (petPos.x + 48), e.y + e.h / 2 - (petPos.y + 30));

    if (d > ENEMY_ATTACK_RANGE) {
      const dirX = petPos.x + 48 - (e.x + e.w / 2);
      const dirY = petPos.y + 30 - (e.y + e.h / 2);
      const len = Math.hypot(dirX, dirY) || 1;
      const speed = ENEMY_MOVE_SPEED * (e.speedMul || 1);
      e.x += (dirX / len) * speed * dt;
      e.y += (dirY / len) * speed * dt;
      e.wrap.style.left = e.x + 'px';
      e.wrap.style.top = e.y + 'px';
      e.sprite.style.transform = dirX < 0 ? 'scaleX(-1)' : '';
    } else {
      e.attackTimer -= dt;
      if (e.attackTimer <= 0) {
        e.attackTimer = ENEMY_ATTACK_COOLDOWN;
        damagePet(e.atk, e);
      }
    }

    if (e.type.kind === 'bug') {
      const frame = Math.floor(performance.now() / 150) % BUG_FRAME_COUNT;
      e.sprite.style.backgroundPositionX = `-${frame * BUG_FRAME_WIDTH}px`;
    }
  });
}

function isDancing() {
  return Date.now() < dancingUntil;
}

function isCoding() {
  return Date.now() < codingUntil;
}

function startDance() {
  dancingUntil = Date.now() + DANCE_DURATION_MS;
  stopCoding();
  petAnimEl.classList.add('dance');
  setTimeout(() => petAnimEl.classList.remove('dance'), DANCE_DURATION_MS);
}

function startCoding() {
  codingUntil = Date.now() + CODING_MIN_MS + Math.random() * (CODING_MAX_MS - CODING_MIN_MS);
  petAnimEl.classList.add('typing');
  laptopEl.classList.add('shown');
}

function stopCoding() {
  codingUntil = 0;
  petAnimEl.classList.remove('typing');
  laptopEl.classList.remove('shown');
}

function updateIdleAnimations() {
  const now = Date.now();

  if (isDancing() && now >= nextNoteAt) {
    nextNoteAt = now + 400;
    const note = Math.random() < 0.5 ? '🎵' : '🎶';
    floatText(note, petPos.x + 20 + Math.random() * 50, petPos.y - 12, '#8b6bff');
  }

  if (isCoding()) {
    if (enemies.length > 0) {
      stopCoding();
      return;
    }

    if (now >= nextGlyphAt) {
      nextGlyphAt = now + 700 + Math.random() * 500;
      const glyph = CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)];
      floatText(glyph, petPos.x + 30 + Math.random() * 40, petPos.y + 40, '#7fd88f');
    }
  } else if (codingUntil !== 0) {
    stopCoding();
    pickNewTarget();
  }
}

function updateMovement(dt) {
  if (isKnockedOut()) return;

  updateIdleAnimations();

  if (isDancing()) return;

  const { target, dist } = nearestEnemy();

  if (target) {
    stopCoding();
    petTarget = { x: target.x + target.w / 2 - 48, y: target.y + target.h / 2 - 30 };
    if (dist <= PET_ATTACK_RANGE * 0.8) {
      facingLeft = target.x + target.w / 2 < petPos.x + 48;
      petSpriteEl.style.transform = `translate(${petPos.x}px, ${petPos.y}px)`;
      petBodyEl.classList.toggle('flip', facingLeft);

      return;
    }
  } else {
    if (isCoding()) return;

    if (!petTarget) pickNewTarget();
  }

  const speed = state.stats.spd * buffMul('spdMul') * 26;
  const dx = petTarget.x - petPos.x;
  const dy = petTarget.y - petPos.y;
  const d = Math.hypot(dx, dy);

  if (d < 4) {
    if (!target && codingUntil === 0) startCoding();
  } else {
    const step = Math.min(d, speed * dt);
    petPos.x += (dx / d) * step;
    petPos.y += (dy / d) * step;
    facingLeft = dx < 0;
  }

  petSpriteEl.style.transform = `translate(${petPos.x}px, ${petPos.y}px)`;
  petBodyEl.classList.toggle('flip', facingLeft);
}