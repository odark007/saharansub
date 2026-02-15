/**
 * Saharansub E-Mobility - Savings Calculator
 * File: savings-calculator.js
 * Purpose: Interactive savings calculator modal for government worker special offer
 */

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // ========================================
  // CALCULATOR MODAL FUNCTIONALITY
  // ========================================

  /**
   * Initialize the savings calculator modal
   */
  const initSavingsCalculator = () => {
    // Get modal elements
    const modal = document.getElementById('savings-calculator-modal');
    const closeButton = document.getElementById('close-calculator-modal');
    const monthlySpendInput = document.getElementById('monthly-trotro-spend');
    
    // Get all buttons that open the calculator
    const openButtons = document.querySelectorAll(
      '#open-calculator-btn, #open-calculator-btn-2, #open-calculator-btn-3'
    );

    // Get result display elements
    const annualTrotroCost = document.getElementById('annual-trotro-cost');
    const annualSavings = document.getElementById('annual-savings');
    const fiveYearSavings = document.getElementById('five-year-savings');

    // Check if modal exists on this page
    if (!modal) {
      return; // Exit if no calculator on this page
    }

    // ========================================
    // MODAL OPEN/CLOSE FUNCTIONS
    // ========================================

    /**
     * Open the calculator modal
     */
    const openModal = () => {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      
      // Focus on input field when modal opens
      if (monthlySpendInput) {
        setTimeout(() => {
          monthlySpendInput.focus();
          monthlySpendInput.select(); // Select all text for easy editing
        }, 100);
      }

      // Calculate on open to show initial values
      calculateSavings();
    };

    /**
     * Close the calculator modal
     */
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    // ========================================
    // CALCULATION LOGIC
    // ========================================

    /**
     * Core calculation function
     * Calculates and updates all savings displays
     */
    const calculateSavings = () => {
      // Get user input (monthly trotro spend)
      const monthlyTrotro = parseFloat(monthlySpendInput.value) || 600;

      // FIXED COSTS (from the offer)
      const upfrontPayment = 2700;
      const monthlyPayment = 1100;
      const paymentMonths = 12;
      const totalEagleKingCost = upfrontPayment + (monthlyPayment * paymentMonths); // GH₵ 15,900
      
      // Post-payoff costs (electricity)
      const monthlyElectricity = 120; // Average of GH₵ 80-150 range
      const annualElectricity = monthlyElectricity * 12; // GH₵ 1,440

      // CALCULATIONS
      // Year 1: Trotro vs Eagle King
      const annualTrotro = monthlyTrotro * 12;
      
      // Year 2+: Annual savings after bike is paid off
      const annualSavingsAfterPayoff = annualTrotro - annualElectricity;

      // 5-Year Total Comparison
      // Trotro: 5 years of monthly payments
      const fiveYearTrotro = annualTrotro * 5;
      
      // Eagle King: Year 1 (full cost) + Years 2-5 (electricity only)
      const fiveYearEagleKing = totalEagleKingCost + (annualElectricity * 4);
      
      // Total 5-year savings
      const totalFiveYearSavings = fiveYearTrotro - fiveYearEagleKing;

      // ========================================
      // UPDATE DISPLAY
      // ========================================

      // Format numbers with currency and commas
      const formatCurrency = (amount) => {
        return `GH₵ ${amount.toLocaleString('en-GH', { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        })}`;
      };

      // Update the result displays
      if (annualTrotroCost) {
        annualTrotroCost.textContent = formatCurrency(annualTrotro);
      }

      if (annualSavings) {
        annualSavings.textContent = formatCurrency(annualSavingsAfterPayoff);
      }

      if (fiveYearSavings) {
        fiveYearSavings.textContent = formatCurrency(totalFiveYearSavings);
      }
    };

    // ========================================
    // EVENT LISTENERS
    // ========================================

    // Open modal buttons
    openButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Close modal button
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    // Close modal by clicking on the dark background
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal with 'Escape' key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Real-time calculation as user types
    if (monthlySpendInput) {
      monthlySpendInput.addEventListener('input', calculateSavings);
    }

    // Handle "Apply Now" button in calculator
    const calculatorApplyBtn = document.getElementById('calculator-apply-btn');
    if (calculatorApplyBtn) {
      calculatorApplyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        
        // Smooth scroll to apply section
        const applySection = document.getElementById('apply-now');
        if (applySection) {
          applySection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      });
    }

    // ========================================
    // INPUT VALIDATION
    // ========================================

    /**
     * Ensure input stays within reasonable bounds
     */
    if (monthlySpendInput) {
      monthlySpendInput.addEventListener('blur', () => {
        let value = parseFloat(monthlySpendInput.value);
        
        // Set minimum value to 0
        if (isNaN(value) || value < 0) {
          monthlySpendInput.value = 0;
        }
        
        // Set maximum reasonable value (GH₵ 5000/month)
        if (value > 5000) {
          monthlySpendInput.value = 5000;
        }
        
        calculateSavings();
      });
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    // Calculate initial values on page load
    calculateSavings();
  };

  // Initialize the calculator
  initSavingsCalculator();

  // ========================================
  // ADDITIONAL HELPER FUNCTIONS
  // ========================================

  /**
   * Scroll to top functionality
   * (Handles the floating scroll-to-top button)
   */
  const initScrollToTop = () => {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (!scrollTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    });

    // Smooth scroll to top on click
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // Initialize scroll to top
  initScrollToTop();

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================

  /**
   * Enable smooth scrolling for all anchor links on the page
   */
  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Skip empty anchors and calculator buttons (handled separately)
        if (targetId === '#' || link.id.includes('calculator')) {
          return;
        }

        // Skip if target doesn't exist
        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
          return;
        }

        e.preventDefault();
        
        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  };

  // Initialize smooth scrolling
  initSmoothScroll();

  // ========================================
  // CALCULATOR KEYBOARD SHORTCUTS
  // ========================================

  /**
   * Add keyboard shortcuts for power users
   * Press 'C' to open calculator (when not in input field)
   */
  const initKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
      // Only activate if not typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Press 'C' or 'c' to open calculator
      if (e.key === 'c' || e.key === 'C') {
        const modal = document.getElementById('savings-calculator-modal');
        if (modal && !modal.classList.contains('active')) {
          const openButton = document.getElementById('open-calculator-btn');
          if (openButton) {
            openButton.click();
          }
        }
      }
    });
  };

  // Initialize keyboard shortcuts
  initKeyboardShortcuts();

  // ========================================
  // CONSOLE INFO (Development Helper)
  // ========================================

  console.log('💰 Savings Calculator initialized successfully');
  console.log('💡 Tip: Press "C" to open the calculator from anywhere on the page');
  console.log('📊 Calculator includes:');
  console.log('   - Real-time savings calculation');
  console.log('   - 5-year total comparison');
  console.log('   - Time savings highlight');
  console.log('   - Smooth modal animations');

});