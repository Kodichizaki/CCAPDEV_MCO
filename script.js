// We wrap everything in this listener so the script waits for the HTML to load first
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LOGIN PAGE LOGIC
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stops the page from refreshing
            alert("Login Successful! Redirecting to Homepage...");
            window.location.href = "index.html"; 
        });
    }

    // ==========================================
    // 2. CONTACT PAGE LOGIC
    // ==========================================
    // Finds the form on the contact page by looking for the message box
    const contactForm = document.querySelector('form');
    const messageBox = document.getElementById('message');
    
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
    // 3. MARKETPLACE PAGE LOGIC (CATEGORIES)
    // ==========================================
    const productContainer = document.getElementById('product-container');

    if (productContainer) {
        // Your Database of clothes
        const products = [
            { name: "Batman Shirt", category: "men", price: "₱3,100", size: "S", image: "images/men/batman.jpg" },
            { name: "Prom Suit", category: "men", price: "₱4,000", size: "S", image: "images/men/Prom_Suit.png" },
            { name: "Mens Summer Shirt", category: "men", price: "₱3,800", size: "S", image: "images/men/mensshirt.jpg" },
            { name: "Filipiniana Dress", category: "women", price: "₱3,400", size: "S", image: "images/women/filipiniana.jpg" },
            { name: "Shrek Shirt", category: "casual", price: "₱3,000", size: "M", image: "images/casual/shrek.jpg" },
            { name: "Grimace Costume", category: "costumes", price: "₱4,000", size: "S", image: "images/costumes/grimace.jpg" }
        ];

        // Find out which category the user clicked from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentCategory = urlParams.get('category');

        // Update the page title (Changes "Marketplace" to "Men" or "Women")
        const titleElement = document.getElementById('category-title');
        if (currentCategory && titleElement) {
            titleElement.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        }

        // Filter products so it ONLY shows the specific category
        const filteredProducts = products.filter(product => {
            if (!currentCategory || currentCategory === 'all') return true;
            return product.category === currentCategory;
        });

        // Clear the empty box
        productContainer.innerHTML = ''; 

        // Draw the products on the screen
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                const productHTML = `
                    <div class="product-card">
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
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        } else {
            // Message if a category has no items yet
            productContainer.innerHTML = "<p style='width: 100%; text-align: center; margin-top: 2rem; color: #666;'>No products found in this category yet. Check back soon!</p>";
        }
    }
});