const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash');

const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const { productSchema, reviewSchema  } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync'); 
const ExpressError = require('./utils/expressError');

const Product = require('./models/product');
const Review = require ('./models/review');

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
app.use(cookieParser());
app.use(session({
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

const categories = ['fruit', 'vegetable',  'dairy'];

const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if(password === 'chickennugget') {
        next();
    }
    res.send('SORRY YOU NEED A PASSWORD');
}

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



// app.get('/setname', (req, res) => {
//     res.cookie('name', 'Davie Jones');
//     res.cookie('animal', 'Blue-ring Octopus')
//     res.send('OK YOU SENT A COOKIE')
// })

// app.get('/getsignedcookie', (req , res) => {
//     res.cookie('fruit', 'grape', {signed: true});
//     res.send('you signed your first cookie !!!');
// })

// app.get('/verifyfruit', (req, res) => {
//     console.log(req.cookies)
//     console.log(req.signedCookies)
//     res.send(req.signedCookies)
// })

// app.get('/viewcount', (req, res) => {
//     if(req.session.count){
//         req.session.count +=1
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You have viewed this page ${req.session.count} times`);
// })

// app.get('/register', (req, res) => {
//     const { username = 'Anonymous' } = req.query;
//     req.session.username = username;
//     res.redirect('/greet');
// })

// app.get('/greet' , (req, res) => {
//     const { username } = req.session;
//     res.send(`Welcome Back, ${username}`);
// })

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

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

app.post('/products', validateProduct, catchAsync(async(req, res, next) => {
    // if(!req.body.product) throw new ExpressError('Invalid Product Data', 400 );
    const product = new Product(req.body.product);
    await product.save();
    req.flash('success', 'You have successfully created a new product!');
    res.redirect(`/products/${product._id}`); 
}))

app.get('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews');
    res.render('products/show', { product });
}))

app.get('/products/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render ('products/edit', { product, categories });
}))

app.put('/products/:id', validateProduct, async(req, res) => {
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

app.post('/products/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/products/${product._id}`)
    res.send('YOU MADE IT');
}))

app.delete('/products/:id/reviews/:reviewId', catchAsync(async(req,res) => {
    const { id, reviewId } = req.params;
    Product.findByIdAndUpdate(id, {$pull:{reviews: reviewId} })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/products/${id}`)
}))

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: Sometimes I like apples.')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
    
})

app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no something went wrong'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})