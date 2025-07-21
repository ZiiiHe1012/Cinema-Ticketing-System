// groupInfoFilling.js
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
      <h2>观影人${personCount}</h2>
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

  // 下一步：先校验人数，再校验输入框，再跳转
  nextBtn.addEventListener('click', () => {
    // —— 人数校验 ——  
    const secs = document.querySelectorAll('main#app-content section.box');
    if (secs.length < 2) {
      alert('团体购票至少需要2位观影人');
      return;
    }
    // —— 输入非空校验 ——  
    const inputs = document.querySelectorAll(
      'main#app-content input[type="text"], main#app-content input[type="number"]'
    );
    for (const inp of inputs) {
      if (!inp.value.trim()) {
        alert('请填写所有信息后再继续');
        inp.focus();
        return;
      }
    }
    // —— 保存并跳转 ——  
    const persons = Array.from(secs).map(sec => ({
      userName: sec.querySelector('input[type="text"]').value.trim(),
      age:      +sec.querySelector('input[type="number"]').value,
      isRepresentative: sec.dataset.index === '1'
    }));
    const orderRepresentative = persons.find(p => p.isRepresentative).userName;
    sessionStorage.setItem('bookingData',
      JSON.stringify({ persons, orderRepresentative }));
    window.location.href = 'selectFilms.html?mode=group';
  });

  // 以下函数不变：attachRemoveEvent、renumberSections、updateRemoveButtons、setupReturnLogic
  function attachRemoveEvent(btn) {
    btn.addEventListener('click', () => {
      const sec = btn.closest('section.box');
      sec.remove();
      personCount--;
      renumberSections();
      updateRemoveButtons();
    });
  }
  function renumberSections() {
    const secs = document.querySelectorAll('main#app-content section.box');
    secs.forEach((sec, idx) => {
      const i = idx + 1;
      sec.setAttribute('data-index', i);
      sec.querySelector('h2').textContent = `观影人${i}`;
    });
  }
  function updateRemoveButtons() {
    const secs = document.querySelectorAll('main#app-content section.box');
    const show = secs.length > 1;
    secs.forEach(sec => {
      const btn = sec.querySelector('.remove-person-btn');
      btn.style.display = (show && sec.dataset.index !== '1') ? 'block' : 'none';
    });
  }
  attachRemoveEvent(document.querySelector('section.box .remove-person-btn'));
  function setupReturnLogic() {
    document.getElementById('returnButton')
      .addEventListener('click', () => window.location.href = 'index.html');
  }
  setupReturnLogic();
});
