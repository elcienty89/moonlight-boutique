// ==============================
// CONFIGURACIÓN: MONEDA
// ==============================
const EXCHANGE_RATE_API = 'https://api.allorigins.win/get?url=https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy';
const DEFAULT_EXCHANGE_RATE = 435; // Updated to actual rate (CUP per USD)
let currentExchangeRate = DEFAULT_EXCHANGE_RATE;

// ==============================
// CONFIGURACIÓN: WHATSAPP
// ==============================
const WHATSAPP_NUMBER = '17866917005'; // Tu número de WhatsApp con código de país



// Intentar obtener la tasa real
async function fetchExchangeRate() {
    const cachedRate = localStorage.getItem('exchangeRate');
    const cachedTime = localStorage.getItem('exchangeRateTime');

    // Usar cache si tiene menos de 1 hora
    if (cachedRate && cachedTime && (Date.now() - cachedTime < 3600000)) {
        currentExchangeRate = parseFloat(cachedRate);
        console.log('💰 Tasa USD (Cache):', currentExchangeRate);
        updatePricesInDOM();
        return;
    }

    try {
        const response = await fetch(EXCHANGE_RATE_API);
        const data = await response.json();

        if (data.contents) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            const textContent = doc.body.textContent;

            let foundRate = null;

            // Patrón 1: "1 USD = 325 CUP" (Texto explícito)
            const explicitMatch = textContent.match(/1\s*USD\s*=\s*(\d{3,4})\s*CUP/i);
            if (explicitMatch) {
                foundRate = parseFloat(explicitMatch[1]);
            }

            // Patrón 2: Buscar en celdas de tabla si el patrón 1 falla
            if (!foundRate) {
                const cells = doc.querySelectorAll('td, div, span');
                for (let cell of cells) {
                    if (cell.textContent.trim() === 'USD' || cell.textContent.includes('USD')) {
                        const priceMatch = cell.textContent.match(/(\d{3,4})/);
                        if (priceMatch) {
                            const val = parseFloat(priceMatch[0]);
                            if (val > 200 && val < 500) {
                                foundRate = val;
                                break;
                            }
                        }
                    }
                }
            }

            if (foundRate) {
                currentExchangeRate = foundRate;
                localStorage.setItem('exchangeRate', currentExchangeRate);
                localStorage.setItem('exchangeRateTime', Date.now());
                console.log('💰 Tasa USD (Actualizada - Mercado Informal):', currentExchangeRate);
                updatePricesInDOM();
            } else {
                console.warn('⚠️ No se pudo extraer una tasa válida, usando defecto:', DEFAULT_EXCHANGE_RATE);
            }
        }
    } catch (error) {
        console.error('❌ Error obteniendo tasa de cambio:', error);
    }
}

function updatePricesInDOM() {
    document.querySelectorAll('.price-display').forEach(el => {
        const usdPrice = parseFloat(el.dataset.usdPrice);
        if (!isNaN(usdPrice)) {
            const cupPrice = Math.round(usdPrice * currentExchangeRate);
            el.innerHTML = `$${usdPrice.toFixed(2)} <span class="text-sm text-gray-500 font-normal">(~${cupPrice} CUP)</span>`;
        }
    });
}

// Inicializar tasa
fetchExchangeRate();

// ==============================
// MODAL LOGIC
// ==============================

const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalWhatsappBtn = document.getElementById("modalWhatsappBtn");

function openModal(productId) {
    const p = PRODUCTS.find((prod) => prod.id === productId);
    if (!p) return;

    // Set main image
    modalImage.src = p.imagen;
    modalTitle.textContent = p.nombre;
    modalCategory.textContent = `${p.categoria} • ${p.subcategoria}`;
    modalDescription.textContent = p.descripcion;

    // CREATE GALLERY THUMBNAILS HERE
    createGalleryThumbnails(p);

    // Mostrar precios
    const cupPrice = Math.round(p.precio * currentExchangeRate);
    modalPrice.innerHTML = `<span class="price-display" data-usd-price="${p.precio}">$${p.precio.toFixed(2)} <span class="text-lg text-gray-500 font-normal">(~${cupPrice} CUP)</span></span>`;

    // Configurar botón de WhatsApp del modal
    modalWhatsappBtn.onclick = () => contactarWhatsApp(p.id);

    // Store product images for lightbox navigation
    const imageContainer = modalImage.parentElement;
    if (imageContainer) {
        const images = p.imagenes && p.imagenes.length > 0 ? p.imagenes : [p.imagen];
        imageContainer.dataset.productImages = JSON.stringify(images);
    }

    if (window.setupModalImageClick) {
        window.setupModalImageClick();
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function createGalleryThumbnails(product) {
    // Find or create thumbnails container
    let thumbnailsContainer = document.getElementById('modalThumbnails');
    const imageContainer = modalImage.parentElement;

    if (!imageContainer) return;

    // Remove existing arrows if any (to prevent duplicates)
    const existingArrows = imageContainer.querySelectorAll('.gallery-arrow');
    existingArrows.forEach(arrow => arrow.remove());

    // Create container if doesn't exist
    if (!thumbnailsContainer) {
        thumbnailsContainer = document.createElement('div');
        thumbnailsContainer.id = 'modalThumbnails';
        thumbnailsContainer.style.cssText = 'position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: row; gap: 8px; padding: 8px; background: rgba(0,0,0,0.6); border-radius: 8px; backdrop-filter: blur(8px); z-index: 20;';
        imageContainer.appendChild(thumbnailsContainer);
    }

    // Clear previous thumbnails
    thumbnailsContainer.innerHTML = '';

    // Hide if only one image
    if (!product.imagenes || product.imagenes.length <= 1) {
        thumbnailsContainer.style.display = 'none';
        return;
    }

    // Show and populate thumbnails
    thumbnailsContainer.style.display = 'flex';

    let currentImageIndex = 0;

    // Function to update image and active state
    const updateGalleryState = (index) => {
        currentImageIndex = index;
        const imgUrl = product.imagenes[index];

        // Fade out
        modalImage.style.opacity = '0';
        setTimeout(() => {
            modalImage.src = imgUrl;
            modalImage.style.opacity = '1';
        }, 200);

        // Update thumbnails styling
        const thumbs = thumbnailsContainer.querySelectorAll('img');
        thumbs.forEach((t, i) => {
            if (i === index) {
                t.style.borderColor = 'white';
                t.style.opacity = '1';
                t.style.transform = 'scale(1.1)';
            } else {
                t.style.borderColor = 'transparent';
                t.style.opacity = '0.7';
                t.style.transform = 'scale(1)';
            }
        });
    };

    // Create Thumbnails
    product.imagenes.forEach((img, i) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.style.cssText = `width: 48px; height: 48px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid ${i === 0 ? 'white' : 'transparent'}; transition: all 0.3s; opacity: ${i === 0 ? '1' : '0.7'};`;

        thumb.onmouseover = function () {
            if (i !== currentImageIndex) {
                this.style.transform = 'scale(1.1)';
                this.style.opacity = '1';
            }
        };

        thumb.onmouseout = function () {
            if (i !== currentImageIndex) {
                this.style.transform = 'scale(1)';
                this.style.opacity = '0.7';
            }
        };

        thumb.onclick = function () {
            updateGalleryState(i);
        };

        thumbnailsContainer.appendChild(thumb);
    });

    // Create Arrows
    const createArrow = (direction) => {
        const btn = document.createElement('button');
        // Increased z-index to 50, made background darker and solid for visibility
        btn.className = `gallery-arrow absolute top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 hover:bg-black ${direction === 'prev' ? 'left-2' : 'right-2'}`;
        btn.innerHTML = direction === 'prev'
            ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>'
            : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';

        btn.onclick = (e) => {
            e.preventDefault(); // Prevent default action
            e.stopPropagation(); // Stop event bubbling
            if (direction === 'prev') {
                const newIndex = (currentImageIndex - 1 + product.imagenes.length) % product.imagenes.length;
                updateGalleryState(newIndex);
            } else {
                const newIndex = (currentImageIndex + 1) % product.imagenes.length;
                updateGalleryState(newIndex);
            }
        };
        return btn;
    };

    imageContainer.appendChild(createArrow('prev'));
    imageContainer.appendChild(createArrow('next'));

    console.log('✅ Gallery created with arrows for', product.imagenes.length, 'images');
}

function closeModal(event) {
    if (event && event.target !== modal && !event.target.closest('button')) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

window.openModal = openModal;
window.closeModal = closeModal;

// ==============================
// LÓGICA DE FILTROS Y RENDER
// ==============================

const categorySelect = document.getElementById("categoryFilter");
const subcategorySelect = document.getElementById("subcategoryFilter");
const genderSelect = document.getElementById("genderFilter");
const searchInput = document.getElementById("searchInput");
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");

const filters = {
    categoria: "todas",
    subcategoria: "todas",
    genero: "todos",
    search: "",
};

function initFilters() {
    if (!categorySelect || !genderSelect) return;

    // Llenar categorías
    categorySelect.innerHTML = '<option value="todas">Todas</option>';
    const categorias = Array.from(new Set(PRODUCTS.map((p) => p.categoria))).sort();

    categorias.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });

    // Llenar géneros
    if (genderSelect.options.length === 0) {
        const generos = ["todos", "mujer", "hombre", "unisex"];
        generos.forEach(gen => {
            const opt = document.createElement("option");
            opt.value = gen;
            opt.textContent = gen.charAt(0).toUpperCase() + gen.slice(1);
            genderSelect.appendChild(opt);
        });
    }

    updateSubcategoriesOptions();

    categorySelect.addEventListener("change", () => {
        filters.categoria = categorySelect.value;
        updateSubcategoriesOptions();
        filters.subcategoria = "todas";
        subcategorySelect.value = "todas";
        applyFilters();
    });

    subcategorySelect.addEventListener("change", () => {
        filters.subcategoria = subcategorySelect.value;
        applyFilters();
    });

    genderSelect.addEventListener("change", () => {
        filters.genero = genderSelect.value;
        applyFilters();
    });

    searchInput.addEventListener("input", () => {
        filters.search = searchInput.value.toLowerCase();
        applyFilters();
    });
}

function updateSubcategoriesOptions() {
    if (!subcategorySelect) return;

    subcategorySelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "todas";
    defaultOpt.textContent = "Todas";
    subcategorySelect.appendChild(defaultOpt);

    const subcatsSet = new Set();

    PRODUCTS.forEach((p) => {
        if (filters.categoria === "todas" || p.categoria === filters.categoria) {
            subcatsSet.add(p.subcategoria);
        }
    });

    Array.from(subcatsSet).sort().forEach((sub) => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.textContent = sub;
        subcategorySelect.appendChild(opt);
    });
}

function applyFilters() {
    let filtered = PRODUCTS.filter((p) => p.disponible !== false);

    if (filters.categoria !== "todas") {
        filtered = filtered.filter((p) => p.categoria === filters.categoria);
    }

    if (filters.subcategoria !== "todas") {
        filtered = filtered.filter((p) => p.subcategoria === filters.subcategoria);
    }

    if (filters.genero !== "todos") {
        filtered = filtered.filter((p) => p.genero === filters.genero);
    }

    if (filters.search && filters.search.trim() !== "") {
        filtered = filtered.filter((p) => {
            const texto = (p.nombre + " " + p.descripcion).toLowerCase();
            return texto.includes(filters.search);
        });
    }

    renderProducts(filtered);
}

function renderProducts(list) {
    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (list.length === 0) {
        productGrid.innerHTML = '<p class="text-lg text-gray-400 col-span-full text-center py-16">No encontramos productos que coincidan con tu búsqueda.</p>';
        if (productCount) productCount.textContent = "0 productos";
        return;
    }

    if (productCount) {
        productCount.textContent = list.length === 1 ? "1 producto" : list.length + " productos";
    }

    list.forEach((p) => {
        const card = document.createElement("article");
        card.className = "product-card bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300";
        card.onclick = () => openModal(p.id);

        // Badge Logic (sin descuentos)
        let badgeHtml = '';
        if (p.categoria === "Premium") {
            badgeHtml = `<span class="badge-premium absolute top-4 left-4 z-10">Premium</span>`;
        } else {
            badgeHtml = `<span class="absolute top-4 left-4 bg-white/90 backdrop-filter backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 rounded-full shadow-sm z-10">${p.categoria}</span>`;
        }

        // Price Logic (sin descuentos)
        let cupPrice = Math.round(p.precio * currentExchangeRate);
        let priceHtml = `<span class="price-display text-2xl font-black text-gray-900" data-usd-price="${p.precio}">$${p.precio.toFixed(2)} <span class="text-sm text-gray-500 font-normal">(~${cupPrice} CUP)</span></span>`;

        card.innerHTML = `
      <div class="relative bg-gray-50 overflow-hidden" style="aspect-ratio: 1/1;">
        <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/600x600?text=Sin+Imagen';"/>
        ${badgeHtml}
      </div>
      
      <div class="p-6 flex-1 flex flex-col">
        <div class="mb-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">${p.subcategoria}</p>
            <h3 class="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">${p.nombre}</h3>
        </div>
        <p class="text-sm text-gray-600 mb-4 line-clamp-2">${p.descripcion}</p>
        
        <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          ${priceHtml}
          <button class="whatsapp-btn bg-black hover:bg-gray-800 text-white font-semibold py-2 px-3 sm:py-2.5 sm:px-5 rounded-full transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-lg whitespace-nowrap" onclick="event.stopPropagation(); contactarWhatsApp(${p.id})">
            <span class="hidden sm:inline">WhatsApp</span>
            <span class="inline sm:hidden">WA</span>
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
          </button>
        </div>
      </div>
    `;
        productGrid.appendChild(card);
    });
}

function contactarWhatsApp(productId) {
    const producto = PRODUCTS.find((p) => p.id === productId);
    if (!producto) return;

    // Precio sin descuento para el mensaje de WhatsApp
    const precioTexto = `$${producto.precio.toFixed(2)}`;

    const mensaje = encodeURIComponent(
        `Hola, estoy interesada(o) en este producto:\n\n` +
        `Nombre: ${producto.nombre}\n` +
        `Categoría: ${producto.categoria} / ${producto.subcategoria}\n` +
        `Género: ${producto.genero}\n` +
        `Precio: ${precioTexto}\n\n` +
        `¿Está disponible?`
    );

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, "_blank");
}

window.contactarWhatsApp = contactarWhatsApp;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    applyFilters();
});

// ==============================
// FUNCIONES GLOBALES PARA HTML
// ==============================

window.filterByCategory = function (category) {
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect) {
        categorySelect.value = category;
        categorySelect.dispatchEvent(new Event('change'));
    }

    // Actualizar estado visual de los botones
    const evt = window.event;
    if (evt && evt.currentTarget) {
        const clickedBtn = evt.currentTarget;
        const container = clickedBtn.parentElement;

        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
    }
};

window.filterByGender = function (gender) {
    const genderSelect = document.getElementById('genderFilter');
    if (genderSelect) {
        genderSelect.value = gender;
        genderSelect.dispatchEvent(new Event('change'));
    }

    // Actualizar estado visual de los botones
    const evt = window.event;
    if (evt && evt.currentTarget) {
        const clickedBtn = evt.currentTarget;
        const container = clickedBtn.parentElement;

        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'active-mujer', 'active-hombre');
        });

        if (gender === 'mujer') clickedBtn.classList.add('active-mujer');
        else if (gender === 'hombre') clickedBtn.classList.add('active-hombre');
        else clickedBtn.classList.add('active');
    }
};
