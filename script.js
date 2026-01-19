// ==============================
// CONFIGURACIÓN: MONEDA
// ==============================
const EXCHANGE_RATE_API = 'https://api.allorigins.win/get?url=https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy';
const DEFAULT_EXCHANGE_RATE = 488;
let currentExchangeRate = DEFAULT_EXCHANGE_RATE;

// Intentar obtener la tasa real
async function fetchExchangeRate() {
  const cachedRate = localStorage.getItem('exchangeRate');
  const cachedTime = localStorage.getItem('exchangeRateTime');

  if (cachedRate && cachedTime && (Date.now() - cachedTime < 3600000)) {
    currentExchangeRate = parseFloat(cachedRate);
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
      const explicitMatch = textContent.match(/1\s*USD\s*=\s*(\d{3,4})\s*CUP/i);
      if (explicitMatch) {
        foundRate = parseFloat(explicitMatch[1]);
      }

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
        updatePricesInDOM();
      }
    }
  } catch (error) {
    console.error('❌ Error obteniendo tasa de cambio:', error);
  }
}

function updatePricesInDOM() {
  document.querySelectorAll('.price-display').forEach(el => {
    const usdPrice = parseFloat(el.dataset.usdPrice);
    if (isNaN(usdPrice)) return;

    const cupPrice = Math.round(usdPrice * currentExchangeRate);

    const usdSpan = el.querySelector('.price-usd');
    if (usdSpan) {
      usdSpan.textContent = `$${usdPrice.toFixed(2)}`;
    }

    const cupSpan = el.querySelector('.cup-amount');
    if (cupSpan) {
      cupSpan.textContent = `(~${cupPrice} CUP)`;
    }
  });
}

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

  modalImage.src = p.imagen;
  modalTitle.textContent = p.nombre;
  modalCategory.textContent = `${p.categoria} • ${p.subcategoria}`;

  // AQUÍ SÍ SE MUESTRA LA DESCRIPCIÓN (DENTRO DEL MODAL)
  modalDescription.textContent = p.descripcion || "";

  createGalleryThumbnails(p);

  const cupPrice = Math.round(p.precio * currentExchangeRate);
  let modalPriceHtml = "";

  if (typeof p.oldPrice === "number") {
    modalPriceHtml = `
      <div class="flex flex-col gap-1">
        <div class="flex items-baseline gap-3">
          <span class="text-lg font-bold text-red-500 line-through">
            $${p.oldPrice.toFixed(2)}
          </span>
          <span class="price-display text-3xl font-black text-white" data-usd-price="${p.precio}">
            <span class="price-usd block leading-tight">
              $${p.precio.toFixed(2)}
            </span>
            <span class="cup-amount block text-xs sm:text-sm text-gray-400 font-normal leading-tight mt-0.5">
              (~${cupPrice} CUP)
            </span>
          </span>
        </div>
      </div>
    `;
  } else {
    modalPriceHtml = `
      <span class="price-display text-3xl font-black text-white" data-usd-price="${p.precio}">
        <span class="price-usd block leading-tight">
          $${p.precio.toFixed(2)}
        </span>
        <span class="cup-amount block text-xs sm:text-sm text-gray-400 font-normal leading-tight mt-0.5">
          (~${cupPrice} CUP)
        </span>
      </span>
    `;
  }

  modalPrice.innerHTML = modalPriceHtml;
  modalWhatsappBtn.onclick = () => contactarWhatsApp(p.id);

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

  updatePricesInDOM();
}

function createGalleryThumbnails(product) {
  let thumbnailsContainer = document.getElementById('modalThumbnails');
  const imageContainer = modalImage.parentElement;
  if (!imageContainer) return;

  const existingArrows = imageContainer.querySelectorAll('.gallery-arrow');
  existingArrows.forEach(arrow => arrow.remove());

  if (!thumbnailsContainer) {
    thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.id = 'modalThumbnails';
    thumbnailsContainer.style.cssText = 'position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: row; gap: 8px; padding: 8px; background: rgba(0,0,0,0.8); border-radius: 8px; backdrop-filter: blur(8px); z-index: 20; border: 1px solid #333;';
    imageContainer.appendChild(thumbnailsContainer);
  }

  thumbnailsContainer.innerHTML = '';
  if (!product.imagenes || product.imagenes.length <= 1) {
    thumbnailsContainer.style.display = 'none';
    return;
  }

  thumbnailsContainer.style.display = 'flex';
  let currentImageIndex = 0;

  const updateGalleryState = (index) => {
    currentImageIndex = index;
    const imgUrl = product.imagenes[index];
    modalImage.style.opacity = '0';
    setTimeout(() => {
      modalImage.src = imgUrl;
      modalImage.style.opacity = '1';
    }, 200);
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

  const createArrow = (direction) => {
    const btn = document.createElement('button');
    btn.className = `gallery-arrow absolute top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 hover:bg-white hover:text-black border border-gray-700 ${direction === 'prev' ? 'left-2' : 'right-2'}`;
    btn.innerHTML = direction === 'prev'
      ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>'
      : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
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
}

function closeModal(event) {
  if (event && event.target !== modal && !event.target.closest('button')) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

window.openModal = openModal;
window.closeModal = closeModal;

// ==============================
// FILTROS Y RENDER
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
  categorySelect.innerHTML = '<option value="todas">Todas</option>';
  const categorias = Array.from(new Set(PRODUCTS.map((p) => p.categoria))).sort();

  categorias.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

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
    const premiumInfo = document.getElementById('premiumInfo');
    if (premiumInfo) {
      if (filters.categoria === 'Premium') {
        premiumInfo.classList.remove('hidden');
      } else {
        premiumInfo.classList.add('hidden');
      }
    }
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

  if (filters.categoria !== "todas") filtered = filtered.filter((p) => p.categoria === filters.categoria);
  if (filters.subcategoria !== "todas") filtered = filtered.filter((p) => p.subcategoria === filters.subcategoria);
  if (filters.genero !== "todos") filtered = filtered.filter((p) => p.genero === filters.genero);
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
    productGrid.innerHTML =
      '<p class="text-lg text-gray-400 col-span-full text-center py-16">No encontramos productos que coincidan con tu búsqueda.</p>';
    if (productCount) productCount.textContent = "0 productos";
    return;
  }

  if (productCount) {
    productCount.textContent = list.length === 1 ? "1 producto" : list.length + " productos";
  }

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className =
      "product-card border border-gray-800 rounded-2xl overflow-hidden flex flex-col cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300";
    card.onclick = () => openModal(p.id);

    // Spotlight & 3D Tilt Effect Tracking
    card.onmouseenter = () => {
      // Remove transition for instant response during movement
      card.style.transition = 'none';
    };

    card.onmousemove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spotlight position
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // 3D Tilt Math
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Calculate rotation (max 8 degrees to keep it subtle but premium)
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    card.onmouseleave = () => {
      // Add transition for smooth reset
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    // BADGES LOGIC
    let badgeHtml = '';
    if (p.categoria === "Premium") {
      badgeHtml = `<span class="badge-neon badge-premium">Premium</span>`;
    } else if (p.categoria === "Ropa") {
      badgeHtml = `<span class="badge-neon badge-ropa">Ropa</span>`;
    } else {
      badgeHtml = `<span class="badge-neon badge-normal">${p.categoria}</span>`;
    }

    const cupPrice = Math.round(p.precio * currentExchangeRate);
    let priceHtml = "";

    if (typeof p.oldPrice === "number") {
      priceHtml = `
        <div class="flex flex-col items-start gap-0.5">
          <span class="text-xs sm:text-sm font-bold text-red-500 line-through opacity-80">$${p.oldPrice.toFixed(2)}</span>
          <span class="price-display text-2xl font-black text-white" data-usd-price="${p.precio}">
            <span class="price-usd block leading-tight">$${p.precio.toFixed(2)}</span>
            <span class="cup-amount block text-[0.70rem] sm:text-xs text-gray-400 font-normal leading-tight mt-0.5">(~${cupPrice} CUP)</span>
          </span>
        </div>
      `;
    } else {
      priceHtml = `
        <span class="price-display text-2xl font-black text-white" data-usd-price="${p.precio}">
          <span class="price-usd block leading-tight">$${p.precio.toFixed(2)}</span>
          <span class="cup-amount block text-[0.70rem] sm:text-xs text-gray-400 font-normal leading-tight mt-0.5">(~${cupPrice} CUP)</span>
        </span>
      `;
    }

    // TARJETA RENDERIZADA (ESTILO CLÁSICO RESTAURADO)
    card.innerHTML = `
      <div class="relative overflow-hidden" style="aspect-ratio: 1/1;">
        <img src="${p.imagen}" alt="${p.nombre}"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onerror="this.src='https://via.placeholder.com/600x600?text=Sin+Imagen';"/>
        ${badgeHtml}
      </div>
      
      <div class="p-3 sm:p-6 flex-1 flex flex-col">
        <div class="mb-3">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">${p.subcategoria}</p>
          <h3 class="product-title ${p.categoria === 'Premium' ? 'product-title-premium' : ''}">
            ${p.nombre}
          </h3>
        </div>
        
        <div class="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div class="flex-1 min-w-0 flex flex-col justify-center items-start">
            ${priceHtml}
          </div>
          
          <button
            class="whatsapp-btn flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all active:scale-95 hover:brightness-110 shadow-lg shadow-green-900/20"
            onclick="event.stopPropagation(); contactarWhatsApp(${p.id});">
            <span>Wsp</span>
            <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.08 1.6 5.85L0 24l6.35-1.66A11.9 11.9 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82a9.76 9.76 0 01-4.98-1.36l-.36-.21-3.77 1 1.01-3.67-.24-.38A9.78 9.78 0 012.18 12C2.18 7 7 2.18 12 2.18c2.61 0 5.07 1.02 6.92 2.88A9.73 9.73 0 0121.82 12c0 5-4.82 9.82-9.82 9.82zm5.12-7.27c-.28-.14-1.65-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.27-.74.9-.9 1.08-.17.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.37-1.63-1.53-1.9-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.19-.29.29-.48.1-.2.05-.36 0-.5-.05-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49l-.55-.01c-.19 0-.49.07-.75.34-.26.27-.99.97-.99 2.36 0 1.39 1.02 2.74 1.16 2.93.14.19 2 3.05 4.86 4.28.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.65-.68 1.88-1.33.23-.65.23-1.21.16-1.33-.07-.12-.25-.19-.53-.33z" />
            </svg>
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  });

  updatePricesInDOM();
}

function contactarWhatsApp(productId) {
  const producto = PRODUCTS.find((p) => p.id === productId);
  if (!producto) return;

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

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  applyFilters();
});

// ==============================
// --- CÓDIGO DEL CARRITO ELIMINADO ---
window.filterByCategory = function (category) {
  const categorySelect = document.getElementById('categoryFilter');
  if (categorySelect) {
    categorySelect.value = category;
    categorySelect.dispatchEvent(new Event('change'));
  }
  const evt = window.event;
  if (evt && evt.currentTarget) {
    const clickedBtn = evt.currentTarget;
    const container = clickedBtn.parentElement;
    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
  }
};

window.filterByGender = function (gender) {
  const genderSelect = document.getElementById('genderFilter');
  if (genderSelect) {
    genderSelect.value = gender;
    genderSelect.dispatchEvent(new Event('change'));
  }
  const evt = window.event;
  if (evt && evt.currentTarget) {
    const clickedBtn = evt.currentTarget;
    const container = clickedBtn.parentElement;
    container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active', 'active-mujer', 'active-hombre'));
    if (gender === 'mujer') clickedBtn.classList.add('active-mujer');
    else if (gender === 'hombre') clickedBtn.classList.add('active-hombre');
    else clickedBtn.classList.add('active');
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const rotatingWordEl = document.getElementById("rotating-word");
  if (!rotatingWordEl) return;

  const words = ["EXCLUSIVA", "PREMIUM", "ORIGINAL", "LIMITADA", "ÚNICA"];
  let index = 0;

  // Tiempo total entre cada palabra (3.5 segundos)
  setInterval(() => {
    // 1. APLICAR EFECTO DE SALIDA (Desenfocar)
    rotatingWordEl.classList.add("word-blur-hidden");

    // 2. ESPERAR A QUE TERMINE LA TRANSICIÓN (0.5s)
    setTimeout(() => {
      // 3. CAMBIAR LA PALABRA (mientras está invisible)
      index = (index + 1) % words.length;
      rotatingWordEl.textContent = words[index];

      // 4. QUITAR EFECTO (Volver a enfocar suavemente)
      rotatingWordEl.classList.remove("word-blur-hidden");
    }, 500); // Este tiempo (500ms) debe coincidir con el 'transition' de tu CSS

  }, 3500);
});
