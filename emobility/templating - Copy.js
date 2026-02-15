/**
 * Saharansub Client-Side Templating
 * Fetches and injects reusable HTML components for NEW pages.
 */
document.addEventListener('DOMContentLoaded', () => {

    const loadComponent = async (componentPath, placeholderId) => {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Could not fetch ${componentPath}`);
            const html = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) placeholder.innerHTML = html;
        } catch (error) {
            console.error('Failed to load component:', error);
        }
    };

    const setActiveNavLink = () => {
        const pageId = document.body.dataset.pageId;
        if (!pageId) return;

        const pageFileMap = {
            'home': 'e-mobility.html',
            'shop': 'e-mobility-shop.html'
            
        };

        const targetFile = pageFileMap[pageId];
        if (!targetFile) return;

        const navLinks = document.querySelectorAll('#main-site-header a, #ebike-menu-desktop a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.includes(targetFile)) {
                link.classList.add('active');
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.querySelector('a').classList.add('active');
                }
            }
        });
    };

    const initTemplating = async () => {
        await Promise.all([
            loadComponent('templates/_header.html', 'header-placeholder'),
            loadComponent('templates/_footer.html', 'footer-placeholder')
        ]);

        setActiveNavLink();

        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    };

    // Only run the templating logic if placeholders exist.
    // This prevents this script from running on the original e-mobility.html page.
    if (document.getElementById('header-placeholder')) {
        initTemplating();
    }
});