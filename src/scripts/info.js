function loadOrders() {
  // 获取用户订单
  const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
  return [...userOrders];
}

// 渲染所有订单
function renderOrders() {
  const ordersData = loadOrders();
  const container = document.getElementById('ordersContainer');
  container.innerHTML = '';
  
  if (ordersData.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 50px;">暂无订单</p>';
    return;
  }
  
  ordersData.forEach(order => {
    if (order.isGroupMode) {
      renderGroupOrder(order, container);
    } else {
      renderIndividualOrder(order, container);
    }
  });
}

// 个人票渲染
function renderIndividualOrder(order, container) {
    // 每个订单只有一个人
    const person = order.persons[0];
    let statusClass = '';
    switch (order.status) {
        case '待支付': statusClass = 'unpaid'; break;
        case '已退票': statusClass = 'refunded'; break;
        case '已取消': statusClass = 'cancelled'; break;
    }
    
    const isPending = order.status === '待支付';
    const isPaid = order.status === '已出票' || order.status === '已支付';
    const isCancelled = order.status === '已取消' || order.status === '已退票';
    
    const btnsHtml = isCancelled 
        ? ''
        : isPaid
            ? `<button class="btn delete" data-id="${order.id}">退票</button>`
            : isPending
                ? `<div class="action-group">
                     <button class="btn cancel" data-id="${order.id}">取消预订</button>
                     <button class="btn pay" data-id="${order.id}">去支付</button>
                   </div>`
                : '';

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="route-title">电影名：${order.movieName || order.name}</div>
        <div class="route-detail">
            <div class="left">姓名：${person.userName}</div>
            <div class="right">观影时间：${order.time}</div>
            <div class="left">年龄：${person.age}</div>
            <div class="right right-flex">
                影厅号：${order.hall}
                <span class="seat">座位号：${person.seatInfo || '未选座'}</span>
            </div>
        </div>
        <div class="order-info">
            <span class="order-number">购票代表：${order.orderRepresentative || person.userName}</span>
            <span class="order-date">预订日期：${order.orderDate}</span>
        </div>
        <div class="order-category actions-line">
            <div class="categories">
                <button class="btn category">个人票</button>
                <button class="btn category">${getCategory(person.age)}</button>
            </div>
            <div class="price">¥${order.unitPrice}</div>
        </div>
        <div class="order-info status-line">
            <span class="status ${statusClass}">${order.status}</span>
            ${btnsHtml}
        </div>
    `;
    container.appendChild(card);
}

// 团体票渲染
function renderGroupOrder(order, container) {
  const totalPrice = order.totalPrice || (order.unitPrice * order.persons.length);
  
  const summaryCard = document.createElement('div');
  summaryCard.className = 'order-card group-summary';
  
  let statusClass = '';
  switch (order.status) {
    case '待支付': statusClass = 'unpaid'; break;
    case '已退票': statusClass = 'refunded'; break;
    case '已取消': statusClass = 'cancelled'; break;
  }
  
  const isPending = order.status === '待支付';
  const isPaid = order.status === '已出票' || order.status === '已支付';
  
  const btnsHtml = isPaid
    ? `<button class="btn delete" data-id="${order.id}">退票</button>`
    : isPending
      ? `<div class="action-group">
           <button class="btn cancel" data-id="${order.id}">取消预订</button>
           <button class="btn pay" data-id="${order.id}">去支付</button>
         </div>`
      : '';
  summaryCard.innerHTML = `
    <div class="summary-header">
      <div class="route-title">电影名：${order.movieName || order.name}</div>
      <div class="total-wrapper">
        <span class="total-label">团体票总价：</span>
        <span class="total-price">¥${totalPrice}</span>
      </div>
    </div>
    <div class="route-detail summary-detail">
      <div class="left">观影时间：${order.time}</div>
      <div class="left">影厅号：${order.hall}</div>
      <div class="person-count">观影人数：${order.persons.length}</div>
    </div>
    <div class="order-category actions-line">
      <div class="categories">
        <button class="btn category">团体票</button>
      </div>
      <button class="toggle-btn">展开</button>
    </div>
    <div class="order-info status-line">
      <span class="status ${statusClass}">${order.status}</span>
      ${btnsHtml}
    </div>
  `;
  container.appendChild(summaryCard);
  // 详细列表
  const details = document.createElement('div');
  details.className = 'group-details';
  details.style.display = 'none';
  order.persons.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="route-title-unfold">电影名：${order.movieName || order.name}</div>
      <div class="route-detail">
        <div class="left">姓名：${p.userName}</div>
        <div class="right">观影时间：${order.time}</div>
        <div class="left">年龄：${p.age}</div>
        <div class="right-flex">
          <span>影厅号：${order.hall}</span>
          <span>座位号：${p.seatInfo || '未选座'}</span>
        </div>
      </div>
      <div class="order-category actions-line">
        <div class="categories">
          <button class="btn category">团体票</button>
          <button class="btn category">${getCategory(p.age)}</button>
        </div>
        <div class="price">¥${order.unitPrice}</div>
      </div>
    `;
    details.appendChild(card);
  });
  container.appendChild(details);
  // 切换展开/收起
  summaryCard.querySelector('.toggle-btn').addEventListener('click', e => {
    const btn = e.currentTarget;
    const showing = details.style.display === 'block';
    details.style.display = showing ? 'none' : 'block';
    btn.textContent = showing ? '展开' : '收起';
  });
}

// 绑定"取消/退票/去支付"事件
function setupOrderActions() {
  document.body.addEventListener('click', e => {
    const id = +e.target.dataset.id;
    if (!id) return;
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return;
    const order = orders[orderIndex];
    if (e.target.classList.contains('delete') && confirm('确定要退票吗？')) {
    // 退票操作
      if (order.isGroupMode) {
          // 团体票整体退票
          order.status = '已退票';
          releaseSeatsByOrder(order);
      } else {
          // 个人票退票
          order.status = '已退票';
          releaseSeatsByOrder(order);
      }
      updateOrderStorage(orders);
      renderOrders();
  }
    
    if (e.target.classList.contains('cancel') && confirm('确定要取消预订吗？')) {
      order.status = '已取消';
      releaseSeatsByOrder(order);
      updateOrderStorage(orders);
      renderOrders();
    }
    
    if (e.target.classList.contains('pay')) {
      openPaymentModal(id);
    }
  });
}

// 更新订单存储
function updateOrderStorage(orders) {
  const userOrders = orders; 
  localStorage.setItem('userOrders', JSON.stringify(userOrders));
}

// 支付成功后更新状态
function handlePaymentSuccess(orderId) {
  const orders = loadOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = '已出票';
    updateOrderStorage(orders);
    renderOrders();
  }
}

// 修改支付弹窗逻辑
let currentOrderId = null;

function openPaymentModal(orderId) {
  currentOrderId = orderId;
  document.getElementById('paymentOptions').style.display = 'block';
  document.getElementById('bankForm').style.display = 'none';
  document.getElementById('paymentModal').style.display = 'block';
}

function setupPaymentModal() {
  const modal = document.getElementById('paymentModal');
  const closeBtn = document.getElementById('modalClose');
  const opts = document.querySelectorAll('.payment-option');
  const pane = document.getElementById('paymentOptions');
  const form = document.getElementById('bankForm');

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { 
    if (e.target === modal) modal.style.display = 'none'; 
  });
  
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
    if (!no || !pw) {
      alert('卡号和密码均不能为空');
      return;
    }
    modal.style.display = 'none';
    handlePaymentSuccess(currentOrderId);
    alert('支付成功！');
  });
}

// 年龄分类
function getCategory(age) {
  if (age < 15) return '儿童票';
  if (age > 60) return '老年票';
  return '成人票';
}

function setupReturnLogic() {
  document.getElementById('returnButton')
    .addEventListener('click', () => window.location.href = 'index.html');
}

function setupClearAllLogic() {
  const clearAllBtn = document.getElementById('clearAllButton');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有订单吗？此操作不可恢复！')) {
        // 清空 localStorage 中的订单数据
        localStorage.removeItem('userOrders');
        localStorage.removeItem('bookedSeats');
        // 重新渲染页面
        renderOrders();
        alert('所有订单已清空！');
      }
    });
  }
}

function releaseSeatsByOrder(order) {
  let bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];
  // 移除该订单占用的座位
  order.persons.forEach(person => {
    if (person.seatInfo) {
      // 从 seatInfo 字符串中提取座位ID
      const match = person.seatInfo.match(/第(\d+)排(\d+)号/);
      if (match) {
        const seatId = `R${match[1]}C${match[2]}`;
        bookedSeats = bookedSeats.filter(id => id !== seatId);
      }
    }
  });
  // 更新存储
  localStorage.setItem('bookedSeats', JSON.stringify(bookedSeats));
}

// 释放单个人的座位
function releaseSeatByPerson(order, person) {
  if (!person.seatInfo) return;
  let bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];
  const match = person.seatInfo.match(/第(\d+)排(\d+)号/);
  if (match) {
    const seatId = `R${match[1]}C${match[2]}`;
    bookedSeats = bookedSeats.filter(id => id !== seatId);
  }
  localStorage.setItem('bookedSeats', JSON.stringify(bookedSeats));
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  setupOrderActions();
  setupPaymentModal();
  setupClearAllLogic();
  setupReturnLogic();
});