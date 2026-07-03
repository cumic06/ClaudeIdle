// 정적 데이터 테이블 (액세서리·스킨·장비·몬스터·아이들 이벤트·업적)

const ACCESSORIES = [
  { id: 'none', name: '맨머리 (기본)', unlockLevel: 1, overlay: null },
  {
    id: 'glasses',
    name: '개발자 선글라스',
    unlockLevel: 5,
    overlay: 'assets/sprites/acc-glasses.png',
  },
  { id: 'ballcap', name: '해커톤 볼캡', unlockLevel: 8, overlay: 'assets/sprites/acc-ballcap.png' },
  {
    id: 'headphones',
    name: '코딩 헤드폰',
    unlockLevel: 10,
    overlay: 'assets/sprites/acc-headphones.png',
  },
  {
    id: 'strawhat',
    name: '휴가 밀짚모자',
    unlockLevel: 13,
    overlay: 'assets/sprites/acc-strawhat.png',
  },
  { id: 'crown', name: '시니어 크라운', unlockLevel: 15, overlay: 'assets/sprites/acc-crown.png' },
  { id: 'cap', name: '졸업 캡', unlockLevel: 20, overlay: 'assets/sprites/acc-cap.png' },
  {
    id: 'bandana',
    name: '레드 반다나',
    unlockLevel: 22,
    overlay: 'assets/sprites/acc-bandana.png',
  },
  {
    id: 'eyepatch',
    name: '버그헌터 안대',
    unlockLevel: 25,
    overlay: 'assets/sprites/acc-eyepatch.png',
  },
  {
    id: 'headband',
    name: '포커스 헤어밴드',
    unlockLevel: 28,
    overlay: 'assets/sprites/acc-headband.png',
  },
  {
    id: 'beanie',
    name: '심야코딩 비니',
    unlockLevel: 31,
    overlay: 'assets/sprites/acc-beanie.png',
  },
  { id: 'ribbon', name: '커밋 리본', unlockLevel: 34, overlay: 'assets/sprites/acc-ribbon.png' },
  {
    id: 'flowercrown',
    name: '스프린트 꽃관',
    unlockLevel: 37,
    overlay: 'assets/sprites/acc-flowercrown.png',
  },
  {
    id: 'catears',
    name: '디버그 고양이 귀',
    unlockLevel: 40,
    overlay: 'assets/sprites/acc-catears.png',
  },
  {
    id: 'bunnyears',
    name: '스탠드업 토끼 귀',
    unlockLevel: 42,
    overlay: 'assets/sprites/acc-bunnyears.png',
  },
  {
    id: 'santahat',
    name: '연말 배포 산타모자',
    unlockLevel: 44,
    overlay: 'assets/sprites/acc-santahat.png',
  },
  {
    id: 'partyhat',
    name: '릴리즈 파티모자',
    unlockLevel: 46,
    overlay: 'assets/sprites/acc-partyhat.png',
  },
  {
    id: 'wizardhat',
    name: '아키텍트 마법사모자',
    unlockLevel: 48,
    overlay: 'assets/sprites/acc-wizardhat.png',
  },
  {
    id: 'goggles',
    name: '딥다이브 고글',
    unlockLevel: 50,
    overlay: 'assets/sprites/acc-goggles.png',
  },
  {
    id: 'halo-rare',
    name: '???홀로그램 후광 (희귀)',
    unlockLevel: 0,
    overlay: null,
    rare: true,
    halo: true,
  },
];

const PET_SKINS = [
  {
    id: 'default',
    name: '기본 클로드',
    price: 0,
    icon: '🐾',
    body: 'assets/sprites/pet-body.png',
    armLeft: 'assets/sprites/pet-arm-left.png',
    armRight: 'assets/sprites/pet-arm-right.png',
  },
  {
    id: 'zombie',
    name: '좀비 클로드',
    price: 150,
    icon: '🧟',
    body: 'assets/sprites/pet-body-zombie.png',
    armLeft: 'assets/sprites/pet-arm-left-zombie.png',
    armRight: 'assets/sprites/pet-arm-right-zombie.png',
  },
  {
    id: 'dark',
    name: '다크모드 클로드',
    price: 200,
    icon: '🌙',
    body: 'assets/sprites/pet-body-dark.png',
    armLeft: 'assets/sprites/pet-arm-left-dark.png',
    armRight: 'assets/sprites/pet-arm-right-dark.png',
  },
  {
    id: 'rich',
    name: '부자 클로드',
    price: 300,
    icon: '💰',
    body: 'assets/sprites/pet-body-rich.png',
    armLeft: 'assets/sprites/pet-arm-left-rich.png',
    armRight: 'assets/sprites/pet-arm-right-rich.png',
  },
  {
    id: 'neon',
    name: '네온 클로드',
    price: 400,
    icon: '⚡',
    body: 'assets/sprites/pet-body-neon.png',
    armLeft: 'assets/sprites/pet-arm-left-neon.png',
    armRight: 'assets/sprites/pet-arm-right-neon.png',
  },
  {
    id: 'matrix',
    name: '매트릭스 클로드',
    price: 550,
    icon: '🟢',
    body: 'assets/sprites/pet-body-matrix.png',
    armLeft: 'assets/sprites/pet-arm-left-matrix.png',
    armRight: 'assets/sprites/pet-arm-right-matrix.png',
  },
  // Lv50~100 구간 코인 소비처 확장
  {
    id: 'crimson',
    name: '진홍 클로드',
    price: 700,
    icon: '🔴',
    body: 'assets/sprites/pet-body-crimson.png',
    armLeft: 'assets/sprites/pet-arm-left-crimson.png',
    armRight: 'assets/sprites/pet-arm-right-crimson.png',
  },
  {
    id: 'frost',
    name: '서리 클로드',
    price: 800,
    icon: '❄',
    body: 'assets/sprites/pet-body-frost.png',
    armLeft: 'assets/sprites/pet-arm-left-frost.png',
    armRight: 'assets/sprites/pet-arm-right-frost.png',
  },
  {
    id: 'obsidian',
    name: '흑요석 클로드',
    price: 900,
    icon: '⬛',
    body: 'assets/sprites/pet-body-obsidian.png',
    armLeft: 'assets/sprites/pet-arm-left-obsidian.png',
    armRight: 'assets/sprites/pet-arm-right-obsidian.png',
  },
  {
    id: 'prism',
    name: '프리즘 클로드',
    price: 1000,
    icon: '💎',
    body: 'assets/sprites/pet-body-prism.png',
    armLeft: 'assets/sprites/pet-arm-left-prism.png',
    armRight: 'assets/sprites/pet-arm-right-prism.png',
  },
  // Lv100~200 장기 구간 코인 소비처 확장 (프리미엄 스킨)
  {
    id: 'sunset',
    name: '노을 클로드',
    price: 1400,
    icon: '🌇',
    body: 'assets/sprites/pet-body-sunset.png',
    armLeft: 'assets/sprites/pet-arm-left-sunset.png',
    armRight: 'assets/sprites/pet-arm-right-sunset.png',
  },
  {
    id: 'aurora',
    name: '오로라 클로드',
    price: 1800,
    icon: '🌈',
    body: 'assets/sprites/pet-body-aurora.png',
    armLeft: 'assets/sprites/pet-arm-left-aurora.png',
    armRight: 'assets/sprites/pet-arm-right-aurora.png',
  },
  {
    id: 'royal',
    name: '로열 클로드',
    price: 2400,
    icon: '👑',
    body: 'assets/sprites/pet-body-royal.png',
    armLeft: 'assets/sprites/pet-arm-left-royal.png',
    armRight: 'assets/sprites/pet-arm-right-royal.png',
  },
  {
    id: 'diamond',
    name: '다이아 클로드',
    price: 3200,
    icon: '💠',
    body: 'assets/sprites/pet-body-diamond.png',
    armLeft: 'assets/sprites/pet-arm-left-diamond.png',
    armRight: 'assets/sprites/pet-arm-right-diamond.png',
  },
  // 상자(가챠) 전용 — 상점 구매 불가, spawnChest()로만 획득
  {
    id: 'ghost',
    name: '유령 클로드',
    source: 'gacha',
    rarity: 'common',
    icon: '👻',
    body: 'assets/sprites/pet-body-ghost.png',
    armLeft: 'assets/sprites/pet-arm-left-ghost.png',
    armRight: 'assets/sprites/pet-arm-right-ghost.png',
  },
  {
    id: 'lava',
    name: '용암 클로드',
    source: 'gacha',
    rarity: 'common',
    icon: '🌋',
    body: 'assets/sprites/pet-body-lava.png',
    armLeft: 'assets/sprites/pet-arm-left-lava.png',
    armRight: 'assets/sprites/pet-arm-right-lava.png',
  },
  {
    id: 'ice',
    name: '빙하 클로드',
    source: 'gacha',
    rarity: 'rare',
    icon: '🧊',
    body: 'assets/sprites/pet-body-ice.png',
    armLeft: 'assets/sprites/pet-arm-left-ice.png',
    armRight: 'assets/sprites/pet-arm-right-ice.png',
  },
  {
    id: 'toxic',
    name: '맹독 클로드',
    source: 'gacha',
    rarity: 'rare',
    icon: '☣',
    body: 'assets/sprites/pet-body-toxic.png',
    armLeft: 'assets/sprites/pet-arm-left-toxic.png',
    armRight: 'assets/sprites/pet-arm-right-toxic.png',
  },
  {
    id: 'galaxy',
    name: '은하 클로드',
    source: 'gacha',
    rarity: 'epic',
    icon: '🌌',
    body: 'assets/sprites/pet-body-galaxy.png',
    armLeft: 'assets/sprites/pet-arm-left-galaxy.png',
    armRight: 'assets/sprites/pet-arm-right-galaxy.png',
  },
  {
    id: 'gold',
    name: '황금 클로드',
    source: 'gacha',
    rarity: 'epic',
    icon: '🏆',
    body: 'assets/sprites/pet-body-gold.png',
    armLeft: 'assets/sprites/pet-arm-left-gold.png',
    armRight: 'assets/sprites/pet-arm-right-gold.png',
  },
];

const GACHA_SKINS = PET_SKINS.filter(s => s.source === 'gacha');
const GACHA_RARITY_WEIGHTS = { common: 55, rare: 30, epic: 15 };
const GACHA_DUPLICATE_REFUND = { common: 15, rare: 35, epic: 80 };

const STAT_UPGRADES = [
  { id: 'hp', label: '❤ HP', icon: '❤', step: 5, basePrice: 8, priceGrowth: 1.16 },
  { id: 'atk', label: '⚔ ATK', icon: '⚔', step: 1, basePrice: 12, priceGrowth: 1.2 },
  { id: 'spd', label: '🏃 SPD', icon: '🏃', step: 0.2, basePrice: 10, priceGrowth: 1.2 },
  { id: 'luk', label: '🍀 LUK', icon: '🍀', step: 1, basePrice: 15, priceGrowth: 1.22 },
];

const EQUIP_SLOTS = [
  { id: 'weapon', name: '무기', icon: '🗡' },
  { id: 'shield', name: '방패', icon: '🛡' },
  { id: 'armor', name: '갑옷', icon: '🥋' },
];

const EQUIP_BONUS_LABELS = { atk: 'ATK', def: 'DEF', hp: 'HP' };

const EQUIPMENT = [
  {
    id: 'sword-wood',
    slot: 'weapon',
    name: '나무 검',
    unlockLevel: 3,
    bonus: { atk: 2 },
    sprite: 'assets/sprites/eq-sword-wood.png',
  },
  {
    id: 'sword-steel',
    slot: 'weapon',
    name: '강철 검',
    unlockLevel: 8,
    bonus: { atk: 5 },
    sprite: 'assets/sprites/eq-sword-steel.png',
  },
  {
    id: 'sword-laser',
    slot: 'weapon',
    name: '레이저 블레이드',
    unlockLevel: 14,
    bonus: { atk: 9 },
    sprite: 'assets/sprites/eq-sword-laser.png',
  },
  {
    id: 'sword-legend',
    slot: 'weapon',
    name: '전설의 디버거',
    unlockLevel: 20,
    bonus: { atk: 15 },
    sprite: 'assets/sprites/eq-sword-legend.png',
  },
  {
    id: 'sword-plasma',
    slot: 'weapon',
    name: '플라즈마 소드',
    unlockLevel: 26,
    bonus: { atk: 20 },
    sprite: 'assets/sprites/eq-sword-plasma.png',
  },
  {
    id: 'sword-void',
    slot: 'weapon',
    name: '보이드 세이버',
    unlockLevel: 38,
    bonus: { atk: 28 },
    sprite: 'assets/sprites/eq-sword-void.png',
  },
  {
    id: 'shield-wood',
    slot: 'shield',
    name: '나무 방패',
    unlockLevel: 5,
    bonus: { def: 1 },
    sprite: 'assets/sprites/eq-shield-wood.png',
  },
  {
    id: 'shield-iron',
    slot: 'shield',
    name: '강철 방패',
    unlockLevel: 10,
    bonus: { def: 2 },
    sprite: 'assets/sprites/eq-shield-iron.png',
  },
  {
    id: 'shield-energy',
    slot: 'shield',
    name: '에너지 방패',
    unlockLevel: 16,
    bonus: { def: 4 },
    sprite: 'assets/sprites/eq-shield-energy.png',
  },
  {
    id: 'shield-mythic',
    slot: 'shield',
    name: '신화의 방패',
    unlockLevel: 24,
    bonus: { def: 6 },
    sprite: 'assets/sprites/eq-shield-mythic.png',
  },
  {
    id: 'shield-aegis',
    slot: 'shield',
    name: '이지스 방패',
    unlockLevel: 36,
    bonus: { def: 9 },
    sprite: 'assets/sprites/eq-shield-aegis.png',
  },
  {
    id: 'armor-leather',
    slot: 'armor',
    name: '가죽 갑옷',
    unlockLevel: 6,
    bonus: { hp: 15 },
    sprite: 'assets/sprites/eq-armor-leather.png',
  },
  {
    id: 'armor-iron',
    slot: 'armor',
    name: '강철 갑옷',
    unlockLevel: 12,
    bonus: { hp: 35 },
    sprite: 'assets/sprites/eq-armor-iron.png',
  },
  {
    id: 'armor-mythril',
    slot: 'armor',
    name: '미스릴 갑옷',
    unlockLevel: 18,
    bonus: { hp: 70 },
    sprite: 'assets/sprites/eq-armor-mythril.png',
  },
  {
    id: 'armor-dragon',
    slot: 'armor',
    name: '드래곤 스케일 갑주',
    unlockLevel: 22,
    bonus: { hp: 110 },
    sprite: 'assets/sprites/eq-armor-dragon.png',
  },
  {
    id: 'armor-celestial',
    slot: 'armor',
    name: '천상의 갑주',
    unlockLevel: 34,
    bonus: { hp: 165 },
    sprite: 'assets/sprites/eq-armor-celestial.png',
  },
  // Lv50~100 구간 확장 (레벨 100 밸런스 조정과 함께 추가)
  {
    id: 'sword-quantum',
    slot: 'weapon',
    name: '퀀텀 세이버',
    unlockLevel: 50,
    bonus: { atk: 36 },
    sprite: 'assets/sprites/eq-sword-quantum.png',
  },
  {
    id: 'sword-eclipse',
    slot: 'weapon',
    name: '이클립스 블레이드',
    unlockLevel: 65,
    bonus: { atk: 46 },
    sprite: 'assets/sprites/eq-sword-eclipse.png',
  },
  {
    id: 'sword-infinity',
    slot: 'weapon',
    name: '인피니티 엣지',
    unlockLevel: 80,
    bonus: { atk: 58 },
    sprite: 'assets/sprites/eq-sword-infinity.png',
  },
  {
    id: 'shield-titan',
    slot: 'shield',
    name: '타이탄 방패',
    unlockLevel: 55,
    bonus: { def: 12 },
    sprite: 'assets/sprites/eq-shield-titan.png',
  },
  {
    id: 'shield-phantom',
    slot: 'shield',
    name: '팬텀 방패',
    unlockLevel: 70,
    bonus: { def: 15 },
    sprite: 'assets/sprites/eq-shield-phantom.png',
  },
  {
    id: 'shield-eternal',
    slot: 'shield',
    name: '이터널 방패',
    unlockLevel: 85,
    bonus: { def: 19 },
    sprite: 'assets/sprites/eq-shield-eternal.png',
  },
  {
    id: 'armor-drakonis',
    slot: 'armor',
    name: '드라코니스 갑주',
    unlockLevel: 50,
    bonus: { hp: 220 },
    sprite: 'assets/sprites/eq-armor-drakonis.png',
  },
  {
    id: 'armor-celestion',
    slot: 'armor',
    name: '셀레스티온 갑주',
    unlockLevel: 68,
    bonus: { hp: 290 },
    sprite: 'assets/sprites/eq-armor-celestion.png',
  },
  {
    id: 'armor-omega',
    slot: 'armor',
    name: '오메가 갑주',
    unlockLevel: 88,
    bonus: { hp: 370 },
    sprite: 'assets/sprites/eq-armor-omega.png',
  },
  // Lv100~180 확장 (레벨 200까지 성장 목표를 이어감)
  {
    id: 'sword-aurora',
    slot: 'weapon',
    name: '오로라 블레이드',
    unlockLevel: 100,
    bonus: { atk: 70 },
    sprite: 'assets/sprites/eq-sword-aurora.png',
  },
  {
    id: 'sword-genesis',
    slot: 'weapon',
    name: '제네시스 엣지',
    unlockLevel: 140,
    bonus: { atk: 88 },
    sprite: 'assets/sprites/eq-sword-genesis.png',
  },
  {
    id: 'sword-singularity',
    slot: 'weapon',
    name: '싱귤래리티 소드',
    unlockLevel: 180,
    bonus: { atk: 112 },
    sprite: 'assets/sprites/eq-sword-singularity.png',
  },
  {
    id: 'shield-vanguard',
    slot: 'shield',
    name: '뱅가드 방패',
    unlockLevel: 105,
    bonus: { def: 23 },
    sprite: 'assets/sprites/eq-shield-vanguard.png',
  },
  {
    id: 'shield-bastion',
    slot: 'shield',
    name: '바스티온 방패',
    unlockLevel: 145,
    bonus: { def: 28 },
    sprite: 'assets/sprites/eq-shield-bastion.png',
  },
  {
    id: 'shield-omni',
    slot: 'shield',
    name: '옴니 방패',
    unlockLevel: 185,
    bonus: { def: 35 },
    sprite: 'assets/sprites/eq-shield-omni.png',
  },
  {
    id: 'armor-vantablack',
    slot: 'armor',
    name: '반타블랙 갑주',
    unlockLevel: 100,
    bonus: { hp: 460 },
    sprite: 'assets/sprites/eq-armor-vantablack.png',
  },
  {
    id: 'armor-empyrean',
    slot: 'armor',
    name: '엠피리언 갑주',
    unlockLevel: 140,
    bonus: { hp: 580 },
    sprite: 'assets/sprites/eq-armor-empyrean.png',
  },
  {
    id: 'armor-genesis',
    slot: 'armor',
    name: '제네시스 갑주',
    unlockLevel: 180,
    bonus: { hp: 720 },
    sprite: 'assets/sprites/eq-armor-genesis.png',
  },
  // 상점 구매 전용 (레벨 무관, 코인으로 구매)
  {
    id: 'sword-diamond',
    slot: 'weapon',
    name: '다이아몬드 소드',
    price: 450,
    bonus: { atk: 24 },
    sprite: 'assets/sprites/eq-sword-diamond.png',
  },
  {
    id: 'shield-crystal',
    slot: 'shield',
    name: '크리스탈 방패',
    price: 380,
    bonus: { def: 7 },
    sprite: 'assets/sprites/eq-shield-crystal.png',
  },
  {
    id: 'armor-phoenix',
    slot: 'armor',
    name: '불사조 갑옷',
    price: 550,
    bonus: { hp: 140 },
    sprite: 'assets/sprites/eq-armor-phoenix.png',
  },
  {
    id: 'shield-runic',
    slot: 'shield',
    name: '룬 방패',
    price: 700,
    bonus: { def: 11 },
    sprite: 'assets/sprites/eq-shield-runic.png',
  },
  {
    id: 'armor-nebula',
    slot: 'armor',
    name: '네뷸라 갑주',
    price: 900,
    bonus: { hp: 300 },
    sprite: 'assets/sprites/eq-armor-nebula.png',
  },
  // 상자(가챠) 전용 — 레벨/상점 무관, spawnChest()로 획득. 희귀도는 GACHA_RARITY_WEIGHTS 참조
  {
    id: 'sword-storm',
    slot: 'weapon',
    name: '폭풍의 검',
    source: 'gacha',
    rarity: 'common',
    bonus: { atk: 16 },
    sprite: 'assets/sprites/eq-sword-storm.png',
  },
  {
    id: 'sword-inferno',
    slot: 'weapon',
    name: '인페르노 소드',
    source: 'gacha',
    rarity: 'rare',
    bonus: { atk: 26 },
    sprite: 'assets/sprites/eq-sword-inferno.png',
  },
  {
    id: 'sword-nova',
    slot: 'weapon',
    name: '노바 세이버',
    source: 'gacha',
    rarity: 'epic',
    bonus: { atk: 40 },
    sprite: 'assets/sprites/eq-sword-nova.png',
  },
  {
    id: 'shield-coral',
    slot: 'shield',
    name: '산호 방패',
    source: 'gacha',
    rarity: 'common',
    bonus: { def: 5 },
    sprite: 'assets/sprites/eq-shield-coral.png',
  },
  {
    id: 'shield-thunder',
    slot: 'shield',
    name: '뇌전 방패',
    source: 'gacha',
    rarity: 'rare',
    bonus: { def: 8 },
    sprite: 'assets/sprites/eq-shield-thunder.png',
  },
  {
    id: 'shield-cosmic',
    slot: 'shield',
    name: '코스믹 방패',
    source: 'gacha',
    rarity: 'epic',
    bonus: { def: 13 },
    sprite: 'assets/sprites/eq-shield-cosmic.png',
  },
  {
    id: 'armor-jade',
    slot: 'armor',
    name: '옥 갑옷',
    source: 'gacha',
    rarity: 'common',
    bonus: { hp: 90 },
    sprite: 'assets/sprites/eq-armor-jade.png',
  },
  {
    id: 'armor-abyss',
    slot: 'armor',
    name: '심연 갑주',
    source: 'gacha',
    rarity: 'rare',
    bonus: { hp: 150 },
    sprite: 'assets/sprites/eq-armor-abyss.png',
  },
  {
    id: 'armor-solar',
    slot: 'armor',
    name: '태양 갑주',
    source: 'gacha',
    rarity: 'epic',
    bonus: { hp: 230 },
    sprite: 'assets/sprites/eq-armor-solar.png',
  },
];

const GACHA_EQUIPMENT = EQUIPMENT.filter(e => e.source === 'gacha');

/* ---------- 자동화 (특정 레벨 도달 → 상점에서 코인으로 1회 구매) ---------- */
const AUTOMATIONS = [
  {
    id: 'autoChest',
    name: '자동 상자 수집기',
    icon: '🤖',
    desc: '맵에 나타난 상자를 자동으로 수집·개봉합니다',
    unlockLevel: 25,
    price: 600,
  },
  {
    id: 'chestRadar',
    name: '상자 레이더',
    icon: '📡',
    desc: '상자가 더 자주 나타납니다 (등장 간격 -45%)',
    unlockLevel: 45,
    price: 1500,
  },
];

const ENEMY_TYPES = [
  { id: 'bug', name: '버그', kind: 'bug', width: 58, height: 50 },
  { id: 'mon-1', name: '설인', kind: 'tile', sprite: 'assets/sprites/enemy-1.png' },
  { id: 'mon-2', name: '나비', kind: 'tile', sprite: 'assets/sprites/enemy-2.png' },
  { id: 'mon-3', name: '레드슬라임', kind: 'tile', sprite: 'assets/sprites/enemy-3.png' },
  { id: 'mon-4', name: '박쥐', kind: 'tile', sprite: 'assets/sprites/enemy-4.png' },
  { id: 'mon-5', name: '물고기', kind: 'tile', sprite: 'assets/sprites/enemy-5.png' },
  { id: 'mon-6', name: '젤리', kind: 'tile', sprite: 'assets/sprites/enemy-6.png' },
  { id: 'mon-7', name: '외눈이', kind: 'tile', sprite: 'assets/sprites/enemy-7.png' },
  { id: 'mon-8', name: '꽃게', kind: 'tile', sprite: 'assets/sprites/enemy-8.png' },
  { id: 'mon-9', name: '유령', kind: 'tile', sprite: 'assets/sprites/enemy-9.png' },
  { id: 'mon-10', name: '거미', kind: 'tile', sprite: 'assets/sprites/enemy-10.png' },
  { id: 'mon-11', name: '공벌레', kind: 'tile', sprite: 'assets/sprites/enemy-11.png' },
];

const IDLE_EVENTS = [
  { msg: '☕ 커피 브레이크! 잠시 속도가 빨라집니다', run: () => applyBuff('spdMul', 1.8, 6000) },
  { msg: '🔥 야근 발생... 잠시 느려집니다', run: () => applyBuff('spdMul', 0.5, 6000) },
  { msg: '🎉 커밋 완료! 보너스 EXP 획득', run: () => gainExp(6) },
  {
    msg: '🚨 몬스터 무리 출현!',
    run: () => {
      spawnEnemy();
      spawnEnemy();
    },
  },
  {
    msg: '🐛 버그 폭풍! 몬스터가 몰려온다',
    run: () => {
      for (let i = 0; i < 4; i++) spawnEnemy({ force: true });
    },
  },
  {
    msg: '💰 황금 몬스터 출현! 잡으면 EXP 대박',
    run: () => spawnEnemy({ golden: true, force: true }),
  },
  { msg: '☄ 유성우가 내린다 (+10 EXP)', run: () => meteorShower() },
  { msg: '👾 보스 몬스터 출현!!', run: () => spawnEnemy({ boss: true, force: true }) },
  {
    msg: '🪙 커밋 보너스! 코인을 획득했습니다',
    run: () => gainCoins(5 + Math.floor(Math.random() * 6)),
  },
  { msg: '💪 강철 멘탈! 잠시 공격력이 상승합니다', run: () => applyBuff('atkMul', 1.6, 7000) },
  { msg: '😵 야근 버그로 잠시 공격력이 하락합니다', run: () => applyBuff('atkMul', 0.6, 6000) },
  { msg: '🌙 야식 타임! 체력을 회복합니다', run: () => healPercent(0.25) },
  {
    msg: '📦 익명 후원! 코인을 받았습니다',
    run: () => gainCoins(8 + Math.floor(Math.random() * 12)),
  },
  { msg: '🧹 대청소! 근처 몬스터가 모두 정리됩니다', run: () => clearAllEnemies() },
  {
    msg: '🎁 알림 폭탄! 상자가 하나 더 나타났습니다',
    run: () => {
      if (!activeChest) spawnChest();
    },
  },
  {
    msg: '🌟 스트릭 보너스! 콤보가 증가합니다',
    run: () => {
      comboCount += 2;
      lastKillAt = Date.now();
      floatText(`COMBO x${comboCount}!`, petPos.x + 10, petPos.y - 30, '#8b6bff', 'big');
    },
  },
];

// 손으로 다듬은 초반 업적 (이름·설명이 특별한 것들)
const CURATED_ACHIEVEMENTS = [
  {
    id: 'first-kill',
    name: '첫 처치',
    desc: '몬스터를 처음으로 처치했다',
    icon: '⚔',
    check: s => s.monstersCaught >= 1,
  },
  {
    id: 'kills-50',
    name: '초보 사냥꾼',
    desc: '몬스터 50마리 처치',
    icon: '⚔',
    check: s => s.monstersCaught >= 50,
  },
  {
    id: 'kills-200',
    name: '베테랑 사냥꾼',
    desc: '몬스터 200마리 처치',
    icon: '⚔',
    check: s => s.monstersCaught >= 200,
  },
  {
    id: 'kills-1000',
    name: '전설의 사냥꾼',
    desc: '몬스터 1000마리 처치',
    icon: '⚔',
    check: s => s.monstersCaught >= 1000,
  },
  {
    id: 'first-boss',
    name: '보스 슬레이어',
    desc: '보스 몬스터를 처음으로 처치했다',
    icon: '👾',
    check: s => s.bossesKilled >= 1,
  },
  {
    id: 'boss-10',
    name: '보스 헌터',
    desc: '보스 몬스터 10마리 처치',
    icon: '👾',
    check: s => s.bossesKilled >= 10,
  },
  {
    id: 'first-purchase',
    name: '첫 쇼핑',
    desc: '상점에서 아이템을 처음 구매했다',
    icon: '🛒',
    check: s => s.purchaseCount >= 1,
  },
  {
    id: 'spend-500',
    name: '알뜰 소비',
    desc: '누적 500코인 사용',
    icon: '🪙',
    check: s => s.totalCoinsSpent >= 500,
  },
  {
    id: 'spend-3000',
    name: '큰손',
    desc: '누적 3000코인 사용',
    icon: '🪙',
    check: s => s.totalCoinsSpent >= 3000,
  },
  {
    id: 'first-chest',
    name: '첫 상자',
    desc: '상자를 처음으로 열었다',
    icon: '🎁',
    check: s => s.chestsOpened >= 1,
  },
  {
    id: 'chests-10',
    name: '보물 사냥꾼',
    desc: '상자 10개 개봉',
    icon: '🎁',
    check: s => s.chestsOpened >= 10,
  },
  {
    id: 'level-50',
    name: '중견 개발자',
    desc: '레벨 50 달성',
    icon: '⭐',
    check: s => s.level >= 50,
  },
  {
    id: 'level-100',
    name: '레전드 개발자',
    desc: '레벨 100 달성',
    icon: '⭐',
    check: s => s.level >= 100,
  },
];

// 공식 기반 마일스톤 업적 — 거의 무한에 가깝게 자동 생성 (레벨 200 너머까지 목표 유지)
function _numLabel(n) {
  if (n >= 10000) return `${(n / 10000).toString().replace(/\.0$/, '')}만`;
  if (n >= 1000) return `${(n / 1000).toString().replace(/\.0$/, '')}천`;

  return `${n}`;
}

function _buildMilestoneAchievements() {
  const out = [];
  const push = (id, name, desc, icon, check) => out.push({ id, name, desc, icon, check });

  // 레벨: 110~200 (10단위) + 220~500 (20단위) → 200을 넘어도 계속 목표가 남는다
  const levels = [];
  for (let l = 110; l <= 200; l += 10) levels.push(l);
  for (let l = 220; l <= 500; l += 20) levels.push(l);
  levels.forEach(l =>
    push(`level-${l}`, `Lv.${l} 개발자`, `레벨 ${l} 달성`, '⭐', s => s.level >= l),
  );

  // 처치: 2천 → 100만 (지수 성장)
  [2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000].forEach(n =>
    push(`kills-${n}`, `${_numLabel(n)} 처치`, `몬스터 ${n.toLocaleString()}마리 처치`, '⚔', s => s.monstersCaught >= n),
  );

  // 보스: 25 → 500
  [25, 50, 100, 250, 500].forEach(n =>
    push(`boss-${n}`, `보스 ${n}`, `보스 몬스터 ${n}마리 처치`, '👾', s => s.bossesKilled >= n),
  );

  // 상자: 25 → 2000
  [25, 50, 100, 250, 500, 1000, 2000].forEach(n =>
    push(`chests-${n}`, `상자 ${_numLabel(n)}개`, `상자 ${n.toLocaleString()}개 개봉`, '🎁', s => s.chestsOpened >= n),
  );

  // 누적 코인 사용: 1만 → 100만
  [10000, 30000, 100000, 300000, 1000000].forEach(n =>
    push(`spend-${n}`, `${_numLabel(n)} 코인 소비`, `누적 ${n.toLocaleString()}코인 사용`, '🪙', s => s.totalCoinsSpent >= n),
  );

  // 플레이 시간: 5h → 200h
  [5, 12, 24, 48, 100, 200].forEach(h =>
    push(`play-${h}h`, `${h}시간 플레이`, `누적 ${h}시간 플레이`, '⏱', s => s.totalPlaySeconds >= h * 3600),
  );

  return out;
}

const ACHIEVEMENTS = CURATED_ACHIEVEMENTS.concat(_buildMilestoneAchievements());