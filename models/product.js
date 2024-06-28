const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    image: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    description: String,
});

module.exports = mongoose.model('Product', ProductSchema);