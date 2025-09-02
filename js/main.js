// Main JavaScript for HASSAM TAHIR Portfolio Replica

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handlePageLoad();
    }

    setupEventListeners() {
        // Menu toggle functionality
        const menuOpenBtn = document.querySelector('.ts-menu-open');
        const menuCloseBtn = document.querySelector('.ts-menu-close');
        const menu = document.getElementById('menu');

        if (menuOpenBtn && menu) {
            menuOpenBtn.addEventListener('click', () => {
                menu.classList.remove('hidden');
                menu.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        }

        if (menuCloseBtn && menu) {
            menuCloseBtn.addEventListener('click', () => {
                menu.classList.add('hidden');
                menu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        }

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) {
                menu.classList.add('hidden');
                menu.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });

        // Smooth scroll for anchor links - now handled by futuristic scroll lock
        document.querySelectorAll('.ts-anchor').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Use futuristic scroll lock if available, otherwise fallback
                if (window.futuristicScrollLock) {
                    window.futuristicScrollLock.scrollToSection(0);
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Image link hover effects
        this.setupImageLinkHovers();

        // Scroll-triggered animations
        this.setupScrollAnimations();

        // Parallax gallery interactions
        this.setupParallaxGallery();

        // Scroll-triggered animations
        this.setupScrollAnimations();
    }

    setupImageLinkHovers() {
        const imageLinks = document.querySelectorAll('.ts-image-link');

        imageLinks.forEach(link => {
            const bgElement = link.querySelector('.image-link__bg');

            link.addEventListener('mouseenter', () => {
                link.classList.add('is-hover');
                // Add opacity effects to other image links
                imageLinks.forEach(otherLink => {
                    if (otherLink !== link) {
                        otherLink.classList.add('is-opacity');
                    }
                });
            });

            link.addEventListener('mouseleave', () => {
                link.classList.remove('is-hover');
                // Remove opacity effects from all image links
                imageLinks.forEach(otherLink => {
                    otherLink.classList.remove('is-opacity');
                });
            });
        });
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const scrollElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in, .scroll-rotate-in');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });

        // Parallax effect for video backgrounds
        this.setupParallaxEffects();
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupBackgroundColorChanges() {
        const bg = document.getElementById('bg');
        const body = document.body;
        const header = document.getElementById('header');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            // Change background color based on scroll position
            if (scrollPosition > windowHeight * 0.5) {
                bg.setAttribute('data-color', 'bright');
                body.setAttribute('data-bg-color', 'bright');
                header.setAttribute('data-color', 'bright');
            } else {
                bg.setAttribute('data-color', 'dark');
                body.setAttribute('data-bg-color', 'dark');
                header.setAttribute('data-color', 'dark');
            }
        });
    }

    setupParallaxGallery() {
        const galleryImages = document.querySelectorAll('.ts-parallax-gallery-image');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                } else {
                    entry.target.classList.remove('is-active');
                }
            });
        }, observerOptions);

        galleryImages.forEach(image => {
            observer.observe(image);
        });

        // Parallax scrolling effect
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            galleryImages.forEach((image, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrollY * speed);
                image.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    initializeComponents() {
        // Initialize moon canvas animation
        this.initMoonCanvas();

        // Initialize hero video
        this.initHeroVideo();

        // Initialize page loader
        this.initPageLoader();
    }

    initMoonCanvas() {
        const canvas = document.getElementById('moon');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Create animated moon effect
        let animationFrame;
        let time = 0;

        const drawMoon = () => {
            ctx.clearRect(0, 0, width, height);

            // Main moon circle
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.3;

            // Create gradient
            const gradient = ctx.createRadialGradient(
                centerX - radius * 0.3, centerY - radius * 0.3, 0,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, '#E5E1DC');
            gradient.addColorStop(0.7, '#A5A5A5');
            gradient.addColorStop(1, '#545454');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Add subtle animation
            time += 0.01;
            const pulseRadius = radius + Math.sin(time) * 2;

            // Outer glow
            ctx.shadowColor = '#E5E1DC';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();

            animationFrame = requestAnimationFrame(drawMoon);
        };

        drawMoon();
    }

    initHeroVideo() {
        const heroVideo = document.getElementById('hero-video');
        // const video = heroVideo ? .querySelector('video');
        const video = heroVideo ?.querySelector('video');

        if (video) {
            video.addEventListener('loadeddata', () => {
                heroVideo.classList.remove('is-loading');
            });

            video.addEventListener('canplaythrough', () => {
                heroVideo.classList.remove('is-loading');
            });
        }
    }

    initPageLoader() {
        const pageLoader = document.querySelector('.ts-page-loader');
        const openingBg = document.getElementById('opening-bg');

        // Simulate page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (pageLoader) {
                    pageLoader.classList.add('is-hidden');
                }
                if (openingBg) {
                    openingBg.classList.add('is-hidden');
                }
            }, 1000);
        });
    }

    handlePageLoad() {
        // Remove loading states after page load
        window.addEventListener('load', () => {
            const loadingElements = document.querySelectorAll('.is-loading');
            setTimeout(() => {
                loadingElements.forEach(element => {
                    element.classList.remove('is-loading');
                });
            }, 1500);
        });
    }
}

// Futuristic scroll integration helper
class ScrollIntegration {
    constructor() {
        this.setupScrollIntegration();
    }

    setupScrollIntegration() {
        // Wait for futuristic scroll lock to be available
        const waitForScrollLock = () => {
            if (window.futuristicScrollLock) {
                this.integrateFuturisticScroll();
            } else {
                setTimeout(waitForScrollLock, 100);
            }
        };
        
        waitForScrollLock();
    }
    
    integrateFuturisticScroll() {
        // Override default scroll behavior for internal links with futuristic effects
        document.querySelectorAll('a[href^="#"]:not(.ts-anchor)').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                
                if (window.futuristicScrollLock) {
                    window.futuristicScrollLock.goToSection(targetId);
                }
            });
        });
        
        console.log('Futuristic scroll integration complete!');
    }
}

// Text link animations
class TextLinkAnimations {
    constructor() {
        this.setupTextLinks();
    }

    setupTextLinks() {
        const textLinks = document.querySelectorAll('.ts-text-link');

        textLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });
    }
}

// More button animations
class MoreButtonAnimations {
    constructor() {
        this.setupMoreButtons();
    }

    setupMoreButtons() {
        const moreButtons = document.querySelectorAll('.ts-more');

        moreButtons.forEach(button => {
            const bgSpan = button.querySelector('span:first-child');

            button.addEventListener('mouseenter', () => {
                if (bgSpan) {
                    bgSpan.style.height = '100%';
                    bgSpan.style.width = '100%';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (bgSpan) {
                    bgSpan.style.height = '0';
                    bgSpan.style.width = '0';
                }
            });
        });
    }
}

// Scroll progress indicator
class ScrollProgress {
    constructor() {
        this.setupScrollProgress();
    }

    setupScrollProgress() {
        const scrollNav = document.querySelector('.scroll-nav__inside');
        if (!scrollNav) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;

            scrollNav.style.transform = `translateY(${scrollPercent * 100}%)`;
        });
    }
}

// Cursor following effect (stalker)
class CursorStalker {
    constructor() {
        this.cursor = null;
        this.setupCursor();
    }

    setupCursor() {
        // Create cursor element
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-stalker';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: var(--pampas);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(this.cursor);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            this.cursor.style.opacity = '1';
        });

        // Hide cursor when leaving viewport
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        // Scale cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .ts-image-link');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                this.cursor.style.backgroundColor = 'rgba(229, 225, 220, 0.5)';
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursor.style.backgroundColor = 'var(--pampas)';
            });
        });
    }
}

// Lazy loading for images
class LazyImageLoader {
    constructor() {
        this.setupLazyLoading();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s ease';

                    img.onload = () => {
                        img.style.opacity = '1';
                    };

                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Responsive text scaling
class ResponsiveText {
    constructor() {
        this.setupResponsiveText();
    }

    setupResponsiveText() {
        const resizeHandler = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Adjust hero text size based on viewport
            const heroTitle = document.querySelector('#hero h1');
            if (heroTitle && vw < 768) {
                heroTitle.style.fontSize = `${Math.max(1.5, vw / 250)}rem`;
            }

            // Adjust large text elements
            const largeTexts = document.querySelectorAll('text-6xl,text-[6.5rem]');
            largeTexts.forEach(text => {
                if (vw < 768) {
                    text.style.fontSize = `${Math.max(2, vw / 120)}rem`;
                }
            });
        };

        window.addEventListener('resize', resizeHandler);
        resizeHandler(); // Initial call
    }
}

// Scroll-triggered background changes
class ScrollBackgroundChanger {
    constructor() {
        this.setupBackgroundChanger();
    }

    setupBackgroundChanger() {
        const sections = [
            { element: document.getElementById('hero'), color: 'dark' },
            { element: document.getElementById('parallax-gallery'), color: 'dark' },
            { element: document.getElementById('works-gallery'), color: 'bright' }
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = sections.find(s => s.element === entry.target);
                    if (section) {
                        this.changeBgColor(section.color);
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => {
            if (section.element) {
                observer.observe(section.element);
            }
        });
    }

    changeBgColor(color) {
        const bg = document.getElementById('bg');
        const body = document.body;
        const header = document.getElementById('header');

        if (bg) bg.setAttribute('data-color', color);
        if (body) body.setAttribute('data-bg-color', color);
        if (header) header.setAttribute('data-color', color);
    }
}

// Text reveal animations
class TextRevealAnimations {
    constructor() {
        this.setupTextReveals();
    }

    setupTextReveals() {
        const textElements = document.querySelectorAll('h1, h2, h3, p');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        textElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.setupOptimizations();
    }

    setupOptimizations() {
        // Throttle scroll events
        this.throttleScrollEvents();

        // Preload critical images
        this.preloadCriticalImages();

        // Optimize animations for reduced motion
        this.respectReducedMotion();
    }

    throttleScrollEvents() {
        let ticking = false;

        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Dispatch custom scroll event
                    window.dispatchEvent(new CustomEvent('optimizedScroll'));
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    preloadCriticalImages() {
        const criticalImages = [
            'images/hero/fv-moving.png',
            'images/hero/fv-moving-sp.png',
            'images/hero/shadow-image.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Error handling and fallbacks
class ErrorHandler {
    constructor() {
        this.setupErrorHandling();
    }

    setupErrorHandling() {
        // Handle image loading errors
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', (e) => {
                console.warn('Image failed to load:', e.target.src);
                // You could set a fallback image here
                // e.target.src = 'images/fallback.jpg';
            });
        });

        // Handle video loading errors
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('error', (e) => {
                console.warn('Video failed to load:', e.target.src);
                // Hide video container if video fails
                video.style.display = 'none';
            });
        });

        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    }
}

// Contact form functionality
class ContactForm {
    constructor() {
        this.setupContactForm();
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                project: formData.get('project'),
                budget: formData.get('budget'),
                message: formData.get('message')
            };

            // Create mailto link
            const subject = encodeURIComponent('Project Inquiry from ' + data.name);
            const body = encodeURIComponent(
                `Name: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Company: ${data.company || 'Not provided'}\n` +
                `Project Type: ${data.project || 'Not specified'}\n` +
                `Budget Range: ${data.budget || 'Not specified'}\n\n` +
                `Message:\n${data.message}`
            );

            // Open email client
            window.location.href = `mailto:taaaaiki.mode@gmail.com?subject=${subject}&body=${body}`;

            // Show success message
            setTimeout(() => {
                alert('Thank you for your message! Your email client should open now.');
            }, 100);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    new ScrollIntegration();
    new TextLinkAnimations();
    new MoreButtonAnimations();
    new ScrollProgress();
    new CursorStalker();
    new ResponsiveText();
    new ScrollBackgroundChanger();
    new TextRevealAnimations();
    new PerformanceOptimizer();
    new ErrorHandler();
    new ContactForm();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PortfolioApp,
        ScrollIntegration,
        TextLinkAnimations,
        MoreButtonAnimations,
        ScrollProgress,
        CursorStalker,
        ResponsiveText,
        ScrollBackgroundChanger,
        TextRevealAnimations,
        PerformanceOptimizer,
        ErrorHandler
    };
}
