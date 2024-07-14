const express = require("express");
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync'); 

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

app.engine('ejs', ejsMate );
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable',  'dairy'];

const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if(password === 'chickennugget') {
        next();
    }
    res.send('SORRY YOU NEED A PASSWORD');
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/products', catchAsync(async(req, res) => {
    const { category } = req.query;
    if(category) {
        const products = await Product.find({category})
        res.render ('products/index', { products, category})
    } else {
        const products = await Product.find({})
        res.render ('products/index', { products, category: 'All' })
    }
    const products = await Product.find({}); 
}))

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories});
})

app.post('/products', catchAsync(async(req, res, next) => {
    const product = new Product(req.body.product)
    await product.save();
    res.redirect(`/products/${product._id}`); 
}))

app.get('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
}))

app.get('/products/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render ('products/edit', { product, categories });
}))

app.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, ...req.body.product, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`)
})

app.get('/makeproduct', async (req, res) => {
    const product = new Product ({name: 'Tomato', price: '1', category: 'vegetable'});
    await product.save();
    res.send(product);
})

app.delete('/products/:id', async(req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: Sometimes I like apples')
})

app.use((err, req, res, next) => {
    res.send('OH BOYYYY, SOMETHING WENT WRONG!');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})