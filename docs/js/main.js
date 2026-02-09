// ═══════════════════════════════════════════════════════════════════════════
// DOJ SAN ANDREAS - MAIN JAVASCRIPT
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initSearch();
    initBackToTop();
    initSmoothScroll();
    initAnimations();
});

// ═══════════════════════════════════════════════════════════════════════════
// THEME SWITCHING
// ═══════════════════════════════════════════════════════════════════════════
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (!prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileToggle.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile nav when clicking links
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileToggle.textContent = '☰';
                document.body.style.overflow = '';
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════
function initSearch() {
    const searchInput = document.querySelector('#docs-search');
    const articleBlocks = document.querySelectorAll('.article-block');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    if (searchInput && articleBlocks.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            articleBlocks.forEach(block => {
                const text = block.textContent.toLowerCase();
                const matches = query === '' || text.includes(query);
                block.style.display = matches ? '' : 'none';
            });
            
            // Update sidebar visibility based on visible articles
            if (query !== '') {
                sidebarLinks.forEach(link => {
                    const targetId = link.getAttribute('href')?.replace('#', '');
                    if (targetId) {
                        const targetSection = document.getElementById(targetId);
                        if (targetSection) {
                            const hasVisibleArticles = targetSection.querySelectorAll('.article-block:not([style*="display: none"])').length > 0;
                            link.style.opacity = hasVisibleArticles ? '1' : '0.3';
                        }
                    }
                });
            } else {
                sidebarLinks.forEach(link => link.style.opacity = '1');
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// BACK TO TOP BUTTON
// ═══════════════════════════════════════════════════════════════════════════
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL & ACTIVE LINK HIGHLIGHTING
// ═══════════════════════════════════════════════════════════════════════════
function initSmoothScroll() {
    // Highlight active section in sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    const sections = [];
    
    sidebarLinks.forEach(link => {
        const targetId = link.getAttribute('href').replace('#', '');
        const section = document.getElementById(targetId);
        if (section) {
            sections.push({ link, section });
        }
    });
    
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    const activeLink = sections.find(s => s.section === entry.target)?.link;
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-100px 0px -70% 0px' });
        
        sections.forEach(({ section }) => observer.observe(section));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════
function initAnimations() {
    const animatedElements = document.querySelectorAll('.card, .article-block, .about-content, .about-image');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR SCROLL EFFECT
// ═══════════════════════════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            navbar.style.padding = '';
            navbar.style.boxShadow = '';
        }
    }
});
