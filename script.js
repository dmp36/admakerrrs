// ========================================
// SMOOTH SCROLL & ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // FAQ Accordion
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ========================================
    // Scroll Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animate sections on scroll
    const animateOnScroll = document.querySelectorAll(
        '.highlight-card, .pricing-card, .why-content, .testimonial-card, .faq-item'
    );

    animateOnScroll.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // ========================================
    // Button Click Effects with Ripple
    // ========================================
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Add pulse animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Scroll to pricing for "Buy Pass Now" buttons
            if (this.textContent.includes('Buy Pass') || this.textContent.includes('Book Now')) {
                e.preventDefault();
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Scroll to highlights for "View Event Details"
            if (this.textContent.includes('View Event Details')) {
                e.preventDefault();
                const highlightsSection = document.getElementById('highlights');
                if (highlightsSection) {
                    highlightsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ========================================
    // Smooth Scroll for Internal Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // Parallax Effect on Hero
    // ========================================
    const heroBg = document.querySelector('.hero-bg');
    const heroLogo = document.getElementById('heroLogo');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Parallax background
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }

        // Logo fade and scale
        if (heroLogo) {
            const opacity = Math.max(0, 1 - scrollTop / 500);
            const scale = Math.max(0.8, 1 - scrollTop / 1000);
            heroLogo.style.opacity = opacity;
            heroLogo.style.transform = `scale(${scale})`;
        }

        lastScrollTop = scrollTop;
    });

    // ========================================
    // Counter Animation for Stats
    // ========================================
    const stats = document.querySelectorAll('.stat');
    const animatedStats = new Set();

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats.has(entry.target)) {
                animatedStats.add(entry.target);
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/\D/g, ''));

        let current = 0;
        const increment = number / 50; // 50 steps
        const duration = 2000; // 2 seconds
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }

            let displayText = Math.floor(current).toString();
            if (hasPlus) displayText += '+';
            if (hasPercent) displayText += '%';

            element.textContent = displayText;
        }, stepTime);
    }

    // ========================================
    // Dynamic Gradient Movement
    // ========================================
    let gradientAngle = 135;
    setInterval(() => {
        gradientAngle = (gradientAngle + 1) % 360;

        const primaryButtons = document.querySelectorAll('.btn-primary');
        primaryButtons.forEach(btn => {
            if (!btn.matches(':hover')) {
                btn.style.background = `linear-gradient(${gradientAngle}deg, var(--gold-primary), var(--gold-dark))`;
            }
        });
    }, 50);

    // ========================================
    // Cursor Trail Effect (Desktop Only)
    // ========================================
    if (window.innerWidth > 768) {
        const coords = { x: 0, y: 0 };
        const circles = [];
        const colors = ['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0.2)', 'rgba(212, 175, 55, 0.1)'];

        // Create cursor trail circles
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.style.position = 'fixed';
            circle.style.top = '0';
            circle.style.left = '0';
            circle.style.width = '20px';
            circle.style.height = '20px';
            circle.style.borderRadius = '50%';
            circle.style.backgroundColor = colors[i];
            circle.style.pointerEvents = 'none';
            circle.style.zIndex = '9999';
            circle.style.transition = 'transform 0.1s ease';
            document.body.appendChild(circle);
            circles.push(circle);
        }

        window.addEventListener('mousemove', (e) => {
            coords.x = e.clientX;
            coords.y = e.clientY;
        });

        function animateCircles() {
            let x = coords.x;
            let y = coords.y;

            circles.forEach((circle, index) => {
                circle.style.left = x - 10 + 'px';
                circle.style.top = y - 10 + 'px';
                circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

                const nextCircle = circles[index + 1] || circles[0];
                x += (nextCircle.offsetLeft - x) * 0.3;
                y += (nextCircle.offsetTop - y) * 0.3;
            });

            requestAnimationFrame(animateCircles);
        }

        animateCircles();
    }

    // ========================================
    // Add Glow Effect on Button Hover
    // ========================================
    const allButtons = document.querySelectorAll('.btn, .pricing-card, .highlight-card');

    allButtons.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ========================================
    // Lazy Load Images with Placeholder
    // ========================================
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        // Add error handling for missing images
        img.addEventListener('error', function () {
            // Create a placeholder with golden border
            this.style.background = 'linear-gradient(135deg, var(--black-lighter), var(--black-light))';
            this.style.border = '2px solid var(--gold-primary)';
        });

        imageObserver.observe(img);
    });

    // ========================================
    // Performance Optimization: Throttle Scroll
    // ========================================
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func(...args);
        };
    }

    // ========================================
    // Modal & Form Handling
    // ========================================
    const modal = document.getElementById('registrationModal');
    const modalClose = document.getElementById('modalClose');
    const registrationForm = document.getElementById('registrationForm');
    const newsletterForm = document.getElementById('newsletterForm');

    // Open modal on "Buy Pass" or "Book Now" clicks
    document.body.addEventListener('click', function (e) {
        if (e.target.matches('.btn')) {
            const text = e.target.textContent.toLowerCase();
            if (text.includes('buy pass') || text.includes('book now')) {
                e.preventDefault();
                const pricingCard = e.target.closest('.pricing-card');

                // Pre-select pass type if clicked from pricing card
                if (pricingCard) {
                    const passType = pricingCard.querySelector('h3').textContent.split(' ')[0].toLowerCase();
                    const select = document.getElementById('passTypeSelect');
                    if (select) select.value = passType;
                }

                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            }
        }
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on click outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Handle Registration Form Submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = registrationForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                alert('\u{1F389} Registration Successful! Welcome to Ad Makerrrs 2026. Check your email for details.');
                modal.classList.remove('active');
                document.body.style.overflow = '';
                registrationForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }



    // Apply throttle to scroll events
    window.addEventListener('scroll', throttle(() => {
        // Any additional scroll logic goes here
    }, 100));

    console.log('Ad Makkerrrs landing page loaded successfully! \u{1F3AF}');
});

