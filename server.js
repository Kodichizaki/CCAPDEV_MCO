const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- BACKEND DATABASE ---
const products = [
    { 
    id: 1, 
    name: "Batman Shirt", 
    category: "men", 
    price: "₱2,000", 
    priceVal: 1000, 
    size: "S", 
    image: "images/men/batman2.jpg", 
    description: "Channel the Dark Knight with this premium cotton graphic tee."
    },
    { 
    id: 2, 
    name: "Prom Suit", 
    category: "men", 
    price: "₱4,000", 
    priceVal: 4000, 
    size: "S", 
    image: "images/men/promsuit.jpg",
    description: "Stand out at your next formal event. This slim-fit flower stitched tuxedo includes jacket, trousers, and a black inner shirt."
    },
    { 
    id: 3, 
    name: "Mens Summer Shirt", 
    category: "men", 
    price: "₱2,500", 
    priceVal: 2500, 
    size: "S", 
    image: "images/men/mensshirt2.jpg",
    description: "Stay cool in this breathable button-down. Perfect for beach weddings or casual summer days."
    },
    { 
    id: 4, 
    name: "Filipiniana Dress", 
    category: "women", 
    price: "₱3,400", 
    priceVal: 3400, 
    size: "S", 
    image: "images/women/filipiniana2.jpg",
    description: "Elegant traditional Filipiniana dress perfect for formal events."
    },
    { 
    id: 5, 
    name: "Shrek Shirt", 
    category: "casual", 
    price: "₱1000", 
    priceVal: 1000, 
    size: "L", 
    image: "images/casual/shrek2.jpg",
    description: "Get out of my swamp! Casual and comfortable graphic tee."
    },
    { 
    id: 6, 
    name: "Grimace Costume", 
    category: "costumes", 
    price: "₱4,000", 
    priceVal: 4000, 
    size: "S", 
    image: "images/costumes/grimace.jpg",
    description: "Be the life of the party with this vibrant purple costume."
    },
    { 
    id: 7, 
    name: "Womens Suit", 
    category: "women", 
    price: "₱3,500", 
    priceVal: 3500, 
    size: "M", 
    image: "images/women/wsuit.jpg",
    description: "Effortlessly chic, this modern two-piece suit blends structure with comfort. The sleek blazer and fitted trousers create a versatile look that transitions perfectly from day to night"
    },
    { 
    id: 8, 
    name: "Louis Vuitton Tank top", 
    category: "women", 
    price: "₱15,500", 
    priceVal: 15500, 
    size: "XS", 
    image: "images/women/lvtank.jpg",
    description: "This tank top is spun from a soft, flexible wool-blend knit with a lightly spongy texture. It is crafted in a fitted shape with a flattering V-neckline and a wide ribbed hem to accentuate the waistline, while the chest is embellished with a metallic LV Twist charm for a sporty signature finish."
    },
    { 
    id: 9, 
    name: "Gray Suit", 
    category: "formal", 
    price: "₱5,000", 
    priceVal: 5000, 
    size: "M", 
    image: "images/formalmen1.jpg",
    description: "Best for: Executive meetings, formal events, weddings, and evening wear."
    },
    { 
    id: 10, 
    name: "Wedding Gown", 
    category: "formal", 
    price: "₱70,000", 
    priceVal: 70000, 
    size: "S", 
    image: "images/formalwmen1.jpg",
    description: "Featuring a V-neck, sleeveless design, this dress is made of soft lace and tulle, ideal for beach or outdoor weddings."
    },
    { 
    id: 11, 
    name: "Black Tie set", 
    category: "formal", 
    price: "₱10,000", 
    priceVal: 10000, 
    size: "XL", 
    image: "images/formalmen2.jpg",
    description: "Elevate your formal wardrobe with this timeless black tuxedo. Featuring classic peak lapels with rich satin facing, this suit offers an impeccable fit for weddings, galas, or awards nights."
    },
    { 
    id: 12, 
    name: "Gucci Canvas bucket hat", 
    category: "accessories", 
    price: "₱30,000", 
    priceVal: 30000, 
    size: "S", 
    image: "images/accessories/guccihat.jpg",
    description: "In the Fall Winter 2025 collection, signature GG motif returns in soft shades. Crafted from cotton canvas, this bucket hat showcases the GG canvas with a bordeaux leather trim"
    },
    { 
    id: 13, 
    name: "Gucci vittoria bootie", 
    category: "footwear", 
    price: "₱57,000", 
    priceVal: 57000, 
    size: "39", 
    image: "images/footwear/gucciboot.jpg",
    description: "Vittoria includes a bootie silhouette in the La Famiglia collection, highlighting a sleek elongated toe with Horsebit and cone-shaped heel. Crafted from soft leather, it is complete with a full side zip closure for a perfect fit and effortless elegance, which inspires its name."
    }
    ];

// --- HOME ROUTE ---
app.get('/', (req, res) => {
    res.send("Welcome to the HiramPH Backend Server! It is running perfectly.");
});

// --- API ROUTE (This is what your frontend will ask for!) ---
app.get('/api/products', (req, res) => {
    res.json(products); // <--- This sends the array instead of the test message
});

app.listen(PORT, () => {
    console.log(`🚀 HiramPH Server is running on http://localhost:${PORT}`);
});


