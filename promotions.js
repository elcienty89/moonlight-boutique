// ======================================
// CONFIGURACIÓN DE PROMOCIONES FLASH
// ======================================
// Modifica este archivo para activar/desactivar promociones

const PROMOTIONS = {
    // Activar/desactivar promociones
    active: true,

    // Fechas de la promoción (formato ISO)
    startDate: "2025-11-20T00:00:00",
    endDate: "2025-11-30T23:59:59",

    // Información de la promoción
    title: "BLACK FRIDAY",
    message: "Hasta 50% de descuento en productos seleccionados",

    // IDs de productos en promoción y su descuento
    discounts: {
        1: 20,  // Labial Mate - 20% descuento
        3: 30,  // Tenis Blancos - 30% descuento
        5: 25,  // Pullover Básico - 25% descuento
        7: 40,  // Shorts Mezclilla - 40% descuento
        9: 35   // Vestido Floral - 35% descuento
    }
};

// Función para verificar si la promoción está activa
function isPromotionActive() {
    if (!PROMOTIONS.active) return false;

    const now = new Date();
    const start = new Date(PROMOTIONS.startDate);
    const end = new Date(PROMOTIONS.endDate);

    return now >= start && now <= end;
}

// Función para obtener el descuento de un producto
function getProductDiscount(productId) {
    if (!isPromotionActive()) return 0;
    return PROMOTIONS.discounts[productId] || 0;
}

// Función para calcular el precio con descuento
function getDiscountedPrice(productId, originalPrice) {
    const discount = getProductDiscount(productId);
    if (discount === 0) return originalPrice;

    return originalPrice * (1 - discount / 100);
}

// Función para obtener tiempo restante de promoción
function getTimeRemaining() {
    if (!isPromotionActive()) return null;

    const now = new Date();
    const end = new Date(PROMOTIONS.endDate);
    const diff = end - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}
