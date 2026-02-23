const products = [
    { id: 1, name: "Siêu phẩm Lamborghini & Bugatti (Combo)", price: 950000, image: "images/prod-1.jpg", brand: "Lamborghini", scale: "1:24", tag: "new", tagLabel: "Mới" },
    { id: 2, name: "Tranh Mô Hình Bugatti La Voiture Noire", price: 1550000, image: "images/prod-2.jpg", brand: "Bugatti", scale: "1:24", tag: "sale", tagLabel: "Hot" },
    { id: 3, name: "Tranh Mô Hình Bugatti (Top View)", price: 1450000, image: "images/prod-3.jpg", brand: "Bugatti", scale: "1:24", tag: null, tagLabel: null },
    { id: 4, name: "Mô hình xe Ferrari LaFerrari 1:24 Bburago", price: 480000, image: "https://placehold.co/300x200/png?text=Ferrari+LaFerrari", brand: "Ferrari", scale: "1:24", tag: null, tagLabel: null },
    { id: 5, name: "Mô hình xe Lamborghini Sian FKP 37 1:18", price: 1200000, image: "https://placehold.co/300x200/png?text=Lamborghini+Sian", brand: "Lamborghini", scale: "1:18", tag: "hot", tagLabel: "Hot" },
    { id: 6, name: "Mô hình xe Hot Wheels Night Speed chính hãng", price: 79000, image: "https://placehold.co/300x200/png?text=Hot+Wheels", brand: "Khác", scale: "1:64", tag: null, tagLabel: null }
];

// Helper Functions (Global)
function getCart() {
    try {
        const cart = localStorage.getItem('motif_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error("Cart retrieval error", e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('motif_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => b.textContent = totalItems);
}

function addToCart(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) {
        alert("Lỗi: Không tìm thấy sản phẩm!");
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);

    // Visual Feedback
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Đã thêm!';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = '#fff';
        btn.style.borderColor = '#4CAF50';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1000);
    }
}

// Cart Page Interaction Functions
function updateQuantity(id, newQty) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        let qty = parseInt(newQty);
        if (isNaN(qty) || qty < 1) qty = 1;
        item.quantity = qty;
        saveCart(cart);
        renderCartPage(); // Refresh table
    }
}

function removeItem(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage(); // Refresh table
}

function renderCartPage() {
    const cartTableBody = document.getElementById('cartTableBody');
    const cartTotalEl = document.getElementById('cartTotal');

    if (!cartTableBody) return;

    const cart = getCart();
    cartTableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 30px; font-size: 1.1rem; color: #666;">Giỏ hàng của bạn đang trống.<br><a href="index.html" style="color:var(--primary-color); text-decoration:underline;">Quay lại mua sắm</a></td></tr>';
        if (cartTotalEl) cartTotalEl.textContent = '0₫';
        return;
    }

    let rowsHtml = '';
    cart.forEach(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const subtotal = price * quantity;
        total += subtotal;

        const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        const formattedSubtotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal);

        rowsHtml += `
            <tr>
                <td class="cart-product">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto;">
                    <span>${item.name}</span>
                </td>
                <td>${formattedPrice}</td>
                <td>
                    <input type="number" value="${quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)" style="width: 60px; padding: 5px;">
                </td>
                <td>${formattedSubtotal}</td>
                <td>
                    <button class="remove-btn" onclick="removeItem(${item.id})" style="color: red; border: none; background: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    cartTableBody.innerHTML = rowsHtml;

    if (cartTotalEl) {
        cartTotalEl.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
    }
}


// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cart Count
    updateCartCount();

    // 2. Setup Mobile Nav & Link Interception
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            mainNav.classList.toggle('active');
        });
    }

    // 2.5 Hero Slideshow Logic
    const heroImages = document.querySelectorAll('.hero-bg img');
    if (heroImages.length > 0) {
        let currentSlide = 0;
        // Set first image active initially
        heroImages[0].classList.add('active');

        setInterval(() => {
            // Remove active from current
            heroImages[currentSlide].classList.remove('active');

            // Move to next
            currentSlide = (currentSlide + 1) % heroImages.length;

            // Add active to next
            heroImages[currentSlide].classList.add('active');
        }, 4000); // Change every 4 seconds
    }

    // 3. Page Specific Logic
    const productGrid = document.getElementById('productGrid');
    const cartTableBody = document.getElementById('cartTableBody');

    // --- Index Page Logic ---
    if (productGrid) {
        const sortRadios = document.querySelectorAll('input[name="sort"]');
        const brandCheckboxes = document.querySelectorAll('.filter-box:nth-of-type(1) input[type="checkbox"]');
        const scaleCheckboxes = document.querySelectorAll('.filter-box:nth-of-type(2) input[type="checkbox"]');

        const searchInput = document.querySelector('.search-bar input');
        const searchBtn = document.querySelector('.search-bar button');

        const navLinks = document.querySelectorAll('.main-nav .nav-link');
        let currentNavFilter = 'all';

        function renderProducts(items) {
            productGrid.innerHTML = '';
            if (!items.length) {
                productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 1.2rem;">Không tìm thấy sản phẩm phù hợp.</p>';
                return;
            }
            items.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
                const badgeHtml = product.tag ? `<span class="badge ${product.tag}">${product.tagLabel}</span>` : '';

                // Note: calling global addToCart(id, this)
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${badgeHtml}
                    </div>
                    <div class="product-info">
                        <h4 class="product-title">${product.name}</h4>
                        <p class="product-price">${formattedPrice}</p>
                        <button class="add-to-cart" onclick="addToCart(${product.id}, this)">Thêm vào giỏ</button>
                    </div>
                `;
                productGrid.appendChild(card);
            });
        }

        function updateProducts() {
            let filtered = [...products];

            // 0. Nav Filter
            if (currentNavFilter === 'new') {
                filtered = filtered.filter(p => p.tag === 'new');
            } else if (currentNavFilter === 'car') {
                // Show all cars (exclude 'Khác' / Accessories if defined)
                filtered = filtered.filter(p => p.brand !== 'Khác');
            } else if (currentNavFilter === 'accessory') {
                filtered = filtered.filter(p => p.brand === 'Khác'); // Assume 'Khác' is Accessory for now
            }

            // 1. Search Filter
            if (searchInput) {
                const searchTerm = searchInput.value.trim().toLowerCase();
                if (searchTerm) {
                    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
                }
            }

            // 2. Brand Filter
            const selectedBrands = Array.from(brandCheckboxes || []).filter(cb => cb.checked).map(cb => cb.parentNode.textContent.trim());
            if (selectedBrands.length) filtered = filtered.filter(p => selectedBrands.includes(p.brand));

            // 3. Scale Filter
            const selectedScales = Array.from(scaleCheckboxes || []).filter(cb => cb.checked).map(cb => cb.parentNode.textContent.trim());
            if (selectedScales.length) filtered = filtered.filter(p => selectedScales.includes(p.scale));

            // 4. Sort
            const sortEl = document.querySelector('input[name="sort"]:checked');
            if (sortEl) {
                const sortValue = sortEl.value;
                if (sortValue === "price-asc") filtered.sort((a, b) => a.price - b.price);
                else if (sortValue === "price-desc") filtered.sort((a, b) => b.price - a.price);
            }
            renderProducts(filtered);
        }

        // Nav Link Events
        if (navLinks) {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Update Active State
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Set Filter
                    currentNavFilter = link.getAttribute('data-filter');

                    // Reset Checkboxes if desired (optional)
                    // brandCheckboxes.forEach(cb => cb.checked = false);

                    // Scroll to products if needed
                    document.getElementById('shop-now').scrollIntoView({ behavior: 'smooth' });

                    updateProducts();
                });
            });
        }

        if (brandCheckboxes) brandCheckboxes.forEach(cb => cb.addEventListener('change', updateProducts));
        if (scaleCheckboxes) scaleCheckboxes.forEach(cb => cb.addEventListener('change', updateProducts));
        if (sortRadios) sortRadios.forEach(radio => radio.addEventListener('change', updateProducts));

        // Search Event Listeners
        if (searchInput) {
            searchInput.addEventListener('input', updateProducts);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') updateProducts();
            });
        }
        if (searchBtn) searchBtn.addEventListener('click', updateProducts);

        // Initial Render
        renderProducts(products);
    }

    // --- Cart Page Logic ---
    if (cartTableBody) {
        renderCartPage();

        // 4. Checkout Logic (Only run if on cart page)
        const checkoutBtn = document.querySelector('.checkout-btn');
        const modal = document.getElementById('checkoutModal');
        const closeModalFn = () => {
            modal.classList.remove('show');
            // Reset form state if needed, or keep for user convenience
            setTimeout(() => {
                document.getElementById('modalForm').style.display = 'block';
                document.getElementById('successMessage').style.display = 'none';
            }, 300);
        };

        // Expose close function globally
        window.closeCheckoutModal = closeModalFn;

        if (checkoutBtn && modal) {
            const closeBtn = modal.querySelector('.close-modal');
            const checkoutForm = document.getElementById('checkoutForm');
            const paymentRadios = document.querySelectorAll('input[name="payment"]');
            const bankInfo = document.getElementById('bankInfo');

            // Open Modal
            checkoutBtn.addEventListener('click', () => {
                const cart = getCart();
                if (cart.length === 0) {
                    alert('Giỏ hàng trống! Vui lòng chọn sản phẩm trước.');
                    return;
                }
                modal.classList.add('show');
            });

            // Close Modal
            closeBtn.addEventListener('click', closeModalFn);
            window.addEventListener('click', (e) => {
                if (e.target === modal) closeModalFn();
            });

            // Payment Method Toggle
            paymentRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'bank') {
                        bankInfo.style.display = 'block';
                    } else {
                        bankInfo.style.display = 'none';
                    }
                });
            });

            // Form Submit / Confirm Order
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // (Validation is handled by HTML 'required' attribute on phone input)
                const phone = document.getElementById('customerPhone').value;
                if (!phone) {
                    alert('Vui lòng nhập số điện thoại');
                    return;
                }

                const confirmBtn = checkoutForm.querySelector('.confirm-btn');
                const originalBtnText = confirmBtn.textContent;
                confirmBtn.textContent = 'Đang xử lý...';
                confirmBtn.disabled = true;

                // Prepare Data
                const cart = getCart();
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const itemsString = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');

                const orderData = {
                    name: document.getElementById('customerName').value,
                    phone: phone,
                    address: document.getElementById('customerAddress').value,
                    items: itemsString,
                    total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total),
                    paymentMethod: document.querySelector('input[name="payment"]:checked').value === 'cod' ? 'COD' : 'Chuyển khoản'
                };

                // --- GOOGLE SHEET INTEGRATION ---
                // PASTE YOUR WEB APP URL HERE
                const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7LCq2w8I07b6bEKswMlMTpAnAv1Fy844x_Xy8gm2HHD9EmnUwS6gvCueyS7TRIkpSAw/exec';

                if (SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') {
                    // Fallback if user hasn't set up URL yet
                    console.log("Simulating success (No URL configured)");
                    setTimeout(() => {
                        handleSuccess();
                    }, 1000);
                } else {
                    // Real Send
                    fetch(SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors', // Important for Google Sheets
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        body: JSON.stringify(orderData)
                    })
                        .then(() => {
                            handleSuccess();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng gọi Hotline để đặt trực tiếp.');
                            confirmBtn.textContent = originalBtnText;
                            confirmBtn.disabled = false;
                        });
                }

                function handleSuccess() {
                    // clear cart and show success
                    localStorage.removeItem('motif_cart');
                    updateCartCount();
                    renderCartPage();

                    document.getElementById('modalForm').style.display = 'none';
                    document.getElementById('successMessage').style.display = 'block';

                    confirmBtn.textContent = originalBtnText;
                    confirmBtn.disabled = false;
                    checkoutForm.reset();
                }
            });
        }
    }
});
