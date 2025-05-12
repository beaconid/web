const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const popup = document.getElementById('cart-popup');

// Add item to cart animation
function showPopup() {
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

// Format price to Indonesian Rupiah
function formatRupiah(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// Update cart display
function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
    cartItemsContainer.innerHTML = "";
    
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Keranjang belanja kamu kosong</div>';
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        ${item.name} (x${item.qty}) - Rp ${formatRupiah(item.price * item.qty)}
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="changeQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                        <button onclick="changeQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                        <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
        });
    }
    
    cartTotal.textContent = `Rp ${formatRupiah(total)}`;
}

// Change quantity of cart item
function changeQty(index, amount) {
    cart[index].qty += amount;
    
    // Add animation effect when changing quantity
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems[index].style.transition = 'background-color 0.3s ease';
    cartItems[index].style.backgroundColor = '#3a3a3a';
    
    setTimeout(() => {
        cartItems[index].style.backgroundColor = '#2b2b2b';
    }, 300);
    
    if (cart[index].qty <= 0) {
        // Animation for removing item
        cartItems[index].style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        cartItems[index].style.opacity = '0';
        cartItems[index].style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            cart.splice(index, 1);
            updateCart();
        }, 300);
    } else {
        updateCart();
    }
}

// Remove item from cart
function removeItem(index) {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems[index].style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    cartItems[index].style.opacity = '0';
    cartItems[index].style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        cart.splice(index, 1);
        updateCart();
    }, 300);
}

// Add to cart button animation and functionality
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Button animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        // Add to cart logic
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const existing = cart.find(p => p.name === name);
        
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }
        
        updateCart();
        showPopup();
    });
});

// Toggle cart modal
cartIcon.addEventListener('click', () => {
    cartModal.classList.toggle('show');
    // Add shake animation to cart icon
    cartIcon.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        cartIcon.style.animation = '';
    }, 500);
});

// Close cart modal
document.getElementById('closeCart').addEventListener('click', () => {
    cartModal.classList.remove('show');
});

// Checkout via WhatsApp
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Keranjang belanja kamu kosong!");
        return;
    }
    
    let message = "Halo, saya ingin memesan:%0A";
    cart.forEach(item => {
        message += `- ${item.name} x${item.qty} (Rp ${formatRupiah(item.price * item.qty)})%0A`;
    });
    
    const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
    message += `%0ATotal: Rp ${formatRupiah(total)}`;
    
    window.open(`https://wa.me/6287888261769?text=${message}`, '_blank');
});

// Add CSS animation keyframes
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(10deg); }
    50% { transform: rotate(0eg); }
    75% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); }
}
`;
document.head.appendChild(style);

// Initialize cart on page load
updateCart();

