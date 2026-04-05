const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Models
const Clothing = require('./models/Clothing'); 
const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order'); // <--- NEW ORDER MODEL

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

// Set up Handlebars and the Public folder
app.set('view engine', 'hbs'); 
app.use(express.static('public')); 


// Connect to MongoDB
mongoose.connect('mongodb://RedHotChiliPepper:Chili123@ac-fzeyh40-shard-00-00.kytsp3h.mongodb.net:27017,ac-fzeyh40-shard-00-01.kytsp3h.mongodb.net:27017,ac-fzeyh40-shard-00-02.kytsp3h.mongodb.net:27017/?ssl=true&replicaSet=atlas-eynmo9-shard-0&authSource=admin&appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ Database error:', err));

// ==========================================
// FETCH BOOKED DATES FOR CALENDAR
// ==========================================
app.get('/api/item/:id/booked-dates', async (req, res) => {
    try {
        const clothingId = parseInt(req.params.id);
        
        // Find all orders that contain this item
        const orders = await Order.find({ "items.clothingId": clothingId });
        
        let bookedRanges = [];
        
        // Loop through the orders and format the dates for Flatpickr
        for (let order of orders) {
            if (order.status === 'Returned') continue; // Ignore returned items
            
            for (let item of order.items) {
                if (item.clothingId === clothingId) {
                    bookedRanges.push({
                        from: item.startDate,
                        to: item.endDate
                    });
                }
            }
        }
        res.json(bookedRanges);
    } catch (err) {
        console.error("Error fetching booked dates:", err);
        res.status(500).json({ message: 'Server error fetching booked dates' });
    }
});

  // --- ALL WEBSITE ROUTES ---

app.post('/admin/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imagePath = `/images/uploads/${req.file.filename}`;
    res.json({ imagePath });
});

app.get('/', (req, res) => res.render('index'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/admin', (req, res) => res.render('admin'));

// NEW: Order Page Route
app.get('/orders', (req, res) => {
    res.render('orders');
});

// NEW: API to fetch a user's orders
app.get('/api/orders', async (req, res) => {
    try {
        const userId = req.query.userId;
        // Find orders and sort by newest first (-1)
        const orders = await Order.find({ userId }).sort({ orderDate: -1 }); 
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// ==========================================
// USER SETTINGS ROUTES
// ==========================================
// 1. Render the settings page
app.get('/settings', (req, res) => {
    res.render('settings');
});

// 2. Handle the profile update request
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update basic info
        user.name = name || user.name;
        user.email = email || user.email;

        // If they typed a new password, encrypt it before saving!
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        
        // Send back the updated user data so the frontend can update localStorage
        res.json({ 
            message: "Profile updated successfully!", 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
        
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ message: "Server error while updating profile" });
    }
});

// ==========================================
// UPGRADED MARKETPLACE ROUTE (Filters & Sorting)
// ==========================================
app.get('/marketplace', async (req, res) => {
    try {
        // Grab the user's choices from the URL
        const { category, sort, search } = req.query;
        let filter = {};

        // 1. Filter by Category
        if (category && category !== 'all') {
            filter.category = { $in: [category] };
        }

        // 2. Search Bar (Looks for matching words in the item's name)
        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // 'i' makes it case-insensitive
        }

        // 3. Sorting Logic
        let sortOption = {};
        // Note: We sort by 'priceVal' (the raw number) instead of 'price' (the string with the ₱ symbol)
        if (sort === 'price-asc') sortOption.priceVal = 1;   // Lowest price first
        if (sort === 'price-desc') sortOption.priceVal = -1; // Highest price first
        if (sort === 'name-asc') sortOption.name = 1;        // A to Z
        if (sort === 'name-desc') sortOption.name = -1;      // Z to A

        // 4. Fetch the final list from the database!
        const filteredClothes = await Clothing.find(filter).sort(sortOption);

        if (req.query.json === 'true') {
            return res.json(filteredClothes);
        }

        // Send the filtered clothes to the frontend
        res.render('marketplace', { products: filteredClothes });
    } catch (err) {
        console.error("Marketplace Error:", err);
        res.status(500).send("Server Error");
    }
});

app.get('/cart/data', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ message: 'Not logged in' });

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ items: [] });

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==========================================
// ADD TO CART (WITH DATE CONFLICT PREVENTION)
// ==========================================
app.post('/cart/add', async (req, res) => {
    try {
        const { userId, item } = req.body;

        // --- NEW: DATE CONFLICT CHECK ---
        // 1. Find all orders that contain this specific clothing item
        const existingOrders = await Order.find({ "items.clothingId": item.clothingId });

        // 2. Convert the requested dates into JavaScript Date objects for math comparison
        const reqStart = new Date(item.startDate);
        const reqEnd = new Date(item.endDate);

        let isConflict = false;

        // 3. Loop through orders to check for overlapping dates
        for (let order of existingOrders) {
            // Ignore "Returned" orders because those clothes are safely back in your shop!
            if (order.status === 'Returned') continue; 

            for (let orderedItem of order.items) {
                if (orderedItem.clothingId === item.clothingId) {
                    const bookedStart = new Date(orderedItem.startDate);
                    const bookedEnd = new Date(orderedItem.endDate);

                    // OVERLAP LOGIC: If requested start is BEFORE booked end AND requested end is AFTER booked start
                    if (reqStart <= bookedEnd && reqEnd >= bookedStart) {
                        isConflict = true;
                        break;
                    }
                }
            }
            if (isConflict) break; // Stop checking if we already found a conflict
        }

        // 4. Block the user if the dates overlap
        if (isConflict) {
            return res.status(400).json({ 
                message: 'Sorry! This item is already reserved for those dates. Please choose a different timeframe.' 
            });
        }
        // --- END OF DATE CONFLICT CHECK ---

        // If dates are clear, proceed with adding to cart normally
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Add item to the cart array
        cart.items.push({ ...item, quantity: 1 });
        await cart.save();

        res.json({ message: 'Item added to cart with your selected dates!' });

    } catch (err) {
        console.error("Cart Add Error:", err);
        res.status(500).json({ message: 'Server error while checking dates' });
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
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATED CHECKOUT ROUTE
app.post('/cart/checkout', async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ userId });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is already empty!" });
        }

        // 1. Calculate the grand total of the cart
        let total = 0;
        cart.items.forEach(item => {
            total += (item.priceVal * item.quantity);
        });

        // 2. Create the permanent Order record
        const newOrder = new Order({
            userId: userId,
            items: cart.items,
            totalAmount: total
        });
        await newOrder.save();

        // 3. Empty the cart now that the order is safely saved
        cart.items = [];
        await cart.save();

        res.json({ message: "Checkout successful! Your order has been saved to your history." });
    } catch (err) {
        console.error("Backend Checkout Error:", err);
        res.status(500).json({ message: "Server error during checkout" });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: 'Account created successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


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
        res.status(500).send("Server Error");
    }
});

app.post('/admin/add-item', async (req, res) => {
    try {
        const { name, category, price, priceVal, size, image, description } = req.body;

        const lastItem = await Clothing.findOne().sort({ id: -1 });
        const newId = lastItem ? lastItem.id + 1 : 1;

        const newItem = new Clothing({
            id: newId, name, category, price, priceVal: parseFloat(priceVal), size, image, description
        });

        await newItem.save();
        res.json({ message: 'Item added successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/admin/delete-item/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await Clothing.findOneAndDelete({ id });
        res.json({ message: 'Item deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==========================================
// ADMIN ORDER MANAGEMENT
// ==========================================

// 1. Fetch ALL orders for the Admin Panel
app.get('/api/admin/orders', async (req, res) => {
    try {
        // .populate() is magic: it looks at the userId, goes to the User database, and grabs their name & email!
        const orders = await Order.find().populate('userId', 'name email').sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching admin orders' });
    }
});

// 2. Update the status of a specific order
app.put('/api/admin/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'Order status updated!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error updating status' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 HiramPH Server running on http://localhost:${PORT}`);
});

//hello