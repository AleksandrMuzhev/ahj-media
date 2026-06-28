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
    }

    bindEvents() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTextPost();
            }
        });

        document.getElementById('coordinates-confirm').addEventListener('click', () => {
            this.handleManualCoordinates();
        });

        document.getElementById('coordinates-cancel').addEventListener('click', () => {
            this.closeModal();
            this.pendingText = null;
        });

        // Закрытие по клику вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
                this.pendingText = null;
            }
        });

        // Enter в поле ввода координат
        this.coordsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleManualCoordinates();
            }
        });
    }

    handleTextPost() {
        const text = this.input.value.trim();
        if (!text) return;

        this.input.value = '';

        // Запрашиваем геолокацию
        this.getLocation()
            .then((coords) => {
                this.timeline.addPost(text, coords);
            })
            .catch(() => {
                // Если геолокация недоступна — показываем модальное окно
                this.pendingText = text;
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
        this.pendingText = null;
    }

    handleManualCoordinates() {
        const input = this.coordsInput.value.trim();

        try {
            const coords = CoordinatesValidator.validate(input);
            this.closeModal();
            if (this.pendingText) {
                this.timeline.addPost(this.pendingText, coords);
                this.pendingText = null;
            }
        } catch (error) {
            this.coordsError.textContent = error.message;
        }
    }
}

module.exports = App;