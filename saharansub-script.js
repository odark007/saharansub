/**
* Saharansub Personal Brand Website
* Main JavaScript File (Vanilla JS)
*/

document.addEventListener('DOMContentLoaded', () => {

  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const initPreloader = () => {
    const preloader = select('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        setTimeout(() => preloader.remove(), 500);
      });
    }
  };

  const initStickyHeader = () => {
    const header = select('#header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
      });
    }
  };

  /**
   * CORRECTED: Handles mobile navigation state and dropdown logic.
   */
  const initMobileNav = () => {
    const mobileNavToggle = select('.mobile-nav-toggle');
    const navmenu = select('.navmenu');

    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        document.body.classList.toggle('mobile-nav-active');
      });
    }
    
    // Add click listeners for dropdown links in mobile view
    if (navmenu) {
      navmenu.addEventListener('click', (event) => {
        if (document.body.classList.contains('mobile-nav-active')) {
          const dropdownLink = event.target.closest('.dropdown > a');
          if (dropdownLink) {
            event.preventDefault();
            const dropdown = dropdownLink.parentElement;
            dropdown.classList.toggle('active');
            const subMenu = dropdown.querySelector('ul');
            if (subMenu) {
              subMenu.classList.toggle('dropdown-active');
            }
          }
        }
      });
    }
  };

  const initScrollTopButton = () => {
    const scrollTop = select('.scroll-top');
    if (scrollTop) {
      window.addEventListener('scroll', () => {
        scrollTop.classList.toggle('active', window.scrollY > 200);
      });
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  const initDynamicTagline = () => {
    const taglineElement = select('#dynamic-tagline');
    if (taglineElement) {
      const taglines = ["STEAM Advocate", "Market Entry Specialist", "Tech Sales Expert", "E-Mobility Pusher"];
      let currentIndex = 0;
      setInterval(() => {
        currentIndex = (currentIndex + 1) % taglines.length;
        taglineElement.style.opacity = '0';
        setTimeout(() => {
          taglineElement.textContent = taglines[currentIndex];
          taglineElement.style.opacity = '1';
        }, 300);
      }, 3000);
    }
  };
  
  const initCountersOnScroll = () => {
    const startCounter = (counter) => {
      const target = +counter.getAttribute('data-target');
      if (counter.hasAttribute('data-counted')) return;
      counter.setAttribute('data-counted', 'true');
      const duration = 2000;
      const stepTime = 20;
      const increment = target / (duration / stepTime);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        counter.innerText = Math.floor(current).toLocaleString();
        if (current >= target) {
          counter.innerText = target.toLocaleString();
          clearInterval(timer);
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    select('.counter', true).forEach(counter => {
      observer.observe(counter);
    });
  };

  // Initialize all functions
  initPreloader();
  initStickyHeader();
  initMobileNav();
  initScrollTopButton();
  initDynamicTagline();
  initCountersOnScroll();

});