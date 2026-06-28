const Post = require('./Post');

class Timeline {
    constructor(container) {
        this.container = container;
        this.posts = [];
        this.render();
    }

    addPost(text, coordinates, type = 'text', mediaData = null) {
        const post = new Post(text, coordinates, type, mediaData);
        this.posts.push(post);
        this.render();
        return post;
    }

    render() {
        if (this.posts.length === 0) {
            this.container.innerHTML = '<div class="empty-message">Нет записей. Создайте первую!</div>';
            return;
        }

        this.container.innerHTML = '';

        const sortedPosts = [...this.posts].reverse();

        sortedPosts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post';

            // Тип поста
            const typeBadge = document.createElement('div');
            typeBadge.className = `post-type-badge ${post.type}`;
            const typeLabels = {
                text: '📝 Текст',
                audio: '🎵 Аудио',
                video: '🎬 Видео'
            };
            typeBadge.textContent = typeLabels[post.type] || '📝 Текст';
            postEl.appendChild(typeBadge);

            // Текст
            if (post.text) {
                const textEl = document.createElement('div');
                textEl.className = 'post-text';
                textEl.textContent = post.text;
                postEl.appendChild(textEl);
            }

            // Медиа
            if (post.type === 'audio' && post.mediaData) {
                const audioContainer = document.createElement('div');
                audioContainer.className = 'post-audio';

                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = post.mediaData;
                audioContainer.appendChild(audio);
                postEl.appendChild(audioContainer);
            }

            if (post.type === 'video' && post.mediaData) {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'post-video';

                const video = document.createElement('video');
                video.controls = true;
                video.src = post.mediaData;
                videoContainer.appendChild(video);
                postEl.appendChild(videoContainer);
            }

            // Координаты
            const coordsEl = document.createElement('div');
            coordsEl.className = 'post-coordinates';
            coordsEl.textContent = `${post.coordinates.latitude.toFixed(5)}, ${post.coordinates.longitude.toFixed(5)}`;
            postEl.appendChild(coordsEl);

            this.container.appendChild(postEl);
        });
    }

    getPosts() {
        return [...this.posts];
    }
}

module.exports = Timeline;