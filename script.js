// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.cartItems = [];
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartIcon = document.getElementById('cartIcon');
        this.closeCart = document.getElementById('closeCart');
        this.cartItemsContainer = document.getElementById('cartItems');
        this.cartCount = document.getElementById('cartCount');
        this.cartTotal = document.getElementById('cartTotal');
        this.orderNowBtn = document.getElementById('orderNowBtn');
        
        this.init();
    }

    init() {
        // Load cart from localStorage
        this.loadCart();
        
        // Event listeners
        this.cartIcon.addEventListener('click', () => this.toggleCart());
        this.closeCart.addEventListener('click', () => this.toggleCart());
        this.orderNowBtn.addEventListener('click', () => this.orderViaWhatsApp());
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                this.addToCart(productCard);
            });
        });

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterProducts(e.target);
            });
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.cartSidebar.classList.contains('open') && 
                !this.cartSidebar.contains(e.target) && 
                !this.cartIcon.contains(e.target)) {
                this.toggleCart();
            }
        });

        // Dashboard link click handlers
        document.querySelectorAll('.dashboard-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.dashboard-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to section
                const section = link.textContent.toLowerCase();
                if (section === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (section === 'products') {
                    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
                } else if (section === 'about') {
                    document.querySelector('.about-section').scrollIntoView({ behavior: 'smooth' });
                } else if (section === 'contact') {
                    document.querySelector('.contact-section').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    toggleCart() {
        this.cartSidebar.classList.toggle('open');
    }

    addToCart(productCard) {
        const id = productCard.dataset.id;
        const name = productCard.dataset.name;
        const price = parseInt(productCard.dataset.price);
        const image = productCard.dataset.image;
        
        const existingItem = this.cartItems.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${name} added to cart!`);
    }

    removeFromCart(id) {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        // Update cart count
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        // Update cart items
        this.cartItemsContainer.innerHTML = '';
        
        if (this.cartItems.length === 0) {
            this.cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            this.cartTotal.textContent = 'Rs. 0';
            return;
        }
        
        let total = 0;
        
        this.cartItems.forEach(item => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rs. ${item.price.toLocaleString()} x ${item.quantity}</div>
                </div>
                <i class="fas fa-trash cart-item-remove" data-id="${item.id}"></i>
            `;
            
            this.cartItemsContainer.appendChild(cartItem);
        });
        
        // Add remove event listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.removeFromCart(id);
            });
        });
        
        this.cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
    }

    orderViaWhatsApp() {
        if (this.cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        let message = 'Hello RENU DESIGN CHOICE,%0A%0AI would like to order the following items:%0A%0A';
        
        this.cartItems.forEach(item => {
            message += `• ${item.name} - Rs. ${item.price.toLocaleString()} x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}%0A`;
        });
        
        const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `%0A*Total Amount: Rs. ${total.toLocaleString()}*%0A%0A`;
        message += `Please confirm my order and provide payment details.%0A%0A`;
        message += `Thank you!`;
        
        window.open(`https://wa.me/94760218766?text=${message}`, '_blank');
    }

    filterProducts(btn) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        
        document.querySelectorAll('.product-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #8B5A2B, #C19A6B);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(44, 24, 16, 0.1);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
            this.updateCartDisplay();
        }
    }
}

// Initialize the shopping cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});