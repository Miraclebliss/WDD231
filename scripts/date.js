// date.js
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;
});