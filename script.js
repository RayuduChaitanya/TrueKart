document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    let state = {
        products: [],
        users: [],
        currentUser: null, // { id, name, email }
        cart: [], // [{...product, quantity: 1}]
        currentPage: 'home',
        currentPageData: null,
        // Stores the last product list view (home, category, or search) to enable the back button
        lastProductListPage: { page: 'home', data: null }, 
    };

    // --- MOCK DATA ---
    const getMockProducts = () => [
        { id: 1, name: 'Apple iPhone 14 Pro', category: 'Mobiles', price: 129900, rating: 4.7, reviews: 8500, image: 'https://placehold.co/400x400/3B82F6/FFFFFF?text=iPhone+14+Pro', description: 'A magical new way to interact with iPhone. Groundbreaking safety features designed to save lives. An innovative 48MP camera for mind-blowing detail.', specs: ['A16 Bionic Chip', '6.1-inch Super Retina XDR display', 'Pro camera system'] },
        { id: 7, name: 'Samsung Galaxy S23 Ultra', category: 'Mobiles', price: 124999, rating: 4.8, reviews: 9500, image: 'https://placehold.co/400x400/1F2937/FFFFFF?text=Galaxy+S23', description: 'The epic standard in mobile. With the fastest mobile processor and an incredible camera system.', specs: ['Snapdragon 8 Gen 2 for Galaxy', '200MP Main Camera', 'Built-in S Pen'] },
        { id: 8, name: 'OnePlus 11 5G', category: 'Mobiles', price: 56999, rating: 4.6, reviews: 7800, image: 'https://placehold.co/400x400/DC2626/FFFFFF?text=OnePlus+11', description: 'The Shape of Power. Experience the power of a flagship processor with up to 16GB of RAM.', specs: ['Snapdragon 8 Gen 2', '3rd Gen Hasselblad Camera', '120 Hz Super Fluid AMOLED'] },
        { id: 11, name: 'Google Pixel 7 Pro', category: 'Mobiles', price: 84999, rating: 4.7, reviews: 6500, image: 'https://placehold.co/400x400/7C3AED/FFFFFF?text=Pixel+7+Pro', description: 'The all-pro Google phone. Powered by Google Tensor G2, it\'s fast and secure, with an amazing battery and camera.', specs: ['Google Tensor G2', '6.7-inch LTPO QHD+ display', '5x telephoto lens'] },
        { id: 2, name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', price: 29990, rating: 4.8, reviews: 12450, image: 'https://placehold.co/400x400/10B981/FFFFFF?text=Sony+Headphones', description: 'Our best ever noise cancelling just got better. Superlative sound for a truly remarkable listening experience.', specs: ['Industry-leading noise cancellation', '30-hour battery life', 'Crystal clear hands-free calling'] },
        { id: 3, name: 'Nike Air Max 270', category: 'Fashion', price: 12995, rating: 4.5, reviews: 15200, image: 'https://placehold.co/400x400/F59E0B/FFFFFF?text=Nike+Air+Max', description: 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude. Showcasing Nike\'s greatest innovation.', specs: ['Large volume Max Air unit', 'Knit fabric on the upper', 'Foam midsole'] },
        { id: 6, name: 'Adidas Ultraboost 22', category: 'Fashion', price: 17999, rating: 4.7, reviews: 9800, image: 'https://placehold.co/400x400/0EA5E9/FFFFFF?text=Adidas+Shoes', description: 'Experience epic energy with the new Ultraboost 22. The 360° fit improvement gives you a more responsive ride.', specs: ['BOOST midsole', 'Linear Energy Push system', 'Made with Parley Ocean Plastic'] },
        { id: 9, name: 'L\'Oréal Paris Revitalift Serum', category: 'Beauty', price: 799, rating: 4.5, reviews: 18000, image: 'https://placehold.co/400x400/D946EF/FFFFFF?text=Serum', description: 'A highly concentrated, anti-aging serum for visibly smoother and more radiant skin.', specs: ['1.5% Hyaluronic Acid', 'For all skin types', 'Dermatologically tested'] },
        { id: 10, name: 'Maybelline SuperStay Matte Ink', category: 'Beauty', price: 650, rating: 4.4, reviews: 35000, image: 'https://placehold.co/400x400/F472B6/FFFFFF?text=Lipstick', description: 'Ink your lips in up to 16 HR saturated liquid matte. SuperStay Matte Ink features a unique arrow applicator for precise application.', specs: ['16-hour wear', 'Intense matte finish', 'Smudge-proof'] },
        { id: 4, name: 'The Psychology of Money', category: 'Books', price: 450, rating: 4.6, reviews: 25000, image: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=Book', description: 'Timeless lessons on wealth, greed, and happiness. It’s about how you behave.', specs: ['Author: Morgan Housel', 'Paperback', '252 pages'] },
        { id: 5, name: 'Samsung 55" QLED 4K TV', category: 'Appliances', price: 79990, rating: 4.6, reviews: 6700, image: 'https://placehold.co/400x400/EF4444/FFFFFF?text=Samsung+TV', description: 'A billion shades of color with Quantum Dot. A wider range of contrast in cinematic scale.', specs: ['Quantum Processor 4K', '100% Color Volume', 'Smart TV powered by Tizen'] },
    ];
    
    const getMockUsers = () => [
        { id: 1, name: 'Test User', email: 'user@example.com', password: 'password123' }
    ];

    // --- DOM SELECTORS ---
    const pages = document.querySelectorAll('.page');
    const headerNav = document.getElementById('header-nav');
    const logo = document.getElementById('logo');
    
    // Page Containers
    const homePage = document.getElementById('home-page');
    const productListPage = document.getElementById('product-list-page');
    const productDetailPage = document.getElementById('product-detail-page');
    const cartPage = document.getElementById('cart-page');
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const profilePage = document.getElementById('profile-page');
    const ordersPage = document.getElementById('orders-page');

    // Forms
    const searchForm = document.getElementById('search-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // --- RENDER FUNCTIONS ---
    
    const renderHeader = () => {
        let html = '';
        if (state.currentUser) {
            html += `
                <div class="relative group">
                    <button class="flex items-center space-x-2 px-3 py-2 bg-white text-blue-600 rounded-md font-semibold">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>${state.currentUser.name.split(' ')[0]}</span>
                    </button>
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        <a href="#" data-action="profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                        <a href="#" data-action="orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</a>
                        <a href="#" data-action="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                    </div>
                </div>
            `;
        } else {
            html += `<button id="login-btn" class="px-6 py-2 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition-colors">Login</button>`;
        }

        const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        html += `
            <button id="cart-btn" class="flex items-center space-x-2 font-semibold relative">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Cart</span>
                ${cartItemCount > 0 ? `<span class="absolute -top-2 -right-3 bg-yellow-400 text-blue-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">${cartItemCount}</span>` : ''}
            </button>
        `;
        headerNav.innerHTML = html;

        // Re-attach event listeners for login/cart buttons if they are re-rendered
        if (!state.currentUser) {
            document.getElementById('login-btn').addEventListener('click', () => navigateTo('login'));
        }
        document.getElementById('cart-btn').addEventListener('click', () => navigateTo('cart'));
    };

    const renderProductCard = (product) => {
        return `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer product-card" data-id="${product.id}">
                <div class="h-48 bg-gray-200 flex items-center justify-center">
                     <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/400x400/CCCCCC/FFFFFF?text=Image+Not+Found';">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 truncate">${product.name}</h3>
                    <p class="text-sm text-gray-500">${product.category}</p>
                    <div class="flex items-center my-2">
                        <span class="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">${product.rating} ★</span>
                        <span class="ml-2 text-gray-500 text-sm">(${product.reviews.toLocaleString()})</span>
                    </div>
                    <p class="text-xl font-bold text-gray-900">₹${product.price.toLocaleString()}</p>
                </div>
            </div>
        `;
    };
    
    const renderHomePage = () => {
        const grid = document.getElementById('home-product-grid');
        grid.innerHTML = state.products.slice(0, 10).map(renderProductCard).join('');
    };
    
    const renderProductListPage = (products, title) => {
        const grid = document.getElementById('product-list-grid');
        const titleEl = document.getElementById('product-list-title');
        titleEl.textContent = title;
        if (products.length > 0) {
            grid.innerHTML = products.map(renderProductCard).join('');
        } else {
            grid.innerHTML = `<p class="col-span-full text-center text-gray-500">No products found.</p>`;
        }
    };

    const renderProductDetailPage = (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) {
            productDetailPage.innerHTML = `<p class="text-center text-red-500">Product not found.</p>`;
            return;
        }
        productDetailPage.innerHTML = `
            <div>
                <div class="mb-4">
                    <button id="back-to-list-btn" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        <span>Back to Products</span>
                    </button>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x600/CCCCCC/FFFFFF?text=Image+Not+Found';">
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold text-gray-800">${product.name}</h2>
                            <div class="flex items-center my-3">
                                <span class="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded">${product.rating} ★</span>
                                <span class="ml-3 text-gray-600 text-md">${product.reviews.toLocaleString()} Ratings & Reviews</span>
                            </div>
                            <p class="text-3xl font-extrabold text-gray-900 my-4">₹${product.price.toLocaleString()}</p>
                            <p class="text-gray-600 mb-4">${product.description}</p>
                            <div class="mb-6">
                                <h4 class="font-semibold text-lg mb-2">Specifications</h4>
                                <ul class="list-disc list-inside text-gray-600 space-y-1">
                                    ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="flex space-x-4">
                                <button class="add-to-cart-btn flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors" data-id="${product.id}">Add to Cart</button>
                                <button class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const renderCartPage = () => {
        if (state.cart.length === 0) {
            cartPage.innerHTML = `
                <div class="text-center bg-white p-10 rounded-lg shadow-md">
                    <h2 class="text-2xl font-bold mb-2">Your Cart is Empty!</h2>
                    <p class="text-gray-500 mb-6">Add items to it now.</p>
                    <button id="shop-now-btn" class="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">Shop Now</button>
                </div>
            `;
            document.getElementById('shop-now-btn').addEventListener('click', () => navigateTo('home'));
            return;
        }

        const cartItemsHTML = state.cart.map(item => `
            <div class="flex items-center bg-white p-4 rounded-lg shadow-sm mb-4">
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-md mr-4">
                <div class="flex-grow">
                    <h3 class="font-semibold text-lg">${item.name}</h3>
                    <p class="text-gray-500 text-sm">${item.category}</p>
                    <p class="text-xl font-bold mt-1">₹${item.price.toLocaleString()}</p>
                </div>
                <div class="flex items-center space-x-3">
                     <p class="text-md">Qty: ${item.quantity}</p>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700 font-semibold" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartPage.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <h2 class="text-2xl font-bold mb-4">My Cart (${state.cart.length})</h2>
                    ${cartItemsHTML}
                </div>
                <div class="lg:col-span-1">
                    <div class="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                        <h3 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Price Details</h3>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Price (${state.cart.length} items)</span>
                                <span>₹${totalAmount.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Discount</span>
                                <span class="text-green-600">- ₹0</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Delivery Charges</span>
                                <span class="text-green-600">FREE</span>
                            </div>
                        </div>
                        <div class="border-t mt-4 pt-4">
                            <div class="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>₹${totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <button class="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg">Place Order</button>
                    </div>
                </div>
            </div>
        `;
    };

    const renderProfilePage = () => {
        if (!state.currentUser) {
            profilePage.innerHTML = `<p class="text-center text-gray-600">Please log in to see your profile.</p>`;
            return;
        }
        profilePage.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">My Profile</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <p class="text-lg text-gray-900 p-3 bg-gray-100 rounded-md">${state.currentUser.name}</p>
                    </div>
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <p class="text-lg text-gray-900 p-3 bg-gray-100 rounded-md">${state.currentUser.email}</p>
                    </div>
                </div>
            </div>
        `;
    };

    const renderOrdersPage = () => {
         if (!state.currentUser) {
            ordersPage.innerHTML = `<p class="text-center text-gray-600">Please log in to see your orders.</p>`;
            return;
        }
        ordersPage.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">My Orders</h2>
                <div class="text-center py-10">
                    <p class="text-gray-500 text-lg">You have no orders yet.</p>
                    <button id="continue-shopping-btn" class="mt-4 bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">Continue Shopping</button>
                </div>
            </div>
        `;
    };

    // --- LOGIC & HANDLERS ---
    
    const navigateTo = (page, data = null) => {
        if (page === 'home' || page === 'productList') {
            state.lastProductListPage = { page, data };
        }

        state.currentPage = page;
        state.currentPageData = data;
        
        pages.forEach(p => p.classList.remove('active'));
        
        let pageRenderFunction = () => {};
        
        switch(page) {
            case 'home':
                homePage.classList.add('active');
                pageRenderFunction = renderHomePage;
                break;
            case 'productList':
                productListPage.classList.add('active');
                pageRenderFunction = () => renderProductListPage(data.products, data.title);
                break;
            case 'productDetail':
                productDetailPage.classList.add('active');
                pageRenderFunction = () => renderProductDetailPage(data.productId);
                break;
            case 'cart':
                cartPage.classList.add('active');
                pageRenderFunction = renderCartPage;
                break;
            case 'login':
                loginPage.classList.add('active');
                break;
            case 'signup':
                signupPage.classList.add('active');
                break;
            case 'profile':
                profilePage.classList.add('active');
                pageRenderFunction = renderProfilePage;
                break;
            case 'orders':
                ordersPage.classList.add('active');
                pageRenderFunction = renderOrdersPage;
                break;
        }
        
        pageRenderFunction();
        window.scrollTo(0, 0);
        updateAll();
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        if (!searchTerm) return;
        
        const results = state.products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
        
        navigateTo('productList', { products: results, title: `Showing results for "${searchTerm}"` });
    };
    
    const handleLogin = (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        
        const user = state.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            state.currentUser = { id: user.id, name: user.name, email: user.email };
            errorEl.textContent = '';
            navigateTo('home');
        } else {
            errorEl.textContent = 'Invalid email or password.';
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorEl = document.getElementById('signup-error');

        if (state.users.some(u => u.email === email)) {
            errorEl.textContent = 'User with this email already exists.';
            return;
        }

        const newUser = {
            id: state.users.length + 1,
            name,
            email,
            password
        };
        state.users.push(newUser);
        state.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        errorEl.textContent = '';
        navigateTo('home');
    };
    
    const handleLogout = () => {
        state.currentUser = null;
        navigateTo('home');
    };

    const addToCart = (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }
        updateAll();
    };

    const removeFromCart = (productId) => {
        state.cart = state.cart.filter(item => item.id !== productId);
        renderCartPage();
        updateAll();
    };

    // --- EVENT LISTENERS ---
    
    logo.addEventListener('click', () => navigateTo('home'));
    searchForm.addEventListener('submit', handleSearch);
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('signup');
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login');
    });

    document.getElementById('back-to-home-btn').addEventListener('click', () => {
        navigateTo('home');
    });

    // Event delegation for dynamically created elements
    document.body.addEventListener('click', (e) => {
        // User dropdown actions (Profile, Orders, Logout)
        const userAction = e.target.dataset.action;
        if (userAction) {
            e.preventDefault();
            switch (userAction) {
                case 'profile':
                    navigateTo('profile');
                    break;
                case 'orders':
                    navigateTo('orders');
                    break;
                case 'logout':
                    handleLogout();
                    break;
            }
            return;
        }

        // Back button on the product detail page
        const backToListBtn = e.target.closest('#back-to-list-btn');
        if (backToListBtn) {
            const lastView = state.lastProductListPage;
            navigateTo(lastView.page, lastView.data);
            return;
        }

        // Continue shopping button on orders page
        const continueShoppingBtn = e.target.closest('#continue-shopping-btn');
        if (continueShoppingBtn) {
            navigateTo('home');
            return;
        }

        // Product card click
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = parseInt(productCard.dataset.id);
            navigateTo('productDetail', { productId });
            return;
        }

        // Add to cart button on detail page
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const productId = parseInt(addToCartBtn.dataset.id);
            addToCart(productId);
            alert('Product added to cart!');
            return;
        }

        // Remove from cart button
        const removeFromCartBtn = e.target.closest('.remove-from-cart-btn');
        if (removeFromCartBtn) {
            const productId = parseInt(removeFromCartBtn.dataset.id);
            removeFromCart(productId);
            return;
        }

        // Category navigation
        const categoryNav = e.target.closest('.category-nav');
        if (categoryNav) {
            const category = categoryNav.dataset.category;
            const results = state.products.filter(p => p.category === category);
            navigateTo('productList', { products: results, title: `${category}` });
        }
    });

    // --- INITIALIZATION ---
    
    const updateAll = () => {
        renderHeader();
    };
    
    const init = () => {
        state.products = getMockProducts();
        state.users = getMockUsers();
        navigateTo('home');
    };

    init();
});
