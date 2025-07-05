document.addEventListener('DOMContentLoaded', () => {
  // —— 人员增删 ——  
  let personCount = 1;
  const container = document.getElementById('additional-persons');
  const addBtn    = document.getElementById('add-person');
  const removeBtn = document.getElementById('remove-person');

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
      container.removeChild(container.lastElementChild);
      personCount--;
    }
  });

  // —— 绑定支付弹窗逻辑 ——  
  setupPaymentModal();
});

function setupPaymentModal() {
  const modal       = document.getElementById('paymentModal');
  const closeBtn    = document.getElementById('modalClose');
  const optionsPane = document.getElementById('paymentOptions');
  const bankForm    = document.getElementById('bankForm');
  const payBtn      = document.getElementById('confirm-payment');
  const opts        = document.querySelectorAll('.payment-option');
  let   currentOrderId = null;

  if (!modal || !closeBtn || !payBtn) {
    console.error('弹窗绑定失败，缺少必要元素', { modal, closeBtn, payBtn });
    return;
  }

  // 点击“确认支付”就打开弹窗
  payBtn.addEventListener('click', e => {
    currentOrderId = e.target.dataset.id ? +e.target.dataset.id : null;
    optionsPane.style.display = 'block';
    bankForm.style.display    = 'none';
    modal.style.display       = 'block';
  });

  // 关闭弹窗
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // 选择支付方式
  opts.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.method === 'bank') {
        optionsPane.style.display = 'none';
        bankForm.style.display    = 'block';
      } else {
        alert(`“${btn.textContent}”暂未开通，请选择“银行卡”支付。`);
      }
    });
  });

  // 银行卡表单提交
  bankForm.addEventListener('submit', e => {
    e.preventDefault();
    const cardNo = document.getElementById('cardNumber').value.trim();
    const pwd    = document.getElementById('cardPassword').value.trim();
    if (!cardNo || !pwd) {
      alert('卡号和密码均不能为空');
      return;
    }
    // 更新数据 & 重渲染
    if (typeof ordersData !== 'undefined') {
      const order = ordersData.find(o => o.id === currentOrderId);
      if (order) order.isPaid = true;
    }
    modal.style.display = 'none';
    alert('支付成功！');
    if (typeof renderOrders === 'function') renderOrders();
  });
}
