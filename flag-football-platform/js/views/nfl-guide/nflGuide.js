import { showLoading, hideLoading, showToast } from '../../utils.js';

// Import CSS for this view
import '../../../css/nflGuide.css'; // This will be created in the next step

const GUIDE_DATA_PATH = './js/views/nfl-guide/nflGuideData.json';
let guidePages = [];
let currentPageIndex = 0;

export async function renderNFLGuide(container) {
  showLoading('Loading Referee Guide...');
  container.innerHTML = ''; // Clear previous content

  try {
    if (guidePages.length === 0) {
      const response = await fetch(GUIDE_DATA_PATH);
      if (!response.ok) throw new Error('Failed to fetch guide data');
      guidePages = await response.json();
    }

    if (guidePages.length > 0) {
      displayPage(container, currentPageIndex);
    } else {
      container.innerHTML = '<div class="empty-state"><p class="empty-state-title">No guide content available.</p></div>';
    }

  } catch (error) {
    console.error('Error rendering NFL Guide:', error);
    showToast('Failed to load referee guide.', 'error');
    container.innerHTML = '<div class="error-state"><p class="empty-state-title">An error occurred.</p><p>Please try refreshing the page.</p></div>';
  } finally {
    hideLoading();
  }
}

function displayPage(container, index) {
  if (index < 0 || index >= guidePages.length) {
    console.error('Invalid page index:', index);
    return;
  }

  currentPageIndex = index;
  const pageData = guidePages[currentPageIndex];

  // Determine background color
  const bgColorClass = pageData.color === 'red' ? 'guide-page-red' : 'guide-page-green';

  container.innerHTML = `
    <div id="nfl-guide-page" class="nfl-guide-page ${bgColorClass}">
      <!-- Page content will be injected here -->
      <div id="guide-content"></div>
      <!-- Navigation buttons -->
      <div class="guide-navigation">
        <button id="prev-page-btn" class="guide-nav-btn ${currentPageIndex === 0 ? 'hidden' : ''}">
          <i class="fas fa-arrow-left"></i> Previous
        </button>
        <span id="page-indicator" class="page-indicator">Page ${currentPageIndex + 1} of ${guidePages.length}</span>
        <button id="next-page-btn" class="guide-nav-btn ${currentPageIndex === guidePages.length - 1 ? 'hidden' : ''}">
          Next <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div id="about-me-nav-container" class="about-me-nav-container ${currentPageIndex === guidePages.length - 1 ? '' : 'hidden'}">
        <button id="view-about-me-btn" class="btn btn-primary btn-block">About Coach Goddie</button>
      </div>
      <div id="about-me-page" class="about-me-page hidden"></div>
    </div>
  `;

  const guideContentArea = container.querySelector('#guide-content');
  if (pageData.type === 'cover') {
    renderCoverPage(guideContentArea, pageData);
  } else if (pageData.type === 'about') {
    renderAboutMePage(guideContentArea, pageData);
  }
  else {
    renderContentPage(guideContentArea, pageData);
  }

  setupPageNavigation(container);
}

function setupPageNavigation(container) {
  const prevBtn = container.querySelector('#prev-page-btn');
  const nextBtn = container.querySelector('#next-page-btn');
  const viewAboutMeBtn = container.querySelector('#view-about-me-btn');

  prevBtn?.addEventListener('click', () => navigatePage(-1, container));
  nextBtn?.addEventListener('click', () => navigatePage(1, container));
  viewAboutMeBtn?.addEventListener('click', () => {
    // This will navigate to the special 'about me' page
    displayAboutMe(container);
  });

  // Swipe gesture for mobile
  let startX = 0;
  let endX = 0;

  const guidePageElement = container.querySelector('#nfl-guide-page');
  if (guidePageElement) {
    guidePageElement.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    guidePageElement.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });

    guidePageElement.addEventListener('touchend', () => {
      const threshold = 50; // Minimum swipe distance
      if (startX - endX > threshold) { // Swiped left (next page)
        if (currentPageIndex < guidePages.length - 1) {
          navigatePage(1, container);
        } else if (currentPageIndex === guidePages.length - 1) {
          // If on the last content page, swipe left goes to About Me
          displayAboutMe(container);
        }
      } else if (endX - startX > threshold) { // Swiped right (previous page)
        navigatePage(-1, container);
      }
      startX = 0;
      endX = 0;
    });
  }
}

function navigatePage(direction, container) {
  const newIndex = currentPageIndex + direction;
  if (newIndex >= 0 && newIndex < guidePages.length) {
    displayPage(container, newIndex);
  } else if (newIndex === guidePages.length) {
    // Attempting to go next from the last content page, go to About Me
    displayAboutMe(container);
  }
}

function renderCoverPage(container, pageData) {
  container.innerHTML = `
    <div class="cover-page">
      <img src="${pageData.logoSrc}" alt="Logo" class="cover-logo">
      <p class="championship-text">${pageData.championshipText}</p>
      <h2 class="guide-title">${pageData.guideTitle}</h2>
      <img src="${pageData.imageSrc}" alt="Flag Football Image" class="cover-image">
      <button id="start-guide-btn" class="start-guide-btn">Start Guide</button>
    </div>
  `;
  container.querySelector('#start-guide-btn').addEventListener('click', () => {
    navigatePage(1, document.getElementById('view-container'));
  });

  // Hide default navigation for cover page
  document.querySelector('.guide-navigation').classList.add('hidden');
  document.querySelector('#about-me-nav-container').classList.add('hidden');
}

function renderContentPage(container, pageData) {
  // Logic for rendering content pages will go here
  // For now, a placeholder
  container.innerHTML = `
    <div class="content-page">
      <img src="${pageData.smallLogoSrc}" alt="Small Logo" class="small-page-logo">
      <h3 class="page-heading">${pageData.heading}</h3>
      ${pageData.text ? `<p class="page-text">${pageData.text}</p>` : ''}
      ${pageData.list ? renderList(pageData.list) : ''}
      ${pageData.image ? renderImage(pageData.image) : ''}
      ${pageData.table ? renderTable(pageData.table) : ''}
      ${pageData.video ? renderVideo(pageData.video) : ''}
      <div class="highlight-box">
        <p class="highlight-text">${pageData.highlight}</p>
      </div>
    </div>
  `;

  // Show default navigation for content pages
  document.querySelector('.guide-navigation').classList.remove('hidden');
  document.querySelector('#about-me-nav-container').classList.toggle('hidden', currentPageIndex !== guidePages.length - 1);
}

function renderList(listData) {
  let listHtml = `<ul>`;
  listData.items.forEach(item => {
    listHtml += `<li><i class="fas ${item.icon}"></i> ${item.text}</li>`;
  });
  listHtml += `</ul>`;
  return listHtml;
}

function renderImage(imageData) {
  return `
    <div class="page-image-container">
      <img src="${imageData.src}" alt="${imageData.alt}" class="page-image">
      <p class="image-legend">${imageData.legend}</p>
    </div>
  `;
}

function renderTable(tableData) {
  let tableHtml = `<div class="table-container"><h4>${tableData.title}</h4><div class="two-column-table">`;
  tableData.rows.forEach(row => {
    tableHtml += `
      <div class="table-row">
        <div class="table-cell table-header">${row.header}</div>
        <div class="table-cell">${row.content}</div>
      </div>
    `;
  });
  tableHtml += `</div></div>`;
  return tableHtml;
}

function renderVideo(videoData) {
  // Placeholder for video. Actual implementation will likely involve a modal/fullscreen
  return `
    <div class="video-container-placeholder">
      <button class="play-video-btn" data-video-src="${videoData.src}">
        <i class="fas fa-play-circle"></i> Play Video: ${videoData.title}
      </button>
    </div>
  `;
}

function displayAboutMe(container) {
  // Hide main guide page content
  container.querySelector('#nfl-guide-page').classList.add('hidden');

  const aboutMeContainer = container.querySelector('#about-me-page');
  aboutMeContainer.classList.remove('hidden');

  const aboutMeData = guidePages.find(page => page.type === 'about');

  aboutMeContainer.innerHTML = `
    <div class="about-me-content guide-page-green">
      <div class="profile-header">
        <div class="profile-pic-container">
          <img src="${aboutMeData.pictureSrc}" alt="Coach Goddie" class="profile-pic">
        </div>
        <h3 class="profile-name">${aboutMeData.name}</h3>
      </div>
      <p class="profile-description">${aboutMeData.description}</p>
      <div class="social-links">
        <a href="${aboutMeData.social.twitter}" target="_blank" class="social-icon" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="${aboutMeData.social.linkedin}" target="_blank" class="social-icon" aria-label="LinkedIn">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="${aboutMeData.social.tiktok}" target="_blank" class="social-icon" aria-label="TikTok">
          <i class="fab fa-tiktok"></i>
        </a>
        <a href="${aboutMeData.social.whatsapp}" target="_blank" class="social-icon" aria-label="WhatsApp">
          <i class="fab fa-whatsapp"></i>
        </a>
      </div>
      <div class="about-me-actions">
        <button id="about-prev-btn" class="guide-nav-btn"><i class="fas fa-arrow-left"></i> Previous</button>
        <button id="back-to-cover-btn" class="btn btn-primary">Back to Cover Page</button>
      </div>
    </div>
  `;

  aboutMeContainer.querySelector('#about-prev-btn').addEventListener('click', () => {
    // Go back to the last content page
    container.querySelector('#nfl-guide-page').classList.remove('hidden');
    aboutMeContainer.classList.add('hidden');
    displayPage(container, guidePages.length - 1);
  });

  aboutMeContainer.querySelector('#back-to-cover-btn').addEventListener('click', () => {
    // Go back to the very first (cover) page
    container.querySelector('#nfl-guide-page').classList.remove('hidden');
    aboutMeContainer.classList.add('hidden');
    displayPage(container, 0); // Display the cover page
  });
}