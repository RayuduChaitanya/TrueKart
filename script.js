document.addEventListener('DOMContentLoaded', () => {

    // --- STATE MANAGEMENT ---
    let state = {
        products: [],
        users: [],
        currentUser: null, // { id, name, email }
        cart: [], // [{...product, quantity: 1}]
        currentPage: 'home',
        currentPageData: null,
        navigationHistory: [], 
    };

    // --- MOCK DATA ---
    const getMockProducts = () => [
        // Mobiles
        { id: 1, name: 'Apple iPhone 16 Pro', category: 'Mobiles', brand: 'Apple', price: 119900, originalPrice: 129900, discount: 8, rating: 4.7, reviews: 8500, image: 'Images/Apple iPhone 16 Pro.jpg', description: 'A magical new way to interact with iPhone.', specs: ['A16 Bionic Chip', '6.1-inch Display', 'Pro camera system'] },
        { id: 7, name: 'Samsung Galaxy S23 Ultra', category: 'Mobiles', brand: 'Samsung', price: 109999, originalPrice: 124999, discount: 12, rating: 4.8, reviews: 9500, image: 'https://placehold.co/400x400/1F2937/FFFFFF?text=Galaxy+S23', description: 'The epic standard in mobile.', specs: ['Snapdragon 8 Gen 2', '200MP Main Camera', 'Built-in S Pen'] },
        { id: 8, name: 'OnePlus 11 5G', category: 'Mobiles', brand: 'OnePlus', price: 52999, originalPrice: 56999, discount: 7, rating: 4.6, reviews: 7800, image: 'https://placehold.co/400x400/DC2626/FFFFFF?text=OnePlus+11', description: 'The Shape of Power.', specs: ['Snapdragon 8 Gen 2', 'Hasselblad Camera', '120 Hz AMOLED'] },
        { id: 11, name: 'Google Pixel 7 Pro', category: 'Mobiles', brand: 'Pixel', price: 79999, originalPrice: 84999, discount: 6, rating: 4.7, reviews: 6500, image: 'https://placehold.co/400x400/7C3AED/FFFFFF?text=Pixel+7+Pro', description: 'The all-pro Google phone.', specs: ['Google Tensor G2', '6.7-inch Display', '5x telephoto lens'] },
        
        // Laptops
        { id: 20, name: 'Apple MacBook Air M2', category: 'Laptops', brand: 'Apple', price: 104900, originalPrice: 114900, discount: 9, rating: 4.8, reviews: 4500, image: 'https://placehold.co/400x400/808080/FFFFFF?text=MacBook+Air', description: 'Stunningly thin design and up to 18 hours of battery life.', specs: ['Apple M2 chip', '13.6-inch Liquid Retina display', '1080p FaceTime HD camera'] },
        { id: 21, name: 'Dell XPS 15', category: 'Laptops', brand: 'Dell', price: 149990, originalPrice: 159990, discount: 6, rating: 4.7, reviews: 3200, image: 'https://placehold.co/400x400/007DB8/FFFFFF?text=Dell+XPS', description: 'Powerhouse performance with a stunning OLED display.', specs: ['12th Gen Intel Core i7', 'NVIDIA GeForce RTX 3050 Ti', '15.6" 3.5K OLED display'] },
        { id: 22, name: 'HP Spectre x360', category: 'Laptops', brand: 'HP', price: 119990, originalPrice: 129990, discount: 8, rating: 4.6, reviews: 2800, image: 'https://placehold.co/400x400/0096D6/FFFFFF?text=HP+Spectre', description: 'A 2-in-1 convertible laptop with a gem-cut design.', specs: ['12th Gen Intel Core i7', 'Intel Iris Xe Graphics', '13.5" OLED display'] },

        // Electronics
        { id: 2, name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', subCategory: 'EarBuds', price: 24990, originalPrice: 29990, discount: 17, rating: 4.8, reviews: 12450, image: 'https://placehold.co/400x400/10B981/FFFFFF?text=Sony+Headphones', description: 'Our best ever noise cancelling just got better.', specs: ['Industry-leading noise cancellation', '30-hour battery life', 'Crystal clear hands-free calling'] },
        { id: 12, name: 'Boat Airdopes 141', category: 'Electronics', subCategory: 'EarBuds', price: 999, originalPrice: 1299, discount: 23, rating: 4.1, reviews: 150000, image: 'https://placehold.co/400x400/6366F1/FFFFFF?text=Boat+Airdopes', description: 'Playback time of up to 42 hours.', specs: ['42H Playtime', 'ENx™ Technology', 'ASAP™ Charge'] },
        { id: 23, name: 'Anker PowerCore 20000', category: 'Electronics', subCategory: 'Chargers', price: 3499, originalPrice: 3999, discount: 13, rating: 4.7, reviews: 25000, image: 'https://placehold.co/400x400/F97316/FFFFFF?text=Power+Bank', description: 'High-speed, long-lasting portable power.', specs: ['20000mAh Capacity', 'PowerIQ Technology', 'MultiProtect Safety System'] },
        { id: 24, name: 'TP-Link Tapo C200', category: 'Electronics', subCategory: 'CCTV Cameras', price: 2199, originalPrice: 2499, discount: 12, rating: 4.5, reviews: 89000, image: 'https://placehold.co/400x400/FACC15/FFFFFF?text=CCTV+Camera', description: 'Pan/Tilt Home Security Wi-Fi Camera.', specs: ['1080p Full HD', 'Two-Way Audio', 'Night Vision'] },
        { id: 25, name: 'AmazonBasics USB-C Cable', category: 'Electronics', subCategory: 'Cables', price: 499, originalPrice: 599, discount: 17, rating: 4.4, reviews: 120000, image: 'https://placehold.co/400x400/A3A3A3/FFFFFF?text=USB-C+Cable', description: 'USB Type-C to USB-A 2.0 Male Charger Cable.', specs: ['3 Feet long', 'USB-IF certified', 'Reversible Connector'] },
        
        // Fashion
        { id: 17, name: 'Levis Mens T-Shirt', category: 'Fashion', subCategory: "Men's Wear", price: 799, originalPrice: 899, discount: 11, rating: 4.4, reviews: 5400, image: 'https://placehold.co/400x400/2563EB/FFFFFF?text=Mens+T-Shirt', description: 'Classic crew-neck t-shirt made from pure cotton.', specs: ['100% Cotton', 'Regular Fit', 'Crew Neck'] },
        { id: 18, name: 'Zara Womens Dress', category: 'Fashion', subCategory: "Women's Wear", price: 2499, originalPrice: 2999, discount: 17, rating: 4.6, reviews: 3200, image: 'https://placehold.co/400x400/DB2777/FFFFFF?text=Womens+Dress', description: 'A beautiful floral print dress for any occasion.', specs: ['Viscose Blend', 'Midi Length', 'V-Neck'] },
        { id: 19, name: 'Fossil Mens Watch', category: 'Fashion', subCategory: 'Watches', price: 7495, originalPrice: 8995, discount: 17, rating: 4.7, reviews: 9800, image: 'https://placehold.co/400x400/374151/FFFFFF?text=Mens+Watch', description: 'A timeless chronograph watch with a leather strap.', specs: ['Stainless Steel Case', 'Leather Strap', 'Water Resistant'] },
        { id: 3, name: 'Nike Air Max 270', category: 'Fashion', subCategory: 'Shoes', price: 10995, originalPrice: 12995, discount: 15, rating: 4.5, reviews: 15200, image: 'https://placehold.co/400x400/F59E0B/FFFFFF?text=Nike+Air+Max', description: 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude.', specs: ['Large volume Max Air unit', 'Knit fabric on the upper', 'Foam midsole'] },
        { id: 6, name: 'Adidas Ultraboost 22', category: 'Fashion', subCategory: 'Shoes', price: 15999, originalPrice: 17999, discount: 11, rating: 4.7, reviews: 9800, image: 'https://placehold.co/400x400/0EA5E9/FFFFFF?text=Adidas+Shoes', description: 'Experience epic energy with the new Ultraboost 22.', specs: ['BOOST midsole', 'Linear Energy Push system', 'Made with Parley Ocean Plastic'] },

        // Appliances
        { id: 5, name: 'Samsung 55" QLED 4K TV', category: 'Appliances', subCategory: "TV's", price: 69990, originalPrice: 79990, discount: 13, rating: 4.6, reviews: 6700, image: 'https://placehold.co/400x400/EF4444/FFFFFF?text=Samsung+TV', description: 'A billion shades of color with Quantum Dot.', specs: ['Quantum Processor 4K', '100% Color Volume', 'Smart TV powered by Tizen'] },
        { id: 14, name: 'Philips Steam Iron', category: 'Appliances', subCategory: "Iron Box", price: 1299, originalPrice: 1499, discount: 13, rating: 4.3, reviews: 18000, image: 'https://placehold.co/400x400/34D399/FFFFFF?text=Iron', description: 'This steam iron is specially designed for a seamless ironing experience.', specs: ['1440 Watts', 'Non-stick soleplate', 'Steam boost'] },
        { id: 26, name: 'LG 7kg Washing Machine', category: 'Appliances', subCategory: "Washing Machines", price: 15990, originalPrice: 17490, discount: 9, rating: 4.4, reviews: 45000, image: 'https://placehold.co/400x400/9CA3AF/FFFFFF?text=Washing+Machine', description: 'Fully-automatic top load washing machine: Affordable with great wash quality.', specs: ['700 RPM', 'Smart Inverter Technology', 'TurboDrum'] },
        { id: 27, name: 'Whirlpool 190L Fridge', category: 'Appliances', subCategory: "Fridges", price: 11990, originalPrice: 12990, discount: 8, rating: 4.3, reviews: 32000, image: 'https://placehold.co/400x400/6B7280/FFFFFF?text=Fridge', description: 'Direct-cool single-door refrigerator with 9 hours of cooling retention during power cuts.', specs: ['190 Litres', '3 Star Energy Rating', 'IntelliSense Inverter Technology'] },

        // Beauty
        { id: 9, name: 'L\'Oréal Paris Revitalift Serum', category: 'Beauty', subCategory: 'Skin Care', price: 699, originalPrice: 799, discount: 13, rating: 4.5, reviews: 18000, image: 'https://placehold.co/400x400/D946EF/FFFFFF?text=Serum', description: 'A highly concentrated, anti-aging serum for visibly smoother and more radiant skin.', specs: ['1.5% Hyaluronic Acid', 'For all skin types', 'Dermatologically tested'] },
        { id: 10, name: 'Maybelline SuperStay Matte Ink', category: 'Beauty', subCategory: 'Make Up', price: 550, originalPrice: 650, discount: 15, rating: 4.4, reviews: 35000, image: 'https://placehold.co/400x400/F472B6/FFFFFF?text=Lipstick', description: 'Ink your lips in up to 16 HR saturated liquid matte.', specs: ['16-hour wear', 'Intense matte finish', 'Smudge-proof'] },
        { id: 28, name: 'Head & Shoulders Shampoo', category: 'Beauty', subCategory: 'Hair Care', price: 399, originalPrice: 450, discount: 11, rating: 4.6, reviews: 65000, image: 'https://placehold.co/400x400/0073C0/FFFFFF?text=Shampoo', description: 'Up to 100% dandruff-free hair.', specs: ['Anti-dandruff', 'For all hair types', 'pH balanced'] },
        { id: 29, name: 'Nautica Voyage Perfume', category: 'Beauty', subCategory: 'Perfumes', price: 1299, originalPrice: 1500, discount: 13, rating: 4.5, reviews: 45000, image: 'https://placehold.co/400x400/00AEEF/FFFFFF?text=Perfume', description: 'A fresh and salty sea breeze that carries romantic scents of coastal herbs and woods.', specs: ['100ml', 'Eau de Toilette', 'For Men'] },

        // Books
        { id: 4, name: 'The Psychology of Money', category: 'Books', subCategory: 'Others', price: 399, originalPrice: 450, discount: 11, rating: 4.6, reviews: 25000, image: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=Book', description: 'Timeless lessons on wealth, greed, and happiness.', specs: ['Author: Morgan Housel', 'Paperback', '252 pages'] },
        { id: 16, name: 'Atomic Habits', category: 'Books', subCategory: 'Others', price: 499, originalPrice: 550, discount: 9, rating: 4.8, reviews: 95000, image: 'https://placehold.co/400x400/9333EA/FFFFFF?text=Atomic+Habits', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', specs: ['Author: James Clear', 'Hardcover', '320 pages'] },
        { id: 30, name: 'Sapiens: A Brief History of Humankind', category: 'Books', subCategory: 'History', price: 449, originalPrice: 499, discount: 10, rating: 4.7, reviews: 120000, image: 'https://placehold.co/400x400/FB8C00/FFFFFF?text=Sapiens', description: 'A critical, scientific look at the history of humankind.', specs: ['Author: Yuval Noah Harari', 'Paperback', '464 pages'] },
        { id: 31, name: 'The Great Indian Novel', category: 'Books', subCategory: 'Stories', price: 299, originalPrice: 350, discount: 15, rating: 4.5, reviews: 15000, image: 'https://placehold.co/400x400/C2185B/FFFFFF?text=Indian+Novel', description: 'A satirical novel by Shashi Tharoor that recasts the Hindu epic Mahabharata.', specs: ['Author: Shashi Tharoor', 'Paperback', '448 pages'] },
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
    const fashionPage = document.getElementById('fashion-page');
    const mobilesPage = document.getElementById('mobiles-page');
    const laptopsPage = document.getElementById('laptops-page');
    const electronicsPage = document.getElementById('electronics-page');
    const appliancesPage = document.getElementById('appliances-page');
    const beautyPage = document.getElementById('beauty-page');
    const booksPage = document.getElementById('books-page');

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

        if (!state.currentUser) {
            document.getElementById('login-btn').addEventListener('click', () => navigateTo('login'));
        }
        document.getElementById('cart-btn').addEventListener('click', () => navigateTo('cart'));
    };

    const renderProductCard = (product) => {
        return `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer product-card" data-id="${product.id}">
                <div class="h-64 bg-white flex items-center justify-center">
                     <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain" onerror="this.onerror=null;this.src='https://placehold.co/400x400/CCCCCC/FFFFFF?text=Image+Not+Found';">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 truncate">${product.name}</h3>
                    <p class="text-sm text-gray-500">${product.brand || product.category}</p>
                    <div class="flex items-center my-2">
                        <span class="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">${product.rating} ★</span>
                        <span class="ml-2 text-gray-500 text-sm">(${product.reviews.toLocaleString()})</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <p class="text-xl font-bold text-gray-900">₹${product.price.toLocaleString()}</p>
                        <p class="text-sm text-gray-500 line-through">₹${product.originalPrice.toLocaleString()}</p>
                        <p class="text-sm font-semibold text-green-600">${product.discount}% off</p>
                    </div>
                </div>
            </div>
        `;
    };
    
    const renderHomePage = () => {
        const blockbusterGrid = document.getElementById('blockbuster-deals-grid');
        blockbusterGrid.innerHTML = state.products.slice(5, 10).map(renderProductCard).join('');

        const suggestedGrid = document.getElementById('suggested-deals-grid');
        suggestedGrid.innerHTML = state.products.slice(10, 15).map(renderProductCard).join('');

        const featuredGrid = document.getElementById('home-product-grid');
        featuredGrid.innerHTML = state.products.slice(0, 5).map(renderProductCard).join('');
    };

    const renderFashionPage = () => {
        const fashionGrid = document.getElementById('fashion-product-grid');
        const fashionProducts = state.products.filter(p => p.category === 'Fashion');
        fashionGrid.innerHTML = fashionProducts.map(renderProductCard).join('');
    };

    const renderMobilesPage = () => {
        const mobilesGrid = document.getElementById('mobiles-product-grid');
        const mobileProducts = state.products.filter(p => p.category === 'Mobiles');
        mobilesGrid.innerHTML = mobileProducts.map(renderProductCard).join('');
    };

    const renderLaptopsPage = () => {
        const laptopsGrid = document.getElementById('laptops-product-grid');
        const laptopProducts = state.products.filter(p => p.category === 'Laptops');
        laptopsGrid.innerHTML = laptopProducts.map(renderProductCard).join('');
    };

    const renderElectronicsPage = () => {
        const electronicsGrid = document.getElementById('electronics-product-grid');
        const electronicsProducts = state.products.filter(p => p.category === 'Electronics');
        electronicsGrid.innerHTML = electronicsProducts.map(renderProductCard).join('');
    };

    const renderAppliancesPage = () => {
        const appliancesGrid = document.getElementById('appliances-product-grid');
        const appliancesProducts = state.products.filter(p => p.category === 'Appliances');
        appliancesGrid.innerHTML = appliancesProducts.map(renderProductCard).join('');
    };

    const renderBeautyPage = () => {
        const beautyGrid = document.getElementById('beauty-product-grid');
        const beautyProducts = state.products.filter(p => p.category === 'Beauty');
        beautyGrid.innerHTML = beautyProducts.map(renderProductCard).join('');
    };

    const renderBooksPage = () => {
        const booksGrid = document.getElementById('books-product-grid');
        const booksProducts = state.products.filter(p => p.category === 'Books');
        booksGrid.innerHTML = booksProducts.map(renderProductCard).join('');
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
                    <button class="back-btn bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        <span>Back</span>
                    </button>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="h-96 bg-white flex items-center justify-center rounded-lg">
                            <img src="${product.image}" alt="${product.name}" class="max-w-full max-h-full rounded-lg object-contain" onerror="this.onerror=null;this.src='https://placehold.co/600x600/CCCCCC/FFFFFF?text=Image+Not+Found';">
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold text-gray-800">${product.name}</h2>
                            <div class="flex items-center my-3">
                                <span class="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded">${product.rating} ★</span>
                                <span class="ml-3 text-gray-600 text-md">${product.reviews.toLocaleString()} Ratings & Reviews</span>
                            </div>
                            <div class="flex items-baseline gap-3 my-4">
                                <p class="text-3xl font-extrabold text-gray-900">₹${product.price.toLocaleString()}</p>
                                <p class="text-lg text-gray-500 line-through">₹${product.originalPrice.toLocaleString()}</p>
                                <p class="text-lg font-semibold text-green-600">${product.discount}% off</p>
                            </div>
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
                <div class="w-24 h-24 bg-white flex-shrink-0 mr-4">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain rounded-md">
                </div>
                <div class="flex-grow">
                    <h3 class="font-semibold text-lg">${item.name}</h3>
                    <p class="text-gray-500 text-sm">${item.category}</p>
                    <div class="flex items-center gap-2">
                        <p class="text-xl font-bold text-gray-900">₹${item.price.toLocaleString()}</p>
                        <p class="text-sm text-gray-500 line-through">₹${item.originalPrice.toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                     <p class="text-md">Qty: ${item.quantity}</p>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700 font-semibold" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        const totalFinalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalOriginalPrice = state.cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
        const totalSavings = totalOriginalPrice - totalFinalPrice;

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
                                <span>Total MRP</span>
                                <span>₹${totalOriginalPrice.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Discount on MRP</span>
                                <span class="text-green-600">- ₹${totalSavings.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Delivery Charges</span>
                                <span class="text-green-600">FREE</span>
                            </div>
                        </div>
                        <div class="border-t mt-4 pt-4">
                            <div class="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>₹${totalFinalPrice.toLocaleString()}</span>
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
    
    const navigateTo = (page, data = null, isBackNavigation = false) => {
        if (!isBackNavigation) {
            state.navigationHistory.push({ page: state.currentPage, data: state.currentPageData });
        }

        state.currentPage = page;
        state.currentPageData = data;
        
        pages.forEach(p => p.classList.remove('active'));
        
        let pageRenderFunction = () => {};
        
        switch(page) {
            case 'home': homePage.classList.add('active'); pageRenderFunction = renderHomePage; break;
            case 'fashion': fashionPage.classList.add('active'); pageRenderFunction = renderFashionPage; break;
            case 'mobiles': mobilesPage.classList.add('active'); pageRenderFunction = renderMobilesPage; break;
            case 'laptops': laptopsPage.classList.add('active'); pageRenderFunction = renderLaptopsPage; break;
            case 'electronics': electronicsPage.classList.add('active'); pageRenderFunction = renderElectronicsPage; break;
            case 'appliances': appliancesPage.classList.add('active'); pageRenderFunction = renderAppliancesPage; break;
            case 'beauty': beautyPage.classList.add('active'); pageRenderFunction = renderBeautyPage; break;
            case 'books': booksPage.classList.add('active'); pageRenderFunction = renderBooksPage; break;
            case 'productList': productListPage.classList.add('active'); pageRenderFunction = () => renderProductListPage(data.products, data.title); break;
            case 'productDetail': productDetailPage.classList.add('active'); pageRenderFunction = () => renderProductDetailPage(data.productId); break;
            case 'cart': cartPage.classList.add('active'); pageRenderFunction = renderCartPage; break;
            case 'login': loginPage.classList.add('active'); break;
            case 'signup': signupPage.classList.add('active'); break;
            case 'profile': profilePage.classList.add('active'); pageRenderFunction = renderProfilePage; break;
            case 'orders': ordersPage.classList.add('active'); pageRenderFunction = renderOrdersPage; break;
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
            (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
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
    
    logo.addEventListener('click', () => {
        state.navigationHistory = []; // Clear history when going to logo/home
        navigateTo('home');
    });
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

    // Event delegation for dynamically created elements
    document.body.addEventListener('click', (e) => {
        // Handle all back buttons
        const backBtn = e.target.closest('.back-btn');
        if (backBtn) {
            e.preventDefault();
            const lastView = state.navigationHistory.pop();
            if (lastView) {
                navigateTo(lastView.page, lastView.data, true); // Pass true to prevent pushing to history again
            } else {
                navigateTo('home', null, true); // Fallback to home
            }
            return;
        }

        const userAction = e.target.dataset.action;
        if (userAction) {
            e.preventDefault();
            switch (userAction) {
                case 'profile': navigateTo('profile'); break;
                case 'orders': navigateTo('orders'); break;
                case 'logout': handleLogout(); break;
            }
            return;
        }

        const continueShoppingBtn = e.target.closest('#continue-shopping-btn');
        if (continueShoppingBtn) {
            navigateTo('home');
            return;
        }

        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = parseInt(productCard.dataset.id);
            navigateTo('productDetail', { productId });
            return;
        }

        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const productId = parseInt(addToCartBtn.dataset.id);
            addToCart(productId);
            alert('Product added to cart!');
            return;
        }

        const removeFromCartBtn = e.target.closest('.remove-from-cart-btn');
        if (removeFromCartBtn) {
            const productId = parseInt(removeFromCartBtn.dataset.id);
            removeFromCart(productId);
            return;
        }

        const categoryNav = e.target.closest('.category-nav');
        if (categoryNav) {
            const category = categoryNav.dataset.category;
            switch(category) {
                case 'Mobiles': navigateTo('mobiles'); break;
                case 'Laptops': navigateTo('laptops'); break;
                case 'Fashion': navigateTo('fashion'); break;
                case 'Electronics': navigateTo('electronics'); break;
                case 'Appliances': navigateTo('appliances'); break;
                case 'Beauty': navigateTo('beauty'); break;
                case 'Books': navigateTo('books'); break;
                default:
                    const results = state.products.filter(p => p.category === category);
                    navigateTo('productList', { products: results, title: `${category}` });
                    break;
            }
            return;
        }
        
        const brandLink = e.target.closest('.brand-link');
        if (brandLink) {
            e.preventDefault();
            const brand = brandLink.dataset.brand;
            const category = brandLink.dataset.category;
            const results = state.products.filter(p => p.category === category && p.brand === brand);
            navigateTo('productList', { products: results, title: `${brand} ${category}` });
            return;
        }

        const subCategoryLink = e.target.closest('.fashion-subcategory-link, .electronics-subcategory-link, .appliances-subcategory-link, .beauty-subcategory-link, .books-subcategory-link');
        if (subCategoryLink) {
            e.preventDefault();
            const subCategory = subCategoryLink.dataset.subcategory;
            const results = state.products.filter(p => p.subCategory === subCategory);
            navigateTo('productList', { products: results, title: `${subCategory}` });
            return;
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
