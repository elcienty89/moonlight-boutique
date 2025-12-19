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
        const imageContainer = modalImage ? modalImage.parentElement : null;

        if (!imageContainer) return;

        // --- 1. Create/Reset Thumbnails Container ---
        if (!thumbnailsContainer) {
            thumbnailsContainer = document.createElement('div');
            thumbnailsContainer.id = 'modalThumbnails';
            thumbnailsContainer.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-row gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm z-20';
            imageContainer.appendChild(thumbnailsContainer);
        }
        thumbnailsContainer.innerHTML = '';

        // Remove existing arrows if any (to prevent duplicates on re-open)
        const existingArrows = imageContainer.querySelectorAll('.gallery-arrow');
        existingArrows.forEach(arrow => arrow.remove());

        // If only one image, hide everything and return
        if (!product.imagenes || product.imagenes.length <= 1) {
            thumbnailsContainer.style.display = 'none';
            return;
        }

        thumbnailsContainer.style.display = 'flex';
        let currentImageIndex = 0;

        // --- 2. Create Arrows ---
        const createArrow = (direction) => {
            const btn = document.createElement('button');
            btn.className = `gallery-arrow absolute top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-20 ${direction === 'prev' ? 'left-2' : 'right-2'}`;
            btn.innerHTML = direction === 'prev'
                ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>'
                : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';

            btn.onclick = (e) => {
                e.stopPropagation();
                if (direction === 'prev') {
                    currentImageIndex = (currentImageIndex - 1 + product.imagenes.length) % product.imagenes.length;
                } else {
                    currentImageIndex = (currentImageIndex + 1) % product.imagenes.length;
                }
                updateGalleryState(currentImageIndex);
            };
            return btn;
        };

        imageContainer.appendChild(createArrow('prev'));
        imageContainer.appendChild(createArrow('next'));

        // --- 3. Update Function ---
        const updateGalleryState = (index) => {
            const imgUrl = product.imagenes[index];

            // Fade effect
            modalImage.style.opacity = '0';
            setTimeout(() => {
                modalImage.src = imgUrl;
                modalImage.style.opacity = '1';
            }, 200);

            // Update thumbnails styling
            const thumbs = thumbnailsContainer.querySelectorAll('img');
            thumbs.forEach((t, i) => {
                if (i === index) {
                    t.classList.remove('border-transparent');
                    t.classList.add('border-white');
                    t.style.opacity = '1';
                } else {
                    t.classList.remove('border-white');
                    t.classList.add('border-transparent');
                    t.style.opacity = '0.7';
                }
            });

            currentImageIndex = index;
        };

        // --- 4. Create Thumbnails ---
        product.imagenes.forEach((img, i) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.className = `w-12 h-12 object-cover rounded cursor-pointer border-2 transition-all duration-300 hover:scale-110 ${i === 0 ? 'border-white opacity-100' : 'border-transparent hover:border-white/50 opacity-70'}`;

            thumb.onclick = (e) => {
                e.stopPropagation();
                updateGalleryState(i);
            };

            thumbnailsContainer.appendChild(thumb);
        });

        console.log('✅ Gallery created with arrows for', product.imagenes.length, 'images');
    }
})();
