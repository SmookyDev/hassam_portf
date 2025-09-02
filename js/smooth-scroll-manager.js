/**
 * Futuristic Scroll Lock Manager
 * Provides section-to-section snap scrolling with futuristic visual effects
 */

class FuturisticScrollManager {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.wheelThreshold = 80;
        this.touchThreshold = 50;
        this.scrollDuration = 1200;
        this.scrollLockEnabled = true;
        this.wheelDeltaAccumulator = 0;
        this.lastWheelTime = 0;
        
        this.init();
    }

    init() {
        this.identifySections();
        this.setupEventListeners();
        this.setupNavigationLinks();
        this.updateCurrentSection();
    }

    identifySections() {
        this.sections = Array.from(document.querySelectorAll('section[id]')).map(section => ({
            element: section,
            id: section.id,
            offsetTop: section.offsetTop,
            height: section.offsetHeight
        }));
        
        console.log(`Found ${this.sections.length} sections:`, this.sections.map(s => s.id));
    }

    setupEventListeners() {
        // Smooth wheel scrolling
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Touch scrolling for mobile
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
            
            // Only trigger if it's a quick, decisive swipe
            if (Math.abs(distance) > this.touchThreshold && duration < 300) {
                if (distance > 0) {
                    this.scrollToNextSection();
                } else {
                    this.scrollToPrevSection();
                }
            }
        }, { passive: true });

        // Update current section on regular scroll
        window.addEventListener('scroll', this.updateCurrentSection.bind(this), { passive: true });
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupNavigationLinks() {
        // Setup all navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetIndex = this.sections.findIndex(section => section.id === targetId);
                
                if (targetIndex !== -1) {
                    this.scrollToSection(targetIndex);
                }
            });
        });
    }

    handleWheel(event) {
        // Only intercept wheel events for futuristic scroll locking when conditions are met
        if (this.isScrolling) {
            event.preventDefault();
            return;
        }

        // Check if we're near a section boundary for futuristic snap effect
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const currentSectionElement = this.sections[this.currentSection]?.element;
        
        if (currentSectionElement) {
            const rect = currentSectionElement.getBoundingClientRect();
            const sectionTop = rect.top + currentScrollY;
            const sectionBottom = sectionTop + rect.height;
            
            // Futuristic snap behavior: only trigger on large wheel movements
            if (Math.abs(event.deltaY) > 100) {
                // Check if we're close to section boundaries
                const distanceFromTop = Math.abs(currentScrollY - sectionTop);
                const distanceFromBottom = Math.abs(currentScrollY - (sectionBottom - windowHeight));
                
                if (distanceFromTop < 100 || distanceFromBottom < 100) {
                    event.preventDefault();
                    
                    clearTimeout(this.scrollTimeout);
                    this.scrollTimeout = setTimeout(() => {
                        if (event.deltaY > 0) {
                            this.scrollToNextSection();
                        } else {
                            this.scrollToPrevSection();
                        }
                    }, 100);
                    return;
                }
            }
        }
        
        // Allow normal scrolling for everything else
        // Normal scroll behavior is preserved
    }

    updateCurrentSection() {
        if (this.isScrolling) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Find the section that's most visible
        let mostVisibleSection = 0;
        let maxVisibility = 0;
        
        this.sections.forEach((section, index) => {
            const rect = section.element.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibility = Math.max(0, visibleHeight) / windowHeight;
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisibleSection = index;
            }
        });
        
        this.currentSection = mostVisibleSection;
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        // Update navigation active states
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
        if (this.isScrolling || !this.sections[index]) return;
        
        this.isScrolling = true;
        this.currentSection = index;
        const targetSection = this.sections[index];
        
        // Smooth scroll to target
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        
        // Trigger section animation
        this.animateSection(targetSection.element);
        
        // Reset scrolling flag
        setTimeout(() => {
            this.isScrolling = false;
            this.updateActiveNavigation();
        }, this.scrollDuration);
    }

    animateSection(sectionElement) {
        // Trigger entrance animations for the section
        const animateElements = sectionElement.querySelectorAll('.section-transition');
        
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate');
            }, index * 100);
        });
    }

    handleResize() {
        // Recalculate section positions
        this.sections.forEach(section => {
            section.offsetTop = section.element.offsetTop;
            section.height = section.element.offsetHeight;
        });
    }

    // Public methods for external control
    goToSection(sectionId) {
        const targetIndex = this.sections.findIndex(section => section.id === sectionId);
        if (targetIndex !== -1) {
            this.scrollToSection(targetIndex);
        }
    }

    getCurrentSection() {
        return this.sections[this.currentSection];
    }
    
    // Enable/disable smooth scrolling
    enableSmoothScrolling() {
        this.smoothScrollingEnabled = true;
    }
    
    disableSmoothScrolling() {
        this.smoothScrollingEnabled = false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smoothScrollManager = new SmoothScrollManager();
    
    // Expose to global scope for external control
    window.scrollTo = (sectionId) => {
        window.smoothScrollManager.goToSection(sectionId);
    };
});
