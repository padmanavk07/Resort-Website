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

const form = document.getElementById('bookingForm');

const checkInInput = document.getElementById('checkin');
const checkOutInput = document.getElementById('checkout');

const subTotalPriceDisplay = document.getElementById('display-subtotal');
const taxesDisplay = document.getElementById('display-taxes');
const totalPriceDisplay = document.getElementById('display-total');
const roomNameDisplay = document.getElementById('display-room-name');
const roomPriceDisplay = document.getElementById('display-room-total');
const nightsDisplay = document.getElementById('display-nights');

// minimum date
const today = new Date().toISOString().split('T')[0];
checkInInput.min = today;


roomTypes.forEach(room => {

    room.addEventListener('click', function () {

        roomTypes.forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.btn-select').textContent = 'Select Room';
        });

        this.classList.add('selected');
        this.querySelector('.btn-select').textContent = 'Selected';

        const roomName = this.dataset.room;
        const roomPrice = Number(this.dataset.price);

        // Update hidden input
        document.getElementById("hidden-room-name").value = roomName;

        roomNameDisplay.textContent = roomName;
        roomPriceDisplay.textContent = `$${roomPrice}`;

        calculatePrice();

    });

});

function updateCheckoutMinDate() {

    if (!checkInInput.value) return;

    const minCheckout = new Date(checkInInput.value);
    minCheckout.setDate(minCheckout.getDate() + 1);

    checkOutInput.min = minCheckout.toISOString().split('T')[0];

    if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
        checkOutInput.value = "";
    }

}

function calculatePrice() {

    const selectedRoom = document.querySelector('.room-select-card.selected');

    if (!selectedRoom) return;

    const roomName = selectedRoom.dataset.room;
    const rate = Number(selectedRoom.dataset.price);

    roomNameDisplay.textContent = roomName;

    if (!checkInInput.value || !checkOutInput.value) {

        roomPriceDisplay.textContent = `$${rate}`;
        subTotalPriceDisplay.textContent = "$0.00";
        taxesDisplay.textContent = "$0.00";
        totalPriceDisplay.textContent = "$0.00";
        nightsDisplay.textContent = "0 Nights";

        document.getElementById("hidden-total-cost").value = 0;

        return;
    }

    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);

    if (checkOut <= checkIn) return;

    const nights = (checkOut - checkIn) / (1000 * 3600 * 24)
    

    const subtotal = nights * rate;
    const tax = subtotal * 0.10;
    const grandTotal = subtotal + tax;

    roomPriceDisplay.textContent = `$${subtotal.toFixed(2)}`;
    subTotalPriceDisplay.textContent = `$${subtotal.toFixed(2)}`;
    taxesDisplay.textContent = `$${tax.toFixed(2)}`;
    totalPriceDisplay.textContent = `$${grandTotal.toFixed(2)}`;
    nightsDisplay.textContent = `${nights} Nights`;

    document.getElementById("hidden-room-name").value = roomName;
    document.getElementById("hidden-total-cost").value = grandTotal.toFixed(2);

}

checkInInput.addEventListener('change', () => {
    updateCheckoutMinDate();
    calculatePrice();
});

checkOutInput.addEventListener('change', calculatePrice);


form.addEventListener('submit', function (event) {

    console.log("Room:", document.getElementById("hidden-room-name").value);
    console.log("Total:", document.getElementById("hidden-total-cost").value);

});

calculatePrice();

// profile menu toggle
function toggleProfileMenu() {
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');

    profileMenu.classList.toggle('active');
};
