// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

// Toggle theme on button click
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

// Projects Data - EASILY EDIT THIS SECTION
const projects = [
    {
        title: "Time Picker",
        description: "Android application that displays any time to pick the screen.",
        technologies: ["html", "css", "js"],
        image: "assets/images/PickTime.png",
        githubLink: "https://behzodram.github.io/PickTime/",
        downloadLink: "assets/downloads/PickTime.apk", // Path to your APK file
        directDownload: true // Add this flag
    },
    {
        title: "Control",
        description: "Control homework application with firebase database integration.",
        technologies: ["html", "Firebase", "js"],
        image: "assets/images/Control.png",
        githubLink: "https://behzodram.github.io/Control/",
        downloadLink: "assets/downloads/Control.apk", // Path to your APK file
        directDownload: true // Add this flag
    },
    {
        title: "TruckDispatch",
        description: "Android application that is useful for dispatchers.",
        technologies: ["html", "css", "js", "Firebase"],
        image: "assets/images/TruckDispatch.png",
        githubLink: "https://behzodram.github.io/TruckDispatch/",
        downloadLink: "assets/downloads/TruckDispatch.apk", // Path to your APK file
        directDownload: true // Add this flag
    }
];

// Load Projects Dynamically
function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        // Create download button HTML if directDownload is true
        const downloadButton = project.directDownload ? 
            `<a href="${project.downloadLink}" download class="btn download-btn" onclick="trackDownload('${project.title}')">
                <i class="fas fa-download"></i> Download APK
            </a>` : '';
        
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
                <div class="project-links">
                    <a href="${project.githubLink}" target="_blank" class="code-link">
                        <i class="fab fa-github"></i> View Code
                    </a>
                    ${downloadButton}
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Add this function to track downloads
function trackDownload(appName) {
    console.log(`${appName} downloaded`);
    // You can add analytics here later
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    
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

// Simple form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Profil rasmi uchun aylana animatsiya
const profileImage = document.querySelector('.hero-image img');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        profileImage.style.transform = 'scale(1.1)';
    });
    
    profileImage.addEventListener('mouseleave', () => {
        profileImage.style.transform = 'scale(1)';
    });
}
