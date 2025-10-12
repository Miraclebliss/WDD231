// js/data.js
// Fetch issues from JSON file
export async function fetchIssues() {
    try {
        const response = await fetch('./data/issues.json');
        if (!response.ok) {
            throw new Error('Failed to fetch issues');
        }
        const data = await response.json();
        return data.issues;
    } catch (error) {
        console.error('Error fetching issues:', error);
        throw error;
    }
}