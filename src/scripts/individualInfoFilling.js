// infoFilling.js
document.addEventListener('DOMContentLoaded', () => {
  let personCount = 1;
  const container = document.getElementById('additional-persons');
  const addBtn    = document.getElementById('add-person');
  const nextBtn   = document.getElementById('next-step');

  // 初始化：隐藏代表的删除按钮（仅一人时不允许删除）
  updateRemoveButtons();

  // 添加新购票人
  addBtn.addEventListener('click', () => {
    personCount++;
    const sec = document.createElement('section');
    sec.className = 'box';
    sec.setAttribute('data-index', personCount);
    sec.innerHTML = `
      <button class="remove-person-btn" title="删除本条">&minus;</button>
      <h2>购票人${personCount}（同行人）</h2>
      <div class="field-row">
        <dl>
          <dt class="hissu">姓名<span class="sub">Name</span></dt>
          <dd><input type="text" class="w-mid"></dd>
        </dl>
        <dl>
          <dt class="hissu">年龄<span class="sub">Age</span></dt>
          <dd>
            <div class="spinner_area">
              <input type="number" class="w-short no-spin" min="0" max="200"
                     oninput="this.value = Math.min(Math.max(this.value, 0), 200)">
            </div>
          </dd>
        </dl>
      </div>`;
    container.appendChild(sec);
    attachRemoveEvent(sec.querySelector('.remove-person-btn'));
    renumberSections();
    updateRemoveButtons();
  });

  // 下一步：校验所有框不为空，再跳转
  nextBtn.addEventListener('click', () => {
    // 查找所有 text/number 输入框
    const inputs = document.querySelectorAll('main#app-content input[type="text"], main#app-content input[type="number"]');
    for (const inp of inputs) {
      if (!inp.value.trim()) {
        alert('请填写所有信息后再继续');
        inp.focus();
        return;
      }
    }
    // 如果通过校验，跳转到 seatSelection.html
    const persons = Array.from(document.querySelectorAll('section.box')).map(sec => ({
      userName: sec.querySelector('input[type="text"]').value.trim(),
      age:      +sec.querySelector('input[type="number"]').value,
      isRepresentative: sec.dataset.index === '1'
    }));
    const orderRepresentative = persons.find(p => p.isRepresentative).userName;
    
    sessionStorage.setItem('bookingData', JSON.stringify({ persons, orderRepresentative }));
    window.location.href = 'seatSelection.html?mode=individual';
  });

  // 为已有和新添加的减号按钮绑定事件
  function attachRemoveEvent(btn) {
    btn.addEventListener('click', () => {
      const sec = btn.closest('section.box');
      sec.remove();
      personCount--;
      renumberSections();
      updateRemoveButtons();
    });
  }

  // 重置所有 section 的序号和标题
  function renumberSections() {
    const secs = document.querySelectorAll('main#app-content section.box');
    secs.forEach((sec, idx) => {
      const i = idx + 1;
      sec.setAttribute('data-index', i);
      const h2 = sec.querySelector('h2');
      h2.textContent = i === 1
        ? `购票人1（购票代表）`
        : `购票人${i}（同行人）`;
    });
  }

  // 控制减号按钮的显示：仅当总人数 >1 时展示
  function updateRemoveButtons() {
    const secs = document.querySelectorAll('main#app-content section.box');
    const show = secs.length > 1;
    secs.forEach(sec => {
      const btn = sec.querySelector('.remove-person-btn');
      btn.style.display = (show && sec.dataset.index !== '1') ? 'block' : 'none';
    });
  }

  // 给初始代表绑一次删除事件（但根据长度会隐藏）
  attachRemoveEvent(document.querySelector('section.box .remove-person-btn'));

  // 返回主界面逻辑
  function setupReturnLogic() {
    const returnBtn = document.getElementById('returnButton');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }

  // 初始化返回逻辑
  setupReturnLogic();
});
