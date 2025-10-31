/**
 * NFL Flag Referee Guide - Phase 1
 * Basic initialization and spinner control
 */

// Hide loading spinner once page loads
window.addEventListener('DOMContentLoaded', function() {
    const spinner = document.getElementById('loading-spinner');
    
    // Hide spinner after a short delay
    setTimeout(function() {
        spinner.classList.add('hidden');
    }, 500);
});

// Start button functionality
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            // Placeholder for Phase 2 - will navigate to first content page
            alert('Phase 2 will add content page navigation. Cover page is working!');
        });
    }
});