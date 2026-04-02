document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // HEADER & LOGOUT LOGIC
    // ==========================================
    const profArea = document.getElementById("prof-area");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // If a user is logged in, change the "Login" button to a Profile Dropdown
    if (profArea && currentUser) {
        const dropdownLink = currentUser.role === 'admin' 
            ? `<a href="/admin">Admin Panel</a>` 
            : `<a href="/cart">View Shopping Cart</a>`;

        profArea.innerHTML = `
            <div class="profile-dropdown">
                <button id="profile-btn" class="login-btn">Profile</button>
                <div id="dropdown-menu" class="dropdown-menu">
                    ${dropdownLink}
                    <a href="#" id="logout-btn">Sign Out</a>
                </div>
            </div>
        `;
        
        const profileBtn = document.getElementById("profile-btn");
        const dropdownMenu = document.getElementById("dropdown-menu");
        const logoutBtn = document.getElementById("logout-btn");

        // Toggle dropdown menu
        profileBtn.addEventListener("click", () => {
            dropdownMenu.classList.toggle("show");
        });

        // Handle Logout
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            alert("Signed out successfully.");
            window.location.href = "/"; // Redirect to Home
        });

        // Close dropdown if clicked outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".profile-dropdown")) {
                dropdownMenu.classList.remove("show");
            }
        });
    } 

    // ==========================================
    // LOGIN PAGE LOGIC
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("currentUser", JSON.stringify(data));
                alert("Login Successful!");
                
                // Redirect based on role
                if (data.role === 'admin') {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }
            }
        });
    }

    // ==========================================
    // SIGNUP PAGE LOGIC
    // ==========================================
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const res = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Account created! Please log in.');
                window.location.href = '/login';
            } else {
                alert(data.message);
            }
        });
    }

    // ==========================================
    // CONTACT PAGE LOGIC
    // ==========================================
    // Using querySelector to find the form inside the contact wrapper
    const contactForm = document.querySelector('.contact-form form');
    const messageBox = document.getElementById('message');
    
    if (contactForm && messageBox) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = messageBox.value;

            const subject = `Inquiry from ${name}`;
            const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            
            // Opens the user's default email client
            window.location.href = `mailto:hello@hiramph.com?subject=${subject}&body=${emailBody}`;
        });
    }

    // ==========================================
    // ADD TO CART LOGIC 
    // ==========================================
    const rentBtn = document.getElementById('rentBtn');

    if (rentBtn) {
        rentBtn.addEventListener('click', async function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!currentUser) {
                alert('Please log in first to rent an item!');
                window.location.href = '/login';
                return;
            }

            const item = {
                clothingId: parseInt(rentBtn.dataset.id),
                name: rentBtn.dataset.name,
                price: rentBtn.dataset.price,
                priceVal: parseFloat(rentBtn.dataset.priceval),
                image: rentBtn.dataset.image,
                size: rentBtn.dataset.size
            };

            const res = await fetch('/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, item })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Item added to cart!');
            } else {
                alert(data.message);
            }
        });
    }

    // ==========================================
    // CART LOGIC 
    // ==========================================

    const cartContainer = document.getElementById('cart-container');

    if (cartContainer) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>Please log in to view your cart</h2>
                    <a href="/login" class="submit-btn" style="text-decoration: none; display: inline-block; margin-top: 20px;">Go to Login</a>
                </div>`;
        } else {
            loadCart(currentUser.id);
        }
    }

    // ==========================================
    // ADMIN PAGE LOGIC
    // ==========================================
    const adminContent = document.getElementById('admin-content');
    const accessDenied = document.getElementById('access-denied');

    if (adminContent) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser || currentUser.role !== 'admin') {
            accessDenied.style.display = 'block';
        } else {
            adminContent.style.display = 'block';
            loadInventory();

            // When footwear category is checked, swap size checkboxes for number input
            const footwearCatCheck = document.getElementById('footwear-cat-check');
            if (footwearCatCheck) {
                footwearCatCheck.addEventListener('change', function() {
                    const sizeCheckboxes = document.getElementById('size-checkboxes');
                    const footwearSizeBox = document.getElementById('footwear-size-box');

                    if (this.checked) {
                        sizeCheckboxes.style.display = 'none';
                        footwearSizeBox.style.display = 'block';
                        document.querySelectorAll('.size-check').forEach(cb => cb.checked = false);
                    } else {
                        sizeCheckboxes.style.display = 'flex';
                        footwearSizeBox.style.display = 'none';
                        document.getElementById('footwear-size-input').value = '';
                    }
                });
            }

            document.getElementById('addItemBtn').addEventListener('click', async () => {

                // Collect categories
                const selectedCategories = [...document.querySelectorAll('.cat-check:checked')]
                    .map(cb => cb.value);
                if (selectedCategories.length === 0) {
                    alert('Please select at least one category.');
                    return;
                }

                // Collect sizes
                let selectedSizes = [];
                const footwearCatCheck = document.getElementById('footwear-cat-check');
                if (footwearCatCheck && footwearCatCheck.checked) {
                    // Footwear mode — use number input
                    const footwearSize = document.getElementById('footwear-size-input').value;
                    if (!footwearSize) {
                        alert('Please enter a footwear size number.');
                        return;
                    }
                    selectedSizes.push(footwearSize);
                } else {
                    // Normal mode — use checkboxes
                    selectedSizes = [...document.querySelectorAll('.size-check:checked')]
                        .map(cb => cb.value);
                    if (selectedSizes.length === 0) {
                        alert('Please select at least one size.');
                        return;
                    }
                }

                // Upload image first
                const imageFile = document.getElementById('a-image-file').files[0];
                if (!imageFile) {
                    alert('Please select an image.');
                    return;
                }

                document.getElementById('image-upload-msg').textContent = 'Uploading image...';

                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('/admin/upload-image', {
                    method: 'POST',
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    alert('Image upload failed: ' + uploadData.message);
                    return;
                }

                document.getElementById('image-upload-msg').textContent = '✅ Image uploaded!';

                // Build item object
                const item = {
                    name: document.getElementById('a-name').value,
                    category: selectedCategories,
                    price: document.getElementById('a-price').value,
                    priceVal: document.getElementById('a-priceval').value,
                    size: selectedSizes,
                    image: uploadData.imagePath,
                    description: document.getElementById('a-description').value
                };

                // Validate name and description
                if (!item.name || !item.price || !item.priceVal || !item.description) {
                    alert('Please fill in all fields.');
                    return;
                }

                // Save item to database
                const res = await fetch('/admin/add-item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });

                const data = await res.json();
                if (res.ok) {
                    document.getElementById('add-msg').textContent = '✅ ' + data.message;
                    document.getElementById('image-upload-msg').textContent = '';

                    // Reset the form
                    document.getElementById('a-name').value = '';
                    document.getElementById('a-price').value = '';
                    document.getElementById('a-priceval').value = '';
                    document.getElementById('a-description').value = '';
                    document.getElementById('a-image-file').value = '';
                    document.getElementById('image-preview-box').style.display = 'none';
                    document.querySelectorAll('.cat-check').forEach(cb => cb.checked = false);
                    document.querySelectorAll('.size-check').forEach(cb => cb.checked = false);
                    document.getElementById('footwear-size-input').value = '';
                    document.getElementById('size-checkboxes').style.display = 'flex';
                    document.getElementById('footwear-size-box').style.display = 'none';

                    loadInventory();
                } else {
                    alert(data.message);
                }
            });
        }
    }

    // Image preview
    const imageFileInput = document.getElementById('a-image-file');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('image-preview').src = e.target.result;
                    document.getElementById('image-preview-box').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Hide rent button for admin
    const rentSection = document.getElementById('rent-section');
    if (rentSection && currentUser && currentUser.role === 'admin') {
        rentSection.style.display = 'none';
    }

}); // end of domcontentloaded

    async function loadCart(userId) {
        const cartContainer = document.getElementById('cart-container');

        const res = await fetch(`/cart/data?userId=${userId}`);
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>Your Cart is Empty</h2>
                    <a href="/marketplace" class="submit-btn" style="text-decoration: none; display: inline-block; margin-top: 20px;">Browse Marketplace</a>
                </div>`;
            return;
        }

        let total = 0;
        let itemsHTML = data.items.map(item => {
            total += item.priceVal * item.quantity;
            return `
                <div class="cart-item" style="display: flex; align-items: center; gap: 20px; padding: 15px; border-bottom: 1px solid #eee;">
                    <img src="${item.image}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <p style="font-weight: bold; font-size: 1.1rem;">${item.name}</p>
                        <p style="color: #666;">Size: ${item.size}</p>
                        <p style="color: #666;">Quantity: ${item.quantity}</p>
                        <p style="color: #c8a165; font-weight: bold;">${item.price} / day</p>
                    </div>
                    <button onclick="removeItem('${userId}', ${item.clothingId})" 
                        style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                        Remove
                    </button>
                </div>`;
        }).join('');

        cartContainer.innerHTML = `
            ${itemsHTML}
            <div style="text-align: right; padding: 20px; font-size: 1.2rem; font-weight: bold;">
                Total: ₱${total.toLocaleString()}
            </div>`;
    }

    async function removeItem(userId, clothingId) {
        const res = await fetch('/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, clothingId })
        });

        if (res.ok) {
            loadCart(userId); // Refresh the cart display
        }
    }

    async function loadInventory() {
        const res = await fetch('/marketplace?json=true');
        const data = await res.json();
        const list = document.getElementById('inventory-list');

        list.innerHTML = data.map(item => `
            <div style="display:flex; align-items:center; gap:20px; padding:15px; border-bottom:1px solid #eee;">
                <img src="${item.image}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">
                <div style="flex:1;">
                    <p style="font-weight:bold;">${item.name}</p>
                    <p style="color:#666;">${item.category} | Size: ${item.size} | ${item.price}</p>
                </div>
                <button onclick="deleteItem(${item.id})"
                    style="background:#ff4444; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">
                    Delete
                </button>
            </div>
        `).join('');
    }

    async function deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const res = await fetch(`/admin/delete-item/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        loadInventory();
    }

