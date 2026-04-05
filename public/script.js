document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // HEADER & LOGOUT LOGIC
    // ==========================================
    const profArea = document.getElementById("prof-area");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (profArea && currentUser) {
        const dropdownLink = currentUser.role === 'admin' 
            ? `<a href="/admin">Admin Panel</a>
               <a href="/settings">Account Settings</a>` 
            : `<a href="/cart">View Shopping Cart</a>
               <a href="/orders">Order History</a>
               <a href="/settings">Account Settings</a>`; 

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

        profileBtn.addEventListener("click", () => {
            dropdownMenu.classList.toggle("show");
        });

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            alert("Signed out successfully.");
            window.location.href = "/"; 
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".profile-dropdown")) {
                dropdownMenu.classList.remove("show");
            }
        });
    } 

    // ==========================================
    // LOGIN, SIGNUP & CONTACT PAGE LOGIC
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
                if (data.role === 'admin') window.location.href = "/admin";
                else window.location.href = "/";
            } else {
                alert(data.message);
            }
        });
    }

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
            window.location.href = `mailto:hello@hiramph.com?subject=${subject}&body=${emailBody}`;
        });
    }

    // ==========================================
    // ACCOUNT SETTINGS LOGIC
    // ==========================================
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm && currentUser) {
        // Pre-fill the form with their current info
        document.getElementById('s-name').value = currentUser.name;
        document.getElementById('s-email').value = currentUser.email;

        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('s-name').value;
            const email = document.getElementById('s-email').value;
            const password = document.getElementById('s-password').value;

            try {
                const res = await fetch(`/api/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();
                
                if (res.ok) {
                    alert('✅ ' + data.message);
                    // Update localStorage with the new name/email
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    // Refresh the page so the header updates if they changed their name
                    window.location.reload();
                } else {
                    alert('❌ Error: ' + data.message);
                }
            } catch (err) {
                console.error("Update error:", err);
                alert("Something went wrong. Please try again.");
            }
        });
    } else if (settingsForm && !currentUser) {
        // Kick them out if they aren't logged in
        alert("Please log in to view your settings.");
        window.location.href = "/login";
    }

    // ==========================================
    // FLATPICKR CALENDAR VISUALS & ADD TO CART
    // ==========================================
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const rentBtn = document.getElementById('rentBtn'); 

    if (startDateInput && endDateInput && rentBtn) {
        const clothingId = rentBtn.dataset.id;
        
        // Fetch booked dates and set up Flatpickr
        fetch(`/api/item/${clothingId}/booked-dates`)
            .then(res => res.json())
            .then(bookedDates => {
                const calendarConfig = {
                    minDate: "today",         
                    disable: bookedDates,     
                    dateFormat: "Y-m-d",      
                };
                
                flatpickr(startDateInput, calendarConfig);
                flatpickr(endDateInput, calendarConfig);
            })
            .catch(err => console.error("Error setting up calendar:", err));

        // Handle Add to Cart Button Click
        rentBtn.addEventListener('click', async function() {
            if (!currentUser) {
                alert('Please log in first to rent an item!');
                window.location.href = '/login';
                return;
            }
            const selectedSizeInput = document.querySelector('input[name="selectedSize"]:checked');
            if (!selectedSizeInput) {
                alert('Please select a size!');
                return;
            }

            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            if (!startDate || !endDate) {
                alert('Please select both a Pickup and Return date!');
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                alert('Return date cannot be before the Pickup date!');
                return;
            }

            const item = {
                clothingId: parseInt(rentBtn.dataset.id),
                name: rentBtn.dataset.name,
                price: rentBtn.dataset.price,
                priceVal: parseFloat(rentBtn.dataset.priceval),
                image: rentBtn.dataset.image,
                size: selectedSizeInput.value, 
                startDate: startDate,
                endDate: endDate
            };

            const res = await fetch('/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, item })
            });

            const data = await res.json();
            if (res.ok) alert('Item added to cart with your selected dates!');
            else alert(data.message);
        });
    }

    // Hide rent section from Admins so they don't accidentally buy their own clothes
    const rentSection = document.getElementById('rent-section');
    if (rentSection && currentUser && currentUser.role === 'admin') {
        rentSection.innerHTML = `<h3 style="color: #ff4444; margin-top: 15px;">Admins cannot rent items.</h3>`;
    }

    // ==========================================
    // INITIALIZE CART AND ADMIN
    // ==========================================
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
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

    const adminContent = document.getElementById('admin-content');
    const accessDenied = document.getElementById('access-denied');
    if (adminContent) {
        if (!currentUser || currentUser.role !== 'admin') {
            accessDenied.style.display = 'block';
        } else {
            adminContent.style.display = 'block';
            loadInventory();
            loadAdminOrders();

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
                const selectedCategories = [...document.querySelectorAll('.cat-check:checked')].map(cb => cb.value);
                if (selectedCategories.length === 0) return alert('Please select at least one category.');

                let selectedSizes = [];
                const footwearCatCheck = document.getElementById('footwear-cat-check');
                if (footwearCatCheck && footwearCatCheck.checked) {
                    const footwearSize = document.getElementById('footwear-size-input').value;
                    if (!footwearSize) return alert('Please enter a footwear size number.');
                    selectedSizes.push(footwearSize);
                } else {
                    selectedSizes = [...document.querySelectorAll('.size-check:checked')].map(cb => cb.value);
                    if (selectedSizes.length === 0) return alert('Please select at least one size.');
                }

                const imageFile = document.getElementById('a-image-file').files[0];
                if (!imageFile) return alert('Please select an image.');

                document.getElementById('image-upload-msg').textContent = 'Uploading image...';
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('/admin/upload-image', { method: 'POST', body: formData });
                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) return alert('Image upload failed: ' + uploadData.message);

                document.getElementById('image-upload-msg').textContent = '✅ Image uploaded!';

                const item = {
                    name: document.getElementById('a-name').value,
                    category: selectedCategories,
                    price: document.getElementById('a-price').value,
                    priceVal: document.getElementById('a-priceval').value,
                    size: selectedSizes,
                    image: uploadData.imagePath,
                    description: document.getElementById('a-description').value
                };

                if (!item.name || !item.price || !item.priceVal || !item.description) return alert('Please fill in all fields.');

                const res = await fetch('/admin/add-item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });

                const data = await res.json();
                if (res.ok) {
                    document.getElementById('add-msg').textContent = '✅ ' + data.message;
                    document.getElementById('image-upload-msg').textContent = '';
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

    // INITIALIZE USER ORDERS
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer) {
        if (!currentUser) {
            ordersContainer.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Please log in to view your orders.</p>`;
        } else {
            loadUserOrders(currentUser.id);
        }
    }

}); // end of domcontentloaded


// ==========================================
// GLOBAL FUNCTIONS (OUTSIDE DOMCONTENTLOADED)
// ==========================================

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
                    <p style="color: #666;"><strong>Dates:</strong> ${item.startDate || 'N/A'} to ${item.endDate || 'N/A'}</p>
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
        <div style="text-align: right; padding: 20px;">
            <p style="font-size: 1.2rem; font-weight: bold;">Total: ₱${total.toLocaleString()}</p>
            <button class="checkout-btn" onclick="checkoutCart()" style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 1.1rem; margin-top: 10px;">Proceed to Checkout</button>
        </div>`;
}

async function removeItem(userId, clothingId) {
    const res = await fetch('/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, clothingId })
    });
    if (res.ok) loadCart(userId); 
}

async function checkoutCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return alert("Please log in to checkout.");
    if (!confirm("Are you ready to proceed with the checkout?")) return;

    try {
        const res = await fetch('/cart/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        const data = await res.json();
        alert(data.message); 
        if (res.ok) window.location.href = '/orders'; 
    } catch (error) {
        console.error("Checkout Error:", error);
        alert("Something went wrong during checkout.");
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

async function loadUserOrders(userId) {
    const res = await fetch(`/api/orders?userId=${userId}`);
    const orders = await res.json();
    const container = document.getElementById('orders-container');

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h3>You haven't rented anything yet!</h3>
                <a href="/marketplace" class="submit-btn" style="text-decoration: none; display: inline-block; margin-top: 15px;">Browse Clothes</a>
            </div>`;
        return;
    }

    container.innerHTML = orders.map(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        const itemsHtml = order.items.map(item => `
            <div style="display: flex; gap: 15px; margin-top: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px;">
                <div>
                    <p style="margin: 0; font-weight: bold; font-size: 1.1rem;">${item.name}</p>
                    <p style="margin: 3px 0; color: #666;">Size: ${item.size}</p>
                    <p style="margin: 3px 0; color: #c8a165;"><strong>Reserved:</strong> ${item.startDate} to ${item.endDate}</p>
                </div>
            </div>
        `).join('');

        return `
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
                <h3 style="margin: 0;">Order Date: ${orderDate}</h3>
                <h3 style="margin: 0; color: #28a745;">Total Paid: ₱${order.totalAmount.toLocaleString()}</h3>
            </div>
            <p>Status: <strong>${order.status || 'Pending'}</strong></p>
            ${itemsHtml}
        </div>
        `;
    }).join('');
}

// ==========================================
// ADMIN ORDERS LOGIC
// ==========================================
async function loadAdminOrders() {
    const adminOrdersList = document.getElementById('admin-orders-list');
    if (!adminOrdersList) return;

    try {
        const res = await fetch('/api/admin/orders');
        const orders = await res.json();
        
        if (orders.length === 0) {
            adminOrdersList.innerHTML = '<p>No orders have been placed yet.</p>';
            return;
        }

        adminOrdersList.innerHTML = orders.map(order => {
            const orderDate = new Date(order.orderDate).toLocaleDateString();
            const customerName = order.userId ? order.userId.name : 'Unknown User';
            const customerEmail = order.userId ? order.userId.email : 'N/A';

            const itemsHtml = order.items.map(item => `
                <div style="font-size: 0.95rem; margin-top: 8px; padding-left: 10px; border-left: 3px solid #c8a165;">
                    <strong>${item.name}</strong> (Size: ${item.size}) <br>
                    <span style="color: #555;">Rent Dates: ${item.startDate} to ${item.endDate}</span>
                </div>
            `).join('');

            return `
            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="margin: 0; color: #333;">Customer: ${customerName}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">${customerEmail} | Ordered: ${orderDate}</p>
                    </div>
                    <div style="text-align: right;">
                        <h3 style="margin: 0; color: #28a745;">₱${order.totalAmount.toLocaleString()}</h3>
                        <div style="margin-top: 10px;">
                            <label style="font-size: 0.85rem; color: #666; margin-right: 5px;">Status:</label>
                            <select onchange="updateOrderStatus('${order._id}', this.value)" style="padding: 6px; border-radius: 4px; border: 1px solid #ccc; font-weight: bold; cursor: pointer;">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Prepared" ${order.status === 'Prepared' ? 'selected' : ''}>Prepared</option>
                                <option value="Picked Up" ${order.status === 'Picked Up' ? 'selected' : ''}>Picked Up</option>
                                <option value="Returned" ${order.status === 'Returned' ? 'selected' : ''}>Returned</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <p style="margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase; font-size: 0.85rem; color: #888;">Rented Items:</p>
                    ${itemsHtml}
                </div>
            </div>
            `;
        }).join('');
    } catch (err) {
        console.error("Error loading admin orders:", err);
        adminOrdersList.innerHTML = '<p style="color: red;">Failed to load orders. Check console.</p>';
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const res = await fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (res.ok) {
            console.log('Order status updated!');
        }
    } catch (err) {
        alert('Failed to update status. Please try again.');
    }
}