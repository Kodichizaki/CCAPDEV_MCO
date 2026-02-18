document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GLOBAL DATABASE
    // ==========================================
    const products = [
        { 
            id: 1, 
            name: "Batman Shirt", 
            category: "men", 
            price: "₱1,000", 
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

    // Temporary Users
    const users = [
        {id: 1, email: "tempuser1@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 2, email: "tempuser2@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 3, email: "tempuser3@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 4, email: "tempuser4@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 5, email: "tempuser5@gmail.com", password: "temppass1234", role: "user", cart: []},
        { id: 6, email: "admin@hiramph.com", password: "admin123", role: "admin", cart: [] }
    ];

    // Header Logic
    const profArea = document.getElementById("prof-area");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (profArea && currentUser) {
        profArea.innerHTML = `
            <div class="profile-dropdown">
                <button id="profile-btn" class="login-btn">
                    Profile
                </button>
                <div id="dropdown-menu" class="dropdown-menu">
                    <a href="cart.html">View Shopping Cart</a>
                    <a href="#" id="logout-btn">Sign Out</a>
                </div>
            </div>
        `;
        const profileBtn = document.getElementById("profile-btn");
        const dropdownMenu = document.getElementById("dropdown-menu");
        const logoutBtn = document.getElementById("logout-btn");

        profileBtn.addEventListener("click", () => {
            dropdownMenu.classList.toggle("show");
        });

        // Logout 
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            alert("Signed out successfully.");
            window.location.href = "index.html";
        });

        // Close dropdown
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".profile-dropdown")) {
                dropdownMenu.classList.remove("show");
            }
        });
    } 

    // Cart Logic
    const cartContainer = document.getElementById("cart-container");

    if (cartContainer) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const cart = currentUser.cart || [];

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        } else {
            let total = 0;
            let html = "";

            currentUser.cart.forEach((item, index) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) {return;}
                const priceNumber = parseInt(item.totalPrice.replace(/[^\d]/g, ''));
                total += priceNumber;

                html += `
                    <div class="cart-card">
                        <img src="${product.image}" alt="${product.name}" class="cart-img">
                        <div class="cart-info">
                            <h3>${product.name}</h3>
                            <p><strong>Dates:</strong> ${item.startDate} → ${item.endDate}</p>
                            <p><strong>Duration:</strong> ${item.days} day(s)</p>
                            <p><strong>Price:</strong> ${item.totalPrice}</p>
                            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    </div>
                `;
            });

            html += `<h2 class="cart-total">Total: ₱${total.toLocaleString()}</h2>`;
            cartContainer.innerHTML = html;
        }
    }

    window.removeFromCart = function(index) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.cart) return;

    currentUser.cart.splice(index, 1);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    location.reload();
}
    // ==========================================
    // LOGIN PAGE LOGIC
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const verifyUser = users.find(user => 
            user.email === email && user.password === password
        );

            if (verifyUser){
                const existingUser = JSON.parse(localStorage.getItem("currentUser"));

                if (existingUser && existingUser.email === verifyUser.email) {
                    localStorage.setItem("currentUser", JSON.stringify(existingUser));
                } 
                else {
                    localStorage.setItem("currentUser", JSON.stringify(verifyUser));
                }

                if (verifyUser.role === "admin"){
                    alert("Admin Login Successful! Redirecting to Homepage...");
                    window.location.href = "admin.html"; 
                }
                else {
                    alert("Login Successful! Redirecting to Homepage...")
                    window.location.href = "index.html";
                }     
            }
            else {
                alert("Invalid credentials!");
            }
            
        });
    }



    // ==========================================
    // CONTACT PAGE LOGIC
    // ==========================================
    const contactForm = document.querySelector('form');
    const messageBox = document.getElementById('message');
    
    // Only run if we are actually on the contact page
    if (contactForm && messageBox) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = messageBox.value;

            const subject = `Inquiry from ${name}`;
            const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

            window.location.href = `mailto:hello@hiramph.com?subject=${subject}&body=${emailBody}`;
        });
    }


    // ==========================================
    // MARKETPLACE PAGE LOGIC (CATEGORIES & SORTING)
    // ==========================================
    const productContainer = document.getElementById('product-container');

    if (productContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentCategory = urlParams.get('category');

        const titleElement = document.getElementById('category-title');
        if (currentCategory && titleElement) {
            titleElement.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        }

        // Filter products by category
        let displayProducts = products.filter(product => {
            if (!currentCategory || currentCategory === 'all') return true;
            return product.category === currentCategory;
        });

        // Function to draw products on the screen
        function renderProducts(productList) {
            productContainer.innerHTML = ''; 

            if (productList.length > 0) {
                productList.forEach(product => {
                    const productHTML = `
                        <div class="product-card">
                            <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit;">
                                <div class="image-box">
                                    <img src="${product.image}" alt="${product.name}">
                                </div>
                                <div class="card-details">
                                    <p class="product-name">${product.name}</p>
                                    <div class="price-row">
                                        <span>${product.size}</span>
                                        <span class="price">${product.price}</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;
                    productContainer.innerHTML += productHTML;
                });
            } else {
                productContainer.innerHTML = "<p style='width: 100%; text-align: center; margin-top: 2rem; color: #666;'>No products found.</p>";
            }
        }

       



        // Initial draw of the products
        renderProducts(displayProducts);

        // Sorting Logic
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortValue = e.target.value;
                let sortedList = [...displayProducts]; 

                if (sortValue === 'low-high') {
                    sortedList.sort((a, b) => a.priceVal - b.priceVal);
                } else if (sortValue === 'high-low') {
                    sortedList.sort((a, b) => b.priceVal - a.priceVal);
                } else if (sortValue === 'az') {
                    sortedList.sort((a, b) => a.name.localeCompare(b.name));
                }

                renderProducts(sortedList); 
            });
        }
    }

     // Add To Cart Logic
        function addToCart(productId, rentalDetails){
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (!currentUser) {return false;}
            if (!currentUser.cart) {
                currentUser.cart = [];
            }

            currentUser.cart.push({
                productId: productId,
                startDate: rentalDetails.startDate,
                endDate: rentalDetails.endDate,
                days: rentalDetails.days,
                totalPrice: rentalDetails.totalPrice
            });

            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            return true;
        }



    // ==========================================
    // SINGLE PRODUCT PAGE LOGIC (WITH START & END DATES)
    // ==========================================
    const singleProductContainer = document.getElementById('single-product-container');
    
    if (singleProductContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);



        if (product) {
            singleProductContainer.innerHTML = `
                <div class="product-img-full">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                
                <div class="product-info-side">
                    <a href="marketplace.html?category=${product.category}" class="breadcrumb">< Back to ${product.category}</a>
                    
                    <h1 class="detail-title">${product.name}</h1>
                    <div class="detail-price" id="display-price">${product.price} <span style="font-size: 1rem; color: #666;">/ day</span></div>

                    <div class="detail-accordion">
                        <details open>
                            <summary>Description</summary>
                            <p>${product.description}</p>
                        </details>
                        <details>
                            <summary>Measurements</summary>
                            <p>Length: 28in <br> Chest: 38in <br> Sleeve: 9in</p>
                        </details>
                    </div>

                    <div class="size-section">
                        <label class="size-label">Size</label>
                        <button class="size-btn">${product.size}</button>
                    </div>

                    <div class="rental-section">
                        <div style="display: flex; gap: 40px;">
                            <div style="flex: 1;">
                                <label for="start-date" class="size-label">Start Date:</label>
                                <input type="date" id="start-date" class="date-input">
                            </div>
                            <div style="flex: 1;">
                                <label for="end-date" class="size-label">End Date:</label>
                                <input type="date" id="end-date" class="date-input">
                            </div>
                        </div>

                        <div style="margin-top: 30px;">
                            <p style="font-size: 1.1rem; margin-bottom: 10px; color: #333;">
                                Borrowing for: <strong id="days-indicator">1</strong> day(s)
                            </p>
                            <button id="rent-btn" class="submit-btn" style="width: 100%; margin: 0;">Rent Now - ${product.price}</button>
                        </div>
                    </div>
                </div>
            `;

            const startDateInput = document.getElementById('start-date');
            const endDateInput = document.getElementById('end-date');
            const daysIndicator = document.getElementById('days-indicator');
            const rentBtn = document.getElementById('rent-btn');

            // Set the minimum start date to TODAY
            const today = new Date().toISOString().split('T')[0];
            startDateInput.min = today;

            // prevent rentals when not logged in
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (!currentUser) {
                rentBtn.textContent = "Login to Rent";

                rentBtn.addEventListener("click", () => {
                    alert("Please login first!");
                    window.location.href = "login.html";
                });

                return;
            }

            // Function to calculate days and update price
            function updateRentalDetails() {
                const start = startDateInput.value ? new Date(startDateInput.value) : null;
                const end = endDateInput.value ? new Date(endDateInput.value) : null;
                
                let days = 1; // Default to 1 day

                if (start && end) {
                    // Calculate the difference in milliseconds, then convert to days
                    const timeDiff = end.getTime() - start.getTime();
                    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    
                    // If same day, count as 1 day. Otherwise, use the difference.
                    if (diffDays >= 0) {
                        days = diffDays === 0 ? 1 : diffDays; 
                    }
                }

                // Update the text indicator on the screen
                daysIndicator.textContent = days;
                
                // Calculate and format the total price
                const totalPrice = product.priceVal * days;
                const formattedPrice = "₱" + totalPrice.toLocaleString();
                rentBtn.textContent = `Rent Now - ${formattedPrice}`;
                
                return { days, formattedPrice };
            }

            // When Start Date changes, make sure End Date can't be earlier than Start Date
            startDateInput.addEventListener('change', () => {
                if (startDateInput.value) {
                    endDateInput.min = startDateInput.value;
                    
                    // If the current end date is now before the new start date, reset it
                    if (endDateInput.value && endDateInput.value < startDateInput.value) {
                        endDateInput.value = startDateInput.value;
                    }
                }
                updateRentalDetails();
            });

            // Update calculations when End Date changes
            endDateInput.addEventListener('change', updateRentalDetails);

            rentBtn.addEventListener('click', () => {
                if (!startDateInput.value || !endDateInput.value){
                    alert("Select Both Dates.");
                    return;
                }

                const rentalInfo = updateRentalDetails();

                const valid = addToCart(product.id, {
                    startDate: startDateInput.value,
                    endDate: endDateInput.value,
                    days: rentalInfo.days,
                    totalPrice: rentalInfo.formattedPrice
                });
                if(valid){
                    alert("Item Added To Cart!");
                }
            });

        } else {
            singleProductContainer.innerHTML = "<p>Product not found.</p>";
        }
    }

});
