// js/main.js
import { fetchIssues } from './data.js';
import { setupMap, addMarkerToMap } from './map.js';
import { getStoredFilter, setStoredFilter } from './storage.js';

// DOM Elements
const issuesContainer = document.getElementById('issues-container');
const issueFilter = document.getElementById('issue-filter');
const modal = document.getElementById('issue-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

// Global variables
let issues = [];
let filteredIssues = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load issues from JSON file
        issues = await fetchIssues();
        
        // Set up the map
        setupMap();
        
        // Initialize UI
        initializeUI();
        
        // Display issues
        displayIssues(issues);
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing application:', error);
        issuesContainer.innerHTML = '<p>Sorry, we encountered an error loading the issues. Please try again later.</p>';
    }
});

function initializeUI() {
    // Set filter to stored value or default
    const storedFilter = getStoredFilter();
    issueFilter.value = storedFilter || 'all';
    
    // Apply initial filter
    filterIssues();
    
    // Add markers to map
    issues.forEach(issue => {
        addMarkerToMap(issue);
    });
}

function setupEventListeners() {
    // Filter change
    issueFilter.addEventListener('change', filterIssues);
    
    // Modal close
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = menuToggle.querySelectorAll('span');
        if (mainNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

function filterIssues() {
    const filterValue = issueFilter.value;
    
    // Store filter preference
    setStoredFilter(filterValue);
    
    if (filterValue === 'all') {
        filteredIssues = [...issues];
    } else {
        filteredIssues = issues.filter(issue => issue.type === filterValue);
    }
    
    displayIssues(filteredIssues);
}

function displayIssues(issuesToDisplay) {
    if (issuesToDisplay.length === 0) {
        issuesContainer.innerHTML = '<p>No issues found matching your criteria.</p>';
        return;
    }
    
    issuesContainer.innerHTML = issuesToDisplay.map(issue => `
        <div class="issue-card" data-id="${issue.id}">
            <div class="issue-header">
                <span class="issue-type ${issue.type}">${formatIssueType(issue.type)}</span>
                <span class="issue-date">${formatDate(issue.date)}</span>
            </div>
            <div class="issue-body">
                <h3 class="issue-title">${issue.title}</h3>
                <div class="issue-location">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${issue.location.area}, ${issue.location.city}
                </div>
                <p class="issue-description">${truncateText(issue.description, 100)}</p>
                <div class="issue-status">
                    <span class="status-badge ${issue.status}">${formatStatus(issue.status)}</span>
                    <div class="upvote-count">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        ${issue.upvotes}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to issue cards
    document.querySelectorAll('.issue-card').forEach(card => {
        card.addEventListener('click', () => {
            const issueId = card.getAttribute('data-id');
            const issue = issues.find(i => i.id === issueId);
            if (issue) {
                showIssueDetails(issue);
            }
        });
    });
}

function showIssueDetails(issue) {
    modalBody.innerHTML = `
        <h2>${issue.title}</h2>
        <div class="issue-meta">
            <span class="issue-type ${issue.type}">${formatIssueType(issue.type)}</span>
            <span class="issue-date">${formatDate(issue.date)}</span>
        </div>
        <div class="issue-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${issue.location.area}, ${issue.location.city}
        </div>
        <div class="issue-status">
            <span class="status-badge ${issue.status}">${formatStatus(issue.status)}</span>
            <div class="upvote-count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                ${issue.upvotes} upvotes
            </div>
        </div>
        <div class="issue-description-full">
            <h3>Description</h3>
            <p>${issue.description}</p>
        </div>
        ${issue.updates ? `
        <div class="issue-updates">
            <h3>Updates</h3>
            <ul>
                ${issue.updates.map(update => `
                    <li>
                        <strong>${formatDate(update.date)}:</strong> ${update.text}
                    </li>
                `).join('')}
            </ul>
        </div>
        ` : ''}
        <div class="modal-actions">
            <button class="btn upvote-btn" data-id="${issue.id}">
                Upvote Issue
            </button>
        </div>
    `;
    
    // Add event listener to upvote button
    const upvoteBtn = modalBody.querySelector('.upvote-btn');
    upvoteBtn.addEventListener('click', () => {
        upvoteIssue(issue.id);
    });
    
    modal.style.display = 'flex';
}

function upvoteIssue(issueId) {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
        issue.upvotes++;
        
        // Update the displayed count in the modal
        const upvoteCount = modalBody.querySelector('.upvote-count');
        upvoteCount.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            ${issue.upvotes} upvotes
        `;
        
        // Update the card in the grid if it's visible
        const issueCard = document.querySelector(`.issue-card[data-id="${issueId}"] .upvote-count`);
        if (issueCard) {
            issueCard.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                ${issue.upvotes}
            `;
        }
        
        // Show confirmation
        const upvoteBtn = modalBody.querySelector('.upvote-btn');
        upvoteBtn.textContent = 'Upvoted!';
        upvoteBtn.disabled = true;
    }
}

// Helper functions
function formatIssueType(type) {
    const typeMap = {
        'power': 'Power Outage',
        'traffic': 'Traffic',
        'flooding': 'Flooding',
        'sanitation': 'Sanitation',
        'security': 'Security'
    };
    return typeMap[type] || type;
}

function formatStatus(status) {
    const statusMap = {
        'reported': 'Reported',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}