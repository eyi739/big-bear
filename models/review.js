const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = ({
    name: String,
    rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);