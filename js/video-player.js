// Enhanced Video Player for Video Editor Portfolio

class EnhancedVideoPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: false,
            muted: true,
            loop: false,
            showControls: true,
            hoverPreview: true,
            ...options
        };

        this.video = null;
        this.controls = null;
        this.progressBar = null;
        this.volumeSlider = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.currentVolume = 1;

        this.init();
    }

    init() {
        this.createVideoElement();
        this.createCustomControls();
        this.setupEventListeners();
        this.setupHoverPreview();
        this.setupKeyboardControls();
    }

    createVideoElement() {
        this.video = document.createElement('video');
        this.video.className = 'enhanced-video-player';
        this.video.preload = 'metadata';
        this.video.muted = this.options.muted;
        this.video.loop = this.options.loop;

        // Copy source elements from original video
        const originalVideo = this.container.querySelector('video');
        if (originalVideo) {
            Array.from(originalVideo.children).forEach(child => {
                this.video.appendChild(child.cloneNode(true));
            });
            this.video.poster = originalVideo.poster;
        }

        // Replace original video
        if (originalVideo) {
            originalVideo.parentNode.replaceChild(this.video, originalVideo);
        } else {
            this.container.appendChild(this.video);
        }
    }

    createCustomControls() {
        this.controls = document.createElement('div');
        this.controls.className = 'video-controls';

        // Play/Pause Button
        this.playButton = document.createElement('button');
        this.playButton.className = 'control-btn play-btn';
        this.playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

        // Progress Bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.progressBar.innerHTML = '<div class="progress-fill"></div>';

        // Time Display
        this.timeDisplay = document.createElement('div');
        this.timeDisplay.className = 'time-display';
        this.timeDisplay.innerHTML = '<span class="current-time">0:00</span> / <span class="total-time">0:00</span>';

        // Volume Control
        this.volumeContainer = document.createElement('div');
        this.volumeContainer.className = 'volume-container';

        this.volumeButton = document.createElement('button');
        this.volumeButton.className = 'control-btn volume-btn';
        this.volumeButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';

        this.volumeSlider = document.createElement('input');
        this.volumeSlider.type = 'range';
        this.volumeSlider.min = '0';
        this.volumeSlider.max = '1';
        this.volumeSlider.step = '0.1';
        this.volumeSlider.value = '1';
        this.volumeSlider.className = 'volume-slider';

        // Fullscreen Button
        this.fullscreenButton = document.createElement('button');
        this.fullscreenButton.className = 'control-btn fullscreen-btn';
        this.fullscreenButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';

        // Assemble Controls
        this.volumeContainer.appendChild(this.volumeButton);
        this.volumeContainer.appendChild(this.volumeSlider);

        this.controls.appendChild(this.playButton);
        this.controls.appendChild(this.progressBar);
        this.controls.appendChild(this.timeDisplay);
        this.controls.appendChild(this.volumeContainer);
        this.controls.appendChild(this.fullscreenButton);

        this.container.appendChild(this.controls);

        // Add CSS classes
        this.container.classList.add('enhanced-video-container');
    }

    setupEventListeners() {
        // Play/Pause
        this.playButton.addEventListener('click', () => this.togglePlay());

        // Progress Bar
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));

        // Volume
        this.volumeButton.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Fullscreen
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());

        // Video Events
        this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('ended', () => this.handleVideoEnd());
        this.video.addEventListener('play', () => this.updatePlayButton());
        this.video.addEventListener('pause', () => this.updatePlayButton());

        // Mouse Events for Controls Visibility
        this.container.addEventListener('mouseenter', () => this.showControls());
        this.container.addEventListener('mouseleave', () => this.hideControls());
    }

    setupHoverPreview() {
        if (!this.options.hoverPreview) return;

        this.container.addEventListener('mouseenter', () => {
            if (!this.isPlaying) {
                this.video.currentTime = 0;
                this.video.play().catch(() => {}); // Ignore autoplay errors
            }
        });

        this.container.addEventListener('mouseleave', () => {
            if (!this.isPlaying) {
                this.video.pause();
                this.video.currentTime = 0;
            }
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.container.contains(document.activeElement) || this.video === document.activeElement) {
                switch (e.key) {
                    case ' ':
                        e.preventDefault();
                        this.togglePlay();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.seekRelative(-10);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.seekRelative(10);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.setVolume(Math.min(1, this.currentVolume + 0.1));
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.setVolume(Math.max(0, this.currentVolume - 0.1));
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.toggleMute();
                        break;
                }
            }
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.video.pause();
        } else {
            this.video.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    seekTo(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.video.currentTime = percentage * this.video.duration;
    }

    seekRelative(seconds) {
        this.video.currentTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + seconds));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.video.muted = this.isMuted;
        this.updateVolumeButton();
    }

    setVolume(value) {
        this.currentVolume = parseFloat(value);
        this.video.volume = this.currentVolume;
        this.volumeSlider.value = this.currentVolume;
        this.updateVolumeButton();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    updateProgress() {
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.querySelector('.progress-fill').style.width = `${progress}%`;
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        const current = this.formatTime(this.video.currentTime);
        const total = this.formatTime(this.video.duration);
        this.timeDisplay.querySelector('.current-time').textContent = current;
        this.timeDisplay.querySelector('.total-time').textContent = total;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updatePlayButton() {
        this.isPlaying = !this.video.paused;
        this.playButton.innerHTML = this.isPlaying ?
            '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' :
            '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }

    updateVolumeButton() {
        if (this.isMuted || this.currentVolume === 0) {
            this.volumeButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
        } else if (this.currentVolume < 0.5) {
            this.volumeButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>';
        } else {
            this.volumeButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
        }
    }

    showControls() {
        this.controls.style.opacity = '1';
        this.controls.style.transform = 'translateY(0)';
    }

    hideControls() {
        this.controls.style.opacity = '0';
        this.controls.style.transform = 'translateY(10px)';
    }

    handleVideoEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
        if (this.options.loop) {
            this.video.currentTime = 0;
            this.video.play();
        }
    }

    destroy() {
        if (this.video) {
            this.video.pause();
            this.video.remove();
        }
        if (this.controls) {
            this.controls.remove();
        }
    }
}

// Lightbox functionality
function openVideoLightbox(videoSrc) {
    const lightbox = document.getElementById('video-lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    lightboxVideo.querySelector('source').src = videoSrc;
    lightboxVideo.load();
    lightbox.classList.add('active');
    lightboxVideo.play();
}

function closeVideoLightbox() {
    const lightbox = document.getElementById('video-lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightboxVideo.querySelector('source').src = '';
    lightbox.classList.remove('active');
}

// Initialize enhanced video players and lightbox events
document.addEventListener('DOMContentLoaded', () => {
    const videoContainers = document.querySelectorAll('.video-thumbnail');
    videoContainers.forEach(container => {
        new EnhancedVideoPlayer(container, {
            hoverPreview: true,
            showControls: true
        });
    });

    // Add click events to play overlays
    const playOverlays = document.querySelectorAll('.play-overlay');
    playOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoSrc = overlay.parentNode.querySelector('video source').src;
            openVideoLightbox(videoSrc);
        });
    });

    // Add click events to thumbnail videos
    const thumbnailVideos = document.querySelectorAll('.video-thumbnail video');
    thumbnailVideos.forEach(video => {
        video.addEventListener('click', () => {
            const videoSrc = video.querySelector('source').src;
            openVideoLightbox(videoSrc);
        });
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedVideoPlayer;
}