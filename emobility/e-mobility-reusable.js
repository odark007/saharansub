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
    if (!sliderContainer) return;

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
  
  // --- 4. Mobile Navigation Logic ---
  const initMobileNav = () => {
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mobileNavOverlay = select('#mobile-nav-overlay');
    if (!mobileNavToggle) return;

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
        } else if (event.target.closest('a') && !event.target.closest('.js-contact-link')) {
          // Close nav, but NOT if it's the contact link we want to handle separately
          document.body.classList.remove('mobile-nav-active');
        }
      });
    }
  };

  // --- 5. Product Showcase Carousel ---
  const initBikeCarousel = () => {
    const wrapper = select('.bike-carousel-wrapper');
    if (!wrapper) return;

    const cards = select('.bike-card', true);
    const prevBtn = select('#carousel-prev');
    const nextBtn = select('#carousel-next');
    if (!wrapper || !prevBtn || !nextBtn || cards.length === 0) return;

    let currentIndex = 0;
    let cardWidth = 0;
    let gap = 0;
    let slidesToShow = 0;

    const updateCarousel = () => {
      if (cards.length === 0) return;
      if (window.innerWidth > 992) { slidesToShow = 3; }
      else if (window.innerWidth > 768) { slidesToShow = 2; }
      else { slidesToShow = 1; }
      
      gap = parseInt(window.getComputedStyle(wrapper).gap) || 25;
      cardWidth = cards[0].offsetWidth;
      
      const offset = -currentIndex * (cardWidth + gap);
      wrapper.style.transform = `translateX(${offset}px)`;

      prevBtn.disabled = (currentIndex === 0);
      nextBtn.disabled = (currentIndex >= cards.length - slidesToShow);
    };
    
    nextBtn.addEventListener('click', () => {
      if (currentIndex < cards.length - slidesToShow) { currentIndex++; updateCarousel(); }
    });
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; updateCarousel(); }
    });
    window.addEventListener('resize', updateCarousel);
    window.addEventListener('load', updateCarousel);
    updateCarousel();
  };

  // --- 6. Safety Videos Player ---
  const initSafetyVideos = () => {
    const grid = select('.safety-videos-grid');
    if (!grid) return;

    const mainPlayer = select('.main-video-player');
    const mainPlayerTitle = mainPlayer.querySelector('h3');
    const mainPlayerDesc = mainPlayer.querySelector('p');
    const mainPlayerThumbnailContainer = mainPlayer.querySelector('.video-thumbnail');
    
    const playVideo = (container) => {
        const youtubeId = container.dataset.youtubeId;
        const thumbnail = container.querySelector('.video-thumbnail');
        if (thumbnail) {
            thumbnail.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    };

    grid.addEventListener('click', (e) => {
        const clickedPlaylistItem = e.target.closest('.playlist-item');

        if (e.target.closest('.play-button')) {
            playVideo(mainPlayer);
        } else if (clickedPlaylistItem) {
            if (clickedPlaylistItem.classList.contains('active')) return;
            const newYoutubeId = clickedPlaylistItem.dataset.youtubeId;
            const newTitle = clickedPlaylistItem.querySelector('h4').textContent;
            
            mainPlayer.dataset.youtubeId = newYoutubeId;
            mainPlayerTitle.textContent = newTitle;
            mainPlayerDesc.textContent = `Learn more about: ${newTitle}`;
            mainPlayerThumbnailContainer.innerHTML = `<img src="https://img.youtube.com/vi/${newYoutubeId}/maxresdefault.jpg" alt="${newTitle}"><button class="play-button" aria-label="Play Video"><i class="bi bi-play-fill"></i></button>`;

            const currentActive = select('.playlist-item.active');
            if (currentActive) currentActive.classList.remove('active');
            clickedPlaylistItem.classList.add('active');
        }
    });
  };

  // --- 7. Book Test Ride Modal Logic (FOR ORIGINAL PAGE) ---
  const initTestRideModal = () => {
    const openBtn = select('#open-test-ride-modal');
    if (!openBtn) return; // This will only run if the specific button exists

    const closeBtn = select('#close-test-ride-modal');
    const modalOverlay = select('#test-ride-modal-overlay');
    if (!closeBtn || !modalOverlay) return;

    const openModal = () => {
      modalOverlay.classList.add('active');
      document.body.classList.add('modal-open');
    };
    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  };

  // --- 8. NEW: Global Contact Modal Logic (FOR NEW PAGES) ---
  const initGlobalContactModal = () => {
      const contactLinks = select('.js-contact-link', true);
      const modalOverlay = select('#test-ride-modal-overlay');
      const closeBtn = select('#close-test-ride-modal');

      if (contactLinks.length === 0 || !modalOverlay || !closeBtn) return;

      const openModal = (event) => {
          event.preventDefault(); // Prevents the link from scrolling the page
          modalOverlay.classList.add('active');
          document.body.classList.add('modal-open');
          // If in mobile view, also close the nav overlay
          if (document.body.classList.contains('mobile-nav-active')) {
              document.body.classList.remove('mobile-nav-active');
          }
      };

      const closeModal = () => {
          modalOverlay.classList.remove('active');
          document.body.classList.remove('modal-open');
      };

      contactLinks.forEach(link => {
          link.addEventListener('click', openModal);
      });

      closeBtn.addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) closeModal();
      });
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
              closeModal();
          }
      });
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
  initGlobalContactModal(); // Initialize our new function
});