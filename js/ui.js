// 팝업 그리드 카드 공통 빌더
// 스킨·장비·액세서리·자동화·업적·상점 카드가 모두 아래 구조를 공유한다:
//   acc-card > acc-preview > acc-name > [eq-bonus] > acc-status

// grayed=true면 미해금 표시용 흑백 처리
function cardImg(src, grayed = false) {
  const img = document.createElement('img');
  img.src = src;
  if (grayed) img.style.filter = 'grayscale(1) brightness(.35)';

  return img;
}

// classes: 'acc-card' 뒤에 붙일 추가 클래스(공백 중복 허용 — 내부에서 정규화)
// previewText/previewNodes: 프리뷰 내용 (텍스트 이모지 또는 노드 배열 중 하나)
// bonus: 있으면 name과 status 사이에 eq-bonus 줄 추가
// onClick: 있으면 카드 클릭 핸들러 등록
function createCard({
  classes = '',
  previewClass = '',
  previewText,
  previewNodes,
  name,
  bonus,
  status,
  onClick,
}) {
  const card = document.createElement('div');
  card.className = `acc-card ${classes}`.replace(/\s+/g, ' ').trim();

  const preview = document.createElement('div');
  preview.className = `acc-preview ${previewClass}`.replace(/\s+/g, ' ').trim();
  if (previewText !== undefined) preview.textContent = previewText;
  if (previewNodes) previewNodes.forEach(n => n && preview.appendChild(n));
  card.appendChild(preview);

  const nameEl = document.createElement('div');
  nameEl.className = 'acc-name';
  nameEl.textContent = name;
  card.appendChild(nameEl);

  if (bonus !== undefined) {
    const bonusEl = document.createElement('div');
    bonusEl.className = 'eq-bonus';
    bonusEl.textContent = bonus;
    card.appendChild(bonusEl);
  }

  const statusEl = document.createElement('div');
  statusEl.className = 'acc-status';
  statusEl.textContent = status;
  card.appendChild(statusEl);

  if (onClick) card.addEventListener('click', onClick);

  return card;
}
