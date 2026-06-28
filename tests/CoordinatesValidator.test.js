const CoordinatesValidator = require('../src/js/CoordinatesValidator');

describe('CoordinatesValidator', () => {
    test('should validate format with space: "51.50851, -0.12572"', () => {
        const result = CoordinatesValidator.validate('51.50851, -0.12572');
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('should validate format without space: "51.50851,-0.12572"', () => {
        const result = CoordinatesValidator.validate('51.50851,-0.12572');
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('should validate format with brackets: "[51.50851, -0.12572]"', () => {
        const result = CoordinatesValidator.validate('[51.50851, -0.12572]');
        expect(result).toEqual({
            latitude: 51.50851,
            longitude: -0.12572
        });
    });

    test('should throw error for empty string', () => {
        expect(() => CoordinatesValidator.validate('')).toThrow('Введите координаты');
    });

    test('should throw error for invalid format', () => {
        expect(() => CoordinatesValidator.validate('51.50851')).toThrow('Неверный формат');
    });

    test('should throw error for non-numeric values', () => {
        expect(() => CoordinatesValidator.validate('abc, def')).toThrow('Координаты должны быть числами');
    });

    test('should throw error for latitude out of range', () => {
        expect(() => CoordinatesValidator.validate('100, 0')).toThrow('Широта должна быть от -90 до 90');
    });

    test('should throw error for longitude out of range', () => {
        expect(() => CoordinatesValidator.validate('0, 200')).toThrow('Долгота должна быть от -180 до 180');
    });
});