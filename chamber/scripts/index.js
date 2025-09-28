// directory.js - Handles member data and view toggling

// Global variables
let members = [];
let currentView = 'grid';

// Fetch member data from JSON file
async function getMembers() {
    try {
        const response = await fetch('./data/members.json');
        const data = await response.json();
        members = data;
        displayMembers(currentView);
    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}

// Fetch only Silver and Gold members from JSON file
async function getMembersfiltered() {
    try {
        const response = await fetch('./data/members.json');
        const data = await response.json();
        members = data.filter(member => member.membershipLevel == 2 || member.membershipLevel == 3);
        const container = document.getElementById('member-cards');
        container.innerHTML = '';
        container.className = 'cards-grid';



        members.forEach(member => {
            container.appendChild(createMemberCard(member))
        })
    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}
// Display members based on current view
function displayMembers(view) {
    const container = document.getElementById('member-cards');
    container.innerHTML = '';

    // Apply filters
    const membershipFilter = document.getElementById('membership-filter').value;
    const industryFilter = document.getElementById('industry-filter').value;

    const filteredMembers = members.filter(member => {
        if (membershipFilter !== 'all' && member.membershipLevel != membershipFilter) return false;
        if (industryFilter !== 'all' && member.industry !== industryFilter) return false;
        return true;
    });

    if (view === 'grid') {
        container.className = 'cards-grid';
        filteredMembers.forEach(member => {
            container.appendChild(createMemberCard(member));
        });
    } else {
        container.className = 'cards-list';
        filteredMembers.forEach(member => {
            container.appendChild(createMemberListItem(member));
        });
    }
}

// Create member card for grid view
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';

    // Determine membership level badge
    let badgeClass, badgeText;
    switch (member.membershipLevel) {
        case 3:
            badgeClass = 'badge-gold';
            badgeText = 'Gold Member';
            break;
        case 2:
            badgeClass = 'badge-silver';
            badgeText = 'Silver Member';
            break;
        default:
            badgeClass = 'badge-member';
            badgeText = 'Member';
    }

    card.innerHTML = `
        <div class="card-header">
            <h2>${member.name}</h2>
            <span class="membership-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="card-image">
            <img src="${member.imageURL}" alt="${member.name}" loading="lazy">
        </div>
        <div class="card-content">
            <div class="card-details">
                <p><i>📍</i> ${member.address}</p>
                <p><i>📞</i> ${member.phone}</p>
                <p><i>🔗</i> <a href="${member.websiteURL}" target="_blank">Website</a></p>
            </div>
            <div class="ethical-commitments">
                <h4>Ethical Commitments</h4>
                <div class="commitment-tags">
                    ${member.other.commitments.map(commitment =>
        `<span class="commitment-tag">${commitment}</span>`
    ).join('')}
                </div>
            </div>
        </div>
    `;

    return card;
}

// Create member list item for list view
function createMemberListItem(member) {
    const item = document.createElement('div');
    item.className = 'list-item';

    // Determine membership level badge
    let badgeClass, badgeText;
    switch (member.membershipLevel) {
        case 3:
            badgeClass = 'badge-gold';
            badgeText = 'Gold';
            break;
        case 2:
            badgeClass = 'badge-silver';
            badgeText = 'Silver';
            break;
        default:
            badgeClass = 'badge-member';
            badgeText = 'Member';
    }

    item.innerHTML = `
        <div class="list-image">
            <img src="${member.imageURL}" alt="${member.name}" loading="lazy">
        </div>
        <div class="list-content">
            <div class="list-info">
                <h2>${member.name}</h2>
                <div class="list-details">
                    <span>${member.address}</span>
                    <span>${member.phone}</span>
                </div>
            </div>
            <div class="list-actions">
                <span class="list-membership ${badgeClass}">${badgeText}</span>
                <a href="${member.websiteURL}" target="_blank">Visit Site</a>
            </div>
        </div>
    `;

    return item;
}

// Set up event listeners
function setupEventListeners() {
    // View toggle buttons
    document.getElementById('grid-view').addEventListener('click', () => {
        currentView = 'grid';
        document.getElementById('grid-view').classList.add('active');
        document.getElementById('list-view').classList.remove('active');
        displayMembers('grid');
    });

    document.getElementById('list-view').addEventListener('click', () => {
        currentView = 'list';
        document.getElementById('list-view').classList.add('active');
        document.getElementById('grid-view').classList.remove('active');
        displayMembers('list');
    });

    // Filter dropdowns
    document.getElementById('membership-filter').addEventListener('change', () => {
        displayMembers(currentView);
    });

    document.getElementById('industry-filter').addEventListener('change', () => {
        displayMembers(currentView);
    });

    // Hamburger menu toggle
    document.getElementById('hamburger-btn').addEventListener('click', () => {
        const nav = document.getElementById('primary-nav');
        nav.classList.toggle('active');
    });
}

// Initialize the directory page
function init() {
    setupEventListeners();
    getMembers();
}

// Call init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

//weather//
//select html elements in the document
document.addEventListener('DOMContentLoaded', function () {
    const myCity = document.querySelector('#city')
    const myDescription = document.querySelector('#description')
    const myTemperature = document.querySelector('#temperature')
    const myIcon = document.querySelector('#icon')

    //create required variable for the url
    const myKey = "0a09431dee98df364dcea7d0907250bf"
    const myLat = "6.521423052051538"
    const myLon = "3.394487966893232"

    //construct a fill path using a template literals
    const myURL = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&appid=${myKey}&units=imperial`;

    //current weather data
    async function apiFetch() {
        try {
            const response = await fetch(myURL);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                displayResults(data)
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.log(error);
        }

        //display the json data
        function displayResults(data) {
            console.log('hello');
            myCity.innerHTML = data.name;
            myDescription.innerHTML = data.weather[0].description;
            myTemperature.innerHTML = `${data.main.temp}&deg;F`
            const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            myIcon.setAttribute('SRC', iconsrc)
            myIcon.setAttribute('alt', data.weather[0].description)
        }
    }
    apiFetch();
});

// Set timestamp when form loads
document.addEventListener('DOMContentLoaded', function() {
    const timestampField = document.getElementById('timestamp');
    timestampField.value = new Date().toISOString();
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const infoLinks = document.querySelectorAll('.info-link');
    const closeButtons = document.querySelectorAll('.close');
    
    infoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Animation for membership cards
    const cards = document.querySelectorAll('.membership-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-in');
    });
});

//thank you data
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const applicationData = document.getElementById('applicationData');
    
    const fields = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'businessName', label: 'Business Name' },
        { key: 'timestamp', label: 'Application Date' }
    ];
    
    let html = '<dl>';
    fields.forEach(field => {
        const value = urlParams.get(field.key);
        if (value) {
            let displayValue = value;
            if (field.key === 'timestamp') {
                displayValue = new Date(value).toLocaleString();
            }
            html += `<dt>${field.label}:</dt><dd>${displayValue}</dd>`;
        }
    });
    html += '</dl>';
    
    applicationData.innerHTML = html;
});
