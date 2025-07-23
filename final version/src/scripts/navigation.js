function goToInfoPage() {
    window.location.href = 'info.html';
}

function returnToIndexPage() {
    window.location.href = 'index.html';
}

function goToSettingPage() {
    window.location.href = 'setting.html';
}

document.addEventListener('DOMContentLoaded', function() {

    const reservationBtn = document.getElementById('reservationButton');
    if(reservationBtn) {
        reservationBtn.addEventListener('click', goToInfoPage);
    }
    
    const returnBtn = document.getElementById('returnButton');
    if(returnBtn) {
        returnBtn.addEventListener('click', returnToIndexPage);
    }

    const settingBtn = document.getElementById('settingButton');
    if(settingBtn) {
        settingBtn.addEventListener('click', goToSettingPage);
    }
});

const individualBtn = document.getElementById('individualPurchaseButton');
individualBtn.addEventListener('click', () => {
  window.location.href = 'individualInfoFilling.html';
});

const groupBtn = document.getElementById('groupPurchaseButton');
groupBtn.addEventListener('click', () => {
  window.location.href = 'groupInfoFilling.html';
});