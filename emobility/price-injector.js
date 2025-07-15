/**
 * Saharansub E-Mobility - Price Injector Script
 *
 * This script dynamically populates bike prices on both the main
 * e-mobility page and individual bike detail pages. It looks for
 * elements with a `data-bike-id` attribute and fills in the prices.
 */
document.addEventListener('DOMContentLoaded', () => {

  // Check if the bikePrices object exists. If not, the data script hasn't been loaded.
  if (typeof bikePrices === 'undefined') {
    console.error('Error: bikePrices data not found. Make sure pricing-data.js is loaded before this script.');
    return;
  }

  /**
   * Finds all elements with a 'data-bike-id' and populates the price
   * placeholders within them.
   */
  const populatePrices = () => {
    // This selector works for both the list page (multiple cards) and the detail page (body tag).
    const bikeContainers = document.querySelectorAll('[data-bike-id]');

    bikeContainers.forEach(container => {
      const bikeId = container.dataset.bikeId;
      const prices = bikePrices[bikeId];

      // If no price data exists for this bike ID, skip it.
      if (!prices) {
        console.warn(`No price data found for bike ID: ${bikeId}`);
        return;
      }

      // Find all price placeholders within this specific container.
      const pricePlaceholders = container.querySelectorAll('.bike-price, .price-value');

      pricePlaceholders.forEach(placeholder => {
        const priceType = placeholder.dataset.priceType; // e.g., 'lead' or 'lithium'

        if (prices[priceType]) {
          placeholder.textContent = prices[priceType];
        } else {
          placeholder.textContent = 'N/A'; // Default if a specific price type isn't found
        }
      });
    });
  };

  // Run the function to populate prices on the page.
  populatePrices();

});