/**
 * Advanced 3D Effects Component
 * Handles scroll-locked transitions, enhanced section animations, and interactive 3D effects using Three.js
 */

class Advanced3DEffects {
    constructor(config = {}) {
        this.scenes = new Map();
        this.renderers = new Map();
        this.cameras = new Map();
        this.animationFrames = new Map();
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.isTransitioning = false;
        
        // Scroll-locked transition configuration
        this.config = {
            // Scroll-locked Transitions
            scrollTransitions: {
                enabled: true,
                duration: 1000,           // Transition duration in ms
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
                perspective: 1000,        // 3D perspective value
                rotationIntensity: 15,    // Degrees of rotation during transition
                scaleRange: { min: 0.8, max: 1.1 }, // Scale animation range
                parallaxFactor: 0.5,      // Parallax scrolling intensity
                lockThreshold: 50,        // px threshold to lock scroll
                autoUnlock: true          // Auto-unlock after transition
            },
            
            // Floating Elements Controls (reduced for performance)
            floatingElements: {
                enabled: false,           // Disabled in favor of scroll-locked transitions
                count: 3,
                bounceHeight: 0.2,
                bounceSpeed: 0.015,
                rotationSpeed: 0.005,
                opacity: 0.4,
                mouseInfluence: 0.3,
                wireframe: true,
                colors: [0x667eea, 0x764ba2, 0xf093fb],
                autoHide: true,
                scalePulse: false
            },
            
            // Software Showcase Controls
            softwareShowcase: {
                enabled: true,
                floatAmplitude: 0.2,
                floatSpeed: 0.01,
                rotationSpeed: 0.005,
                opacity: 0.8,
                cameraOrbit: true,
                orbitSpeed: 0.0003,
                hoverScale: 1.3,
                wireframe: false
            },
            
            // Section Animation Controls
            sectionAnimations: {
                enabled: true,
                stagger: 200,             // Delay between elements (ms)
                transformOrigin: 'center',
                useGPU: true,
                reducedMotion: false
            },
            
            // Performance Controls
            performance: {
                enableGPUAcceleration: true,
                reduceOnMobile: true,
                maxFPS: 60,
                pauseWhenNotVisible: true
            }
        };
        
        // Merge user config with defaults
        this.config = this.mergeConfig(this.config, config);
        
        this.init();
    }

    init() {
        this.setupMouseTracking();
        
        if (this.config.floatingElements.enabled) {
            this.createFloating3DElements();
        }
        
        if (this.config.softwareShowcase.enabled) {
            this.createSoftware3DShowcase();
        }
        
        // Only create particles if floatingElements is enabled
        if (this.config.floatingElements.enabled) {
            this.createParticleEffects();
        }
        
        this.startAnimationLoop();
        this.setupControlMethods();
    }
    
    // Merge configuration objects
    mergeConfig(defaultConfig, userConfig) {
        const merged = JSON.parse(JSON.stringify(defaultConfig));
        
        for (const key in userConfig) {
            if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key])) {
                merged[key] = { ...merged[key], ...userConfig[key] };
            } else {
                merged[key] = userConfig[key];
            }
        }
        
        return merged;
    }
    
    // Setup control methods for easy customization
    setupControlMethods() {
        // Expose control methods to window for easy access
        window.control3D = {
            // Floating Elements Controls
            setBounceHeight: (height) => this.setBounceHeight(height),
            setBounceSpeed: (speed) => this.setBounceSpeed(speed),
            setElementOpacity: (opacity) => this.setElementOpacity(opacity),
            toggleWireframe: () => this.toggleWireframe(),
            pauseAnimations: () => this.pauseAnimations(),
            resumeAnimations: () => this.resumeAnimations(),
            toggleElements: () => this.toggleElements(),
            
            // Quick presets
            presets: {
                subtle: () => this.applyPreset('subtle'),
                normal: () => this.applyPreset('normal'),
                energetic: () => this.applyPreset('energetic'),
                minimal: () => this.applyPreset('minimal')
            },
            
            // Real-time configuration
            config: this.config
        };
        
        console.log('3D Controls available via window.control3D');
        console.log('Try: window.control3D.setBounceHeight(1.0) or window.control3D.presets.energetic()');
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    createFloating3DElements() {
        const container = document.getElementById('floating-3d-elements');
        if (!container) return;

        try {
            // Check WebGL support first
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                console.warn('WebGL not supported for floating elements, skipping 3D effects');
                return;
            }

            // Create Three.js scene for floating elements
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            // Create floating video editing tools
            this.createFloatingTools(scene);

            // Position camera
            camera.position.z = 5;

            this.scenes.set('floating', scene);
            this.cameras.set('floating', camera);
            this.renderers.set('floating', renderer);
        } catch (error) {
            console.warn('Failed to create floating 3D elements:', error);
        }
    }

    createFloatingTools(scene) {
        const tools = [
            { name: 'Timeline', color: 0x4F46E5, position: { x: -3, y: 1, z: 0 } },
            { name: 'ColorWheel', color: 0xF59E0B, position: { x: 3, y: -1, z: 0 } },
            { name: 'Waveform', color: 0x10B981, position: { x: 0, y: 2, z: -1 } },
            { name: 'Keyframe', color: 0xEF4444, position: { x: -2, y: -2, z: 1 } },
            { name: 'Effect', color: 0x8B5CF6, position: { x: 2, y: 1.5, z: -0.5 } },
        ];

        tools.forEach((tool, index) => {
            // Create different geometries for different tools
            let geometry;
            switch (tool.name) {
                case 'Timeline':
                    geometry = new THREE.BoxGeometry(2, 0.3, 0.3);
                    break;
                case 'ColorWheel':
                    geometry = new THREE.TorusGeometry(0.5, 0.2, 8, 20);
                    break;
                case 'Waveform':
                    geometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
                    break;
                case 'Keyframe':
                    geometry = new THREE.SphereGeometry(0.3, 16, 16);
                    break;
                case 'Effect':
                    geometry = new THREE.OctahedronGeometry(0.4);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            }

            const material = new THREE.MeshBasicMaterial({ 
                color: tool.color,
                transparent: true,
                opacity: this.config.floatingElements.opacity,
                wireframe: this.config.floatingElements.wireframe
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(tool.position.x, tool.position.y, tool.position.z);
            mesh.userData = { 
                originalPosition: { ...tool.position }, 
                name: tool.name, 
                speed: this.config.floatingElements.bounceSpeed + Math.random() * 0.01,
                amplitude: this.config.floatingElements.bounceHeight,
                rotationSpeed: this.config.floatingElements.rotationSpeed
            };
            
            scene.add(mesh);
        });
    }

    createSoftware3DShowcase() {
        const canvas = document.getElementById('software-canvas');
        if (!canvas) return;

        try {
            // Check WebGL support first
            const testCanvas = document.createElement('canvas');
            const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
            
            if (!gl) {
                console.warn('WebGL not supported for software showcase, using 2D fallback');
                this.createSoftware2DFallback(canvas);
                return;
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setClearColor(0x000000, 0);

            // Create 3D software icons
            this.createSoftwareIcons(scene);

            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            camera.position.z = 8;

            this.scenes.set('software', scene);
            this.cameras.set('software', camera);
            this.renderers.set('software', renderer);
        } catch (error) {
            console.warn('Failed to create software 3D showcase:', error);
            this.createSoftware2DFallback(canvas);
        }
    }

    createSoftwareIcons(scene) {
        const softwareData = [
            { name: 'Pr', color: 0x9A3FFF, position: { x: -4, y: 2, z: 0 } },
            { name: 'Ae', color: 0xCF3FFF, position: { x: -2, y: -1, z: 1 } },
            { name: 'DV', color: 0xFF3F3F, position: { x: 0, y: 1.5, z: -1 } },
            { name: 'Bl', color: 0xFF7F3F, position: { x: 2, y: -0.5, z: 0.5 } },
            { name: 'FCP', color: 0x3F3F3F, position: { x: 4, y: 1, z: -0.5 } },
            { name: 'C4D', color: 0x3F7FFF, position: { x: -1, y: -2, z: 0 } },
        ];

        softwareData.forEach((software, index) => {
            // Create rounded cube geometry
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ 
                color: software.color,
                transparent: true,
                opacity: 0.8
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(software.position.x, software.position.y, software.position.z);
            mesh.userData = { 
                originalPosition: { ...software.position }, 
                name: software.name,
                rotationSpeed: Math.random() * 0.02 + 0.01,
                floatSpeed: Math.random() * 0.015 + 0.01
            };

            // Add text texture
            this.addTextToMesh(mesh, software.name);
            
            scene.add(mesh);
        });
    }

    addTextToMesh(mesh, text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        context.fillStyle = '#FFFFFF';
        context.font = 'Bold 60px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 0.9
        });

        const textGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.z = 0.51;
        mesh.add(textMesh);
    }

    createSoftware2DFallback(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const softwareData = [
            { name: 'Pr', color: '#9A3FFF', x: 100, y: 150 },
            { name: 'Ae', color: '#CF3FFF', x: 200, y: 100 },
            { name: 'DV', color: '#FF3F3F', x: 300, y: 180 },
            { name: 'Bl', color: '#FF7F3F', x: 400, y: 120 },
            { name: 'FCP', color: '#3F3F3F', x: 500, y: 160 },
            { name: 'C4D', color: '#3F7FFF', x: 150, y: 80 }
        ];

        const animate2D = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const time = Date.now() * 0.001;
            
            softwareData.forEach((software, index) => {
                const offset = Math.sin(time + index) * 10;
                const x = software.x + offset;
                const y = software.y + Math.cos(time + index) * 5;
                
                // Draw software icon
                ctx.fillStyle = software.color;
                ctx.fillRect(x - 25, y - 25, 50, 50);
                
                // Draw text
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(software.name, x, y + 5);
            });
            
            requestAnimationFrame(animate2D);
        };
        
        animate2D();
    }

    createParticleEffects() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return;

        // Create particle system for hero background
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        
        // Add to floating scene if it exists
        const floatingScene = this.scenes.get('floating');
        if (floatingScene) {
            floatingScene.add(particleSystem);
        }
    }

    startAnimationLoop() {
        const animate = () => {
            // Animate floating elements
            const floatingScene = this.scenes.get('floating');
            const floatingCamera = this.cameras.get('floating');
            const floatingRenderer = this.renderers.get('floating');

            if (floatingScene && floatingCamera && floatingRenderer) {
                floatingScene.children.forEach((child) => {
                    if (child.userData.originalPosition) {
                        const time = Date.now() * child.userData.speed;
                        child.position.y = child.userData.originalPosition.y + Math.sin(time) * child.userData.amplitude;
                        child.rotation.x += child.userData.rotationSpeed;
                        child.rotation.y += child.userData.rotationSpeed * 0.7;

                        // Mouse interaction
                        const mouseInfluence = this.config.floatingElements.mouseInfluence;
                        child.position.x = child.userData.originalPosition.x + this.mouse.x * mouseInfluence;
                        child.position.z = child.userData.originalPosition.z + this.mouse.y * mouseInfluence;
                        
                        // Scale pulse effect if enabled
                        if (this.config.floatingElements.scalePulse) {
                            const pulseScale = 1 + Math.sin(time * 2) * 0.1;
                            child.scale.set(pulseScale, pulseScale, pulseScale);
                        }
                    }
                });

                // Camera movement based on mouse
                floatingCamera.position.x = this.mouse.x * 0.5;
                floatingCamera.position.y = this.mouse.y * 0.5;
                floatingCamera.lookAt(0, 0, 0);

                floatingRenderer.render(floatingScene, floatingCamera);
            }

            // Animate software showcase
            const softwareScene = this.scenes.get('software');
            const softwareCamera = this.cameras.get('software');
            const softwareRenderer = this.renderers.get('software');

            if (softwareScene && softwareCamera && softwareRenderer) {
                softwareScene.children.forEach((child) => {
                    if (child.userData.originalPosition) {
                        const time = Date.now() * child.userData.floatSpeed;
                        child.position.y = child.userData.originalPosition.y + Math.sin(time) * 0.3;
                        child.rotation.x += child.userData.rotationSpeed;
                        child.rotation.y += child.userData.rotationSpeed * 1.2;
                    }
                });

                // Camera orbit
                const time = Date.now() * 0.0005;
                softwareCamera.position.x = Math.cos(time) * 8;
                softwareCamera.position.z = Math.sin(time) * 8;
                softwareCamera.lookAt(0, 0, 0);

                softwareRenderer.render(softwareScene, softwareCamera);
            }

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Interactive methods
    onSoftwareCardHover(softwareName) {
        const softwareScene = this.scenes.get('software');
        if (!softwareScene) return;

        softwareScene.children.forEach((child) => {
            if (child.userData.name === softwareName) {
                // Highlight the corresponding 3D object
                if (child.material && child.material.emissive) {
                    child.material.emissive.setHex(0x444444);
                }
                child.scale.set(1.2, 1.2, 1.2);
            } else {
                if (child.material && child.material.emissive) {
                    child.material.emissive.setHex(0x000000);
                }
                child.scale.set(1, 1, 1);
            }
        });
    }

    onSoftwareCardLeave() {
        const softwareScene = this.scenes.get('software');
        if (!softwareScene) return;

        softwareScene.children.forEach((child) => {
            if (child.material && child.material.emissive) {
                child.material.emissive.setHex(0x000000);
            }
            child.scale.set(1, 1, 1);
        });
    }

    // Resize handler
    onWindowResize() {
        // Update floating elements renderer
        const floatingRenderer = this.renderers.get('floating');
        const floatingCamera = this.cameras.get('floating');
        
        if (floatingRenderer && floatingCamera) {
            floatingCamera.aspect = window.innerWidth / window.innerHeight;
            floatingCamera.updateProjectionMatrix();
            floatingRenderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Update software showcase renderer
        const softwareCanvas = document.getElementById('software-canvas');
        const softwareRenderer = this.renderers.get('software');
        const softwareCamera = this.cameras.get('software');
        
        if (softwareCanvas && softwareRenderer && softwareCamera) {
            const rect = softwareCanvas.getBoundingClientRect();
            softwareCamera.aspect = rect.width / rect.height;
            softwareCamera.updateProjectionMatrix();
            softwareRenderer.setSize(rect.width, rect.height);
        }
    }

    // ===== CONTROL METHODS FOR CUSTOMIZATION =====
    
    // Set bounce height for floating elements
    setBounceHeight(height) {
        this.config.floatingElements.bounceHeight = Math.max(0, Math.min(2, height));
        
        const floatingScene = this.scenes.get('floating');
        if (floatingScene) {
            floatingScene.children.forEach((child) => {
                if (child.userData.originalPosition) {
                    child.userData.amplitude = this.config.floatingElements.bounceHeight;
                }
            });
        }
        
        console.log(`Bounce height set to: ${this.config.floatingElements.bounceHeight}`);
    }
    
    // Set bounce speed for floating elements
    setBounceSpeed(speed) {
        this.config.floatingElements.bounceSpeed = Math.max(0.01, Math.min(0.1, speed));
        
        const floatingScene = this.scenes.get('floating');
        if (floatingScene) {
            floatingScene.children.forEach((child) => {
                if (child.userData.originalPosition) {
                    child.userData.speed = this.config.floatingElements.bounceSpeed + Math.random() * 0.01;
                }
            });
        }
        
        console.log(`Bounce speed set to: ${this.config.floatingElements.bounceSpeed}`);
    }
    
    // Set opacity for all floating elements
    setElementOpacity(opacity) {
        this.config.floatingElements.opacity = Math.max(0, Math.min(1, opacity));
        
        const floatingScene = this.scenes.get('floating');
        if (floatingScene) {
            floatingScene.children.forEach((child) => {
                if (child.material && child.material.transparent) {
                    child.material.opacity = this.config.floatingElements.opacity;
                }
            });
        }
        
        console.log(`Element opacity set to: ${this.config.floatingElements.opacity}`);
    }
    
    // Toggle wireframe mode
    toggleWireframe() {
        this.config.floatingElements.wireframe = !this.config.floatingElements.wireframe;
        
        const floatingScene = this.scenes.get('floating');
        if (floatingScene) {
            floatingScene.children.forEach((child) => {
                if (child.material) {
                    child.material.wireframe = this.config.floatingElements.wireframe;
                }
            });
        }
        
        console.log(`Wireframe mode: ${this.config.floatingElements.wireframe ? 'ON' : 'OFF'}`);
    }
    
    // Toggle scale pulse effect
    toggleScalePulse() {
        this.config.floatingElements.scalePulse = !this.config.floatingElements.scalePulse;
        console.log(`Scale pulse effect: ${this.config.floatingElements.scalePulse ? 'ON' : 'OFF'}`);
    }
    
    // Pause all animations
    pauseAnimations() {
        this.animationPaused = true;
        console.log('3D Animations paused');
    }
    
    // Resume all animations
    resumeAnimations() {
        this.animationPaused = false;
        console.log('3D Animations resumed');
    }
    
    // Toggle visibility of floating elements
    toggleElements() {
        const container = document.getElementById('floating-3d-elements');
        if (container) {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
                console.log(`Floating elements: ${canvas.style.display === 'none' ? 'HIDDEN' : 'VISIBLE'}`);
            }
        }
    }
    
    // Set mouse influence strength
    setMouseInfluence(influence) {
        this.config.floatingElements.mouseInfluence = Math.max(0, Math.min(2, influence));
        console.log(`Mouse influence set to: ${this.config.floatingElements.mouseInfluence}`);
    }
    
    // Set rotation speed
    setRotationSpeed(speed) {
        this.config.floatingElements.rotationSpeed = Math.max(0, Math.min(0.05, speed));
        
        const floatingScene = this.scenes.get('floating');
        if (floatingScene) {
            floatingScene.children.forEach((child) => {
                if (child.userData.originalPosition) {
                    child.userData.rotationSpeed = this.config.floatingElements.rotationSpeed;
                }
            });
        }
        
        console.log(`Rotation speed set to: ${this.config.floatingElements.rotationSpeed}`);
    }
    
    // Apply predefined presets
    applyPreset(presetName) {
        const presets = {
            subtle: {
                bounceHeight: 0.2,
                bounceSpeed: 0.015,
                rotationSpeed: 0.005,
                opacity: 0.4,
                mouseInfluence: 0.2,
                scalePulse: false
            },
            normal: {
                bounceHeight: 0.5,
                bounceSpeed: 0.02,
                rotationSpeed: 0.01,
                opacity: 0.7,
                mouseInfluence: 0.5,
                scalePulse: false
            },
            energetic: {
                bounceHeight: 1.0,
                bounceSpeed: 0.04,
                rotationSpeed: 0.025,
                opacity: 0.9,
                mouseInfluence: 1.0,
                scalePulse: true
            },
            minimal: {
                bounceHeight: 0.1,
                bounceSpeed: 0.01,
                rotationSpeed: 0.002,
                opacity: 0.3,
                mouseInfluence: 0.1,
                scalePulse: false
            }
        };
        
        const preset = presets[presetName];
        if (preset) {
            this.setBounceHeight(preset.bounceHeight);
            this.setBounceSpeed(preset.bounceSpeed);
            this.setRotationSpeed(preset.rotationSpeed);
            this.setElementOpacity(preset.opacity);
            this.setMouseInfluence(preset.mouseInfluence);
            this.config.floatingElements.scalePulse = preset.scalePulse;
            
            console.log(`Applied preset: ${presetName}`);
        }
    }
    
    // Change element colors
    changeElementColors(colorArray) {
        const floatingScene = this.scenes.get('floating');
        if (floatingScene && Array.isArray(colorArray)) {
            floatingScene.children.forEach((child, index) => {
                if (child.material && colorArray[index % colorArray.length]) {
                    child.material.color.setHex(colorArray[index % colorArray.length]);
                }
            });
            
            console.log('Element colors updated');
        }
    }
    
    // Destroy method for cleanup
    destroy() {
        this.animationFrames.forEach((frame) => {
            cancelAnimationFrame(frame);
        });
        
        this.renderers.forEach((renderer) => {
            renderer.dispose();
        });

        this.scenes.forEach((scene) => {
            scene.clear();
        });
        
        // Clean up control methods
        if (window.control3D) {
            delete window.control3D;
        }
    }
}

/**
 * Enhanced Scroll Effects Component
 * Handles advanced parallax scrolling, reveal animations, and scroll-triggered effects
 */

class EnhancedScrollEffects {
    constructor() {
        this.scrollY = 0;
        this.ticking = false;
        this.parallaxElements = [];
        this.revealElements = [];
        this.init();
    }

    init() {
        this.setupScrollTracking();
        this.initParallaxElements();
        this.initRevealElements();
        this.initHeroAnimations();
    }

    setupScrollTracking() {
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
            
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.updateRevealAnimations();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    initParallaxElements() {
        // Find all parallax elements
        this.parallaxElements = [
            {
                element: document.querySelector('.parallax-bg-slow'),
                speed: 0.2
            },
            {
                element: document.querySelector('.parallax-bg-medium'),
                speed: 0.5
            },
            {
                element: document.querySelector('.parallax-bg-fast'),
                speed: 0.8
            }
        ].filter(item => item.element);
    }

    initRevealElements() {
        // Find all elements that should be revealed on scroll
        this.revealElements = document.querySelectorAll('.section-transition');
    }

    initHeroAnimations() {
        // Trigger hero animations after page load
        setTimeout(() => {
            const heroElements = [
                '.hero-tagline',
                '.hero-logo', 
                '.hero-intro',
                '.hero-portfolio',
                '.hero-cta',
                '.scroll-indicator'
            ];

            heroElements.forEach((selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.classList.add('animate');
                }
            });
        }, 500);
    }

    updateParallax() {
        this.parallaxElements.forEach(({ element, speed }) => {
            if (element) {
                const yPos = -(this.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    updateRevealAnimations() {
        this.revealElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !element.classList.contains('animate')) {
                element.classList.add('animate');
            }
        });
    }

    // Add stagger animation to elements
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate');
            }, index * delay);
        });
    }
}

/**
 * Interactive Video Gallery Component
 * Handles video gallery interactions, scroll navigation, and video controls
 */

class InteractiveVideoGallery {
    constructor() {
        this.currentVideoIndex = 0;
        this.videos = [];
        this.mainVideo = null;
        this.init();
    }

    init() {
        this.setupVideoData();
        this.initMainVideo();
        this.initVideoItems();
        this.initGalleryNavigation();
        this.initVideoAnimations();
    }

    setupVideoData() {
        this.videos = [
            {
                src: 'assets/videos/1.mp4',
                title: 'Commercial Project',
                description: 'Brand storytelling with dynamic cuts and transitions',
                tags: ['Commercial', 'Branding', 'Storytelling']
            },
            {
                src: 'assets/videos/2.mp4',
                title: 'Music Video',
                description: 'Creative visual effects synchronized with beat',
                tags: ['Music Video', 'VFX', 'Rhythm']
            },
            {
                src: 'assets/videos/3.mp4',
                title: 'Documentary',
                description: 'Emotional storytelling with careful pacing',
                tags: ['Documentary', 'Narrative', 'Emotion']
            },
            {
                src: 'assets/videos/4.mp4',
                title: 'Motion Graphics',
                description: 'Abstract animations and kinetic typography',
                tags: ['Motion Graphics', 'Animation', 'Typography']
            }
        ];
    }

    initMainVideo() {
        this.mainVideo = document.getElementById('main-portfolio-video');
        if (!this.mainVideo) return;

        // Setup play button functionality
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                if (this.mainVideo.paused) {
                    this.mainVideo.play();
                    playButton.style.opacity = '0';
                } else {
                    this.mainVideo.pause();
                    playButton.style.opacity = '1';
                }
            });
        }

        // Auto-hide controls
        this.mainVideo.addEventListener('play', () => {
            const playButton = document.querySelector('.play-button');
            if (playButton) playButton.style.opacity = '0';
        });

        this.mainVideo.addEventListener('pause', () => {
            const playButton = document.querySelector('.play-button');
            if (playButton) playButton.style.opacity = '1';
        });
    }

    initVideoItems() {
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach((item, index) => {
            // Add click handler to change main video
            item.addEventListener('click', () => {
                this.changeMainVideo(index);
            });

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                const video = item.querySelector('video');
                if (video) {
                    video.currentTime = 0;
                    video.play().catch(() => {
                        // Ignore play errors (autoplay policy)
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                const video = item.querySelector('video');
                if (video) {
                    video.pause();
                }
            });
        });
    }

    initGalleryNavigation() {
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const scrollContainer = document.querySelector('.scroll-container .flex');

        if (prevBtn && nextBtn && scrollContainer) {
            prevBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
            });

            // Update button states based on scroll position
            scrollContainer.addEventListener('scroll', () => {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
                
                prevBtn.disabled = scrollLeft <= 0;
                nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
                
                prevBtn.classList.toggle('opacity-50', prevBtn.disabled);
                nextBtn.classList.toggle('opacity-50', nextBtn.disabled);
            });
        }
    }

    initVideoAnimations() {
        // Animate video items on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.video-item').forEach((item) => {
            observer.observe(item);
        });
    }

    changeMainVideo(index) {
        if (!this.mainVideo || !this.videos[index]) return;

        // Update main video source
        const source = this.mainVideo.querySelector('source');
        if (source) {
            source.src = this.videos[index].src;
            this.mainVideo.load();
        }

        // Update video info
        const videoInfo = document.querySelector('.main-video-container .absolute.bottom-6');
        if (videoInfo) {
            const title = videoInfo.querySelector('h4');
            const description = videoInfo.querySelector('p');
            const tags = videoInfo.querySelector('.flex.items-center');

            if (title) title.textContent = this.videos[index].title;
            if (description) description.textContent = this.videos[index].description;
            
            if (tags) {
                tags.innerHTML = this.videos[index].tags.map(tag => 
                    `<span class="text-sm bg-white/20 px-3 py-1 rounded-full">${tag}</span>`
                ).join('');
            }
        }

        this.currentVideoIndex = index;
    }
}

/**
 * Enhanced Cursor Stalker Component
 * Creates a custom cursor that follows the mouse with interactive effects
 */

class EnhancedCursorStalker {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }

    init() {
        this.createCursor();
        this.setupEventListeners();
    }

    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-stalker fixed pointer-events-none z-50 mix-blend-difference';
        this.cursor.style.width = '10px';
        this.cursor.style.height = '10px';
        this.cursor.style.backgroundColor = 'white';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.transition = 'all 0.1s ease';
        document.body.appendChild(this.cursor);

        // Cursor follower (larger circle)
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'cursor-stalker fixed pointer-events-none z-49 mix-blend-difference';
        this.cursorFollower.style.width = '40px';
        this.cursorFollower.style.height = '40px';
        this.cursorFollower.style.border = '2px solid white';
        this.cursorFollower.style.borderRadius = '50%';
        this.cursorFollower.style.transition = 'all 0.3s ease';
        document.body.appendChild(this.cursorFollower);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            // Update cursor position
            this.cursor.style.left = e.clientX - 5 + 'px';
            this.cursor.style.top = e.clientY - 5 + 'px';

            // Update follower position with delay
            setTimeout(() => {
                this.cursorFollower.style.left = e.clientX - 20 + 'px';
                this.cursorFollower.style.top = e.clientY - 20 + 'px';
            }, 50);
        });

        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .software-card, .video-item');
        
        interactiveElements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursorFollower.style.transform = 'scale(1.2)';
                this.cursorFollower.style.borderColor = '#8B7D6B';
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
                this.cursorFollower.style.borderColor = 'white';
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '1';
        });
    }
}

// Initialize all enhanced components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other components to load
    setTimeout(() => {
        window.advanced3DEffects = new Advanced3DEffects();
        window.enhancedScrollEffects = new EnhancedScrollEffects();
        window.interactiveVideoGallery = new InteractiveVideoGallery();
        window.enhancedCursorStalker = new EnhancedCursorStalker();

        // Setup software card interactions
        const softwareCards = document.querySelectorAll('.software-card');
        softwareCards.forEach((card) => {
            const softwareName = card.getAttribute('data-software');
            
            card.addEventListener('mouseenter', () => {
                window.advanced3DEffects.onSoftwareCardHover(softwareName);
            });

            card.addEventListener('mouseleave', () => {
                window.advanced3DEffects.onSoftwareCardLeave();
            });
        });

        // Setup resize handler
        window.addEventListener('resize', () => {
            window.advanced3DEffects.onWindowResize();
        });

    }, 1000);
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Advanced3DEffects,
        EnhancedScrollEffects,
        InteractiveVideoGallery,
        EnhancedCursorStalker
    };
}
