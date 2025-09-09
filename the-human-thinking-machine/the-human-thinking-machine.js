document.addEventListener('DOMContentLoaded', function() {
    
    // --- Header & Navigation Management ---
    const mainHeader = document.querySelector('.main-header');
    const subNav = document.getElementById('sub-nav');
    const subNavLinks = document.querySelectorAll('.sub-nav a');
    let lastScrollTop = 0;

    // Sticky & Hide-on-Scroll Logic
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Hide main header on scroll down, show on scroll up
        if (mainHeader) {
            if (scrollTop > lastScrollTop && scrollTop > mainHeader.offsetHeight) {
                mainHeader.classList.add('hidden');
            } else {
                mainHeader.classList.remove('hidden');
            }
        }
        
        // Add/remove class to sub-nav for sticky behavior
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
    const sections = Array.from(subNavLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
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
    };

    // --- Mobile Navigation Overlay Logic ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    if (mobileToggle && mobileNav && mobileNavClose) {
        // Function to dynamically populate menus
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

    // --- Other Page Interactions ---
    window.openJourneyModal = function() { document.getElementById('journey-modal')?.classList.add('active'); };
    window.closeJourneyModal = function() { document.getElementById('journey-modal')?.classList.remove('active'); };
    document.getElementById('journey-modal')?.addEventListener('click', function(e) { if (e.target === this) closeJourneyModal(); });
    document.addEventListener('keydown', (e) => e.key === "Escape" && closeJourneyModal());

    // --- Phone Number Validation and Counter ---
    const phoneInput = document.getElementById('phone_number');
    const phoneCounter = document.getElementById('phone-counter');

    if (phoneInput && phoneCounter) {
        phoneInput.addEventListener('input', function(e) {
            // 1. Validation: Remove any non-digit characters
            const sanitizedValue = phoneInput.value.replace(/[^0-9]/g, '');
            if (phoneInput.value !== sanitizedValue) {
                phoneInput.value = sanitizedValue;
            }

            // 2. Counter: Update the digit count
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

    // --- ENHANCED: Contact Form Handling with Supabase and EmailJS ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        
        // Configuration - Add your EmailJS credentials here
        const CONFIG = {
            supabase: {
                url: 'https://dgyditllryrphjijvzfu.supabase.co',
                anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneWRpdGxscnlycGhqaWp2emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjM2MzIsImV4cCI6MjA3MjkzOTYzMn0.a8IIljpmIj6mUhE46Qws1x0zHKvLPmT7bBKP2TL-l6k'
            },
            emailjs: {
                publicKey: 'B07gMSHiApMJRrJGj', // Add your EmailJS public key here
                serviceId: 'service_d8jbfmc', // Add your EmailJS service ID here
                templateId: 'template_fhqt87w' // Add your EmailJS template ID here
            },
            retryConfig: {
                maxAttempts: 3,
                baseDelay: 1000, // 1 second
                maxDelay: 5000   // 5 seconds max
            }
        };

        // Initialize Supabase
        const supabase = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

        // Initialize EmailJS (only if credentials are provided)
        const isEmailJSConfigured = CONFIG.emailjs.publicKey && CONFIG.emailjs.serviceId && CONFIG.emailjs.templateId;
        if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.emailjs.publicKey);
        }

        // Utility function for exponential backoff delay
        function getRetryDelay(attempt) {
            const delay = Math.min(
                CONFIG.retryConfig.baseDelay * Math.pow(2, attempt - 1),
                CONFIG.retryConfig.maxDelay
            );
            return delay + Math.random() * 1000; // Add jitter
        }

        // Utility function to sanitize phone number (remove spaces)
        function sanitizePhoneNumber(phone) {
            if (!phone) return phone;
            return phone.replace(/\s+/g, ''); // Remove all whitespace characters
        }

        // Function to extract and prepare form data
        function prepareFormData(formData) {
            return {
                // FIXED: Match HTML form field names exactly
                parent_name: formData.get('parent-name') || '',
                email_address: formData.get('email_address') || '',
                phone_number: sanitizePhoneNumber(formData.get('phone_number')), // Sanitized
                student_name: formData.get('student-name') || null,
                student_age: formData.get('student-age') || '',
                program_interest: formData.get('program-interest') || '',
                learning_preference: formData.get('learning-preference') || '',
                message: formData.get('message') || null
            };
        }

        // Function to submit to Supabase with retry logic
        async function submitToSupabase(inquiryData, attempt = 1) {
            try {
                const { data, error } = await supabase
                    .from('inquiries')
                    .insert([inquiryData]);

                if (error) {
                    throw new Error(`Supabase error: ${error.message}`);
                }

                console.log('Supabase submission successful:', data);
                return { success: true, data };

            } catch (error) {
                console.error(`Supabase attempt ${attempt} failed:`, error.message);

                // Retry logic for network errors or temporary failures
                if (attempt < CONFIG.retryConfig.maxAttempts) {
                    const delay = getRetryDelay(attempt);
                    console.log(`Retrying Supabase submission in ${delay}ms...`);
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return submitToSupabase(inquiryData, attempt + 1);
                }

                // Max attempts reached
                throw error;
            }
        }

        // Function to send email via EmailJS
        async function sendEmailNotification(inquiryData) {
            if (!isEmailJSConfigured || typeof emailjs === 'undefined') {
                console.log('EmailJS not configured or not loaded, skipping email notification');
                return { success: false, reason: 'not_configured' };
            }

            try {
                // Prepare email template parameters
                const emailParams = {
                    to_email: 'gofrance01@gmail.com',
                    from_name: inquiryData.parent_name,
                    from_email: inquiryData.email_address,
                    subject: `New Inquiry: ${inquiryData.program_interest}`,
                    parent_name: inquiryData.parent_name,
                    email_address: inquiryData.email_address,
                    phone_number: inquiryData.phone_number || 'Not provided',
                    student_name: inquiryData.student_name || 'Not provided',
                    student_age: inquiryData.student_age,
                    program_interest: inquiryData.program_interest,
                    learning_preference: inquiryData.learning_preference,
                    message: inquiryData.message || 'No message provided',
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

        // Main form submission handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const successMessage = document.getElementById('form-success-message');
            const submitButton = contactForm.querySelector('.submit-btn');
            
            // UI feedback
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            successMessage.style.display = 'none';

            // Reset message styling
            successMessage.style.color = 'var(--accent-green)';
            successMessage.style.borderColor = 'var(--accent-green)';

            try {
                // Step 1: Prepare form data
                const formData = new FormData(contactForm);
                const inquiryData = prepareFormData(formData);

                console.log('Submitting inquiry data:', inquiryData);

                // Step 2: Submit to Supabase (with retry logic) - THIS MUST SUCCEED
                const supabaseResult = await submitToSupabase(inquiryData);

                // Step 3: Send email notification (best effort, failure won't affect success)
                const emailResult = await sendEmailNotification(inquiryData);
                
                if (!emailResult.success) {
                    console.warn('Email notification failed:', emailResult.reason || emailResult.error);
                }

                // Step 4: Show success message (Supabase succeeded, regardless of email status)
                successMessage.textContent = 'Form submitted successfully! You will be contacted soon.';
                successMessage.style.display = 'block';
                submitButton.textContent = 'Submitted!';

                // Step 5: Reset form immediately
                contactForm.reset();
                
                // Clear validation classes
                if (emailInput) {
                    emailInput.classList.remove('is-valid', 'is-invalid');
                }
                if (phoneCounter) {
                    phoneCounter.textContent = '';
                }

                // Restore button after delay
                setTimeout(() => {
                    submitButton.textContent = 'Send Inquiry';
                    submitButton.disabled = false;
                    successMessage.style.display = 'none';
                }, 3000);

            } catch (error) {
                // Supabase submission failed after all retries
                console.error('Form submission failed completely:', error.message);
                
                successMessage.textContent = 'Submission failed. Please check your connection and try again.';
                successMessage.style.color = '#c53030';
                successMessage.style.borderColor = '#c53030';
                successMessage.style.display = 'block';
                
                submitButton.textContent = 'Send Inquiry';
                submitButton.disabled = false;
            }
        });
    }

    // Fade-in Animation on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});