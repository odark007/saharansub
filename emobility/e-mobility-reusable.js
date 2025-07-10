/**
* Saharansub E-Mobility Page - REUSABLE SCRIPT
* This script contains the interactive logic for NEW pages.
* It waits for the 'componentsLoaded' event from templating.js
*/

// This event listener ensures the script runs only on pages using the template
document.addEventListener('componentsLoaded', () => {

  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
        return [...document.querySelectorAll(el)];
    } else {
        return document.querySelector(el);
    }
  };

  // --- 1. Pre-Loader Logic ---
  const initPreloader = () => {
    const preloader = select('#emobility-preloader');
    if (!preloader) return; // Gracefully exit if no preloader on page

    const skipButton = select('#skip-preloader');
    const loadingPhrase = select('#loading-phrase');
    const phrases = ["your urban mobility", "your eco-friendliness"];
    let phraseIndex = 0;
    const phraseInterval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      if(loadingPhrase) loadingPhrase.textContent = phrases[phraseIndex];
    }, 1500);
    const hidePreloader = () => {
      if (preloader.classList.contains('loaded')) return;
      preloader.classList.add('loaded');
      clearTimeout(preloaderTimeout); clearTimeout(skipButtonTimeout); clearInterval(phraseInterval);
    };
    const skipButtonTimeout = setTimeout(() => { if(skipButton) skipButton.classList.add('visible'); }, 3000);
    const preloaderTimeout = setTimeout(hidePreloader, 7000);
    if(skipButton) skipButton.addEventListener('click', hidePreloader);
  };

  // --- 2. Dual Navigation System Logic ---
  const initDualNav = () => {
    const mainHeader = select('#main-site-header');
    const ebikeMenu = select('#ebike-menu-desktop');
    const heroSection = select('#emobility-hero');
    if (!mainHeader || !ebikeMenu || !heroSection) return;

    window.addEventListener('scroll', () => {
      if (window.innerWidth < 1024) return;
      const heroHeight = heroSection.offsetHeight;
      const ebikeMenuHeight = ebikeMenu.offsetHeight;
      if (window.scrollY > heroHeight) {
        mainHeader.classList.add('hidden');
        ebikeMenu.classList.add('is-sticky');
        document.body.style.paddingTop = `${ebikeMenuHeight}px`;
      } else {
        mainHeader.classList.remove('hidden');
        ebikeMenu.classList.remove('is-sticky');
        document.body.style.paddingTop = '0px';
      }
    });
  };
  
  // --- 3. Hero Slider Logic ---
  const initHeroSlider = () => {
    const sliderContainer = select('.slider-container');
    if (!sliderContainer) return; // Gracefully exit if no slider on page

    const wrapper = select('.slider-wrapper');
    const slides = select('.slide', true);
    const nextBtn = select('.slider-control.next');
    const prevBtn = select('.slider-control.prev');
    const dotsContainer = select('.slider-dots');
    if (!wrapper || slides.length === 0) return;
    let currentSlide = 0;
    const totalSlides = slides.length;
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = select('.dot', true);
    const goToSlide = (slideIndex) => {
        currentSlide = slideIndex;
        wrapper.style.transform = `translateX(-${100 * currentSlide}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };
    nextBtn.addEventListener('click', () => { goToSlide((currentSlide + 1) % totalSlides); });
    prevBtn.addEventListener('click', () => { goToSlide((currentSlide - 1 + totalSlides) % totalSlides); });
    setInterval(() => { nextBtn.click(); }, 6000);
  };
  
  // --- 4. Mobile Navigation Logic (THE CRITICAL CODE) ---
  const initMobileNav = () => {
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mobileNavOverlay = select('#mobile-nav-overlay');
    if (!mobileNavToggle) return; // Should always be found after templating

    mobileNavToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      document.body.classList.toggle('mobile-nav-active');
    });

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', (event) => {
        const dropdownLink = event.target.closest('.mobile-main-nav .dropdown > a');
        if (dropdownLink) {
          event.preventDefault();
          dropdownLink.parentElement.classList.toggle('active');
        } else if (event.target.closest('a')) {
          document.body.classList.remove('mobile-nav-active');
        }
      });
    }
  };

  // --- 5. Product Showcase Carousel ---
  const initBikeCarousel = () => {
    const carouselWrapper = select('.bike-carousel-wrapper');
    if (!carouselWrapper) return; // Gracefully exit if no carousel on page
    
    // ... all other bike carousel code ...
  };

  // --- 6. Safety Videos Player ---
  const initSafetyVideos = () => {
    const grid = select('.safety-videos-grid');
    if (!grid) return; // Gracefully exit if no video player on page

    // ... all other safety video code ...
  };

  // --- 7. Book Test Ride Modal Logic ---
  const initTestRideModal = () => {
    const openBtn = select('#open-test-ride-modal');
    if (!openBtn) return; // Gracefully exit if no modal button on page

    // ... all other modal code ...
  };

  // Initialize all functions
  // Each function will now check if its required elements exist before running.
  initPreloader();
  initDualNav();
  initHeroSlider();
  initMobileNav();
  initBikeCarousel();
  initSafetyVideos();
  initTestRideModal();
});