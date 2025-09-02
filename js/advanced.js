// Advanced Three.js Portfolio Controller
// Handles 3D preloader and scroll lock effects for video editor portfolio

class Advanced3DController {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.preloaderScene = null;
        this.preloaderCamera = null;
        this.preloaderObjects = [];
        this.scrollLockActive = false;
        this.currentSection = 0;
        this.isPreloading = true;
        this.preloaderProgress = 0;
        
        // Animation objects
        this.filmReel = null;
        this.camera3D = null;
        this.timeline = null;
        this.colorWheel = null;
        
        this.init();
    }

    init() {
        this.setupThreeJS();
        this.createPreloader();
        this.setupScrollLock();
        this.setupEventListeners();
        this.startPreloaderAnimation();
    }

    setupThreeJS() {
        // Main scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Preloader scene setup
        this.preloaderScene = new THREE.Scene();
        this.preloaderCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.preloaderCamera.position.z = 5;
        
        // Add renderer to preloader container
        const preloaderContainer = document.querySelector('.ts-page-loader');
        if (preloaderContainer) {
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.zIndex = '1';
            preloaderContainer.appendChild(this.renderer.domElement);
        }
    }

    createPreloader() {
        // Lighting for preloader
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.preloaderScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.preloaderScene.add(directionalLight);

        // Create 3D Film Reel
        this.createFilmReel();
        
        // Create 3D Camera Model
        this.create3DCamera();
        
        // Create Timeline Scrubber
        this.createTimelineScrubber();
        
        // Create Color Grading Wheel
        this.createColorGradingWheel();
        
        // Create floating particles
        this.createFloatingParticles();
    }

    createFilmReel() {
        const group = new THREE.Group();
        
        // Main reel cylinder
        const reelGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
        const reelMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 100,
            specular: 0x444444
        });
        const reel = new THREE.Mesh(reelGeometry, reelMaterial);
        reel.receiveShadow = true;
        reel.castShadow = true;
        group.add(reel);
        
        // Film strip
        const filmGeometry = new THREE.BoxGeometry(3, 0.1, 0.05);
        const filmMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < 8; i++) {
            const film = new THREE.Mesh(filmGeometry, filmMaterial);
            const angle = (i / 8) * Math.PI * 2;
            film.position.x = Math.cos(angle) * 1.8;
            film.position.z = Math.sin(angle) * 1.8;
            film.rotation.y = angle;
            group.add(film);
        }
        
        // Center hub
        const hubGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
        const hubMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.castShadow = true;
        group.add(hub);
        
        group.position.set(-3, 1, 0);
        this.filmReel = group;
        this.preloaderScene.add(group);
        this.preloaderObjects.push(group);
    }

    create3DCamera() {
        const group = new THREE.Group();
        
        // Camera body
        const bodyGeometry = new THREE.BoxGeometry(2, 1.2, 1.5);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a2a });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Lens
        const lensGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 16);
        const lensMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a1a,
            shininess: 200,
            specular: 0x888888
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.z = Math.PI / 2;
        lens.position.z = 1.2;
        lens.castShadow = true;
        group.add(lens);
        
        // Lens glass
        const glassGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        const glassMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.3,
            shininess: 300
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.rotation.z = Math.PI / 2;
        glass.position.z = 1.8;
        group.add(glass);
        
        group.position.set(3, 0, 0);
        this.camera3D = group;
        this.preloaderScene.add(group);
        this.preloaderObjects.push(group);
    }

    createTimelineScrubber() {
        const group = new THREE.Group();
        
        // Timeline base
        const timelineGeometry = new THREE.BoxGeometry(4, 0.1, 0.3);
        const timelineMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
        const timelineBase = new THREE.Mesh(timelineGeometry, timelineMaterial);
        group.add(timelineBase);
        
        // Progress indicator
        const progressGeometry = new THREE.BoxGeometry(1, 0.15, 0.35);
        const progressMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
        const progress = new THREE.Mesh(progressGeometry, progressMaterial);
        progress.position.x = -1.5;
        group.add(progress);
        this.timelineProgress = progress;
        
        // Keyframes
        for (let i = 0; i < 5; i++) {
            const keyframeGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
            const keyframeMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
            const keyframe = new THREE.Mesh(keyframeGeometry, keyframeMaterial);
            keyframe.position.x = -1.5 + (i * 0.75);
            keyframe.position.y = 0.2;
            group.add(keyframe);
        }
        
        group.position.set(0, -2, 0);
        this.timeline = group;
        this.preloaderScene.add(group);
        this.preloaderObjects.push(group);
    }

    createColorGradingWheel() {
        const group = new THREE.Group();
        
        // Color wheel base
        const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.castShadow = true;
        group.add(wheel);
        
        // Color segments
        const colors = [0xff0000, 0xff8800, 0xffff00, 0x88ff00, 0x00ff00, 0x00ff88, 0x00ffff, 0x0088ff, 0x0000ff, 0x8800ff, 0xff00ff, 0xff0088];
        
        for (let i = 0; i < colors.length; i++) {
            const segmentGeometry = new THREE.RingGeometry(0.6, 1, (i * Math.PI * 2) / colors.length, Math.PI * 2 / colors.length);
            const segmentMaterial = new THREE.MeshBasicMaterial({ 
                color: colors[i],
                transparent: true,
                opacity: 0.8
            });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.rotation.x = -Math.PI / 2;
            segment.position.y = 0.11;
            group.add(segment);
        }
        
        group.position.set(0, 1.5, -2);
        this.colorWheel = group;
        this.preloaderScene.add(group);
        this.preloaderObjects.push(group);
    }

    createFloatingParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 50;
        const positions = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x888888,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.preloaderScene.add(particles);
        this.particles = particles;
    }

    startPreloaderAnimation() {
        const animatePreloader = () => {
            if (!this.isPreloading) return;
            
            const time = Date.now() * 0.001;
            
            // Animate film reel rotation
            if (this.filmReel) {
                this.filmReel.rotation.y = time * 2;
                this.filmReel.rotation.x = Math.sin(time) * 0.1;
            }
            
            // Animate camera floating
            if (this.camera3D) {
                this.camera3D.position.y = Math.sin(time * 1.5) * 0.3;
                this.camera3D.rotation.z = Math.sin(time * 0.8) * 0.1;
            }
            
            // Animate timeline progress
            if (this.timeline && this.timelineProgress) {
                this.preloaderProgress = Math.min(this.preloaderProgress + 0.008, 1);
                this.timelineProgress.position.x = -1.5 + (this.preloaderProgress * 3);
                
                // Change timeline color based on progress
                if (this.preloaderProgress > 0.8) {
                    this.timelineProgress.material.color.setHex(0x00ff00);
                } else if (this.preloaderProgress > 0.5) {
                    this.timelineProgress.material.color.setHex(0xffff00);
                }
            }
            
            // Animate color wheel
            if (this.colorWheel) {
                this.colorWheel.rotation.y = time * 0.5;
                this.colorWheel.position.y = 1.5 + Math.sin(time * 2) * 0.2;
            }
            
            // Animate particles
            if (this.particles) {
                this.particles.rotation.y = time * 0.1;
                const positions = this.particles.geometry.attributes.position.array;
                for (let i = 1; i < positions.length; i += 3) {
                    positions[i] = Math.sin(time + i) * 2;
                }
                this.particles.geometry.attributes.position.needsUpdate = true;
            }
            
            // Update preloader camera
            this.preloaderCamera.position.x = Math.sin(time * 0.3) * 2;
            this.preloaderCamera.position.y = Math.cos(time * 0.2) * 1;
            this.preloaderCamera.lookAt(0, 0, 0);
            
            this.renderer.render(this.preloaderScene, this.preloaderCamera);
            
            // Check if preloader should finish
            if (this.preloaderProgress >= 1) {
                setTimeout(() => this.finishPreloader(), 1000);
            } else {
                requestAnimationFrame(animatePreloader);
            }
        };
        
        animatePreloader();
    }

    finishPreloader() {
        this.isPreloading = false;
        
        // Fade out preloader
        const preloader = document.querySelector('.ts-page-loader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                this.initScrollLockScene();
                this.startScrollLockAnimation();
            }, 1000);
        }
    }

    setupScrollLock() {
        // Disable default scrolling during scroll lock
        let isScrolling = false;
        let scrollDirection = 0;
        
        window.addEventListener('wheel', (e) => {
            if (!this.scrollLockActive) return;
            
            e.preventDefault();
            
            if (!isScrolling) {
                isScrolling = true;
                scrollDirection = e.deltaY > 0 ? 1 : -1;
                
                this.handleScrollLockNavigation(scrollDirection);
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }, { passive: false });
        
        // Touch support for mobile
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!this.scrollLockActive) return;
            
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            
            if (Math.abs(deltaY) > 50 && !isScrolling) {
                isScrolling = true;
                scrollDirection = deltaY > 0 ? 1 : -1;
                this.handleScrollLockNavigation(scrollDirection);
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }, { passive: false });
    }

    initScrollLockScene() {
        // Clear preloader objects
        this.preloaderObjects.forEach(obj => {
            this.preloaderScene.remove(obj);
        });
        
        // Setup main 3D scene for scroll lock
        this.scene.clear();
        
        // Enhanced lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Create cinematic 3D objects for each section
        this.createSectionObjects();
        
        // Position camera for first section
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);
        
        // Add 3D canvas to main scene
        const main = document.getElementById('main');
        if (main) {
            this.renderer.domElement.style.position = 'fixed';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.zIndex = '5';
            this.renderer.domElement.style.pointerEvents = 'none';
            main.appendChild(this.renderer.domElement);
        }
        
        this.scrollLockActive = true;
    }

    createSectionObjects() {
        // Create different 3D objects for each section
        this.sectionObjects = [];
        
        // Section 1: Hero - Floating video editing icons
        const heroGroup = this.createHeroObjects();
        heroGroup.position.z = 0;
        this.scene.add(heroGroup);
        this.sectionObjects.push(heroGroup);
        
        // Section 2: Tools - Software packages floating
        const toolsGroup = this.createToolsObjects();
        toolsGroup.position.z = -20;
        this.scene.add(toolsGroup);
        this.sectionObjects.push(toolsGroup);
        
        // Section 3: Gallery - Film strips and frames
        const galleryGroup = this.createGalleryObjects();
        galleryGroup.position.z = -40;
        this.scene.add(galleryGroup);
        this.sectionObjects.push(galleryGroup);
        
        // Section 4: Works - Portfolio pieces floating
        const worksGroup = this.createWorksObjects();
        worksGroup.position.z = -60;
        this.scene.add(worksGroup);
        this.sectionObjects.push(worksGroup);
        
        // Section 5: Contact - Communication elements
        const contactGroup = this.createContactObjects();
        contactGroup.position.z = -80;
        this.scene.add(contactGroup);
        this.sectionObjects.push(contactGroup);
    }

    createHeroObjects() {
        const group = new THREE.Group();
        
        // Floating play button
        const playGeometry = new THREE.ConeGeometry(0.5, 1, 3);
        const playMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
        const playBtn = new THREE.Mesh(playGeometry, playMaterial);
        playBtn.rotation.z = Math.PI / 2;
        playBtn.position.set(-3, 2, 0);
        playBtn.castShadow = true;
        group.add(playBtn);
        
        // Floating timeline
        const timelineGeometry = new THREE.BoxGeometry(3, 0.2, 0.2);
        const timelineMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
        timeline.position.set(2, -1, 1);
        timeline.castShadow = true;
        group.add(timeline);
        
        // Video frame
        const frameGeometry = new THREE.PlaneGeometry(2, 1.5);
        const frameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.8
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, 2);
        group.add(frame);
        
        return group;
    }

    createToolsObjects() {
        const group = new THREE.Group();
        
        // Software cubes floating
        const softwares = [
            { name: 'Pr', color: 0x9999ff, pos: [-2, 1, 0] },
            { name: 'Ae', color: 0xff9999, pos: [2, 1, 0] },
            { name: 'Dv', color: 0xffff99, pos: [0, -1, 1] },
            { name: 'Bl', color: 0x99ffff, pos: [-1, 0, -1] }
        ];
        
        softwares.forEach(software => {
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            const cubeMaterial = new THREE.MeshPhongMaterial({ color: software.color });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(...software.pos);
            cube.castShadow = true;
            cube.receiveShadow = true;
            group.add(cube);
        });
        
        return group;
    }

    createGalleryObjects() {
        const group = new THREE.Group();
        
        // Film strips arranged in gallery format
        for (let i = 0; i < 6; i++) {
            const stripGeometry = new THREE.PlaneGeometry(1.5, 2);
            const stripMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x2a2a2a,
                transparent: true,
                opacity: 0.9
            });
            const strip = new THREE.Mesh(stripGeometry, stripMaterial);
            
            // Arrange in gallery formation
            const angle = (i / 6) * Math.PI * 2;
            strip.position.x = Math.cos(angle) * 3;
            strip.position.z = Math.sin(angle) * 3;
            strip.position.y = Math.sin(i * 0.5) * 0.5;
            strip.rotation.y = angle + Math.PI / 2;
            
            group.add(strip);
        }
        
        return group;
    }

    createWorksObjects() {
        const group = new THREE.Group();
        
        // Portfolio thumbnails floating
        for (let i = 0; i < 8; i++) {
            const thumbnailGeometry = new THREE.PlaneGeometry(1.6, 0.9);
            const thumbnailMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x444444,
                transparent: true,
                opacity: 0.8
            });
            const thumbnail = new THREE.Mesh(thumbnailGeometry, thumbnailMaterial);
            
            // Spiral arrangement
            const angle = (i / 8) * Math.PI * 4;
            const radius = 2 + (i * 0.3);
            thumbnail.position.x = Math.cos(angle) * radius;
            thumbnail.position.y = Math.sin(angle) * radius;
            thumbnail.position.z = i * 0.5 - 2;
            thumbnail.rotation.y = angle;
            
            group.add(thumbnail);
        }
        
        return group;
    }

    createContactObjects() {
        const group = new THREE.Group();
        
        // Communication symbols
        const symbolsData = [
            { geometry: new THREE.SphereGeometry(0.5, 16, 16), color: 0x00ff88, pos: [-2, 1, 0] },
            { geometry: new THREE.BoxGeometry(1, 0.1, 1), color: 0xff8800, pos: [2, 0, 0] },
            { geometry: new THREE.ConeGeometry(0.5, 1, 8), color: 0x8800ff, pos: [0, -1, 1] }
        ];
        
        symbolsData.forEach(data => {
            const material = new THREE.MeshPhongMaterial({ color: data.color });
            const mesh = new THREE.Mesh(data.geometry, material);
            mesh.position.set(...data.pos);
            mesh.castShadow = true;
            group.add(mesh);
        });
        
        return group;
    }

    handleScrollLockNavigation(direction) {
        const sections = ['home', 'tools', 'parallax-gallery', 'works', 'contact'];
        const targetSection = this.currentSection + direction;
        
        if (targetSection >= 0 && targetSection < sections.length) {
            this.currentSection = targetSection;
            this.animateToSection(targetSection);
            
            // Update HTML scroll position
            setTimeout(() => {
                const targetElement = document.getElementById(sections[targetSection]);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }

    animateToSection(sectionIndex) {
        const targetZ = sectionIndex * -20;
        
        // Animate camera movement
        const startZ = this.camera.position.z;
        const startTime = Date.now();
        const duration = 1500;
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth transition
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            this.camera.position.z = startZ + (targetZ - startZ) * easeInOutCubic;
            
            // Add cinematic camera movements
            this.camera.position.x = Math.sin(progress * Math.PI) * 0.5;
            this.camera.position.y = Math.cos(progress * Math.PI * 2) * 0.2;
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
        
        // Animate section objects
        this.sectionObjects.forEach((obj, index) => {
            if (Math.abs(index - sectionIndex) <= 1) {
                // Activate nearby sections
                obj.visible = true;
                this.animateObjectsIn(obj);
            } else {
                // Hide distant sections
                this.animateObjectsOut(obj);
            }
        });
    }

    animateObjectsIn(group) {
        group.children.forEach((child, index) => {
            const delay = index * 100;
            setTimeout(() => {
                const startScale = child.scale.clone();
                const targetScale = new THREE.Vector3(1, 1, 1);
                const startTime = Date.now();
                const duration = 800;
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    
                    child.scale.lerpVectors(startScale, targetScale, eased);
                    child.rotation.y = (1 - progress) * Math.PI * 2;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
            }, delay);
        });
    }

    animateObjectsOut(group) {
        group.children.forEach((child, index) => {
            const delay = index * 50;
            setTimeout(() => {
                const startScale = child.scale.clone();
                const targetScale = new THREE.Vector3(0.1, 0.1, 0.1);
                const startTime = Date.now();
                const duration = 500;
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = progress * progress;
                    
                    child.scale.lerpVectors(startScale, targetScale, eased);
                    child.rotation.y += 0.1;
                    
                    if (progress >= 1) {
                        group.visible = false;
                    } else {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
            }, delay);
        });
    }

    startScrollLockAnimation() {
        const animate = () => {
            if (this.isPreloading) return;
            
            const time = Date.now() * 0.001;
            
            // Continuous object animations
            this.sectionObjects.forEach((group, sectionIndex) => {
                if (!group.visible) return;
                
                group.children.forEach((child, objectIndex) => {
                    // Floating animation
                    child.position.y += Math.sin(time * 2 + objectIndex) * 0.002;
                    
                    // Gentle rotation
                    child.rotation.x += 0.005;
                    child.rotation.z += 0.003;
                });
            });
            
            // Camera subtle movements
            this.camera.position.x += Math.sin(time * 0.5) * 0.001;
            this.camera.position.y += Math.cos(time * 0.3) * 0.001;
            
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.scrollLockActive) return;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                this.handleScrollLockNavigation(1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                this.handleScrollLockNavigation(-1);
            } else if (e.key === 'Escape') {
                this.toggleScrollLock();
            }
        });
        
        // Toggle scroll lock with spacebar
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                this.toggleScrollLock();
            }
        });
    }

    toggleScrollLock() {
        this.scrollLockActive = !this.scrollLockActive;
        
        if (this.scrollLockActive) {
            document.body.style.overflow = 'hidden';
            this.renderer.domElement.style.display = 'block';
        } else {
            document.body.style.overflow = '';
            this.renderer.domElement.style.display = 'none';
        }
        
        // Show notification
        this.showNotification(
            this.scrollLockActive ? 'Scroll Lock Enabled - Use wheel/arrows to navigate' : 'Scroll Lock Disabled'
        );
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(42, 42, 42, 0.9);
            color: #E5E1DC;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            z-index: 60;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(229, 225, 220, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update cameras
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.preloaderCamera.aspect = width / height;
        this.preloaderCamera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // Public methods for external control
    enableScrollLock() {
        this.scrollLockActive = true;
        document.body.style.overflow = 'hidden';
        this.renderer.domElement.style.display = 'block';
    }

    disableScrollLock() {
        this.scrollLockActive = false;
        document.body.style.overflow = '';
        this.renderer.domElement.style.display = 'none';
    }

    goToSection(sectionIndex) {
        if (sectionIndex >= 0 && sectionIndex < this.sectionObjects.length) {
            this.currentSection = sectionIndex;
            this.animateToSection(sectionIndex);
        }
    }

    // Cleanup method
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Dispose of geometries and materials
        this.sectionObjects.forEach(group => {
            group.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        
        this.preloaderObjects.forEach(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
    }
}

// Enhanced Video Background Controller with Kinect-style effect
class KinectVideoController {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        this.video = document.getElementById('kinect-video');
        this.canvas = document.getElementById('kinect-canvas');
        
        if (!this.video || !this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupVideoEvents();
        this.startKinectEffect();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }

    setupVideoEvents() {
        this.video.addEventListener('loadeddata', () => {
            this.isPlaying = true;
        });
        
        this.video.addEventListener('play', () => {
            this.isPlaying = true;
        });
        
        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
        });
    }

    startKinectEffect() {
        const animate = () => {
            if (this.isPlaying && this.video.readyState >= 2) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Draw video frame
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                
                // Apply kinect-style depth effect
                const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                this.applyDepthEffect(imageData);
                this.ctx.putImageData(imageData, 0, 0);
                
                // Add particle overlay
                this.drawParticleOverlay();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    applyDepthEffect(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate luminance for depth
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Create depth-based color shift
            const depthFactor = luminance / 255;
            data[i] = Math.min(255, r + (depthFactor * 30));     // Red shift
            data[i + 1] = Math.min(255, g - (depthFactor * 10)); // Green adjust
            data[i + 2] = Math.min(255, b + (depthFactor * 40)); // Blue enhance
            data[i + 3] = 255 - (depthFactor * 50);             // Alpha for depth
        }
    }

    drawParticleOverlay() {
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 30; i++) {
            const x = (Math.sin(time + i) * 0.5 + 0.5) * this.canvas.width;
            const y = (Math.cos(time * 1.3 + i) * 0.5 + 0.5) * this.canvas.height;
            const size = Math.sin(time * 2 + i) * 3 + 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(229, 225, 220, ${0.3 + Math.sin(time + i) * 0.2})`;
            this.ctx.fill();
        }
    }
}

// Enhanced Portfolio Video Gallery
class AdvancedVideoGallery {
    constructor() {
        this.currentVideo = null;
        this.videos = [];
        this.modal = null;
        
        this.init();
    }

    init() {
        this.setupVideoItems();
        this.createVideoModal();
        this.setupGalleryNavigation();
    }

    setupVideoItems() {
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach((item, index) => {
            const video = item.querySelector('video');
            if (video) {
                this.videos.push({
                    element: video,
                    title: item.dataset.title,
                    description: item.dataset.description,
                    index: index
                });
                
                // Setup hover effects
                item.addEventListener('mouseenter', () => {
                    video.play();
                    this.createVideoHoverEffect(item);
                });
                
                item.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
                
                // Setup click events
                item.addEventListener('click', () => {
                    this.openVideoModal(index);
                });
            }
        });
    }

    createVideoHoverEffect(item) {
        // Create Three.js hover effect
        const rect = item.getBoundingClientRect();
        
        // Add particle burst effect at hover position
        this.createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    createParticleBurst(x, y) {
        // Convert screen coordinates to world coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        // Create particle system for burst effect
        const particleCount = 20;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = mouse.x * 5;
            positions[i3 + 1] = mouse.y * 5;
            positions[i3 + 2] = 0;
            
            velocities.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            });
        }
        
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x00ff88,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        
        // Add to scene temporarily
        if (window.advanced3D && window.advanced3D.scene) {
            window.advanced3D.scene.add(particles);
            
            // Animate burst
            let life = 1;
            const animateBurst = () => {
                life -= 0.02;
                
                if (life > 0) {
                    const pos = particles.geometry.attributes.position.array;
                    for (let i = 0; i < particleCount; i++) {
                        const i3 = i * 3;
                        pos[i3] += velocities[i].x;
                        pos[i3 + 1] += velocities[i].y;
                        pos[i3 + 2] += velocities[i].z;
                    }
                    particles.geometry.attributes.position.needsUpdate = true;
                    particles.material.opacity = life;
                    
                    requestAnimationFrame(animateBurst);
                } else {
                    window.advanced3D.scene.remove(particles);
                    particles.geometry.dispose();
                    particles.material.dispose();
                }
            };
            
            animateBurst();
        }
    }

    createVideoModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'video-modal fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center opacity-0 pointer-events-none transition-all duration-500';
        
        this.modal.innerHTML = `
            <div class="modal-content relative max-w-6xl w-full mx-4">
                <button class="modal-close absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors z-10">×</button>
                <div class="video-container relative">
                    <video class="modal-video w-full h-auto rounded-lg" controls autoplay>
                        <source src="" type="video/mp4">
                    </video>
                    <div class="video-info absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
                        <h3 class="modal-title text-2xl font-bold text-white mb-2"></h3>
                        <p class="modal-description text-gray-300"></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        // Setup modal events
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeVideoModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeVideoModal();
            }
        });
    }

    openVideoModal(videoIndex) {
        const video = this.videos[videoIndex];
        if (!video) return;
        
        const modalVideo = this.modal.querySelector('.modal-video source');
        const modalTitle = this.modal.querySelector('.modal-title');
        const modalDescription = this.modal.querySelector('.modal-description');
        
        modalVideo.src = video.element.querySelector('source').src;
        modalTitle.textContent = video.title;
        modalDescription.textContent = video.description;
        
        // Load and show modal
        this.modal.querySelector('.modal-video').load();
        this.modal.style.pointerEvents = 'auto';
        this.modal.style.opacity = '1';
        
        document.body.style.overflow = 'hidden';
    }

    closeVideoModal() {
        this.modal.style.opacity = '0';
        this.modal.style.pointerEvents = 'none';
        
        const modalVideo = this.modal.querySelector('.modal-video');
        modalVideo.pause();
        modalVideo.currentTime = 0;
        
        document.body.style.overflow = '';
    }

    setupGalleryNavigation() {
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const scrollContainer = document.querySelector('.video-scroll-gallery .flex');
        
        if (prevBtn && nextBtn && scrollContainer) {
            prevBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
            });
            
            nextBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance for access from other scripts
    window.advanced3D = new Advanced3DController();
    window.kinectVideo = new KinectVideoController();
    window.videoGallery = new AdvancedVideoGallery();
    
    // Add scroll lock toggle button
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '🎬';
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: rgba(42, 42, 42, 0.8);
        border: 2px solid rgba(229, 225, 220, 0.3);
        border-radius: 50%;
        color: #E5E1DC;
        font-size: 24px;
        cursor: pointer;
        z-index: 40;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    toggleButton.addEventListener('click', () => {
        window.advanced3D.toggleScrollLock();
    });
    
    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.transform = 'scale(1.1)';
        toggleButton.style.background = 'rgba(229, 225, 220, 0.2)';
    });
    
    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.transform = 'scale(1)';
        toggleButton.style.background = 'rgba(42, 42, 42, 0.8)';
    });
    
    document.body.appendChild(toggleButton);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Advanced3DController,
        KinectVideoController,
        AdvancedVideoGallery
    };
}
