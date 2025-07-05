document.addEventListener('DOMContentLoaded', () => {
  // 当前已有的购票人数
  let personCount = 1;
  const container   = document.getElementById('additional-persons');
  const addBtn      = document.getElementById('add-person');
  const removeBtn   = document.getElementById('remove-person');

  if (!container || !addBtn || !removeBtn) {
    console.error('脚本启动失败，找不到必要的 DOM 元素。', { container, addBtn, removeBtn });
    return;
  }

  addBtn.addEventListener('click', () => {
    personCount++;
    const sec = document.createElement('section');
    sec.className = 'box';
    sec.innerHTML = `
      <h2>购票人${personCount}（同行人）</h2>
      <dl class="00000">
        <dt class="hissu">姓名<span class="sub">Name</span></dt>
        <dd><input type="text" size="10" placeholder="姓名" aria-label="姓名" class="w-mid"></dd>
      </dl>
      <dl class="00000">
        <dt class="hissu">年齢<span class="sub">Age</span></dt>
        <dd>
          <div class="spinner_area">
            <input type="number" size="2" aria-label="年齢" class="w-short no-spin">
          </div>
        </dd>
      </dl>`;
    container.appendChild(sec);
  });

  removeBtn.addEventListener('click', () => {
    if (personCount > 1) {
      // 先删除最后一个“同行人”区块
      container.removeChild(container.lastElementChild);
      personCount--;
    }
    // personCount === 1 时什么也不做
  });
});
