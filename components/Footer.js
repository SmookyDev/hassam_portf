class Footer {
    constructor() {
        this.init();
    }

    init() {
        this.setupBackToTop();
    }

    render() {
        return `
            <div id="footer-wrapper" class="relative mt-20">
                <footer id="footer" class="relative w-full overflow-hidden text-pampas bg-mine-shaft-texture">
                    <div class="container px-5 pt-16 md:px-20 md:pt-24">
                        <ul class="flex flex-row-reverse justify-center gap-8">
                            <li class="relative flex flex-col items-center">
                                <span class="absolute -top-4 left-1/2 h-[6px] w-[6px] -translate-x-1/2">
                                    <span class="block h-0.375 w-0.375 rounded-full bg-taupe-gray transition-transform group-hover:scale-125"></span>
                                </span>
                                <a href="#home" class="ts-text-link text-xl leading-none vertical-rl text-silver-chalice" data-vertical="rl">
                                    Home
                                </a>
                            </li>
                            <li class="relative flex flex-col items-center">
                                <a href="#about" class="ts-text-link text-xl leading-none vertical-rl" data-vertical="rl">
                                    About
                                </a>
                            </li>
                            <li class="relative flex flex-col items-center">
                                <a href="#works" class="ts-text-link text-xl leading-none vertical-rl" data-vertical="rl">
                                    Works
                                </a>
                            </li>
                            <li class="relative flex flex-col items-center">
                                <a href="#contact" class="ts-text-link text-xl leading-none vertical-rl" data-vertical="rl">
                                    Contact
                                </a>
                            </li>
                        </ul>

                        <div class="mt-20 hidden justify-end md:flex">
                            <a href="#home" class="ts-text-link ts-anchor font-serif-en text-lg">BACK TO TOP</a>
                        </div>

                        <ul class="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 border-t border-emperor pt-10 font-serif-en md:mt-6 md:justify-between md:gap-8">
                            <li class="inline-block">
                                <a href="https://x.com/HaTh0021" target="_blank" class="ts-text-link md:text-xl hover:text-pampas transition-colors">
                                    X (Twitter)
                                </a>
                            </li>
                            <li class="inline-block">
                                <a href="https://www.instagram.com/taikisato_/" target="_blank" class="ts-text-link md:text-xl hover:text-pampas transition-colors">
                                    INSTAGRAM
                                </a>
                            </li>
                            <li class="inline-block w-full text-center md:ml-auto md:w-auto">
                                <small class="text-base text-silver-chalice">
                                    &copy; 2024 HASSAM TAHIR
                                </small>
                            </li>
                        </ul>
                    </div>

                    <!-- Large GET IN CONTACT Text -->
                    <div class="mt-9 pb-5 md:mt-10">
                        <div class="contact">
                            <a href="mailto:taaaaiki.mode@gmail.com?subject=Contact" target="_blank" class="group flex flex-nowrap whitespace-nowrap" aria-label="GET IN CONTACT">
                                <span class="mx-8 block md:mx-9">
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1855 172" class="h-[100px] fill-taupe-gray transition-all duration-700 group-hover:fill-transparent group-hover:stroke-taupe-gray md:h-[172px]">
                                        <g>
                                            <path d="M1783.06,65.76c0-16.64-.24-33.2-.72-49.68-4.16,0-8.56.08-13.2.24-4.48,0-9.04.16-13.68.48-4.48.16-8.88.4-13.2.72-4.16.32-7.92.72-11.28,1.2.8-2.88,1.2-5.44,1.2-7.68,0-1.76-.4-4.24-1.2-7.44,10.56.32,20.88.64,30.96.96,10.08.16,20.4.24,30.96.24s20.88-.08,30.96-.24c10.08-.32,20.4-.64,30.96-.96-.8,3.2-1.2,5.76-1.2,7.68,0,2.08.4,4.56,1.2,7.44-3.36-.48-7.2-.88-11.52-1.2-4.16-.32-8.56-.56-13.2-.72-4.48-.32-9.04-.48-13.68-.48-4.48-.16-8.8-.24-12.96-.24-.48,16.48-.72,33.04-.72,49.68v41.28c0,10.56.16,20.96.48,31.2.48,10.24.96,20.32,1.44,30.24-3.68-.32-7.6-.48-11.76-.48s-8.08.16-11.76.48c.48-9.92.88-20,1.2-30.24.48-10.24.72-20.64.72-31.2v-41.28Z"></path>
                                        </g>
                                    </svg>
                                </span>
                                <span class="mx-8 block md:mx-9">
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1855 172" class="h-[100px] fill-taupe-gray transition-all duration-700 group-hover:fill-transparent group-hover:stroke-taupe-gray md:h-[172px]">
                                        <g>
                                            <path d="M1783.06,65.76c0-16.64-.24-33.2-.72-49.68-4.16,0-8.56.08-13.2.24-4.48,0-9.04.16-13.68.48-4.48.16-8.88.4-13.2.72-4.16.32-7.92.72-11.28,1.2.8-2.88,1.2-5.44,1.2-7.68,0-1.76-.4-4.24-1.2-7.44,10.56.32,20.88.64,30.96.96,10.08.16,20.4.24,30.96.24s20.88-.08,30.96-.24c10.08-.32,20.4-.64,30.96-.96-.8,3.2-1.2,5.76-1.2,7.68,0,2.08.4,4.56,1.2,7.44-3.36-.48-7.2-.88-11.52-1.2-4.16-.32-8.56-.56-13.2-.72-4.48-.32-9.04-.48-13.68-.48-4.48-.16-8.8-.24-12.96-.24-.48,16.48-.72,33.04-.72,49.68v41.28c0,10.56.16,20.96.48,31.2.48,10.24.96,20.32,1.44,30.24-3.68-.32-7.6-.48-11.76-.48s-8.08.16-11.76.48c.48-9.92.88-20,1.2-30.24.48-10.24.72-20.64.72-31.2v-41.28Z"></path>
                                        </g>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    setupBackToTop() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ts-anchor')) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
}
