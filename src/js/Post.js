class Post {
    constructor(text, coordinates, type = 'text', mediaData = null) {
        this.id = Date.now();
        this.text = text;
        this.coordinates = coordinates;
        this.type = type;
        this.mediaData = mediaData;
        this.timestamp = new Date().toISOString();
    }
}

module.exports = Post;