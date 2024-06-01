const mongoose= require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/bigBear');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// })
// p.save().then(p => {
//     console.log(p)
// })
// .catch(e => {
//     console.log(e)
// })

const seedProducts = [{
    name: 'Chicken Stalks',
    price: 1.00,
    category: 'vegetable'
},
{
    name: 'Gingivi Peas',
    price: 6.29,
    category: 'vegetable'
},
{
    name: 'Curious Apples',
    price: 2.99,
    category: 'fruit'
}]

Product.insertMany(seedProducts)
.then(res => {
    console.log(res)
    })
    .catch(e => {
        console.log(e)
    })