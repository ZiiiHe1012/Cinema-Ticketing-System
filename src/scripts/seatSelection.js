document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    // 获取座位总数配置（默认200）
    const totalSeatsConfig = parseInt(localStorage.getItem('totalSeats')) || 200;
    
    // 固定配置
    const config = {
        centerX: 450,
        centerY: -2370,
        startAngle: 83,
        endAngle: 97,
        minRadius: 2625,
        seatsPerRow: 20,
        seatWidth: 25,
        seatHeight: 25,
        rowSpacing: 38,
        unitPrice: 68,
        seatImages: {
            default: '../images/greenSeat.png',
            selected: '../images/yellowSeat.png',
            booked: '../images/redSeat.png',
            unavailable: '../images/blackSeat.png'
        }
    };
    
    // 系统状态
    const state = {
        seats: [],
        selectedSeats: [],
        currentPerson: null,
        persons: [],
        isGroupMode: false,
        images: {
            default: null,
            selected: null,
            booked: null,
            unavailable: null
        }
    };
    
    // 初始化系统
    function init() {
        loadBookingData();
        loadSeatImages();
        initializeSeats(totalSeatsConfig);
        setupEventListeners();
        renderPersonList();
        updateSummary();
    }
    
    // 加载购票数据
    function loadBookingData() {
        const data = JSON.parse(sessionStorage.getItem('bookingData')) || { persons: [] };
        state.persons = data.persons.map((p, idx) => ({
            ...p,
            id: idx + 1,
            type: getPersonType(p.age),
            selectedSeat: null
        }));
        
        // 判断是否为团体票
        state.isGroupMode = state.persons.length >= 2 && 
                           window.location.href.includes('group');
        
        if (state.isGroupMode) {
            document.body.classList.add('group-mode');
        }
    }
    
    // 获取人员类型
    function getPersonType(age) {
        if (age < 15) return 'child';
        if (age > 60) return 'elder';
        return 'adult';
    }
    
    // 加载座位图片
    function loadSeatImages() {
        Object.keys(config.seatImages).forEach(key => {
            state.images[key] = new Image();
            state.images[key].src = config.seatImages[key];
        });
    }
    
    // 初始化座位
    function initializeSeats(totalSeats) {
        const rows = Math.ceil(totalSeats / config.seatsPerRow);
        const angleRange = config.endAngle - config.startAngle;
        
        state.seats = [];
        const angleSpacing = angleRange / (config.seatsPerRow + 3);

        const bookedSeatIds = JSON.parse(localStorage.getItem('bookedSeats')) || [];
        
        let seatIndex = 0;
        for (let row = 0; row < rows; row++) {
            const radius = config.minRadius + (row * config.rowSpacing);
            const seatsInRow = Math.min(totalSeats - (row * config.seatsPerRow), config.seatsPerRow);
            const offset = (angleRange - (angleSpacing * (seatsInRow - 1))) / 2;
            
            for (let col = 0; col < seatsInRow; col++) {
                const angle = config.startAngle + offset + (col * angleSpacing);
                const angleRad = angle * Math.PI / 180;
                
                const seatX = config.centerX + radius * Math.cos(angleRad);
                const seatY = config.centerY + radius * Math.sin(angleRad) + 30;

                const seatId = `R${row + 1}C${col + 1}`;
                const isBooked = bookedSeatIds.includes(seatId);
                
                state.seats.push({
                    row: row + 1,
                    col: col + 1,
                    id: seatId,
                    index: seatIndex,
                    x: seatX,
                    y: seatY,
                    angleRad,
                    status: isBooked ? 'booked' : 'default',
                    bounds: {
                        x: seatX - config.seatWidth/2,
                        y: seatY - config.seatHeight/2,
                        width: config.seatWidth,
                        height: config.seatHeight
                    }
                });
                seatIndex++;
            }
        }
        
        drawAll();
    }
    
    // 渲染人员列表
    function renderPersonList() {
        const container = document.getElementById('personsContainer');
        container.innerHTML = '';
        state.persons.forEach(person => {
            const card = document.createElement('div');
            card.className = 'person-card';
            if (state.currentPerson?.id === person.id) {
                card.classList.add('selected');
            }
            if (person.selectedSeat) {
                card.classList.add('has-seat');
            }
            card.innerHTML = `
                <div class="person-info">
                    <div>
                        <div class="person-name">${person.userName}</div>
                        <div class="person-age">年龄：${person.age}岁</div>
                    </div>
                    <div class="person-type ${person.type}">
                        ${person.type === 'child' ? '儿童票' : 
                          person.type === 'elder' ? '老年票' : '成人票'}
                    </div>
                </div>
                ${person.selectedSeat ? 
                  `<div class="seat-info">座位：第${person.selectedSeat.row}排${person.selectedSeat.col}号</div>` : 
                  ''}
            `;
            card.addEventListener('click', () => selectPerson(person));
            container.appendChild(card);
        });
        // 自动选择第一个人
        if (!state.currentPerson && state.persons.length > 0 && !state.isGroupMode) {
            selectPerson(state.persons[0]);
        }
        // 单独更新团体可用座位
        if (state.isGroupMode) {
        updateGroupAvailableSeats();
        drawAll();
    }
    }
    // 选择人员
    function selectPerson(person) {
        if (state.isGroupMode) return;
        state.currentPerson = person;
        renderPersonList();
        updateAvailableSeats();
        drawAll();
    }
    // 更新可用座位-个人
    function updateAvailableSeats() {
        if (!state.currentPerson) return;
        const totalRows = Math.ceil(state.seats.length / config.seatsPerRow);
        state.seats.forEach(seat => {
            // 重置非已选座位的状态
            if (seat.status === 'unavailable') {
                seat.status = 'default';
            }
            // 根据人员类型设置座位可用性
            if (state.currentPerson.type === 'child' && seat.row <= 3) {
                seat.status = 'unavailable';
            } else if (state.currentPerson.type === 'elder' && seat.row > totalRows - 3) {
                seat.status = 'unavailable';
            }
        });
    }
    
    // 更新可用座位-团体
    function updateGroupAvailableSeats() {
        if (!state.isGroupMode) return;
        const totalRows = Math.ceil(state.seats.length / config.seatsPerRow);
        const hasChild = state.persons.some(p => p.type === 'child');
        const hasElder = state.persons.some(p => p.type === 'elder');
        state.seats.forEach(seat => {
            if (seat.status === 'unavailable') {
                seat.status = 'default';
            }
            if (hasChild && seat.row <= 3) {
                seat.status = 'unavailable';
            } else if (hasElder && seat.row > totalRows - 3) {
                seat.status = 'unavailable';
            }
        });
    }
    // 自动选座
    function autoSelect() {
        clearSelection();
        if (state.isGroupMode) {
            autoSelectGroup();
        } else {
            autoSelectIndividual();
        }
        drawAll();
        updateSummary();
    }
    // 个人自动选座
    function autoSelectIndividual() {
        const totalRows = Math.ceil(state.seats.length / config.seatsPerRow);
        state.persons.forEach(person => {
            let bestSeat = null;
            let bestScore = -1;
            state.seats.forEach(seat => {
                if (seat.status !== 'default') return;
                // 检查限制
                if (person.type === 'child' && seat.row <= 3) return;
                if (person.type === 'elder' && seat.row > totalRows - 3) return;
                // 计算得分（行数越小越好，离中间越近越好）
                const rowScore = totalRows - seat.row;
                const colScore = 20 - Math.abs(seat.col - 10);
                const score = rowScore * 2 + colScore;
                if (score > bestScore) {
                    bestScore = score;
                    bestSeat = seat;
                }
            });
            if (bestSeat) {
                bestSeat.status = 'selected';
                person.selectedSeat = bestSeat;
                state.selectedSeats.push(bestSeat);
            }
        });
        renderPersonList();
    }
    // 团体自动选座
    function autoSelectGroup() {
        const groupSize = state.persons.length;
        const totalRows = Math.ceil(state.seats.length / config.seatsPerRow);
        let bestRow = null;
        let bestStartCol = null;
        let bestScore = -1;
        for (let row = 1; row <= totalRows; row++) {
            const hasChildRestriction = state.persons.some(p => p.type === 'child' && row <= 3);
            const hasElderRestriction = state.persons.some(p => p.type === 'elder' && row > totalRows - 3);
            if (hasChildRestriction || hasElderRestriction) continue;
            const rowSeats = state.seats.filter(s => s.row === row)
                                       .sort((a, b) => a.col - b.col);
            for (let startIdx = 0; startIdx <= rowSeats.length - groupSize; startIdx++) {
                let canSelect = true;  
                for (let i = 0; i < groupSize; i++) {
                    if (rowSeats[startIdx + i].status !== 'default') {
                        canSelect = false;
                        break;
                    }
                } 
                if (canSelect) {
                    const startCol = rowSeats[startIdx].col;
                    const rowScore = totalRows - row;
                    const centerCol = startCol + groupSize / 2;
                    const colScore = 20 - Math.abs(centerCol - 10);
                    const score = rowScore * 2 + colScore;     
                    if (score > bestScore) {
                        bestScore = score;
                        bestRow = row;
                        bestStartCol = startCol;
                    }
                }
            }
        }
        if (bestRow && bestStartCol) {
            const selectedRowSeats = state.seats.filter(s => 
                s.row === bestRow && 
                s.col >= bestStartCol && 
                s.col < bestStartCol + groupSize
            ).sort((a, b) => a.col - b.col);
            selectedRowSeats.forEach((seat, idx) => {
                seat.status = 'selected';
                state.persons[idx].selectedSeat = seat;
                state.selectedSeats.push(seat);
            });
            renderPersonList();
        } else {
            alert('无法找到符合要求的连续座位！');
        }
    }
    // 清空选择
    function clearSelection() {
        state.selectedSeats.forEach(seat => {
            if (seat.status === 'selected') {
                seat.status = 'default';
            }
        });
        state.selectedSeats = [];
        state.persons.forEach(person => {
            person.selectedSeat = null;
        });
        renderPersonList();
        updateSummary();
        drawAll();
    }
    // 更新汇总信息
    function updateSummary() {
        document.getElementById('selectedCount').textContent = state.selectedSeats.length;
        document.getElementById('totalPrice').textContent = state.selectedSeats.length * config.unitPrice;
        const seatsInfo = document.getElementById('selectedSeatsInfo');
        seatsInfo.innerHTML = '';
        state.persons.forEach(person => {
            if (person.selectedSeat) {
                const assignment = document.createElement('div');
                assignment.className = 'seat-assignment';
                assignment.innerHTML = `
                    <span class="name">${person.userName}</span>
                    <span class="seat">第${person.selectedSeat.row}排${person.selectedSeat.col}号</span>
                `;
                seatsInfo.appendChild(assignment);
            }
        });
    }
    // 确认选座
    function confirmSelection() {
        const unselectedPersons = state.persons.filter(p => !p.selectedSeat);
        if (unselectedPersons.length > 0) {
            alert(`还有 ${unselectedPersons.length} 人未选座！`);
            return;
        }
        // 显示预定/支付弹窗
        document.getElementById('confirmModal').style.display = 'block';
    }
    // 处理预定
    function handleReserve() {
        saveOrderData('待支付');
        alert('预定成功！');
        // 跳转到相应的购票页面
        if (state.isGroupMode) {
            window.location.href = 'groupTicketPurchase.html';
        } else {
            window.location.href = 'individualTicketPurchase.html';
        }
    }
    // 处理支付
    function handlePay() {
        document.getElementById('confirmModal').style.display = 'none';
        document.getElementById('paymentModal').style.display = 'block';
    }
    // 保存订单数据
    function saveOrderData(status) {
        const seatData = {
            persons: state.persons.map(p => ({
                ...p,
                seatInfo: p.selectedSeat ? `第${p.selectedSeat.row}排${p.selectedSeat.col}号` : null
            })),
            totalPrice: state.selectedSeats.length * config.unitPrice,
            isGroupMode: state.isGroupMode,
            orderStatus: status,
            movieInfo: {
                name: '哪吒之魔童闹海',
                time: '2025-06-10 14:00-16:30',
                hall: 3,
                unitPrice: config.unitPrice
            }
        };
        
        sessionStorage.setItem('seatData', JSON.stringify(seatData));
        
        // 个人票模式：为每个人创建独立订单
        const existingOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
        
        if (!state.isGroupMode) {
            // 个人票：每个人一个独立订单
            seatData.persons.forEach(person => {
                const individualOrder = {
                    id: Date.now() + Math.random(), // 确保ID唯一
                    ...seatData.movieInfo,
                    persons: [person], // 只包含这一个人
                    totalPrice: config.unitPrice,
                    status: status,
                    orderDate: new Date().toISOString().split('T')[0],
                    isGroupMode: false,
                    orderRepresentative: seatData.persons.find(p => p.isRepresentative)?.userName
                };
                existingOrders.push(individualOrder);
            });
        } else {
            // 团体票：保持原有逻辑
            const newOrder = {
                id: Date.now(),
                ...seatData.movieInfo,
                persons: seatData.persons,
                totalPrice: seatData.totalPrice,
                status: status,
                orderDate: new Date().toISOString().split('T')[0],
                isGroupMode: true
            };
            existingOrders.push(newOrder);
        }
        
        localStorage.setItem('userOrders', JSON.stringify(existingOrders));
        
        // 更新已售座位信息
        let bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];
        state.selectedSeats.forEach(seat => {
            if (!bookedSeats.includes(seat.id)) {
                bookedSeats.push(seat.id);
            }
        });
        localStorage.setItem('bookedSeats', JSON.stringify(bookedSeats));
    }
    // 处理座位点击
    function handleSeatClick(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;
        const clickedSeat = state.seats.find(seat => {
            return mouseX >= seat.bounds.x && 
                   mouseX <= seat.bounds.x + seat.bounds.width &&
                   mouseY >= seat.bounds.y && 
                   mouseY <= seat.bounds.y + seat.bounds.height;
        });
        if (!clickedSeat) return;
        if (state.isGroupMode) {
            handleGroupSeatClick(clickedSeat, event);
        } else {
            handleIndividualSeatClick(clickedSeat);
        }
    }
    // 个人票座位点击处理
    function handleIndividualSeatClick(seat) {
        if (!state.currentPerson) {
            alert('请先选择购票人！');
            return;
        }
        if (seat.status === 'booked' || seat.status === 'unavailable') {
            return;
        }
        const occupiedBy = state.persons.find(p => p.selectedSeat?.id === seat.id && p.id !== state.currentPerson.id);
        if (occupiedBy) {
            alert(`该座位已被 ${occupiedBy.userName} 选择！`);
            return;
        }
        if (state.currentPerson.selectedSeat) {
            state.currentPerson.selectedSeat.status = 'default';
            state.selectedSeats = state.selectedSeats.filter(s => s.id !== state.currentPerson.selectedSeat.id);
        }
        seat.status = 'selected';
        state.currentPerson.selectedSeat = seat;
        state.selectedSeats.push(seat);
        renderPersonList();
        updateSummary();
        drawAll();
        const nextPerson = state.persons.find(p => !p.selectedSeat && p.id !== state.currentPerson.id);
        if (nextPerson) {
            selectPerson(nextPerson);
        }
    }
    // 团体票座位点击处理
    function handleGroupSeatClick(seat, event) {
        if (seat.status === 'booked') return;
        const totalRows = Math.ceil(state.seats.length / config.seatsPerRow);
        const hasChildRestriction = state.persons.some(p => p.type === 'child' && seat.row <= 3);
        const hasElderRestriction = state.persons.some(p => p.type === 'elder' && seat.row > totalRows - 3);
        if (event.ctrlKey || event.metaKey) {
            handleGroupMultiSelect(seat);
        } else {
            handleGroupContinuousSelect(seat);
        }
    }
    // 团体票连续选择
    function handleGroupContinuousSelect(clickedSeat) {
        const groupSize = state.persons.length;
        const row = clickedSeat.row;
        clearSelection();
        const rowSeats = state.seats.filter(s => s.row === row).sort((a, b) => a.col - b.col);
        const clickedIndex = rowSeats.findIndex(s => s.id === clickedSeat.id);
        let startIndex = Math.max(0, Math.min(clickedIndex, rowSeats.length - groupSize));
        let canSelect = true;
        for (let i = 0; i < groupSize; i++) {
            if (!rowSeats[startIndex + i] || rowSeats[startIndex + i].status !== 'default') {
                canSelect = false;
                break;
            }
        }
        if (!canSelect) {
            for (let offset = 1; offset < rowSeats.length; offset++) {
                if (clickedIndex - offset >= 0 && clickedIndex - offset + groupSize <= rowSeats.length) {
                    canSelect = true;
                    startIndex = clickedIndex - offset;
                    for (let i = 0; i < groupSize; i++) {
                        if (!rowSeats[startIndex + i] || rowSeats[startIndex + i].status !== 'default') {
                            canSelect = false;
                            break;
                        }
                    }
                    if (canSelect) break;
                }  
                if (clickedIndex + offset + groupSize <= rowSeats.length) {
                    canSelect = true;
                    startIndex = clickedIndex + offset;
                    for (let i = 0; i < groupSize; i++) {
                        if (!rowSeats[startIndex + i] || rowSeats[startIndex + i].status !== 'default') {
                            canSelect = false;
                            break;
                        }
                    }
                    if (canSelect) break;
                }
            }
        }
        if (canSelect) {
            for (let i = 0; i < groupSize; i++) {
                const seat = rowSeats[startIndex + i];
                seat.status = 'selected';
                state.persons[i].selectedSeat = seat;
                state.selectedSeats.push(seat);
            }
            renderPersonList();
            updateSummary();
            drawAll();
        } else {
            alert(`第${row}排没有足够的连续座位！`);
        }
    }
    // 团体票多选模式
    function handleGroupMultiSelect(seat) {
        if (seat.status === 'selected') {
            seat.status = 'default';
            const person = state.persons.find(p => p.selectedSeat?.id === seat.id);
            if (person) {
                person.selectedSeat = null;
            }
            state.selectedSeats = state.selectedSeats.filter(s => s.id !== seat.id);
        } else if (state.selectedSeats.length < state.persons.length) {
            seat.status = 'selected';
            const unassignedPerson = state.persons.find(p => !p.selectedSeat);
            if (unassignedPerson) {
                unassignedPerson.selectedSeat = seat;
            }
            state.selectedSeats.push(seat);
        } else {
            alert('已选座位数量已达到团体人数！');
        }
        const rows = new Set(state.selectedSeats.map(s => s.row));
        if (rows.size > 1) {
            alert('团体票必须选择同一排的座位！');
            clearSelection();
        }
        renderPersonList();
        updateSummary();
        drawAll();
    }
    // 绘制扇形
    function drawSector() {
        const startRad = config.startAngle * Math.PI / 180;
        const endRad = config.endAngle * Math.PI / 180;
        
        const rows = Math.ceil(state.seats.length / config.seatsPerRow);
        const maxRadius = config.minRadius + ((rows + 0.5) * config.rowSpacing);
        const minRadius = config.minRadius - config.rowSpacing * 1.7;
        
        ctx.beginPath();
        ctx.moveTo(config.centerX + maxRadius * Math.cos(startRad), 
                  config.centerY + maxRadius * Math.sin(startRad));
        ctx.arc(config.centerX, config.centerY, maxRadius, startRad, endRad, false);
        ctx.lineTo(config.centerX + minRadius * Math.cos(endRad), 
                  config.centerY + minRadius * Math.sin(endRad));
        ctx.arc(config.centerX, config.centerY, minRadius, endRad, startRad, true);
        ctx.closePath();
        
        ctx.fillStyle = 'rgba(255, 100, 100, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();
        
        // 绘制屏幕
        const screenStartAngle = config.startAngle + (config.endAngle - config.startAngle) * 0.075;
        const screenEndAngle = config.endAngle - (config.endAngle - config.startAngle) * 0.075;
        const screenStartRad = screenStartAngle * Math.PI / 180;
        const screenEndRad = screenEndAngle * Math.PI / 180;
        
        ctx.beginPath();
        ctx.arc(config.centerX, config.centerY, minRadius, screenStartRad, screenEndRad, false);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        const centerAngle = (screenStartAngle + screenEndAngle) / 2;
        const centerAngleRad = centerAngle * Math.PI / 180;
        const textRadius = minRadius + 30;
        
        const textX = config.centerX + textRadius * Math.cos(centerAngleRad);
        const textY = config.centerY + textRadius * Math.sin(centerAngleRad);
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('屏幕中心', textX, textY);
        
    }
    // 绘制座位
    function drawSeats() {
        state.seats.forEach(seat => {
            ctx.save();
            ctx.translate(seat.x, seat.y);
            ctx.rotate(seat.angleRad - Math.PI/2);
            
            const img = state.images[seat.status] || state.images.default;
            if (img.complete) {
                ctx.drawImage(img, -config.seatWidth/2, -config.seatHeight/2, 
                             config.seatWidth, config.seatHeight);
            }

            // 绘制列号标签
            const label = `${seat.col}`;
            ctx.font = 'bold 11px Arial';
            ctx.fillStyle = seat.status === 'booked' ? '#e24b4bff' : 
                        seat.status === 'unavailable' ? '#181818ff' : 
                        seat.status === 'selected' ? '#fffb00e4' : '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(label, 0, config.seatHeight * 3 / 4 + 5);

            ctx.restore();
        });
        

        const totalRows = Math.ceil(state.seats.length / config.seatsPerRow);
        // 绘制行号
        for (let row = 1; row <= totalRows; row++) {
            const rowSeats = state.seats.filter(s => s.row === row);
            if (rowSeats.length === 0) continue;
            
            const rightmostSeat = rowSeats.reduce((prev, current) => 
                (current.col > prev.col) ? current : prev
            );

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const labelX = rightmostSeat.x - config.seatWidth/2 - 20;
            const labelY = rightmostSeat.y;

            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(row, labelX, labelY);
            
            ctx.restore();
        }
    }
    // 绘制所有内容
    function drawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSector();
        drawSeats();
    }
    // 设置事件监听
    function setupEventListeners() {
        canvas.addEventListener('click', handleSeatClick);
        document.getElementById('autoSelectBtn').addEventListener('click', autoSelect);
        document.getElementById('clearSelectionBtn').addEventListener('click', clearSelection);
        document.getElementById('confirmBtn').addEventListener('click', confirmSelection);
        // 返回主界面
        document.getElementById('returnButton').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        // 确认弹窗事件
        document.getElementById('modalClose').addEventListener('click', () => {
            document.getElementById('confirmModal').style.display = 'none';
        });
        document.getElementById('reserveBtn').addEventListener('click', handleReserve);
        document.getElementById('payBtn').addEventListener('click', handlePay);
        // 支付弹窗事件
        document.getElementById('paymentModalClose').addEventListener('click', () => {
            document.getElementById('paymentModal').style.display = 'none';
        });
        // 支付方式选择
        document.querySelectorAll('.payment-option').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.method === 'bank') {
                    document.getElementById('paymentOptions').style.display = 'none';
                    document.getElementById('bankForm').style.display = 'block';
                } else {
                    alert(btn.textContent + ' 暂未开通，请选择其他支付方式。');
                }
            });
        });
        // 银行卡支付表单
        document.getElementById('bankForm').addEventListener('submit', e => {
            e.preventDefault();
            const cardNo = document.getElementById('cardNumber').value.trim();
            const cardPw = document.getElementById('cardPassword').value.trim();
            
            if (!cardNo || !cardPw) {
                alert('卡号和密码均不能为空');
                return;
            }
            
            saveOrderData('已出票');
            alert('支付成功！');
            
            if (state.isGroupMode) {
                window.location.href = 'groupTicketPurchase.html';
            } else {
                window.location.href = 'individualTicketPurchase.html';
            }
        });
        // 鼠标悬停效果
        canvas.addEventListener('mousemove', function(event) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;
            const hoveredSeat = state.seats.find(seat => {
                return mouseX >= seat.bounds.x && 
                       mouseX <= seat.bounds.x + seat.bounds.width &&
                       mouseY >= seat.bounds.y && 
                       mouseY <= seat.bounds.y + seat.bounds.height;
            });
            if (hoveredSeat) {
                canvas.style.cursor = (hoveredSeat.status === 'booked' || hoveredSeat.status === 'unavailable') ? 'not-allowed' : 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        });
        // 点击弹窗外部关闭
        window.addEventListener('click', e => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }
    // 初始化
    init();
});
