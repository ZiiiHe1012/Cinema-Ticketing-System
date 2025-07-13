// 硬编码
const movieName   = '哪吒之魔童闹海';
const showTime    = '2025-07-30 14:00-16:30';
const hallNumber  = 3;
const unitPrice   = 68;
const seatNumbers = ['第5排1号','第5排2号','第5排3号','第5排4号','第5排5号'];

function getCategory(age) {
  if (age < 15) return '儿童票';
  if (age > 60) return '老年票';
  return '成人票';
}

function renderBookingInfo() {
  const bookingData = JSON.parse(sessionStorage.getItem('bookingData')) || { persons: [] };
  const seatData = JSON.parse(sessionStorage.getItem('seatData')) || { persons: [] };
  
  // 合并座位信息
  const persons = bookingData.persons.map((p, idx) => ({
    ...p,
    seatInfo: seatData.persons?.[idx]?.seatInfo || '未选座'
  }));
  
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '';

  // —— 折叠汇总卡片 ——  
  const totalPrice = unitPrice * persons.length;
  const summaryCard = document.createElement('div');
  summaryCard.className = 'order-card group-summary';
  summaryCard.innerHTML = `
    <div class="summary-header">
      <div class="route-title">电影名：${movieName}</div>
      <div class="total-wrapper">
        <span class="total-label">团体票总价：</span>
        <span class="total-price">¥${totalPrice}</span>
      </div>
    </div>
    <div class="route-detail summary-detail">
      <span>观影时间：${showTime}</span>
      <span>影厅号：${hallNumber}</span>
    </div>
    <div class="order-category actions-line">
      <div class="categories">
        <button class="btn category">团体票</button>
      </div>
      <button class="toggle-btn">展开</button>
    </div>
  `;
  container.appendChild(summaryCard);

  // —— 详细列表容器（初始隐藏） ——  
  const details = document.createElement('div');
  details.className = 'group-details';
  details.style.display = 'none';

  persons.forEach((p, idx) => {
    const seat = p.seatInfo;
    const category = getCategory(p.age);
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="route-title-unfold">电影名：${movieName}</div>
      <div class="route-detail">
        <div class="left">姓名：${p.userName}</div>
        <div class="right">观影时间：${showTime}</div>
        <div class="left">年龄：${p.age}</div>
        <div class="right-flex">
          <span>影厅号：${hallNumber}</span>
          <span>座位号：${seat}</span>
        </div>
      </div>
      <div class="order-category actions-line">
        <div class="categories">
          <button class="btn category">团体票</button>
          <button class="btn category">${category}</button>
        </div>
        <div class="price">¥${unitPrice}</div>
      </div>
    `;
    details.appendChild(card);
  });
  container.appendChild(details);

  // —— 切换展开/收起 ——  
  const toggleBtn = summaryCard.querySelector('.toggle-btn');
  toggleBtn.addEventListener('click', () => {
    const showing = details.style.display === 'block';
    details.style.display = showing ? 'none' : 'block';
    toggleBtn.textContent = showing ? '展开' : '收起';
  });
}

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

function openPaymentModal() {
  document.getElementById('paymentOptions').style.display = 'block';
  document.getElementById('bankForm').style.display       = 'none';
  document.getElementById('paymentModal').style.display   = 'block';
}

function setupPaymentModal() {
  const modal    = document.getElementById('paymentModal');
  const closeBtn = document.getElementById('modalClose');
  const opts     = document.querySelectorAll('.payment-option');
  const pane     = document.getElementById('paymentOptions');
  const form     = document.getElementById('bankForm');
  const reserveBtn = document.getElementById('reserveBtn');
  const payBtn     = document.getElementById('payBtn');
  const msgEl      = document.getElementById('actionMessage');

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  opts.forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.method === 'bank') {
      pane.style.display = 'none';
      form.style.display = 'block';
    } else {
      alert(btn.textContent + ' 暂未开通，请选择其他支付方式。');
    }
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const no = document.getElementById('cardNumber').value.trim();
    const pw = document.getElementById('cardPassword').value.trim();
    if (!no || !pw) { alert('卡号和密码均不能为空'); return; }
    modal.style.display = 'none';
    reserveBtn.hidden = payBtn.hidden = true;
    msgEl.textContent = '已出票';
    msgEl.style.color = '#4caf50';
  });
}

function setupReturnLogic() {
  document.getElementById('returnButton')
    .addEventListener('click', () => window.location.href = 'index.html');
}

document.addEventListener('DOMContentLoaded', () => {
  renderBookingInfo();
  setupReturnLogic();
});
