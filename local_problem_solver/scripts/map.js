// js/map.js
// Map functionality
export function setupMap() {
    const map = document.getElementById('map');
    
    // In a real implementation, we would use a mapping library
    // For this project, we'll create a simple representation
    
    // Create a grid system for the map
    map.innerHTML = `
        <div class="map-grid">
            <div class="map-overlay"></div>
        </div>
    `;
    
    // Add CSS for the map grid
    const style = document.createElement('style');
    style.textContent = `
        .map-grid {
            width: 100%;
            height: 100%;
            background-image: url('../images/map-bg.jpg');
            background-size: cover;
            background-position: center;
            position: relative;
        }
        
        .map-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
        }
        
        .map-marker {
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
        
        .map-marker::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
        }
        
        .map-marker.power { background-color: #ffcc00; }
        .map-marker.traffic { background-color: #ff6600; }
        .map-marker.flooding { background-color: #0066cc; }
        .map-marker.sanitation { background-color: #663300; }
        .map-marker.security { background-color: #cc0000; }
    `;
    document.head.appendChild(style);
}

export function addMarkerToMap(issue) {
    const map = document.getElementById('map');
    const mapGrid = map.querySelector('.map-grid');
    
    // Create a marker element
    const marker = document.createElement('div');
    marker.className = `map-marker ${issue.type}`;
    
    // Position the marker (using mock coordinates for this demo)
    // In a real implementation, we would use actual coordinates
    const x = 20 + Math.random() * 60; // 20% to 80% of width
    const y = 20 + Math.random() * 60; // 20% to 80% of height
    
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    
    // Add tooltip with issue title
    marker.title = issue.title;
    
    // Add click event to show details
    marker.addEventListener('click', (e) => {
        e.stopPropagation();
        // Dispatch custom event to show issue details
        const event = new CustomEvent('showIssueDetails', { detail: issue });
        document.dispatchEvent(event);
    });
    
    mapGrid.appendChild(marker);
}