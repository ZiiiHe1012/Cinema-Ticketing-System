const ordersData = [
    {
        id: 1,
        movieName: '唐人街探案2',
        time: '2025-06-03 08:20-11:20',
        userName: 'DENG/WEIXIAN',
        age: 20,
        hall: 1,
        seat: '第3排17号',
        orderRepresentative: 'DENG/WEIXIAN',
        orderDate: '2025-05-30',
        categories: ['成人票', '团体票'],
        status: '待支付',
        price: 68,
        isPaid: false  // false = 未支付
    },
    {
        id: 2,
        movieName: '哪吒之魔童闹海',
        time: '2025-06-10 14:00-16:30',
        userName: 'LIN/ZHIYI',
        age: 22,
        hall: 2,
        seat: '第5排8号',
        orderRepresentative: 'LIN/ZHIYI',
        orderDate: '2025-05-25',
        categories: ['成人票'],
        status: '已出票',
        price: 75,
        isPaid: true   // true = 已支付
    }
    ,{
        id: 3,
        movieName: '战狼2',
        time: '2025-06-07 19:30-22:00',
        userName: 'ZHANG/SAN',
        age: 25,
        hall: 3,
        seat: '第2排5号',
        orderRepresentative: 'ZHANG/SAN',
        orderDate: '2025-05-20',
        categories: ['成人票'],
        status: '待支付',
        price: 120,
        isPaid: false  // false = 未支付
    }

];

// 渲染订单卡片
function renderOrders() {
    const container = document.getElementById('ordersContainer');
    container.innerHTML = ''; 
    ordersData.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="route-title">电影名：${order.movieName}</div>
            <div class="route-detail">
                <div class="left">姓名：${order.userName}</div>
                <div class="right">观影时间：${order.time}</div>
                <div class="left">年龄：${order.age}</div>
                <div class="right right-flex">
                    影厅号：${order.hall}
                    <span class="seat">座位号：${order.seat}</span>
                </div>
            </div>
            <div class="order-info">
                <span class="order-number">购票代表：${order.orderRepresentative}</span>
                <span class="order-date">预订日期：${order.orderDate}</span>
            </div>
            <div class="order-category actions-line">
                <div class="categories">
                  ${order.categories.map(cat => `<button class="btn category">${cat}</button>`).join('')}
                </div>
                <div class="price">¥${order.price}</div>
            </div>
            <div class="order-info status-line">
                <span class="status ${order.isPaid ? '' : 'unpaid'}">
                  ${order.isPaid ? '已出票' : '待支付'}
                </span>
                ${
                    order.isPaid
                    ? `<button class="btn delete" data-id="${order.id}">退票</button>`
                    : `<div class="action-group">
                         <button class="btn cancel" data-id="${order.id}">取消预订</button>
                         <button class="btn pay"    data-id="${order.id}">去支付</button>
                       </div>`
                }
            </div>
        `;
        container.appendChild(card);
    });
}

// 退票 & 取消预订 逻辑
function setupOrderActions() {
    document.body.addEventListener('click', e => {
        // 退票
        if (e.target.classList.contains('delete')) {
            if (!confirm('确定要退票吗？')) return;
            const btn = e.target;
            const card = btn.closest('.order-card');
            const statusEl = card.querySelector('.status');
            statusEl.textContent = '已退票';
            statusEl.classList.remove('unpaid');
            statusEl.classList.add('refunded');
            btn.remove();
        }
        // 取消预订
        if (e.target.classList.contains('cancel')) {
            if (!confirm('确定要取消预订吗？')) return;
            const btn = e.target;
            const card = btn.closest('.order-card');
            const statusEl = card.querySelector('.status');
            statusEl.textContent = '已取消';
            statusEl.classList.remove('unpaid');
            statusEl.classList.add('cancelled');
            // 移除“取消预订”和“去支付”按钮
            const payBtn = card.querySelector('.btn.pay');
            if (payBtn) payBtn.remove();
            btn.remove();
        }
    });
}

// 支付弹窗 逻辑
function setupPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.getElementById('modalClose');
    const opts = document.querySelectorAll('.payment-option');
    const optionsPane = document.getElementById('paymentOptions');
    const bankForm = document.getElementById('bankForm');
    let currentOrderId = null;
  
    // 打开弹窗
    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('pay')) {
            currentOrderId = +e.target.dataset.id;
            optionsPane.style.display = 'block';
            bankForm.style.display = 'none';
            modal.style.display = 'block';
        }
    });
  
    // 关闭弹窗
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  
    // 选择支付方式
    opts.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.method === 'bank') {
                optionsPane.style.display = 'none';
                bankForm.style.display = 'block';
            }
            else {
                alert(`${btn.textContent}暂未开通，请选择其他支付方式。`);
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
        // 支付成功更新数据
        const order = ordersData.find(o => o.id === currentOrderId);
        if (order) {
            order.isPaid = true;
        }
        modal.style.display = 'none';
        alert('支付成功！');
        renderOrders();
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
  
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    setupOrderActions();
    setupPaymentModal();
    setupReturnLogic();
});