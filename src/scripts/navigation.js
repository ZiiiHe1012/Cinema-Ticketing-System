function goToInfoPage() {
    window.location.href = 'info.html';
}

function returnToIndexPage() {
    window.location.href = 'index.html';
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
});