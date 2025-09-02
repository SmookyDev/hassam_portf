// Portfolio Data
window.portfolioProjects = [
    {
        id: 'textile-manufacturer',
        number: '01',
        year: '2024',
        title: 'Textile Manufacturer',
        type: 'PRIVATE WORKS',
        services: ['ART DIRECTION', 'WEB DESIGN', 'GRAPHIC DESIGN'],
        image: 'images/1.jpg',
        description: 'A comprehensive brand renewal project for a century-old textile manufacturer. The challenge was to honor the company\'s rich heritage while positioning them for future growth in an evolving industry.',
        details: 'Our approach focused on the fusion of tradition and innovation - celebrating the craftsmanship and quality that has defined the company for over 100 years, while introducing contemporary design elements that speak to modern audiences.',
        gallery: ['images/1.jpg', 'images/works/textile-manufacturer.jpg']
    },
    {
        id: 'sauna1f',
        number: '02',
        year: '2024',
        title: 'SAUNA1/f',
        type: 'PRIVATE WORKS',
        services: ['ART DIRECTION', 'GRAPHIC DESIGN'],
        image: 'images/works/sauna1f.jpg',
        description: 'Visual identity design for SAUNA1/f, a brand offering innovative sauna experiences. Using a minimal and refined design approach to express contemporary wellness culture.',
        details: 'The design emphasizes simplicity, tranquility, and the therapeutic benefits of sauna experiences through clean typography and sophisticated color palette.',
        gallery: ['images/works/sauna1f.jpg']
    },
    {
        id: 'misia-forest',
        number: '03',
        year: '2023',
        title: 'MISIA Forest',
        type: 'PRIVATE WORKS',
        services: ['ART DIRECTION', 'WEB DESIGN', 'GRAPHIC DESIGN'],
        image: 'images/works/misia-forest.jpg',
        description: 'Environmental conservation project for artist MISIA. Adopting an organic design approach that expresses harmony and coexistence with nature.',
        details: 'The design uses organic shapes, natural color palettes, and flowing typography to create a sense of harmony with nature while emphasizing environmental awareness.',
        gallery: ['images/works/misia-forest.jpg']
    },
    {
        id: 'sato-noodle',
        number: '04',
        year: '2022',
        title: 'Sato Noodle Factory',
        type: 'CLIENT WORKS',
        services: ['GRAPHIC DESIGN'],
        image: 'images/works/sato-noodle.jpg',
        description: 'Traditional Japanese noodle factory branding project focusing on artisanal craftsmanship and authentic flavors.',
        details: 'Created a visual identity that honors traditional noodle-making techniques while appealing to modern consumers seeking authentic Japanese cuisine.',
        gallery: ['images/works/sato-noodle.jpg']
    },
    {
        id: 'burst-of-mana',
        number: '05',
        year: '2024',
        title: 'Burst of Mana',
        type: 'CLIENT WORKS',
        services: ['GRAPHIC DESIGN'],
        image: 'images/works/burst-of-mana.jpg',
        description: 'Gaming brand visual identity design with dynamic energy and modern aesthetic appeal for the digital entertainment industry.',
        details: 'Developed a vibrant and energetic brand identity that captures the excitement and innovation of modern gaming culture.',
        gallery: ['images/works/burst-of-mana.jpg']
    }
];

// Main Single Page Application
class SinglePagePortfolio {
    constructor() {
        this.currentSection = 'home';
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupComponents();
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupProjectModals();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupContactForm();
        this.setup3DVideo();
        this.setupPageLoader();
        this.renderProjects();
    }

    setupComponents() {
        // Initialize all component classes
        if (typeof Header !== 'undefined') {
            this.header = new Header();
        }
        if (typeof MobileMenu !== 'undefined') {
            this.mobileMenu = new MobileMenu();
        }
        if (typeof Footer !== 'undefined') {
            this.footer = new Footer();
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavLink(sectionId, navLinks);
                    this.updateBackgroundColor(sectionId);
                    this.currentSection = sectionId;
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeSection, navLinks) {
        navLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            if (section === activeSection) {
                link.classList.add('text-pampas', 'font-medium');
                link.classList.remove('text-silver-chalice');
            } else {
                link.classList.remove('text-pampas', 'font-medium');
                link.classList.add('text-silver-chalice');
            }
        });
    }

    updateBackgroundColor(section) {
        const bg = document.getElementById('bg');
        const body = document.body;
        const header = document.getElementById('header');
        
        let color = 'dark';
        if (section === 'about') {
            color = 'bright';
        }

        if (bg) bg.setAttribute('data-color', color);
        if (body) body.setAttribute('data-bg-color', color);
        if (header) header.setAttribute('data-color', color);
    }

    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 100; // Approximate header height
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    setupMobileMenu() {
        const menuOpenBtn = document.querySelector('.ts-menu-open');
        const menuCloseBtn = document.querySelector('.ts-menu-close');
        const menu = document.getElementById('menu');

        if (menuOpenBtn && menu) {
            menuOpenBtn.addEventListener('click', () => {
                this.openMenu();
            });
        }

        if (menuCloseBtn && menu) {
            menuCloseBtn.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Handle menu navigation links
        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-nav-link')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.classList.remove('hidden', '-translate-x-full');
            menu.classList.add('translate-x-0');
            document.body.style.overflow = 'hidden';
            this.isMenuOpen = true;
        }
    }

    closeMenu() {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.classList.add('-translate-x-full');
            menu.classList.remove('translate-x-0');
            setTimeout(() => {
                menu.classList.add('hidden');
            }, 500);
            document.body.style.overflow = '';
            this.isMenuOpen = false;
        }
    }

    setupProjectModals() {
        document.addEventListener('click', (e) => {
            // Open modal
            const projectCard = e.target.closest('.ts-image-link[data-project-id]');
            if (projectCard) {
                e.preventDefault();
                const projectId = projectCard.dataset.projectId;
                this.openProjectModal(projectId);
            }

            // Close modal
            if (e.target.closest('.project-modal-close')) {
                this.closeProjectModal();
            }

            // Close on backdrop click
            if (e.target.id === 'project-modal') {
                this.closeProjectModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
            }
        });
    }

    openProjectModal(projectId) {
        const project = window.portfolioProjects.find(p => p.id === projectId);
        
        if (project) {
            // Remove existing modal
            const existingModal = document.getElementById('project-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal HTML
            const modalHTML = `
                <div id="project-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm project-modal">
                    <div class="bg-white max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
                        <div class="relative">
                            <!-- Close Button -->
                            <button class="project-modal-close absolute top-4 right-4 z-10 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all duration-300">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>

                            <!-- Project Image -->
                            <div class="w-full h-64 md:h-96 overflow-hidden rounded-t-xl">
                                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
                            </div>

                            <!-- Project Content -->
                            <div class="p-6 md:p-8 text-black">
                                <div class="mb-6">
                                    <span class="font-serif-en text-gray text-sm">(${project.number}) / ${project.year}</span>
                                </div>

                                <h1 class="text-3xl md:text-4xl font-medium mb-6 leading-tight">
                                    ${project.title}
                                </h1>

                                <div class="grid md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h3 class="font-serif-en text-sm font-medium mb-3 text-gray uppercase">Project Type</h3>
                                        <p class="text-lg">${project.type}</p>
                                    </div>

                                    <div>
                                        <h3 class="font-serif-en text-sm font-medium mb-3 text-gray uppercase">Services</h3>
                                        <ul class="space-y-1">
                                            ${project.services.map(service => `<li>${service}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>

                                <div class="space-y-6 text-base md:text-lg leading-relaxed">
                                    <p>${project.description}</p>
                                    ${project.details ? `<p>${project.details}</p>` : ''}
                                </div>

                                ${project.gallery && project.gallery.length > 1 ? `
                                    <div class="mt-8">
                                        <h3 class="text-xl font-medium mb-6">Project Gallery</h3>
                                        <div class="grid md:grid-cols-2 gap-4">
                                            ${project.gallery.slice(1).map(img => `
                                                <img src="${img}" alt="${project.title} Gallery" class="w-full object-cover rounded-lg h-48 md:h-64">
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                <div class="mt-8 pt-6 border-t border-gray-200 text-center">
                                    <button class="project-modal-close bg-black text-white px-8 py-3 rounded-full font-serif-en transition-all duration-300 hover:bg-gray-800">
                                        Close Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append modal to body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Show modal with animation
            const modal = document.getElementById('project-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.querySelector('.project-modal').classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }

    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.querySelector('.project-modal').classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        const scrollElements = document.querySelectorAll('.section-transition');

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
    }

    setupParallaxEffects() {
        const parallaxImages = document.querySelectorAll('.ts-parallax-gallery-image');

        // Set up intersection observer for parallax gallery
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

        parallaxImages.forEach(image => {
            observer.observe(image);
        });

        // Parallax scrolling effect
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    parallaxImages.forEach((image, index) => {
                        const speed = 0.3 + (index * 0.05);
                        const yPos = -(scrollY * speed);
                        image.style.transform = `translateY(${yPos}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
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
                form.reset();
            }, 100);
        });
    }

    setup3DVideo() {
        const container = document.getElementById("kinect-container");
        const video = document.getElementById("kinect-video");

        if (!container || !video) return;

        // Force autoplay
        video.muted = true;
        video.autoplay = true;
        video.loop = true;

        // Try playing video
        video.play().catch(err => {
            console.warn("Autoplay blocked. User interaction required:", err);
        });

        video.addEventListener("loadeddata", () => {
            console.log("Video ready, initializing 3D effect...");

            let scene, camera, renderer;
            let geometry, mesh, material;
            let mouse, center;

            // Renderer
            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById("kinect-canvas"),
                alpha: true,
                antialias: true
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);

            // Camera
            camera = new THREE.PerspectiveCamera(
                50,
                container.clientWidth / container.clientHeight,
                1,
                10000
            );
            camera.position.set(0, 0, 800);

            // Scene
            scene = new THREE.Scene();
            center = new THREE.Vector3(0, 0, -1000);

            // Texture
            const texture = new THREE.VideoTexture(video);
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;

            const width = 780, height = 480;
            const nearClipping = 850, farClipping = 4000;

            // Geometry
            geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(width * height * 3);
            for (let i = 0, j = 0, l = vertices.length; i < l; i += 3, j++) {
                vertices[i] = j % width;
                vertices[i + 1] = Math.floor(j / width);
            }
            geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

            // Material with shaders
            material = new THREE.ShaderMaterial({
                uniforms: {
                    opacity: { value: 0.5 },
                    map: { value: texture },
                    width: { value: width },
                    height: { value: height },
                    nearClipping: { value: 3000 },
                    farClipping: { value: 2000 },
                    pointSize: { value: 1 },
                    zOffset: { value: 100 }
                },
                vertexShader: document.getElementById("vs").textContent,
                fragmentShader: document.getElementById("fs").textContent,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                depthWrite: false,
                transparent: true
            });

            // Mesh
            mesh = new THREE.Points(geometry, material);
            scene.add(mesh);

            // Mouse interaction
            mouse = new THREE.Vector3(0, 0, 1);
            document.addEventListener("mousemove", onDocumentMouseMove);

            function onDocumentMouseMove(event) {
                const rect = container.getBoundingClientRect();
                mouse.x = (event.clientX - rect.left - container.clientWidth / 2) * 8;
                mouse.y = (event.clientY - rect.top - container.clientHeight / 2) * 8;
            }

            // Resize
            window.addEventListener("resize", onWindowResize);

            function onWindowResize() {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }

            // Animate
            function animate() {
                requestAnimationFrame(animate);

                camera.position.x += (mouse.x - camera.position.x) * 0.05;
                camera.position.y += (-mouse.y - camera.position.y) * 0.05;
                camera.lookAt(center);

                renderer.render(scene, camera);
            }

            animate();
        });
    }

    setupPageLoader() {
        const pageLoader = document.querySelector('.ts-page-loader');

        window.addEventListener('load', () => {
            setTimeout(() => {
                if (pageLoader) {
                    pageLoader.style.opacity = '0';
                    pageLoader.style.visibility = 'hidden';
                    pageLoader.style.transform = 'translateY(-100%)';
                    setTimeout(() => {
                        pageLoader.style.display = 'none';
                    }, 1000);
                }
            }, 1500);
        });
    }

    renderProjects() {
        const projectsContainer = document.getElementById('portfolio-works');
        if (!projectsContainer) return;

        const projectsHTML = window.portfolioProjects.map(project => {
            return `
                <li class="ts-image-link image-link group cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:bg-opacity-5 rounded-lg p-4 md:p-6" data-project-id="${project.id}">
                    <div class="flex flex-col gap-6 border-t border-silver md:flex-row md:gap-16 md:border-none md:pl-[10%]">
                        <div class="flex md:hidden justify-between pt-3 transition-colors duration-300">
                            <span class="text-gray">(${project.number})</span>
                            <span class="font-serif-en text-gray">${project.year}</span>
                        </div>
                        <div class="flex-1 md:pt-3 md:border-t border-silver flex flex-col relative z-10 order-2 md:order-1 transition-colors duration-300">
                            <div class="hidden justify-between md:flex">
                                <span class="text-gray">(${project.number})</span>
                                <span class="font-serif-en text-gray">${project.year}</span>
                            </div>
                            <h3 class="font-medium text-2xl md:text-3xl md:mt-16 transition-colors duration-300 text-black">
                                ${project.title}
                            </h3>
                            <ul class="mt-3 font-serif-en transition-colors duration-300">
                                <li class="text-gray">${project.type}</li>
                            </ul>
                            <ul class="text-gray flex md:flex-col flex-wrap gap-y-2 gap-x-3 leading-none mt-7 md:mt-auto transition-colors duration-300">
                                ${project.services.map(service => `<li>${service}</li>`).join('')}
                            </ul>
                        </div>
                        <picture class="order-1 md:order-2 md:w-[60rem] overflow-hidden rounded-lg">
                            <img src="${project.image}" alt="${project.title}" class="w-full object-cover h-48 md:h-80 transition-transform duration-300 group-hover:scale-105">
                        </picture>
                    </div>
                </li>
            `;
        }).join('');

        projectsContainer.innerHTML = projectsHTML;
    }
}

// Scroll Progress Indicator
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

            scrollNav.style.top = `${scrollPercent * 100}%`;
        });
    }
}

// Cursor Stalker Effect
class CursorStalker {
    constructor() {
        this.cursor = null;
        this.setupCursor();
    }

    setupCursor() {
        // Only setup on desktop
        if (window.innerWidth < 768) return;

        // Create cursor element
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-stalker';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #E5E1DC;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
            opacity: 0;
            mix-blend-mode: difference;
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
                this.cursor.style.backgroundColor = '#E5E1DC';
            });
        });
    }
}

// Image Loading Optimization
class ImageLoader {
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

                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.style.opacity = '1';
                    };
                    tempImg.src = img.src;

                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Responsive Text Scaling
class ResponsiveText {
    constructor() {
        this.setupResponsiveText();
    }

    setupResponsiveText() {
        const resizeHandler = () => {
            const vw = window.innerWidth;

            // Adjust hero text size based on viewport
            const heroTitle = document.querySelector('#home h1');
            if (heroTitle && vw < 768) {
                const logoImg = heroTitle.querySelector('img');
                if (logoImg) {
                    logoImg.style.maxWidth = `${Math.max(200, vw * 0.8)}px`;
                }
            }

            // Adjust large text elements for mobile
            const largeTexts = document.querySelectorAll('.text-6xl, .text-5xl');
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

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.setupOptimizations();
    }

    setupOptimizations() {
        // Throttle scroll events
        this.throttleScrollEvents();
        
        // Optimize animations for reduced motion
        this.respectReducedMotion();
    }

    throttleScrollEvents() {
        let ticking = false;

        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    window.dispatchEvent(new CustomEvent('optimizedScroll'));
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    window.portfolio = new SinglePagePortfolio();
    
    // Initialize additional features
    new ScrollProgress();
    new CursorStalker();
    new ImageLoader();
    new ResponsiveText();
    new PerformanceOptimizer();

    // Setup project card modal events
    if (typeof ProjectCard !== 'undefined') {
        ProjectCard.setupModalEvents();
    }

    console.log('Single-page portfolio initialized successfully!');
});
