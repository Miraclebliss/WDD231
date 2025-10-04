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
                displayResults(data)
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.log(error);
        }

        //display the json data
        function displayResults(data) {
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

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load attractions from JSON
    loadAttractions();
    
    // Handle visit message
    handleVisitMessage();
});

// Load attractions from JSON and create cards
function loadAttractions() {
    fetch('data/attractions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const gallery = document.getElementById('attractions-gallery');
            
            data.attractions.forEach(attraction => {
                const card = createCard(attraction);
                gallery.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading attractions:', error);
            // Fallback: Create cards with placeholder data
            createFallbackCards();
        });
}

// Create individual card element
function createCard(attraction) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const ethicalBadge = attraction.ethicalBusiness ? 
        '<span class="ethical-badge">Ethical Business</span>' : '';
    
    card.innerHTML = `
        <h3>${attraction.name}${ethicalBadge}</h3>
        <figure>
            <img src="${attraction.image}" alt="${attraction.name}" loading="lazy">
        </figure>
        <address>${attraction.address}</address>
        <p>${attraction.description}</p>
        <button class="learn-more">Learn More</button>
    `;
    
    // Add event listener to button
    const button = card.querySelector('.learn-more');
    button.addEventListener('click', function() {
        alert(`More information about ${attraction.name} would appear here. This could link to a detailed page with hours, contact information, and more about their ethical practices.`);
    });
    
    return card;
}

// Fallback if JSON fails to load
function createFallbackCards() {
    const gallery = document.getElementById('attractions-gallery');
    const fallbackData = [
        {
            name: "Milagro Historic District", 
            address: "100 Heritage Street", 
            description: "Stroll through our beautifully preserved historic district featuring architecture from the late 1800s.", 
            image: "images/milagrodistrict.jpg",
            ethicalBusiness: true
        },
        {
            name: "Prosperity Park", 
            address: "450 Greenway Boulevard", 
            description: "A 50-acre urban oasis with walking trails, community gardens, and playgrounds.", 
            image: "images/prosperitypark.jpg",
            ethicalBusiness: true
        },
        {
            name: "Ethical Commerce Museum", 
            address: "789 Justice Avenue", 
            description: "Explore the history of ethical business practices and their impact on communities.", 
            image: "images/ethics-museum.webp",
            ethicalBusiness: true
        },
        {
            name: "Farmers Market & Craft Co-op", 
            address: "Town Square", 
            description: "Open every Saturday year-round, featuring local organic produce and handmade goods.", 
            image: "images/farmers-market.webp",
            ethicalBusiness: true
        },
        {
            name: "Riverwalk Trail", 
            address: "Trailhead at 234 Riverside Drive", 
            description: "A scenic 7-mile trail along the Milagro River with beautiful views.", 
            image: "images/riverwalk-trail.webp",
            ethicalBusiness: false
        },
        {
            name: "Community Arts Center", 
            address: "567 Creativity Lane", 
            description: "Hosting exhibitions, performances, and workshops with a focus on local artists.", 
            image: "images/arts-center.webp",
            ethicalBusiness: true
        },
        {
            name: "Sustainable Business Hub", 
            address: "890 Innovation Drive", 
            description: "A co-working space and incubator for businesses committed to ethical practices.", 
            image: "images/business-hub.webp",
            ethicalBusiness: true
        },
        {
            name: "Heritage Gardens", 
            address: "345 Botanical Way", 
            description: "Beautiful themed gardens showcasing native plants and sustainable practices.", 
            image: "images/heritage-gardens.webp",
            ethicalBusiness: true
        }
    ];
    
    fallbackData.forEach(attraction => {
        const card = createCard(attraction);
        gallery.appendChild(card);
    });
}

// Handle visit message using localStorage
function handleVisitMessage() {
    const visitMessage = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = Date.now();
    
    if (!lastVisit) {
        // First visit
        visitMessage.textContent = "Welcome! Let us know if you have any questions about our ethical business community.";
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDifference = currentTime - lastVisitTime;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference === 0) {
            visitMessage.textContent = "Back so soon! Awesome! We're glad you're continuing to explore Milagro.";
        } else {
            const dayText = daysDifference === 1 ? "day" : "days";
            visitMessage.textContent = `You last visited ${daysDifference} ${dayText} ago. Welcome back to Milagro!`;
        }
    }
    
    // Store current visit time
    localStorage.setItem('lastVisit', currentTime.toString());
}