class Header {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupScrollSpy();
        this.setupSmoothScroll();
    }

    render() {
        return `
            <header id="header" class="fixed left-0 top-0 z-30 w-screen transition-all duration-300" data-color="dark" data-mix-blend-mode="true">
                <div class="container flex items-start px-5 py-5 md:px-20 md:py-10">
                    <a href="#home" class="ts-logo transition-all hover:opacity-30" aria-label="HASSAM TAHIR">
                        <p class="h-auto text-3xl md:text-5xl md:w-[180px]">HASSAM TAHIR</p>
                    </a>

                    <!-- Desktop Navigation -->
                    <ul class="ts-header-list ml-auto hidden max-h-[22.2rem] gap-8 transition-colors ease-in-out md:flex">
                        <li class="relative">
                            <a href="#contact" class="ts-text-link text-2xl vertical-rl md:text-lg nav-link" data-section="contact" data-vertical="rl">
                                Contact
                            </a>
                        </li>
                        <li class="relative">
                            <a href="#works" class="ts-text-link text-2xl vertical-rl md:text-lg nav-link" data-section="works" data-vertical="rl">
                                Works
                            </a>
                        </li>
                        <li class="relative">
                            <a href="#about" class="ts-text-link text-2xl vertical-rl md:text-lg nav-link" data-section="about" data-vertical="rl">
                                About
                            </a>
                        </li>
                    </ul>

                    <!-- Menu Button -->
                    <button class="ts-menu-open border-silver ml-auto md:ml-14 hover:bg-mine-shaft hover:text-pampas text-black font-serif-en border rounded-30 md:pt-[6px] md:pb-[5px] md:px-4 pt-[4px] pb-[3px] px-[12px] flex gap-2 items-center group transition duration-700"
                        data-color="dark">
                        <span class="inline-block">MENU</span>
                        <span class="block h-0.375 w-0.375 rounded-full bg-taupe-gray transition-transform group-hover:scale-125"></span>
                    </button>
                </div>
            </header>
        `;
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
        if (section === 'about' || section === 'contact') {
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
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
}
