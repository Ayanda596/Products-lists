document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalCostElement = document.getElementById('total-cost');
    const checkoutBtn = document.getElementById('checkout-btn');
    const agreeCheckbox = document.getElementById('agree-checkbox');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to render cart items and total cost
    function renderCart() {
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

        const totalCost = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalCostElement.textContent = `Total: R${totalCost.toLocaleString()}`;

        // Enable or disable checkout button based on checkbox state
        checkoutBtn.disabled = !agreeCheckbox.checked;
    }

    // Function to handle item removal from the cart
    function handleRemoveItem(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount(); // Update cart count in navbar
    }

    // Function to show a success message
    function showSuccessMessage() {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successMessage = document.createElement('div');
        successMessage.textContent = 'Purchase successful! Thank you for your order.';
        successMessage.className = 'success-message fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg';
        document.body.appendChild(successMessage);

        // Remove the message after 5 seconds
        setTimeout(() => successMessage.remove(), 5000);
    }

    // Event delegation for removing items from the cart
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
            
            // Clear the cart and update UI
            localStorage.removeItem('cart');
            cart = [];
            renderCart();
            updateCartCount(); // Update cart count in navbar
            showSuccessMessage(); // Show success message
        } else {
            alert('You must agree to the terms and conditions.');
        }
    });

    // Event listener for the agreement checkbox
    agreeCheckbox.addEventListener('change', () => {
        checkoutBtn.disabled = !agreeCheckbox.checked;
    });

    // Initialize cart display
    renderCart();
});
