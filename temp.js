// Global projects array
// let projects = [];

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

// Load saved theme
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
    if (!projectsGrid) {
        console.error('Projects grid element not found');
        return;
    }
    
    // Check if projects array exists and has data
    if (typeof projects === 'undefined' || !projects || projects.length === 0) {
        console.error('Projects array is empty or not defined');
        projectsGrid.innerHTML = '<p class="error-message">Projects could not be loaded. Please check project.js file.</p>';
        return;
    }
    
    console.log('Loading projects:', projects); // Debug uchun
    projectsGrid.innerHTML = ''; // Gridni tozalash
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        // Project ID yaratish (xavfsiz version)
        const projectId = project.title.replace(/[^a-zA-Z0-9]/g, '-');
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image || 'images/default-project.jpg'}" alt="${project.title}" loading="lazy" onerror="this.src='images/default-project.jpg'">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description || 'No description available'}</p>
                <div class="project-tech">
                    ${project.technologies ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
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
                    <a href="${project.githubLink || '#'}" target="_blank" class="project-link github-link" onclick="trackLinkClick('${project.title.replace(/'/g, "\\'")}', 'github')">
                        <i class="fab fa-github"></i> Code
                    </a>
                    <a href="${project.demoLink || '#'}" target="_blank" class="project-link visit-link" onclick="trackLinkClick('${project.title.replace(/'/g, "\\'")}', 'demo')">
                        <i class="fas fa-external-link-alt"></i> Visit
                    </a>
                    ${project.directDownload ? 
                        `<a href="${project.downloadLink || '#'}" download class="project-link download-link" onclick="trackDownload('${project.title.replace(/'/g, "\\'")}')">
                            <i class="fas fa-download"></i> Download
                        </a>` : ''}
                </div>
                <button class="btn feedback-btn" data-project="${project.title.replace(/['"]/g, '&quot;')}">Leave Feedback</button>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });

    // Counterlarni yuklash (projeklar yaratilgandan keyin)
    setTimeout(() => {
        projects.forEach(project => {
            loadClickCounts(project.title);
        });
    }, 500);

    // Feedback tugmalariga event listener qo'shish
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
    
    const projectId = projectName.replace(/[^a-zA-Z0-9]/g, '-');
    
    // Elementlar mavjudligini tekshirish
    const countersElement = document.querySelector(`#counters-${projectId}`);
    if (!countersElement) {
        console.warn(`Counters element not found for project: ${projectName}`);
        return;
    }
    
    // Load GitHub and Visit counters
    const clicksRef = database.ref(`projects/${projectName}/clicks`);
    
    clicksRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        
        const githubCount = data.github || 0;
        const demoCount = data.demo || 0;
        
        const githubElement = document.querySelector(`#counters-${projectId} .github-count`);
        const visitElement = document.querySelector(`#counters-${projectId} .visit-count`);
        
        if (githubElement) {
            githubElement.textContent = githubCount;
            console.log(`Updated ${projectName} GitHub count: ${githubCount}`); // Debug
        }
        if (visitElement) {
            visitElement.textContent = demoCount;
            console.log(`Updated ${projectName} Visit count: ${demoCount}`); // Debug
        }
    }, (error) => {
        console.error('Error loading click counts:', error);
    });

    // Load Download counter (if exists)
    const project = projects.find(p => p.title === projectName);
    if (project && project.directDownload) {
        const downloadsRef = database.ref(`projects/${projectName}/downloads`);
        downloadsRef.on('value', (snapshot) => {
            const downloadCount = snapshot.val() || 0;
            const downloadElement = document.querySelector(`#counters-${projectId} .download-count`);
            if (downloadElement) {
                downloadElement.textContent = downloadCount;
                console.log(`Updated ${projectName} Download count: ${downloadCount}`); // Debug
            }
        }, (error) => {
            console.error('Error loading download count:', error);
        });
    }
}

// Track link clicks (global funksiya)
window.trackLinkClick = function(projectName, linkType) {
    console.log(`Tracking ${linkType} click for ${projectName}`); // Debug
    
    if (!projectName) {
        console.error('Project name is missing');
        return;
    }
    
    // Firebase ga yozish
    const clicksRef = database.ref(`projects/${projectName}/clicks/${linkType}`);
    clicksRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    }).then((result) => {
        console.log(`${linkType} count updated successfully for ${projectName}`); // Debug
    }).catch((error) => {
        console.error('Error updating click count:', error);
    });
}

// Track downloads (global funksiya)
window.trackDownload = function(projectName) {
    console.log(`Tracking download for ${projectName}`); // Debug
    
    if (!projectName) {
        console.error('Project name is missing');
        return;
    }
    
    // Firebase ga yozish
    const downloadsRef = database.ref(`projects/${projectName}/downloads`);
    downloadsRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    }).then((result) => {
        console.log(`Download count updated successfully for ${projectName}`); // Debug
    }).catch((error) => {
        console.error('Error updating download count:', error);
    });
}

// Modal functions
function openFeedbackModal(projectName) {
    if (!modal || !modalTitle) return;
    
    modalTitle.textContent = `Feedback for ${projectName}`;
    modal.style.display = 'block';
    selectedRating = 0;
    if (commentText) commentText.value = '';
    updateStars();
    loadFeedback(projectName);
}

function closeFeedbackModal() {
    if (modal) {
        modal.style.display = 'none';
    }
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
if (stars.length > 0) {
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            updateStars();
        });
        
        // Hover effect
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('hover');
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });
}

// Submit feedback
if (submitFeedback) {
    submitFeedback.addEventListener('click', () => {
        if (selectedRating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        if (!currentProject) {
            alert('Project information is missing.');
            return;
        }

        const feedback = {
            project: currentProject,
            rating: selectedRating,
            comment: commentText ? commentText.value : '',
            date: new Date().toISOString(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        const feedbackRef = database.ref(`projects/${currentProject}/feedback`);
        feedbackRef.push(feedback)
            .then(() => {
                alert('Thank you for your feedback!');
                if (commentText) commentText.value = '';
                selectedRating = 0;
                updateStars();
                loadFeedback(currentProject);
            })
            .catch((error) => {
                console.error('Error submitting feedback:', error);
                alert('There was an error submitting your feedback. Please try again.');
            });
    });
}

// Load feedback for a project
function loadFeedback(projectName) {
    if (!feedbackList) return;
    
    feedbackList.innerHTML = '<p class="loading">Loading feedback...</p>';
    
    const feedbackRef = database.ref(`projects/${projectName}/feedback`).orderByChild('timestamp').limitToLast(10);
    feedbackRef.once('value')
        .then((snapshot) => {
            if (!snapshot.exists()) {
                feedbackList.innerHTML = '<p class="no-feedback">No feedback yet. Be the first to leave one!</p>';
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
            feedbackList.innerHTML = '<p class="error">Error loading feedback. Please try again later.</p>';
        });
}

// Close modal when clicking X or outside
if (closeModal) {
    closeModal.addEventListener('click', closeFeedbackModal);
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeFeedbackModal();
    }
});

// Set current year in footer
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Profile image animation
const profileImage = document.querySelector('.hero-image img');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        profileImage.style.transform = 'scale(1.1)';
        profileImage.style.transition = 'transform 0.3s ease';
    });
    
    profileImage.addEventListener('mouseleave', () => {
        profileImage.style.transform = 'scale(1)';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking projects...'); // Debug
    
    // projects array mavjudligini tekshirish
    setTimeout(() => {
        if (typeof projects !== 'undefined' && projects.length > 0) {
            console.log('Projects found, loading...'); // Debug
            loadProjects();
        } else {
            console.error('Projects array is not defined or empty');
            console.log('window.projects:', window.projects); // Debug
            console.log('global projects:', projects); // Debug
            
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = '<p class="error-message">Projects data could not be loaded. Please make sure project.js is loaded correctly.</p>';
            }
        }
    }, 500); // projects.js yuklanishi uchun biroz kutish
    
    // Add scroll animation to sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Animatsiya faqat bir marta ishlashi uchun
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Add some CSS for error messages (optional - can be added to your CSS file)
const style = document.createElement('style');
style.textContent = `
    .error-message {
        text-align: center;
        padding: 2rem;
        color: #e74c3c;
        font-size: 1.1rem;
        background: rgba(231, 76, 60, 0.1);
        border-radius: 8px;
        margin: 2rem;
    }
    
    .loading {
        text-align: center;
        padding: 1rem;
        color: #666;
    }
    
    .no-feedback {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-style: italic;
    }
    
    .stars i.hover {
        color: #f1c40f;
        transform: scale(1.1);
    }
    
    .feedback-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .feedback-item .rating i {
        color: #f1c40f;
        margin-right: 2px;
    }
    
    .feedback-item .comment {
        margin: 0.5rem 0;
        font-style: italic;
    }
    
    .feedback-item .date {
        font-size: 0.8rem;
        color: #888;
    }
`;

document.head.appendChild(style);