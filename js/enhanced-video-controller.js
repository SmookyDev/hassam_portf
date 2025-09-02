class EnhancedVideoController {
    constructor(videoElementId, canvasElementId) {
        this.video = document.getElementById(videoElementId);
        this.canvas = document.getElementById(canvasElementId);
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });

        this.tempCanvas = document.createElement("canvas");
        this.tempCtx = this.tempCanvas.getContext("2d", { willReadFrequently: true });

        this.isPlaying = false;

        this.setupCanvas();
        this.bindEvents();
    }

    setupCanvas() {
        // Don’t cover full screen — keep relative size
        this.canvas.width = this.video.videoWidth || 640;
        this.canvas.height = this.video.videoHeight || 360;

        this.canvas.style.position = "absolute";
        this.canvas.style.top = "50%";
        this.canvas.style.left = "50%";
        this.canvas.style.transform = "translate(-50%, -50%)";
        this.canvas.style.zIndex = "1"; // Below Three.js if needed
        this.canvas.style.opacity = "0.9"; // Slight transparency
        this.canvas.style.pointerEvents = "none";
    }

    bindEvents() {
        this.video.addEventListener("play", () => {
            this.isPlaying = true;
            this.animate();
        });

        this.video.addEventListener("pause", () => this.isPlaying = false);
        this.video.addEventListener("ended", () => this.isPlaying = false);
    }

    animate() {
        if (!this.isPlaying) return;

        this.drawKineticEffect();
        requestAnimationFrame(() => this.animate());
    }

    drawKineticEffect() {
        // Sync sizes
        if (this.tempCanvas.width !== this.canvas.width ||
            this.tempCanvas.height !== this.canvas.height) {
            this.tempCanvas.width = this.canvas.width;
            this.tempCanvas.height = this.canvas.height;
        }

        // Draw raw video to temp canvas
        this.tempCtx.drawImage(this.video, 0, 0, this.tempCanvas.width, this.tempCanvas.height);

        const imageData = this.tempCtx.getImageData(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        const data = imageData.data;

        const time = Date.now() * 0.002;
        const waveAmplitude = 6; // stronger wave
        const waveFrequency = 0.04; // tighter ripple
        const blockSize = 6; // bigger blocks (not noisy pixels)

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < this.tempCanvas.height; y += blockSize) {
            for (let x = 0; x < this.tempCanvas.width; x += blockSize) {
                const index = (y * this.tempCanvas.width + x) * 4;

                if (index < data.length) {
                    const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
                    const depth = brightness / 255;

                    const waveOffset = Math.sin(x * waveFrequency + time) * waveAmplitude * depth;
                    const displacedY = y + waveOffset;

                    this.ctx.fillStyle = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`;
                    this.ctx.fillRect(x, displacedY, blockSize, blockSize);
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const videoController = new EnhancedVideoController("myVideo", "kinect-canvas");
});