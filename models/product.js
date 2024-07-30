const mongoose = require('mongoose');
const Review = require('./review')
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
        enum: ['fruit', 'vegetable', 'dairy', 'meat', 'poultry']
    },
    description: String,
    reviews: [
        {   
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

ProductSchema.post('findOneAndDelete', async function(doc){
    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
})

module.exports = mongoose.model('Product', ProductSchema);