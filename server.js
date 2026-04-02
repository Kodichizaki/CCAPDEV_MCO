const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clothing = require('./models/Clothing'); 
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Cart = require('./models/Cart');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Uploading Images
app.post('/admin/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    // Return the path that can be used in the database
    const imagePath = `/images/uploads/${req.file.filename}`;
    res.json({ imagePath });
});

// Set up Handlebars and the Public folder
app.set('view engine', 'hbs'); 
app.use(express.static('public')); 

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hiramph_db')
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ Database error:', err));

// --- ALL WEBSITE ROUTES ---

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Marketplace
app.get('/marketplace', async (req, res) => {
    try {
        const selectedCategory = req.query.category;
        let filter = {};
        if (selectedCategory && selectedCategory !== 'all') {
            filter.category = { $in: [selectedCategory] };
        }

        const filteredClothes = await Clothing.find(filter);

        // If request wants JSON (from admin panel), return JSON
        if (req.query.json === 'true') {
            return res.json(filteredClothes);
        }

        res.render('marketplace', { products: filteredClothes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

//Carts
app.get('/cart/data', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'Not logged in' });

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ items: [] });

        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/cart/add', async (req, res) => {
    try {
        const { userId, item } = req.body;
        if (!userId) return res.status(400).json({ message: 'Not logged in' });

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if user doesn't have one
            cart = new Cart({ userId, items: [item] });
        } else {
            // Check if item already exists in cart
            const existing = cart.items.find(i => i.clothingId === item.clothingId);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.items.push(item);
            }
        }

        await cart.save();
        res.json({ message: 'Item added to cart!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/cart/remove', async (req, res) => {
    try {
        const { userId, clothingId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.clothingId !== clothingId);
        await cart.save();

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Contact Page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Login Page
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup Page
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'Account created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cart Page
app.get('/cart', (req, res) => {
    res.render('cart');
});

// dynamic route for a single product
app.get('/product/:id', async (req, res) => {
    try {
        
        const productId = parseInt(req.params.id);
        const product = await Clothing.findOne({ id: productId });

        if (product) {
            res.render('product', { item: product });
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 HiramPH Server running on http://localhost:${PORT}`);
});

// Admin Routes

app.get('/admin', async (req, res) => {
    res.render('admin');
});

// Add Clothes
app.post('/admin/add-item', async (req, res) => {
    try {
        const { name, category, price, priceVal, size, image, description } = req.body;

        // Get the highest existing id and increment it
        const lastItem = await Clothing.findOne().sort({ id: -1 });
        const newId = lastItem ? lastItem.id + 1 : 1;

        const newItem = new Clothing({
            id: newId,
            name,
            category,
            price,
            priceVal: parseFloat(priceVal),
            size,
            image,
            description
        });

        await newItem.save();
        res.json({ message: 'Item added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove Clothes
app.delete('/admin/delete-item/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await Clothing.findOneAndDelete({ id });
        res.json({ message: 'Item deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});