class Post {
    constructor(text, coordinates, type = 'text') {
        this.id = Date.now();
        this.text = text;
        this.coordinates = coordinates;
        this.type = type;
        this.timestamp = new Date().toISOString();
    }
}

module.exports = Post;