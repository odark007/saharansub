/**
* Saharansub E-Mobility
* Bike Detail Page Specific JavaScript
* Handles the "Inquire" modal functionality.
*/
document.addEventListener('DOMContentLoaded', () => {

  "use strict";

  /**
   * Universal Inquiry Modal Logic for Bike Detail Pages
   * This function targets a modal with the ID 'inquiry-modal' and is
   * triggered by any button with the class 'js-open-modal'.
   */
  const initBikeInquiryModal = () => {
    const modalOverlay = document.getElementById('inquiry-modal');
    // If there is no modal on this page, exit the function.
    if (!modalOverlay) {
      return;
    }

    const openModalButton = document.querySelector('.js-open-modal');
    const closeModalButton = modalOverlay.querySelector('.modal-close-button');
    const modalTitle = modalOverlay.querySelector('#modal-title');

    // If the required elements don't exist, exit.
    if (!openModalButton || !closeModalButton || !modalTitle) {
      return;
    }

    const openModal = () => {
      const bikeName = openModalButton.dataset.bikeName || 'this bike';
      modalTitle.textContent = `Inquire about: ${bikeName}`;
      modalOverlay.classList.add('active');
      document.body.classList.add('modal-open');
    };

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    // --- Event Listeners ---
    openModalButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);

    // Close modal by clicking on the background overlay
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close modal by pressing the 'Escape' key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  };

  // Initialize the modal function
  initBikeInquiryModal();

});