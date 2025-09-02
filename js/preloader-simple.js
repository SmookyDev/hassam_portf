// Simplified Preloader Animations for Video Editor Portfolio
// Clean, elegant, and fast-loading preloader experience

class SimplePreloaderAnimations {
    constructor() {
        this.elements = {};
        this.loadingProgress = 0;
        this.duration = 7000; // 7 seconds total
        this.startTime = Date.now();

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupSkipButton();
        this.startAnimation();
    }

    cacheElements() {
        this.elements = {
            preloader: document.querySelector('.ts-page-loader'),
            title: document.getElementById('preloader-title'),
            line: document.getElementById('preloader-line'),
            elements: document.getElementById('preloader-elements'),
            progress: document.getElementById('preloader-progress'),
            progressText: document.getElementById('progress-text'),
            portfolioText: document.getElementById('portfolio-text'),
            loadingStatus: document.getElementById('loading-status'),
            skipButton: document.getElementById('skip-preloader')
        };
    }

    setupSkipButton() {
        if (this.elements.skipButton) {
            this.elements.skipButton.addEventListener('click', () => {
                this.finishPreloader();
            });
        }
    }

    startAnimation() {
        // Immediate fade in
        this.showTitle();

        // Staggered animations
        setTimeout(() => this.showLine(), 400);
        setTimeout(() => this.showElements(), 800);
        setTimeout(() => this.showPortfolioText(), 1200);
        setTimeout(() => this.showSkipButton(), 1600);

        // Start progress animation
        this.animateProgress();

        // Auto finish after duration
        setTimeout(() => {
            this.finishPreloader();
        }, this.duration);
    }

    showTitle() {
        if (this.elements.title) {
            this.elements.title.style.opacity = '1';
            this.elements.title.style.transform = 'translateY(0)';
            this.elements.title.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }

    showLine() {
        if (this.elements.line) {
            this.elements.line.style.opacity = '1';
            this.elements.line.style.transform = 'scaleX(1)';
            this.elements.line.style.transition = 'all 0.8s ease-out';
        }
    }

    showElements() {
        if (this.elements.elements) {
            this.elements.elements.style.opacity = '1';
            this.elements.elements.style.transform = 'translateY(0)';
            this.elements.elements.style.transition = 'all 0.6s ease-out';
        }
    }

    showPortfolioText() {
        if (this.elements.portfolioText) {
            this.elements.portfolioText.style.opacity = '1';
            this.elements.portfolioText.style.transition = 'opacity 0.6s ease-out';
        }
    }

    showSkipButton() {
        if (this.elements.skipButton) {
            this.elements.skipButton.style.opacity = '0.7';
            this.elements.skipButton.style.transition = 'opacity 0.4s ease-out';
        }
    }

    animateProgress() {
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / this.duration) * 100, 100);

            if (this.elements.progress) {
                this.elements.progress.style.width = progress + '%';

                // Update loading status
                if (this.elements.loadingStatus) {
                    if (progress < 25) {
                        this.elements.loadingStatus.textContent = 'Loading Assets...';
                    } else if (progress < 50) {
                        this.elements.loadingStatus.textContent = 'Preparing Video...';
                    } else if (progress < 75) {
                        this.elements.loadingStatus.textContent = 'Setting up 3D...';
                    } else if (progress < 95) {
                        this.elements.loadingStatus.textContent = 'Almost Ready...';
                    } else {
                        this.elements.loadingStatus.textContent = 'Complete!';
                    }
                }

                // Update progress text
                if (this.elements.progressText) {
                    this.elements.progressText.textContent = Math.round(progress) + '%';
                }
            }

            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
    }

    finishPreloader() {
        const preloader = this.elements.preloader;
        if (!preloader) return;

        // Simple fade out
        preloader.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        preloader.style.opacity = '0';
        preloader.style.transform = 'scale(0.95)';

        setTimeout(() => {
            preloader.style.display = 'none';
            this.triggerHeroAnimations();

            // Notify 3D controller
            if (window.advanced3D && window.advanced3D.finishPreloader) {
                window.advanced3D.finishPreloader();
            }
        }, 800);
    }

    triggerHeroAnimations() {
        // Show hero elements
        const heroElements = [
            '.hero-tagline',
            '.hero-logo',
            '.hero-intro',
            '.hero-portfolio',
            '.hero-cta',
            '.scroll-indicator'
        ];

        heroElements.forEach((selector, index) => {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.transition = 'all 0.8s ease-out';
                }
            }, index * 200);
        });
    }
}

// Enhanced Menu Controller
class SimpleMenuController {
    constructor() {
        this.menu = document.getElementById('menu');
        this.menuOpen = document.querySelector('.ts-menu-open');
        this.menuClose = document.querySelector('.ts-menu-close');
        this.isOpen = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.menuOpen) {
            this.menuOpen.addEventListener('click', () => this.openMenu());
        }

        if (this.menuClose) {
            this.menuClose.addEventListener('click', () => this.closeMenu());
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        if (this.isOpen || !this.menu) return;

        this.isOpen = true;
        this.menu.style.display = 'block';
        this.menu.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';

        // Animate menu items
        const menuItems = this.menu.querySelectorAll('.menu-nav-link');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.5s ease-out';
            }, index * 100);
        });
    }

    closeMenu() {
        if (!this.isOpen || !this.menu) return;

        this.isOpen = false;
        this.menu.style.transform = 'translateX(-100%)';
        document.body.style.overflow = '';

        // Reset menu items
        const menuItems = this.menu.querySelectorAll('.menu-nav-link');
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'none';
        });

        setTimeout(() => {
            this.menu.style.display = 'none';
        }, 500);
    }
}

// Enhanced Video Effects
class SimpleVideoEffects {
    constructor() {
        this.videos = document.querySelectorAll('.video-item video');
        this.init();
    }

    init() {
        this.setupVideoHovers();
        this.setupVideoModal();
    }

    setupVideoHovers() {
        this.videos.forEach(video => {
            const container = video.closest('.video-item');
            if (!container) return;

            container.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log('Video autoplay prevented'));
                container.style.transform = 'scale(1.02)';
                container.style.transition = 'transform 0.3s ease-out';
            });

            container.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
                container.style.transform = 'scale(1)';
            });
        });
    }

    setupVideoModal() {
        // Add click handlers for video items
        const videoItems = document.querySelectorAll('.video-item');

        videoItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoSrc = item.dataset.video;
                const title = item.dataset.title;
                const description = item.dataset.description;

                if (videoSrc) {
                    this.openVideoModal(videoSrc, title, description);
                }
            });
        });
    }

    openVideoModal(videoSrc, title, description) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'video-modal fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease-out';

        // Modal content
        modal.innerHTML = `
            <div class="modal-content bg-black rounded-xl overflow-hidden max-w-4xl w-full max-h-[80vh]">
                <div class="relative">
                    <video class="w-full h-auto" controls autoplay>
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                    <button class="close-modal absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6 text-white">
                    <h3 class="text-xl font-medium mb-2">${title}</h3>
                    <p class="text-gray-300">${description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        // Close handlers
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader if it exists
    if (document.querySelector('.ts-page-loader')) {
        window.preloaderAnimations = new SimplePreloaderAnimations();
    }

    // Initialize other components
    window.menuController = new SimpleMenuController();
    window.videoEffects = new SimpleVideoEffects();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SimplePreloaderAnimations,
        SimpleMenuController,
        SimpleVideoEffects
    };
}