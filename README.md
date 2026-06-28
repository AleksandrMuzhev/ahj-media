## README.md для задачи 1 (Timeline — Текстовые записи с координатами)

[![Build and Deploy](https://github.com/AleksandrMuzhev/ahj-media/actions/workflows/web.yml/badge.svg)](https://github.com/AleksandrMuzhev/ahj-media/actions/workflows/web.yml)

# Timeline — Текстовые записи с координатами

Виджет для создания текстовых постов с привязкой к геолокации.

## Функциональность

- Создание текстовых постов по нажатию Enter
- Автоматическое определение геолокации через Geolocation API
- Ручной ввод координат, если геолокация недоступна
- Валидация координат (широта: -90…90, долгота: -180…180)
- Отображение постов в хронологическом порядке (свежие сверху)
- Отображение координат для каждого поста

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

## Технологии

- JavaScript (ES6+)
- Webpack
- Geolocation API
- Jest (тестирование)
- HTML5/CSS3
- GitHub Actions (CI/CD)

## Структура проекта

```
src/
├── css/
│   └── style.css
├── js/
│   ├── app.js          # Основной класс приложения
│   ├── CoordinatesValidator.js  # Валидация координат
│   ├── Post.js         # Модель поста
│   └── Timeline.js     # Управление лентой постов
├── index.html
└── index.js

tests/
└── CoordinatesValidator.test.js  # Юнит-тесты

.github/workflows/
└── web.yml             # CI/CD
```

## Тесты

```bash
npm test
```

Покрытие тестами:
- Валидация формата с пробелом
- Валидация формата без пробела
- Валидация формата с квадратными скобками
- Обработка некорректных данных

## Ссылки

- [GitHub Pages](https://AleksandrMuzhev.github.io/ahj-media/)