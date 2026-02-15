/**
 * Saharansub E-Mobility - Special Offer Interactions
 * File: special-offer-interactions.js
 * Purpose: FAQ accordion, contact link handlers, and interactive page elements
 */

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // ========================================
  // FAQ ACCORDION FUNCTIONALITY
  // ========================================

  /**
   * Initialize FAQ accordion with smooth expand/collapse
   */
  const initFAQAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) {
      return; // Exit if no FAQ section on this page
    }

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      // Add click event to question
      question.addEventListener('click', () => {
        // Check if this item is currently active
        const isActive = item.classList.contains('active');

        // Optional: Close all other FAQs (accordion behavior)
        // Comment out these lines if you want multiple FAQs open at once
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });

      // Add keyboard support (Enter/Space to toggle)
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });

    console.log(`✅ FAQ Accordion initialized: ${faqItems.length} items`);
  };

  // Initialize FAQ accordion
  initFAQAccordion();

  // ========================================
  // CONTACT LINK HANDLERS
  // ========================================

  /**
   * Handle special contact links with class .js-contact-link
   * These links scroll to contact section and may trigger modals
   */
  const initContactLinks = () => {
    const contactLinks = document.querySelectorAll('.js-contact-link');

    contactLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Find the contact options section
        const contactSection = document.getElementById('contact-options');
        
        if (contactSection) {
          // Smooth scroll to contact section
          contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Optional: Add a highlight effect to the contact section
          contactSection.classList.add('highlight-pulse');
          setTimeout(() => {
            contactSection.classList.remove('highlight-pulse');
          }, 2000);
        }
      });
    });

    if (contactLinks.length > 0) {
      console.log(`✅ Contact links initialized: ${contactLinks.length} links`);
    }
  };

  // Initialize contact links
  initContactLinks();

  // ========================================
  // ANIMATED COUNTERS FOR STATS
  // ========================================

  /**
   * Animate numbers counting up when they come into view
   * Useful for stat displays and big numbers
   */
  const initAnimatedCounters = () => {
    const counters = document.querySelectorAll('.stat-number, .big-number');
    
    if (counters.length === 0) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      return; // Skip animation on older browsers
    }

    /**
     * Animate a single counter element
     */
    const animateCounter = (element) => {
      // Skip if already animated
      if (element.dataset.animated === 'true') return;

      const text = element.textContent.trim();
      
      // Extract number from text (e.g., "GH₵ 35,000+" → 35000)
      const numberMatch = text.match(/[\d,]+/);
      if (!numberMatch) return;

      const targetNumber = parseInt(numberMatch[0].replace(/,/g, ''), 10);
      if (isNaN(targetNumber)) return;

      // Store original text format
      const prefix = text.substring(0, text.indexOf(numberMatch[0]));
      const suffix = text.substring(text.indexOf(numberMatch[0]) + numberMatch[0].length);

      // Animation settings
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();

      /**
       * Easing function for smooth animation
       */
      const easeOutQuad = (t) => t * (2 - t);

      /**
       * Animation frame function
       */
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        
        const currentNumber = Math.floor(easedProgress * targetNumber);
        const formattedNumber = currentNumber.toLocaleString('en-GH');
        
        element.textContent = prefix + formattedNumber + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Ensure final value is exact
          element.textContent = text;
          element.dataset.animated = 'true';
        }
      };

      requestAnimationFrame(updateCounter);
    };

    /**
     * Set up intersection observer to trigger animations
     */
    const observerOptions = {
      threshold: 0.5, // Trigger when 50% visible
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        }
      });
    }, observerOptions);

    // Observe all counter elements
    counters.forEach(counter => {
      observer.observe(counter);
    });

    console.log(`✅ Animated counters initialized: ${counters.length} elements`);
  };

  // Initialize animated counters
  initAnimatedCounters();

  // ========================================
  // BENEFIT CARDS STAGGER ANIMATION
  // ========================================

  /**
   * Animate benefit cards with staggered entrance
   */
  const initBenefitCardsAnimation = () => {
    const benefitCards = document.querySelectorAll('.benefit-card-detailed, .requirement-card');
    
    if (benefitCards.length === 0) return;

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      benefitCards.forEach(card => card.style.opacity = '1');
      return;
    }

    // Set initial state
    benefitCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && entry.target.style.opacity === '0') {
          // Get all cards in the same container
          const container = entry.target.parentElement;
          const cardsInContainer = Array.from(container.children).filter(
            child => child.classList.contains('benefit-card-detailed') || 
                     child.classList.contains('requirement-card')
          );
          
          const cardIndex = cardsInContainer.indexOf(entry.target);
          
          // Stagger animation based on card index
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, cardIndex * 100); // 100ms delay between each card
        }
      });
    }, observerOptions);

    benefitCards.forEach(card => observer.observe(card));

    console.log(`✅ Benefit cards animation initialized: ${benefitCards.length} cards`);
  };

  // Initialize benefit cards animation
  initBenefitCardsAnimation();

  // ========================================
  // HIGHLIGHT PULSE EFFECT
  // ========================================

  /**
   * Add CSS for highlight pulse effect (if not already in CSS)
   * This creates a brief attention-grabbing animation
   */
  const addHighlightPulseStyles = () => {
    // Check if style already exists
    if (document.getElementById('highlight-pulse-styles')) return;

    const style = document.createElement('style');
    style.id = 'highlight-pulse-styles';
    style.textContent = `
      @keyframes highlightPulse {
        0%, 100% { 
          box-shadow: 0 0 0 0 rgba(144, 238, 144, 0.7);
          transform: scale(1);
        }
        50% { 
          box-shadow: 0 0 0 15px rgba(144, 238, 144, 0);
          transform: scale(1.02);
        }
      }
      
      .highlight-pulse {
        animation: highlightPulse 1s ease-out 2;
      }
    `;
    document.head.appendChild(style);
  };

  addHighlightPulseStyles();

  // ========================================
  // FLOATING ELEMENTS PARALLAX EFFECT
  // ========================================

  /**
   * Add subtle parallax effect to floating elements
   * Creates depth and engagement
   */
  const initParallaxEffect = () => {
    const heroImage = document.querySelector('.hero-image img');
    
    if (!heroImage) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.scrollY;
      const parallaxSpeed = 0.5;
      
      // Only apply parallax in the hero section
      if (scrolled < window.innerHeight) {
        const yPos = -(scrolled * parallaxSpeed);
        heroImage.style.transform = `translateY(${yPos}px)`;
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    console.log('✅ Parallax effect initialized');
  };

  // Initialize parallax (optional - may interfere with float animation)
  // Uncomment if you want both effects
  // initParallaxEffect();

  // ========================================
  // PROGRESS BAR ON SCROLL
  // ========================================

  /**
   * Show reading progress bar at top of page
   */
  const initProgressBar = () => {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #90EE90, #7ed87e);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    let ticking = false;

    const updateProgressBar = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      
      progressBar.style.width = `${Math.min(progress, 100)}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgressBar);
        ticking = true;
      }
    });

    console.log('✅ Progress bar initialized');
  };

  // Initialize progress bar
  initProgressBar();

  // ========================================
  // COPY TO CLIPBOARD FUNCTIONALITY
  // ========================================

  /**
   * Add copy functionality to contact information
   */
  const initCopyToClipboard = () => {
    const contactCards = document.querySelectorAll('.contact-method-card');

    contactCards.forEach(card => {
      // Find the phone number or email
      const contactInfo = card.querySelector('p');
      if (!contactInfo) return;

      const text = contactInfo.textContent.trim();
      
      // Skip WhatsApp card (it's a link)
      if (card.classList.contains('whatsapp')) return;

      // Add copy hint on hover
      const copyHint = document.createElement('div');
      copyHint.textContent = 'Click to copy';
      copyHint.style.cssText = `
        font-size: 12px;
        color: var(--color-light-green);
        margin-top: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      contactInfo.parentElement.appendChild(copyHint);

      card.addEventListener('mouseenter', () => {
        copyHint.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        copyHint.style.opacity = '0';
      });

      // Add click to copy
      card.addEventListener('click', (e) => {
        // Don't interfere with the main link
        if (e.target.tagName === 'A') return;

        e.preventDefault();

        // Copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            // Show success message
            const originalText = copyHint.textContent;
            copyHint.textContent = '✓ Copied!';
            copyHint.style.color = '#90EE90';
            
            setTimeout(() => {
              copyHint.textContent = originalText;
              copyHint.style.color = 'var(--color-light-green)';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy:', err);
          });
        }
      });
    });

    if (contactCards.length > 0) {
      console.log('✅ Copy to clipboard initialized');
    }
  };

  // Initialize copy to clipboard
  initCopyToClipboard();

  // ========================================
  // FORM VALIDATION (IF FORM ADDED LATER)
  // ========================================

  /**
   * Basic form validation for contact forms
   * Ready for future implementation
   */
  const initFormValidation = () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Remove error class after user starts typing
            field.addEventListener('input', () => {
              field.classList.remove('error');
            }, { once: true });
          }
        });

        if (!isValid) {
          e.preventDefault();
          alert('Please fill in all required fields.');
        }
      });
    });

    if (forms.length > 0) {
      console.log(`✅ Form validation initialized: ${forms.length} forms`);
    }
  };

  // Initialize form validation
  initFormValidation();

  // ========================================
  // LAZY LOADING FOR IMAGES
  // ========================================

  /**
   * Lazy load images as they come into view
   * Improves initial page load performance
   */
  const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      images.forEach(img => {
        img.src = img.dataset.src;
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before image enters viewport
    });

    images.forEach(img => imageObserver.observe(img));

    console.log(`✅ Lazy loading initialized: ${images.length} images`);
  };

  // Initialize lazy loading
  initLazyLoading();

  // ========================================
  // MOBILE MENU ENHANCEMENTS
  // ========================================

  /**
   * Close mobile menu when clicking a link
   * Enhances mobile navigation experience
   */
  const initMobileMenuEnhancements = () => {
    const mobileNav = document.getElementById('mobile-nav-overlay');
    const navLinks = document.querySelectorAll('#mobile-nav-overlay a');

    if (!mobileNav) return;

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Only close if it's not a dropdown toggle
        if (!link.querySelector('.toggle-dropdown')) {
          // Close mobile menu
          document.body.classList.remove('mobile-nav-active');
        }
      });
    });

    console.log('✅ Mobile menu enhancements initialized');
  };

  // Initialize mobile menu enhancements
  initMobileMenuEnhancements();

  // ========================================
  // ANALYTICS TRACKING (PLACEHOLDER)
  // ========================================

  /**
   * Track user interactions for analytics
   * Ready for Google Analytics or other platforms
   */
  const initAnalyticsTracking = () => {
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.cta-button-primary, .cta-button-secondary');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        console.log(`📊 CTA Clicked: ${buttonText}`);
        
        // Send to analytics platform
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cta_click', {
            'button_text': buttonText,
            'page_location': window.location.pathname
          });
        }
      });
    });

    // Track FAQ opens
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
      question.addEventListener('click', () => {
        const questionText = question.querySelector('span').textContent.trim();
        console.log(`📊 FAQ Opened: ${questionText}`);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'faq_open', {
            'question': questionText,
            'question_index': index + 1
          });
        }
      });
    });

    // Track calculator usage
    const calculatorButtons = document.querySelectorAll('[id*="calculator-btn"]');
    
    calculatorButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('📊 Calculator Opened');
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'calculator_open', {
            'page_location': window.location.pathname
          });
        }
      });
    });

    console.log('✅ Analytics tracking initialized');
  };

  // Initialize analytics tracking
  initAnalyticsTracking();

  // ========================================
  // PAGE LOAD PERFORMANCE MONITORING
  // ========================================

  /**
   * Monitor page load performance
   */
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          'value': pageLoadTime,
          'page_location': window.location.pathname
        });
      }
    }
  });

  // ========================================
  // INITIALIZATION COMPLETE
  // ========================================

  console.log('✨ Special Offer Interactions initialized successfully');
  console.log('🎯 Active features:');
  console.log('   ✓ FAQ Accordion');
  console.log('   ✓ Contact Links');
  console.log('   ✓ Animated Counters');
  console.log('   ✓ Benefit Cards Animation');
  console.log('   ✓ Progress Bar');
  console.log('   ✓ Copy to Clipboard');
  console.log('   ✓ Mobile Menu Enhancements');
  console.log('   ✓ Analytics Tracking');
  console.log('   ✓ Form Validation (Ready)');
  console.log('   ✓ Lazy Loading (Ready)');

});