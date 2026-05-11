import {
  Zap, Hammer, Droplet, Wrench, Pill, Leaf, HeartPulse,
  Cpu, Disc, Flame, Wind, Smile, Sparkles, ShieldPlus,
  Dumbbell, Weight, UserCheck, Activity, UtensilsCrossed, Wine,
  Users, Coffee, Croissant, Egg, CakeSlice, Sun, Building,
  Scissors, Stethoscope, ShoppingBag, Home, TrendingUp, Key,
  Briefcase, Calculator, Scale, FileText, Hand, Flower2,
  Crown, Palette, MousePointer, Settings, Gamepad2,
  Plane, Map, BookOpen, Mic, Building2, type LucideIcon
} from 'lucide-react';

export interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Article {
  title: string;
  category: string;
  readTime: string;
}

export interface TemplateData {
  id: string;
  name: string;
  niche: string;
  badge: string;
  accentColor: string;
  accentHex: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  servicesTitle: string;
  services: ServiceCard[];
  articles: Article[];
}

export const templates: TemplateData[] = [
  {
    id: 'foundry',
    name: 'FOUNDRY',
    niche: 'Ferreteria Industrial',
    badge: '// FERRETERIA INDUSTRIAL',
    accentColor: 'amber',
    accentHex: '#FFB800',
    heroImage: '/hero/foundry.jpg',
    heroTitle: 'Fuerza Industrial. Precision Total.',
    heroSubtitle: 'Suministros industriales de alto rendimiento para constructoras, talleres y profesionales del mantenimiento. Inventario real, entrega garantizada.',
    primaryCTA: 'VER CATALOGO',
    secondaryCTA: 'COTIZAR AHORA',
    servicesTitle: 'Linea de Suministros',
    services: [
      { icon: Zap, title: 'Herramientas Electricas', description: 'Taladros, amoladoras, sierras circulares y equipos profesionales de las mejores marcas. Garantia extendida.' },
      { icon: Hammer, title: 'Materiales de Construccion', description: 'Cemento, acero, varilla, block y acabados. Precios por mayoreo para proyectos grandes.' },
      { icon: Droplet, title: 'Tuberia y Plomeria', description: 'PVC, cobre, conexiones, bombas y accesorios hidraulicos. Asesoria tecnica incluida.' },
      { icon: Wrench, title: 'Ferreteria General', description: 'Tornilleria, anclaje, selladores, pintura y mas de 5,000 productos en stock permanente.' },
    ],
    articles: [
      { title: '5 Herramientas Indispensables para todo Constructor', category: 'Guia', readTime: '6 min' },
      { title: 'Como Elegir el Cemento Correcto para tu Proyecto', category: 'Tecnica', readTime: '4 min' },
      { title: 'Tendencias en Materiales de Construccion Sostenible 2025', category: 'Tendencias', readTime: '7 min' },
    ],
  },
  {
    id: 'vitalis',
    name: 'VITALIS',
    niche: 'Farmacia \u0026 Salud',
    badge: '// FARMACIA Y SALUD',
    accentColor: 'green',
    accentHex: '#39FF14',
    heroImage: '/hero/vitalis.jpg',
    heroTitle: 'Tu Salud. Nuestra Prioridad.',
    heroSubtitle: 'Farmacia integral con servicio de calidad, asesoria profesional y entrega a domicilio. Tu bienestar es nuestra mision.',
    primaryCTA: 'COMPRAR AHORA',
    secondaryCTA: 'SERVICIOS',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Pill, title: 'Farmacia', description: 'Medicamentos de patente y genericos. Surtido de recetas, control de chronicidad y seguimiento farmacoterapeutico.' },
      { icon: Leaf, title: 'Productos Naturales', description: 'Suplementos vitaminicos, productos homeopaticos y alternativas naturales para tu bienestar diario.' },
      { icon: HeartPulse, title: 'Atencion Domiciliaria', description: 'Entrega de medicamentos a domicilio, servicio de inyecciones y monitoreo de signos vitales a domicilio.' },
    ],
    articles: [
      { title: 'Guia Completa de Vitaminas Esenciales para Adultos Mayores', category: 'Salud', readTime: '5 min' },
      { title: 'Medicamentos Genericos vs. de Patente: Mitos y Realidades', category: 'Farmacia', readTime: '6 min' },
      { title: '5 Habitos para Fortalecer tu Sistema Inmunologico', category: 'Bienestar', readTime: '4 min' },
    ],
  },
  {
    id: 'torque',
    name: 'TORQUE',
    niche: 'Taller Mecanico',
    badge: '// TALLER MECANICO',
    accentColor: 'orange',
    accentHex: '#FF6B35',
    heroImage: '/hero/torque.jpg',
    heroTitle: 'Potencia sin Limites. Reparacion sin Excusas.',
    heroSubtitle: 'Diagnostico computarizado, servicio de frenos, suspension, transmision y mantenimiento preventivo. Tu auto en manos de expertos.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'DIAGNOSTICO GRATIS',
    servicesTitle: 'Servicios Automotrices',
    services: [
      { icon: Cpu, title: 'Diagnostico Computarizado', description: 'Escaneo completo del sistema electronico. Detectamos fallas en motor, transmision y sensores con equipo de ultima generacion.' },
      { icon: Disc, title: 'Frenos y Suspension', description: 'Revision, rectificado y cambio de balatas, discos, amortiguadores y sistema de direccion. Seguridad garantizada.' },
      { icon: Flame, title: 'Afinacion Mayor', description: 'Cambio de aceite, filtros, bujias, limpieza de inyectores y calibracion. Mejora el rendimiento y ahorra combustible.' },
      { icon: Wind, title: 'Clima Automotriz', description: 'Recarga de gas refrigerante, diagnostico de compresor y reparacion del sistema de aire acondicionado.' },
    ],
    articles: [
      { title: 'Senales de que tu Auto Necesita una Afinacion Urgente', category: 'Mantenimiento', readTime: '5 min' },
      { title: 'Frenos: Cuando Cambiarlos y como Extender su Vida Util', category: 'Seguridad', readTime: '6 min' },
      { title: 'Mitos del Aceite de Motor que todos los Mecanicos Conocen', category: 'Tecnica', readTime: '4 min' },
    ],
  },
  {
    id: 'prism',
    name: 'PRISM',
    niche: 'Clinica Dental',
    badge: '// CLINICA DENTAL',
    accentColor: 'cyan',
    accentHex: '#00F0FF',
    heroImage: '/hero/prism.jpg',
    heroTitle: 'Sonrisas Perfectas. Tecnologia Avanzada.',
    heroSubtitle: 'Clinica dental equipada con tecnologia de vanguardia. Ortodoncia invisible, blanqueamiento laser, implantes y estetica dental. Primera consulta gratuita.',
    primaryCTA: 'AGENDAR CONSULTA',
    secondaryCTA: 'VER TRATAMIENTOS',
    servicesTitle: 'Tratamientos Dentales',
    services: [
      { icon: Smile, title: 'Ortodoncia Invisible', description: 'Alineadores transparentes para corregir la posicion de tus dientes sin brackets metalicos. Resultados en 6-18 meses.' },
      { icon: Sparkles, title: 'Blanqueamiento Laser', description: 'Tecnologia de luz LED para aclarar hasta 8 tonos en una sola sesion. Resultados inmediatos y duraderos.' },
      { icon: ShieldPlus, title: 'Implantes Dentales', description: 'Reemplazo de dientes perdidos con implantes de titanio. Cirugia minimamente invasiva y recuperacion rapida.' },
    ],
    articles: [
      { title: 'Ortodoncia Invisible vs. Brackets: Cual es Mejor para Ti?', category: 'Ortodoncia', readTime: '7 min' },
      { title: 'Alimentos que Manchan tus Dientes y como Combatirlo', category: 'Higiene', readTime: '4 min' },
      { title: 'Todo lo que Debes Saber sobre Implantes Dentales', category: 'Implantes', readTime: '6 min' },
    ],
  },
  {
    id: 'forge',
    name: 'FORGE',
    niche: 'Gimnasio / Crossfit',
    badge: '// GIMNASIO / CROSSFIT',
    accentColor: 'red',
    accentHex: '#FF2D55',
    heroImage: '/hero/forge.jpg',
    heroTitle: 'Forja tu Mejor Version. Sin Excusas.',
    heroSubtitle: 'Entrenamiento funcional, CrossFit, musculacion y coaching nutricional. Equipamiento profesional y comunidad que te impulsa. Prueba tu primera clase gratis.',
    primaryCTA: 'CLASE DE PRUEBA GRATIS',
    secondaryCTA: 'VER PLANES',
    servicesTitle: 'Programas de Entrenamiento',
    services: [
      { icon: Dumbbell, title: 'CrossFit', description: 'WODs diarios que combinan levantamiento olimpico, gimnasia y cardio. Escalable para todos los niveles de condicion fisica.' },
      { icon: Weight, title: 'Musculacion', description: 'Area de peso libre, maquinas guidas y zona de cardio. Horario abierto con supervision de entrenadores certificados.' },
      { icon: UserCheck, title: 'Personal Training', description: 'Planes personalizados de entrenamiento y nutricion. Sesiones one-on-one con coaches certificados en NSCA y ACE.' },
      { icon: Activity, title: 'Yoga \u0026 Movilidad', description: 'Clases de yoga, stretching y movilidad articular para recuperacion, flexibilidad y prevencion de lesiones.' },
    ],
    articles: [
      { title: 'Rutina Full-Body de CrossFit para Principiantes', category: 'Entrenamiento', readTime: '6 min' },
      { title: 'Nutricion para Ganar Masa Muscular: La Guia Definitiva', category: 'Nutricion', readTime: '8 min' },
      { title: '5 Ejercicios que todos Hacen Mal (y como Corregirlos)', category: 'Tecnica', readTime: '5 min' },
    ],
  },
  {
    id: 'ember',
    name: 'EMBER',
    niche: 'Restaurante Gourmet',
    badge: '// RESTAURANTE GOURMET',
    accentColor: 'amber',
    accentHex: '#FFB800',
    heroImage: '/hero/ember.jpg',
    heroTitle: 'Sabor que Trasciende. Arte en cada Plato.',
    heroSubtitle: 'Cocina de autor con ingredientes locales y tecnicas internacionales. Menu degustacion, maridaje de vinos y experiencias gastronomicas unicas. Reserva tu mesa.',
    primaryCTA: 'RESERVAR MESA',
    secondaryCTA: 'VER MENU',
    servicesTitle: 'Experiencias Gastronomicas',
    services: [
      { icon: UtensilsCrossed, title: 'Menu Degustacion', description: '7 tiempos que exploran sabores, texturas y tecnicas. Ingredientes de temporada seleccionados de productores locales.' },
      { icon: Wine, title: 'Maridaje de Vinos', description: 'Seleccion de mas de 120 etiquetas internacionales. Nuestro sommelier crea el maridaje perfecto para cada platillo.' },
      { icon: Users, title: 'Cenas Privadas', description: 'Experiencias exclusivas para grupos de 8 a 24 personas. Menu personalizado, chef privado y ambiente intimo.' },
    ],
    articles: [
      { title: 'Tendencias Gastronomicas 2025: La Nueva Cocina Mexicana', category: 'Tendencias', readTime: '6 min' },
      { title: 'Guia de Maridaje: Vinos Tintos para Principiantes', category: 'Vinos', readTime: '5 min' },
      { title: 'El Secreto detras de un Buen Mole: Entrevista con el Chef', category: 'Cultura', readTime: '7 min' },
    ],
  },
  {
    id: 'brew',
    name: 'BREW',
    niche: 'Cafeteria / Panaderia',
    badge: '// CAFETERIA ARTESANAL',
    accentColor: 'amber',
    accentHex: '#FFB800',
    heroImage: '/hero/brew.jpg',
    heroTitle: 'Cada Taza, una Historia. Cada Bocado, un Arte.',
    heroSubtitle: 'Cafe de especialidad de origen unico, panaderia artesanal recien horneada y desayunos que despiertan los sentidos. Hecho a mano, servido con amor.',
    primaryCTA: 'VISITANOS',
    secondaryCTA: 'NUESTRO MENU',
    servicesTitle: 'Nuestro Menu',
    services: [
      { icon: Coffee, title: 'Cafe de Especialidad', description: 'Granos de origen unico tostados artesanalmente. Espresso, pour-over, cold brew y lattes con arte latte.' },
      { icon: Croissant, title: 'Panaderia Fresca', description: 'Croissants, danesas, conchas y pan de masa madre horneados cada madrugada con mantequilla importada.' },
      { icon: Egg, title: 'Desayunos', description: 'Chilaquiles gourmet, avocado toast, bowls de avena y omelettes personalizados. Servidos todo el dia.' },
      { icon: CakeSlice, title: 'Postres', description: 'Pasteles de autor, macarons, cheesecakes y postres de temporada. Disponibles por rebanada o enteros por pedido.' },
    ],
    articles: [
      { title: 'Guia del Cafe: Diferencias entre Arabica y Robusta', category: 'Cafe', readTime: '5 min' },
      { title: 'Secretos de la Panaderia Artesanal: La Masa Madre', category: 'Panaderia', readTime: '6 min' },
      { title: '5 Recetas de Desayuno para Empezar tu Dia con Energia', category: 'Recetas', readTime: '4 min' },
    ],
  },
  {
    id: 'atelier',
    name: 'ATELIER',
    niche: 'Boutique de Moda',
    badge: '// BOUTIQUE DE MODA',
    accentColor: 'purple',
    accentHex: '#B829F7',
    heroImage: '/hero/atelier.jpg',
    heroTitle: 'Tu Estilo. Tu Identidad. Sin Compromisos.',
    heroSubtitle: 'Colecciones curadas de diseñadores independientes y marcas emergentes. Moda que habla de quien eres. Nueva temporada disponible ahora.',
    primaryCTA: 'NUEVA COLECCION',
    secondaryCTA: 'TIENDA ONLINE',
    servicesTitle: 'Colecciones',
    services: [
      { icon: Sun, title: 'Primavera / Verano 2025', description: 'Colores vibrantes, telas ligeras y siluetas fluidas. Piezas versatiles para el dia y la noche.' },
      { icon: Building, title: 'Estilo Urbano', description: 'Streetwear de alta gama: sneakers limitados, chamarras oversized y accesorios statement.' },
      { icon: Scissors, title: 'Personal Styling', description: 'Sesion de asesoria de imagen personalizada. Definimos tu paleta de colores, siluetas y armario capsula.' },
    ],
    articles: [
      { title: 'Tendencias de Moda 2025: Lo que Sera Viral', category: 'Tendencias', readTime: '6 min' },
      { title: 'Como Crear un Armario Capsula con 30 Piezas', category: 'Estilo', readTime: '7 min' },
      { title: 'Diseñadores Mexicanos que estan Conquistando el Mundo', category: 'Cultura', readTime: '5 min' },
    ],
  },
  {
    id: 'haven',
    name: 'HAVEN',
    niche: 'Pet Shop / Veterinaria',
    badge: '// PET SHOP / VETERINARIA',
    accentColor: 'green',
    accentHex: '#39FF14',
    heroImage: '/hero/haven.jpg',
    heroTitle: 'Cuidamos a quienes Amas. Como Familia.',
    heroSubtitle: 'Veterinaria integral, estetica canina y felina, y tienda con los mejores productos para mascotas. Porque ellos merecen lo mejor.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'TIENDA ONLINE',
    servicesTitle: 'Servicios para Mascotas',
    services: [
      { icon: Stethoscope, title: 'Veterinaria', description: 'Consulta general, vacunacion, desparasitacion, cirugia y hospitalizacion. Atencion 24/7 para emergencias.' },
      { icon: Scissors, title: 'Estetica Canina', description: 'Bano, corte de raza, deslanado, limpieza de oidos y corte de unas. Productos hipoalergenicos premium.' },
      { icon: ShoppingBag, title: 'Tienda de Mascotas', description: 'Alimento premium, juguetes, accesorios, camas y ropa. Marcas importadas y nacionales seleccionadas.' },
      { icon: Home, title: 'Pension y Guarderia', description: 'Hospedaje diurno y nocturno con areas de juego, monitoreo por camaras y alimentacion personalizada.' },
    ],
    articles: [
      { title: 'Alimentacion BARF: Beneficios y Precauciones', category: 'Nutricion', readTime: '6 min' },
      { title: 'Senales de que tu Perro Necesita Ir al Veterinario', category: 'Salud', readTime: '5 min' },
      { title: 'Guia de Razas: El Perro Perfecto para tu Estilo de Vida', category: 'Razas', readTime: '7 min' },
    ],
  },
  {
    id: 'domain',
    name: 'DOMAIN',
    niche: 'Inmobiliaria',
    badge: '// INMOBILIARIA',
    accentColor: 'cyan',
    accentHex: '#00F0FF',
    heroImage: '',
    heroTitle: 'Encuentra tu Lugar en el Mundo. Sin Limites.',
    heroSubtitle: 'Propiedades exclusivas en las mejores zonas de la ciudad. Asesoria personalizada para compra, venta e inversion inmobiliaria. Tu proximo hogar empieza aqui.',
    primaryCTA: 'VER PROPIEDADES',
    secondaryCTA: 'VALORAR MI PROPIEDAD',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Home, title: 'Compra de Propiedades', description: 'Cartera exclusiva de departamentos, casas y locales comerciales. Filtramos opciones segun tu presupuesto y estilo de vida.' },
      { icon: TrendingUp, title: 'Inversion Inmobiliaria', description: 'Analisis de mercado, identificacion de oportunidades y acompañamiento legal. Maximiza el retorno de tu inversion.' },
      { icon: Key, title: 'Administracion de Propiedades', description: 'Gestion integral de rentas: publicacion, filtrado de inquilinos, cobranza y mantenimiento. Tu propiedad en las mejores manos.' },
    ],
    articles: [
      { title: 'Zonas con Mayor Plusvalia en 2025: Donde Invertir', category: 'Inversion', readTime: '7 min' },
      { title: 'Guia para Primeros Compradores de Departamento', category: 'Guia', readTime: '6 min' },
      { title: 'Tendencias en Arquitectura Residencial Sustentable', category: 'Tendencias', readTime: '5 min' },
    ],
  },
  {
    id: 'citadel',
    name: 'CITADEL',
    niche: 'Bufete de Abogados',
    badge: '// BUFETE DE ABOGADOS',
    accentColor: 'purple',
    accentHex: '#B829F7',
    heroImage: '',
    heroTitle: 'Justicia con Precision. Estrategia sin Igual.',
    heroSubtitle: 'Firma legal especializada en derecho corporativo, fiscal y civil. Mas de 20 años protegiendo los intereses de nuestros clientes. Consulta inicial gratuita.',
    primaryCTA: 'CONSULTA GRATUITA',
    secondaryCTA: 'AREAS DE PRACTICA',
    servicesTitle: 'Areas de Practica',
    services: [
      { icon: Briefcase, title: 'Derecho Corporativo', description: 'Constitucion de empresas, fusiones y adquisiciones, contratos comerciales y gobierno corporativo.' },
      { icon: Calculator, title: 'Derecho Fiscal', description: 'Planeacion fiscal, defensa en auditorias, regularizacion de contribuciones y tramites ante el SAT.' },
      { icon: Scale, title: 'Litigio Civil y Mercantil', description: 'Representacion en juicios civiles, mercantiles y administrativos. Estrategia proactiva y resultados medibles.' },
      { icon: FileText, title: 'Propiedad Intelectual', description: 'Registro de marcas, patentes, derechos de autor y defensa contra infracciones. Protege tus creaciones.' },
    ],
    articles: [
      { title: 'Reforma Fiscal 2025: Lo que todo Empresario Debe Saber', category: 'Fiscal', readTime: '8 min' },
      { title: 'Como Proteger tu Marca: Guia de Registro de PI', category: 'Legal', readTime: '6 min' },
      { title: 'Contratos Digitales: Validez Legal y Mejores Practicas', category: 'Tecnologia', readTime: '5 min' },
    ],
  },
  {
    id: 'aura',
    name: 'AURA',
    niche: 'Spa / Masajes',
    badge: '// SPA / CENTRO DE BIENESTAR',
    accentColor: 'purple',
    accentHex: '#B829F7',
    heroImage: '',
    heroTitle: 'Renueva tu Alma. Relaja tu Cuerpo.',
    heroSubtitle: 'Experiencias de bienestar con terapeutas certificados, productos organicos y ambientes diseñados para el descanso profundo. Reserva tu ritual de relajacion.',
    primaryCTA: 'RESERVAR SESION',
    secondaryCTA: 'VER RITUALES',
    servicesTitle: 'Rituales de Bienestar',
    services: [
      { icon: Hand, title: 'Masajes Terapeuticos', description: 'Masaje sueco, deep tissue, deportivo y de piedras calientes. Alivia tension muscular y mejora la circulacion.' },
      { icon: Sparkles, title: 'Faciales y Estetica', description: 'Limpieza facial profunda, hidratacion, anti-age con productos de origen natural. Resultados visibles desde la primera sesion.' },
      { icon: Flower2, title: 'Terapias Holisticas', description: 'Reflexologia, aromaterapia, reiki y terapia con cuencos tibetanos. Equilibrio cuerpo, mente y espiritu.' },
    ],
    articles: [
      { title: 'Beneficios del Masaje Deep Tissue: Mas alla del Relax', category: 'Salud', readTime: '5 min' },
      { title: 'Aromaterapia: Aceites Esenciales para cada Estado de Animo', category: 'Bienestar', readTime: '6 min' },
      { title: 'Rutina de Skincare Minimalista: 3 Pasos para Piel Perfecta', category: 'Belleza', readTime: '4 min' },
    ],
  },
  {
    id: 'edge',
    name: 'EDGE',
    niche: 'Barberia / Salon',
    badge: '// BARBERIA / SALON',
    accentColor: 'cyan',
    accentHex: '#00F0FF',
    heroImage: '',
    heroTitle: 'Estilo que Define. Cortes que Impactan.',
    heroSubtitle: 'Barberia moderna y salon de belleza con estilistas especializados. Cortes de tendencia, coloracion experta y tratamientos capilares. Agenda tu cita.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'VER SERVICIOS',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Scissors, title: 'Cortes para Hombre', description: 'Degrade, textured crop, pompadour y cortes personalizados. Incluye lavado, masaje capilar y styling con productos premium.' },
      { icon: Crown, title: 'Barba y Bigote', description: 'Delineado, afeitado con navaja caliente, hidratacion con aceites naturales y mantenimiento completo de la barba.' },
      { icon: Palette, title: 'Coloracion', description: 'Balayage, mechas, tinte completo y correccion de color. Tecnicas avanzadas con productos que cuidan tu cabello.' },
      { icon: Droplet, title: 'Tratamientos Capilares', description: 'Botox capilar, keratina, hidratacion profunda y reconstruccion. Cabello sano, brillante y manejable.' },
    ],
    articles: [
      { title: 'Tendencias en Cortes Masculinos 2025', category: 'Tendencias', readTime: '5 min' },
      { title: 'Como Cuidar tu Barba: Guia para Principiantes', category: 'Cuidado', readTime: '4 min' },
      { title: 'Balayage vs. Mechas: Cual es la Diferencia?', category: 'Coloracion', readTime: '6 min' },
    ],
  },
  {
    id: 'overclock',
    name: 'OVERCLOCK',
    niche: 'Electronica / Gaming',
    badge: '// TIENDA GAMING / PC',
    accentColor: 'green',
    accentHex: '#39FF14',
    heroImage: '',
    heroTitle: 'Potencia Extrema. Rendimiento sin Compromiso.',
    heroSubtitle: 'Componentes de PC, perifericos gaming y consolas de ultima generacion. Armamos tu setup ideal con las mejores marcas. Garantia de por vida en ensambles.',
    primaryCTA: 'ARMAR MI PC',
    secondaryCTA: 'CATALOGO GAMING',
    servicesTitle: 'Categorias',
    services: [
      { icon: Cpu, title: 'Componentes PC', description: 'Procesadores, tarjetas graficas, memorias RAM, SSDs y fuentes de poder. Stock de AMD, Intel, NVIDIA y mas.' },
      { icon: MousePointer, title: 'Perifericos Gaming', description: 'Teclados mecanicos, mice de alta DPI, headsets 7.1 y mousepads de competencia. Marcas: Razer, Logitech, HyperX.' },
      { icon: Settings, title: 'Ensambles Personalizados', description: 'Diseñamos y ensamblamos tu PC a la medida. Desde estaciones de trabajo hasta rigs de streaming y competencia.' },
      { icon: Gamepad2, title: 'Consolas y Accesorios', description: 'PlayStation 5, Xbox Series X/S, Nintendo Switch y todos sus accesorios. Preventa de lanzamientos disponible.' },
    ],
    articles: [
      { title: 'Guia de Ensamble PC 2025: Presupuestos desde $15,000', category: 'Hardware', readTime: '8 min' },
      { title: 'Teclados Mecanicos: Switches Explicados para Principiantes', category: 'Perifericos', readTime: '6 min' },
      { title: 'Overclocking Seguro: Como Sacarle Mas a tu GPU', category: 'Tecnica', readTime: '7 min' },
    ],
  },
  {
    id: 'horizon',
    name: 'HORIZON',
    niche: 'Agencia de Viajes',
    badge: '// AGENCIA DE VIAJES',
    accentColor: 'cyan',
    accentHex: '#00F0FF',
    heroImage: '/hero/horizon.jpg',
    heroTitle: 'El Mundo te Espera. Comienza tu Aventura.',
    heroSubtitle: 'Paquetes turisticos nacionales e internacionales, vuelos, hoteles y experiencias unicas. Asesoria personalizada para el viaje de tus sueños. Cotiza gratis.',
    primaryCTA: 'COTIZAR VIAJE',
    secondaryCTA: 'DESTINOS POPULARES',
    servicesTitle: 'Experiencias de Viaje',
    services: [
      { icon: Plane, title: 'Viajes Internacionales', description: 'Europa, Asia, America y Oceania. Paquetes todo incluido, cruceros y tours guiados con los mejores operadores.' },
      { icon: Map, title: 'Destinos Nacionales', description: 'Playas magicas, pueblos magicos, ciudades coloniales y aventura en la naturaleza. Conoce Mexico como nunca antes.' },
      { icon: Building2, title: 'Viajes Corporativos', description: 'Gestion integral de viajes de negocios: vuelos, hoteles, traslados y eventos. Reportes de gastos y cumplimiento de politicas.' },
    ],
    articles: [
      { title: 'Destinos Emergentes 2025: Lugares que Debes Conocer', category: 'Destinos', readTime: '6 min' },
      { title: 'Tips para Viajar Barato sin Perder Calidad', category: 'Tips', readTime: '5 min' },
      { title: 'Guia de Visados: Requisitos para Viajar desde Mexico', category: 'Tramites', readTime: '7 min' },
    ],
  },
  {
    id: 'apex',
    name: 'APEX',
    niche: 'Marca Personal',
    badge: '// MARCA PERSONAL',
    accentColor: 'purple',
    accentHex: '#B829F7',
    heroImage: '',
    heroTitle: 'Construye tu Imperio. Inspira al Mundo.',
    heroSubtitle: 'Coach de negocios, creador de contenido y speaker internacional. Te ayudo a escalar tu marca personal y monetizar tu passion. Se parte de la comunidad.',
    primaryCTA: 'UNIRME A LA COMUNIDAD',
    secondaryCTA: 'VER CURSOS',
    servicesTitle: 'Como Puedo Ayudarte',
    services: [
      { icon: UserCheck, title: 'Coaching 1-on-1', description: 'Sesiones estrategicas personalizadas para escalar tu negocio, definir tu oferta y automatizar tus procesos.' },
      { icon: BookOpen, title: 'Cursos Online', description: 'Formacion en marketing digital, ventas, productividad y creacion de contenido. Acceso de por vida y actualizaciones gratis.' },
      { icon: TrendingUp, title: 'Consultoria de Negocios', description: 'Asesoria para emprendedores y empresas. Estrategia de crecimiento, funnels de venta y automatizacion con IA.' },
      { icon: Mic, title: 'Conferencias', description: 'Keynotes sobre emprendimiento, liderazgo y transformacion digital. Disponible para eventos corporativos y universidades.' },
    ],
    articles: [
      { title: 'Como Monetizar tu Marca Personal en 2025', category: 'Negocios', readTime: '7 min' },
      { title: 'Habitos Atomicos que Cambiaran tu Productividad', category: 'Productividad', readTime: '5 min' },
      { title: 'El Futuro del Marketing con IA: Oportunidades y Riesgos', category: 'Tecnologia', readTime: '6 min' },
    ],
  },
];

export function getTemplateById(id: string): TemplateData | undefined {
  return templates.find(t => t.id === id);
}
