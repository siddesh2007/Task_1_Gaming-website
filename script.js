// ================================================
// GAMING E-COMMERCE WEBSITE - JAVASCRIPT
// Interactive functionality for the gaming store
// ================================================

// ========== Game Data ========== 
const games = [
    {
        id: 1,
        title: "Grand Theft Auto V (GTA V)",
        genre: "Action",
        price: 59.99,
        image: "image/GTA.jpg",
        description: "Experience the ultimate open-world crime adventure. Explore a vast metropolis with limitless possibilities and engaging storylines.",
        rating: 4.8
    },
    {
        id: 2,
        title: "Red Dead Redemption 2",
        genre: "RPG",
        price: 49.99,
        image: "image/rdr.jpg",
        description: "Experience an epic tale of outlaw life in the wild west. Immerse yourself in a rich narrative with stunning landscapes and deep gameplay.",
        rating: 4.9
    },
    {
        id: 3,
        title: "Assassin's Creed Valhalla",
        genre: "Action",
        price: 70.00,
        image: "image/assainn creed 1.jpg",
        description: "Become a legendary Viking warrior. Explore mythical lands and engage in epic battles with unmatched combat systems.",
        rating: 4.7
    },
    {
        id: 4,
        title: "Assassin's Creed Mirage",
        genre: "Action",
        price: 81.22,
        image: "image/assaisan creed 2.jpg",
        description: "Return to the golden age of assassins in Baghdad. Master stealth and parkour in this thrilling action-adventure.",
        rating: 4.6
    },
    {
        id: 5,
        title: "Tomb Raider (Reboot Series)",
        genre: "Action",
        price: 40.00,
        image: "image/tomb raider.jpg",
        description: "Follow Lara Croft on her journey of discovery and survival. Face deadly puzzles and thrilling combat across ancient tombs.",
        rating: 4.8
    },
    {
        id: 6,
        title: "Far Cry 5",
        genre: "Action",
        price: 59.99,
        image: "image/far cry 5.jpg",
        description: "Embark on a wild adventure in a dangerous cult-controlled region. Unleash chaos and liberate the land with explosive gameplay.",
        rating: 4.7
    },
    {
        id: 7,
        title: "Far Cry 6",
        genre: "Action",
        price: 59.99,
        image: "image/Far cry 6.jpg",
        description: "Fight for freedom in a tropical paradise turned into a dictatorship. Experience next-gen graphics and intense action.",
        rating: 4.6
    },
    {
        id: 8,
        title: "Watch Dogs Legion",
        genre: "Action",
        price: 99.90,
        image: "image/watch dogs.jpg",
        description: "Lead a resistance movement in a high-tech London. Recruit diverse operatives and take down a corrupt surveillance state.",
        rating: 4.5
    }
];

// ========== State Management ========== 
let cart = [];
let currentFilter = 'all';
let currentSearchTerm = '';
let currentGameForModal = null;

// ========== DOM Elements ========== 
const gamesGrid = document.getElementById('games-grid');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const gameModal = document.getElementById('game-modal');
const loginModal = document.getElementById('login-modal');
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const loginBtn = document.querySelector('.login-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const placeOrderBtn = document.getElementById('place-order-btn');
const loader = document.getElementById('loader');

// ========== Initialize Application ========== 
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    renderGames();
    updateCartUI();
    initializeEventListeners();
});

// ========== Event Listeners ========== 
function initializeEventListeners() {
    // Modal close button
    closeModalBtn.addEventListener('click', closeGameModal);
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) closeGameModal();
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        renderGames();
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGames();
        });
    });

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Login button
    loginBtn.addEventListener('click', openLoginModal);

    // Checkout button
    checkoutBtn.addEventListener('click', proceedToCheckout);

    // Place order button
    placeOrderBtn.addEventListener('click', placeOrder);

    // Smooth scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#login' && href !== '#checkout') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Remove loader after page load
    setTimeout(() => {
        loader.style.display = 'none';
    }, 2000);
}

// ========== Render Games ========== 
function renderGames() {
    // Filter games based on current filter and search term
    const filteredGames = games.filter(game => {
        const matchesFilter = currentFilter === 'all' || game.genre.toLowerCase() === currentFilter;
        const matchesSearch = game.title.toLowerCase().includes(currentSearchTerm);
        return matchesFilter && matchesSearch;
    });

    // Clear the grid
    gamesGrid.innerHTML = '';

    // Render each game
    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });

    // Show no results message if needed
    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No games found matching your criteria.</div>';
    }
}

// ========== Create Game Card ========== 
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${game.image}" alt="${game.title}" class="game-image">
            <div class="game-overlay">
                <button class="quick-view-btn" onclick="openGameModal(${game.id})">Quick View</button>
            </div>
        </div>
        <div class="game-info">
            <p class="game-genre">${game.genre}</p>
            <h3 class="game-title">${game.title}</h3>
            <p class="game-price">$${game.price.toFixed(2)}</p>
            <button class="buy-btn" onclick="addToCart(${game.id})">Add to Cart</button>
        </div>
    `;
    return card;
}

// ========== Game Modal Functions ========== 
function openGameModal(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    currentGameForModal = game;
    document.getElementById('modal-game-image').src = game.image;
    document.getElementById('modal-game-title').textContent = game.title;
    document.getElementById('modal-game-genre').textContent = game.genre;
    document.getElementById('modal-game-description').textContent = game.description;
    document.getElementById('modal-game-rating').textContent = `⭐ ${game.rating}/5`;
    document.getElementById('modal-game-price').textContent = `$${game.price.toFixed(2)}`;

    const modalAddBtn = document.getElementById('modal-add-to-cart');
    modalAddBtn.onclick = () => {
        addToCart(gameId);
        closeGameModal();
        showNotification(`${game.title} added to cart!`);
    };

    gameModal.classList.add('show');
}

function closeGameModal() {
    gameModal.classList.remove('show');
    currentGameForModal = null;
}

// ========== Cart Functions ========== 
function addToCart(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    const existingItem = cart.find(item => item.id === gameId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: game.id,
            title: game.title,
            price: game.price,
            image: game.image,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    updateCartUI();
    showNotification(`${game.title} added to cart!`);
}

function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    saveCartToLocalStorage();
    updateCartUI();
}

function updateCartUI() {
    // Update cart count in navbar
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Render cart items
    renderCartItems();

    // Update totals
    updateCartTotals();
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some games to get started!</p>
            </div>
        `;
        return;
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Update review total in checkout
    updateOrderReview(total);
}

function updateOrderReview(total) {
    const reviewItemsContainer = document.getElementById('order-review-items');
    const reviewTotal = document.getElementById('review-total');

    reviewItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <span>${item.title} (x${item.quantity})</span>
            <span>$${itemTotal}</span>
        `;
        reviewItemsContainer.appendChild(reviewItem);
    });

    reviewTotal.textContent = `$${total.toFixed(2)}`;
}

// ========== Local Storage Functions ========== 
function saveCartToLocalStorage() {
    localStorage.setItem('gameversecart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('gameversecart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ========== Checkout Functions ========== 
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Add games to your cart first!', 'error');
        return;
    }

    // Scroll to checkout section
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function placeOrder(e) {
    e.preventDefault();

    // Validate form
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!fullName || !email || !address || !city || !zip || !cardName || !cardNumber || !expiry || !cvv) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }

    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email!', 'error');
        return;
    }

    // Validate card number (basic check)
    if (cardNumber.replace(/\s/g, '').length < 13) {
        showNotification('Please enter a valid card number!', 'error');
        return;
    }

    // Validate expiry
    if (!isValidExpiry(expiry)) {
        showNotification('Please enter a valid expiry date (MM/YY)!', 'error');
        return;
    }

    // Validate CVV
    if (cvv.length < 3) {
        showNotification('Please enter a valid CVV!', 'error');
        return;
    }

    // If all validation passes, show success modal
    showSuccessModal('Order Placed Successfully!', 'Your games will be available for download within 24 hours. Thank you for your purchase!');

    // Clear cart after successful order
    setTimeout(() => {
        cart = [];
        saveCartToLocalStorage();
        updateCartUI();
        resetCheckoutForm();
    }, 1500);
}

function resetCheckoutForm() {
    document.getElementById('full-name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('zip').value = '';
    document.getElementById('card-name').value = '';
    document.getElementById('card-number').value = '';
    document.getElementById('expiry').value = '';
    document.getElementById('cvv').value = '';
}

// ========== Form Validation Functions ========== 
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidExpiry(expiry) {
    const expiryRegex = /^\d{2}\/\d{2}$/;
    return expiryRegex.test(expiry);
}

// ========== Login Functions ========== 
function openLoginModal() {
    loginModal.classList.add('show');
}

function closeLoginModal() {
    loginModal.classList.remove('show');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
        showNotification(`Welcome back, ${email}!`);
        closeLoginModal();
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } else {
        showNotification('Please fill in all fields!', 'error');
    }
}

function toggleSignup() {
    showNotification('Sign up feature coming soon!');
}

// ========== Success Modal Functions ========== 
function showSuccessModal(title, message) {
    document.getElementById('success-title').textContent = title;
    document.getElementById('success-message').textContent = message;
    successModal.classList.add('show');
}

function closeSuccessModal() {
    successModal.classList.remove('show');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== Notification System ========== 
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== CSS Animations for Notifications ========== 
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== Format Card Number ========== 
document.getElementById('card-number')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = formatted;
});

// ========== Format Expiry Date ========== 
document.getElementById('expiry')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// ========== Format CVV ========== 
document.getElementById('cvv')?.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// ========== Close modals when clicking outside ========== 
window.addEventListener('click', (e) => {
    if (e.target === gameModal) closeGameModal();
    if (e.target === loginModal) closeLoginModal();
    if (e.target === successModal) closeSuccessModal();
});

// ========== Close login modal ========== 
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn')) {
        if (e.target.closest('#login-modal')) closeLoginModal();
        if (e.target.closest('#game-modal')) closeGameModal();
    }
});
