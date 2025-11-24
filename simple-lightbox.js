// Simple Image Lightbox - Click image to view full screen
(function () {
    'use strict';

    // Create lightbox HTML
    const lightboxHTML = `
        <div id="simpleLightbox" class="simple-lightbox" style="display: none;">
            <button class="simple-lightbox-close" onclick="window.closeSimpleLightbox()">✕</button>
            <img class="simple-lightbox-image" src="" alt="">
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
            // Try again later
            setTimeout(addClickHandlerToModalImage, 500);
            return;
        }

        const imageContainer = modalImage.parentElement;
        if (!imageContainer) return;

        // Add zoom indicator
        if (!imageContainer.querySelector('.modal-image-zoom-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'modal-image-zoom-indicator';
            indicator.innerHTML = '🔍';
            imageContainer.appendChild(indicator);
        }

        // Make container clickable
        imageContainer.style.cursor = 'zoom-in';

        // Add click handler
        imageContainer.addEventListener('click', function (e) {
            // Don't trigger if clicking thumbnails
            if (e.target.closest('#modalThumbnails')) return;

            const imgSrc = modalImage.src;
            if (imgSrc) {
                window.openSimpleLightbox(imgSrc);
            }
        });
    }

    // Global functions
    window.openSimpleLightbox = function (imageSrc) {
        const lightbox = document.getElementById('simpleLightbox');
        const img = lightbox.querySelector('.simple-lightbox-image');

        img.src = imageSrc;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeSimpleLightbox = function () {
        const lightbox = document.getElementById('simpleLightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    // Close on background click
    document.addEventListener('click', function (e) {
        const lightbox = document.getElementById('simpleLightbox');
        if (e.target === lightbox) {
            window.closeSimpleLightbox();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closeSimpleLightbox();
        }
    });

})();
