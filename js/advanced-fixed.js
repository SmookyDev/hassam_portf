// Enhanced Three.js Portfolio Controller - Optimized Version
// Handles 3D effects, video background, and smooth animations

class Advanced3DController {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.useWebGLFallback = false;
        this.animationId = null;
        this.clock = new THREE.Clock();

        // Video background controller
        this.videoController = null;

        // Floating elements
        this.floatingElements = [];
        this.particles = [];

        this.init();
    }

    init() {
        if (this.setupThreeJS()) {
            this.createScene();
            this.setupVideoBackground();
            this.setupEventListeners();
            this.startAnimation();
        } else {
            this.setupCanvasFallback();
        }
    }

    setupThreeJS() {
        try {
            // Check WebGL support with better detection
            const canvas = document.createElement('canvas');
            let gl = null;

            try {
                gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            } catch (e) {
                console.warn('WebGL context creation failed:', e);
                return false;
            }

            if (!gl) {
                console.warn('WebGL not supported, using 2D fallback');
                return false;
            }

            // Test WebGL functionality
            try {
                const testRenderer = new THREE.WebGLRenderer({ canvas: canvas });
                testRenderer.dispose();
            } catch (e) {
                console.warn('THREE.js WebGL renderer failed to initialize:', e);
                return false;
            }

            // Create main scene
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            // Initialize renderer with conservative settings
            this.renderer = new THREE.WebGLRenderer({
                antialias: false, // Disable to reduce GPU load
                alpha: true,
                powerPreference: 'default', // Use default instead of high-performance
                preserveDrawingBuffer: false,
                stencil: false,
                premultipliedAlpha: false
            });

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            this.renderer.setClearColor(0x000000, 0);

            // Add to floating elements container
            const container = document.getElementById('floating-3d-elements');
            if (container) {
                this.renderer.domElement.style.position = 'absolute';
                this.renderer.domElement.style.top = '0';
                this.renderer.domElement.style.left = '0';
                this.renderer.domElement.style.width = '100%';
                this.renderer.domElement.style.height = '100%';
                this.renderer.domElement.style.pointerEvents = 'none';
                container.appendChild(this.renderer.domElement);
            }

            this.camera.position.z = 5;
            return true;

        } catch (error) {
            console.warn('Three.js initialization failed:', error);
            return false;
        }
    }

    createScene() {
        // Ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);

        // Create floating geometric shapes
        this.createFloatingShapes();

        // Create particle system
        this.createParticleSystem();
    }

    createFloatingShapes() {
        const shapes = [
            { geometry: new THREE.BoxGeometry(0.8, 0.8, 0.8), color: 0x00ff88, position: [-3, 2, 1] },
            { geometry: new THREE.SphereGeometry(0.6, 16, 16), color: 0xff6b6b, position: [3, -1, 2] },
            { geometry: new THREE.ConeGeometry(0.5, 1.2, 8), color: 0x4ecdc4, position: [-2, -2, 1.5] },
            { geometry: new THREE.OctahedronGeometry(0.7), color: 0xffd93d, position: [2.5, 2.5, 0.5] },
            { geometry: new THREE.TetrahedronGeometry(0.8), color: 0x6c5ce7, position: [0, 3, 1] }
        ];

        shapes.forEach((shapeData, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });

            const mesh = new THREE.Mesh(shapeData.geometry, material);
            mesh.position.set(...shapeData.position);

            // Add random rotation
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            this.scene.add(mesh);
            this.floatingElements.push({
                mesh: mesh,
                originalPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: 0.005 + Math.random() * 0.01,
                floatOffset: Math.random() * Math.PI * 2
            });
        });
    }

    createParticleSystem() {
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

            // Colors
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.7, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    setupVideoBackground() {
        this.videoController = new EnhancedVideoController();
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Mouse movement for parallax effect
        document.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Scroll for section transitions
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onWindowResize() {
        if (this.renderer && this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    onMouseMove(event) {
        if (!this.camera) return;

        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Subtle camera movement
        this.camera.position.x = mouseX * 0.5;
        this.camera.position.y = mouseY * 0.3;
        this.camera.lookAt(0, 0, 0);
    }

    onScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Move floating elements based on scroll
        this.floatingElements.forEach((element, index) => {
            const offset = scrollY * 0.001 * (index + 1);
            element.mesh.position.y = element.originalPosition.y + offset;
        });
    }

    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            if (this.renderer && this.scene && this.camera) {
                this.updateFloatingElements();
                this.updateParticles();
                this.renderer.render(this.scene, this.camera);
            }
        };
        animate();
    }

    updateFloatingElements() {
        const time = this.clock.getElapsedTime();

        this.floatingElements.forEach((element) => {
            // Rotation
            element.mesh.rotation.x += element.rotationSpeed.x;
            element.mesh.rotation.y += element.rotationSpeed.y;
            element.mesh.rotation.z += element.rotationSpeed.z;

            // Floating movement
            element.mesh.position.y = element.originalPosition.y +
                Math.sin(time * element.floatSpeed + element.floatOffset) * 0.5;
        });
    }

    updateParticles() {
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x += 0.0005;
        }
    }

    setupCanvasFallback() {
        console.log('Using 2D canvas fallback for older browsers');
        this.create2DEffects();
    }

    create2DEffects() {
        const container = document.getElementById('floating-3d-elements');
        if (!container) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';

        container.appendChild(canvas);

        // Create 2D floating elements
        const elements = [];
        for (let i = 0; i < 8; i++) {
            elements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 20 + Math.random() * 40,
                speed: 0.5 + Math.random() * 1,
                color: `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`,
                angle: Math.random() * Math.PI * 2
            });
        }

        const animate2D = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            elements.forEach(element => {
                element.angle += element.speed * 0.01;
                element.y += Math.sin(element.angle) * 0.5;

                ctx.fillStyle = element.color;
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.size / 2, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate2D);
        };

        animate2D();
    }

    finishPreloader() {
        // Smooth transition out of preloader
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.style.transition = 'opacity 1s ease-out';
            this.renderer.domElement.style.opacity = '0';

            setTimeout(() => {
                if (this.renderer.domElement.parentNode) {
                    this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
                }
            }, 1000);
        }
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.videoController) {
            this.videoController.dispose();
        }
    }
}

// Enhanced Video Background Controller
class EnhancedVideoController {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.particles = [];

        this.init();
    }

    init() {
        this.video = document.getElementById('kinect-video');
        this.canvas = document.getElementById('kinect-canvas');

        if (!this.video || !this.canvas) {
            console.warn('Video or canvas elements not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.setupCanvas();
        this.setupVideo();
        this.createParticles();
        this.startAnimation();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    setupVideo() {
        this.video.addEventListener('loadedmetadata', () => {
            console.log('Video loaded successfully');
        });

        this.video.addEventListener('error', (e) => {
            console.warn('Video load error:', e);
            this.createFallbackBackground();
        });

        // Try autoplay with better handling
        const playVideo = () => {
            this.video.play().catch(e => {
                console.warn('Video autoplay prevented:', e);
                // Add click to play overlay
                this.addClickToPlayOverlay();
            });
        };

        // Try playing immediately
        playVideo();

        // Also try after user interaction
        document.addEventListener('click', playVideo, { once: true });
        document.addEventListener('touchstart', playVideo, { once: true });
    }

    addClickToPlayOverlay() {
        const container = document.getElementById('kinect-container');
        if (!container) return;

        const overlay = document.createElement('div');
        overlay.className = 'video-play-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
        `;

        overlay.innerHTML = `
            <div style="color: white; text-align: center; font-family: Arial, sans-serif;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">▶</div>
                <div>Click to play video</div>
            </div>
        `;

        overlay.addEventListener('click', () => {
            this.video.play().then(() => {
                overlay.remove();
            }).catch(e => {
                console.warn('Manual video play failed:', e);
                this.createFallbackBackground();
                overlay.remove();
            });
        });

        container.appendChild(overlay);
    }

    createParticles() {
        this.particles = [];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, ${200 + Math.random() * 55}, 0.6)`
            });
        }
    }

    startAnimation() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.drawFrame();
        };
        animate();
    }

    drawFrame() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw video with effects
        if (this.video && this.video.readyState >= 2) {
            this.drawVideoWithEffects();
        }

        // Draw particles
        this.drawParticles();
    }

    drawVideoWithEffects() {
        const videoAspect = this.video.videoWidth / this.video.videoHeight;
        const canvasAspect = this.canvas.width / this.canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (videoAspect > canvasAspect) {
            drawHeight = this.canvas.height;
            drawWidth = drawHeight * videoAspect;
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = this.canvas.width;
            drawHeight = drawWidth / videoAspect;
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        }

        // Create Kinect-style depth effect
        this.applyKinectEffect(offsetX, offsetY, drawWidth, drawHeight);
    }

    applyKinectEffect(offsetX, offsetY, drawWidth, drawHeight) {
        try {
            // Create or reuse temporary canvas for pixel manipulation
            if (!this.tempCanvas) {
                this.tempCanvas = document.createElement('canvas');
                this.tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true });
            }

            // Update canvas size if needed
            if (this.tempCanvas.width !== this.canvas.width || this.tempCanvas.height !== this.canvas.height) {
                this.tempCanvas.width = this.canvas.width;
                this.tempCanvas.height = this.canvas.height;
            }

            // Draw original video
            this.tempCtx.drawImage(this.video, offsetX, offsetY, drawWidth, drawHeight);

            // Get image data for processing
            const imageData = this.tempCtx.getImageData(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            const data = imageData.data;

            // Apply depth-based displacement effect
            const time = Date.now() * 0.001;
            const waveAmplitude = 5;
            const waveFrequency = 0.02;
            for (let y = 0; y < this.tempCanvas.height; y += 8) {
                for (let x = 0; x < this.tempCanvas.width; x += 8) {
                    const index = (y * this.tempCanvas.width + x) * 4;

                    if (index < data.length) {
                        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
                        const depth = brightness / 255;

                        const waveOffset = Math.sin(x * waveFrequency + time) * waveAmplitude * depth;
                        const displacedY = y + waveOffset;

                        // Draw bigger blocks instead of noisy pixels
                        this.ctx.fillStyle = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`;
                        this.ctx.fillRect(x, displacedY, 16, 16);
                    }
                }
            }

            // Add particle overlay based on video brightness
            //this.addDepthParticles(this.tempCtx, this.tempCanvas.width, this.tempCanvas.height);

        } catch (error) {
            // Fallback: simple video draw
            this.ctx.globalAlpha = 0.8;
            this.ctx.drawImage(this.video, offsetX, offsetY, drawWidth, drawHeight);

            // Add overlay effect
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = 'rgba(42, 42, 42, 0.4)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.globalAlpha = 1;
        }
    }

    addDepthParticles(sourceCtx, width, height) {
        // Sample pixels for depth-based particles
        const sampleRate = 20; // Sample every 20th pixel

        for (let y = 0; y < height; y += sampleRate) {
            for (let x = 0; x < width; x += sampleRate) {
                try {
                    const pixel = sourceCtx.getImageData(x, y, 1, 1).data;
                    const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;

                    if (brightness > 50) { // Only draw for bright pixels
                        const size = (brightness / 255) * 3 + 1;
                        const alpha = brightness / 255 * 0.6;

                        this.ctx.globalAlpha = alpha;
                        this.ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, size, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                } catch (e) {
                    // Skip pixel if error occurs
                    continue;
                }
            }
        }

        this.ctx.globalAlpha = 1;
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle with safe radius
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, Math.max(particle.size, 0.5), 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
    }

    createFallbackBackground() {
        // Create animated gradient background
        const animate = () => {
            if (!this.ctx) return;

            const time = Date.now() * 0.001;
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);

            gradient.addColorStop(0, `rgba(42, 42, 42, 0.9)`);
            gradient.addColorStop(0.5, `rgba(${80 + Math.sin(time) * 20}, ${80 + Math.cos(time) * 20}, 120, 0.8)`);
            gradient.addColorStop(1, `rgba(42, 42, 42, 0.9)`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            requestAnimationFrame(animate);
        };
        animate();
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;

    // Initialize 3D controller with WebGL fallback
    window.advanced3D = new Advanced3DController();

    if (isMobile) {
        // Mobile fallback - ensure video is visible
        const video = document.getElementById('kinect-video');
        if (video) {
            video.style.display = 'block';
            video.play().catch(e => console.log('Mobile video autoplay prevented'));
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.advanced3D) {
        window.advanced3D.dispose();
    }
});