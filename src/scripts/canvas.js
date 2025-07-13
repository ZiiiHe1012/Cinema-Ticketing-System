document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    // 固定配置
    const config = {
        centerX: 600,
        centerY: -3160,    // 如果修改半径或者调整位置，一定要注意这两个值，这两个值是用来定位荧幕位置的，如果找不到扇形了大概率是这两个值设置的问题
        startAngle: 83,    // 固定起始角度
        endAngle: 97,     // 固定结束角度
        minRadius: 3500,   // 固定起始半径
        seatsPerRow: 20,   // 固定每行20个座位
        seatWidth: 25,
        seatHeight: 25,    // 座椅图片大小
        rowSpacing: 50,    // 行间距
        seatImages: {
            default: '../images/seat.png',
            selected: '../images/greenSeat.png',
            booked: '../images/redSeat.png',
            unavailable: '../images/blackSeat.png'
        }
    };
    
    // 系统状态
    const state = {
        seats: [],
        selectedSeats: [],
        images: {
            default: null,
            selected: null,
            booked: null,
            unavailable: null
        }
    };
    
    // 初始化系统
    function init() {
        loadSeatImages();
        setupConfigPanel();
        setupControlButtons(); 
        initializeSeats(200); // 默认200个座位
    }
    
    // 加载座位图片
    function loadSeatImages() {
        Object.keys(config.seatImages).forEach(key => {
            state.images[key] = new Image();
            state.images[key].src = config.seatImages[key];
        });
    }
    
    // 设置配置面板
    function setupConfigPanel() {
        document.getElementById('applyConfig').addEventListener('click', function() {
            const totalSeats = parseInt(document.getElementById('totalSeats').value);
            initializeSeats(totalSeats);
        });
    }

    // 初始化座位的算法，基本上不用改动，如果要加入座椅状态变化，则在最后加入一个updateSeat的函数（这个函数我这里没有）
    function initializeSeats(totalSeats) {
        const rows = Math.ceil(totalSeats / config.seatsPerRow);
        const angleRange = config.endAngle - config.startAngle;

        state.seats = [];
        state.selectedSeats = [];
        
        const angleSpacing = angleRange / (config.seatsPerRow + 3);
        
        for (let row = 0; row < rows; row++) {
            const radius = config.minRadius + (row * config.rowSpacing);
            const seatsInRow = Math.min(totalSeats - (row * config.seatsPerRow), config.seatsPerRow);
            
            // 计算起始角度偏移 (保持居中)
            const offset = (angleRange - (angleSpacing * (seatsInRow - 1))) / 2;
            
            for (let col = 0; col < seatsInRow; col++) {
                const angle = config.startAngle + offset + (col * angleSpacing);
                const angleRad = angle * Math.PI / 180;
                
                const seatX = config.centerX + radius * Math.cos(angleRad);
                const seatY = config.centerY + radius * Math.sin(angleRad) + 30;
                
                state.seats.push({
                    row: row + 1,
                    col: col + 1,
                    id: `R${row + 1}C${col + 1}`,
                    x: seatX,
                    y: seatY,
                    angleRad,
                    status: 'default',
                    bounds: {
                        x: seatX - config.seatWidth/2,
                        y: seatY - config.seatHeight/2,
                        width: config.seatWidth,
                        height: config.seatHeight
                    }
                });
            }
        }

        drawAll();
    }
    
    // 绘制扇形
    function drawSector() {
        const startRad = config.startAngle * Math.PI / 180;
        const endRad = config.endAngle * Math.PI / 180;
        
        // 计算最大半径
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
        
        ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();


        // 绘制屏幕部分（内弧中部85%）
        const screenStartAngle = config.startAngle + (config.endAngle - config.startAngle) * 0.075;
        const screenEndAngle = config.endAngle - (config.endAngle - config.startAngle) * 0.075;
        const screenStartRad = screenStartAngle * Math.PI / 180;
        const screenEndRad = screenEndAngle * Math.PI / 180;
        
        ctx.beginPath();
        ctx.arc(config.centerX, config.centerY, minRadius, screenStartRad, screenEndRad, false);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;  // 加粗屏幕线
        ctx.stroke();
        
        // "屏幕中心"文字
        const centerAngle = (screenStartAngle + screenEndAngle) / 2;
        const centerAngleRad = centerAngle * Math.PI / 180;
        const textRadius = minRadius + 30; 
        
        const textX = config.centerX + textRadius * Math.cos(centerAngleRad);
        const textY = config.centerY + textRadius * Math.sin(centerAngleRad);
        
        ctx.font = 'bold 24px Arial';
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
            ctx.drawImage(img, -config.seatWidth/2, -config.seatHeight/2, 
                         config.seatWidth, config.seatHeight);
            ctx.restore();  
        });
        
    }
    
    // 绘制所有内容
    function drawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSector();
        drawSeats();
    }
    
    // 处理座位点击
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const clickedSeat = state.seats.find(seat => {
            return mouseX >= seat.bounds.x && 
                   mouseX <= seat.bounds.x + seat.bounds.width &&
                   mouseY >= seat.bounds.y && 
                   mouseY <= seat.bounds.y + seat.bounds.height;
        });
        
        if (clickedSeat && clickedSeat.status !== 'booked') {
            clickedSeat.status = clickedSeat.status === 'selected' ? 'default' : 'selected';
            
            if (clickedSeat.status === 'selected') {
                state.selectedSeats.push(clickedSeat);
            } else {
                state.selectedSeats = state.selectedSeats.filter(s => s.id !== clickedSeat.id);
            }
            drawAll(); 
        }
    });
    
    // 初始化
    init();
});