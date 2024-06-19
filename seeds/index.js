const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('../models/product');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/bigBear');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Product.deleteMany({})
    const p = new Product({name: 'Celery', price: 30.00});
    await p.save();
}

seedDB().then(() => {
    mongoose.connection.close()
})