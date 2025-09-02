/**
 * Futuristic Scroll Lock System
 * Creates a high-tech scroll experience with section snapping and visual effects
 */

class FuturisticScrollLock {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isAnimating = false;
        this.wheelAccumulator = 0;
        this.wheelTimeout = null;
        this.lastWheelTime = 0;
        this.threshold = 100; // Pixels needed to trigger section change
        this.scrollDuration = 1200; // Animation duration in ms
        this.scrollLockEnabled = true;
        
        // Visual effects
        this.scrollIndicator = null;
        this.transitionOverlay = null;
        
        this.init();
    }

    init() {
        this.findSections();
        this.createScrollIndicator();
        this.createTransitionOverlay();
        this.setupEventListeners();
        this.updateIndicator();
    }

    findSections() {
        this.sections = Array.from(document.querySelectorAll('section[id]')).map((section, index) => ({
            element: section,
            id: section.id,
            index: index,
            offsetTop: section.offsetTop,
            height: section.offsetHeight
        }));
        
        console.log(`Futuristic Scroll: Found ${this.sections.length} sections`);
    }

    createScrollIndicator() {
        // Create futuristic scroll progress indicator
        this.scrollIndicator = document.createElement('div');
        this.scrollIndicator.id = 'futuristic-scroll-indicator';
        this.scrollIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            right: 30px;
            transform: translateY(-50%);
            z-index: 1000;
            width: 4px;
            height: 200px;
            background: linear-gradient(to bottom, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.3), rgba(0, 255, 255, 0.1));
            border-radius: 2px;
            transition: all 0.3s ease;
        `;

        // Add section dots
        const dotsContainer = document.createElement('div');
        dotsContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: -8px;
            width: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        `;

        this.sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(0, 255, 255, 0.3);
                border: 1px solid rgba(0, 255, 255, 0.6);
                transition: all 0.3s ease;
                cursor: pointer;
            `;
            
            dot.addEventListener('click', () => this.scrollToSection(index));
            dotsContainer.appendChild(dot);
        });

        this.scrollIndicator.appendChild(dotsContainer);
        document.body.appendChild(this.scrollIndicator);
    }

    createTransitionOverlay() {
        // Create transition overlay for futuristic effect
        this.transitionOverlay = document.createElement('div');
        this.transitionOverlay.id = 'transition-overlay';
        this.transitionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, 
                rgba(0, 255, 255, 0.1) 0%, 
                rgba(255, 0, 255, 0.1) 50%, 
                rgba(0, 255, 255, 0.1) 100%);
            z-index: 999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
            backdrop-filter: blur(2px);
        `;
        
        document.body.appendChild(this.transitionOverlay);
    }

    setupEventListeners() {
        // Enhanced wheel handling for futuristic scroll lock
        window.addEventListener('wheel', (event) => {
            // Skip if scroll lock is disabled or we're animating
            if (!this.scrollLockEnabled || this.isAnimating) {
                return;
            }
            
            const now = Date.now();
            
            // Reset accumulator if too much time has passed
            if (now - this.lastWheelTime > 200) {
                this.wheelAccumulator = 0;
            }
            
            this.lastWheelTime = now;
            this.wheelAccumulator += event.deltaY;
            
            // Clear existing timeout
            clearTimeout(this.wheelTimeout);
            
            // Check if we should trigger section change (requires faster, more decisive scrolling)
            if (Math.abs(this.wheelAccumulator) > this.threshold && Math.abs(event.deltaY) > 10) {
                event.preventDefault();
                event.stopPropagation();
                
                if (this.wheelAccumulator > 0) {
                    this.scrollToNextSection();
                } else {
                    this.scrollToPrevSection();
                }
                
                this.wheelAccumulator = 0;
                return;
            }
            
            // Allow normal scrolling within sections - reset accumulator after pause
            this.wheelTimeout = setTimeout(() => {
                this.wheelAccumulator = 0;
            }, 200);
            
        }, { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                event.preventDefault();
                this.scrollToNextSection();
            } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
                event.preventDefault();
                this.scrollToPrevSection();
            } else if (event.key === 'Home') {
                event.preventDefault();
                this.scrollToSection(0);
            } else if (event.key === 'End') {
                event.preventDefault();
                this.scrollToSection(this.sections.length - 1);
            }
        });

        // Touch handling
        let touchStartY = 0;
        let touchStartTime = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            const distance = touchStartY - touchEndY;
            const duration = touchEndTime - touchStartTime;
            
            // Trigger on decisive swipes
            if (Math.abs(distance) > 80 && duration < 300) {
                if (distance > 0) {
                    this.scrollToNextSection();
                } else {
                    this.scrollToPrevSection();
                }
            }
        }, { passive: true });

        // Update current section on scroll
        window.addEventListener('scroll', () => {
            if (!this.isAnimating) {
                this.updateCurrentSection();
                this.updateIndicator();
            }
        }, { passive: true });

        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    updateCurrentSection() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Find the section closest to viewport center
        let closestSection = 0;
        let minDistance = Infinity;
        
        this.sections.forEach((section, index) => {
            const rect = section.element.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestSection = index;
            }
        });
        
        if (closestSection !== this.currentSection) {
            this.currentSection = closestSection;
            this.updateActiveNavigation();
        }
    }

    updateActiveNavigation() {
        // Update navigation states
        const navLinks = document.querySelectorAll('[data-section]');
        const currentSectionId = this.sections[this.currentSection]?.id;
        
        navLinks.forEach(link => {
            const targetSection = link.getAttribute('data-section');
            if (targetSection === currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateIndicator() {
        if (!this.scrollIndicator) return;
        
        const dots = this.scrollIndicator.querySelectorAll('.scroll-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentSection) {
                dot.style.background = 'rgba(0, 255, 255, 0.9)';
                dot.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.style.background = 'rgba(0, 255, 255, 0.3)';
                dot.style.boxShadow = 'none';
                dot.style.transform = 'scale(1)';
            }
        });
    }

    scrollToNextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.scrollToSection(this.currentSection + 1);
        }
    }

    scrollToPrevSection() {
        if (this.currentSection > 0) {
            this.scrollToSection(this.currentSection - 1);
        }
    }

    scrollToSection(index) {
        if (this.isAnimating || !this.sections[index]) return;
        
        this.isAnimating = true;
        this.currentSection = index;
        const targetSection = this.sections[index];
        
        // Show transition overlay
        this.showTransitionEffect();
        
        // Scroll to target with enhanced animation
        this.animateScrollTo(targetSection.offsetTop);
        
        // Trigger section animation
        setTimeout(() => {
            this.animateSection(targetSection.element);
        }, 300);
        
        // Update indicator
        this.updateIndicator();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
            this.hideTransitionEffect();
            this.updateActiveNavigation();
        }, this.scrollDuration);
    }

    animateScrollTo(targetY) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = this.scrollDuration;
        const startTime = Date.now();
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        
        const animateScroll = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            const currentY = startY + distance * easedProgress;
            window.scrollTo(0, currentY);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    showTransitionEffect() {
        if (this.transitionOverlay) {
            this.transitionOverlay.style.opacity = '1';
            
            // Add scanning line effect
            const scanLine = document.createElement('div');
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
                animation: scanDown 0.8s ease-out forwards;
            `;
            
            // Add scan animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes scanDown {
                    0% { top: 0; opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            this.transitionOverlay.appendChild(scanLine);
            
            setTimeout(() => {
                if (scanLine.parentNode) {
                    scanLine.parentNode.removeChild(scanLine);
                }
            }, 800);
        }
    }

    hideTransitionEffect() {
        if (this.transitionOverlay) {
            this.transitionOverlay.style.opacity = '0';
        }
    }

    animateSection(sectionElement) {
        // Enhanced section animation with futuristic effects
        const animateElements = sectionElement.querySelectorAll('.section-transition');
        
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate');
                
                // Add futuristic glow effect
                element.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                element.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    element.style.boxShadow = 'none';
                }, 1000);
            }, index * 150);
        });
    }

    handleResize() {
        // Recalculate section positions
        this.sections.forEach(section => {
            section.offsetTop = section.element.offsetTop;
            section.height = section.element.offsetHeight;
        });
    }

    // Public API methods
    goToSection(sectionId) {
        const targetIndex = this.sections.findIndex(section => section.id === sectionId);
        if (targetIndex !== -1) {
            this.scrollToSection(targetIndex);
        }
    }

    enableScrollLock() {
        this.scrollLockEnabled = true;
        this.scrollIndicator.style.opacity = '1';
    }

    disableScrollLock() {
        this.scrollLockEnabled = false;
        this.scrollIndicator.style.opacity = '0.3';
    }

    getCurrentSection() {
        return this.sections[this.currentSection];
    }

    destroy() {
        if (this.scrollIndicator) {
            this.scrollIndicator.remove();
        }
        if (this.transitionOverlay) {
            this.transitionOverlay.remove();
        }
    }
}

// Enhanced Navigation Manager
class EnhancedNavigationManager {
    constructor(scrollManager) {
        this.scrollManager = scrollManager;
        this.init();
    }

    init() {
        this.setupNavigationLinks();
        this.setupMenuInteractions();
    }

    setupNavigationLinks() {
        // Setup all navigation links with enhanced effects
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                // Add click effect
                this.addClickEffect(link);
                
                // Navigate to section
                this.scrollManager.goToSection(targetId);
            });
        });
    }

    setupMenuInteractions() {
        // Enhanced menu interactions
        const menuButton = document.querySelector('.ts-menu-open');
        const menuClose = document.querySelector('.ts-menu-close');
        const menu = document.getElementById('menu');

        if (menuButton && menu) {
            menuButton.addEventListener('click', () => {
                menu.style.transform = 'translateX(0)';
                this.scrollManager.disableScrollLock();
            });
        }

        if (menuClose && menu) {
            menuClose.addEventListener('click', () => {
                menu.style.transform = 'translateX(-100%)';
                this.scrollManager.enableScrollLock();
            });
        }
    }

    addClickEffect(element) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = -size / 2 + 'px';
        ripple.style.marginTop = -size / 2 + 'px';

        element.style.position = 'relative';
        element.appendChild(ripple);

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize the futuristic scroll system
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other scripts to load
    setTimeout(() => {
        window.futuristicScrollLock = new FuturisticScrollLock();
        window.enhancedNavigation = new EnhancedNavigationManager(window.futuristicScrollLock);
        
        // Expose control methods
        window.scrollTo = (sectionId) => {
            window.futuristicScrollLock.goToSection(sectionId);
        };
        
        console.log('Futuristic Scroll Lock System initialized!');
        console.log('Try scrolling with your mouse wheel or use arrow keys');
        
    }, 500);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FuturisticScrollLock, EnhancedNavigationManager };
}
