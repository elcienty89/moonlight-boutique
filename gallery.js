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
        let thumbnailsContainer = document.getElementById('modalThumbnails');
        const modalImage = document.getElementById('modalImage');

        if (!modalImage) return;

        // Create thumbnails container if it doesn't exist
        if (!thumbnailsContainer) {
            const imageContainer = modalImage.parentElement;
            if (!imageContainer) return;

            thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.id = 'modalThumbnails';
            thumbnailsContainer.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm';
            imageContainer.appendChild(thumbnailsContainer);
        }

        // Clear previous thumbnails
        thumbnailsContainer.innerHTML = '';

        // If only one image, hide thumbnails container
        if (!product.imagenes || product.imagenes.length <= 1) {
            thumbnailsContainer.style.display = 'none';
            return;
        }

        // Show thumbnails container
        thumbnailsContainer.style.display = 'flex';

        // Add thumbnails
        product.imagenes.forEach((img, i) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.className = `w-12 h-12 object-cover rounded cursor-pointer border-2 transition-all duration-300 hover:scale-110 ${i === 0 ? 'border-white' : 'border-transparent hover:border-white/50'}`;

            thumb.onclick = function () {
                // Update main image with fade effect
                modalImage.style.opacity = '0';
                setTimeout(() => {
                    modalImage.src = img;
                    modalImage.style.opacity = '1';
                }, 200);

                // Update active state  
                thumbnailsContainer.querySelectorAll('img').forEach(t => {
                    t.classList.remove('border-white');
                    t.classList.add('border-transparent');
                });
                this.classList.remove('border-transparent');
                this.classList.add('border-white');
            };

            thumbnailsContainer.appendChild(thumb);
        });

        console.log('✅ Gallery created with', product.imagenes.length, 'images');
    }
})();
