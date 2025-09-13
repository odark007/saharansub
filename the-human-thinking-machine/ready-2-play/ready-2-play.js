        // Ready 2 Play - Complete JavaScript Implementation
        document.addEventListener('DOMContentLoaded', function() {
            
            // --- Header & Navigation Management ---
            const mainHeader = document.querySelector('.main-header');
            const subNav = document.getElementById('sub-nav');
            const subNavLinks = document.querySelectorAll('.sub-nav a');
            let lastScrollTop = 0;

            // Sticky & Hide-on-Scroll Logic
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (mainHeader) {
                    if (scrollTop > lastScrollTop && scrollTop > mainHeader.offsetHeight) {
                        mainHeader.classList.add('hidden');
                    } else {
                        mainHeader.classList.remove('hidden');
                    }
                }
                
                if (subNav && getComputedStyle(subNav).display !== 'none') {
                    if (scrollTop > mainHeader.offsetHeight) {
                        subNav.classList.add('sticky-top');
                    } else {
                        subNav.classList.remove('sticky-top');
                    }
                }

                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                activateSubNavOnScroll();
            });

            // Sub-Navigation Scrollspy
            const sections = Array.from(document.querySelectorAll('.sub-nav a[href^="#"]'))
                              .map(link => document.querySelector(link.getAttribute('href')))
                              .filter(Boolean);
                              
            function activateSubNavOnScroll() {
                let currentSectionId = '';
                const offset = (subNav.classList.contains('sticky-top') ? 0 : mainHeader.offsetHeight) + subNav.offsetHeight + 20;

                sections.forEach(section => {
                    if (window.scrollY >= section.offsetTop - offset) {
                        currentSectionId = section.id;
                    }
                });
                
                subNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
                });
            }

            // --- Mobile Navigation ---
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            const mobileNav = document.getElementById('mobile-nav');
            const mobileNavClose = document.querySelector('.mobile-nav-close');
            
            if (mobileToggle && mobileNav && mobileNavClose) {
                function populateMenus() {
                    const desktopMainMenu = document.querySelector('.main-navmenu-desktop ul');
                    const subMenu = document.querySelector('.sub-nav ul');
                    const mobileMainMenuContainer = document.querySelector('.mobile-main-menu');
                    const mobileSubMenuContainer = document.querySelector('.mobile-sub-menu');

                    if(desktopMainMenu) mobileMainMenuContainer.innerHTML = desktopMainMenu.innerHTML;
                    if(subMenu) mobileSubMenuContainer.innerHTML = subMenu.innerHTML;
                }
                populateMenus();

                const openMenu = () => {
                    mobileNav.classList.add('active');
                    document.body.classList.add('mobile-menu-open');
                };
                const closeMenu = () => {
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('mobile-menu-open');
                };

                mobileToggle.addEventListener('click', openMenu);
                mobileNavClose.addEventListener('click', closeMenu);
                mobileNav.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') closeMenu();
                });
            }

            // --- Hero Video Management ---
            const heroVideo = document.getElementById('hero-video');
            
            if (heroVideo) {
                // Load video after critical content
                setTimeout(() => {
                    heroVideo.addEventListener('loadeddata', () => {
                        heroVideo.classList.add('loaded');
                        // Auto-play with user interaction check
                        const playPromise = heroVideo.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('Auto-play prevented:', error);
                                // Show play button or handle gracefully
                            });
                        }
                    });
                }, 1000);

                // Pause video when not in viewport for performance
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            heroVideo.play().catch(e => console.log('Play prevented'));
                        } else {
                            heroVideo.pause();
                        }
                    });
                }, { threshold: 0.25 });
                
                videoObserver.observe(heroVideo);
            }

            // --- Phone Number Validation and Counter ---
            const phoneInput = document.getElementById('phone_number');
            const phoneCounter = document.getElementById('phone-counter');

            if (phoneInput && phoneCounter) {
                phoneInput.addEventListener('input', function(e) {
                    const sanitizedValue = phoneInput.value.replace(/[^0-9]/g, '');
                    if (phoneInput.value !== sanitizedValue) {
                        phoneInput.value = sanitizedValue;
                    }

                    const digitCount = phoneInput.value.length;
                    if (digitCount > 0) {
                        phoneCounter.textContent = `(${digitCount} digits)`;
                    } else {
                        phoneCounter.textContent = '';
                    }
                });
            }

            // --- Email Validation ---
            const emailInput = document.getElementById('email_address');

            if (emailInput) {
                const validateEmail = (email) => {
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(String(email).toLowerCase());
                };

                const handleValidation = () => {
                    const emailValue = emailInput.value;

                    if (emailValue === '') {
                        emailInput.classList.remove('is-valid', 'is-invalid');
                        return;
                    }

                    if (validateEmail(emailValue)) {
                        emailInput.classList.add('is-valid');
                        emailInput.classList.remove('is-invalid');
                    } else {
                        emailInput.classList.add('is-invalid');
                        emailInput.classList.remove('is-valid');
                    }
                };

                emailInput.addEventListener('input', handleValidation);
                emailInput.addEventListener('blur', handleValidation);
            }

            // --- Form Auto-Population Logic ---
            const ageSelect = document.getElementById('student-age');
            const programSelect = document.getElementById('program-interest');
            const groupSelect = document.getElementById('group-preference');
            const messageTextarea = document.getElementById('message');

            function updateMessageSuggestion() {
                if (!messageTextarea || messageTextarea.value.trim()) return;
                
                const age = ageSelect?.value || '';
                const program = programSelect?.value || '';
                const group = groupSelect?.value || '';
                
                let suggestion = '';
                
                if (age && program) {
                    const ageText = ageSelect.options[ageSelect.selectedIndex]?.text || 'my child';
                    const programText = programSelect.options[programSelect.selectedIndex]?.text || 'Ready 2 Play';
                    
                    suggestion = `Hi! I'm interested in ${programText.toLowerCase()} for ${ageText.toLowerCase()}. I'd love to learn more about how Ready 2 Play can help build confidence, fitness, and character through outdoor activities.`;
                    
                    messageTextarea.value = suggestion;
                    messageTextarea.style.borderColor = 'var(--sport-energy)';
                    setTimeout(() => {
                        messageTextarea.style.borderColor = '';
                    }, 2000);
                }
            }
            
            if (ageSelect) ageSelect.addEventListener('change', updateMessageSuggestion);
            if (programSelect) programSelect.addEventListener('change', updateMessageSuggestion);

            // --- Video Player Management ---
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

            // --- Gallery Interactions ---
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const imageNumber = this.dataset.image;
                    console.log(`Gallery image ${imageNumber} clicked`);
                    // Could implement lightbox modal here
                });
            });

            // --- Enhanced Contact Form with Supabase ---
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                
                const CONFIG = {
                    supabase: {
                        url: 'https://dgyditllryrphjijvzfu.supabase.co',
                        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneWRpdGxscnlycGhqaWp2emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjM2MzIsImV4cCI6MjA3MjkzOTYzMn0.a8IIljpmIj6mUhE46Qws1x0zHKvLPmT7bBKP2TL-l6k'
                    },
                    emailjs: {
                        publicKey: 'B07gMSHiApMJRrJGj',
                        serviceId: 'service_d8jbfmc',
                        templateId: 'template_fhqt87w'
                    },
                    retryConfig: {
                        maxAttempts: 3,
                        baseDelay: 1000,
                        maxDelay: 5000
                    }
                };

                const supabase = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

                const isEmailJSConfigured = CONFIG.emailjs.publicKey && CONFIG.emailjs.serviceId && CONFIG.emailjs.templateId;
                if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
                    emailjs.init(CONFIG.emailjs.publicKey);
                }

                function getRetryDelay(attempt) {
                    const delay = Math.min(
                        CONFIG.retryConfig.baseDelay * Math.pow(2, attempt - 1),
                        CONFIG.retryConfig.maxDelay
                    );
                    return delay + Math.random() * 1000;
                }

                function sanitizePhoneNumber(phone) {
                    if (!phone) return phone;
                    return phone.replace(/\s+/g, '');
                }

                function prepareFormData(formData) {
                    return {
                        parent_name: formData.get('parent-name') || '',
                        email_address: formData.get('email_address') || '',
                        phone_number: sanitizePhoneNumber(formData.get('phone_number')),
                        student_name: formData.get('student-name') || null,
                        student_age: formData.get('student-age') || '',
                        program_interest: formData.get('program-interest') || '',
                        group_preference: formData.get('group-preference') || '',
                        activity_level: formData.get('activity-level') || '',
                        schedule_preference: formData.get('schedule-preference') || '',
                        physical_considerations: formData.get('physical-considerations') || null,
                        message: formData.get('message') || null,
                        program_type: 'ready-2-play'
                    };
                }

                async function submitToSupabase(inquiryData, attempt = 1) {
                    try {
                        const { data, error } = await supabase
                            .from('ready2play_inquiries')
                            .insert([inquiryData]);

                        if (error) {
                            throw new Error(`Supabase error: ${error.message}`);
                        }

                        console.log('Supabase submission successful:', data);
                        return { success: true, data };

                    } catch (error) {
                        console.error(`Supabase attempt ${attempt} failed:`, error.message);

                        if (attempt < CONFIG.retryConfig.maxAttempts) {
                            const delay = getRetryDelay(attempt);
                            console.log(`Retrying Supabase submission in ${delay}ms...`);
                            
                            await new Promise(resolve => setTimeout(resolve, delay));
                            return submitToSupabase(inquiryData, attempt + 1);
                        }

                        throw error;
                    }
                }

                async function sendEmailNotification(inquiryData) {
                    if (!isEmailJSConfigured || typeof emailjs === 'undefined') {
                        console.log('EmailJS not configured, skipping email notification');
                        return { success: false, reason: 'not_configured' };
                    }

                    try {
                        const emailParams = {
                            to_email: 'gofrance01@gmail.com',
                            from_name: inquiryData.parent_name,
                            from_email: inquiryData.email_address,
                            subject: `New Ready 2 Play Inquiry: ${inquiryData.program_interest}`,
                            parent_name: inquiryData.parent_name,
                            email_address: inquiryData.email_address,
                            phone_number: inquiryData.phone_number || 'Not provided',
                            student_name: inquiryData.student_name || 'Not provided',
                            student_age: inquiryData.student_age,
                            program_interest: inquiryData.program_interest,
                            group_preference: inquiryData.group_preference,
                            activity_level: inquiryData.activity_level,
                            schedule_preference: inquiryData.schedule_preference,
                            physical_considerations: inquiryData.physical_considerations || 'None mentioned',
                            message: inquiryData.message || 'No additional message',
                            submission_time: new Date().toLocaleString()
                        };

                        const result = await emailjs.send(
                            CONFIG.emailjs.serviceId,
                            CONFIG.emailjs.templateId,
                            emailParams
                        );

                        console.log('Email sent successfully:', result);
                        return { success: true, result };

                    } catch (error) {
                        console.error('EmailJS error:', error);
                        return { success: false, error: error.message };
                    }
                }

                contactForm.addEventListener('submit', async function(e) {
                    e.preventDefault();

                    const successMessage = document.getElementById('form-success-message');
                    const submitButton = contactForm.querySelector('.submit-btn');
                    
                    submitButton.textContent = 'Submitting...';
                    submitButton.disabled = true;
                    successMessage.style.display = 'none';

                    successMessage.style.color = 'var(--accent-green)';
                    successMessage.style.borderColor = 'var(--accent-green)';

                    try {
                        const formData = new FormData(contactForm);
                        const inquiryData = prepareFormData(formData);

                        console.log('Submitting Ready 2 Play inquiry:', inquiryData);

                        const supabaseResult = await submitToSupabase(inquiryData);
                        const emailResult = await sendEmailNotification(inquiryData);
                        
                        if (!emailResult.success) {
                            console.warn('Email notification failed:', emailResult.reason || emailResult.error);
                        }

                        successMessage.textContent = 'Form submitted successfully! Welcome to the Ready 2 Play family - you will be contacted soon.';
                        successMessage.style.display = 'block';
                        submitButton.textContent = 'Submitted!';

                        contactForm.reset();
                        
                        if (emailInput) {
                            emailInput.classList.remove('is-valid', 'is-invalid');
                        }
                        if (phoneCounter) {
                            phoneCounter.textContent = '';
                        }

                        setTimeout(() => {
                            submitButton.textContent = 'Join Ready 2 Play';
                            submitButton.disabled = false;
                            successMessage.style.display = 'none';
                        }, 3000);

                    } catch (error) {
                        console.error('Form submission failed completely:', error.message);
                        
                        successMessage.textContent = 'Submission failed. Please check your connection and try again.';
                        successMessage.style.color = '#c53030';
                        successMessage.style.borderColor = '#c53030';
                        successMessage.style.display = 'block';
                        
                        submitButton.textContent = 'Join Ready 2 Play';
                        submitButton.disabled = false;
                    }
                });
            }

            // --- PDF Download Enhancement ---
            const downloadBtn = document.querySelector('.download-btn');
            
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function(e) {
                    console.log('Ready 2 Play Program Guide PDF downloaded');
                    
                    const originalContent = this.innerHTML;
                    this.innerHTML = '<i class="bi bi-check-circle"></i><span>Download Started!</span>';
                    this.style.background = 'var(--accent-green)';
                    
                    setTimeout(() => {
                        this.innerHTML = originalContent;
                        this.style.background = '';
                    }, 2500);
                });
            }

            // --- Animated Statistics Counter ---
            const statNumbers = document.querySelectorAll('.stat-number');
            
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const numberElement = entry.target;
                        const finalValue = numberElement.textContent;
                        
                        if (finalValue.includes('+')) {
                            animateNumberWithPlus(numberElement, finalValue);
                        } else if (finalValue.includes('%')) {
                            animatePercentage(numberElement, finalValue);
                        } else if (finalValue.includes('min')) {
                            animateTimeValue(numberElement, finalValue);
                        }
                        
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(stat => {
                statsObserver.observe(stat);
            });
            
            function animateNumberWithPlus(element, finalValue) {
                const numericValue = parseInt(finalValue.replace('+', ''));
                let current = 0;
                const duration = 2000;
                const increment = numericValue / (duration / 50);
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        element.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + '+';
                    }
                }, 50);
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
            
            function animateTimeValue(element, finalValue) {
                if (finalValue.includes('min')) {
                    const numericValue = parseInt(finalValue.replace('min', ''));
                    let current = 0;
                    const duration = 1500;
                    const increment = numericValue / (duration / 50);
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericValue) {
                            element.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(current) + 'min';
                        }
                    }, 50);
                }
            }

            // --- Benefit Item Hover Animations ---
            const benefitItems = document.querySelectorAll('.benefit-item');
            
            benefitItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.benefit-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(10deg)';
                        icon.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.4)';
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.benefit-icon');
                    if (icon) {
                        icon.style.transform = '';
                        icon.style.boxShadow = '';
                    }
                });
            });

            // --- Sport Card Interactions ---
            const sportCards = document.querySelectorAll('.sport-card');
            
            sportCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.sport-image i');
                    if (icon) {
                        icon.style.transform = 'scale(1.2)';
                        icon.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.sport-image i');
                    if (icon) {
                        icon.style.transform = '';
                        icon.style.textShadow = '';
                    }
                });
            });

            // --- Horizontal Scroll Touch Support ---
            const scrollWrapper = document.querySelector('.scroll-wrapper');
            
            if (scrollWrapper) {
                let isDown = false;
                let startX;
                let scrollLeft;

                scrollWrapper.addEventListener('mousedown', (e) => {
                    isDown = true;
                    startX = e.pageX - scrollWrapper.offsetLeft;
                    scrollLeft = scrollWrapper.scrollLeft;
                    scrollWrapper.style.cursor = 'grabbing';
                    scrollWrapper.style.animationPlayState = 'paused';
                });

                scrollWrapper.addEventListener('mouseleave', () => {
                    isDown = false;
                    scrollWrapper.style.cursor = 'grab';
                    scrollWrapper.style.animationPlayState = 'running';
                });

                scrollWrapper.addEventListener('mouseup', () => {
                    isDown = false;
                    scrollWrapper.style.cursor = 'grab';
                    scrollWrapper.style.animationPlayState = 'running';
                });

                scrollWrapper.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - scrollWrapper.offsetLeft;
                    const walk = (x - startX) * 2;
                    scrollWrapper.scrollLeft = scrollLeft - walk;
                });

                // Touch events for mobile
                scrollWrapper.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].pageX - scrollWrapper.offsetLeft;
                    scrollLeft = scrollWrapper.scrollLeft;
                    scrollWrapper.style.animationPlayState = 'paused';
                });

                scrollWrapper.addEventListener('touchmove', (e) => {
                    const x = e.touches[0].pageX - scrollWrapper.offsetLeft;
                    const walk = (x - startX) * 2;
                    scrollWrapper.scrollLeft = scrollLeft - walk;
                });

                scrollWrapper.addEventListener('touchend', () => {
                    scrollWrapper.style.animationPlayState = 'running';
                });
            }

            // --- Smooth Scroll for Navigation Links ---
            const navLinks = document.querySelectorAll('a[href^="#"]');
            
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
                    }
                });
            });

            // --- Fade-in Animation Observer ---
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

            // --- Social Media Link Tracking ---
            const socialLinks = document.querySelectorAll('.social-btn, .footer-social a');
            
            socialLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const platform = this.href.includes('tiktok') ? 'TikTok' : 
                                   this.href.includes('instagram') ? 'Instagram' :
                                   this.href.includes('linkedin') ? 'LinkedIn' :
                                   this.href.includes('whatsapp') ? 'WhatsApp' : 'Email';
                    console.log(`Social media click: ${platform}`);
                });
            });

            // --- Performance Optimizations ---
            
            // Lazy load non-critical animations
            const heavyAnimationElements = document.querySelectorAll('.showcase-card, .gallery-item, .sport-card');
            
            const performanceObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-ready');
                    } else {
                        entry.target.classList.remove('animate-ready');
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            heavyAnimationElements.forEach(element => {
                performanceObserver.observe(element);
            });

            // --- Accessibility Enhancements ---
            
            // Add focus styles for keyboard navigation
            const interactiveElements = document.querySelectorAll('.sport-card, .benefit-item, .gallery-item, .showcase-card');
            
            interactiveElements.forEach(element => {
                element.tabIndex = 0;
                
                element.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
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
                const style = document.createElement('style');
                style.textContent = `
                    .reduce-motion * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
                document.body.classList.add('reduce-motion');
            }

            // --- Debug Information ---
            if (window.location.search.includes('debug=true')) {
                console.log('Ready 2 Play page debug mode');
                console.log('Interactive elements:', {
                    benefitItems: benefitItems.length,
                    sportCards: sportCards.length,
                    galleryItems: galleryItems.length,
                    videoThumbnails: videoThumbnails.length,
                    showcaseCards: document.querySelectorAll('.showcase-card').length
                });
                console.log('Hero video element:', heroVideo);
                console.log('Form configuration:', CONFIG);
            }

            console.log('Ready 2 Play website initialized successfully');
        });

        // --- Additional Utility Functions ---
        
        // Function to handle video fallbacks
        function createVideoFallback() {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && !document.getElementById('hero-video')) {
                // If video fails to load, ensure gradient background is visible
                heroSection.style.background = 'var(--gradient-sport)';
            }
        }

        // Call fallback function if video loading fails
        window.addEventListener('error', function(e) {
            if (e.target && e.target.tagName === 'VIDEO') {
                createVideoFallback();
            }
        });

        // Handle window resize for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                // Recalculate any dynamic positioning if needed
                const scrollWrapper = document.querySelector('.scroll-wrapper');
                if (scrollWrapper) {
                    // Reset scroll position on resize
                    scrollWrapper.style.transform = 'translateX(0)';
                }
            }, 250);
        });

        // Track page visibility for video performance
        document.addEventListener('visibilitychange', function() {
            const heroVideo = document.getElementById('hero-video');
            if (heroVideo) {
                if (document.hidden) {
                    heroVideo.pause();
                } else {
                    heroVideo.play().catch(e => console.log('Play prevented'));
                }
            }
        });