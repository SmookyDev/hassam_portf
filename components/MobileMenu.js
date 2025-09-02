class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    render() {
        return `
            <div id="menu" class="menu z-30 h-dvh w-screen bg-mine-shaft-texture hidden fixed top-0 left-0 transform -translate-x-full transition-transform duration-500">
                <div class="relative flex h-full w-full p-5 md:p-10">
                    <video class="hidden h-full max-w-[50%] items-center md:mr-4 md:flex" webkit-playsinline playsinline muted autoplay loop>
                        <source src="assets/videos/1.mp4" type="video/mp4">
                    </video>

                    <div class="flex w-full flex-col md:flex-1">
                        <button class="ts-menu-close text-pampas border-emperor absolute top-5 md:top-10 right-5 md:right-20 hover:bg-pampas hover:text-mine-shaft font-serif-en border rounded-30 md:pt-[6px] md:pb-[5px] md:px-4 pt-[4px] pb-[3px] px-[12px] flex gap-2 items-center group transition duration-700">
                            <span class="inline-block">CLOSE</span>
                            <span class="block h-0.375 w-0.375 rounded-full bg-taupe-gray transition-transform group-hover:scale-125"></span>
                        </button>

                        <div class="flex w-full flex-1 flex-col items-center py-10">
                            <div class="flex w-full flex-1 items-center justify-center">
                                <ul class="flex h-full max-h-22.2 w-full max-w-[85%] flex-row-reverse justify-between md:max-h-[30rem] md:w-auto md:max-w-full md:justify-normal md:gap-12">
                                    <li class="flex leading-none">
                                        <a href="#home" class="group relative duration-600 vertical-rl hover:opacity-70 menu-nav-link" data-section="home">
                                            <span class="flex flex-row items-center vertical-rl">
                                                <span class="text-taupe-gray horizontal-tb">
                                                    <span>(01)</span>
                                                </span>
                                                <span class="mt-1.42 text-2xl text-pampas md:mt-8 md:text-[2rem]">Home</span>
                                                <span class="mb-0.85 mt-1.14 h-full flex-1 md:mb-4 md:mt-6">
                                                    <span class="block h-full w-[1px] bg-emperor"></span>
                                                </span>
                                                <span class="font-serif-en text-0.928 text-silver-chalice md:text-base">
                                                    <span>HOME</span>
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                    <li class="flex leading-none">
                                        <a href="#about" class="group relative duration-600 vertical-rl hover:opacity-70 menu-nav-link" data-section="about">
                                            <span class="flex flex-row items-center vertical-rl">
                                                <span class="text-taupe-gray horizontal-tb">
                                                    <span>(02)</span>
                                                </span>
                                                <span class="mt-1.42 text-2xl text-pampas md:mt-8 md:text-[2rem]">About</span>
                                                <span class="mb-0.85 mt-1.14 h-full flex-1 md:mb-4 md:mt-6">
                                                    <span class="block h-full w-[1px] bg-emperor"></span>
                                                </span>
                                                <span class="font-serif-en text-0.928 text-silver-chalice md:text-base">
                                                    <span>ABOUT</span>
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                    <li class="flex leading-none">
                                        <a href="#works" class="group relative duration-600 vertical-rl hover:opacity-70 menu-nav-link" data-section="works">
                                            <span class="flex flex-row items-center vertical-rl">
                                                <span class="text-taupe-gray horizontal-tb">
                                                    <span>(03)</span>
                                                </span>
                                                <span class="mt-1.42 text-2xl text-pampas md:mt-8 md:text-[2rem]">Works</span>
                                                <span class="mb-0.85 mt-1.14 h-full flex-1 md:mb-4 md:mt-6">
                                                    <span class="block h-full w-[1px] bg-emperor"></span>
                                                </span>
                                                <span class="font-serif-en text-0.928 text-silver-chalice md:text-base">
                                                    <span>WORKS</span>
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                    <li class="flex leading-none">
                                        <a href="#contact" class="group relative duration-600 vertical-rl hover:opacity-70 menu-nav-link" data-section="contact">
                                            <span class="flex flex-row items-center vertical-rl">
                                                <span class="text-taupe-gray horizontal-tb">
                                                    <span>(04)</span>
                                                </span>
                                                <span class="mt-1.42 text-2xl text-pampas md:mt-8 md:text-[2rem]">Contact</span>
                                                <span class="mb-0.85 mt-1.14 h-full flex-1 md:mb-4 md:mt-6">
                                                    <span class="block h-full w-[1px] bg-emperor"></span>
                                                </span>
                                                <span class="font-serif-en text-0.928 text-silver-chalice md:text-base">
                                                    <span>CONTACT</span>
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <ul class="mt-4 flex gap-8">
                                <li>
                                    <a href="https://x.com/HaTh0021" target="_blank" class="ts-text-link font-serif-en text-xl text-pampas">
                                        X (Twitter)
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/taikisato_/" target="_blank" class="ts-text-link font-serif-en text-xl text-pampas">
                                        INSTAGRAM
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Handle menu open
            if (e.target.closest('.ts-menu-open')) {
                this.openMenu();
            }
            
            // Handle menu close
            if (e.target.closest('.ts-menu-close')) {
                this.closeMenu();
            }

            // Handle menu navigation links
            if (e.target.closest('.menu-nav-link')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
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
            this.isOpen = true;
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
            this.isOpen = false;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileMenu;
}
