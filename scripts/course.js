// course.js
document.addEventListener('DOMContentLoaded', function() {
    // Course data array
    const courses = [
        { 
            code: "CSE 110", 
            name: "Introduction to Programming", 
            credits: 3, 
            completed: true 
        },
        { 
            code: "WDD 130", 
            name: "Web Fundamentals", 
            credits: 3, 
            completed: true 
        },
        { 
            code: "CSE 111", 
            name: "Programming with Functions", 
            credits: 3, 
            completed: false 
        },
        { 
            code: "CSE 210", 
            name: "Programming with Classes", 
            credits: 3, 
            completed: false 
        },
        { 
            code: "WDD 131", 
            name: "Dynamic Web Fundamentals", 
            credits: 3, 
            completed: true 
        },
        { 
            code: "WDD 231", 
            name: "Web Frontend Development I", 
            credits: 2, 
            completed: false 
        }
    ];
    
    const courseContainer = document.getElementById('courseContainer');
    const allBtn = document.getElementById('allBtn');
    const wddBtn = document.getElementById('wddBtn');
    const cseBtn = document.getElementById('cseBtn');
    const totalCreditsElement = document.getElementById('totalCredits');
    
    // Function to display courses
    function displayCourses(filter = 'all') {
        // Clear the container
        courseContainer.innerHTML = '';
        
        // Filter courses based on selection
        let filteredCourses = [];
        if (filter === 'all') {
            filteredCourses = courses;
        } else if (filter === 'wdd') {
            filteredCourses = courses.filter(course => course.code.includes('WDD'));
        } else if (filter === 'cse') {
            filteredCourses = courses.filter(course => course.code.includes('CSE'));
        }
        
        // Calculate total credits
        const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
        totalCreditsElement.textContent = totalCredits;
        
        // Create and append course cards
        filteredCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');
            if (course.completed) {
                courseCard.classList.add('completed');
            }
            
            courseCard.innerHTML = `
                <h3>${course.code}</h3>
                <p>${course.name}</p>
                <p>Credits: ${course.credits}</p>
                <p>Status: ${course.completed ? 'Completed' : 'Not Completed'}</p>
            `;
            
            courseContainer.appendChild(courseCard);
        });
    }
    
    // Initial display of all courses
    displayCourses();
    
    // Event listeners for filter buttons
    allBtn.addEventListener('click', function() {
        setActiveButton(allBtn);
        displayCourses('all');
    });
    
    wddBtn.addEventListener('click', function() {
        setActiveButton(wddBtn);
        displayCourses('wdd');
    });
    
    cseBtn.addEventListener('click', function() {
        setActiveButton(cseBtn);
        displayCourses('cse');
    });
    
    // Helper function to set active button
    function setActiveButton(activeBtn) {
        // Remove active class from all buttons
        const buttons = document.querySelectorAll('.filter-buttons button');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        activeBtn.classList.add('active');
    }
});