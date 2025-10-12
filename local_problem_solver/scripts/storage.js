// js/storage.js
// Local storage functionality
export function getStoredFilter() {
    return localStorage.getItem('issueFilter');
}

export function setStoredFilter(filterValue) {
    localStorage.setItem('issueFilter', filterValue);
}

export function getStoredUpvotes() {
    const upvotes = localStorage.getItem('issueUpvotes');
    return upvotes ? JSON.parse(upvotes) : {};
}

export function setUpvote(issueId) {
    const upvotes = getStoredUpvotes();
    upvotes[issueId] = true;
    localStorage.setItem('issueUpvotes', JSON.stringify(upvotes));
}

export function hasUpvoted(issueId) {
    const upvotes = getStoredUpvotes();
    return upvotes[issueId] || false;
}