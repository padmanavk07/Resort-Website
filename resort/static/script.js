// Hero slideshow 
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);

// Fade up animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated to keep it visible
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// Sidebar functions for mobile
function showSidebar() {
    const sidebar = document.querySelector('.side-bar');
    sidebar.style.right = "0";
}
function hideSidebar() {
    const sidebar = document.querySelector('.side-bar');
    sidebar.style.right = "-300px";
}

// For admin page

// Tabs changing
const navItems = document.querySelectorAll('.admin-nav-item');
const sections = document.querySelectorAll('.dashboard-section');
const headerTitle = document.getElementById('header-title-text');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));
        this.classList.add('active');
        
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        headerTitle.innerText = this.getAttribute('data-title');
    });
});

// Check-in Button 
function checkInGuest(id) {
    const button = document.getElementById(`btn-${id}`);
    const statusBadge = document.getElementById(`status-${id}`);
    
    statusBadge.className = "badge green";
    statusBadge.innerText = "Checked In";
    button.innerText = "Checked In";
    button.classList.add("disabled");
    button.disabled = true;
    
}
