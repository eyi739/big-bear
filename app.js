const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/bigBear');

// mongoose.connect('mongodb://localhost:27017/bigBear');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/products', async(req, res) => {
    const products = await Product.find({});
    res.render ('products/index', { products });
})

app.get('/products/new', (req, res) => {
    res.render('products/new');
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})

app.get('/makeproduct', async (req, res) => {
    const product = new Product ({name: 'Tomato', price: '1', category: 'vegetable'});
    await product.save();
    res.send(product);
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})