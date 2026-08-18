const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    },
    image:{
        // required: true,
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema)

