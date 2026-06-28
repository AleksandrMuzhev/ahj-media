[![Build and Deploy](https://github.com/AleksandrMuzhev/ahj-media/actions/workflows/web.yml/badge.svg)](https://github.com/AleksandrMuzhev/ahj-media/actions/workflows/web.yml)

# Timeline — Лента постов с геолокацией, аудио и видео

Виджет для создания постов с текстом, аудио и видео с привязкой к геолокации.

## Функциональность

### Текстовые посты
- Создание текстовых постов по нажатию Enter
- Автоматическое определение геолокации через Geolocation API
- Ручной ввод координат, если геолокация недоступна
- Валидация координат (широта: -90…90, долгота: -180…180)

### Аудио-записи
- Запись аудио через микрофон (кнопка 🎤)
- Таймер записи
- Прослушивание аудио в ленте

### Видео-записи
- Запись видео через камеру (кнопка 📹)
- Превью видео во время записи
- Просмотр видео в ленте

### Общее
- Отображение постов в хронологическом порядке (свежие сверху)
- Отображение координат для каждого поста
- Типы постов: текст, аудио, видео

## Форматы ввода координат

Поддерживаются форматы:

- `51.50851, -0.12572` (с пробелом)
- `51.50851,-0.12572` (без пробела)
- `[51.50851, -0.12572]` (в квадратных скобках)

## Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/AleksandrMuzhev/ahj-media.git
cd ahj-media

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка production версии
npm run build

# Запуск тестов
npm test
```

## Требования

- Разрешения в браузере на доступ к микрофону и камере

## Технологии

- JavaScript (CommonJS)
- Webpack
- Geolocation API
- MediaDevices API (getUserMedia)
- Jest (тестирование)
- HTML5/CSS3
- GitHub Actions (CI/CD)

## Структура проекта

```
src/
├── css/
│   └── style.css          # Стили
├── js/
│   ├── app.js             # Основной класс приложения
│   ├── CoordinatesValidator.js  # Валидация координат
│   ├── Post.js            # Модель поста
│   └── Timeline.js        # Управление лентой постов
├── index.html
└── index.js

tests/
├── CoordinatesValidator.test.js  # Тесты валидации
└── Timeline.test.js              # Тесты ленты

.github/workflows/
└── web.yml               # CI/CD
```

## Тесты

```bash
npm test
```

Покрытие тестами:
- Валидация координат (8 тестов)
- Создание и отображение постов

## Ссылки

- [GitHub Pages](https://AleksandrMuzhev.github.io/ahj-media/)