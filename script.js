// ============================================================
// EV Connect – Full Interactive Script
// ============================================================

// ——— Shared State ———
let currentChargerId = 1;
let walletBalance = 500;
let userBookings = [
    {
        id: 'BK1001',
        station: 'Green Energy Hub',
        address: '123 MG Road, Koramangala, Bangalore',
        date: '2026-02-20',
        time: '11:00 AM - 12:00 PM',
        vehicle: 'Tata Nexon EV - KA 01 AB 1234',
        amount: 64.90,
        status: 'upcoming'
    },
    {
        id: 'BK1000',
        station: 'EcoCharge Station',
        address: '45 Brigade Road, Bangalore',
        date: '2026-02-03',
        time: '11:00 AM - 12:00 PM',
        vehicle: 'Tata Nexon EV - KA 01 AB 1234',
        amount: 64.90,
        status: 'completed'
    },
    {
        id: 'BK999',
        station: 'Metro EV Point',
        address: '78 Indiranagar, Bangalore',
        date: '2026-01-28',
        time: '03:00 PM - 04:00 PM',
        vehicle: 'MG ZS EV - KA 05 CD 5678',
        amount: 120.00,
        status: 'completed'
    }
];
let userVehicles = [
    { name: 'Tata Nexon EV', plate: 'KA 01 AB 1234' },
    { name: 'MG ZS EV', plate: 'KA 05 CD 5678' }
];
let userName = 'Arjun Sharma';
let userEmail = 'arjun.sharma@email.com';
let userPhone = '+91 98765 43210';

// ——— Charger Data ———
const chargers = {
    1: { name: 'Green Energy Hub', rating: 4.8, distance: '1.2 km', price: 50, power: 50, connector: 'CCS2, CHAdeMO', address: '123 MG Road, Koramangala, Bangalore - 560034', availability: '24/7', status: 'Available' },
    2: { name: 'EcoCharge Station', rating: 4.6, distance: '2.5 km', price: 45, power: 40, connector: 'Type 2', address: '45 Brigade Road, Central, Bangalore - 560025', availability: '6 AM - 11 PM', status: 'Available' },
    3: { name: 'PowerUp Point', rating: 4.9, distance: '0.8 km', price: 60, power: 75, connector: 'CCS2', address: '9 Whitefield, Bangalore - 560066', availability: '24/7', status: 'Busy' },
    4: { name: 'Quick Charge Hub', rating: 4.7, distance: '3.1 km', price: 55, power: 50, connector: 'CCS2, Type 2', address: '22 Electronic City, Bangalore - 560100', availability: '24/7', status: 'Available' },
    5: { name: 'ElectroFuel Center', rating: 4.5, distance: '1.8 km', price: 48, power: 60, connector: 'CHAdeMO', address: '88 JP Nagar, Bangalore - 560078', availability: '7 AM - 10 PM', status: 'Available' },
    6: { name: 'Volt Station Plus', rating: 4.4, distance: '4.2 km', price: 42, power: 35, connector: 'Type 2', address: '15 Marathahalli, Bangalore - 560037', availability: '24/7', status: 'Busy' },
    7: { name: 'ChargePoint Express', rating: 4.8, distance: '0.5 km', price: 65, power: 100, connector: 'CCS2, CHAdeMO', address: '3 HSR Layout, Bangalore - 560102', availability: '24/7', status: 'Available' },
    8: { name: 'SunPower Charge', rating: 4.6, distance: '2.0 km', price: 52, power: 45, connector: 'Type 2', address: '67 Jayanagar, Bangalore - 560041', availability: '8 AM - 9 PM', status: 'Available' },
    9: { name: 'Metro EV Point', rating: 4.7, distance: '1.5 km', price: 58, power: 80, connector: 'CCS2', address: '34 MG Road Metro, Bangalore - 560001', availability: '24/7', status: 'Available' },
    10: { name: 'City Charge Pro', rating: 4.3, distance: '5.0 km', price: 40, power: 30, connector: 'Type 2', address: '112 Yelahanka, Bangalore - 560064', availability: '6 AM - 10 PM', status: 'Busy' },
    11: { name: 'GreenWay Station', rating: 4.9, distance: '2.8 km', price: 55, power: 65, connector: 'CCS2, CHAdeMO', address: '56 Bannerghatta Road, Bangalore - 560076', availability: '24/7', status: 'Available' },
    12: { name: 'PowerGrid Express', rating: 4.5, distance: '3.5 km', price: 50, power: 55, connector: 'CCS2', address: '90 Sarjapur Road, Bangalore - 560035', availability: '24/7', status: 'Available' }
};

// ============================================================
// Navigation System
// ============================================================
function navigateTo(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const targetScreen = document.getElementById(screenId + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        document.body.setAttribute('data-screen', screenId);

        // Scroll the screen itself and all scrollable children to the top
        targetScreen.scrollTop = 0;
        targetScreen.querySelectorAll('*').forEach(el => {
            if (el.scrollTop > 0) el.scrollTop = 0;
        });
    }

    // Update bottom-nav active states across ALL navbars
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.bottom-nav').forEach(nav => {
        nav.querySelectorAll('.nav-item').forEach(item => {
            const onclick = item.getAttribute('onclick') || '';
            if (onclick.includes(`'${screenId}'`)) {
                item.classList.add('active');
            }
        });
    });

    // Render bookings list when navigating there
    if (screenId === 'bookings') {
        renderBookings();
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

// ============================================================
// Theme Toggle
// ============================================================
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ============================================================
// Init
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    // Date inputs default to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }
});

// ============================================================
// Auth
// ============================================================
function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab + '-form').classList.add('active');
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    showToast('Signed in successfully!', 'success');
    setTimeout(() => navigateTo('map'), 600);
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    if (!name || !email || !phone || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    userName = name;
    userEmail = email;
    userPhone = phone;
    showToast('Account created!', 'success');
    setTimeout(() => {
        if (userType === 'charger-owner') navigateTo('owner-dashboard');
        else navigateTo('map');
    }, 600);
}

// ============================================================
// Filters
// ============================================================
function toggleFilters() {
    document.getElementById('filters-panel').classList.toggle('active');
}

// ============================================================
// Charger Selection & Details
// ============================================================
function selectCharger(chargerId) {
    currentChargerId = chargerId;
    const preview = document.getElementById('charger-preview');
    preview.classList.add('active');

    const charger = chargers[chargerId] || chargers[1];
    document.getElementById('preview-name').textContent = charger.name;
    document.querySelector('.charger-preview .rating-value').textContent = charger.rating;
    document.getElementById('preview-distance').textContent = charger.distance + ' away';
    document.getElementById('preview-price').textContent = charger.price;
    document.getElementById('preview-power').textContent = charger.power;

    const statusBadge = document.querySelector('.charger-preview .status-badge');
    statusBadge.textContent = charger.status;
    statusBadge.className = 'status-badge ' + (charger.status === 'Available' ? 'available' : 'busy');
}

// When user goes to charger-details, populate it from current charger
function populateChargerDetails() {
    const c = chargers[currentChargerId] || chargers[1];
    const det = document.getElementById('charger-details-screen');
    det.querySelector('.info-header h1').textContent = c.name;
    const badge = det.querySelector('.info-header .status-badge');
    badge.textContent = c.status;
    badge.className = 'status-badge ' + (c.status === 'Available' ? 'available' : 'busy');
    det.querySelector('.rating-value').textContent = c.rating;
    det.querySelector('.address span').textContent = c.address;
    det.querySelector('.distance-time').textContent = c.distance + ' away • ' + Math.ceil(parseFloat(c.distance) * 2) + ' min drive';

    // Specs
    const specValues = det.querySelectorAll('.spec-value');
    if (specValues[0]) specValues[0].textContent = c.power + ' kW ' + (c.power >= 50 ? 'DC Fast Charging' : 'AC Charging');
    if (specValues[1]) specValues[1].textContent = c.connector;
    if (specValues[2]) specValues[2].textContent = '₹' + c.price + ' per hour';
    if (specValues[3]) specValues[3].textContent = c.availability;

    // Footer price
    const footerPrice = det.querySelector('.details-footer .price');
    if (footerPrice) footerPrice.innerHTML = '₹' + c.price + '<span class="unit">/hr</span>';
}

// Override navigateTo for charger-details to populate first
const _originalNavigateTo = navigateTo;
navigateTo = function (screenId) {
    if (screenId === 'charger-details') {
        _originalNavigateTo(screenId);
        populateChargerDetails();
        return;
    }
    _originalNavigateTo(screenId);
};

// ============================================================
// Time Slot Selection (Booking Screen)
// ============================================================
function selectTimeSlot(element) {
    document.querySelectorAll('.time-slot-large.available').forEach(slot => {
        slot.classList.remove('selected');
        slot.style.borderColor = '';
        slot.style.backgroundColor = '';
    });
    element.classList.add('selected');
    element.style.borderColor = 'var(--primary)';
    element.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
}

// ============================================================
// Booking Flow
// ============================================================
function confirmBooking() {
    const date = document.getElementById('booking-date').value;
    const vehicle = document.getElementById('vehicle-select').value;
    const selectedSlot = document.querySelector('.time-slot-large.selected');

    if (!date) { showToast('Please select a date', 'error'); return; }
    if (!selectedSlot) { showToast('Please select a time slot', 'error'); return; }
    if (!vehicle || vehicle === 'Add New Vehicle') {
        showToast('Please select a vehicle', 'error');
        return;
    }

    const charger = chargers[currentChargerId] || chargers[1];
    const chargingFee = charger.price;
    const serviceFee = 5;
    const gst = parseFloat(((chargingFee + serviceFee) * 0.18).toFixed(2));
    const total = parseFloat((chargingFee + serviceFee + gst).toFixed(2));

    const booking = {
        id: 'BK' + (1000 + userBookings.length + 1),
        station: charger.name,
        address: charger.address,
        date: date,
        time: selectedSlot.querySelector('.time').textContent,
        vehicle: vehicle,
        amount: total,
        status: 'upcoming'
    };
    userBookings.unshift(booking);

    // Deduct from wallet
    if (walletBalance >= total) {
        walletBalance = parseFloat((walletBalance - total).toFixed(2));
        updateWalletDisplay();
    }

    showBookingSuccess(booking);
}

function showBookingSuccess(booking) {
    const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    openModal(`
        <div style="text-align:center;">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3>Booking Confirmed! 🎉</h3>
            <p style="color:var(--text-secondary);margin-bottom:1rem;">Your charging slot has been booked successfully.</p>
            <div class="info-block" style="text-align:left;">
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Station:</strong> ${booking.station}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
                <p><strong>Amount:</strong> ₹${booking.amount.toFixed(2)}</p>
            </div>
            <div class="btn-row">
                <button class="btn btn-confirm" onclick="closeModal(); navigateTo('bookings');">View Bookings</button>
            </div>
        </div>
    `);
}

function updateWalletDisplay() {
    const walletEl = document.querySelector('.wallet-balance');
    if (walletEl) walletEl.textContent = '₹' + walletBalance.toFixed(2);
    // Also update the payment method wallet label
    const walletLabel = document.querySelector('.payment-option [value="wallet"]');
    if (walletLabel) {
        const span = walletLabel.closest('.payment-option').querySelector('span');
        if (span) span.textContent = 'Wallet (₹' + walletBalance.toFixed(2) + ')';
    }
}

// ============================================================
// Bookings Screen
// ============================================================
function switchBookingsTab(tab) {
    document.querySelectorAll('.bookings-tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.bookings-list').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-btab="${tab}"]`).classList.add('active');
    document.getElementById(tab + '-bookings').classList.add('active');
}

function renderBookings() {
    const upcoming = userBookings.filter(b => b.status === 'upcoming');
    const completed = userBookings.filter(b => b.status === 'completed');
    const cancelled = userBookings.filter(b => b.status === 'cancelled');

    document.getElementById('upcoming-bookings').innerHTML = upcoming.length ? upcoming.map(b => bookingCardHTML(b)).join('') : emptyBookingsHTML('No upcoming bookings', 'Book a charging slot from the map!');
    document.getElementById('completed-bookings').innerHTML = completed.length ? completed.map(b => bookingCardHTML(b)).join('') : emptyBookingsHTML('No completed bookings', 'Your completed sessions will appear here.');
    document.getElementById('cancelled-bookings').innerHTML = cancelled.length ? cancelled.map(b => bookingCardHTML(b)).join('') : emptyBookingsHTML('No cancelled bookings', 'Cancelled bookings will appear here.');
}

function bookingCardHTML(b) {
    const formattedDate = new Date(b.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    const statusClass = b.status;
    const statusLabel = b.status.charAt(0).toUpperCase() + b.status.slice(1);
    const cancelBtn = b.status === 'upcoming' ? `<button class="btn-cancel-booking" onclick="cancelBooking('${b.id}'); event.stopPropagation();">Cancel</button>` : '';
    return `
        <div class="booking-card" onclick="viewBookingDetail('${b.id}')">
            <div class="booking-card-header">
                <h4>${b.station}</h4>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <div class="booking-card-details">
                <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${formattedDate} • ${b.time}</p>
                <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${b.address}</p>
                <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14v-2h-3l-2-4H8L6 15H3v2m10-6h3l2 3h-5v-3m-3 0h2v3H7l3-3z"/></svg> ${b.vehicle}</p>
            </div>
            <div class="booking-card-footer">
                <span class="price">₹${b.amount.toFixed(2)}</span>
                ${cancelBtn}
            </div>
        </div>
    `;
}

function emptyBookingsHTML(title, subtitle) {
    return `
        <div class="bookings-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3>${title}</h3>
            <p>${subtitle}</p>
        </div>
    `;
}

function cancelBooking(bookingId) {
    const b = userBookings.find(x => x.id === bookingId);
    if (!b) return;
    openModal(`
        <h3>Cancel Booking?</h3>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">Are you sure you want to cancel your booking at <strong>${b.station}</strong>?</p>
        <div class="info-block">
            <p><strong>ID:</strong> ${b.id}</p>
            <p><strong>Time:</strong> ${b.time}</p>
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Keep Booking</button>
            <button class="btn btn-confirm" style="background:var(--error);" onclick="confirmCancelBooking('${bookingId}')">Yes, Cancel</button>
        </div>
    `);
}

function confirmCancelBooking(bookingId) {
    const b = userBookings.find(x => x.id === bookingId);
    if (b) {
        b.status = 'cancelled';
        walletBalance = parseFloat((walletBalance + b.amount).toFixed(2));
        updateWalletDisplay();
    }
    closeModal();
    renderBookings();
    showToast('Booking cancelled. ₹' + b.amount.toFixed(2) + ' refunded to wallet.', 'success');
}

function viewBookingDetail(bookingId) {
    const b = userBookings.find(x => x.id === bookingId);
    if (!b) return;
    const formattedDate = new Date(b.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    const statusClass = b.status;
    const statusLabel = b.status.charAt(0).toUpperCase() + b.status.slice(1);
    openModal(`
        <h3>Booking Details</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <span style="font-size:0.85rem;color:var(--text-tertiary);">${b.id}</span>
            <span class="status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <div class="info-block">
            <p><strong>Station:</strong> ${b.station}</p>
            <p><strong>Address:</strong> ${b.address}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${b.time}</p>
            <p><strong>Vehicle:</strong> ${b.vehicle}</p>
            <p><strong>Amount:</strong> ₹${b.amount.toFixed(2)}</p>
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Close</button>
            ${b.status === 'upcoming' ? `<button class="btn btn-confirm" style="background:var(--error);" onclick="confirmCancelBooking('${b.id}')">Cancel Booking</button>` : ''}
        </div>
    `);
}

// ============================================================
// Profile Actions
// ============================================================
function handleEditProfile() {
    openModal(`
        <h3>Edit Profile</h3>
        <div class="input-group">
            <label for="edit-name">Full Name</label>
            <input type="text" id="edit-name" value="${userName}" placeholder="Your name">
        </div>
        <div class="input-group">
            <label for="edit-email">Email</label>
            <input type="email" id="edit-email" value="${userEmail}" placeholder="Email">
        </div>
        <div class="input-group">
            <label for="edit-phone">Phone</label>
            <input type="tel" id="edit-phone" value="${userPhone}" placeholder="Phone">
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="saveProfile()">Save Changes</button>
        </div>
    `);
}

function saveProfile() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    if (!name || !email || !phone) { showToast('All fields required', 'error'); return; }
    userName = name;
    userEmail = email;
    userPhone = phone;
    // Update DOM
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.querySelector('h3').textContent = userName;
        profileCard.querySelector('.user-email').textContent = userEmail;
        profileCard.querySelector('.user-phone').textContent = userPhone;
    }
    closeModal();
    showToast('Profile updated!', 'success');
}

function handleAddMoney() {
    openModal(`
        <h3>Add Money to Wallet</h3>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">Current balance: <strong>₹${walletBalance.toFixed(2)}</strong></p>
        <div class="input-group">
            <label for="add-amount">Amount (₹)</label>
            <input type="number" id="add-amount" placeholder="Enter amount" min="10" max="10000" value="500">
        </div>
        <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
            <button class="btn btn-sm btn-cancel" onclick="document.getElementById('add-amount').value=100">₹100</button>
            <button class="btn btn-sm btn-cancel" onclick="document.getElementById('add-amount').value=250">₹250</button>
            <button class="btn btn-sm btn-cancel" onclick="document.getElementById('add-amount').value=500">₹500</button>
            <button class="btn btn-sm btn-cancel" onclick="document.getElementById('add-amount').value=1000">₹1000</button>
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="processAddMoney()">Add Money</button>
        </div>
    `);
}

function processAddMoney() {
    const amount = parseFloat(document.getElementById('add-amount').value);
    if (!amount || amount < 10) { showToast('Minimum ₹10 required', 'error'); return; }
    walletBalance = parseFloat((walletBalance + amount).toFixed(2));
    updateWalletDisplay();
    closeModal();
    showToast('₹' + amount.toFixed(2) + ' added to wallet!', 'success');
}

function handleAddVehicle() {
    openModal(`
        <h3>Add Vehicle</h3>
        <div class="input-group">
            <label for="vehicle-name">Vehicle Name</label>
            <input type="text" id="vehicle-name" placeholder="e.g. Hyundai Ioniq 5">
        </div>
        <div class="input-group">
            <label for="vehicle-plate">License Plate</label>
            <input type="text" id="vehicle-plate" placeholder="e.g. KA 03 EF 9012" style="text-transform:uppercase;">
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="processAddVehicle()">Add Vehicle</button>
        </div>
    `);
}

function processAddVehicle() {
    const name = document.getElementById('vehicle-name').value;
    const plate = document.getElementById('vehicle-plate').value;
    if (!name || !plate) { showToast('Please fill in both fields', 'error'); return; }
    userVehicles.push({ name, plate: plate.toUpperCase() });

    // Add to DOM
    const section = document.querySelector('.vehicle-section');
    if (section) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 17h14v-2h-3l-2-4H8L6 15H3v2m10-6h3l2 3h-5v-3m-3 0h2v3H7l3-3z" />
            </svg>
            <div class="vehicle-info">
                <h4>${name}</h4>
                <p>${plate.toUpperCase()}</p>
            </div>
        `;
        section.appendChild(card);
    }

    // Add to booking dropdown
    const vehicleSelect = document.getElementById('vehicle-select');
    if (vehicleSelect) {
        const opt = document.createElement('option');
        opt.textContent = name + ' - ' + plate.toUpperCase();
        // Insert before "Add New Vehicle"
        const lastOpt = vehicleSelect.querySelector('option:last-child');
        vehicleSelect.insertBefore(opt, lastOpt);
    }

    closeModal();
    showToast(name + ' added!', 'success');
}

function handleLogout() {
    openModal(`
        <h3>Logout</h3>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">Are you sure you want to log out?</p>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" style="background:var(--error);" onclick="closeModal(); navigateTo('welcome'); showToast('Logged out', 'success');">Logout</button>
        </div>
    `);
}

function showSettingsMenu() {
    openModal(`
        <h3>Settings</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <button class="btn btn-cancel full-width" onclick="closeModal(); toggleTheme();">
                🌓 Toggle Dark Mode
            </button>
            <button class="btn btn-cancel full-width" onclick="closeModal(); showToast('Notifications are enabled', 'success');">
                🔔 Notifications
            </button>
            <button class="btn btn-cancel full-width" onclick="closeModal(); showTermsPrivacy();">
                📄 Terms & Privacy
            </button>
            <button class="btn btn-cancel full-width" onclick="closeModal();">
                ✕ Close
            </button>
        </div>
    `);
}

function showHelpSupport() {
    openModal(`
        <h3>Help & Support</h3>
        <div class="info-block">
            <p><strong>📧 Email:</strong> support@evconnect.in</p>
            <p><strong>📞 Phone:</strong> 1800-123-4567 (Toll Free)</p>
            <p><strong>🕑 Hours:</strong> 24/7 Available</p>
        </div>
        <p style="color:var(--text-secondary);font-size:0.875rem;margin-top:1rem;">For urgent issues, please call our helpline. For general queries, email us and we'll respond within 24 hours.</p>
        <div class="btn-row">
            <button class="btn btn-confirm full-width" onclick="closeModal()">Got It</button>
        </div>
    `);
}

function showTermsPrivacy() {
    openModal(`
        <h3>Terms & Privacy</h3>
        <div style="max-height:300px;overflow-y:auto;font-size:0.85rem;color:var(--text-secondary);line-height:1.7;">
            <h4 style="margin-bottom:0.5rem;">Terms of Service</h4>
            <p>By using EV Connect, you agree to our terms and conditions. The service is provided for EV charging discovery and booking.</p>
            <h4 style="margin:1rem 0 0.5rem;">Privacy Policy</h4>
            <p>We collect only the data necessary to provide our services. Your personal information is encrypted and never shared with third parties without consent.</p>
            <h4 style="margin:1rem 0 0.5rem;">Data Usage</h4>
            <p>Location data is used solely to find nearby charging stations. Payment data is processed securely through PCI-compliant partners.</p>
        </div>
        <div class="btn-row" style="margin-top:1rem;">
            <button class="btn btn-confirm full-width" onclick="closeModal()">I Understand</button>
        </div>
    `);
}

// ============================================================
// Owner Dashboard Actions
// ============================================================
function handleAddCharger() {
    openModal(`
        <h3>Add New Charger</h3>
        <div class="input-group">
            <label for="charger-name-input">Station Name</label>
            <input type="text" id="charger-name-input" placeholder="e.g. My Charge Point">
        </div>
        <div class="input-group">
            <label for="charger-address-input">Address</label>
            <input type="text" id="charger-address-input" placeholder="Full address">
        </div>
        <div class="input-group">
            <label for="charger-power-input">Power Output (kW)</label>
            <input type="number" id="charger-power-input" placeholder="e.g. 50" min="5" max="350">
        </div>
        <div class="input-group">
            <label for="charger-price-input">Price (₹/hr)</label>
            <input type="number" id="charger-price-input" placeholder="e.g. 50" min="10">
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="processAddCharger()">Add Charger</button>
        </div>
    `);
}

function processAddCharger() {
    const name = document.getElementById('charger-name-input').value;
    const address = document.getElementById('charger-address-input').value;
    if (!name || !address) { showToast('Please fill in all fields', 'error'); return; }

    // Add to charger list in dashboard
    const list = document.querySelector('.charger-list');
    if (list) {
        const item = document.createElement('div');
        item.className = 'charger-item';
        item.innerHTML = `
            <div class="charger-item-info">
                <h4>${name}</h4>
                <p>${address}</p>
                <span class="status-badge available">Active</span>
            </div>
            <div class="charger-item-stats">
                <p>Today: 0 bookings</p>
                <p class="revenue">₹0</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="handleManageCharger('${name}')">Manage</button>
        `;
        list.appendChild(item);
    }

    // Update total chargers stat
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues[0]) {
        statValues[0].textContent = parseInt(statValues[0].textContent) + 1;
    }

    closeModal();
    showToast(name + ' added successfully!', 'success');
}

function handleManageCharger(chargerName) {
    openModal(`
        <h3>Manage: ${chargerName}</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <button class="btn btn-cancel full-width" onclick="closeModal(); showToast('${chargerName} pricing updated', 'success');">
                💰 Update Pricing
            </button>
            <button class="btn btn-cancel full-width" onclick="closeModal(); showToast('${chargerName} is now offline', 'success');">
                🔌 Toggle Availability
            </button>
            <button class="btn btn-cancel full-width" onclick="closeModal(); showToast('Viewing analytics for ${chargerName}', 'success');">
                📊 View Analytics
            </button>
            <button class="btn btn-cancel full-width" onclick="closeModal();">
                ✕ Close
            </button>
        </div>
    `);
}

function handleBookingRequest(action, btnElement) {
    const card = btnElement.closest('.request-card');
    const name = card.querySelector('h4').textContent;
    if (action === 'accept') {
        card.style.borderLeft = '4px solid var(--success)';
        card.querySelector('.request-actions').innerHTML = '<span class="status-badge available">Accepted ✓</span>';
        showToast('Booking from ' + name + ' accepted!', 'success');
    } else {
        card.style.borderLeft = '4px solid var(--error)';
        card.querySelector('.request-actions').innerHTML = '<span class="status-badge cancelled">Declined ✕</span>';
        showToast('Booking from ' + name + ' declined', 'error');
    }
}

// ============================================================
// Favorite Button
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const favBtn = document.querySelector('.favorite-btn');
    if (favBtn) {
        let favorited = false;
        favBtn.addEventListener('click', () => {
            favorited = !favorited;
            const svg = favBtn.querySelector('svg');
            if (favorited) {
                svg.setAttribute('fill', 'var(--error)');
                svg.setAttribute('stroke', 'var(--error)');
                showToast('Added to favorites ❤️', 'success');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                showToast('Removed from favorites', 'success');
            }
        });
    }
});

// ============================================================
// Charger Detail Time Slots (interactive, toggle selection)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.time-slots .time-slot.available').forEach(slot => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slots .time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            slot.style.background = 'rgba(16, 185, 129, 0.15)';
            slot.style.borderColor = 'var(--primary)';
            slot.style.color = 'var(--primary)';
            slot.style.fontWeight = '600';
        });
    });
});

// ============================================================
// Modal System
// ============================================================
function openModal(html) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    content.innerHTML = html;
    overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
}

// Close modal on clicking outside
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('modal-overlay');
    if (e.target === overlay) closeModal();
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        const filtersPanel = document.getElementById('filters-panel');
        if (filtersPanel && filtersPanel.classList.contains('active')) {
            filtersPanel.classList.remove('active');
        }
    }
});

// ============================================================
// Toast Notifications
// ============================================================
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 0.875rem 1.5rem;
        border-radius: var(--radius);
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 3000;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 90%;
        text-align: center;
        box-shadow: var(--shadow-lg);
        color: white;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================================
// Image Gallery for Charger Details
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (mainImage) mainImage.src = thumb.src;
        });
    });
});

// ============================================================
// Power Type Filter Buttons
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.power-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.power-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

// ============================================================
// Price Range Slider
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const priceRange = document.querySelector('.price-range input[type="range"]');
    const priceValue = document.querySelector('.price-value');
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `₹0 - ₹${e.target.value}/hr`;
        });
    }
});

// ============================================================
// Auto-show charger preview on map load
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.body.getAttribute('data-screen') === 'map') selectCharger(1);
    }, 500);
});

// ============================================================
// Form Validation
// ============================================================
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { return /^[0-9]{10}$/.test(phone.replace(/\s/g, '')); }

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', (e) => {
            e.target.style.borderColor = (e.target.value && !validateEmail(e.target.value)) ? 'var(--error)' : '';
        });
    });
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('blur', (e) => {
            e.target.style.borderColor = (e.target.value && !validatePhone(e.target.value)) ? 'var(--error)' : '';
        });
    });
});

// ============================================================
// Scroll Animation
// ============================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-card, .charger-item, .vehicle-card, .history-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// ============================================================
// Image Error Handler
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.background = 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)';
            this.alt = 'Image unavailable';
        });
    });
});

// ============================================================
// Dynamic Price Update on Booking Screen
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // When navigating to booking, update price breakdown from selected charger
    const origNav = navigateTo;
    navigateTo = function (screenId) {
        origNav(screenId);
        if (screenId === 'booking') {
            updateBookingPriceBreakdown();
        }
    };
});

function updateBookingPriceBreakdown() {
    const c = chargers[currentChargerId] || chargers[1];
    const fee = c.price;
    const service = 5;
    const gst = parseFloat(((fee + service) * 0.18).toFixed(2));
    const total = parseFloat((fee + service + gst).toFixed(2));

    const rows = document.querySelectorAll('.price-row');
    if (rows.length >= 4) {
        rows[0].querySelector('span:last-child').textContent = '₹' + fee.toFixed(2);
        rows[1].querySelector('span:last-child').textContent = '₹' + service.toFixed(2);
        rows[2].querySelector('span:last-child').textContent = '₹' + gst.toFixed(2);
        rows[3].querySelector('span:last-child').textContent = '₹' + total.toFixed(2);
    }

    // Reset time slot selection
    document.querySelectorAll('.time-slot-large').forEach(slot => {
        slot.classList.remove('selected');
        slot.style.borderColor = '';
        slot.style.backgroundColor = '';
    });
}

// ============================================================
// Search functionality
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const pins = document.querySelectorAll('.charging-pin');
            if (!query) {
                pins.forEach(pin => pin.style.display = '');
                return;
            }
            pins.forEach(pin => {
                const id = parseInt(pin.dataset.id);
                const charger = chargers[id];
                if (charger) {
                    const match = charger.name.toLowerCase().includes(query) || charger.address.toLowerCase().includes(query);
                    pin.style.display = match ? '' : 'none';
                }
            });
        });
    }
});

// Prevent pinch zoom on map
document.addEventListener('DOMContentLoaded', () => {
    const mapCanvas = document.getElementById('map-canvas');
    if (mapCanvas) {
        mapCanvas.addEventListener('gesturestart', (e) => e.preventDefault());
        mapCanvas.addEventListener('gesturechange', (e) => e.preventDefault());
    }
});

console.log('🔌 EV Connect - Powered by Clean Energy');
