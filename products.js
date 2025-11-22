// ==============================
// CONFIGURACIÓN: TUS PRODUCTOS
// ==============================
// Modifica este array para añadir / quitar / editar productos.
// Solo tú, editando este archivo, puedes cambiar el catálogo.
const PRODUCTS = [
    // MAQUILLAJE
    {
        id: 1,
        nombre: "Labial Mate Rojo Intenso",
        categoria: "Maquillaje",
        subcategoria: "Labios",
        genero: "unisex",
        precio: 5.99,
        descripcion: "Labial líquido mate de larga duración, tono rojo intenso.",
        imagen: "images/labial_rojo_1763621934449.png",
        disponible: true,
    },
    {
        id: 2,
        nombre: "Base Líquida Full Cover",
        categoria: "Maquillaje",
        subcategoria: "Rostro",
        genero: "mujer",
        precio: 8.99,
        descripcion: "Base de alta cobertura, acabado natural. Varios tonos.",
        imagen: "images/base_liquida_1763621940256.png",
        disponible: true,
    },

    // ZAPATOS
    {
        id: 3,
        nombre: "Tenis Deportivos Blancos",
        categoria: "Zapatos",
        subcategoria: "Tenis",
        genero: "hombre",
        precio: 29.99,
        descripcion: "Tenis blancos casuales, cómodos para uso diario.",
        imagen: "images/tenis_blancos_1763621945598.png",
        disponible: true,
    },
    {
        id: 4,
        nombre: "Sandalias Elegantes Negras",
        categoria: "Zapatos",
        subcategoria: "Sandalias",
        genero: "mujer",
        precio: 39.99,
        descripcion: "Sandalias de tacón medio, perfectas para eventos.",
        imagen: "images/sandalias_negras_1763621955885.png",
        disponible: true,
    },

    // ROPA - HOMBRE
    {
        id: 5,
        nombre: "Pullover Básico Blanco",
        categoria: "Ropa",
        subcategoria: "Pullover",
        genero: "hombre",
        precio: 9.99,
        descripcion: "Pullover de algodón, cuello redondo, color blanco.",
        imagen: "images/pullover_hombre_1763621961215.png",
        disponible: true,
    },
    {
        id: 6,
        nombre: "Pantalón Jeans Azul",
        categoria: "Ropa",
        subcategoria: "Pantalón",
        genero: "hombre",
        precio: 24.99,
        descripcion: "Jeans azul clásico, corte recto.",
        imagen: "images/jeans_hombre_1763621967388.png",
        disponible: true,
    },

    // ROPA - MUJER
    {
        id: 7,
        nombre: "Shorts de Mezclilla",
        categoria: "Ropa",
        subcategoria: "Shorts",
        genero: "mujer",
        precio: 22.99,
        descripcion: "Shorts de mezclilla, tiro alto.",
        imagen: "images/shorts_mujer_1763621973145.png",
        disponible: true,
    },
    {
        id: 8,
        nombre: "Pullover Oversize Rosa",
        categoria: "Ropa",
        subcategoria: "Pullover",
        genero: "mujer",
        precio: 17.5,
        descripcion: "Pullover oversize, color rosa pastel.",
        imagen: "images/pullover_mujer_1763621978863.png",
        disponible: true,
    },
    // NUEVO PRODUCTO DE EJEMPLO
    {
        id: 9,
        nombre: "Vestido Floral Verano",
        categoria: "Ropa",
        subcategoria: "Vestidos",
        genero: "mujer",
        precio: 35.00,
        descripcion: "Vestido ligero con estampado floral, ideal para el calor.",
        imagen: "images/vestido_floral_1763621984939.png",
        disponible: true,
    },

    // ============================
    // PREMIUM - MARCAS PREMIUM
    // ============================
    {
        id: 10,
        nombre: "Pantalón Premium Diseñador",
        categoria: "Premium",
        subcategoria: "Pantalones",
        genero: "hombre",
        precio: 89.99,
        descripcion: "Pantalón de marca premium, corte perfecto y tela de alta calidad.",
        imagen: "https://via.placeholder.com/400x300?text=Pantalon+Premium",
        disponible: true,
    },
    {
        id: 11,
        nombre: "Pullover Cashmere Lujo",
        categoria: "Premium",
        subcategoria: "Pullovers",
        genero: "mujer",
        precio: 149.99,
        descripcion: "Pullover de cashmere auténtico, suave y elegante.",
        imagen: "https://via.placeholder.com/400x300?text=Pullover+Premium",
        disponible: true,
    },
    {
        id: 12,
        nombre: "Shorts Premium Verano",
        categoria: "Premium",
        subcategoria: "Shorts",
        genero: "unisex",
        precio: 69.99,
        descripcion: "Shorts de marca reconocida, tela ligera y diseño exclusivo.",
        imagen: "https://via.placeholder.com/400x300?text=Shorts+Premium",
        disponible: true,
    },
    {
        id: 13,
        nombre: "Zapatos Deportivos Premium",
        categoria: "Premium",
        subcategoria: "Zapatos",
        genero: "unisex",
        precio: 199.99,
        descripcion: "Calzado deportivo de marca premium, tecnología avanzada y estilo único.",
        imagen: "https://via.placeholder.com/400x300?text=Zapatos+Premium",
        disponible: true,
    },
];
