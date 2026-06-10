/* ============================================
   AIR QUALITY ANALYSIS & PREDICTION
   Interactive Website - JavaScript
   ============================================ */

// ============================================
// Initialize on Document Ready
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    initializeAQIPredictor();
    initializeScrollAnimations();
    initializeMobileMenu();
});

// ============================================
// Navigation & Scroll Functions
// ============================================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
            closeMenuOnMobile();
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

function closeMenuOnMobile() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// ============================================
// Chart Rendering Functions
// ============================================
function initializeCharts() {
    renderAQIDistributionChart();
    renderMonthlyTrendChart();
}

function renderAQIDistributionChart() {
    const canvas = document.getElementById('aqi-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight || 200;
    
    canvas.width = width;
    canvas.height = height;
    
    // Data for AQI distribution
    const data = [5, 12, 25, 35, 42, 50, 48, 45, 38, 28, 15, 8];
    const maxValue = Math.max(...data);
    const barWidth = width / (data.length + 1);
    
    // Draw bars
    ctx.fillStyle = 'rgba(46, 125, 50, 0.7)';
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - 40);
        const x = barWidth * (index + 0.5) - barWidth / 4;
        const y = height - barHeight - 20;
        
        ctx.fillRect(x, y, barWidth / 2, barHeight);
    });
    
    // Draw axis
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(width, height - 20);
    ctx.stroke();
}

function renderMonthlyTrendChart() {
    const canvas = document.getElementById('monthly-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight || 200;
    
    canvas.width = width;
    canvas.height = height;
    
    // Monthly AQI data (12 months)
    const monthlyData = [75, 78, 72, 68, 62, 55, 58, 64, 70, 76, 82, 79];
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const pointSpacing = chartWidth / (monthlyData.length - 1);
    
    const maxValue = Math.max(...monthlyData);
    const minValue = Math.min(...monthlyData);
    const valueRange = maxValue - minValue + 10;
    
    // Draw line chart
    ctx.strokeStyle = 'rgba(46, 125, 50, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    monthlyData.forEach((value, index) => {
        const x = padding + index * pointSpacing;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = 'rgba(46, 125, 50, 1)';
    monthlyData.forEach((value, index) => {
        const x = padding + index * pointSpacing;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

// ============================================
// AQI Predictor Functions
// ============================================
function initializeAQIPredictor() {
    const form = document.getElementById('aqi-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            predictAQI();
        });
        
        // Set initial prediction
        predictAQI();
    }
}

function predictAQI() {
    // Get input values
    const pm25 = parseFloat(document.getElementById('pm25').value) || 0;
    const pm10 = parseFloat(document.getElementById('pm10').value) || 0;
    const no2 = parseFloat(document.getElementById('no2').value) || 0;
    const so2 = parseFloat(document.getElementById('so2').value) || 0;
    const co = parseFloat(document.getElementById('co').value) || 0;
    const o3 = parseFloat(document.getElementById('o3').value) || 0;
    const traffic = parseFloat(document.getElementById('traffic').value) || 0;
    const vehicles = parseFloat(document.getElementById('vehicles').value) || 0;
    const speed = parseFloat(document.getElementById('speed').value) || 0;
    
    // Linear Regression Model Coefficients (Demo)
    // Approximate weights based on feature importance
    let aqi = 0;
    aqi += (pm25 / 300) * 35;      // PM2.5 weight
    aqi += (pm10 / 500) * 25;      // PM10 weight
    aqi += (no2 / 200) * 15;       // NO2 weight
    aqi += (so2 / 100) * 8;        // SO2 weight
    aqi += (co / 10) * 5;          // CO weight
    aqi += (o3 / 200) * 6;         // O3 weight
    aqi += (traffic / 5000) * 4;   // Traffic volume weight
    aqi += (vehicles / 2000) * 2;  // Vehicle count weight
    aqi += (100 - speed) / 5;      // Speed inverse (lower speed = higher pollution)
    
    // Add base value and random small variation for realism
    aqi += 15;
    
    // Normalize to 0-500 scale
    aqi = Math.max(0, Math.min(500, aqi));
    
    // Round to 1 decimal
    aqi = Math.round(aqi * 10) / 10;
    
    // Display result
    displayAQIResult(aqi);
}

function displayAQIResult(aqi) {
    const resultContainer = document.getElementById('result-container');
    const agiValue = document.getElementById('aqi-value');
    const aqiCategory = document.getElementById('aqi-category');
    
    // Determine category
    let category = '';
    let categoryClass = '';
    
    if (aqi <= 50) {
        category = 'Good';
        categoryClass = 'good';
    } else if (aqi <= 100) {
        category = 'Satisfactory';
        categoryClass = 'satisfactory';
    } else if (aqi <= 200) {
        category = 'Moderate';
        categoryClass = 'moderate';
    } else if (aqi <= 300) {
        category = 'Poor';
        categoryClass = 'poor';
    } else if (aqi <= 400) {
        category = 'Very Poor';
        categoryClass = 'very-poor';
    } else {
        category = 'Severe';
        categoryClass = 'severe';
    }
    
    // Update display
    agiValue.textContent = aqi.toFixed(1);
    aqiCategory.textContent = category;
    aqiCategory.className = `aqi-category ${categoryClass}`;
    
    // Show result container
    resultContainer.classList.remove('result-hidden');
    resultContainer.classList.add('result-visible');
}

// ============================================
// Scroll Animation Triggers
// ============================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe animate-on-scroll elements
    document.querySelectorAll('.problem-card, .objective-card, .eda-card, .model-card, .result-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Utility Functions
// ============================================
function getAQIColor(aqi) {
    if (aqi <= 50) return '#4caf50';        // Good - Green
    if (aqi <= 100) return '#ffc107';       // Satisfactory - Yellow
    if (aqi <= 200) return '#ff9800';       // Moderate - Orange
    if (aqi <= 300) return '#ff5722';       // Poor - Red-Orange
    if (aqi <= 400) return '#f44336';       // Very Poor - Red
    return '#b71c1c';                       // Severe - Dark Red
}

function getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 200) return 'Moderate';
    if (aqi <= 300) return 'Poor';
    if (aqi <= 400) return 'Very Poor';
    return 'Severe';
}

// ============================================
// Counter Animation (for stats if needed)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ============================================
// Form Validation
// ============================================
function validateAQIForm() {
    const inputs = document.querySelectorAll('#aqi-form input');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0) {
            input.style.borderColor = '#f44336';
            isValid = false;
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    return isValid;
}

// ============================================
// Dark Mode Toggle (Optional)
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// ============================================
// Export Functions (for future use)
// ============================================
function exportPredictionAsCSV() {
    const pm25 = document.getElementById('pm25').value;
    const pm10 = document.getElementById('pm10').value;
    const no2 = document.getElementById('no2').value;
    const so2 = document.getElementById('so2').value;
    const co = document.getElementById('co').value;
    const o3 = document.getElementById('o3').value;
    const traffic = document.getElementById('traffic').value;
    const vehicles = document.getElementById('vehicles').value;
    const speed = document.getElementById('speed').value;
    const aqi = document.getElementById('aqi-value').textContent;
    
    const csv = `PM2.5,PM10,NO2,SO2,CO,O3,Traffic Volume,Vehicle Count,Average Speed,Predicted AQI\n${pm25},${pm10},${no2},${so2},${co},${o3},${traffic},${vehicles},${speed},${aqi}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aqi_prediction_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ============================================
// Print Prediction Report
// ============================================
function printPredictionReport() {
    const pm25 = document.getElementById('pm25').value;
    const pm10 = document.getElementById('pm10').value;
    const no2 = document.getElementById('no2').value;
    const so2 = document.getElementById('so2').value;
    const co = document.getElementById('co').value;
    const o3 = document.getElementById('o3').value;
    const traffic = document.getElementById('traffic').value;
    const vehicles = document.getElementById('vehicles').value;
    const speed = document.getElementById('speed').value;
    const aqi = document.getElementById('aqi-value').textContent;
    const category = document.getElementById('aqi-category').textContent;
    
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>AQI Prediction Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #2e7d32; }
                    .section { margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #2e7d32; color: white; }
                    .result { font-size: 24px; color: #2e7d32; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>AQI Prediction Report</h1>
                <div class="section">
                    <h2>Input Parameters</h2>
                    <table>
                        <tr><th>Parameter</th><th>Value</th></tr>
                        <tr><td>PM2.5</td><td>${pm25} µg/m³</td></tr>
                        <tr><td>PM10</td><td>${pm10} µg/m³</td></tr>
                        <tr><td>NO2</td><td>${no2} ppb</td></tr>
                        <tr><td>SO2</td><td>${so2} ppb</td></tr>
                        <tr><td>CO</td><td>${co} ppm</td></tr>
                        <tr><td>O3</td><td>${o3} ppb</td></tr>
                        <tr><td>Traffic Volume</td><td>${traffic} vehicles/hour</td></tr>
                        <tr><td>Vehicle Count</td><td>${vehicles} thousands</td></tr>
                        <tr><td>Average Speed</td><td>${speed} km/h</td></tr>
                    </table>
                </div>
                <div class="section">
                    <h2>Prediction Result</h2>
                    <p class="result">Predicted AQI: ${aqi}</p>
                    <p class="result">Category: ${category}</p>
                </div>
                <div class="section">
                    <p><small>Generated on ${new Date().toLocaleString()}</small></p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ============================================
// Handle Dynamic Input Changes
// ============================================
document.addEventListener('input', function(e) {
    if (e.target.matches('#aqi-form input')) {
        // Auto-update prediction as user types
        predictAQI();
    }
});

// ============================================
// Sticky Navbar on Scroll
// ============================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-md)';
    }
});

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMenuOnMobile();
    }
});

// ============================================
// Performance Optimization: Lazy Load Images
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Console Welcome Message
// ============================================
console.log('%c🌍 Air Quality Analysis & Prediction', 'color: #2e7d32; font-size: 18px; font-weight: bold;');
console.log('%cWelcome to our data analytics project showcase!', 'color: #1976d2; font-size: 14px;');
console.log('%cExplore the interactive AQI predictor and learn about our methodology.', 'color: #666; font-size: 12px;');
