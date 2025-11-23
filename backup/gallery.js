// Image Gallery Enhancement
// This file adds thumbnail gallery functionality to the product modal

console.log('✅ Gallery.js loaded successfully!');

(function () {
    const originalOpenModal = window.openModal;
    let lastProductId = null;
    let lastExecutionTime = 0;

    window.openModal = function (productId) {
        // Call original function first
        if (originalOpenModal) {
            originalOpenModal(productId);
        }

        // Find the product
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product || !product.imagenes || product.imagenes.length <= 1) {
            return;
        }

        // Prevent duplicate execution: only run if enough time has passed or different product
        const now = Date.now();
        if (productId === lastProductId && (now - lastExecutionTime) < 500) {
            console.log('⚠️ Skipping duplicate gallery creation');
            return;
        }

        lastProductId = productId;
        lastExecutionTime = now;

        // Add gallery after modal opens
        setTimeout(() => {
            addGalleryToModal(product);
        }, 100);
    };

    function addGalleryToModal(product) {
        // Clean up first - remove ALL existing galleries
        const allGalleries = document.querySelectorAll('.product-gallery');
        allGalleries.forEach(g => g.remove());

        const modalImage = document.getElementById('modalImage');
        if (!modalImage) return;

        const container = modalImage.parentElement;
        if (!container) return;

        // Adjust container styles
        container.style.height = 'auto';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.padding = '1rem';

        // Adjust main image
        modalImage.style.height = '300px';
        modalImage.style.width = '100%';
        modalImage.style.objectFit = 'contain';

        // Create gallery
        const gallery = document.createElement('div');
        gallery.className = 'product-gallery';
        gallery.style.cssText = 'display:flex;gap:8px;padding:12px 8px;overflow-x:auto;justify-content:center;background:#f5f5f5;border-radius:8px;margin-top:12px';

        // Add thumbnails
        product.imagenes.forEach((img, i) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.style.cssText = `width:70px;height:70px;object-fit:cover;border-radius:8px;cursor:pointer;border:3px solid ${i === 0 ? '#000' : '#ddd'};transition:all 0.3s;flex-shrink:0`;

            thumb.onclick = function () {
                modalImage.src = img;
                gallery.querySelectorAll('img').forEach(t => t.style.borderColor = '#ddd');
                this.style.borderColor = '#000';
            };

            thumb.onmouseenter = function () {
                if (this.style.borderColor !== 'rgb(0, 0, 0)') {
                    this.style.borderColor = '#999';
                }
            };

            thumb.onmouseleave = function () {
                if (this.style.borderColor !== 'rgb(0, 0, 0)') {
                    this.style.borderColor = '#ddd';
                }
            };

            gallery.appendChild(thumb);
        });

        container.appendChild(gallery);
        console.log('Gallery added with', product.imagenes.length, 'images');
    }
})();
