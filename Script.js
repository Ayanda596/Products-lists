document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Iphone 15", price: 20000, image: "images/R (1).jfif", category: "cellphones", colors: ["Black", "White", "Blue"] },
        { id: 2, name: "Samsung S23", price: 15000, image: "images/purepng.com-samsung-phonesmartphoneandroidgooglephoneapplication-211519339028ghq1u.png", category: "cellphones", colors: ["Black", "White", "Green"] },
        { id: 3, name: "Iphone 8", price: 24000, image: "images/OIP (2).jfif", category: "cellphones", colors: ["Silver", "Gold", "Rose Gold"] },
        { id: 4, name: "Iphone14", price: 14000, image: "images/31d23744-3a9f-4bc6-88cd-bda390bab17e.9b9212a7dd5d6be8175ff3645610dce4.webp", category: "cellphones", colors: ["Black", "Purple", "Red"] },
        { id: 5, name: "Arsenal new-kit", price: 700, image: "images/OIP (4).jfif", category: "jerseys" },
        { id: 6, name: "Mancity kit 2018-19", price: 600, image: "images/OIP (5).jfif", category: "jerseys" },
        { id: 7, name: "Manchester United kit", price: 700, image: "images/OIP (7).jfif", category: "jerseys" },
        { id: 8, name: "Mancity new kit", price: 800, image: "images/OIP (6).jfif", category: "jerseys" },
        { id: 9, name: "VW Polo R line", price: 2000000, image: "images/095_golf_tcr.webp", category: "cars", colors: ["Red", "Black", "White"] },
        { id: 10, name: "Ford Mustang", price: 5000000, image: "images/OIP (10).jfif", category: "cars", colors: ["Yellow", "Blue", "Black"] },
        { id: 11, name: "Tesla Model S", price: 8000000, image: "images/ertrewtre.jpg", category: "cars", colors: ["White", "Black", "Silver"] }
    ];

    let selectedCategory = 'all'; // Default category to show all products

    // Function to render products
    function renderProducts(productsList) {
        const productContainer = document.getElementById('products');
        productContainer.innerHTML = productsList.map(product => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(item => item.id === product.id);
            const quantity = existingProduct ? existingProduct.quantity : 0;

            // Generate color options if available
            const colorOptions = product.colors ? `
                <div class="mb-2">
                    <label class="block text-gray-700">Color:</label>
                    <select class="color-select bg-gray-100 border border-gray-300 rounded px-2 py-1 w-full" data-id="${product.id}">
                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                    </select>
                </div>
            ` : '';

            return `
                <div class="bg-white p-4 rounded shadow">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover mb-2">
                    <h2 class="text-lg font-semibold">${product.name}</h2>
                    <p class="text-gray-600">R${product.price.toLocaleString()}</p>
                    ${colorOptions}
                    <button class="add-to-cart mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                    <p class="mt-2 text-gray-600">In Cart: ${quantity}</p>
                </div>
            `;
        }).join('');
    }

    // Function to filter products
    function filterProducts() {
        const searchQuery = document.getElementById('search').value.toLowerCase();
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

        const filteredProducts = products.filter(product => {
            const inCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery);

            return inCategory && inPriceRange && matchesSearch;
        });

        renderProducts(filteredProducts);
    }

    // Event listeners for category buttons
    document.querySelectorAll('.category-tab').forEach(button => {
        button.addEventListener('click', () => {
            selectedCategory = button.dataset.category;
            filterProducts();
        });
    });

    // Event listeners for filters
    document.getElementById('search').addEventListener('input', filterProducts);
    document.getElementById('min-price').addEventListener('input', filterProducts);
    document.getElementById('max-price').addEventListener('input', filterProducts);

    // Event listener for adding items to cart
    document.getElementById('products').addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart')) {
            const id = parseInt(event.target.dataset.id, 10);
            const name = event.target.dataset.name;
            const price = parseFloat(event.target.dataset.price);

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(item => item.id === id);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            document.getElementById('cart-count').innerText = cart.reduce((total, item) => total + item.quantity, 0);
            filterProducts(); // Update the product listing after adding to cart
        }
    });

    // Initial render
    renderProducts(products);
});
