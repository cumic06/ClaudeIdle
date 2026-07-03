// 게임 밸런스·타이밍 상수

const SAVE_KEY = 'claudePetGame.save.v3';
const GAME_VERSION = '2026.07.03-1';
const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

const PET_SPRITE = 'assets/sprites/pet.png';

const BUG_FRAME_WIDTH = 58;
const BUG_FRAME_COUNT = 3;

const MAX_ENEMIES = 3;
const SPAWN_INTERVAL = 5;
const PET_ATTACK_RANGE = 60;
const PET_ATTACK_COOLDOWN = 0.7;
const ENEMY_ATTACK_RANGE = 66;
const ENEMY_ATTACK_COOLDOWN = 1.2;
const ENEMY_MOVE_SPEED = 24;
const KO_DURATION_MS = 4000;
const GROGGY_DURATION_MS = 8000;
const DEATH_EXP_LOSS_RATE = 0.3;
const DEATH_SCATTER_RADIUS = 240;

const CODING_MIN_MS = 4000;
const CODING_MAX_MS = 8000;
const DANCE_DURATION_MS = 2600;
const CODE_GLYPHS = ['{ }', ';', '</>', '=>', 'fix()', 'npm i', 'git push', 'console.log'];

/* ---------- 상자(가챠): 맵에 랜덤 스폰 → 클릭 개봉 → 롤링 연출 → 랜덤 장비/스킨 지급 ---------- */

const CHEST_MIN_INTERVAL_S = 40;
const CHEST_MAX_INTERVAL_S = 75;
const CHEST_DESPAWN_MS = 20000;
const GACHA_ROLL_DURATION_MS = 1400;