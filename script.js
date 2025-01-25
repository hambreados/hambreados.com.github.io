let cart = {}; // Objeto para guardar productos (nombre y cantidad)
let cartTotal = 0;

// Cargar el carrito al iniciar la página
window.onload = function () {
    loadCart();
    loadPurchasedItems(); // Cargar los productos comprados en la otra página
};

// Añadir producto al carrito
function addToCart(button) {
    const price = parseFloat(button.getAttribute('data-price'));
    const productName = button.closest('.product').querySelector('h2').innerText;

    // Validar que el precio es correcto
    if (isNaN(price) || price <= 0) {
        alert('Hubo un error al añadir este producto. Intenta de nuevo.');
        return;
    }

    // Actualizar carrito
    if (!cart[productName]) {
        cart[productName] = { quantity: 1, price: price };
    } else {
        cart[productName].quantity++;
    }
    cartTotal += price;

    // Guardar en localStorage y actualizar el DOM
    saveCart();
    updateCartDisplay();
}

// Cargar el carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    const savedTotal = localStorage.getItem('cartTotal');

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    if (savedTotal) {
        cartTotal = parseFloat(savedTotal);
    }

    updateCartDisplay();
}

// Guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', cartTotal.toFixed(2));
}

// Actualizar la visualización del carrito
function updateCartDisplay() {
    const cartCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('cart-total').innerText = cartTotal.toFixed(2);
}

// Función para obtener vista previa del carrito (para la página "Ordenar")
function getCartPreview() {
    const preview = Object.entries(cart)
        .map(([productName, { quantity }]) => `${productName} x${quantity}`)
        .join('<br>');
    return preview || 'Tu carrito está vacío.';
}

// Función para vaciar el carrito (simular compra) y guardar los productos comprados
function clearCart() {
    // Guardamos los productos antes de vaciar el carrito
    const purchasedItems = JSON.stringify(cart);

    // Guardar en localStorage
    localStorage.setItem('purchasedItems', purchasedItems);

    // Vaciar el carrito
    cart = {};
    cartTotal = 0;

    // Actualizamos el carrito en el DOM y guardamos en localStorage
    saveCart();
    updateCartDisplay();
}

// Función para cargar los productos comprados desde localStorage
function loadPurchasedItems() {
    const purchasedItems = localStorage.getItem('purchasedItems');

    if (purchasedItems) {
        const cartData = JSON.parse(purchasedItems);
        let preview = 'Compraste: ';

        // Mostrar los productos y cantidades
        preview += Object.entries(cartData)
            .map(([productName, { quantity }]) => `${productName} x${quantity}`)
            .join(', ');

        document.getElementById('purchased-items').innerText = preview;
    } else {
        document.getElementById('purchased-items').innerText = 'Aún no has comprado nada.';
    }
}