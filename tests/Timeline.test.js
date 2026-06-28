const Timeline = require('../src/js/Timeline');

describe('Timeline', () => {
    let timeline;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        timeline = new Timeline(container);
    });

    test('should add text post', () => {
        const post = timeline.addPost('Hello', { latitude: 10, longitude: 20 });
        expect(post.text).toBe('Hello');
        expect(post.coordinates).toEqual({ latitude: 10, longitude: 20 });
        expect(post.type).toBe('text');
    });

    test('should render posts in reverse order', () => {
        timeline.addPost('First', { latitude: 1, longitude: 1 });
        timeline.addPost('Second', { latitude: 2, longitude: 2 });

        const posts = timeline.getPosts();
        expect(posts.length).toBe(2);
        expect(posts[0].text).toBe('First');
        expect(posts[1].text).toBe('Second');
    });
});