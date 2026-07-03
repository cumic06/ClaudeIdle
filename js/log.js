// 터미널 로그 출력

function addLog(msg) {
  const div = document.createElement('div');
  div.className = 'line';
  div.textContent = msg;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;

  while (logEl.childElementCount > 40) logEl.removeChild(logEl.firstChild);
}