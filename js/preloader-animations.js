// Enhanced Preloader Animations for Video Editor Portfolio
// Handles the sophisticated preloader experience with realistic loading simulation

class PreloaderAnimations {
    constructor() {
        this.elements = {};
        this.loadingProgress = 0;
        this.loadingSteps = [
            { text: 'Initializing 3D Environment...', duration: 800 },
            { text: 'Loading Video Assets...', duration: 1200 },
            { text: 'Compiling Shaders...', duration: 600 },
            { text: 'Preparing Timeline...', duration: 400 },
            { text: 'Setting up Color Grading...', duration: 700 },
            { text: 'Loading Motion Graphics...', duration: 900 },
            { text: 'Optimizing Performance...', duration: 500 },
            { text: 'Finalizing Experience...', duration: 600 }
        ];
        this.currentStep = 0;
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
            loadingStats: document.getElementById('loading-stats'),
            skipButton: document.getElementById('skip-preloader'),
            assetsLoaded: document.getElementById('assets-loaded'),
            shadersLoaded: document.getElementById('shaders-loaded'),
            modelsLoaded: document.getElementById('models-loaded')
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
        // Initial fade in sequence
        setTimeout(() => this.animateTitle(), 300);
        setTimeout(() => this.animateLine(), 800);
        setTimeout(() => this.animateElements(), 1200);
        setTimeout(() => this.animatePortfolioText(), 1600);
        setTimeout(() => this.animateStats(), 2000);
        setTimeout(() => this.animateSkipButton(), 2400);
        
        // Start loading simulation
        setTimeout(() => this.startLoadingSimulation(), 1000);
    }

    animateTitle() {
        if (this.elements.title) {
            this.elements.title.style.opacity = '1';
            this.elements.title.style.transform = 'translateY(0)';
            
            // Add typewriter effect
            const text = this.elements.title.textContent;
            this.elements.title.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    this.elements.title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 80);
                }
            };
            typeWriter();
        }
    }

    animateLine() {
        if (this.elements.line) {
            this.elements.line.style.opacity = '1';
            this.elements.line.style.transform = 'scaleX(1)';
            this.elements.line.style.transformOrigin = 'center';
            this.elements.line.style.transition = 'all 0.8s ease-out';
        }
    }

    animateElements() {
        if (this.elements.elements) {
            this.elements.elements.style.opacity = '1';
            this.elements.elements.style.transform = 'translateY(0)';
            this.elements.elements.style.transition = 'all 0.6s ease-out';
        }
    }

    animatePortfolioText() {
        if (this.elements.portfolioText) {
            this.elements.portfolioText.style.opacity = '1';
            this.elements.portfolioText.style.transition = 'opacity 0.6s ease-out';
            
            // Glitch effect
            this.addGlitchEffect(this.elements.portfolioText);
        }
    }

    animateStats() {
        if (this.elements.loadingStats) {
            this.elements.loadingStats.style.opacity = '1';
            this.elements.loadingStats.style.transition = 'opacity 0.6s ease-out';
        }
    }

    animateSkipButton() {
        if (this.elements.skipButton) {
            this.elements.skipButton.style.opacity = '0.7';
            this.elements.skipButton.style.transition = 'opacity 0.6s ease-out';
        }
    }

    addGlitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        
        let glitchCount = 0;
        const maxGlitches = 3;
        
        const glitch = () => {
            if (glitchCount >= maxGlitches) return;
            
            const textArray = originalText.split('');
            const glitchIndex = Math.floor(Math.random() * textArray.length);
            const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            
            textArray[glitchIndex] = glitchChar;
            element.textContent = textArray.join('');
            
            setTimeout(() => {
                element.textContent = originalText;
                glitchCount++;
                
                if (glitchCount < maxGlitches) {
                    setTimeout(glitch, Math.random() * 2000 + 500);
                }
            }, 100);
        };
        
        setTimeout(glitch, 1000);
    }

    startLoadingSimulation() {
        const totalDuration = this.loadingSteps.reduce((sum, step) => sum + step.duration, 0);
        let currentTime = 0;
        
        this.loadingSteps.forEach((step, index) => {
            currentTime += step.duration;
            
            setTimeout(() => {
                this.updateLoadingStep(step.text, index);
                this.updateProgress((currentTime / totalDuration) * 100);
                this.updateStats(index);
            }, currentTime);
        });
        
        // Finish after all steps
        setTimeout(() => {
            this.finishPreloader();
        }, totalDuration + 500);
    }

    updateLoadingStep(text, stepIndex) {
        if (this.elements.loadingStatus) {
            // Fade out current text
            this.elements.loadingStatus.style.opacity = '0';
            
            setTimeout(() => {
                this.elements.loadingStatus.textContent = text;
                this.elements.loadingStatus.style.opacity = '1';
                
                // Add loading dots animation
                this.animateLoadingDots(this.elements.loadingStatus);
            }, 200);
        }
        
        // Update progress text
        if (this.elements.progressText) {
            const progressMessages = [
                'Rendering...', 'Processing...', 'Compositing...', 
                'Grading...', 'Finalizing...', 'Optimizing...', 
                'Completing...', 'Ready!'
            ];
            this.elements.progressText.textContent = progressMessages[stepIndex] || 'Loading...';
        }
    }

    animateLoadingDots(element) {
        const originalText = element.textContent;
        let dotCount = 0;
        
        const animateDots = () => {
            dotCount = (dotCount + 1) % 4;
            const dots = '.'.repeat(dotCount);
            element.textContent = originalText + dots;
        };
        
        const dotInterval = setInterval(animateDots, 300);
        
        // Clear after 2 seconds
        setTimeout(() => {
            clearInterval(dotInterval);
            element.textContent = originalText;
        }, 2000);
    }

    updateProgress(percentage) {
        if (this.elements.progress) {
            this.elements.progress.style.width = percentage + '%';
            
            // Change color based on progress
            if (percentage > 80) {
                this.elements.progress.style.background = 'linear-gradient(to right, #10b981, #059669)';
            } else if (percentage > 50) {
                this.elements.progress.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';
            }
        }
    }

    updateStats(stepIndex) {
        const stats = {
            assets: Math.min(47, Math.floor((stepIndex + 1) * 6 + Math.random() * 3)),
            shaders: Math.min(12, Math.floor((stepIndex + 1) * 1.5 + Math.random() * 2)),
            models: Math.min(8, Math.floor((stepIndex + 1) * 1 + Math.random() * 1))
        };
        
        if (this.elements.assetsLoaded) {
            this.animateCounter(this.elements.assetsLoaded, parseInt(this.elements.assetsLoaded.textContent) || 0, stats.assets);
        }
        
        if (this.elements.shadersLoaded) {
            this.animateCounter(this.elements.shadersLoaded, parseInt(this.elements.shadersLoaded.textContent) || 0, stats.shaders);
        }
        
        if (this.elements.modelsLoaded) {
            this.animateCounter(this.elements.modelsLoaded, parseInt(this.elements.modelsLoaded.textContent) || 0, stats.models);
        }
    }

    animateCounter(element, start, end) {
        const duration = 500;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    finishPreloader() {
        // Final animation sequence
        this.playFinalSequence();
    }

    playFinalSequence() {
        // Update to completion state
        this.updateProgress(100);
        if (this.elements.loadingStatus) {
            this.elements.loadingStatus.textContent = 'Experience Ready!';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = 'Complete!';
        }
        
        // Final stats
        if (this.elements.assetsLoaded) this.elements.assetsLoaded.textContent = '47';
        if (this.elements.shadersLoaded) this.elements.shadersLoaded.textContent = '12';
        if (this.elements.modelsLoaded) this.elements.modelsLoaded.textContent = '8';
        
        // Create exit animation
        setTimeout(() => {
            this.createExitAnimation();
        }, 800);
    }

    createExitAnimation() {
        const preloader = this.elements.preloader;
        if (!preloader) return;
        
        // Create cinematic exit effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 49%, #000 50%, #000 51%, transparent 52%);
            background-size: 20px 20px;
            animation: cinematicWipe 1.5s ease-in-out forwards;
            z-index: 100;
        `;
        
        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cinematicWipe {
                0% { 
                    background-position: -100% 0; 
                    opacity: 0;
                }
                50% { 
                    opacity: 1;
                }
                100% { 
                    background-position: 100% 0; 
                    opacity: 0;
                }
            }
            
            @keyframes preloaderFadeOut {
                0% { 
                    opacity: 1; 
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% { 
                    opacity: 0; 
                    transform: scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
        
        preloader.appendChild(overlay);
        
        // Fade out preloader
        setTimeout(() => {
            preloader.style.animation = 'preloaderFadeOut 1s ease-in-out forwards';
            
            setTimeout(() => {
                preloader.style.display = 'none';
                this.triggerHeroAnimations();
                
                // Notify advanced 3D controller
                if (window.advanced3D && window.advanced3D.finishPreloader) {
                    window.advanced3D.finishPreloader();
                }
            }, 1000);
        }, 1500);
    }

    triggerHeroAnimations() {
        // Animate hero elements in sequence
        const heroElements = [
            { selector: '.hero-tagline', delay: 200 },
            { selector: '.hero-logo', delay: 400 },
            { selector: '.hero-intro', delay: 600 },
            { selector: '.hero-portfolio', delay: 800 },
            { selector: '.hero-cta', delay: 1000 },
            { selector: '.scroll-indicator', delay: 1200 }
        ];

        heroElements.forEach(({ selector, delay }) => {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            }, delay);
        });
    }
}

// Enhanced Menu Animation Controller
class MenuAnimationController {
    constructor() {
        this.menu = document.getElementById('menu');
        this.menuOpen = document.querySelector('.ts-menu-open');
        this.menuClose = document.querySelector('.ts-menu-close');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createMenuParticles();
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
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.menu.style.display = 'block';
        this.menu.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
        
        // Animate menu items in sequence
        const menuItems = this.menu.querySelectorAll('.menu-nav-link');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, index * 100);
        });
        
        this.animateMenuParticles();
    }

    closeMenu() {
        if (!this.isOpen) return;
        
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

    createMenuParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'menu-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.menu.appendChild(particleContainer);
        this.particleContainer = particleContainer;
    }

    animateMenuParticles() {
        if (!this.particleContainer) return;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(229, 225, 220, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: menuParticleFloat ${3 + Math.random() * 4}s infinite ease-in-out;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            this.particleContainer.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }
        
        // Add CSS animation
        if (!document.getElementById('menu-particle-styles')) {
            const style = document.createElement('style');
            style.id = 'menu-particle-styles';
            style.textContent = `
                @keyframes menuParticleFloat {
                    0%, 100% { 
                        transform: translateY(0) rotate(0deg);
                        opacity: 0;
                    }
                    25% {
                        opacity: 1;
                    }
                    50% { 
                        transform: translateY(-20px) rotate(180deg);
                        opacity: 0.8;
                    }
                    75% {
                        opacity: 0.4;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Enhanced Video Hover Effects
class VideoHoverEffects {
    constructor() {
        this.videos = document.querySelectorAll('.video-item video');
        this.init();
    }

    init() {
        this.setupVideoHovers();
    }

    setupVideoHovers() {
        this.videos.forEach(video => {
            const container = video.closest('.video-item');
            
            container.addEventListener('mouseenter', () => {
                this.createHoverEffect(container, video);
            });
            
            container.addEventListener('mouseleave', () => {
                this.removeHoverEffect(container);
            });
        });
    }

    createHoverEffect(container, video) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'video-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
            animation: rippleExpand 0.8s ease-out;
        `;
        
        container.style.position = 'relative';
        container.appendChild(ripple);
        
        // Add CSS animation if not exists
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleExpand {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 1;
                    }
                    100% {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
        
        // Play video with slight delay for better UX
        setTimeout(() => {
            video.play().catch(e => console.log('Video autoplay prevented:', e));
        }, 100);
    }

    removeHoverEffect(container) {
        const video = container.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
}

// Enhanced Scroll Indicator
class EnhancedScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        this.init();
    }

    init() {
        if (!this.indicator) return;
        
        this.setupScrollDetection();
        this.enhanceScrollDot();
    }

    setupScrollDetection() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            // Hide indicator when scrolling
            this.indicator.style.opacity = '0.3';
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.scrollY < 100) {
                    this.indicator.style.opacity = '1';
                }
            }, 150);
        });
    }

    enhanceScrollDot() {
        const dot = this.indicator.querySelector('.scroll-dot');
        if (!dot) return;
        
        // Add pulsing effect
        setInterval(() => {
            dot.style.transform = 'translateX(-50%) scale(1.2)';
            dot.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.6)';
            
            setTimeout(() => {
                dot.style.transform = 'translateX(-50%) scale(1)';
                dot.style.boxShadow = 'none';
            }, 300);
        }, 2000);
    }
}

// Performance monitor for 3D elements
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.monitoring = false;
        
        this.init();
    }

    init() {
        this.createFPSMonitor();
        this.startMonitoring();
    }

    createFPSMonitor() {
        const monitor = document.createElement('div');
        monitor.id = 'fps-monitor';
        monitor.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(42, 42, 42, 0.8);
            color: #E5E1DC;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 1000;
            display: none;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(229, 225, 220, 0.2);
        `;
        monitor.textContent = 'FPS: --';
        
        document.body.appendChild(monitor);
        this.monitor = monitor;
        
        // Toggle visibility with Ctrl+Shift+F
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                this.toggleMonitor();
            }
        });
    }

    startMonitoring() {
        this.monitoring = true;
        
        const updateFPS = () => {
            if (!this.monitoring) return;
            
            this.frameCount++;
            const currentTime = Date.now();
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                if (this.monitor) {
                    this.monitor.textContent = `FPS: ${this.fps}`;
                    
                    // Color code based on performance
                    if (this.fps >= 55) {
                        this.monitor.style.color = '#10b981';
                    } else if (this.fps >= 30) {
                        this.monitor.style.color = '#f59e0b';
                    } else {
                        this.monitor.style.color = '#ef4444';
                    }
                }
                
                // Adjust quality based on performance
                this.adjustQualityBasedOnFPS();
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        updateFPS();
    }

    adjustQualityBasedOnFPS() {
        if (window.advanced3D && window.advanced3D.renderer) {
            const renderer = window.advanced3D.renderer;
            
            if (this.fps < 30) {
                // Reduce quality for better performance
                renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.5, 1));
                renderer.shadowMap.enabled = false;
            } else if (this.fps > 50) {
                // Restore quality
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.shadowMap.enabled = true;
            }
        }
    }

    toggleMonitor() {
        if (this.monitor) {
            this.monitor.style.display = this.monitor.style.display === 'none' ? 'block' : 'none';
        }
    }

    stopMonitoring() {
        this.monitoring = false;
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if preloader exists
    if (document.querySelector('.ts-page-loader')) {
        window.preloaderAnimations = new PreloaderAnimations();
    }
    
    window.menuAnimations = new MenuAnimationController();
    window.videoHoverEffects = new VideoHoverEffects();
    window.scrollIndicator = new EnhancedScrollIndicator();
    
    // Initialize performance monitor in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.performanceMonitor = new PerformanceMonitor();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PreloaderAnimations,
        MenuAnimationController,
        VideoHoverEffects,
        EnhancedScrollIndicator,
        PerformanceMonitor
    };
}
