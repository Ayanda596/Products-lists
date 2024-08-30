document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const cartItemsContainer = document.getElementById('cart-items');
    const totalCostElement = document.getElementById('total-cost');
    const checkoutBtn = document.getElementById('checkout-btn');
    const agreeCheckbox = document.getElementById('agree-checkbox');
    const cartCountElement = document.getElementById('cart-count');

    // Load cart from localStorage or initialize an empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to render cart items and update total cost
    function renderCart() {
        // Clear the cart items container
        cartItemsContainer.innerHTML = '';

        // Check if the cart is empty
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-600">Your cart is empty.</p>';
            totalCostElement.textContent = 'Total: R0';
            cartCountElement.textContent = '(0)';
            return;
        }

        // Create HTML for each cart item and add them to the container
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item flex justify-between items-center mb-2">
                <div>
                    <h2 class="text-lg font-semibold">${item.name}</h2>
                    <p class="text-gray-600">R${item.price.toLocaleString()} x ${item.quantity}</p>
                    <p class="text-gray-600">Color: ${item.color}</p>
                </div>
                <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-id="${item.id}">Remove</button>
            </div>
        `).join('');

        // Calculate total cost and update the total cost element
        const totalCost = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalCostElement.textContent = `Total: R${totalCost.toLocaleString()}`;

        // Update cart count in the navbar
        updateCartCount();

        // Enable or disable checkout button based on checkbox state
        checkoutBtn.disabled = !agreeCheckbox.checked;
    }

    // Function to handle removing an item from the cart
    function handleRemoveItem(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Function to show a success message after purchase
    function showSuccessMessage() {
        // Remove any existing success message
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create and show the new success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Purchase successful! Thank you for your order.';
        successMessage.className = 'success-message fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg';
        document.body.appendChild(successMessage);

        // Remove the message after 5 seconds
        setTimeout(() => successMessage.remove(), 5000);
    }

    // Event delegation for handling clicks on the "Remove" button
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const productId = event.target.dataset.id;
            handleRemoveItem(productId);
        }
    });

    // Event listener for the checkout button
    checkoutBtn.addEventListener('click', () => {
        if (agreeCheckbox.checked) {
            // Proceed with checkout
            alert('Purchasing successfully!');
            
            // Clear the cart and update the UI
            localStorage.removeItem('cart');
            cart = [];
            renderCart();
            showSuccessMessage(); // Show success message
        } else {
            alert('You must agree to the terms and conditions.');
        }
    });

    // Event listener for the agreement checkbox
    agreeCheckbox.addEventListener('change', () => {
        checkoutBtn.disabled = !agreeCheckbox.checked;
    });

    // Function to update cart count in navbar
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = `(${cartCount})`;
    }

    // Initialize cart display
    renderCart();
});
