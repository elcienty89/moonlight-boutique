// ==============================
// CONFIGURACIÓN WHATSAPP
// ==============================
// Pon aquí tu número de WhatsApp en formato internacional sin signos.
// Ejemplo para USA: 17861234567
const WHATSAPP_NUMBER = "17866917005"; // <-- CAMBIA ESTO

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
    modalDescription.textContent = p.descripcion;
    modalPrice.textContent = `$${p.precio.toFixed(2)}`;

    // Configurar botón de WhatsApp del modal
    modalWhatsappBtn.onclick = () => contactarWhatsApp(p.id);

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function closeModal(event) {
    // Si se pasa un evento (click fuera), verificar que sea en el fondo
    if (event && event.target !== modal && !event.target.closest('button')) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// Hacer global para usar en HTML
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
    // Llenar categorías
    const categorias = Array.from(
        new Set(PRODUCTS.map((p) => p.categoria))
    ).sort();

    categorias.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });

    updateSubcategoriesOptions();

    // Listeners
    categorySelect.addEventListener("change", () => {
        filters.categoria = categorySelect.value;
        // Cuando cambia la categoría, reiniciamos subcategoría
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
    // Limpiar subcategorías actuales
    subcategorySelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "todas";
    defaultOpt.textContent = "Todas";
    subcategorySelect.appendChild(defaultOpt);

    // Obtener subcategorías según categoría seleccionada (o todas si 'todas')
    const subcatsSet = new Set();

    PRODUCTS.forEach((p) => {
        if (
            filters.categoria === "todas" ||
            p.categoria === filters.categoria
        ) {
            subcatsSet.add(p.subcategoria);
        }
    });

    Array.from(subcatsSet)
        .sort()
        .forEach((sub) => {
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
        filtered = filtered.filter(
            (p) => p.subcategoria === filters.subcategoria
        );
    }

    if (filters.genero !== "todos") {
        filtered = filtered.filter((p) => p.genero === filters.genero);
    }

    if (filters.search && filters.search.trim() !== "") {
        filtered = filtered.filter((p) => {
            const texto =
                (p.nombre + " " + p.descripcion).toLowerCase();
            return texto.includes(filters.search);
        });
    }

    renderProducts(filtered);
}

function renderProducts(list) {
    productGrid.innerHTML = "";

    if (list.length === 0) {
        productGrid.innerHTML =
            '<p class="text-sm text-gray-500 col-span-full text-center py-8">No hay productos que coincidan con los filtros.</p>';
        productCount.textContent = "0 productos";
        return;
    }

    productCount.textContent =
        list.length === 1
            ? "1 producto encontrado"
            : list.length + " productos encontrados";

    list.forEach((p) => {
        const card = document.createElement("article");
        // Premium Card Styles
        card.className =
            "bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer group transform hover:-translate-y-1";

        // Al hacer click en la tarjeta, abrimos el modal
        card.onclick = () => openModal(p.id);

        card.innerHTML = `
      <div class="h-64 bg-gray-100 overflow-hidden relative">
        <img
          src="${p.imagen}"
          alt="${p.nombre}"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen';"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500"></div>
        
        <!-- Badge de categoría flotante -->
        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-800 rounded-full shadow-sm">
            ${p.categoria}
        </span>
      </div>
      
      <div class="p-5 flex-1 flex flex-col">
        <div class="mb-2">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">
            ${p.subcategoria}
            </p>
            <h3 class="text-lg font-serif font-bold text-gray-900 leading-tight group-hover:text-indigo-900 transition-colors">
            ${p.nombre}
            </h3>
        </div>
        
        <p class="text-sm text-gray-600 mb-4 line-clamp-2 font-light">
          ${p.descripcion}
        </p>
        
        <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <span class="text-xl font-serif font-bold text-gray-900">
            $${p.precio.toFixed(2)}
          </span>
          <button
            class="text-xs bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
            onclick="event.stopPropagation(); contactarWhatsApp(${p.id})"
          >
            <span>WhatsApp</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
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

    const mensaje = encodeURIComponent(
        `Hola, estoy interesada(o) en este producto:\n\n` +
        `Nombre: ${producto.nombre}\n` +
        `Categoría: ${producto.categoria} / ${producto.subcategoria}\n` +
        `Género: ${producto.genero}\n` +
        `Precio: $${producto.precio.toFixed(2)}\n\n` +
        `¿Está disponible?`
    );

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, "_blank");
}

// Hacemos global la función para que el botón la pueda usar
window.contactarWhatsApp = contactarWhatsApp;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    applyFilters();
});
