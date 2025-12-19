// Simple Image Lightbox with Navigation - Click image to view full screen
(function () {
    'use strict';

    let currentImages = [];
    let currentIndex = 0;

    // Create lightbox HTML
    const lightboxHTML = `
        <div id="simpleLightbox" class="simple-lightbox" style="display: none;">
            <button class="simple-lightbox-close" onclick="window.closeSimpleLightbox()">✕</button>
            <button class="simple-lightbox-prev" onclick="window.navigateLightbox(-1)" style="display: none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button class="simple-lightbox-next" onclick="window.navigateLightbox(1)" style="display: none;">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <img class="simple-lightbox-image" src="" alt="">
            <div class="simple-lightbox-counter" style="display: none;"></div>
        </div>
    `;

    // Add lightbox to page when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Add lightbox HTML to body
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .simple-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 999999;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            
            .simple-lightbox[style*="display: flex"] {
                display: flex !important;
            }
            
            .simple-lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
            
            .simple-lightbox-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: white;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                color: #000000;
                font-size: 24px;
                cursor: pointer;
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
            }
            
            .simple-lightbox-close:hover {
                background: #f0f0f0;
            }
            
            .simple-lightbox-prev,
            .simple-lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                cursor: pointer;
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .simple-lightbox-prev:hover,
            .simple-lightbox-next:hover {
                background: white;
                transform: translateY(-50%) scale(1.1);
            }
            
            .simple-lightbox-prev {
                left: 1rem;
            }
            
            .simple-lightbox-next {
                right: 1rem;
            }
            
            .simple-lightbox-prev svg,
            .simple-lightbox-next svg {
                width: 24px;
                height: 24px;
                color: #111;
            }
            
            .simple-lightbox-counter {
                position: absolute;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.9);
                padding: 0.5rem 1.5rem;
                border-radius: 2rem;
                font-size: 0.875rem;
                font-weight: 600;
                color: #111;
            }
            
            .modal-image-zoom-indicator {
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 0.75rem;
                border-radius: 50%;
                font-size: 1.2rem;
                z-index: 10;
                pointer-events: none;
            }
            
            @media (max-width: 768px) {
                .simple-lightbox-close {
                    width: 44px;
                    height: 44px;
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);

        // Wait for modal image to be available
        setTimeout(addClickHandlerToModalImage, 500);
    }

    function addClickHandlerToModalImage() {
        const modalImage = document.getElementById('modalImage');
        if (!modalImage) {
            setTimeout(addClickHandlerToModalImage, 500);
            return;
        }

        const imageContainer = modalImage.parentElement;
        if (!imageContainer) return;

        // Zoom indicator removed as per user request

        // Make container clickable
        imageContainer.style.cursor = 'zoom-in';

        // Add click handler
        imageContainer.addEventListener('click', function (e) {
            if (e.target.closest('#modalThumbnails')) return;

            // Get all product images
            const productImagesData = imageContainer.dataset.productImages ||
                imageContainer.getAttribute('data-product-images');

            let images = [];
            if (productImagesData) {
                try {
                    images = JSON.parse(productImagesData);
                } catch (err) {
                    images = [modalImage.src];
                }
            } else {
                images = [modalImage.src];
            }

            // Find current image index
            const currentSrc = modalImage.src;
            const index = images.findIndex(img =>
                currentSrc.includes(img) || img.includes(currentSrc.split('/').pop())
            );

            window.openSimpleLightbox(images, index >= 0 ? index : 0);
        });
    }

    // Global functions
    window.openSimpleLightbox = function (images, startIndex = 0) {
        if (typeof images === 'string') {
            currentImages = [images];
            currentIndex = 0;
        } else {
            currentImages = images || [];
            currentIndex = startIndex;
        }

        if (currentImages.length === 0) return;

        const lightbox = document.getElementById('simpleLightbox');
        const prevBtn = lightbox.querySelector('.simple-lightbox-prev');
        const nextBtn = lightbox.querySelector('.simple-lightbox-next');
        const counter = lightbox.querySelector('.simple-lightbox-counter');

        // Show/hide navigation based on number of images
        if (currentImages.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            counter.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            counter.style.display = 'none';
        }

        updateLightboxImage();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.navigateLightbox = function (direction) {
        currentIndex += direction;

        // Loop around
        if (currentIndex < 0) {
            currentIndex = currentImages.length - 1;
        } else if (currentIndex >= currentImages.length) {
            currentIndex = 0;
        }

        updateLightboxImage();
    };

    function updateLightboxImage() {
        const lightbox = document.getElementById('simpleLightbox');
        const img = lightbox.querySelector('.simple-lightbox-image');
        const counter = lightbox.querySelector('.simple-lightbox-counter');

        img.src = currentImages[currentIndex];

        if (currentImages.length > 1) {
            counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
    }

    window.closeSimpleLightbox = function () {
        const lightbox = document.getElementById('simpleLightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        currentImages = [];
        currentIndex = 0;
    };

    // Close on background click
    document.addEventListener('click', function (e) {
        const lightbox = document.getElementById('simpleLightbox');
        if (e.target === lightbox) {
            window.closeSimpleLightbox();
        }
    });

    // Close on ESC key, navigate with arrow keys
    document.addEventListener('keydown', function (e) {
        const lightbox = document.getElementById('simpleLightbox');
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                window.closeSimpleLightbox();
            } else if (e.key === 'ArrowLeft') {
                window.navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                window.navigateLightbox(1);
            }
        }
    });

    // Expose setup function
    window.setupModalImageClick = addClickHandlerToModalImage;

})();
