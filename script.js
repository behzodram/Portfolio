// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgRcO99DQFn_6uch7-E7WmZaAYy8Rz4q8",
    authDomain: "portfolio-76d47.firebaseapp.com",
    projectId: "portfolio-76d47",
    storageBucket: "portfolio-76d47.appspot.com",
    messagingSenderId: "650638529065",
    appId: "1:650638529065:web:91bebf6a20bddf57560238",
    measurementId: "G-YQSTWRHM43",
    databaseURL: "https://portfolio-76d47-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('theme', body.getAttribute('data-theme'));
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.getAttribute('data-theme') === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Modal elements
const modal = document.getElementById('feedback-modal');
const modalTitle = document.getElementById('modal-project-title');
const closeModal = document.querySelector('.close-modal');
const stars = document.querySelectorAll('.stars i');
const commentText = document.getElementById('comment-text');
const submitFeedback = document.getElementById('submit-feedback');
const feedbackList = document.getElementById('feedback-list');

let currentProject = null;
let selectedRating = 0;

// Load Projects with counters
function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        // Project ID yaratish (xavfsiz version)
        const projectId = project.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="click-counters" id="counters-${projectId}">
                    <div class="click-counter github-counter">
                        <i class="fab fa-github"></i> <span class="github-count">0</span>
                    </div>
                    <div class="click-counter visit-counter">
                        <i class="fas fa-external-link-alt"></i> <span class="visit-count">0</span>
                    </div>
                    ${project.directDownload ? `
                    <div class="click-counter download-counter">
                        <i class="fas fa-download"></i> <span class="download-count">0</span>
                    </div>` : ''}
                </div>
                <div class="project-links">
                    <a href="${project.githubLink}" target="_blank" class="project-link github-link" onclick="trackLinkClick('${project.title.replace(/'/g, "\\'")}', 'github')">
                        <i class="fab fa-github"></i> Code
                    </a>
                    <a href="${project.demoLink}" target="_blank" class="project-link visit-link" onclick="trackLinkClick('${project.title.replace(/'/g, "\\'")}', 'demo')">
                        <i class="fas fa-external-link-alt"></i> Visit
                    </a>
                    ${project.directDownload ? 
                        `<a href="${project.downloadLink}" download class="project-link download-link" onclick="trackDownload('${project.title.replace(/'/g, "\\'")}')">
                            <i class="fas fa-download"></i> Download
                        </a>` : ''}
                </div>
                <button class="btn feedback-btn" data-project="${project.title.replace(/'/g, "&apos;")}">Leave Feedback</button>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });

    // Counterlarni yuklash (barcha projectlar yaratilgandan keyin)
    setTimeout(() => {
        projects.forEach(project => {
            loadClickCounts(project.title);
        });
    }, 100);

    // Add event listeners to feedback buttons
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentProject = e.target.getAttribute('data-project');
            openFeedbackModal(currentProject);
        });
    });
}

// Load click counts from Firebase
function loadClickCounts(projectName) {
    if (!projectName) return;
    
    const projectId = projectName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    
    // GitHub va Visit counterlar
    const clicksRef = database.ref(`projects/${projectName}/clicks`);
    clicksRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        
        const githubCount = data.github || 0;
        const demoCount = data.demo || 0;
        
        const githubElement = document.querySelector(`#counters-${projectId} .github-count`);
        const visitElement = document.querySelector(`#counters-${projectId} .visit-count`);
        
        if (githubElement) githubElement.textContent = githubCount;
        if (visitElement) visitElement.textContent = demoCount;
    });

    // Download counter (agar mavjud bo'lsa)
    const project = projects.find(p => p.title === projectName);
    if (project && project.directDownload) {
        const downloadsRef = database.ref(`projects/${projectName}/downloads`);
        downloadsRef.on('value', (snapshot) => {
            const downloadCount = snapshot.val() || 0;
            const downloadElement = document.querySelector(`#counters-${projectId} .download-count`);
            if (downloadElement) downloadElement.textContent = downloadCount;
        });
    }
}

// Track link clicks (global funksiya)
window.trackLinkClick = function(projectName, linkType) {
    if (!projectName) return;
    
    const clicksRef = database.ref(`projects/${projectName}/clicks/${linkType}`);
    clicksRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });
}

// Track downloads (global funksiya)
window.trackDownload = function(projectName) {
    if (!projectName) return;
    
    const downloadsRef = database.ref(`projects/${projectName}/downloads`);
    downloadsRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });
}

// Modal functions
function openFeedbackModal(projectName) {
    modalTitle.textContent = `Feedback for ${projectName}`;
    modal.style.display = 'block';
    selectedRating = 0;
    commentText.value = '';
    updateStars();
    loadFeedback(projectName);
}

function closeFeedbackModal() {
    modal.style.display = 'none';
}

function updateStars() {
    stars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Star rating interaction
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-rating'));
        updateStars();
    });
});

// Submit feedback
submitFeedback.addEventListener('click', () => {
    if (selectedRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }

    const feedback = {
        project: currentProject,
        rating: selectedRating,
        comment: commentText.value,
        date: new Date().toISOString(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    const feedbackRef = database.ref(`projects/${currentProject}/feedback`);
    feedbackRef.push(feedback)
        .then(() => {
            alert('Thank you for your feedback!');
            commentText.value = '';
            selectedRating = 0;
            updateStars();
            loadFeedback(currentProject);
        })
        .catch((error) => {
            console.error('Error submitting feedback:', error);
            alert('There was an error submitting your feedback. Please try again.');
        });
});

// Load feedback for a project
function loadFeedback(projectName) {
    feedbackList.innerHTML = '<p>Loading feedback...</p>';
    
    const feedbackRef = database.ref(`projects/${projectName}/feedback`).orderByChild('timestamp').limitToLast(5);
    feedbackRef.once('value')
        .then((snapshot) => {
            if (!snapshot.exists()) {
                feedbackList.innerHTML = '<p>No feedback yet. Be the first to leave one!</p>';
                return;
            }

            feedbackList.innerHTML = '';
            const feedbacks = [];
            
            snapshot.forEach((childSnapshot) => {
                feedbacks.push(childSnapshot.val());
            });

            // Sort by newest first
            feedbacks.reverse().forEach((item) => {
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item';
                
                let starsHtml = '';
                for (let i = 0; i < 5; i++) {
                    starsHtml += i < item.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                }
                
                const date = new Date(item.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                feedbackItem.innerHTML = `
                    <div class="rating">${starsHtml}</div>
                    ${item.comment ? `<div class="comment">"${item.comment}"</div>` : ''}
                    <div class="date">${formattedDate}</div>
                `;
                
                feedbackList.appendChild(feedbackItem);
            });
        })
        .catch((error) => {
            console.error('Error loading feedback:', error);
            feedbackList.innerHTML = '<p>Error loading feedback. Please try again later.</p>';
        });
}

// Close modal when clicking X or outside
closeModal.addEventListener('click', closeFeedbackModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeFeedbackModal();
    }
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // projects array mavjudligini tekshirish
    if (typeof projects !== 'undefined' && projects.length > 0) {
        loadProjects();
    } else {
        console.error('Projects array is not defined or empty');
        // projects.js yuklanishini kutish
        setTimeout(() => {
            if (typeof projects !== 'undefined' && projects.length > 0) {
                loadProjects();
            }
        }, 500);
    }
    
    // Add scroll animation to sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Profile image animation
const profileImage = document.querySelector('.hero-image img');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        profileImage.style.transform = 'scale(1.1)';
    });
    
    profileImage.addEventListener('mouseleave', () => {
        profileImage.style.transform = 'scale(1)';
    });
}