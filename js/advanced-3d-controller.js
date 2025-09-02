// Advanced 3D Controller (Three.js only)
// Handles 3D effects, floating objects, and particles

class Advanced3DController {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.useWebGLFallback = false;
        this.animationId = null;
        this.clock = new THREE.Clock();

        // Floating elements
        this.floatingElements = [];
        this.particles = [];

        this.init();
    }

    init() {
        if (this.setupThreeJS()) {
            this.createScene();
            this.setupEventListeners();
            this.startAnimation();
        } else {
            this.setupCanvasFallback();
        }
    }

    setupThreeJS() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return false;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            this.renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: true,
                powerPreference: 'default'
            });

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            this.renderer.setClearColor(0x000000, 0);

            const container = document.getElementById('floating-3d-elements');
            if (container) {
                this.renderer.domElement.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                `;
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
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);

        this.createFloatingShapes();
        this.createParticleSystem();
    }

    createFloatingShapes() {
        const spread = 6; // increase this to push them further apart

        const shapes = [
            { geometry: new THREE.BoxGeometry(0.8, 0.8, 0.8), color: 0x556b8e, position: [-1, 1, 0] },
            { geometry: new THREE.SphereGeometry(0.6, 16, 16), color: 0x8fa3bf, position: [1, -1, 1] },
            { geometry: new THREE.ConeGeometry(0.5, 1.2, 12), color: 0xa38f7f, position: [-1, -1, 1] },
            { geometry: new THREE.OctahedronGeometry(0.7), color: 0x9d8ca3, position: [1, 1, 0] },
            { geometry: new THREE.TetrahedronGeometry(0.8), color: 0x6c7a89, position: [0, 2, -1] },
            { geometry: new THREE.TorusGeometry(0.7, 0.2, 16, 100), color: 0x7b9e89, position: [-1, 0.5, -1] },
            { geometry: new THREE.DodecahedronGeometry(0.8), color: 0x8b7d6b, position: [1, -2, 1] },
            { geometry: new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16), color: 0x7f8c8d, position: [0, -2, -1] },
            { geometry: new THREE.IcosahedronGeometry(0.9), color: 0x9b9b7a, position: [2, 0, -2] },
            { geometry: new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16), color: 0x7d6b91, position: [-2, 2, -2] }
        ];

        shapes.forEach((shapeData) => {
            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                shininess: 75,
                transparent: true,
                opacity: 0.7
            });

            const mesh = new THREE.Mesh(shapeData.geometry, material);

            // multiply positions by spread factor
            mesh.position.set(
                shapeData.position[0] * spread,
                shapeData.position[1] * spread,
                shapeData.position[2] * spread
            );

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
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

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

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
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

        this.camera.position.x = mouseX * 0.5;
        this.camera.position.y = mouseY * 0.3;
        this.camera.lookAt(0, 0, 0);
    }

    onScroll() {
        const scrollY = window.scrollY;
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
            element.mesh.rotation.x += element.rotationSpeed.x;
            element.mesh.rotation.y += element.rotationSpeed.y;
            element.mesh.rotation.z += element.rotationSpeed.z;

            element.mesh.position.y =
                element.originalPosition.y +
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
    }

    dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.advanced3D = new Advanced3DController();
});