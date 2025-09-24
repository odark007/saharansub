/**
 * First Principles Tutor - Page-specific JavaScript
 * Interactive functionality for the tutoring platform
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Hero Equation Animation ---
    const equations = document.querySelectorAll('.equation-line');
    
    // Stagger the equation animations on load
    equations.forEach((equation, index) => {
        equation.style.opacity = '0';
        equation.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            equation.style.transition = 'all 0.8s ease-out';
            equation.style.opacity = '1';
            equation.style.transform = 'translateY(0)';
        }, (index + 1) * 800);
    });
    
    // --- Concept Visualization Interactive Animation ---
    const conceptNodes = document.querySelectorAll('.concept-node');
    const centralNode = document.querySelector('.concept-node.central');
    
    if (conceptNodes.length > 0 && centralNode) {
        // Create connection lines dynamically
        const visualization = document.querySelector('.concept-visualization');
        const connections = document.createElement('div');
        connections.className = 'dynamic-connections';
        connections.style.position = 'absolute';
        connections.style.top = '0';
        connections.style.left = '0';
        connections.style.width = '100%';
        connections.style.height = '100%';
        connections.style.pointerEvents = 'none';
        connections.style.zIndex = '1';
        
        visualization.appendChild(connections);
        
        // Animate connections on scroll
        const conceptObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateConnections();
                    conceptObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        conceptObserver.observe(visualization);
        
        function animateConnections() {
            conceptNodes.forEach((node, index) => {
                if (!node.classList.contains('central')) {
                    setTimeout(() => {
                        node.style.transform = 'scale(1.1)';
                        node.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
                        
                        setTimeout(() => {
                            node.style.transform = '';
                            node.style.boxShadow = '';
                        }, 1000);
                    }, index * 300);
                }
            });
        }
    }
    
    // --- Method Step Animations ---
    const methodSteps = document.querySelectorAll('.method-step');
    
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-milestone');
                }, index * 200);
                stepObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    methodSteps.forEach(step => {
        stepObserver.observe(step);
    });
    
    // --- Animated Number Counters for Outcomes ---
    const metricNumbers = document.querySelectorAll('.metric-value .number');
    
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target;
                const finalValue = numberElement.textContent;
                
                // Check if it's a number we can animate
                if (finalValue.match(/^\d+(-\d+)?$/)) {
                    animateMetricNumber(numberElement, finalValue);
                } else if (finalValue.includes('%')) {
                    animatePercentage(numberElement, finalValue);
                }
                
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    metricNumbers.forEach(metric => {
        metricsObserver.observe(metric);
    });
    
    function animateMetricNumber(element, finalValue) {
        if (finalValue.includes('-')) {
            // Handle range values like "2-3"
            const parts = finalValue.split('-');
            const startNum = parseInt(parts[0]);
            const endNum = parseInt(parts[1]);
            
            let current = 0;
            const duration = 2000;
            const increment = (startNum + endNum) / 2 / (duration / 50);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= startNum) {
                    element.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toString();
                }
            }, 50);
        }
    }
    
    function animatePercentage(element, finalValue) {
        const numericValue = parseInt(finalValue.replace('%', ''));
        let current = 0;
        const duration = 2000;
        const increment = numericValue / (duration / 50);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '%';
            }
        }, 50);
    }
    
    // --- Subject Card Hover Effects ---
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect to the icon
            const icon = this.querySelector('.subject-icon');
            if (icon) {
                icon.style.boxShadow = '0 0 25px rgba(59, 130, 246, 0.6)';
                icon.style.transform = 'scale(1.1)';
            }
            
            // Animate the levels
            const levels = this.querySelectorAll('.level');
            levels.forEach((level, index) => {
                setTimeout(() => {
                    level.style.transform = 'translateY(-2px)';
                    level.style.backgroundColor = 'var(--tutor-primary)';
                    level.style.color = 'var(--neutral-white)';
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset icon
            const icon = this.querySelector('.subject-icon');
            if (icon) {
                icon.style.boxShadow = '';
                icon.style.transform = '';
            }
            
            // Reset levels
            const levels = this.querySelectorAll('.level');
            levels.forEach(level => {
                level.style.transform = '';
                level.style.backgroundColor = '';
                level.style.color = '';
            });
        });
    });
    
    // --- Student Stories Slider Effect ---
    const storyCards = document.querySelectorAll('.story-card');
    
    // Add subtle animation to story cards when they come into view
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }, index * 200);
                storyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    storyCards.forEach(card => {
        // Set initial state
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease-out';
        
        storyObserver.observe(card);
    });
    
    // --- Session Option Interactive Highlights ---
    const sessionOptions = document.querySelectorAll('.session-option');
    
    sessionOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            // Highlight features with staggered animation
            const features = this.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                setTimeout(() => {
                    const checkIcon = feature.querySelector('i');
                    if (checkIcon) {
                        checkIcon.style.transform = 'scale(1.2)';
                        checkIcon.style.color = 'var(--tutor-primary)';
                    }
                }, index * 100);
            });
        });
        
        option.addEventListener('mouseleave', function() {
            // Reset features
            const features = this.querySelectorAll('.feature i');
            features.forEach(icon => {
                icon.style.transform = '';
                icon.style.color = '';
            });
        });
    });
    
    // --- Featured Videos Section ---
    // --- Featured Videos Section ---
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const mainVideoPlayer = document.getElementById('main-video-player');
    const videoLoader = document.getElementById('video-loader');

    if (videoThumbnails.length > 0 && mainVideoPlayer) {
        function switchVideo(videoId, clickedThumbnail) {
            if (videoLoader) videoLoader.classList.remove('hidden');
            
            videoThumbnails.forEach(thumb => thumb.classList.remove('active'));
            clickedThumbnail.classList.add('active');
            
            setTimeout(() => {
                mainVideoPlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
                
                mainVideoPlayer.onload = () => {
                    setTimeout(() => {
                        if (videoLoader) videoLoader.classList.add('hidden');
                    }, 500);
                };
            }, 800);
            
            console.log(`Switched to video: ${videoId}`);
        }
        
        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const videoId = this.dataset.videoId;
                if (videoId) {
                    switchVideo(videoId, this);
                }
            });
            
            thumbnail.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            thumbnail.tabIndex = 0;
        });
        
        setTimeout(() => {
            if (videoLoader) videoLoader.classList.add('hidden');
        }, 1000);
    }    
    // --- Enhanced Contact Form for Tutoring ---
    const subjectsSelect = document.getElementById('subjects-needed');
    const sessionPreferenceSelect = document.getElementById('session-preference');
    const currentChallengesTextarea = document.getElementById('current-challenges');
    const messageTextarea = document.getElementById('message');
    
    // Auto-populate message based on form selections
    function updateMessageSuggestion() {
        if (!messageTextarea || messageTextarea.value.trim()) return;
        
        const subject = subjectsSelect?.value || '';
        const session = sessionPreferenceSelect?.value || '';
        
        let suggestion = '';
        
        if (subject && session) {
            const subjectName = subjectsSelect.options[subjectsSelect.selectedIndex]?.text || 'this subject';
            const sessionName = sessionPreferenceSelect.options[sessionPreferenceSelect.selectedIndex]?.text || 'tutoring';
            
            suggestion = `Hi! I'm interested in ${sessionName.toLowerCase()} for ${subjectName.toLowerCase()}. I'd like to learn more about your first principles approach and how it can help improve understanding and academic performance.`;
            
            messageTextarea.value = suggestion;
            messageTextarea.style.borderColor = 'var(--tutor-accent)';
            setTimeout(() => {
                messageTextarea.style.borderColor = '';
            }, 2000);
        }
    }
    
    if (subjectsSelect) {
        subjectsSelect.addEventListener('change', updateMessageSuggestion);
    }
    
    if (sessionPreferenceSelect) {
        sessionPreferenceSelect.addEventListener('change', updateMessageSuggestion);
    }
    
    // --- PDF Download Enhancement ---
    const downloadBtn = document.querySelector('.download-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            console.log('First Principles Learning Guide PDF downloaded');
            
            // Visual feedback
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="bi bi-check-circle"></i><span>Download Started!</span>';
            this.style.background = 'var(--tutor-accent)';
            
            // Reset after delay
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.style.background = '';
            }, 2500);
        });
    }
    
    // --- Particle System for Hero Background ---
    function createParticleSystem() {
        const heroBackground = document.querySelector('.hero-particles');
        if (!heroBackground) return;
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(255, 255, 255, ' + (Math.random() * 0.3 + 0.1) + ')';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `floatParticle ${Math.random() * 10 + 15}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 10 + 's';
            
            heroBackground.appendChild(particle);
        }
    }
    
    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(30px, -20px) rotate(90deg); }
            50% { transform: translate(-20px, -30px) rotate(180deg); }
            75% { transform: translate(-30px, 20px) rotate(270deg); }
        }
    `;
    document.head.appendChild(style);
    
    createParticleSystem();

    
    // --- Smooth Scroll Enhancement ---
    const navLinks = document.querySelectorAll('.sub-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70;
                const subNavHeight = document.querySelector('.sub-nav')?.offsetHeight || 60;
                const offset = headerHeight + subNavHeight + 20;
                
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav state
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    
    // --- Accessibility Enhancements ---
    
    // Keyboard navigation for interactive elements
    const interactiveCards = document.querySelectorAll('.subject-card, .session-option, .story-card');
    
    interactiveCards.forEach(card => {
        // Make focusable
        card.tabIndex = 0;
        
        // Keyboard interaction
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Trigger hover effect
                this.dispatchEvent(new Event('mouseenter'));
                
                setTimeout(() => {
                    this.dispatchEvent(new Event('mouseleave'));
                }, 2000);
            }
        });
    });
    
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable complex animations
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
        
        // Add reduced motion class
        document.body.classList.add('reduce-motion');
        
        // Simpler transitions only
        const style = document.createElement('style');
        style.textContent = `
            .reduce-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // --- Performance Optimizations ---
    
    // Lazy load heavy animations only when needed
    const heavyAnimationTriggers = document.querySelectorAll('.concept-visualization, .method-steps');
    
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only start expensive animations when element is visible
                entry.target.classList.add('animate-ready');
            } else {
                // Pause animations when out of view
                entry.target.classList.remove('animate-ready');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    heavyAnimationTriggers.forEach(trigger => {
        performanceObserver.observe(trigger);
    });
    
    // --- Debug Information ---
    if (window.location.search.includes('debug=true')) {
        console.log('First Principles Tutor page debug mode');
        console.log('Interactive elements:', {
            conceptNodes: conceptNodes.length,
            methodSteps: methodSteps.length,
            subjectCards: subjectCards.length,
            sessionOptions: sessionOptions.length,
            storyCards: storyCards.length,
            videoThumbnails: videoThumbnails.length
        });
    }
    
    console.log('First Principles Tutor page initialized successfully');
});