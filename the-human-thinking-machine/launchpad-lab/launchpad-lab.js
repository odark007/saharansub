/**
 * Launchpad Lab - Page-specific JavaScript
 * Additional functionality for the Launchpad Lab page
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Hero Text Slider ---
    const sliderTexts = document.querySelectorAll('.slider-text');
    let currentSlide = 0;
    
    function showNextSlide() {
        // Hide current slide
        sliderTexts[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % sliderTexts.length;
        
        // Show next slide
        sliderTexts[currentSlide].classList.add('active');
    }
    
    // Start slider if elements exist
    if (sliderTexts.length > 0) {
        // Change slide every 4 seconds
        setInterval(showNextSlide, 4000);
    }
    
    // --- Learning Journey Timeline Animation ---
    const milestones = document.querySelectorAll('.journey-milestone');
    
    // Intersection Observer for milestone animations
    const milestoneObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate-milestone');
                }, index * 100);
                
                milestoneObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    milestones.forEach(milestone => {
        milestoneObserver.observe(milestone);
    });
    
    // --- Program Track Cards Hover Effects ---
    const trackCards = document.querySelectorAll('.track-card');
    
    trackCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add hover class to trigger additional effects
            this.classList.add('track-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove hover class
            this.classList.remove('track-hovered');
        });
    });
    
    // --- Background Scroll Container Touch Support ---
    const backgroundScrollContainer = document.querySelector('.background-scroll-container');
    
    if (backgroundScrollContainer) {
        let isScrolling = false;
        let startX, scrollLeft;
        
        // Mouse events for desktop
        backgroundScrollContainer.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - backgroundScrollContainer.offsetLeft;
            scrollLeft = backgroundScrollContainer.scrollLeft;
            backgroundScrollContainer.style.cursor = 'grabbing';
        });
        
        backgroundScrollContainer.addEventListener('mouseleave', () => {
            isScrolling = false;
            backgroundScrollContainer.style.cursor = 'grab';
        });
        
        backgroundScrollContainer.addEventListener('mouseup', () => {
            isScrolling = false;
            backgroundScrollContainer.style.cursor = 'grab';
        });
        
        backgroundScrollContainer.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.pageX - backgroundScrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            backgroundScrollContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        backgroundScrollContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - backgroundScrollContainer.offsetLeft;
            scrollLeft = backgroundScrollContainer.scrollLeft;
        });
        
        backgroundScrollContainer.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - backgroundScrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            backgroundScrollContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial cursor
        backgroundScrollContainer.style.cursor = 'grab';
    }
    
    // --- PDF Download Tracking ---
    const downloadBtn = document.querySelector('.download-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Track download attempt
            console.log('Launchpad Lab curriculum PDF downloaded');
            
            // Add visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-check-circle"></i><span>Download Started!</span>';
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
            
            // Optional: Analytics tracking would go here
            // gtag('event', 'download', { 'event_category': 'PDF', 'event_label': 'Launchpad Lab Curriculum' });
        });
    }
    
    // --- Demo Day Animation Controls ---
    const demoStage = document.querySelector('.demo-day-stage');
    
    if (demoStage) {
        // Pause animations when not visible to save battery
        const demoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-demo');
                } else {
                    entry.target.classList.remove('animate-demo');
                }
            });
        }, { threshold: 0.3 });
        
        demoObserver.observe(demoStage);
    }
    
    // --- Contact Form Enhancement for Launchpad Lab ---
    const programInterestSelect = document.getElementById('program-interest');
    const messageTextarea = document.getElementById('message');
    
    // Auto-populate message based on program selection
    if (programInterestSelect && messageTextarea) {
        programInterestSelect.addEventListener('change', function() {
            const currentMessage = messageTextarea.value;
            const selectedTrack = this.options[this.selectedIndex].text;
            
            // Only auto-populate if message is empty
            if (!currentMessage.trim()) {
                let suggestedMessage = '';
                
                switch(this.value) {
                    case 'individual-coaching':
                        suggestedMessage = "Hi! I'm interested in Individual Innovation Coaching for my child. We'd like to explore a personalized approach to learning entrepreneurship and building projects.";
                        break;
                    case 'startup-teams':
                        suggestedMessage = "Hi! I'd like to learn more about the Startup Teams track. My child would benefit from collaborative project development and team dynamics experience.";
                        break;
                    case 'bootcamp-cohorts':
                        suggestedMessage = "Hi! We're interested in the Bootcamp Cohorts program. When is the next structured 8-12 week program starting?";
                        break;
                    case 'not-sure':
                        suggestedMessage = "Hi! I'm interested in Launchpad Lab for my child but I'm not sure which track would be the best fit. Could we schedule a consultation to discuss their interests and goals?";
                        break;
                }
                
                if (suggestedMessage) {
                    messageTextarea.value = suggestedMessage;
                    // Add slight animation to draw attention
                    messageTextarea.style.borderColor = 'var(--accent-green)';
                    setTimeout(() => {
                        messageTextarea.style.borderColor = '';
                    }, 2000);
                }
            }
        });
    }
    
    // --- Smooth Scroll with Offset for Fixed Navigation ---
    const subNavLinks = document.querySelectorAll('.sub-nav a[href^="#"]');
    
    subNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.main-header').offsetHeight + 
                                document.querySelector('.sub-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // --- Enhanced Stats Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const finalValue = statElement.textContent;
                
                // Only animate numbers
                if (!isNaN(finalValue.replace(/[^0-9]/g, ''))) {
                    animateNumber(statElement, finalValue);
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateNumber(element, finalValue) {
        const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        const suffix = finalValue.replace(/[0-9]/g, '');
        const duration = 2000;
        const increment = numericValue / (duration / 50);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 50);
    }
    
    // --- Accessibility Enhancements ---
    
    // Keyboard navigation for background scroll container
    if (backgroundScrollContainer) {
        backgroundScrollContainer.addEventListener('keydown', (e) => {
            const scrollAmount = 300;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    backgroundScrollContainer.scrollLeft -= scrollAmount;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    backgroundScrollContainer.scrollLeft += scrollAmount;
                    break;
            }
        });
        
        // Make scrollable container focusable
        backgroundScrollContainer.tabIndex = 0;
        backgroundScrollContainer.setAttribute('aria-label', 'Scroll through background experience images');
    }
    
    // Add ARIA labels to animated elements
    if (demoStage) {
        demoStage.setAttribute('aria-label', 'Demo Day presentation visualization');
    }
    
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable auto-slider
        const sliderInterval = setInterval(() => {}, 0);
        clearInterval(sliderInterval);
        
        // Add class to disable animations
        document.body.classList.add('reduce-motion');
    }
    
    console.log('Launchpad Lab page initialized successfully');
});