const mongoose = require('mongoose');
const Clothing = require('./models/Clothing');
const User = require('./models/User');
const bcrypt = require('bcrypt');

// 1. Connect to local MongoDB
// FIXED: Added /hiramph_db right before the ? so it goes to the correct database!
mongoose.connect('mongodb://RedHotChiliPepper:Chili123@ac-aoidhhk-shard-00-00.rv7tofc.mongodb.net:27017,ac-aoidhhk-shard-00-01.rv7tofc.mongodb.net:27017,ac-aoidhhk-shard-00-02.rv7tofc.mongodb.net:27017/hiramph_db?ssl=true&replicaSet=atlas-ab6yup-shard-0&authSource=admin&appName=Cluster')
  .then(() => console.log('✅ Connected to MongoDB for seeding!'))
  .catch((err) => console.error('❌ Connection error:', err));

// inventory array
const products = [
    { 
    id: 1, 
    name: "Batman Shirt", 
    category: ["men", "casual"], 
    price: "₱2,000", 
    priceVal: 2000, 
    size: ["S", 'M', "L"], 
    image: "/images/men/batman2.jpg", 
    description: "Channel the Dark Knight with this premium cotton graphic tee."
    },
    { 
    id: 2, 
    name: "Prom Suit", 
    category: ["men", "formal"], 
    price: "₱4,000", 
    priceVal: 4000, 
    size: ["S", "L"], 
    image: "/images/men/promsuit.jpg",
    description: "Stand out at your next formal event. This slim-fit flower stitched tuxedo includes jacket, trousers, and a black inner shirt."
    },
    { 
    id: 3, 
    name: "Mens Summer Shirt", 
    category: ["men", "casual"], 
    price: "₱2,500", 
    priceVal: 2500, 
    size: ["S", "M"], 
    image: "/images/men/mensshirt2.jpg",
    description: "Stay cool in this breathable button-down. Perfect for beach weddings or casual summer days."
    },
    { 
    id: 4, 
    name: "Filipiniana Dress", 
    category: ["women", "formal"], 
    price: "₱3,400", 
    priceVal: 3400, 
    size: ["S", "M"], 
    image: "/images/women/filipiniana2.jpg",
    description: "Elegant traditional Filipiniana dress perfect for formal events."
    },
    { 
    id: 5, 
    name: "Shrek Shirt", 
    category: ["casual", "men", "women"], 
    price: "₱1000", 
    priceVal: 1000, 
    size: ["L", "M", "XL"], 
    image: "/images/casual/shrek2.jpg",
    description: "Get out of my swamp! Casual and comfortable graphic tee."
    },
    { 
    id: 6, 
    name: "Grimace Costume", 
    category: ["costumes"], 
    price: "₱4,000", 
    priceVal: 4000, 
    size: ["S", "L"], 
    image: "/images/costumes/grimace.jpg",
    description: "Be the life of the party with this vibrant purple costume."
    },
    { 
    id: 7, 
    name: "Womens Suit", 
    category: ["women", "formal"], 
    price: "₱3,500", 
    priceVal: 3500, 
    size: ["M", "S", "L"], 
    image: "/images/women/wsuit.jpg",
    description: "Effortlessly chic, this modern two-piece suit blends structure with comfort. The sleek blazer and fitted trousers create a versatile look that transitions perfectly from day to night"
    },
    { 
    id: 8, 
    name: "Louis Vuitton Tank top", 
    category: ["women", "casual"], 
    price: "₱15,500", 
    priceVal: 15500, 
    size: ["XS", "M"], 
    image: "/images/women/lvtank.jpg",
    description: "This tank top is spun from a soft, flexible wool-blend knit with a lightly spongy texture. It is crafted in a fitted shape with a flattering V-neckline and a wide ribbed hem to accentuate the waistline, while the chest is embellished with a metallic LV Twist charm for a sporty signature finish."
    },
    { 
    id: 9, 
    name: "Gray Suit", 
    category: ["formal", "men"], 
    price: "₱5,000", 
    priceVal: 5000, 
    size: ["M", "L"], 
    image: "/images/formalmen1.jpg",
    description: "Best for: Executive meetings, formal events, weddings, and evening wear."
    },
    { 
    id: 10, 
    name: "Wedding Gown", 
    category: ["formal", "women"], 
    price: "₱70,000", 
    priceVal: 70000, 
    size: ["S", "L"], 
    image: "/images/formalwmen1.jpg",
    description: "Featuring a V-neck, sleeveless design, this dress is made of soft lace and tulle, ideal for beach or outdoor weddings."
    },
    { 
    id: 11, 
    name: "Black Tie set", 
    category: ["formal", "accessories"], 
    price: "₱10,000", 
    priceVal: 10000, 
    size: ["XL"], 
    image: "/images/formalmen2.jpg",
    description: "Elevate your formal wardrobe with this timeless black tuxedo. Featuring classic peak lapels with rich satin facing, this suit offers an impeccable fit for weddings, galas, or awards nights."
    },
    { 
    id: 12, 
    name: "Gucci Canvas bucket hat", 
    category: ["accessories"], 
    price: "₱30,000", 
    priceVal: 30000, 
    size: ["S", "M"], 
    image: "/images/accessories/guccihat.jpg",
    description: "In the Fall Winter 2025 collection, signature GG motif returns in soft shades. Crafted from cotton canvas, this bucket hat showcases the GG canvas with a bordeaux leather trim"
    },
    { 
    id: 13, 
    name: "Gucci vittoria bootie", 
    category: ["footwear", "women"], 
    price: "₱57,000", 
    priceVal: 57000, 
    size: ["39"], 
    image: "/images/footwear/gucciboot.jpg",
    description: "Vittoria includes a bootie silhouette in the La Famiglia collection, highlighting a sleek elongated toe with Horsebit and cone-shaped heel. Crafted from soft leather, it is complete with a full side zip closure for a perfect fit and effortless elegance, which inspires its name."
    }
];

const seedAdmin = async () => {
    const existing = await User.findOne({ email: 'admin@hiramph.com' });
    if (!existing) {
        const hashed = await bcrypt.hash('admin123', 10);
        await User.create({ name: 'Admin', email: 'admin@hiramph.com', password: hashed, role: 'admin' });
        console.log('✅ Admin account created!');
    } else {
        console.log('ℹ️ Admin already exists, skipping.');
    }
};

// The function that inserts the data into the database
const seedDatabase = async () => {
    try {
        await Clothing.deleteMany({}); 
        await Clothing.insertMany(products); 
        console.log('🎉 Database successfully seeded with HiramPh products!');
        await seedAdmin();
    } catch (err) {
        console.error('❌ Error seeding database:', err);
    } finally {
        mongoose.connection.close(); 
    }
};

// Execute the function
seedDatabase();