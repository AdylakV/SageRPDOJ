/* ═══════════════════════════════════════════════════════════════════════════
   DOJ SAN ANDREAS - IMMERSIVE JAVASCRIPT
   Premium Effects & Interactions
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initScrollEffects();
    initSearch();
    initParticles();
    initAnimations();
    initCountUp();
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
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
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

            if (match && query !== '') {
                article.style.animation = 'none';
                article.offsetHeight; // Trigger reflow
                article.style.animation = 'highlight 0.5s ease';
            }
        });

        // Show/hide sections based on visible articles
        document.querySelectorAll('.docs-content section').forEach(section => {
            const visibleArticles = section.querySelectorAll('.article-block[style="display: block"], .article-block:not([style*="display"])');
            const hasVisible = Array.from(section.querySelectorAll('.article-block')).some(a => a.style.display !== 'none');
            section.style.display = hasVisible || query === '' ? 'block' : 'none';
        });
    });
}

/* ═══════════════ PARTICLE SYSTEM ═══════════════ */
function initParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        --particle-opacity: ${opacity};
    `;

    container.appendChild(particle);
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
    document.querySelectorAll('.fade-in, .card, .article-block, .about-feature, .stat-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* ═══════════════ COUNT UP ANIMATION ═══════════════ */
function initCountUp() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.textContent;

                // Check if it's a number
                const numericValue = parseInt(value.replace(/\D/g, ''));
                if (!isNaN(numericValue)) {
                    animateNumber(target, numericValue, value.includes('+'));
                }

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target, hasPlus) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current + (hasPlus ? '+' : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
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

/* ═══════════════ HIGHLIGHT ANIMATION ═══════════════ */
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
        50% { box-shadow: 0 0 20px 5px rgba(212, 175, 55, 0.2); }
        100% { box-shadow: none; }
    }
    
    .particle {
        opacity: var(--particle-opacity, 0.5);
    }
`;
document.head.appendChild(style);

/* ═══════════════ CURSOR GLOW EFFECT ═══════════════ */
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
