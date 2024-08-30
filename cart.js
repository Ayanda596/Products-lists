document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const cartItemsContainer = document.getElementById('cart-items'); // Container for cart items
    const totalCostElement = document.getElementById('total-cost'); // Element to display total cost
    const checkoutBtn = document.getElementById('checkout-btn'); // Checkout button
    const agreeCheckbox = document.getElementById('agree-checkbox'); // Agreement checkbox
    const cartCountElement = document.getElementById('cart-count'); // Cart count in the navbar
    
    // Load the cart from localStorage or initialize as an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to render cart items and update total cost
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-600">Your cart is empty.</p>';
            totalCostElement.textContent = 'Total: R0';
            cartCountElement.textContent = '(0)';
            return; 
        }

        // Create HTML for each cart item and add it to the container
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item flex justify-between items-center mb-2">
                <div>
                    <h2 class="text-lg font-semibold">${item.name}</h2>
                    <p class="text-gray-600">R${item.price.toLocaleString()} x ${item.quantity}</p>
                    <p class="text-gray-600">Color: ${item.color}</p>
                </div>
                <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-id="${item.id}">Remove</button>
            </div>
        `).join(''); // The `join` method concatenates the array of HTML strings into one string

        // Calculate the total cost of items in the cart
        const totalCost = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        // Update the total cost element with the calculated total
        totalCostElement.textContent = `Total: R${totalCost.toLocaleString()}`;

        // Update the cart count in the navbar
        updateCartCount();

        // Enable or disable the checkout button based on whether the checkbox is checked
        checkoutBtn.disabled = !agreeCheckbox.checked;
    }

    // Function to handle removing an item from the cart
    function handleRemoveItem(id) {
        console.log("Removing item with id:", id); 
        const originalCartLength = cart.length;  
        cart = cart.filter(item => item.id !== id);
        console.log("Cart length before removal:", originalCartLength, "and after removal:", cart.length);  
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Event listener to handle clicks on the "Remove" button
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {

            const productId = event.target.dataset.id;
            console.log("Clicked remove on product with id:", productId); 
            handleRemoveItem(productId);
        }
    });

    // Event listener for the checkout button
    checkoutBtn.addEventListener('click', () => {
        if (agreeCheckbox.checked) { // Check if the agreement checkbox is checked
            alert('Purchasing successfully!');
            
            localStorage.removeItem('cart');
            cart = [];
            
            renderCart();
            
            showSuccessMessage();
        } else {
            alert('You must agree to the terms and conditions.');
        }
    });

    // Event listener for changes to the agreement checkbox
    agreeCheckbox.addEventListener('change', () => {
        checkoutBtn.hidden = !agreeCheckbox.checked;
        checkoutBtn.disabled = !agreeCheckbox.checked;
    });

    // Function to update the cart count in the navbar
    function updateCartCount() {
        
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElement.textContent = `(${cartCount})`;
    }

    // Function to show a success message after purchase
    function showSuccessMessage() {
        
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create and display a new success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Purchase successful! Thank you for your order.';
        successMessage.className = 'success-message fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg';
        document.body.appendChild(successMessage);
        // Automatically remove the message after 5 seconds
        setTimeout(() => successMessage.remove(), 5000);
    }

    // Initialize the cart display when the page loads
    renderCart();
});
