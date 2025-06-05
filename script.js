const products = [
    { id: 1, name: "Turmeric Powder", price: 399, image: "images/turmericpowder.jpg"},
    { id: 2, name: "Neem Face Cleanser", price: 699, image: "images/neemfacewash.jpg"},
    { id: 3, name: "Ashwagandha Powder", price: 899, image: "images/ashwagandha.jpg"},
    { id: 4, name: "Chyawanprash", price: 1249, image: "images/Chyawanprash.jpg"},
    { id: 5, name: "Gotu Kola Tablets", price: 499, image: "images/gotukola.jpg"},
    { id: 6, name: "Aloe Vera Gel", price: 249, image: "images/aloeveragel.jpg"},
    { id: 7, name: "Rosewater", price: 249, image: "images/rosewater.jpg"},
    { id: 8, name: "Triphala Powder", price: 879, image: "images/triphala.jpg"}

];

// Global variables
let cart = [];
let isLoggedIn = false;
let mainSiteHTML = '';

// Check login status on page load
function checkLogin() {
    const user = localStorage.getItem('user');
    if (user) {
        isLoggedIn = true;
        showMainSite();
    } else {
        showAuthPage();
    }
}

// Show/hide pages
function showAuthPage() {
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('mainWebsite').classList.add('hidden');
}

function showMainSite() {
    document.getElementById('authContainer').classList.add('hidden');
    const main = document.getElementById('mainWebsite');
    main.classList.remove('hidden');
    mainSiteHTML = main.innerHTML; 
    loadProducts();
    updateCartCount();
    renderProductDropdown();
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    
    if (storedUser && storedUser.email === email && storedUser.password === password) {
        localStorage.setItem('user', email);
        isLoggedIn = true;
        showMainSite();
    } else {
        showCustomAlert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
            const userData = { email, password };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('user', email);
            isLoggedIn = true;
            showMainSite();
        } else {
            showCustomAlert('Passwords do not match');
        }
    } else {
        showCustomAlert('Please fill all fields');
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Product functions
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.id = `product-${product.id}`;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}
function renderProductDropdown() {
    const dropdown = document.getElementById('productDropdown');
    dropdown.innerHTML = ''; // clear previous

    products.forEach(product => {
        const link = document.createElement('a');
        link.href = `#product-${product.id}`;
        link.textContent = product.name;
        dropdown.appendChild(link);
    });

    document.getElementById('menuToggle').addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', function (event) {
        const isClickInside = document.getElementById('menuToggle').contains(event.target) ||
                              dropdown.contains(event.target);
        if (!isClickInside) {
            dropdown.classList.add('hidden');
        }
    });
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showCustomAlert(product.name + ' added to cart!');
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function showCart() {
    if (cart.length === 0) {
        showCustomAlert('Your cart is empty!');
        goHome();
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let cartHTML = '<div class="page-container"><div class="page-content"><h2 class="page-title">Your Cart</h2>';
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                <div>
                    <span>₹${item.price * item.quantity}</span>
                    <button class="btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>`;
    });
    
    cartHTML += `
        <h3>Total: ₹${total}</h3>
        <h3>Payment Method</h3>
        <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <input type="radio" name="paymentMethod" id="codOption">
            <span>Cash on Delivery (COD)</span>
        </label>
        <h3>Delivery Address</h3>
        <input type="text" id="customerName" placeholder="Full Name" class="form-input" required>
        <input type="tel" id="customerPhone" placeholder="Phone Number" class="form-input" required>
        <textarea id="customerAddress" placeholder="Full Address" class="form-input" required style="height: 80px;"></textarea>
        <input type="text" id="customerCity" placeholder="City" class="form-input" required>
        <input type="text" id="customerPincode" placeholder="PIN Code" class="form-input" required>
        <button class="btn btn-secondary" onclick="goHome()">Back to Shop</button>
        <button class="btn" onclick="placeOrder()">Place Order</button>
    </div></div>`;

    document.getElementById('mainWebsite').innerHTML = cartHTML;
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    

}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        if (cart.length === 0) {
            showCustomAlert('Your cart is empty!');
            goHome();  
        } else {
            showCart(); 
        }
    }
}

function placeOrder() {
    const codSelected = document.getElementById('codOption').checked;
    if (!codSelected) {
        showCustomAlert('Please select a payment method: Cash on Delivery');
        return;
    }
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const city = document.getElementById('customerCity').value;
    const pincode = document.getElementById('customerPincode').value;

    if (!name || !phone || !address || !city || !pincode) {
        showCustomAlert('Please fill all address fields');
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        showCustomAlert('Phone number must be exactly 10 digits');
        return;
    }

    if (!/^\d{6}$/.test(pincode)) {
        showCustomAlert('PIN code must be exactly 6 digits');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'PA' + Date.now();
    cart = [];
    showOrderConfirmation(orderId, total, { name, phone, address, city, pincode });
}

function showOrderConfirmation(orderId, total, address) {
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `
        <div class="order-container">
            <div class="order-card">
                <div class="success-icon">✓</div>
                <h2 style="color: #4a6b69; margin-bottom: 10px;">Order Confirmed!</h2>
                <p style="margin-bottom: 20px;">Thank you for choosing Ayuzen</p>
                <div style="background: #f8fffe; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Total:</strong> ₹${total}</p>
                    <p><strong>Delivery:</strong> 3-5 business days</p>
                </div>
                <div style="background: #f8fffe; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: left;">
                    <h4>Delivery Address:</h4>
                    <p>${address.name}<br>${address.phone}<br>${address.address}<br>${address.city}, ${address.pincode}</p>
                </div>
                <button class="btn" onclick="goHome()">Continue Shopping</button>
            </div>
        </div>`;
}

function goHome() {
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `<div id="mainWebsite">${mainSiteHTML}</div>`;
    updateCartCount();  
    loadProducts();
    renderProductDropdown();     
    document.getElementById('cartBtn').addEventListener('click', showCart);
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('user');
            isLoggedIn = false;
            showAuthPage();
        });
    }
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            nav.classList.remove('show'); 
        });
    });
}



function showCustomAlert(message) {
  const alertBox = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');

  if (!alertBox || !alertMessage) return;

  alertMessage.textContent = message;
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 3000);
}


// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    
    // Auth form listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });
    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
    
    // Cart button listener
    document.getElementById('cartBtn').addEventListener('click', showCart);

    // Logout button listener
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('user');
        isLoggedIn = false;
        showAuthPage();
    });
    // Input restrictions for phone and pincode
    document.getElementById('customerPhone').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    document.getElementById('customerPincode').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
});