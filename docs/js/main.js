/* ═══════════════════════════════════════════════════════════════════════════
   DOJ SAN ANDREAS - PROFESSIONAL JAVASCRIPT
   Clean & Elegant Interactions
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initScrollEffects();
    initSearch();
    initAnimations();
});

/* ═══════════════ THEME TOGGLE ═══════════════ */
function initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('doj-theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    toggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('doj-theme', next);
        updateThemeIcon(next);
    });
}

function updateThemeIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/* ═══════════════ NAVIGATION ═══════════════ */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile toggle
    mobileToggle?.addEventListener('click', () => {
        mobileNav?.classList.toggle('active');
        mobileToggle.textContent = mobileNav?.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile nav on link click
    mobileNav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileToggle.textContent = '☰';
        });
    });
}

/* ═══════════════ SCROLL EFFECTS ═══════════════ */
function initScrollEffects() {
    const backToTop = document.querySelector('.back-to-top');

    // Back to top visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    }, { passive: true });

    // Back to top click
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ═══════════════ SEARCH FUNCTIONALITY ═══════════════ */
function initSearch() {
    const searchInput = document.getElementById('docs-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const articles = document.querySelectorAll('.article-block');

        articles.forEach(article => {
            const text = article.textContent.toLowerCase();
            const match = query === '' || text.includes(query);
            article.style.display = match ? 'block' : 'none';
        });

        // Show/hide sections based on visible articles
        document.querySelectorAll('.docs-content section').forEach(section => {
            const hasVisible = Array.from(section.querySelectorAll('.article-block'))
                .some(a => a.style.display !== 'none');
            section.style.display = hasVisible || query === '' ? 'block' : 'none';
        });
    });
}

/* ═══════════════ SCROLL ANIMATIONS ═══════════════ */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/* ═══════════════ SIDEBAR ACTIVE STATE ═══════════════ */
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.docs-content section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });
