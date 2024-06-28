const mongoose = require('mongoose');
const Product = require('../models/product');
const products = require('./products');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/bigBear');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Product.deleteMany({})
    for(let i = 0; i < 50; i++) {
   const random5 = Math.floor(Math.random() * 5);
   const price = Math.floor(Math.random() * 5) 
   const p = new Product({
    name: `${products[random5].name}`,
    image: `https://picsum.photos/400?random=${Math.random()}`,
    price,
    category: 'fruit',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur aspernatur ex ratione praesentium quasi quas, maiores, quam tempora dolores consequuntur tenetur alias inventore eaque sed atque! Nobis necessitatibus quidem in?' 
   })
    await p.save();
}}

seedDB().then(() => {
    mongoose.connection.close();
})