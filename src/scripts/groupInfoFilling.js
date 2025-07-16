document.addEventListener('DOMContentLoaded', () => {
  const step2 = document.getElementById('step2');
  const countInput = document.getElementById('participant-count');
  const confirmBtn = document.getElementById('confirm-count');
  const participantsContainer = document.getElementById('participants-container');
  const nextStepBtn = document.getElementById('next-step');

  // 第一步：确认人数，生成表单
  confirmBtn.addEventListener('click', () => {
    const count = parseInt(countInput.value, 10);
    if (!count || count < 2 || count > 20) {
      alert('请输入有效的人数（2 ~ 20 人）');
      countInput.focus();
      return;
    }

    // 清空旧内容
    participantsContainer.innerHTML = '';

    for (let i = 1; i <= count; i++) {
      const sec = document.createElement('section');
      sec.className = 'box';
      sec.innerHTML = `
        <h2>成员 ${i}</h2>
        <div class="field-row">
          <div class="form-group">
            <label for="member-name-${i}" class="form-label">
              姓名 <span class="form-label__sub">Name</span>
            </label>
            <div class="form-control">
              <input id="member-name-${i}"
                     name="memberName-${i}"
                     type="text"
                     class="form-input w-mid" />
            </div>
          </div>
          <div class="form-group">
            <label for="member-age-${i}" class="form-label">
              年龄 <span class="form-label__sub">Age</span>
            </label>
            <div class="form-control spinner-area">
              <input id="member-age-${i}"
                     name="memberAge-${i}"
                     type="number"
                     class="form-input w-short no-spin"
                     min="0" max="200"
                     oninput="this.value = Math.min(Math.max(parseInt(this.value,10)||0,0),200)" />
            </div>
          </div>
        </div>`;
      participantsContainer.appendChild(sec);
    }

    countInput.disabled = true;
    countInput.classList.add('confirmed');
    confirmBtn.style.display = 'none';

    // 切换到第二步
    step2.style.display = '';
  });

  // 第二步：校验并提交
  nextStepBtn.addEventListener('click', () => {
    const inputs = step2.querySelectorAll('input[type="text"], input[type="number"]');
    for (const input of inputs) {
      if (!input.value.trim()) {
        alert('请填写所有信息后再继续');
        input.focus();
        return;
      }
    }

    // 收集数据
    const persons = [];
    const sections = participantsContainer.querySelectorAll('section.box');
    sections.forEach((sec, idx) => {
      const name = sec.querySelector(`input[name="memberName-${idx+1}"]`).value.trim();
      const age  = parseInt(
        sec.querySelector(`input[name="memberAge-${idx+1}"]`).value,
        10
      );
      persons.push({ userName: name, age: age });
    });

    // 存储并跳转
    sessionStorage.setItem('bookingData', JSON.stringify({ persons }));
    window.location.href = 'seatSelection.html?mode=group';
  });

  // 返回按钮逻辑
  function setupReturnLogic() {
    document.getElementById('returnButton')
      .addEventListener('click', () => window.location.href = 'index.html');
  }
  setupReturnLogic();
});
