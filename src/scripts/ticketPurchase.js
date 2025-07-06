// ticketPurchase.js
// 静态电影信息（硬编码）
const movieName   = '哪吒之魔童闹海';
const showTime    = '2025-06-10 14:00-16:30';
const hallNumber  = 3;
const unitPrice   = 68;           // 单张票价
const seatNumbers = ['第5排1号', '第5排2号', '第5排3号', '第5排4号', '第5排5号'];

// 根据年龄返回票种
function getCategory(age) {
  if (age < 15) return '儿童票';
  if (age > 60) return '老年票';
  return '成人票';
}

// 渲染每位购票者的独立卡片，使用 info.css 的排版方式，座位号与影厅号同一行
function renderBookingInfo() {
  const data = JSON.parse(localStorage.getItem('bookingData')) || { persons: [], orderRepresentative: '' };
  const { persons, orderRepresentative } = data;
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '';

  const isGroup = persons.length > 1;
  persons.forEach((p, idx) => {
    const category = getCategory(p.age);
    const seat     = seatNumbers[idx] || '—';

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="route-title">电影名：${movieName}</div>
      <div class="route-detail">
        <div class="left">姓名：${p.userName}</div>
        <div class="right">观影时间：${showTime}</div>
        <div class="left">年龄：${p.age}</div>
        <div class="right-flex">
          <span>影厅号：${hallNumber}</span>
          <span>座位号：${seat}</span>
        </div>
      </div>
      <div class="order-info">
        <span class="order-number">购票代表：${orderRepresentative}</span>
      </div>
      <div class="order-category actions-line">
        <div class="categories">
          <button class="btn category">${category}</button>
          ${isGroup ? '<button class="btn category">团体票</button>' : ''}
        </div>
        <div class="price">¥${unitPrice}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 设置“预定”和“去支付”按钮逻辑
function setupButtonsLogic() {
  const reserveBtn = document.getElementById('reserveBtn');
  const payBtn     = document.getElementById('payBtn');
  const msgEl      = document.getElementById('actionMessage');

  reserveBtn.addEventListener('click', () => {
    reserveBtn.hidden = payBtn.hidden = true;
    msgEl.textContent = '预定成功';
    msgEl.style.color = '#f1c40f';
  });

  payBtn.addEventListener('click', () => openPaymentModal());
}

// 打开支付弹窗（复用原有结构）
function openPaymentModal() {
  document.getElementById('paymentOptions').style.display = 'block';
  document.getElementById('bankForm').style.display       = 'none';
  document.getElementById('paymentModal').style.display    = 'block';
}

// 支付弹窗内部逻辑（选择方式 & 银行卡表单提交）
function setupPaymentModal() {
  const modal       = document.getElementById('paymentModal');
  const closeBtn    = document.getElementById('modalClose');
  const opts        = document.querySelectorAll('.payment-option');
  const optionsPane = document.getElementById('paymentOptions');
  const bankForm    = document.getElementById('bankForm');
  const reserveBtn  = document.getElementById('reserveBtn');
  const payBtn      = document.getElementById('payBtn');
  const msgEl       = document.getElementById('actionMessage');

  // 关闭弹窗
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  // 支付方式选择
  opts.forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.method === 'bank') {
      optionsPane.style.display = 'none';
      bankForm.style.display    = 'block';
    } else {
      alert(btn.textContent + ' 暂未开通，请选择其他支付方式。');
    }
  }));

  // 银行卡支付提交
  bankForm.addEventListener('submit', e => {
    e.preventDefault();
    const no = document.getElementById('cardNumber').value.trim();
    const pw = document.getElementById('cardPassword').value.trim();
    if (!no || !pw) { alert('卡号和密码均不能为空'); return; }
    modal.style.display     = 'none';
    document.getElementById('reserveBtn').hidden = true;
    document.getElementById('payBtn').hidden     = true;
    msgEl.textContent       = '已出票';
    msgEl.style.color       = '#4caf50';
  });
}

// 返回主界面逻辑
function setupReturnLogic() {
  const returnBtn = document.getElementById('returnButton');
  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

// 初始化入口
document.addEventListener('DOMContentLoaded', () => {
  renderBookingInfo();
  setupButtonsLogic();
  setupPaymentModal();
  setupReturnLogic();
});