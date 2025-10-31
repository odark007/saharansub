/**
 * NFL Flag Referee Guide - Complete Navigation System
 * Vanilla JavaScript - No dependencies
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const AppState = {
        currentPage: 0, // 0 = cover, 1-11 = content pages, 12 = about
        totalContentPages: 11,
        guideData: null,
        isTransitioning: false,
        touchStartX: 0,
        touchEndX: 0
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const elements = {
        spinner: null,
        coverPage: null,
        contentPagesContainer: null,
        aboutPage: null,
        videoModal: null,
        videoContainer: null,
        startBtn: null,
        aboutPreviousBtn: null,
        backToCoverBtn: null,
        videoCloseBtn: null
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Cache DOM elements
        cacheElements();
        
        // Load guide content from JSON
        loadGuideData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load saved page state
        loadPageState();
        
        // Hide spinner after initialization
        setTimeout(hideSpinner, 500);
    }

    function cacheElements() {
        elements.spinner = document.getElementById('loading-spinner');
        elements.coverPage = document.getElementById('cover-page');
        elements.contentPagesContainer = document.getElementById('content-pages');
        elements.aboutPage = document.getElementById('about-page');
        elements.videoModal = document.getElementById('video-modal');
        elements.videoContainer = document.getElementById('video-container');
        elements.startBtn = document.getElementById('start-btn');
        elements.aboutPreviousBtn = document.getElementById('about-previous-btn');
        elements.backToCoverBtn = document.getElementById('back-to-cover-btn');
        elements.videoCloseBtn = document.getElementById('video-close-btn');
    }

    function hideSpinner() {
        if (elements.spinner) {
            elements.spinner.classList.add('hidden');
        }
    }

    // ============================================
    // DATA LOADING
    // ============================================
    function loadGuideData() {
        fetch('./data/guide-content.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load guide content');
                }
                return response.json();
            })
            .then(data => {
                AppState.guideData = data;
                generateContentPages(data.contentPages);
                populateAboutPage(data.aboutPage);
            })
            .catch(error => {
                console.error('Error loading guide data:', error);
                alert('Failed to load guide content. Please refresh the page.');
            });
    }

    // ============================================
    // CONTENT PAGE GENERATION
    // ============================================
    function generateContentPages(contentPages) {
        const container = elements.contentPagesContainer;
        container.innerHTML = '';

        contentPages.forEach((pageData, index) => {
            const pageElement = createContentPage(pageData, index);
            container.appendChild(pageElement);
        });
    }

    function createContentPage(pageData, index) {
        const page = document.createElement('div');
        page.className = 'page';
        page.setAttribute('data-page', index + 1);
        page.setAttribute('data-bg', pageData.backgroundColor);

        const content = document.createElement('div');
        content.className = 'page-content';

        // Header with small logo
        content.appendChild(createContentHeader());

        // Page heading
        content.appendChild(createHeading(pageData.heading));

        // Lists
        if (pageData.lists && pageData.lists.length > 0) {
            content.appendChild(createList(pageData.lists));
        }

        // Image
        if (pageData.image) {
            content.appendChild(createImage(pageData.image));
        }

        // Table
        if (pageData.table) {
            content.appendChild(createTable(pageData.table));
        }

        // Video
        if (pageData.video) {
            content.appendChild(createVideoThumbnail(pageData.video));
        }

        // Highlight Comment
        if (pageData.highlightComment) {
            content.appendChild(createHighlight(pageData.highlightComment));
        }

        // Navigation
        content.appendChild(createNavigation(pageData.pageNumber));

        page.appendChild(content);
        return page;
    }

    function createContentHeader() {
        const header = document.createElement('div');
        header.className = 'content-header';

        const logo = document.createElement('img');
        logo.src = './images/nfl-guide-logo-small.png';
        logo.alt = 'NFL Flag Logo';
        logo.className = 'small-logo';
        logo.onerror = function() {
            // Fallback if small logo doesn't exist
            this.src = './images/nfl-guide-logo.png';
        };

        header.appendChild(logo);
        return header;
    }

    function createHeading(text) {
        const heading = document.createElement('h2');
        heading.className = 'page-heading';
        heading.textContent = text;
        return heading;
    }

    function createList(items) {
        const ul = document.createElement('ul');
        ul.className = 'content-list';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'content-list-item';

            const icon = document.createElement('i');
            icon.className = `fas ${item.icon}`;

            const text = document.createElement('span');
            text.textContent = item.text;

            li.appendChild(icon);
            li.appendChild(text);
            ul.appendChild(li);
        });

        return ul;
    }

    function createImage(imageData) {
        const container = document.createElement('div');
        container.className = 'content-image-container';

        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.legend || 'Content Image';
        img.className = 'content-image';
        img.onerror = function() {
            // Fallback placeholder
            this.src = 'https://via.placeholder.com/600x400/013369/FFFFFF?text=Image+Coming+Soon';
        };

        container.appendChild(img);

        if (imageData.legend) {
            const legend = document.createElement('p');
            legend.className = 'image-legend';
            legend.textContent = imageData.legend;
            container.appendChild(legend);
        }

        return container;
    }

    function createTable(tableData) {
        const container = document.createElement('div');
        container.className = 'content-table-container';

        if (tableData.title) {
            const title = document.createElement('h3');
            title.className = 'table-title';
            title.textContent = tableData.title;
            container.appendChild(title);
        }

        const table = document.createElement('table');
        table.className = 'content-table';

        // Headers
        if (tableData.headers) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            tableData.headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

        // Body
        const tbody = document.createElement('tbody');
        tableData.rows.forEach(row => {
            const tr = document.createElement('tr');
            
            const td1 = document.createElement('td');
            td1.textContent = row.col1;
            tr.appendChild(td1);
            
            const td2 = document.createElement('td');
            td2.textContent = row.col2;
            tr.appendChild(td2);
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);

        return container;
    }

    function createVideoThumbnail(videoData) {
        const container = document.createElement('div');
        container.className = 'video-thumbnail-container';
        container.setAttribute('data-youtube-id', videoData.youtubeId);

        const thumbnail = document.createElement('img');
        thumbnail.src = videoData.thumbnail || `https://img.youtube.com/vi/${videoData.youtubeId}/maxresdefault.jpg`;
        thumbnail.alt = videoData.title || 'Video';
        thumbnail.className = 'video-thumbnail';
        thumbnail.onerror = function() {
            // Fallback to medium quality thumbnail
            this.src = `https://img.youtube.com/vi/${videoData.youtubeId}/hqdefault.jpg`;
        };

        const playIcon = document.createElement('div');
        playIcon.className = 'video-play-icon';
        playIcon.innerHTML = '<i class="fas fa-play"></i>';

        container.appendChild(thumbnail);
        container.appendChild(playIcon);

        // Add click event to open video modal
        container.addEventListener('click', function() {
            openVideoModal(videoData.youtubeId);
        });

        return container;
    }

    function createHighlight(text) {
        const highlight = document.createElement('div');
        highlight.className = 'highlight-comment';

        const p = document.createElement('p');
        p.textContent = text;

        highlight.appendChild(p);
        return highlight;
    }

    function createNavigation(pageNumber) {
        const nav = document.createElement('div');
        nav.className = 'page-navigation';

        const indicator = document.createElement('div');
        indicator.className = 'page-indicator';
        indicator.textContent = `Page ${pageNumber} of ${AppState.totalContentPages}`;

        const buttons = document.createElement('div');
        buttons.className = 'nav-buttons';

        // Previous button (not on page 1)
        if (pageNumber > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn-nav btn-previous';
            prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i><span>Previous</span>';
            prevBtn.addEventListener('click', () => navigateToPreviousPage());
            buttons.appendChild(prevBtn);
        }

        // Next button (on all pages)
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-nav btn-next';
        nextBtn.innerHTML = '<span>Next</span><i class="fas fa-arrow-right"></i>';
        nextBtn.addEventListener('click', () => navigateToNextPage());
        buttons.appendChild(nextBtn);

        nav.appendChild(indicator);
        nav.appendChild(buttons);

        return nav;
    }

    function populateAboutPage(aboutData) {
        const description = document.getElementById('about-description');
        if (description) {
            description.textContent = aboutData.description;
        }

        // Set social media links
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            const platform = icon.getAttribute('data-platform');
            if (aboutData.socialMedia[platform]) {
                icon.href = aboutData.socialMedia[platform];
            }
        });

        // Set background color
        elements.aboutPage.setAttribute('data-bg', aboutData.backgroundColor);
    }

    // ============================================
    // NAVIGATION FUNCTIONS
    // ============================================
    function navigateToPage(pageIndex) {
        if (AppState.isTransitioning) return;

        const allPages = document.querySelectorAll('.page');
        const targetPage = allPages[pageIndex];

        if (!targetPage) return;

        AppState.isTransitioning = true;

        // Determine animation direction
        const direction = pageIndex > AppState.currentPage ? 'left' : 'right';

        // Remove active class and add slide-out animation
        allPages.forEach(page => {
            if (page.classList.contains('active')) {
                page.classList.remove('active');
                page.classList.add(`slide-out-${direction}`);
                
                setTimeout(() => {
                    page.classList.remove(`slide-out-${direction}`);
                }, 300);
            }
        });

        // Add active class to target page
        setTimeout(() => {
            targetPage.classList.add('active');
            AppState.currentPage = pageIndex;
            savePageState();
            AppState.isTransitioning = false;

            // Scroll to top
            window.scrollTo(0, 0);
        }, 300);
    }

    function navigateToNextPage() {
        const maxPage = AppState.totalContentPages + 1; // +1 for about page
        if (AppState.currentPage < maxPage) {
            navigateToPage(AppState.currentPage + 1);
        }
    }

    function navigateToPreviousPage() {
        if (AppState.currentPage > 0) {
            navigateToPage(AppState.currentPage - 1);
        }
    }

    function navigateToCover() {
        navigateToPage(0);
    }

    // ============================================
    // VIDEO MODAL
    // ============================================
    function openVideoModal(youtubeId) {
        const modal = elements.videoModal;
        const container = elements.videoContainer;

        // Create YouTube iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        container.innerHTML = '';
        container.appendChild(iframe);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        const modal = elements.videoModal;
        const container = elements.videoContainer;

        modal.classList.remove('active');
        container.innerHTML = '';
        document.body.style.overflow = '';
    }

    // ============================================
    // PAGE STATE PERSISTENCE
    // ============================================
    function savePageState() {
        try {
            localStorage.setItem('nfl-guide-current-page', AppState.currentPage);
        } catch (e) {
            console.warn('Could not save page state:', e);
        }
    }

    function loadPageState() {
        try {
            const savedPage = localStorage.getItem('nfl-guide-current-page');
            if (savedPage !== null) {
                const pageIndex = parseInt(savedPage, 10);
                if (pageIndex > 0 && pageIndex <= AppState.totalContentPages + 1) {
                    // Small delay to ensure pages are generated
                    setTimeout(() => {
                        navigateToPage(pageIndex);
                    }, 600);
                }
            }
        } catch (e) {
            console.warn('Could not load page state:', e);
        }
    }

    function clearPageState() {
        try {
            localStorage.removeItem('nfl-guide-current-page');
        } catch (e) {
            console.warn('Could not clear page state:', e);
        }
    }

    // ============================================
    // TOUCH/SWIPE GESTURES
    // ============================================
    function handleTouchStart(e) {
        AppState.touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        AppState.touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const diff = AppState.touchStartX - AppState.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next page
                navigateToNextPage();
            } else {
                // Swiped right - previous page
                navigateToPreviousPage();
            }
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    function handleKeyboard(e) {
        // Don't trigger if video modal is open
        if (elements.videoModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeVideoModal();
            }
            return;
        }

        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                navigateToNextPage();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                navigateToPreviousPage();
                break;
            case 'Home':
                e.preventDefault();
                navigateToCover();
                break;
            case 'Escape':
                closeVideoModal();
                break;
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function setupEventListeners() {
        // Start button
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', () => navigateToPage(1));
        }

        // About page buttons
        if (elements.aboutPreviousBtn) {
            elements.aboutPreviousBtn.addEventListener('click', () => navigateToPage(11));
        }

        if (elements.backToCoverBtn) {
            elements.backToCoverBtn.addEventListener('click', navigateToCover);
        }

        // Video modal close
        if (elements.videoCloseBtn) {
            elements.videoCloseBtn.addEventListener('click', closeVideoModal);
        }

        // Click outside video to close
        if (elements.videoModal) {
            elements.videoModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeVideoModal();
                }
            });
        }

        // Touch gestures
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Clear state on page unload (optional)
        // window.addEventListener('beforeunload', clearPageState);
    }

    // ============================================
    // SERVICE WORKER FOR OFFLINE SUPPORT
    // ============================================
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // ============================================
    // START APPLICATION
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Register service worker for offline capability
    window.addEventListener('load', registerServiceWorker);

})();