// We wrap everything in this listener so the script waits for the HTML to load first
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GLOBAL DATABASE
    // ==========================================
    const products = [
        { 
            id: 1, 
            name: "Batman Shirt", 
            category: "men", 
            price: "₱3,100", priceVal: 3100, 
            size: "S", 
            image: "images/men/batman2.jpg", 
            description: "Channel the Dark Knight with this premium cotton graphic tee."
        },
        { 
            id: 2, 
            name: "Prom Suit", 
            category: "men", 
            price: "₱4,000", priceVal: 4000, 
            size: "S", 
            image: "images/men/promsuit.jpg",
            description: "Stand out at your next formal event. This slim-fit flower stitched tuxedo includes jacket, trousers, and a black inner shirt."
        },
        { 
            id: 3, 
            name: "Mens Summer Shirt", 
            category: "men", 
            price: "₱3,800", priceVal: 3800, 
            size: "S", 
            image: "images/men/mensshirt2.jpg",
            description: "Stay cool in this breathable button-down. Perfect for beach weddings or casual summer parties."
        },
        { 
            id: 4, 
            name: "Filipiniana Dress", 
            category: "women", 
            price: "₱3,400", priceVal: 3400, 
            size: "S", 
            image: "images/women/filipiniana.jpg",
            description: "A modern take on the classic Filipiniana. Features butterfly sleeves and intricate embroidery on the bodice."
        },
        { 
            id: 5, 
            name: "Womens Blazer", 
            category: "women", 
            price: "₱3,300", priceVal: 3300, 
            size: "S", 
            image: "images/women/wsuit.jpg", 
            description: "Power dressing made elegant. This tailored blazer pairs perfectly with slacks or a skirt."
        },
        { 
            id: 6, 
            name: "Shrek Shirt", 
            category: "casual", 
            price: "₱3,000", priceVal: 3000, 
            size: "M", 
            image: "images/casual/shrek.jpg",
            description: "Get out of my swamp! This fun, casual tee is perfect for everyday wear or movie marathons."
        },
        { 
            id: 7, 
            name: "Grimace Costume", 
            category: "costumes", 
            price: "₱4,000", priceVal: 4000, 
            size: "S", 
            image: "images/costumes/grimace.jpg",
            description: "Be the life of the party with this inflatable Grimace costume."
        }
    ];
    
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
    // 3. MARKETPLACE PAGE LOGIC
    // ==========================================
    const productContainer = document.getElementById('product-container');
    const sortSelect = document.getElementById('sortSelect');

    if (productContainer) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const currentCategory = urlParams.get('category');

        const titleElement = document.getElementById('category-title');
        if (currentCategory && titleElement) {
            titleElement.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        }

        function displayProducts(sortBy) {
            productContainer.innerHTML = ''; 

            let filteredList = products.filter(product => {
                if (!currentCategory || currentCategory === 'all') return true;
                return product.category === currentCategory;
            });

            if (sortBy === 'az') {
                filteredList.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'low-high') {
                filteredList.sort((a, b) => a.priceVal - b.priceVal);
            } else if (sortBy === 'high-low') {
                filteredList.sort((a, b) => b.priceVal - a.priceVal);
            } else if (['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(sortBy)) {
                filteredList = filteredList.filter(product => product.size === sortBy);
            }

            if (filteredList.length > 0) {
                filteredList.forEach(product => {
                    const productHTML = `
                        <a href="product.html?id=${product.id}" style="text-decoration:none; color:inherit;">
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
                        </a>
                    `;
                    productContainer.innerHTML += productHTML;
                });
            } else {
                productContainer.innerHTML = "<p style='width: 100%; text-align: center; margin-top: 2rem; color: #666;'>No products found matching your selection.</p>";
            }
        }

        displayProducts('default');

        if(sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                displayProducts(e.target.value);
            });
        }
    }

    // ==========================================
    // 4. NEW: SINGLE PRODUCT PAGE LOGIC
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
                    <div class="detail-price">${product.price}</div>

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

                </div>
            `;
        } else {
            singleProductContainer.innerHTML = "<p>Product not found.</p>";
        }
    }

});
