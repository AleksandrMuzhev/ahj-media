class CoordinatesValidator {
    static validate(input) {
        if (!input || typeof input !== 'string') {
            throw new Error('Введите координаты');
        }

        let cleaned = input.trim();
        cleaned = cleaned.replace(/^\[|\]$/g, '').trim();

        const parts = cleaned.split(',').map(s => s.trim());

        if (parts.length !== 2) {
            throw new Error('Неверный формат. Используйте: широта, долгота');
        }

        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);

        if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Координаты должны быть числами');
        }

        if (lat < -90 || lat > 90) {
            throw new Error('Широта должна быть от -90 до 90');
        }

        if (lon < -180 || lon > 180) {
            throw new Error('Долгота должна быть от -180 до 180');
        }

        return { latitude: lat, longitude: lon };
    }
}

module.exports = CoordinatesValidator;