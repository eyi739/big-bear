const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketSchema = new Schema ({
    title: String,
    price: String,
    description: String,
})