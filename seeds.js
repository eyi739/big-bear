const mongoose= require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/bigBear');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const p = new Product({
    name: 'Ruby Grapefruit',
    price: 1.99,
    category: 'fruit'
})
p.save().then(p => {
    console.log(p)
})
.catch(e => {
    console.log(e)
})