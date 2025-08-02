document.addEventListener('DOMContentLoaded', function() {
    const totalSeatsInput = document.getElementById('totalSeats');
    const currentSeatsSpan = document.getElementById('currentSeats');
    const totalRowsSpan = document.getElementById('totalRows');
    const saveBtn = document.getElementById('saveConfig');
    const resetBtn = document.getElementById('resetConfig');
    const returnBtn = document.getElementById('returnButton');

    // 默认配置
    const defaultConfig = {
        totalSeats: 200
    };
    // 初始化
    function init() {
        loadConfig();
        setupEventListeners();
    }
    // 加载配置
    function loadConfig() {
        const savedSeats = localStorage.getItem('totalSeats');
        const totalSeats = savedSeats ? parseInt(savedSeats) : defaultConfig.totalSeats;
        totalSeatsInput.value = totalSeats;
        updateDisplay(totalSeats);
    }
    // 更新显示
    function updateDisplay(totalSeats) {
        currentSeatsSpan.textContent = totalSeats;
        totalRowsSpan.textContent = Math.ceil(totalSeats / 20);
    }
    // 验证输入
    function validateInput(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            return { valid: false, message: '请输入有效的数字！' };
        }
        if (num < 80 || num > 320) {
            return { valid: false, message: '座位数必须在80-320之间！' };
        }
        return { valid: true };
    }
    // 保存配置
    function saveConfig() {
        const value = totalSeatsInput.value;
        const validation = validateInput(value);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }
        const totalSeats = parseInt(value);
        localStorage.setItem('totalSeats', totalSeats);
        updateDisplay(totalSeats);
        showSuccessMessage('配置保存成功！');
    }
    // 重置配置
    function resetConfig() {
        if (confirm('确定要恢复默认配置吗？')) {
            totalSeatsInput.value = defaultConfig.totalSeats;
            localStorage.setItem('totalSeats', defaultConfig.totalSeats);
            updateDisplay(defaultConfig.totalSeats);
            showSuccessMessage('已恢复默认配置！');
        }
    }
    // 显示成功消息
    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }
    // 设置事件监听
    function setupEventListeners() {
        // 输入框实时更新
        totalSeatsInput.addEventListener('input', function() {
            const value = this.value;
            if (value && !isNaN(value)) {
                const num = parseInt(value);
            }
        });
        returnBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        saveBtn.addEventListener('click', saveConfig);
        resetBtn.addEventListener('click', resetConfig);
        // 回车保存
        totalSeatsInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveConfig();
            }
        });
    }
    init();
});