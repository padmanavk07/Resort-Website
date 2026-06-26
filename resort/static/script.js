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
    sidebar.style.right = "-250px";
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
// Booking page
const roomTypes = document.querySelectorAll('.room-select-card');
const roomRates = {
    "Oceanfront Villa":1200,
    "Premium Suite":1000,
    "Honeymoon Retreat":800
}
roomTypes.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        roomTypes.forEach(room => {
            room.classList.remove('selected');
            room.querySelector('.btn-select').innerText = 'Select Room';
        });
        
        this.classList.add('selected');
        this.closest('.room-select-card').querySelector('.btn-select').innerText = 'Selected';

        const roomTypeInput = document.querySelector('.room-select-card.selected');
        document.getElementById("hidden-room-name").value = roomTypeInput.getAttribute('data-room');
        document.getElementById("hidden-room-price").value = roomTypeInput.getAttribute('data-price');
        document.getElementById('display-room-name').textContent = roomTypeInput.getAttribute('data-room');
        document.getElementById('display-room-total').textContent = `$${roomTypeInput.getAttribute('data-price')}`;

    });

});

const form = document.getElementById('bookingForm');
const checkInInput = document.getElementById('checkin');
const checkOutInput = document.getElementById('checkout');
const roomTypeInput = document.querySelector('.room-select-card.selected');
const subTotalPriceDisplay = document.getElementById('display-subtotal');
const taxesDisplay = document.getElementById('display-taxes');
const totalPriceDisplay = document.getElementById('display-total');
const roomNameDisplay = document.getElementById('display-room-name');
const roomPriceDisplay = document.getElementById('display-room-total');
const nightsDisplay = document.getElementById('display-nights')


// to set the minimum check-in date to today
const today = new Date().toISOString().split('T')[0];
checkInInput.setAttribute('min', today);

// to update minimum checkout date based on check-in
function updateCheckoutMinDate() {
    const checkInDate = checkInInput.value;
    if (checkInDate) {
        const minCheckOut = new Date(checkInDate);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        
        const minCheckOutString = minCheckOut.toISOString().split('T')[0];
        checkOutInput.setAttribute('min', minCheckOutString);
        
    }
}

function calculatePrice() {
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    const roomType = roomTypeInput.getAttribute('data-room');

    // Only calculate if both dates are selected and valid
    if (checkInInput.value && checkOutInput.value && checkOutDate > checkInDate) {

        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const nights = timeDifference / (1000 * 3600 * 24);
        
        // Calculate total
        const rate = roomRates[roomType];
        const total = nights * rate;
        
        // Update the display
        subTotalPriceDisplay.textContent = `$${total.toFixed(2)}`;
        taxesDisplay.textContent = `$${(total/10).toFixed(2)}`;
        totalPriceDisplay.textContent = `$${(total*(1.1)).toFixed(2)}`;
        roomNameDisplay.textContent = roomType;
        roomPriceDisplay.textContent = `$${rate}`;
        nightsDisplay.textContent = `${nights} nights`;

        document.getElementById("hidden-total-cost").value = total;
        document.getElementById("hidden-room-name").value = roomType;

    } else {
        // Reset to 0 if dates are incomplete
        subTotalPriceDisplay.textContent = `$0`;
    }
}

// event listeners to trigger calculations when inputs change
checkInInput.addEventListener('change', () => {
    updateCheckoutMinDate();
    calculatePrice();
});
checkOutInput.addEventListener('change', calculatePrice);
roomTypeInput.addEventListener('change', calculatePrice); // not working yet

form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    console.log('Booking submitted successfully!');
});

// profile menu toggle
function toggleProfileMenu() {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');

    profileMenu.classList.toggle('active');
};
