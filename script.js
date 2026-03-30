// ============================================================
// EV Connect – Full Interactive Script
// ============================================================

// ——— Shared State ———
let currentChargerId = 1;
let walletBalance = 500;
let userBookings = [
  {
    id: "BK1001",
    station: "Green Energy Hub",
    address: "123 MG Road, Koramangala, Bangalore",
    date: "2026-02-20",
    time: "11:00 AM - 12:00 PM",
    vehicle: "Tata Nexon EV - KA 01 AB 1234",
    amount: 64.9,
    status: "upcoming",
  },
  {
    id: "BK1000",
    station: "EcoCharge Station",
    address: "45 Brigade Road, Bangalore",
    date: "2026-02-03",
    time: "11:00 AM - 12:00 PM",
    vehicle: "Tata Nexon EV - KA 01 AB 1234",
    amount: 64.9,
    status: "completed",
  },
  {
    id: "BK999",
    station: "Metro EV Point",
    address: "78 Indiranagar, Bangalore",
    date: "2026-01-28",
    time: "03:00 PM - 04:00 PM",
    vehicle: "MG ZS EV - KA 05 CD 5678",
    amount: 120.0,
    status: "completed",
  },
];
let userVehicles = [
  { name: "Tata Nexon EV", plate: "KA 01 AB 1234" },
  { name: "MG ZS EV", plate: "KA 05 CD 5678" },
];
let userName = "Arjun Sharma";
let userEmail = "arjun.sharma@email.com";
let userPhone = "+91 98765 43210";

// ——— Charger Data ———
const chargers = {
  1: {
    name: "Green Energy Hub",
    rating: 4.8,
    distance: "1.2 km",
    price: 50,
    power: 50,
    connector: "CCS2, CHAdeMO",
    address: "123 MG Road, Koramangala, Bangalore - 560034",
    availability: "24/7",
    status: "Available",
  },
  2: {
    name: "EcoCharge Station",
    rating: 4.6,
    distance: "2.5 km",
    price: 45,
    power: 40,
    connector: "Type 2",
    address: "45 Brigade Road, Central, Bangalore - 560025",
    availability: "6 AM - 11 PM",
    status: "Available",
  },
  3: {
    name: "PowerUp Point",
    rating: 4.9,
    distance: "0.8 km",
    price: 60,
    power: 75,
    connector: "CCS2",
    address: "9 Whitefield, Bangalore - 560066",
    availability: "24/7",
    status: "Busy",
  },
  4: {
    name: "Quick Charge Hub",
    rating: 4.7,
    distance: "3.1 km",
    price: 55,
    power: 50,
    connector: "CCS2, Type 2",
    address: "22 Electronic City, Bangalore - 560100",
    availability: "24/7",
    status: "Available",
  },
  5: {
    name: "ElectroFuel Center",
    rating: 4.5,
    distance: "1.8 km",
    price: 48,
    power: 60,
    connector: "CHAdeMO",
    address: "88 JP Nagar, Bangalore - 560078",
    availability: "7 AM - 10 PM",
    status: "Available",
  },
  6: {
    name: "Volt Station Plus",
    rating: 4.4,
    distance: "4.2 km",
    price: 42,
    power: 35,
    connector: "Type 2",
    address: "15 Marathahalli, Bangalore - 560037",
    availability: "24/7",
    status: "Busy",
  },
  7: {
    name: "ChargePoint Express",
    rating: 4.8,
    distance: "0.5 km",
    price: 65,
    power: 100,
    connector: "CCS2, CHAdeMO",
    address: "3 HSR Layout, Bangalore - 560102",
    availability: "24/7",
    status: "Available",
  },
  8: {
    name: "SunPower Charge",
    rating: 4.6,
    distance: "2.0 km",
    price: 52,
    power: 45,
    connector: "Type 2",
    address: "67 Jayanagar, Bangalore - 560041",
    availability: "8 AM - 9 PM",
    status: "Available",
  },
  9: {
    name: "Metro EV Point",
    rating: 4.7,
    distance: "1.5 km",
    price: 58,
    power: 80,
    connector: "CCS2",
    address: "34 MG Road Metro, Bangalore - 560001",
    availability: "24/7",
    status: "Available",
  },
  10: {
    name: "City Charge Pro",
    rating: 4.3,
    distance: "5.0 km",
    price: 40,
    power: 30,
    connector: "Type 2",
    address: "112 Yelahanka, Bangalore - 560064",
    availability: "6 AM - 10 PM",
    status: "Busy",
  },
  11: {
    name: "GreenWay Station",
    rating: 4.9,
    distance: "2.8 km",
    price: 55,
    power: 65,
    connector: "CCS2, CHAdeMO",
    address: "56 Bannerghatta Road, Bangalore - 560076",
    availability: "24/7",
    status: "Available",
  },
  12: {
    name: "PowerGrid Express",
    rating: 4.5,
    distance: "3.5 km",
    price: 50,
    power: 55,
    connector: "CCS2",
    address: "90 Sarjapur Road, Bangalore - 560035",
    availability: "24/7",
    status: "Available",
  },
};

// ============================================================
// Navigation System
// ============================================================
function navigateTo(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => screen.classList.remove("active"));

  const targetScreen = document.getElementById(screenId + "-screen");
  if (targetScreen) {
    targetScreen.classList.add("active");
    document.body.setAttribute("data-screen", screenId);

    // Scroll the screen itself and all scrollable children to the top
    targetScreen.scrollTop = 0;
    targetScreen.querySelectorAll("*").forEach((el) => {
      if (el.scrollTop > 0) el.scrollTop = 0;
    });
  }

  // Update bottom-nav active states across ALL navbars
  document
    .querySelectorAll(".nav-item")
    .forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".bottom-nav").forEach((nav) => {
    nav.querySelectorAll(".nav-item").forEach((item) => {
      const onclick = item.getAttribute("onclick") || "";
      if (onclick.includes(`'${screenId}'`)) {
        item.classList.add("active");
      }
    });
  });

  // Render bookings list when navigating there
  if (screenId === "bookings") {
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
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// ============================================================
// Init
// ============================================================
window.addEventListener("DOMContentLoaded", () => {
  // Theme
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);

  // Date inputs default to today
  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    dateInput.min = today;
  }
});

// ============================================================
// Navigation System To Stations
// ============================================================
let navMapState = {
  zoom: 1.8,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  startDragX: 0,
  startDragY: 0,
  minZoom: 0.5,
  maxZoom: 3
};

function navZoomIn() {
  if (navMapState.zoom < navMapState.maxZoom) {
    navMapState.zoom = Math.min(navMapState.zoom * 1.3, navMapState.maxZoom);
    updateNavTransformAnimated();
  }
}

function navZoomOut() {
  if (navMapState.zoom > navMapState.minZoom) {
    navMapState.zoom = Math.max(navMapState.zoom / 1.3, navMapState.minZoom);
    updateNavTransformAnimated();
  }
}

function updateNavTransformAnimated() {
  const container = document.getElementById("nav-map-canvas");
  if (container) {
    container.style.transition = 'transform 0.3s ease-out';
    container.style.transform = `translate3d(${navMapState.translateX}px, ${navMapState.translateY}px, 0) scale(${navMapState.zoom})`;
    setTimeout(() => { container.style.transition = 'none'; }, 300);
  }
}

function updateNavTransform() {
  const container = document.getElementById("nav-map-canvas");
  if (container) {
    container.style.transition = 'none';
    container.style.transform = `translate3d(${navMapState.translateX}px, ${navMapState.translateY}px, 0) scale(${navMapState.zoom})`;
  }
}

function startNavigation(bookingId) {
  const b = userBookings.find((x) => x.id === bookingId);
  if (!b) return;

  // Close the modal
  closeModal();

  // Switch to navigation screen
  navigateTo("navigation");

  // Populate data
  document.getElementById("nav-destination-name").textContent = b.station;
  document.getElementById("nav-address").textContent = b.address;

  // Clone map
  const baseMapCanvas = document.getElementById("map-canvas");
  const navCanvas = document.getElementById("nav-map-canvas");
  navCanvas.innerHTML = baseMapCanvas.innerHTML;

  // Remove pins & user location from clone
  navCanvas.querySelectorAll('.charging-pin').forEach(pin => pin.style.display = 'none');
  navCanvas.querySelectorAll('.current-location').forEach(loc => loc.style.display = 'none');

  // Find the charger entry to get coordinates
  const chargerEntry = Object.entries(chargers).find(([id, c]) => c.name === b.station) || [1, chargers[1]];
  const chargerId = chargerEntry[0];

  // Find the pin in the original map to copy its left/top percentages
  const originalPin = baseMapCanvas.querySelector(`.charging-pin[data-id="${chargerId}"]`);
  let destX = 80;
  let destY = 20;
  if (originalPin && originalPin.style.left && originalPin.style.top) {
    destX = parseFloat(originalPin.style.left);
    destY = parseFloat(originalPin.style.top);
  }

  // Add origin point, destination point, and SVG route inside navCanvas
  navCanvas.insertAdjacentHTML('beforeend', `
    <div class="nav-point origin" style="left: 50%; top: 50%; position:absolute; z-index:10; transform: translate(-50%, -50%);">
        <div class="location-pulse" style="width:40px; height:40px; background:rgba(59, 130, 246, 0.3); border-radius:50%; animation: pulse 2s infinite;"></div>
        <div class="location-dot" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:16px; height:16px; background:var(--secondary); border:3px solid white; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>
    </div>
    <div class="nav-point destination" style="left: ${destX}%; top: ${destY}%; position:absolute; z-index:10; transform: translate(-50%, -100%); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <svg viewBox="0 0 24 24" fill="var(--primary)" stroke="white" stroke-width="2" width="40" height="40">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
    </div>
    <svg class="nav-route-svg" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:4; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.2));">
        <path id="nav-route-path" fill="none" stroke="var(--primary)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" class="route-line-animated" />
    </svg>
  `);

  // Generate random distance and time
  const distKm = (Math.random() * 5 + 1).toFixed(1);
  const timeMins = Math.round(distKm * 3);

  const now = new Date();
  now.setMinutes(now.getMinutes() + timeMins);
  const arrivalTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  document.getElementById("nav-distance").textContent = distKm + " km";
  document.getElementById("nav-time").textContent = timeMins + " min";
  document.getElementById("nav-eta").textContent = arrivalTime;

  // Reset transform before drawing to get correct rects
  navCanvas.style.transition = 'none';
  navCanvas.style.transform = 'scale(1) translate(0px, 0px)';

  // Draw simulated route line after screen becomes visible
  setTimeout(() => drawNavRouteLine(50, 50, destX, destY), 50);
}

function exitNavigation() {
  navigateTo("bookings");
}

function drawNavRouteLine(startXPct, startYPct, endXPct, endYPct) {
  const path = document.getElementById("nav-route-path");
  if (!path) return;

  // Get natural width/height of the map canvas
  const navCanvas = document.getElementById("nav-map-canvas");
  const width = navCanvas.offsetWidth || window.innerWidth;
  const height = navCanvas.offsetHeight || window.innerHeight;

  const sX = (startXPct / 100) * width;
  const sY = (startYPct / 100) * height;
  const eX = (endXPct / 100) * width;
  const eY = (endYPct / 100) * height;

  const vRoads = [30, 42.5, 55, 67.5, 80];
  const hRoads = [25, 37.5, 50, 62.5, 75];

  // Find nearest roads to destination
  const nearestVRoadPct = vRoads.reduce((prev, curr) => Math.abs(curr - endXPct) < Math.abs(prev - endXPct) ? curr : prev);
  const nearestHRoadPct = hRoads.reduce((prev, curr) => Math.abs(curr - endYPct) < Math.abs(prev - endYPct) ? curr : prev);

  const midX = (nearestVRoadPct / 100) * width;
  const midY = (nearestHRoadPct / 100) * height;

  // Path: Start -> horizontally to nearestVRoad -> vertically to nearestHRoad -> horizontally to eX -> vertically to eY
  path.setAttribute(
    "d",
    `M ${sX} ${sY} L ${midX} ${sY} L ${midX} ${midY} L ${eX} ${midY} L ${eX} ${eY}`
  );

  // Center view on route
  const centerX = (startXPct + endXPct) / 2;
  const centerY = (startYPct + endYPct) / 2;

  const transX = 50 - centerX;
  const transY = 50 - centerY;

  navMapState.zoom = 1.8;
  navMapState.translateX = (transX / 100) * width;
  navMapState.translateY = (transY / 100) * height;

  // Apply a nice immersive zoom & pan animation
  setTimeout(() => {
    navCanvas.style.transition = 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    navCanvas.style.transform = `translate3d(${navMapState.translateX}px, ${navMapState.translateY}px, 0) scale(${navMapState.zoom})`;
    setTimeout(() => {
      navCanvas.style.transition = 'none';
    }, 1500);
  }, 100);
}

// ============================================================
// Auth
// ============================================================
function switchAuthTab(tab) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((f) => f.classList.remove("active"));
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
  document.getElementById(tab + "-form").classList.add("active");
}

function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const userType = document.querySelector(
    'input[name="loginUserType"]:checked',
  ).value;

  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  showToast("Signed in successfully!", "success");
  setTimeout(() => {
    if (userType === "charger-owner") navigateTo("owner-dashboard");
    else navigateTo("map");
  }, 600);
}

function handleSignup() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const phone = document.getElementById("signup-phone").value;
  const password = document.getElementById("signup-password").value;
  const userType = document.querySelector(
    'input[name="userType"]:checked',
  ).value;
  if (!name || !email || !phone || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  userName = name;
  userEmail = email;
  userPhone = phone;
  showToast("Account created!", "success");
  setTimeout(() => {
    if (userType === "charger-owner") navigateTo("owner-dashboard");
    else navigateTo("map");
  }, 600);
}

// ============================================================
// Filters
// ============================================================
function toggleFilters() {
  document.getElementById("filters-panel").classList.toggle("active");
}

// ============================================================
// Charger Selection & Details
// ============================================================
function selectCharger(chargerId) {
  currentChargerId = chargerId;
  const preview = document.getElementById("charger-preview");
  preview.classList.add("active");

  const charger = chargers[chargerId] || chargers[1];

  const stationImages = ['assets/ev_station_day.png', 'assets/ev_station_night.png', 'assets/ev_station_green.png'];
  const imageUrl = stationImages[chargerId % stationImages.length];
  document.getElementById("preview-image").src = imageUrl;

  document.getElementById("preview-name").textContent = charger.name;
  document.querySelector(".charger-preview .rating-value").textContent =
    charger.rating;
  document.getElementById("preview-distance").textContent =
    charger.distance + " away";
  document.getElementById("preview-price").textContent = charger.price;
  document.getElementById("preview-power").textContent = charger.power;

  const statusBadge = document.querySelector(".charger-preview .status-badge");
  statusBadge.textContent = charger.status;
  statusBadge.className =
    "status-badge " + (charger.status === "Available" ? "available" : "busy");
}

// When user goes to charger-details, populate it from current charger
function populateChargerDetails() {
  const c = chargers[currentChargerId] || chargers[1];
  const det = document.getElementById("charger-details-screen");

  const stationImages = ['assets/ev_station_day.png', 'assets/ev_station_night.png', 'assets/ev_station_green.png'];
  const mainImageIndex = currentChargerId % stationImages.length;
  document.getElementById("details-main-image").src = stationImages[mainImageIndex];

  const thumbnails = det.querySelectorAll(".thumbnail-strip .thumbnail");
  thumbnails.forEach((thumb, idx) => {
    const thumbIndex = (mainImageIndex + idx) % stationImages.length;
    thumb.src = stationImages[thumbIndex];
    thumb.onclick = () => {
      document.getElementById("details-main-image").src = thumb.src;
      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    };
  });

  thumbnails.forEach(t => t.classList.remove("active"));
  if (thumbnails[0]) thumbnails[0].classList.add("active");

  det.querySelector(".info-header h1").textContent = c.name;
  const badge = det.querySelector(".info-header .status-badge");
  badge.textContent = c.status;
  badge.className =
    "status-badge " + (c.status === "Available" ? "available" : "busy");
  det.querySelector(".rating-value").textContent = c.rating;
  det.querySelector(".address span").textContent = c.address;
  det.querySelector(".distance-time").textContent =
    c.distance +
    " away • " +
    Math.ceil(parseFloat(c.distance) * 2) +
    " min drive";

  // Specs
  const specValues = det.querySelectorAll(".spec-value");
  if (specValues[0])
    specValues[0].textContent =
      c.power + " kW " + (c.power >= 50 ? "DC Fast Charging" : "AC Charging");
  if (specValues[1]) specValues[1].textContent = c.connector;
  if (specValues[2]) specValues[2].textContent = "₹" + c.price + " per hour";
  if (specValues[3]) specValues[3].textContent = c.availability;

  // Footer price
  const footerPrice = det.querySelector(".details-footer .price");
  if (footerPrice)
    footerPrice.innerHTML = "₹" + c.price + '<span class="unit">/hr</span>';
}

// Override navigateTo for charger-details to populate first
const _originalNavigateTo = navigateTo;
navigateTo = function (screenId) {
  if (screenId === "charger-details") {
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
  document.querySelectorAll(".time-slot-large.available").forEach((slot) => {
    slot.classList.remove("selected");
    slot.style.borderColor = "";
    slot.style.backgroundColor = "";
  });
  element.classList.add("selected");
  element.style.borderColor = "var(--primary)";
  element.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
}

// ============================================================
// Booking Flow
// ============================================================
function confirmBooking() {
  const date = document.getElementById("booking-date").value;
  const vehicle = document.getElementById("vehicle-select").value;
  const selectedSlot = document.querySelector(".time-slot-large.selected");

  if (!date) {
    showToast("Please select a date", "error");
    return;
  }
  if (!selectedSlot) {
    showToast("Please select a time slot", "error");
    return;
  }
  if (!vehicle || vehicle === "Add New Vehicle") {
    showToast("Please select a vehicle", "error");
    return;
  }

  const charger = chargers[currentChargerId] || chargers[1];
  const chargingFee = charger.price;
  const serviceFee = 5;
  const gst = parseFloat(((chargingFee + serviceFee) * 0.18).toFixed(2));
  const total = parseFloat((chargingFee + serviceFee + gst).toFixed(2));

  const booking = {
    id: "BK" + (1000 + userBookings.length + 1),
    station: charger.name,
    address: charger.address,
    date: date,
    time: selectedSlot.querySelector(".time").textContent,
    vehicle: vehicle,
    amount: total,
    status: "upcoming",
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
  const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  const walletEl = document.querySelector(".wallet-balance");
  if (walletEl) walletEl.textContent = "₹" + walletBalance.toFixed(2);
  // Also update the payment method wallet label
  const walletLabel = document.querySelector(
    '.payment-option [value="wallet"]',
  );
  if (walletLabel) {
    const span = walletLabel.closest(".payment-option").querySelector("span");
    if (span) span.textContent = "Wallet (₹" + walletBalance.toFixed(2) + ")";
  }
}

// ============================================================
// Bookings Screen
// ============================================================
function switchBookingsTab(tab) {
  document
    .querySelectorAll(".bookings-tab-btn")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".bookings-list")
    .forEach((l) => l.classList.remove("active"));
  document.querySelector(`[data-btab="${tab}"]`).classList.add("active");
  document.getElementById(tab + "-bookings").classList.add("active");
}

function renderBookings() {
  const upcoming = userBookings.filter((b) => b.status === "upcoming");
  const completed = userBookings.filter((b) => b.status === "completed");
  const cancelled = userBookings.filter((b) => b.status === "cancelled");

  document.getElementById("upcoming-bookings").innerHTML = upcoming.length
    ? upcoming.map((b) => bookingCardHTML(b)).join("")
    : emptyBookingsHTML(
      "No upcoming bookings",
      "Book a charging slot from the map!",
    );
  document.getElementById("completed-bookings").innerHTML = completed.length
    ? completed.map((b) => bookingCardHTML(b)).join("")
    : emptyBookingsHTML(
      "No completed bookings",
      "Your completed sessions will appear here.",
    );
  document.getElementById("cancelled-bookings").innerHTML = cancelled.length
    ? cancelled.map((b) => bookingCardHTML(b)).join("")
    : emptyBookingsHTML(
      "No cancelled bookings",
      "Cancelled bookings will appear here.",
    );
}

function bookingCardHTML(b) {
  const formattedDate = new Date(b.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const statusClass = b.status;
  const statusLabel = b.status.charAt(0).toUpperCase() + b.status.slice(1);
  const cancelBtn =
    b.status === "upcoming"
      ? `<button class="btn-cancel-booking" onclick="cancelBooking('${b.id}'); event.stopPropagation();">Cancel</button>`
      : "";
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
  const b = userBookings.find((x) => x.id === bookingId);
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
  const b = userBookings.find((x) => x.id === bookingId);
  if (b) {
    b.status = "cancelled";
    walletBalance = parseFloat((walletBalance + b.amount).toFixed(2));
    updateWalletDisplay();
  }
  closeModal();
  renderBookings();
  showToast(
    "Booking cancelled. ₹" + b.amount.toFixed(2) + " refunded to wallet.",
    "success",
  );
}

function viewBookingDetail(bookingId) {
  const b = userBookings.find((x) => x.id === bookingId);
  if (!b) return;
  const formattedDate = new Date(b.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let statusClass = b.status === "charging" ? "busy" : b.status;
  if (b.status === "awaiting_owner") statusClass = "busy";
  if (b.status === "active") statusClass = "available";

  const statusLabel =
    b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ");

  let actionButtons = `<button class="btn btn-cancel" onclick="closeModal()">Close</button>`;

  if (b.status === "upcoming") {
    actionButtons += `<button class="btn" style="background:var(--info); color:white; border:none;" onclick="startNavigation('${b.id}')">Navigate</button>`;
    actionButtons += `<button class="btn btn-primary" onclick="startChargingSession('${b.id}')">Start Session</button>`;
    actionButtons += `<button class="btn btn-confirm" style="background:var(--error);" onclick="confirmCancelBooking('${b.id}')">Cancel</button>`;
  } else if (b.status === "charging" || b.status === "awaiting_owner") {
    actionButtons += `<button class="btn" style="background:var(--info); color:white; border:none;" onclick="startNavigation('${b.id}')">Navigate</button>`;
    actionButtons += `<button class="btn btn-secondary" disabled>Awaiting Owner</button>`;
  } else if (b.status === "active") {
    actionButtons += `<button class="btn" style="background:var(--info); color:white; border:none;" onclick="startNavigation('${b.id}')">Navigate</button>`;
    actionButtons += `<button class="btn btn-error" disabled>Charging...</button>`;
  }

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
        <div class="btn-row" style="flex-wrap: wrap; gap: 0.5rem; justify-content: flex-end;">
            ${actionButtons}
        </div>
    `);
}

function startChargingSession(bookingId) {
  const b = userBookings.find((x) => x.id === bookingId);
  if (!b) return;
  openPhotoVerification(bookingId, "user");
}

function openPhotoVerification(bookingId, role) {
  const roleText =
    role === "user" ? "EV User Verification" : "Owner Verification";
  const instructions =
    role === "user"
      ? "Please upload a photo showing your vehicle's license plate AND the charger connected securely."
      : "Please upload a photo to verify the EV's license plate matches the booking and is connected.";

  openModal(`
        <h3>${roleText}</h3>
        <p style="color:var(--text-secondary);margin-bottom:1rem;font-size:0.9rem;">${instructions}</p>
        
        <div class="photo-upload-container" id="photo-upload-container">
            <input type="file" id="photo-input" accept="image/*" capture="environment" style="display: none;" onchange="handlePhotoSelect(event)">
            <label for="photo-input" class="upload-area" id="upload-area">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span>Tap to take a photo or choose from gallery</span>
            </label>
            <div id="photo-preview" class="photo-preview" style="display: none;">
                <img id="preview-img" src="" alt="Verification Photo">
                <button class="btn-remove" onclick="removePhoto()">✕</button>
            </div>
        </div>
        
        <div class="btn-row" style="margin-top: 1.5rem;">
            <button class="btn btn-cancel" onclick="${role === "user" ? `viewBookingDetail('${bookingId}')` : `closeModal()`}">Cancel</button>
            <button class="btn btn-primary full-width" id="submit-photo-btn" disabled onclick="submitPhotoVerification('${bookingId}', '${role}')">Submit Verification</button>
        </div>
    `);
}

function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("upload-area").style.display = "none";
      const preview = document.getElementById("photo-preview");
      preview.style.display = "block";
      document.getElementById("preview-img").src = e.target.result;
      document.getElementById("submit-photo-btn").disabled = false;
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  document.getElementById("photo-input").value = "";
  document.getElementById("photo-preview").style.display = "none";
  document.getElementById("upload-area").style.display = "flex";
  document.getElementById("submit-photo-btn").disabled = true;
}

function submitPhotoVerification(bookingId, role) {
  const b = userBookings.find((x) => x.id === bookingId);
  if (!b) return;

  if (role === "user") {
    b.status = "awaiting_owner";
    showToast(
      "Photo submitted! Waiting for homeowner verification.",
      "success",
    );
    addActiveSessionToOwnerDashboard(b);
  } else {
    b.status = "active";
    showToast("Session verified! Charging started.", "success");
    updateOwnerActiveSessionStatus(b.id, "Charging Active");
  }

  closeModal();
  if (role === "user") {
    renderBookings();
    viewBookingDetail(bookingId);
  }
}

function addActiveSessionToOwnerDashboard(booking) {
  const list = document.getElementById("owner-active-sessions-list");
  if (!list) return;

  const emptyState = list.querySelector(".empty-state");
  if (emptyState) emptyState.remove();

  let existingCard = document.getElementById("owner-session-" + booking.id);
  if (existingCard) return;

  const card = document.createElement("div");
  card.className = "session-card";
  card.id = "owner-session-" + booking.id;
  card.innerHTML = `
        <div class="session-info">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>${userName}</h4>
                <span class="status-badge busy" id="owner-session-status-${booking.id}">Awaiting Verification</span>
            </div>
            <p>${booking.station}</p>
            <p class="vehicle" style="margin-top:0.25rem;"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M5 17h14v-2h-3l-2-4H8L6 15H3v2m10-6h3l2 3h-5v-3m-3 0h2v3H7l3-3z"/></svg>${booking.vehicle}</p>
        </div>
        <div class="session-actions" id="owner-session-actions-${booking.id}">
            <p class="helper-text">User has uploaded verification photo.</p>
            <button class="btn btn-primary full-width btn-sm" onclick="openPhotoVerification('${booking.id}', 'owner')">Verify Vehicle Photo</button>
        </div>
    `;
  list.prepend(card);
}

function updateOwnerActiveSessionStatus(bookingId, statusText) {
  const statusBadge = document.getElementById(
    "owner-session-status-" + bookingId,
  );
  if (statusBadge) {
    statusBadge.textContent = statusText;
    statusBadge.className = "status-badge available";
  }
  const actions = document.getElementById("owner-session-actions-" + bookingId);
  if (actions) {
    actions.innerHTML = `
            <div class="verified-status">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Session verified and charging actively.</span>
            </div>
        `;
  }
}

// ============================================================
// Profile Actions
// ============================================================
function handleEditProfile() {
  openModal(`
        <h3>Edit Profile</h3>
        <div class="input-group">
            <label for="edit-name">Full Name</label>
            <input type="text" id="edit-name" value="${userName}" placeholder="Your name" />
        </div>
        <div class="input-group">
            <label for="edit-email">Email</label>
            <input type="email" id="edit-email" value="${userEmail}" placeholder="Email" />
        </div>
        <div class="input-group">
            <label for="edit-phone">Phone</label>
            <input type="tel" id="edit-phone" value="${userPhone}" placeholder="Phone" />
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="saveProfile()">Save Changes</button>
        </div>
    `);
}

function saveProfile() {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const phone = document.getElementById("edit-phone").value;
  if (!name || !email || !phone) {
    showToast("All fields required", "error");
    return;
  }
  userName = name;
  userEmail = email;
  userPhone = phone;
  // Update DOM
  const profileCard = document.querySelector(".profile-card");
  if (profileCard) {
    profileCard.querySelector("h3").textContent = userName;
    profileCard.querySelector(".user-email").textContent = userEmail;
    profileCard.querySelector(".user-phone").textContent = userPhone;
  }
  closeModal();
  showToast("Profile updated!", "success");
}

function handleAddMoney() {
  openModal(`
        <h3>Add Money to Wallet</h3>
        <p style="color:var(--text-secondary);margin-bottom:1rem;">Current balance: <strong>₹${walletBalance.toFixed(2)}</strong></p>
        <div class="input-group">
            <label for="add-amount">Amount (₹)</label>
            <input type="number" id="add-amount" placeholder="Enter amount" min="10" max="10000" value="500" />
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
  const amount = parseFloat(document.getElementById("add-amount").value);
  if (!amount || amount < 10) {
    showToast("Minimum ₹10 required", "error");
    return;
  }
  walletBalance = parseFloat((walletBalance + amount).toFixed(2));
  updateWalletDisplay();
  closeModal();
  showToast("₹" + amount.toFixed(2) + " added to wallet!", "success");
}

function handleAddVehicle() {
  openModal(`
        <h3>Add Vehicle</h3>
        <div class="input-group">
            <label for="vehicle-name">Vehicle Name</label>
            <input type="text" id="vehicle-name" placeholder="e.g. Hyundai Ioniq 5" />
        </div>
        <div class="input-group">
            <label for="vehicle-plate">License Plate</label>
            <input type="text" id="vehicle-plate" placeholder="e.g. KA 03 EF 9012" style="text-transform:uppercase;" />
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="processAddVehicle()">Add Vehicle</button>
        </div>
    `);
}

function processAddVehicle() {
  const name = document.getElementById("vehicle-name").value;
  const plate = document.getElementById("vehicle-plate").value;
  if (!name || !plate) {
    showToast("Please fill in both fields", "error");
    return;
  }
  userVehicles.push({ name, plate: plate.toUpperCase() });

  // Add to DOM
  const section = document.querySelector(".vehicle-section");
  if (section) {
    const card = document.createElement("div");
    card.className = "vehicle-card";
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
  const vehicleSelect = document.getElementById("vehicle-select");
  if (vehicleSelect) {
    const opt = document.createElement("option");
    opt.textContent = name + " - " + plate.toUpperCase();
    // Insert before "Add New Vehicle"
    const lastOpt = vehicleSelect.querySelector("option:last-child");
    vehicleSelect.insertBefore(opt, lastOpt);
  }

  closeModal();
  showToast(name + " added!", "success");
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
            <input type="text" id="charger-name-input" placeholder="e.g. My Charge Point" />
        </div>
        <div class="input-group">
            <label for="charger-address-input">Address</label>
            <input type="text" id="charger-address-input" placeholder="Full address" />
        </div>
        <div class="input-group">
            <label for="charger-power-input">Power Output (kW)</label>
            <input type="number" id="charger-power-input" placeholder="e.g. 50" min="5" max="350" />
        </div>
        <div class="input-group">
            <label for="charger-price-input">Price (₹/hr)</label>
            <input type="number" id="charger-price-input" placeholder="e.g. 50" min="10" />
        </div>
        <div class="btn-row">
            <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
            <button class="btn btn-confirm" onclick="processAddCharger()">Add Charger</button>
        </div>
    `);
}

function processAddCharger() {
  const name = document.getElementById("charger-name-input").value;
  const address = document.getElementById("charger-address-input").value;
  if (!name || !address) {
    showToast("Please fill in all fields", "error");
    return;
  }

  // Add to charger list in dashboard
  const list = document.querySelector(".charger-list");
  if (list) {
    const item = document.createElement("div");
    item.className = "charger-item";
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
  const statValues = document.querySelectorAll(".stat-value");
  if (statValues[0]) {
    statValues[0].textContent = parseInt(statValues[0].textContent) + 1;
  }

  closeModal();
  showToast(name + " added successfully!", "success");
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
  const card = btnElement.closest(".request-card");
  const name = card.querySelector("h4").textContent;
  if (action === "accept") {
    card.style.borderLeft = "4px solid var(--success)";
    card.querySelector(".request-actions").innerHTML =
      '<span class="status-badge available">Accepted ✓</span>';
    showToast("Booking from " + name + " accepted!", "success");
  } else {
    card.style.borderLeft = "4px solid var(--error)";
    card.querySelector(".request-actions").innerHTML =
      '<span class="status-badge cancelled">Declined ✕</span>';
    showToast("Booking from " + name + " declined", "error");
  }
}

// ============================================================
// Favorite Button
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const favBtn = document.querySelector(".favorite-btn");
  if (favBtn) {
    let favorited = false;
    favBtn.addEventListener("click", () => {
      favorited = !favorited;
      const svg = favBtn.querySelector("svg");
      if (favorited) {
        svg.setAttribute("fill", "var(--error)");
        svg.setAttribute("stroke", "var(--error)");
        showToast("Added to favorites ❤️", "success");
      } else {
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        showToast("Removed from favorites", "success");
      }
    });
  }
});

// ============================================================
// Charger Detail Time Slots (interactive, toggle selection)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".time-slots .time-slot.available")
    .forEach((slot) => {
      slot.addEventListener("click", () => {
        document
          .querySelectorAll(".time-slots .time-slot")
          .forEach((s) => s.classList.remove("selected"));
        slot.classList.add("selected");
        slot.style.background = "rgba(16, 185, 129, 0.15)";
        slot.style.borderColor = "var(--primary)";
        slot.style.color = "var(--primary)";
        slot.style.fontWeight = "600";
      });
    });
});

// ============================================================
// Modal System
// ============================================================
function openModal(html) {
  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");
  content.innerHTML = html;
  overlay.classList.add("active");
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("active");
}

// Close modal on clicking outside
document.addEventListener("click", (e) => {
  const overlay = document.getElementById("modal-overlay");
  if (e.target === overlay) closeModal();
});

// Close modal on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    const filtersPanel = document.getElementById("filters-panel");
    if (filtersPanel && filtersPanel.classList.contains("active")) {
      filtersPanel.classList.remove("active");
    }
  }
});

// ============================================================
// Toast Notifications
// ============================================================
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
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
        background: ${type === "error" ? "#ef4444" : "#10b981"};
    `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============================================================
// Image Gallery for Charger Details
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.querySelector(".main-image img");
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      if (mainImage) mainImage.src = thumb.src;
    });
  });
});

// ============================================================
// Power Type Filter Buttons
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".power-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".power-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

// ============================================================
// Price Range Slider
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const priceRange = document.querySelector('.price-range input[type="range"]');
  const priceValue = document.querySelector(".price-value");
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", (e) => {
      priceValue.textContent = `₹0 - ₹${e.target.value}/hr`;
    });
  }
});

// ============================================================
// Auto-show charger preview on map load
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (document.body.getAttribute("data-screen") === "map") selectCharger(1);
  }, 500);
});

// ============================================================
// Form Validation
// ============================================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone.replace(/\s/g, ""));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[type="email"]').forEach((input) => {
    input.addEventListener("blur", (e) => {
      e.target.style.borderColor =
        e.target.value && !validateEmail(e.target.value) ? "var(--error)" : "";
    });
  });
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("blur", (e) => {
      e.target.style.borderColor =
        e.target.value && !validatePhone(e.target.value) ? "var(--error)" : "";
    });
  });
});

// ============================================================
// Scroll Animation
// ============================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
);

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".stat-card, .charger-item, .vehicle-card, .history-card")
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(card);
    });
});

// ============================================================
// Image Error Handler
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.style.background =
        "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)";
      this.alt = "Image unavailable";
    });
  });
});

// ============================================================
// Dynamic Price Update on Booking Screen
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // When navigating to booking, update price breakdown from selected charger
  const origNav = navigateTo;
  navigateTo = function (screenId) {
    origNav(screenId);
    if (screenId === "booking") {
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

  const rows = document.querySelectorAll(".price-row");
  if (rows.length >= 4) {
    rows[0].querySelector("span:last-child").textContent = "₹" + fee.toFixed(2);
    rows[1].querySelector("span:last-child").textContent =
      "₹" + service.toFixed(2);
    rows[2].querySelector("span:last-child").textContent = "₹" + gst.toFixed(2);
    rows[3].querySelector("span:last-child").textContent =
      "₹" + total.toFixed(2);
  }

  // Reset time slot selection
  document.querySelectorAll(".time-slot-large").forEach((slot) => {
    slot.classList.remove("selected");
    slot.style.borderColor = "";
    slot.style.backgroundColor = "";
  });
}

// ============================================================
// Search functionality
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const pins = document.querySelectorAll(".charging-pin");
      if (!query) {
        pins.forEach((pin) => (pin.style.display = ""));
        return;
      }
      pins.forEach((pin) => {
        const id = parseInt(pin.dataset.id);
        const charger = chargers[id];
        if (charger) {
          const match =
            charger.name.toLowerCase().includes(query) ||
            charger.address.toLowerCase().includes(query);
          pin.style.display = match ? "" : "none";
        }
      });
    });
  }
});

// Prevent pinch zoom on map
document.addEventListener("DOMContentLoaded", () => {
  const mapCanvas = document.getElementById("map-canvas");
  if (mapCanvas) {
    mapCanvas.addEventListener("gesturestart", (e) => e.preventDefault());
    mapCanvas.addEventListener("gesturechange", (e) => e.preventDefault());
  }
});

// ============================================================
// Owner Dashboard - Charger Management
// ============================================================
let ownerChargers = [
  { id: 1, name: "Green Energy Hub", address: "123 MG Road, Koramangala", active: true, image: "assets/home_ev_charging_1.png" },
  { id: 2, name: "EcoCharge Point", address: "45 Brigade Road, Central", active: true, image: "assets/home_ev_charging_3.png" },
];
let ownerChargerId = 3;

function renderOwnerChargers() {
  const list = document.getElementById("owner-chargers-list");
  if (!list) return;
  if (ownerChargers.length === 0) {
    list.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:2rem 0;">No chargers yet. Click "Add Charger" to get started.</p>';
    return;
  }
  list.innerHTML = ownerChargers.map(c => `
    <div class="charger-item" style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;gap:1.25rem;">
      <img src="${c.image || 'assets/home_ev_charging_2.png'}" alt="${c.name}" style="width:72px;height:72px;border-radius:12px;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.1); flex-shrink:0;">
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:0.25rem;">
        <p style="margin:0;font-weight:600;font-size:1rem;color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.name}</p>
        <p style="margin:0;font-size:0.8rem;color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.address}</p>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.5rem; flex-shrink:0;">
          <span class="status-badge ${c.active ? 'available' : 'busy'}" style="font-size:0.7rem;padding:2px 8px;margin:0;">${c.active ? 'Active' : 'Inactive'}</span>
          <button class="btn btn-secondary btn-sm" onclick="handleManageCharger(${c.id})">Manage</button>
      </div>
    </div>
  `).join('');
}

function handleManageCharger(id) {
  const c = ownerChargers.find(x => x.id === id);
  if (!c) return;
  openModal(`
    <h3>Manage: ${c.name}</h3>
    <p style="color:var(--text-secondary);margin-bottom:1.5rem;font-size:0.9rem;">${c.address}</p>
    <div style="display:flex; flex-direction:column; gap: 0.75rem;">
      <button class="btn btn-primary full-width" onclick="toggleChargerStatus(${c.id})">${c.active ? 'Set Inactive' : 'Set Active'}</button>
      <button class="btn btn-cancel full-width" style="background:var(--error);color:white;" onclick="deleteOwnerCharger(${c.id})">Delete Charger</button>
      <button class="btn btn-cancel full-width" onclick="closeModal()">Close</button>
    </div>
  `);
}

function toggleChargerStatus(id) {
  const c = ownerChargers.find(x => x.id === id);
  if (!c) return;
  c.active = !c.active;
  showToast(c.name + ' is now ' + (c.active ? 'Active' : 'Inactive'), 'success');
  closeModal();
  renderOwnerChargers();
}

function deleteOwnerCharger(id) {
  const c = ownerChargers.find(x => x.id === id);
  if (!c) return;
  ownerChargers = ownerChargers.filter(x => x.id !== id);
  showToast(c.name + ' removed', 'success');
  closeModal();
  renderOwnerChargers();
  // Update stat
  const statVal = document.querySelector('.stat-value');
  if (statVal) statVal.textContent = ownerChargers.length;
}

function handleAddCharger() {
  openModal(`
    <h3>Add New Charger</h3>
    <div class="input-group">
      <label for="charger-name-input">Station Name</label>
      <input type="text" id="charger-name-input" placeholder="e.g. My Charge Point" />
    </div>
    <div class="input-group">
      <label for="charger-address-input">Address</label>
      <input type="text" id="charger-address-input" placeholder="Full address" />
    </div>
    <div class="btn-row">
      <button class="btn btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn btn-confirm" onclick="processAddCharger()">Add Charger</button>
    </div>
  `);
}

function processAddCharger() {
  const name = document.getElementById("charger-name-input").value.trim();
  const address = document.getElementById("charger-address-input").value.trim();
  if (!name || !address) {
    showToast("Please fill in all fields", "error");
    return;
  }
  const images = ["assets/home_ev_charging_1.png", "assets/home_ev_charging_2.png", "assets/home_ev_charging_3.png"];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  ownerChargers.push({ id: ownerChargerId++, name: name, address: address, active: true, image: randomImage });
  showToast(name + " added!", "success");
  closeModal();
  renderOwnerChargers();
  // Update stat
  const statVal = document.querySelector('.stat-value');
  if (statVal) statVal.textContent = ownerChargers.length;
}

function handleBookingRequest(action, btn) {
  const card = btn.closest('.request-card');
  if (action === 'accept') {
    showToast('Booking accepted!', 'success');
  } else {
    showToast('Booking declined.', 'error');
  }
  if (card) {
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    setTimeout(() => card.remove(), 300);
  }
}

// Render chargers on page load
document.addEventListener("DOMContentLoaded", () => {
  renderOwnerChargers();
});

console.log("🔌 EV Connect - Powered by Clean Energy");
