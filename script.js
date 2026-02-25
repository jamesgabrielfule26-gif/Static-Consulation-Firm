/* ============================================================
   CRUZ CONSULTING — Shared JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Active Nav Link ---------- */
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ---------- Sticky Header ---------- */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Mobile Nav ---------- */
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (hamburger && mobileNav) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            mobileOverlay?.classList.toggle('visible');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);
        mobileOverlay?.addEventListener('click', toggleMenu);
        mobileNav.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', toggleMenu)
        );
    }

    /* ---------- Scroll Animations (Intersection Observer) ---------- */
    const animatedEls = document.querySelectorAll('.animate-on-scroll');
    if (animatedEls.length) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        animatedEls.forEach(el => observer.observe(el));
    }

    /* ---------- Stat Counter Animation ---------- */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    /* ---------- Service Accordion ---------- */
    document.querySelectorAll('.service-detail').forEach(item => {
        const header = item.querySelector('.service-header');
        header?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all others first
            document.querySelectorAll('.service-detail.open').forEach(other => {
                if (other !== item) other.classList.remove('open');
            });
            item.classList.toggle('open', !isOpen);
        });
    });

    /* ---------- Case Study Filter ---------- */
    const filterTabs = document.querySelectorAll('.filter-tab');
    const caseCards = document.querySelectorAll('.case-card');

    if (filterTabs.length && caseCards.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;
                caseCards.forEach(card => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.style.display = show ? '' : 'none';
                    if (show) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.4s, transform 0.4s';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    }
                });
            });
        });
    }

    /* ---------- Contact Form Validation ---------- */
    const contactForm = document.getElementById('contact-form');
    const formContainer = document.getElementById('form-container');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;

            // Clear previous errors
            contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

            // Name
            const name = contactForm.querySelector('#name');
            if (!name.value.trim()) { name.classList.add('error'); valid = false; }

            // Email
            const email = contactForm.querySelector('#email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) { email.classList.add('error'); valid = false; }

            // Company
            const company = contactForm.querySelector('#company');
            if (!company.value.trim()) { company.classList.add('error'); valid = false; }

            // Service
            const service = contactForm.querySelector('#service');
            if (!service.value) { service.classList.add('error'); valid = false; }

            // Message
            const message = contactForm.querySelector('#message');
            if (!message.value.trim()) { message.classList.add('error'); valid = false; }

            if (valid) {
                formContainer.style.display = 'none';
                formSuccess.classList.add('visible');
            }
        });

        // Clear error on input
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    }

    /* ---------- Smooth Scroll for Anchor Links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
