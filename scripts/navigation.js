// navigation.js
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menuButton');
    const navigation = document.getElementById('navigation');
    
    menuButton.addEventListener('click', function() {
        navigation.classList.toggle('active');
    });
});