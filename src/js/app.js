const Timeline = require('./Timeline');
const CoordinatesValidator = require('./CoordinatesValidator');

class App {
    constructor() {
        this.timeline = null;
        this.input = null;
        this.modal = null;
        this.coordsInput = null;
        this.coordsError = null;
        this.pendingText = null;
        this.pendingMedia = null;
        this.pendingType = null;

        // Аудио запись
        this.mediaRecorder = null;
        this.mediaChunks = [];
        this.isRecording = false;
        this.recordingTimer = null;
        this.recordingSeconds = 0;
        this.stream = null;
        this.recordType = null;
        this.shouldSave = false;

        // Видео
        this.videoPreview = null;
        this.videoContainer = null;

        this.init();
    }

    init() {
        const timelineContainer = document.getElementById('timeline');
        this.timeline = new Timeline(timelineContainer);

        this.input = document.getElementById('post-input');
        this.modal = document.getElementById('coordinates-modal');
        this.coordsInput = document.getElementById('coordinates-input');
        this.coordsError = document.getElementById('coordinates-error');

        this.bindEvents();
        this.createVideoPreview();
    }

    createVideoPreview() {
        const oldContainer = document.querySelector('.video-preview-container');
        if (oldContainer) oldContainer.remove();

        this.videoContainer = document.createElement('div');
        this.videoContainer.className = 'video-preview-container';
        this.videoContainer.style.display = 'none';

        this.videoPreview = document.createElement('video');
        this.videoPreview.muted = true;
        this.videoPreview.autoplay = true;
        this.videoPreview.style.width = '100%';
        this.videoPreview.style.borderRadius = '12px';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'video-preview-close';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
            this.stopRecording(false);
        });

        this.videoContainer.appendChild(this.videoPreview);
        this.videoContainer.appendChild(closeBtn);
        document.body.appendChild(this.videoContainer);
    }

    bindEvents() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTextPost();
            }
        });

        document.getElementById('audio-btn').addEventListener('click', () => {
            this.startRecording('audio');
        });

        document.getElementById('video-btn').addEventListener('click', () => {
            this.startRecording('video');
        });

        document.getElementById('recording-ok').addEventListener('click', () => {
            this.shouldSave = true;
            this.stopRecording(true);
        });

        document.getElementById('recording-cancel').addEventListener('click', () => {
            this.shouldSave = false;
            this.stopRecording(false);
        });

        document.getElementById('coordinates-confirm').addEventListener('click', () => {
            this.handleManualCoordinates();
        });

        document.getElementById('coordinates-cancel').addEventListener('click', () => {
            this.closeModal();
            this.clearPending();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
                this.clearPending();
            }
        });

        this.coordsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleManualCoordinates();
            }
        });
    }

    clearPending() {
        this.pendingText = null;
        this.pendingMedia = null;
        this.pendingType = null;
        this.shouldSave = false;
    }

    handleTextPost() {
        const text = this.input.value.trim();
        if (!text) return;

        this.input.value = '';
        this.pendingText = text;
        this.pendingType = 'text';
        this.pendingMedia = null;
        this.getLocationAndCreatePost();
    }

    async startRecording(type) {
        this.recordType = type;
        this.shouldSave = false;
        const constraints = type === 'audio'
            ? { audio: true }
            : { audio: true, video: true };

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Показываем превью для видео
            if (type === 'video' && this.videoContainer && this.videoPreview) {
                this.videoPreview.srcObject = this.stream;
                this.videoContainer.style.display = 'block';
            }

            const mimeType = type === 'audio' ? 'audio/webm' : 'video/webm';
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: mimeType
            });

            this.mediaChunks = [];
            this.isRecording = true;
            this.recordingSeconds = 0;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.mediaChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                // Скрываем превью видео
                if (this.videoContainer) {
                    this.videoContainer.style.display = 'none';
                    if (this.videoPreview) {
                        this.videoPreview.srcObject = null;
                    }
                }

                // Если запись не сохранена — ничего не делаем
                if (!this.shouldSave) {
                    this.clearPending();
                    return;
                }

                const blobType = type === 'audio' ? 'audio/webm' : 'video/webm';
                const mediaBlob = new Blob(this.mediaChunks, { type: blobType });
                const mediaUrl = URL.createObjectURL(mediaBlob);
                this.pendingMedia = mediaUrl;
                this.pendingType = type;
                this.pendingText = '';
                this.getLocationAndCreatePost();
            };

            this.mediaRecorder.start();
            this.showRecordingUI();
            this.startTimer();

        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }

    stopRecording(save) {
        if (this.mediaRecorder && this.isRecording) {
            this.isRecording = false;
            this.shouldSave = save;
            this.mediaRecorder.stop();
            this.stopTimer();
            this.hideRecordingUI();

            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }

            if (!save) {
                this.clearPending();
            }
        }
    }

    showRecordingUI() {
        const actions = document.getElementById('input-actions');
        const controls = document.getElementById('recording-controls');

        if (actions) actions.style.display = 'none';
        if (controls) {
            controls.style.display = 'flex';
            controls.style.zIndex = '1002';
        }
    }

    hideRecordingUI() {
        const actions = document.getElementById('input-actions');
        const controls = document.getElementById('recording-controls');

        if (actions) actions.style.display = 'flex';
        if (controls) controls.style.display = 'none';
    }

    startTimer() {
        this.recordingSeconds = 0;
        this.updateTimerDisplay();
        this.recordingTimer = setInterval(() => {
            this.recordingSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    updateTimerDisplay() {
        const timer = document.getElementById('recording-timer');
        if (!timer) return;

        const minutes = String(Math.floor(this.recordingSeconds / 60)).padStart(2, '0');
        const seconds = String(this.recordingSeconds % 60).padStart(2, '0');
        timer.textContent = `${minutes}:${seconds}`;
    }

    // === ГЕОЛОКАЦИЯ ===
    getLocationAndCreatePost() {
        this.getLocation()
            .then((coords) => {
                this.createPost(coords);
            })
            .catch(() => {
                this.openModal();
            });
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    createPost(coords) {
        this.timeline.addPost(
            this.pendingText || '',
            coords,
            this.pendingType || 'text',
            this.pendingMedia || null
        );
        this.clearPending();
        this.closeModal();
    }

    // === МОДАЛЬНОЕ ОКНО ===
    openModal() {
        this.modal.classList.add('active');
        this.coordsInput.value = '';
        this.coordsError.textContent = '';
        setTimeout(() => this.coordsInput.focus(), 100);
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.coordsInput.value = '';
        this.coordsError.textContent = '';
    }

    handleManualCoordinates() {
        const input = this.coordsInput.value.trim();

        try {
            const coords = CoordinatesValidator.validate(input);
            this.closeModal();
            this.createPost(coords);
        } catch (error) {
            this.coordsError.textContent = error.message;
        }
    }
}

module.exports = App;