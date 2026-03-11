

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // FETCH GLOBAL DATABASE FROM SERVER
    // ==========================================
    let products = []; // Create an empty list first
    
    try {
        // Go to our new Node.js server and ask for the clothes
        const response = await fetch('http://localhost:3000/api/products');
        
        // Convert the server's response into a real JavaScript array
        products = await response.json(); 
        
        console.log("Successfully fetched products from backend:", products);
    } catch (error) {
        console.error("Error loading products:", error);
        alert("Could not connect to the server. Make sure your Node.js backend is running!");
        return; // Stop the script if the server is offline
    }
   
   
    // ==========================================
    // CART SYSTEM (Using LocalStorage)
    // ==========================================
    
    // This function grabs the current cart from memory, or creates an empty one
    function getCart() {
        const cart = localStorage.getItem('hiramph_cart');
        return cart ? JSON.parse(cart) : [];
    }

    // This is the function your "Rent Now" button calls!
    window.addToCart = function(productId, rentalDetails) {
        const cart = getCart();
        
        // Combine the product ID and the dates into one object
        const cartItem = {
            productId: productId,
            startDate: rentalDetails.startDate,
            endDate: rentalDetails.endDate,
            days: rentalDetails.days,
            totalPrice: rentalDetails.totalPrice
        };

        // Add it to the cart array and save it back to the browser's memory
        cart.push(cartItem);
        localStorage.setItem('hiramph_cart', JSON.stringify(cart));
        
        return true; // Tells the button it was successful
    };

    // Temporary Users
    const users = [
        {id: 1, email: "tempuser1@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 2, email: "tempuser2@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 3, email: "tempuser3@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 4, email: "tempuser4@gmail.com", password: "temppass1234", role: "user", cart: []},
        {id: 5, email: "tempuser5@gmail.com", password: "temppass1234", role: "user", cart: []},
        { id: 6, email: "admin@hiramph.com", password: "admin123", role: "admin", cart: [] }
    ];

    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(users));
    }

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
        const storedUsers = JSON.parse(localStorage.getItem("users"));
        const user = storedUsers.find(u => u.id === currentUser.id);

        if (!user || !user.cart || user.cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        } else {
            let total = 0;
            let html = "";

            user.cart.forEach((item, index) => {
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
        const storedUsers = JSON.parse(localStorage.getItem("users"));
        const userIndex = storedUsers.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) 
            return;

        storedUsers[userIndex].cart.splice(index, 1);

        localStorage.setItem("users", JSON.stringify(storedUsers));
        localStorage.setItem("currentUser", JSON.stringify(storedUsers[userIndex]));

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
            const storedUsers = JSON.parse(localStorage.getItem("users"));
            const verifyUser = storedUsers.find(user => 
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
            const storedUsers = JSON.parse(localStorage.getItem("users"));

            if (!currentUser) 
                return false;

            const userIndex = storedUsers.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) 
                return false;

            if (!storedUsers[userIndex].cart) {
                storedUsers[userIndex].cart = [];
            }

            storedUsers[userIndex].cart.push({
                productId: productId,
                startDate: rentalDetails.startDate,
                endDate: rentalDetails.endDate,
                days: rentalDetails.days,
                totalPrice: rentalDetails.totalPrice
            });

            localStorage.setItem("users", JSON.stringify(storedUsers));
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

// ==========================================
    // SHOPPING CART PAGE LOGIC
    // ==========================================
    const cartContainer = document.getElementById('cart-container');

    if (cartContainer) {
        const cart = getCart(); // Get the saved items

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2 style="margin-bottom: 20px;">Your Cart is Empty</h2>
                    <p style="color: #666; margin-bottom: 30px;">Looks like you haven't added any clothes to rent yet.</p>
                    <a href="marketplace.html?category=all" class="submit-btn" style="text-decoration: none; display: inline-block;">Browse Marketplace</a>
                </div>
            `;
        } else {
            cartContainer.innerHTML = '<h2>Your Cart</h2>';
            let grandTotal = 0;

            // Loop through everything in the cart
            cart.forEach((item, index) => {
                // Find the full product details from the main database using the saved ID
                const product = products.find(p => p.id === item.productId);
                
                if (product) {
                    // Turn "₱4,000" back into a raw number for the Grand Total math
                    const priceNumber = parseInt(item.totalPrice.replace(/[^0-9.-]+/g,""));
                    grandTotal += priceNumber;

                    // Draw the HTML for this specific item in the cart
                    const cartItemHTML = `
                        <div class="cart-card">
                            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 120px; object-fit: cover; border-radius: 8px;">
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 5px 0;">${product.name}</h3>
                                <p style="margin: 0; color: #666; font-size: 0.9rem;">Size: ${product.size}</p>
                                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">
                                    <strong>Dates:</strong> ${item.startDate} to ${item.endDate} (${item.days} Days)
                                </p>
                            </div>
                            <div style="text-align: right;">
                                <h3 style="margin: 0 0 10px 0;">${item.totalPrice}</h3>
                                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; cursor: pointer; text-decoration: underline;">Remove</button>
                            </div>
                        </div>
                    `;
                    cartContainer.innerHTML += cartItemHTML;
                }
            });

            // Add the Checkout Section with the Grand Total
            cartContainer.innerHTML += `
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; text-align: right;">
                    <h2 style="margin-bottom: 20px;">Grand Total: ₱${grandTotal.toLocaleString()}</h2>
                    <button class="submit-btn" style="width: 250px;" onclick="alert('Checkout feature coming soon!')">Proceed to Checkout</button>
                </div>
            `;
        }
    }

    // Function to delete an item from the cart
    window.removeFromCart = function(index) {
        let cart = getCart();
        cart.splice(index, 1); // Remove the specific item
        localStorage.setItem('hiramph_cart', JSON.stringify(cart)); // Save the updated list
        window.location.reload(); // Refresh the page to show the changes
    };