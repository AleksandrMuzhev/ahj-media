const Post = require('./Post');

class Timeline {
    constructor(container) {
        this.container = container;
        this.posts = [];
        this.render();
    }

    addPost(text, coordinates) {
        const post = new Post(text, coordinates);
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

        // Отображаем сверху вниз (самая свежая сверху)
        const sortedPosts = [...this.posts].reverse();

        sortedPosts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post';

            const textEl = document.createElement('div');
            textEl.className = 'post-text';
            textEl.textContent = post.text;

            const coordsEl = document.createElement('div');
            coordsEl.className = 'post-coordinates';
            coordsEl.textContent = `${post.coordinates.latitude.toFixed(5)}, ${post.coordinates.longitude.toFixed(5)}`;

            postEl.appendChild(textEl);
            postEl.appendChild(coordsEl);
            this.container.appendChild(postEl);
        });
    }

    getPosts() {
        return [...this.posts];
    }
}

module.exports = Timeline;