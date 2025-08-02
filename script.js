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
        title: "Weather App",
        description: "Android application that displays current weather using OpenWeather API.",
        technologies: ["Kotlin", "Retrofit", "OpenWeather API"],
        image: "assets/images/weather-app.jpg",
        githubLink: "https://github.com/yourusername/weather-app",
        downloadLink: "assets/downloads/weather-app.apk",
        qrCode: "assets/images/qr-weather.png"
    },
    {
        title: "To-Do List",
        description: "Simple task management application with SQLite database integration.",
        technologies: ["Java", "SQLite", "Android Studio"],
        image: "assets/images/todo-app.jpg",
        githubLink: "https://github.com/yourusername/todo-app",
        downloadLink: "assets/downloads/todo-app.apk",
        qrCode: "assets/images/qr-todo.png"
    },
    // Add more projects as needed
];

// Load Projects Dynamically
function loadProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
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
                    <a href="${project.githubLink}" target="_blank">
                        <i class="fab fa-github"></i> Code
                    </a>
                    <div class="qr-code">
                        <img src="${project.qrCode}" alt="QR Code for ${project.title}">
                    </div>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
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
