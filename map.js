// ============================================================
// EV Connect – Enhanced Interactive Map
// Infinite panning, deep zoom, dynamic charger generation
// ============================================================

// Map State
let mapState = {
  zoom: 1,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  minZoom: 0.15,
  maxZoom: 3,
  lastZoom: 1
};

// Dynamic charger station names for random generation
const dynamicStationNames = [
  'VoltHub Express', 'ChargeNow Plus', 'EcoVolt Station', 'PowerDrive Hub',
  'GreenCharge Pro', 'SparkPoint', 'ElectraFuel', 'ChargeBay',
  'SwiftCharge', 'AmpUp Station', 'BoltCharge', 'ZapStation Pro',
  'NeonCharge Hub', 'TurboVolt', 'FlashCharge Point', 'EverGreen Power',
  'SunVolt Express', 'RapidCharge Bay', 'CityVolt Hub', 'MetroCharge Plus',
  'BlueWatt Station', 'PrimeCharge', 'VoltEdge', 'ChargePeak',
  'EcoStation X', 'MegaWatt Hub', 'QuickSpark', 'PowerNest',
  'ChargeWave', 'ElecGrid Pro', 'WattUp Station', 'VoltStream',
  'ThunderCharge', 'SolarVolt Hub', 'GridPoint Express', 'JetCharge',
  'NovaPower', 'VoltAge Hub', 'ChargeForce', 'ElectraBay',
  'SmartVolt', 'GreenGrid Station', 'VoltNova', 'ChargeStar',
  'EcoCharge Elite', 'PowerSurge Hub', 'BrightVolt', 'ChargeMax Pro'
];

const dynamicAddresses = [
  'MG Road, Bangalore', 'Whitefield, Bangalore', 'Indiranagar, Bangalore',
  'Koramangala, Bangalore', 'HSR Layout, Bangalore', 'JP Nagar, Bangalore',
  'Electronic City, Bangalore', 'Marathahalli, Bangalore', 'BTM Layout, Bangalore',
  'Sarjapur Road, Bangalore', 'Jayanagar, Bangalore', 'Yelahanka, Bangalore',
  'RT Nagar, Bangalore', 'Hebbal, Bangalore', 'Banashankari, Bangalore',
  'Rajajinagar, Bangalore', 'Malleshwaram, Bangalore', 'Sadashivanagar, Bangalore',
  'Basavanagudi, Bangalore', 'Vijayanagar, Bangalore', 'Peenya, Bangalore',
  'KR Puram, Bangalore', 'Bommanahalli, Bangalore', 'Bellandur, Bangalore'
];

const connectorTypes = ['CCS2', 'CHAdeMO', 'Type 2', 'CCS2, CHAdeMO', 'CCS2, Type 2'];
const availabilities = ['24/7', '6 AM - 11 PM', '7 AM - 10 PM', '8 AM - 9 PM', '24/7 Access'];

// Track generated dynamic chargers to avoid duplicates
let dynamicChargersGenerated = new Map(); // key: "gridX,gridY" -> array of charger elements
let nextDynamicChargerId = 100; // Start dynamic IDs from 100 to avoid conflicts

// Get map canvas element
const mapCanvas = document.getElementById('map-canvas');

// Seeded random for consistent charger placement per grid cell
function seededRandom(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 49297;
  x = Math.sin(x) * 43758.5453;
  return x - Math.floor(x);
}

// ============================================================
// Zoom Functions
// ============================================================

// Helper: enable smooth CSS transition temporarily for button zooms
function smoothZoom(callback) {
  if (!mapCanvas) return;
  mapCanvas.classList.add('smooth-zoom');
  callback();
  // Remove transition class after animation completes
  setTimeout(() => {
    mapCanvas.classList.remove('smooth-zoom');
  }, 380);
}

// Zoom toward viewport center (for button-triggered zooms)
function zoomFromCenter(newZoom) {
  const oldZoom = mapState.zoom;
  mapState.zoom = newZoom;

  const zoomRatio = mapState.zoom / oldZoom;

  // Since transform-origin is 50% 50% (center of the canvas/screen),
  // we just need to scale the translation to keep the center fixed.
  mapState.translateX = mapState.translateX * zoomRatio;
  mapState.translateY = mapState.translateY * zoomRatio;
}

function zoomIn() {
  if (mapState.zoom >= mapState.maxZoom) return;
  smoothZoom(() => {
    zoomFromCenter(Math.min(mapState.zoom * 1.35, mapState.maxZoom));
    onZoomChanged();
    updateMapTransform();
  });
}

function zoomOut() {
  if (mapState.zoom <= mapState.minZoom) return;
  smoothZoom(() => {
    zoomFromCenter(Math.max(mapState.zoom / 1.35, mapState.minZoom));
    onZoomChanged();
    updateMapTransform();
  });
}

function resetZoom() {
  smoothZoom(() => {
    mapState.zoom = 1;
    mapState.translateX = 0;
    mapState.translateY = 0;
    onZoomChanged();
    updateMapTransform();
  });
}

// Update map transform – NO boundaries, infinite movement
function updateMapTransform() {
  if (!mapCanvas) return;
  // Use translate3d to force hardware acceleration on the GPU, avoiding pixel repaints and jitters
  mapCanvas.style.transform = `translate3d(${mapState.translateX}px, ${mapState.translateY}px, 0) scale(${mapState.zoom})`;
}

// ============================================================
// Dynamic Charger Generation
// ============================================================
let dynamicChargerTimeout = null;

function onZoomChanged() {
  const currentZoom = mapState.zoom;

  // Debounce the map charger generation so it does not block the main UI thread during zoom animations
  if (dynamicChargerTimeout) clearTimeout(dynamicChargerTimeout);

  if (currentZoom < 0.8) {
    dynamicChargerTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        generateDynamicChargers(currentZoom);
      });
    }, 300); // Wait for zoom transition to calm down
  }

  // Show/hide dynamic chargers based on zoom level
  updateDynamicChargerVisibility(currentZoom);

  // Inverse scale current location to make it look bigger when zoomed out
  const currentLocation = document.querySelector('.current-location');
  if (currentLocation) {
    // scale up inversely, capping it so it doesn't get too small when zoomed in
    const invScale = Math.max(1, 1 / currentZoom);
    currentLocation.style.transform = `translate(-50%, -50%) scale(${invScale})`;
  }

  mapState.lastZoom = currentZoom;
}

function generateDynamicChargers(zoom) {
  if (!mapCanvas) return;

  // More chargers at lower zoom levels
  // At zoom 0.8: few extra, at 0.15: dozens of extras
  const extraCount = Math.floor((1 - zoom) * 60) + 5;

  // Use grid-based generation for consistent placement
  const gridSize = Math.max(1, Math.floor(zoom * 5));
  const gridKey = `z${gridSize}`;

  if (dynamicChargersGenerated.has(gridKey)) return; // Already generated for this level

  const chargers = [];
  const containerRect = mapCanvas.getBoundingClientRect();

  for (let i = 0; i < extraCount; i++) {
    const seed = gridSize * 1000 + i;
    const x = seededRandom(seed) * 100;
    const y = seededRandom(seed + 500) * 100;

    // Skip positions too close to existing static chargers (center area)
    if (x > 25 && x < 90 && y > 15 && y < 85 && zoom > 0.5) continue;

    const chargerId = nextDynamicChargerId++;
    const isAvailable = seededRandom(seed + 1000) > 0.3;

    // Register in chargers data (from script.js global)
    if (typeof chargers !== 'undefined' && window.chargers) {
      // Not available - use window reference
    }
    registerDynamicCharger(chargerId, seed);

    // Create DOM element
    const pin = document.createElement('div');
    pin.className = 'charging-pin dynamic-pin';
    pin.setAttribute('data-id', chargerId);
    pin.setAttribute('data-zoom-level', gridSize);
    pin.style.left = x + '%';
    pin.style.top = y + '%';
    pin.onclick = function () { selectCharger(chargerId); };

    const marker = document.createElement('div');
    marker.className = 'pin-marker ' + (isAvailable ? 'available' : 'busy');
    pin.appendChild(marker);

    mapCanvas.appendChild(pin);
    chargers.push(pin);
  }

  dynamicChargersGenerated.set(gridKey, chargers);
}

function registerDynamicCharger(id, seed) {
  // Add charger data to the global chargers object if it exists
  const nameIdx = Math.floor(seededRandom(seed + 2000) * dynamicStationNames.length);
  const addrIdx = Math.floor(seededRandom(seed + 3000) * dynamicAddresses.length);
  const connIdx = Math.floor(seededRandom(seed + 4000) * connectorTypes.length);
  const availIdx = Math.floor(seededRandom(seed + 5000) * availabilities.length);

  const rating = (3.5 + seededRandom(seed + 6000) * 1.5).toFixed(1);
  const distance = (0.5 + seededRandom(seed + 7000) * 15).toFixed(1);
  const price = Math.floor(30 + seededRandom(seed + 8000) * 50);
  const power = [22, 30, 40, 50, 60, 75, 100, 150][Math.floor(seededRandom(seed + 9000) * 8)];
  const isAvailable = seededRandom(seed + 1000) > 0.3;

  // Try to add to global chargers object
  try {
    if (window.chargers || typeof chargers !== 'undefined') {
      const globalChargers = window.chargers || chargers;
      globalChargers[id] = {
        name: dynamicStationNames[nameIdx],
        rating: parseFloat(rating),
        distance: distance + ' km',
        price: price,
        power: power,
        connector: connectorTypes[connIdx],
        address: Math.floor(seededRandom(seed + 10000) * 200) + ' ' + dynamicAddresses[addrIdx] + ' - 560' + String(Math.floor(seededRandom(seed + 11000) * 100)).padStart(3, '0'),
        availability: availabilities[availIdx],
        status: isAvailable ? 'Available' : 'Busy'
      };
    }
  } catch (e) {
    // chargers might not be defined yet
  }
}

function updateDynamicChargerVisibility(zoom) {
  // Show/hide dynamic chargers based on appropriate zoom levels
  dynamicChargersGenerated.forEach((pins, key) => {
    const level = parseInt(key.replace('z', ''));
    pins.forEach(pin => {
      // Always show dynamic pins once generated (they represent real stations)
      pin.style.display = '';
      // Scale pins slightly when zoomed out so they remain visible
      if (zoom < 0.4) {
        pin.style.transform = `scale(${1 / zoom * 0.5})`;
      } else {
        pin.style.transform = '';
      }
    });
  });
}

// ============================================================
// Infinite Tiling Background
// ============================================================
function updateMapBackground() {
  if (!mapCanvas) return;

  // Create a repeating pattern effect for the background at large zoom-outs
  const container = document.querySelector('.map-container');
  if (!container) return;

  if (mapState.zoom < 0.5) {
    // At very low zoom, add extra map tiles
    generateMapTiles();
  }
}

let tilesGenerated = false;
function generateMapTiles() {
  if (tilesGenerated || !mapCanvas) return;
  tilesGenerated = true;

  // Add extra environmental elements for the larger map area
  const extraElements = [
    // More water bodies
    { type: 'water-body lake', left: '-20%', top: '10%', width: '15%', height: '15%', label: 'Ulsoor Lake' },
    { type: 'water-body river', left: '105%', top: '30%', width: '12%', height: '50%', label: 'Creek' },
    { type: 'water-body park', left: '-15%', top: '60%', width: '20%', height: '25%', label: 'Cubbon Park' },
    { type: 'water-body lake', left: '110%', top: '70%', width: '18%', height: '18%', label: 'Madiwala Lake' },
    { type: 'water-body park', left: '40%', top: '-20%', width: '25%', height: '15%', label: 'Lalbagh Gardens' },
    { type: 'water-body park', left: '20%', top: '105%', width: '22%', height: '18%', label: 'Bannerghatta Park' },

    // Extended roads
    { type: 'road horizontal', top: '0%', left: '-50%', right: '-50%', width: '200%' },
    { type: 'road horizontal', top: '100%', left: '-50%', right: '-50%', width: '200%' },
    { type: 'road vertical', left: '0%', top: '-50%', bottom: '-50%', height: '200%' },
    { type: 'road vertical', left: '100%', top: '-50%', bottom: '-50%', height: '200%' },
    { type: 'road horizontal minor', top: '-25%', left: '-50%', right: '-50%', width: '200%' },
    { type: 'road horizontal minor', top: '112%', left: '-50%', right: '-50%', width: '200%' },
    { type: 'road vertical minor', left: '-20%', top: '-50%', bottom: '-50%', height: '200%' },
    { type: 'road vertical minor', left: '115%', top: '-50%', bottom: '-50%', height: '200%' },
  ];

  // Add buildings in outer areas
  const outerBuildings = [
    { left: '-15%', top: '25%', width: '6%', height: '8%', size: 'medium' },
    { left: '-10%', top: '40%', width: '5%', height: '6%', size: 'small' },
    { left: '-18%', top: '85%', width: '7%', height: '10%', size: 'large' },
    { left: '102%', top: '15%', width: '6%', height: '9%', size: 'medium' },
    { left: '105%', top: '50%', width: '8%', height: '12%', size: 'large' },
    { left: '108%', top: '85%', width: '5%', height: '7%', size: 'small' },
    { left: '30%', top: '-15%', width: '7%', height: '10%', size: 'large' },
    { left: '55%', top: '-10%', width: '5%', height: '7%', size: 'medium' },
    { left: '80%', top: '-12%', width: '6%', height: '8%', size: 'small' },
    { left: '25%', top: '105%', width: '8%', height: '11%', size: 'large' },
    { left: '60%', top: '108%', width: '5%', height: '7%', size: 'medium' },
    { left: '85%', top: '103%', width: '6%', height: '9%', size: 'small' },
  ];

  extraElements.forEach(el => {
    const div = document.createElement('div');
    if (el.type.startsWith('water-body')) {
      div.className = el.type;
      div.style.cssText = `left:${el.left};top:${el.top};width:${el.width};height:${el.height};`;
      if (el.label) {
        const span = document.createElement('span');
        span.className = 'water-label';
        span.textContent = el.label;
        div.appendChild(span);
      }
    } else if (el.type.startsWith('road')) {
      const classes = el.type.split(' ');
      div.className = classes.join(' ');
      let style = '';
      if (el.top) style += `top:${el.top};`;
      if (el.left) style += `left:${el.left};`;
      if (el.width) style += `width:${el.width};`;
      if (el.height) style += `height:${el.height};`;
      div.style.cssText = style;
    }
    mapCanvas.appendChild(div);
  });

  outerBuildings.forEach(b => {
    const div = document.createElement('div');
    div.className = `building ${b.size}`;
    div.style.cssText = `left:${b.left};top:${b.top};width:${b.width};height:${b.height};`;
    mapCanvas.appendChild(div);
  });
}

// ============================================================
// Mouse/Touch Drag – INFINITE PANNING (no boundaries)
// ============================================================
function handleDragStart(e) {
  if (!mapCanvas) return;

  mapState.isDragging = true;
  mapCanvas.classList.add('dragging');

  if (e.type === 'mousedown') {
    mapState.startX = e.clientX - mapState.translateX;
    mapState.startY = e.clientY - mapState.translateY;
  } else if (e.type === 'touchstart') {
    mapState.startX = e.touches[0].clientX - mapState.translateX;
    mapState.startY = e.touches[0].clientY - mapState.translateY;
  }
}

function handleDragMove(e) {
  if (!mapState.isDragging || !mapCanvas) return;
  e.preventDefault();

  let clientX, clientY;
  if (e.type === 'mousemove') {
    clientX = e.clientX;
    clientY = e.clientY;
  } else if (e.type === 'touchmove') {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }

  // INFINITE PANNING – no boundaries at all!
  mapState.translateX = clientX - mapState.startX;
  mapState.translateY = clientY - mapState.startY;

  updateMapTransform();

  // Generate tiles/chargers as user pans
  if (mapState.zoom < 0.5) {
    updateMapBackground();
  }
}

function handleDragEnd(e) {
  if (!mapCanvas) return;
  mapState.isDragging = false;
  mapCanvas.classList.remove('dragging');
}

// ============================================================
// Mouse Wheel Zoom (smooth, no CSS transition – uses rAF)
// ============================================================
let wheelRAF = null;

function handleWheel(e) {
  if (!mapCanvas) return;
  e.preventDefault();

  // Cancel any pending CSS transition from button zoom
  mapCanvas.classList.remove('smooth-zoom');

  const oldZoom = mapState.zoom;

  if (e.deltaY < 0) {
    mapState.zoom = Math.min(mapState.zoom * 1.08, mapState.maxZoom);
  } else {
    mapState.zoom = Math.max(mapState.zoom / 1.08, mapState.minZoom);
  }

  // Zoom toward mouse pointer for natural feel
  const rect = mapCanvas.parentElement.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Distance from center of container (which aligns with transform-origin 50% 50%)
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;

  const zoomRatio = mapState.zoom / oldZoom;
  mapState.translateX = dx - (dx - mapState.translateX) * zoomRatio;
  mapState.translateY = dy - (dy - mapState.translateY) * zoomRatio;

  // Use requestAnimationFrame for smooth rendering
  if (wheelRAF) cancelAnimationFrame(wheelRAF);
  wheelRAF = requestAnimationFrame(() => {
    updateMapTransform();
    onZoomChanged();
    wheelRAF = null;
  });
}

// ============================================================
// Pinch-to-Zoom (Touch)
// ============================================================
let lastTouchDistance = 0;

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function handleTouchStart(e) {
  if (e.touches.length === 2) {
    // Pinch gesture start
    lastTouchDistance = getTouchDistance(e.touches);
    mapState.isDragging = false;
    mapCanvas.classList.remove('dragging');
  } else if (e.touches.length === 1) {
    handleDragStart(e);
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    const newDist = getTouchDistance(e.touches);
    if (lastTouchDistance > 0) {
      const scale = newDist / lastTouchDistance;
      const oldZoom = mapState.zoom;
      mapState.zoom = Math.max(mapState.minZoom, Math.min(mapState.maxZoom, mapState.zoom * scale));

      // Zoom toward pinch center
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = mapCanvas.parentElement.getBoundingClientRect();
      const mx = centerX - rect.left;
      const my = centerY - rect.top;

      const screenCenterX = rect.width / 2;
      const screenCenterY = rect.height / 2;
      const dx = mx - screenCenterX;
      const dy = my - screenCenterY;

      const zoomRatio = mapState.zoom / oldZoom;
      mapState.translateX = dx - (dx - mapState.translateX) * zoomRatio;
      mapState.translateY = dy - (dy - mapState.translateY) * zoomRatio;

      onZoomChanged();
      updateMapTransform();
    }
    lastTouchDistance = newDist;
  } else if (e.touches.length === 1) {
    handleDragMove(e);
  }
}

function handleTouchEnd(e) {
  if (e.touches.length < 2) {
    lastTouchDistance = 0;
  }
  if (e.touches.length === 0) {
    handleDragEnd(e);
  }
}

// ============================================================
// Event Listeners
// ============================================================
if (mapCanvas) {
  // Mouse events
  mapCanvas.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);

  // Touch events (with pinch-to-zoom)
  mapCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  mapCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  mapCanvas.addEventListener('touchend', handleTouchEnd);

  // Mouse wheel zoom
  mapCanvas.addEventListener('wheel', handleWheel, { passive: false });
}

// Prevent text selection while dragging
document.addEventListener('selectstart', (e) => {
  if (mapState.isDragging) {
    e.preventDefault();
  }
});

// ============================================================
// Initialize
// ============================================================
function initMap() {
  updateMapTransform();

  // Pre-generate some chargers outside the initial viewport
  setTimeout(() => {
    generateDynamicChargers(0.7);
    generateMapTiles();
  }, 500);

  // Watch charger preview to adjust controls positioning
  setupPreviewObserver();
}

function setupPreviewObserver() {
  const preview = document.getElementById('charger-preview');
  const zoomControls = document.querySelector('.zoom-controls');
  const mapLegend = document.querySelector('.map-legend');

  if (!preview) return;

  const togglePreviewActive = (isActive) => {
    if (zoomControls) {
      zoomControls.classList.toggle('preview-active', isActive);
    }
    if (mapLegend) {
      mapLegend.classList.toggle('preview-active', isActive);
    }
  };

  // Observe class changes on charger-preview
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        togglePreviewActive(preview.classList.contains('active'));
      }
    }
  });

  observer.observe(preview, { attributes: true, attributeFilter: ['class'] });

  // Set initial state
  togglePreviewActive(preview.classList.contains('active'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
