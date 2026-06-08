import {
  Zap, Hammer, Droplet, Wrench, Pill, Leaf, HeartPulse,
  Cpu, Disc, Flame, Wind, Smile, Sparkles, ShieldPlus,
  Dumbbell, Weight, UserCheck, Activity, UtensilsCrossed, Wine,
  Users, Coffee, Croissant, Egg, CakeSlice, Sun, Building,
  Scissors, Stethoscope, ShoppingBag, Home, TrendingUp, Key,
  Briefcase, Calculator, Scale, FileText, Hand, Flower2,
  Crown, Palette, MousePointer, Settings, Gamepad2,
  Plane, Map, BookOpen, Mic, Building2, AirVent, Gem, Brain, HeartHandshake, Car, Droplets, Paintbrush, Calendar, Camera, Music, PartyPopper, ScanFace, type LucideIcon
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
  isClassic?: boolean;
}

export const templates: TemplateData[] = [
  {
    id: 'foundry',
    name: 'FOUNDRY',
    niche: 'Ferretería Industrial',
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
      { icon: Zap, title: 'Herramientas Eléctricas', description: 'Taladros, amoladoras, sierras circulares y equipos profesionales de las mejores marcas. Garantía extendida.' },
      { icon: Hammer, title: 'Materiales de Construccion', description: 'Cemento, acero, varilla, block y acabados. Precios por mayoreo para proyectos grandes.' },
      { icon: Droplet, title: 'Tubería y Plomería', description: 'PVC, cobre, conexiones, bombas y accesorios hidráulicos. Asesoría técnica incluida.' },
      { icon: Wrench, title: 'Ferretería General', description: 'Tornillería, anclaje, selladores, pintura y más de 5,000 productos en stock permanente.' },
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
    niche: 'Farmacia & Salud',
    badge: '// FARMACIA Y SALUD',
    accentColor: 'green',
    accentHex: '#39FF14',
    heroImage: '/hero/vitalis.jpg',
    heroTitle: 'Tu Salud. Nuestra Prioridad.',
    heroSubtitle: 'Farmacia integral con servicio de calidad, asesoría profesional y entrega a domicilio. Tu bienestar es nuestra misión.',
    primaryCTA: 'COMPRAR AHORA',
    secondaryCTA: 'SERVICIOS',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Pill, title: 'Farmacia', description: 'Medicamentos de patente y genéricos. Surtido de recetas, control de cronicidad y seguimiento farmacoterapéutico.' },
      { icon: Leaf, title: 'Productos Naturales', description: 'Suplementos vitamínicos, productos homeopáticos y alternativas naturales para tu bienestar diario.' },
      { icon: HeartPulse, title: 'Atención Domiciliaria', description: 'Entrega de medicamentos a domicilio, servicio de inyecciones y monitoreo de signos vitales a domicilio.' },
    ],
    articles: [
      { title: 'Guía Completa de Vitaminas Esenciales para Adultos Mayores', category: 'Salud', readTime: '5 min' },
      { title: 'Medicamentos Genericos vs. de Patente: Mitos y Realidades', category: 'Farmacia', readTime: '6 min' },
      { title: '5 Habitos para Fortalecer tu Sistema Inmunologico', category: 'Bienestar', readTime: '4 min' },
    ],
  },
  {
    id: 'torque',
    name: 'TORQUE',
    niche: 'Taller Mecánico',
    badge: '// TALLER MECANICO',
    accentColor: 'orange',
    accentHex: '#FF6B35',
    heroImage: '/hero/torque.jpg',
    heroTitle: 'Potencia sin Límites. Reparación sin Excusas.',
    heroSubtitle: 'Diagnóstico computarizado, servicio de frenos, suspensión, transmisión y mantenimiento preventivo. Tu auto en manos de expertos.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'DIAGNOSTICO GRATIS',
    servicesTitle: 'Servicios Automotrices',
    services: [
      { icon: Cpu, title: 'Diagnóstico Computarizado', description: 'Escaneo completo del sistema electrónico. Detectamos fallas en motor, transmisión y sensores con equipo de última generación.' },
      { icon: Disc, title: 'Frenos y Suspensión', description: 'Revisión, rectificado y cambio de balatas, discos, amortiguadores y sistema de dirección. Seguridad garantizada.' },
      { icon: Flame, title: 'Afinación Mayor', description: 'Cambio de aceite, filtros, bujías, limpieza de inyectores y calibración. Mejora el rendimiento y ahorra combustible.' },
      { icon: Wind, title: 'Clima Automotriz', description: 'Recarga de gas refrigerante, diagnóstico de compresor y reparación del sistema de aire acondicionado.' },
    ],
    articles: [
      { title: 'Señales de que tu Auto Necesita una Afinación Urgente', category: 'Mantenimiento', readTime: '5 min' },
      { title: 'Frenos: Cuando Cambiarlos y como Extender su Vida Útil', category: 'Seguridad', readTime: '6 min' },
      { title: 'Mitos del Aceite de Motor que todos los Mecánicos Conocen', category: 'Técnica', readTime: '4 min' },
    ],
  },
  {
    id: 'prism',
    name: 'PRISM',
    niche: 'Clínica Dental',
    badge: '// CLINICA DENTAL',
    accentColor: 'cyan',
    accentHex: '#00F0FF',
    heroImage: '/hero/prism.jpg',
    heroTitle: 'Sonrisas Perfectas. Tecnología Avanzada.',
    heroSubtitle: 'Clínica dental equipada con tecnología de vanguardia. Ortodoncia invisible, blanqueamiento láser, implantes y estética dental. Primera consulta gratuita.',
    primaryCTA: 'AGENDAR CONSULTA',
    secondaryCTA: 'VER TRATAMIENTOS',
    servicesTitle: 'Tratamientos Dentales',
    services: [
      { icon: Smile, title: 'Ortodoncia Invisible', description: 'Alineadores transparentes para corregir la posición de tus dientes sin brackets metálicos. Resultados en 6-18 meses.' },
      { icon: Sparkles, title: 'Blanqueamiento Láser', description: 'Tecnología de luz LED para aclarar hasta 8 tonos en una sola sesión. Resultados inmediatos y duraderos.' },
      { icon: ShieldPlus, title: 'Implantes Dentales', description: 'Reemplazo de dientes perdidos con implantes de titanio. Cirugía mínimamente invasiva y recuperación rápida.' },
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
    heroTitle: 'Forja tu Mejor Versión. Sin Excusas.',
    heroSubtitle: 'Entrenamiento funcional, CrossFit, musculación y coaching nutricional. Equipamiento profesional y comunidad que te impulsa. Prueba tu primera clase gratis.',
    primaryCTA: 'CLASE DE PRUEBA GRATIS',
    secondaryCTA: 'VER PLANES',
    servicesTitle: 'Programas de Entrenamiento',
    services: [
      { icon: Dumbbell, title: 'CrossFit', description: 'WODs diarios que combinan levantamiento olímpico, gimnasia y cardio. Escalable para todos los niveles de condición física.' },
      { icon: Weight, title: 'Musculación', description: 'Área de peso libre, máquinas guiadas y zona de cardio. Horario abierto con supervisión de entrenadores certificados.' },
      { icon: UserCheck, title: 'Personal Training', description: 'Planes personalizados de entrenamiento y nutrición. Sesiones one-on-one con coaches certificados en NSCA y ACE.' },
      { icon: Activity, title: 'Yoga & Movilidad', description: 'Clases de yoga, stretching y movilidad articular para recuperación, flexibilidad y prevención de lesiones.' },
    ],
    articles: [
      { title: 'Rutina Full-Body de CrossFit para Principiantes', category: 'Entrenamiento', readTime: '6 min' },
      { title: 'Nutrición para Ganar Masa Muscular: La Guía Definitiva', category: 'Nutrición', readTime: '8 min' },
      { title: '5 Ejercicios que todos Hacen Mal (y como Corregirlos)', category: 'Técnica', readTime: '5 min' },
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
    heroSubtitle: 'Cocina de autor con ingredientes locales y técnicas internacionales. Menú degustación, maridaje de vinos y experiencias gastronómicas únicas. Reserva tu mesa.',
    primaryCTA: 'RESERVAR MESA',
    secondaryCTA: 'VER MENU',
    servicesTitle: 'Experiencias Gastronómicas',
    services: [
      { icon: UtensilsCrossed, title: 'Menú Degustación', description: '7 tiempos que exploran sabores, texturas y técnicas. Ingredientes de temporada seleccionados de productores locales.' },
      { icon: Wine, title: 'Maridaje de Vinos', description: 'Selección de más de 120 etiquetas internacionales. Nuestro sommelier crea el maridaje perfecto para cada platillo.' },
      { icon: Users, title: 'Cenas Privadas', description: 'Experiencias exclusivas para grupos de 8 a 24 personas. Menú personalizado, chef privado y ambiente íntimo.' },
    ],
    articles: [
      { title: 'Tendencias Gastronómicas 2025: La Nueva Cocina Mexicana', category: 'Tendencias', readTime: '6 min' },
      { title: 'Guía de Maridaje: Vinos Tintos para Principiantes', category: 'Vinos', readTime: '5 min' },
      { title: 'El Secreto detrás de un Buen Mole: Entrevista con el Chef', category: 'Cultura', readTime: '7 min' },
    ],
  },
  {
    id: 'brew',
    name: 'BREW',
    niche: 'Cafetería / Panadería',
    badge: '// CAFETERIA ARTESANAL',
    accentColor: 'amber',
    accentHex: '#FFB800',
    heroImage: '/hero/brew.jpg',
    heroTitle: 'Cada Taza, una Historia. Cada Bocado, un Arte.',
    heroSubtitle: 'Café de especialidad de origen único, panadería artesanal recién horneada y desayunos que despiertan los sentidos. Hecho a mano, servido con amor.',
    primaryCTA: 'VISITANOS',
    secondaryCTA: 'NUESTRO MENU',
    servicesTitle: 'Nuestro Menú',
    services: [
      { icon: Coffee, title: 'Café de Especialidad', description: 'Granos de origen único tostados artesanalmente. Espresso, pour-over, cold brew y lattes con arte latte.' },
      { icon: Croissant, title: 'Panadería Fresca', description: 'Croissants, danesas, conchas y pan de masa madre horneados cada madrugada con mantequilla importada.' },
      { icon: Egg, title: 'Desayunos', description: 'Chilaquiles gourmet, avocado toast, bowls de avena y omelettes personalizados. Servidos todo el día.' },
      { icon: CakeSlice, title: 'Postres', description: 'Pasteles de autor, macarons, cheesecakes y postres de temporada. Disponibles por rebanada o enteros por pedido.' },
    ],
    articles: [
      { title: 'Guía del Café: Diferencias entre Arábica y Robusta', category: 'Cafe', readTime: '5 min' },
      { title: 'Secretos de la Panadería Artesanal: La Masa Madre', category: 'Panaderia', readTime: '6 min' },
      { title: '5 Recetas de Desayuno para Empezar tu Día con Energía', category: 'Recetas', readTime: '4 min' },
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
      { icon: Sun, title: 'Primavera / Verano 2025', description: 'Colores vibrantes, telas ligeras y siluetas fluidas. Piezas versátiles para el día y la noche.' },
      { icon: Building, title: 'Estilo Urbano', description: 'Streetwear de alta gama: sneakers limitados, chamarras oversized y accesorios statement.' },
      { icon: Scissors, title: 'Personal Styling', description: 'Sesión de asesoría de imagen personalizada. Definimos tu paleta de colores, siluetas y armario cápsula.' },
    ],
    articles: [
      { title: 'Tendencias de Moda 2025: Lo que Será Viral', category: 'Tendencias', readTime: '6 min' },
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
    heroSubtitle: 'Veterinaria integral, estética canina y felina, y tienda con los mejores productos para mascotas. Porque ellos merecen lo mejor.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'TIENDA ONLINE',
    servicesTitle: 'Servicios para Mascotas',
    services: [
      { icon: Stethoscope, title: 'Veterinaria', description: 'Consulta general, vacunación, desparasitación, cirugía y hospitalización. Atención 24/7 para emergencias.' },
      { icon: Scissors, title: 'Estética Canina', description: 'Baño, corte de raza, deslanado, limpieza de oídos y corte de uñas. Productos hipoalergénicos premium.' },
      { icon: ShoppingBag, title: 'Tienda de Mascotas', description: 'Alimento premium, juguetes, accesorios, camas y ropa. Marcas importadas y nacionales seleccionadas.' },
      { icon: Home, title: 'Pensión y Guardería', description: 'Hospedaje diurno y nocturno con áreas de juego, monitoreo por cámaras y alimentación personalizada.' },
    ],
    articles: [
      { title: 'Alimentación BARF: Beneficios y Precauciones', category: 'Nutricion', readTime: '6 min' },
      { title: 'Señales de que tu Perro Necesita Ir al Veterinario', category: 'Salud', readTime: '5 min' },
      { title: 'Guía de Razas: El Perro Perfecto para tu Estilo de Vida', category: 'Razas', readTime: '7 min' },
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
    heroTitle: 'Encuentra tu Lugar en el Mundo. Sin Límites.',
    heroSubtitle: 'Propiedades exclusivas en las mejores zonas de la ciudad. Asesoría personalizada para compra, venta e inversión inmobiliaria. Tu próximo hogar empieza aquí.',
    primaryCTA: 'VER PROPIEDADES',
    secondaryCTA: 'VALORAR MI PROPIEDAD',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Home, title: 'Compra de Propiedades', description: 'Cartera exclusiva de departamentos, casas y locales comerciales. Filtramos opciones según tu presupuesto y estilo de vida.' },
      { icon: TrendingUp, title: 'Inversión Inmobiliaria', description: 'Análisis de mercado, identificación de oportunidades y acompañamiento legal. Maximiza el retorno de tu inversión.' },
      { icon: Key, title: 'Administración de Propiedades', description: 'Gestión integral de rentas: publicación, filtrado de inquilinos, cobranza y mantenimiento. Tu propiedad en las mejores manos.' },
    ],
    articles: [
      { title: 'Zonas con Mayor Plusvalia en 2025: Donde Invertir', category: 'Inversion', readTime: '7 min' },
      { title: 'Guía para Primeros Compradores de Departamento', category: 'Guia', readTime: '6 min' },
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
    heroTitle: 'Justicia con Precisión. Estrategia sin Igual.',
    heroSubtitle: 'Firma legal especializada en derecho corporativo, fiscal y civil. Más de 20 años protegiendo los intereses de nuestros clientes. Consulta inicial gratuita.',
    primaryCTA: 'CONSULTA GRATUITA',
    secondaryCTA: 'AREAS DE PRACTICA',
    servicesTitle: 'Áreas de Práctica',
    services: [
      { icon: Briefcase, title: 'Derecho Corporativo', description: 'Constitución de empresas, fusiones y adquisiciones, contratos comerciales y gobierno corporativo.' },
      { icon: Calculator, title: 'Derecho Fiscal', description: 'Planeación fiscal, defensa en auditorías, regularización de contribuciones y trámites ante el SAT.' },
      { icon: Scale, title: 'Litigio Civil y Mercantil', description: 'Representación en juicios civiles, mercantiles y administrativos. Estrategia proactiva y resultados medibles.' },
      { icon: FileText, title: 'Propiedad Intelectual', description: 'Registro de marcas, patentes, derechos de autor y defensa contra infracciones. Protege tus creaciones.' },
    ],
    articles: [
      { title: 'Reforma Fiscal 2025: Lo que todo Empresario Debe Saber', category: 'Fiscal', readTime: '8 min' },
      { title: 'Como Proteger tu Marca: Guía de Registro de PI', category: 'Legal', readTime: '6 min' },
      { title: 'Contratos Digitales: Validez Legal y Mejores Prácticas', category: 'Tecnologia', readTime: '5 min' },
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
    heroSubtitle: 'Experiencias de bienestar con terapeutas certificados, productos orgánicos y ambientes diseñados para el descanso profundo. Reserva tu ritual de relajación.',
    primaryCTA: 'RESERVAR SESION',
    secondaryCTA: 'VER RITUALES',
    servicesTitle: 'Rituales de Bienestar',
    services: [
      { icon: Hand, title: 'Masajes Terapéuticos', description: 'Masaje sueco, deep tissue, deportivo y de piedras calientes. Alivia tensión muscular y mejora la circulación.' },
      { icon: Sparkles, title: 'Faciales y Estética', description: 'Limpieza facial profunda, hidratación, anti-age con productos de origen natural. Resultados visibles desde la primera sesión.' },
      { icon: Flower2, title: 'Terapias Holísticas', description: 'Reflexología, aromaterapia, reiki y terapia con cuencos tibetanos. Equilibrio cuerpo, mente y espíritu.' },
    ],
    articles: [
      { title: 'Beneficios del Masaje Deep Tissue: Mas alla del Relax', category: 'Salud', readTime: '5 min' },
      { title: 'Aromaterapia: Aceites Esenciales para cada Estado de Ánimo', category: 'Bienestar', readTime: '6 min' },
      { title: 'Rutina de Skincare Minimalista: 3 Pasos para Piel Perfecta', category: 'Belleza', readTime: '4 min' },
    ],
  },
  {
    id: 'edge',
    name: 'EDGE',
    niche: 'Barbería / Salón',
    badge: '// BARBERIA / SALON',
    accentColor: 'cyan',
    accentHex: '#00F0FF',
    heroImage: '',
    heroTitle: 'Estilo que Define. Cortes que Impactan.',
    heroSubtitle: 'Barbería moderna y salón de belleza con estilistas especializados. Cortes de tendencia, coloración experta y tratamientos capilares. Agenda tu cita.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'VER SERVICIOS',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Scissors, title: 'Cortes para Hombre', description: 'Degrade, textured crop, pompadour y cortes personalizados. Incluye lavado, masaje capilar y styling con productos premium.' },
      { icon: Crown, title: 'Barba y Bigote', description: 'Delineado, afeitado con navaja caliente, hidratación con aceites naturales y mantenimiento completo de la barba.' },
      { icon: Palette, title: 'Coloración', description: 'Balayage, mechas, tinte completo y corrección de color. Técnicas avanzadas con productos que cuidan tu cabello.' },
      { icon: Droplet, title: 'Tratamientos Capilares', description: 'Botox capilar, keratina, hidratación profunda y reconstrucción. Cabello sano, brillante y manejable.' },
    ],
    articles: [
      { title: 'Tendencias en Cortes Masculinos 2025', category: 'Tendencias', readTime: '5 min' },
      { title: 'Como Cuidar tu Barba: Guía para Principiantes', category: 'Cuidado', readTime: '4 min' },
      { title: 'Balayage vs. Mechas: Cual es la Diferencia?', category: 'Coloracion', readTime: '6 min' },
    ],
  },
  {
    id: 'overclock',
    name: 'OVERCLOCK',
    niche: 'Electrónica / Gaming',
    badge: '// TIENDA GAMING / PC',
    accentColor: 'green',
    accentHex: '#39FF14',
    heroImage: '',
    heroTitle: 'Potencia Extrema. Rendimiento sin Compromiso.',
    heroSubtitle: 'Componentes de PC, periféricos gaming y consolas de última generación. Armamos tu setup ideal con las mejores marcas. Garantía de por vida en ensambles.',
    primaryCTA: 'ARMAR MI PC',
    secondaryCTA: 'CATALOGO GAMING',
    servicesTitle: 'Categorías',
    services: [
      { icon: Cpu, title: 'Componentes PC', description: 'Procesadores, tarjetas gráficas, memorias RAM, SSDs y fuentes de poder. Stock de AMD, Intel, NVIDIA y más.' },
      { icon: MousePointer, title: 'Periféricos Gaming', description: 'Teclados mecánicos, mice de alta DPI, headsets 7.1 y mousepads de competencia. Marcas: Razer, Logitech, HyperX.' },
      { icon: Settings, title: 'Ensambles Personalizados', description: 'Diseñamos y ensamblamos tu PC a la medida. Desde estaciones de trabajo hasta rigs de streaming y competencia.' },
      { icon: Gamepad2, title: 'Consolas y Accesorios', description: 'PlayStation 5, Xbox Series X/S, Nintendo Switch y todos sus accesorios. Preventa de lanzamientos disponible.' },
    ],
    articles: [
      { title: 'Guía de Ensamble PC 2025: Presupuestos desde $15,000', category: 'Hardware', readTime: '8 min' },
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
    heroSubtitle: 'Paquetes turísticos nacionales e internacionales, vuelos, hoteles y experiencias únicas. Asesoría personalizada para el viaje de tus sueños. Cotiza gratis.',
    primaryCTA: 'COTIZAR VIAJE',
    secondaryCTA: 'DESTINOS POPULARES',
    servicesTitle: 'Experiencias de Viaje',
    services: [
      { icon: Plane, title: 'Viajes Internacionales', description: 'Europa, Asia, America y Oceanía. Paquetes todo incluido, cruceros y tours guiados con los mejores operadores.' },
      { icon: Map, title: 'Destinos Nacionales', description: 'Playas mágicas, pueblos mágicos, ciudades coloniales y aventura en la naturaleza. Conoce México como nunca antes.' },
      { icon: Building2, title: 'Viajes Corporativos', description: 'Gestión integral de viajes de negocios: vuelos, hoteles, traslados y eventos. Reportes de gastos y cumplimiento de políticas.' },
    ],
    articles: [
      { title: 'Destinos Emergentes 2025: Lugares que Debes Conocer', category: 'Destinos', readTime: '6 min' },
      { title: 'Tips para Viajar Barato sin Perder Calidad', category: 'Tips', readTime: '5 min' },
      { title: 'Guía de Visados: Requisitos para Viajar desde México', category: 'Tramites', readTime: '7 min' },
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
    heroSubtitle: 'Coach de negocios, creador de contenido y speaker internacional. Te ayudo a escalar tu marca personal y monetizar tu pasión. Se parte de la comunidad.',
    primaryCTA: 'UNIRME A LA COMUNIDAD',
    secondaryCTA: 'VER CURSOS',
    servicesTitle: 'Como Puedo Ayudarte',
    services: [
      { icon: UserCheck, title: 'Coaching 1-on-1', description: 'Sesiones estratégicas personalizadas para escalar tu negocio, definir tu oferta y automatizar tus procesos.' },
      { icon: BookOpen, title: 'Cursos Online', description: 'Formación en marketing digital, ventas, productividad y creación de contenido. Acceso de por vida y actualizaciones gratis.' },
      { icon: TrendingUp, title: 'Consultoría de Negocios', description: 'Asesoría para emprendedores y empresas. Estrategia de crecimiento, funnels de venta y automatización con IA.' },
      { icon: Mic, title: 'Conferencias', description: 'Keynotes sobre emprendimiento, liderazgo y transformación digital. Disponible para eventos corporativos y universidades.' },
    ],
    articles: [
      { title: 'El Futuro del Marketing con IA: Oportunidades y Riesgos', category: 'Tecnologia', readTime: '6 min' },
    ],
  },
  {
    id: 'luxe',
    name: 'LUXE',
    niche: 'Moda, Joyería & Estética',
    badge: '// SERIE CLASSIC ELITE',
    accentColor: 'pink',
    accentHex: '#f472b6',
    heroImage: '/hero/luxe.jpg',
    heroTitle: 'Elegancia Atemporal. Estilo Exclusivo.',
    heroSubtitle: 'Diseños de vanguardia para marcas de moda, alta joyería y servicios de estética premium. Refinamiento en cada detalle para clientes sofisticados.',
    primaryCTA: 'AGENDAR CITA',
    secondaryCTA: 'VER COLECCIÓN',
    servicesTitle: 'Nuestra Experiencia',
    services: [
      { icon: Crown, title: 'Alta Costura', description: 'Prendas a medida diseñadas por artistas de moda internacionales. Materiales exclusivos y confección perfecta.' },
      { icon: Sparkles, title: 'Joyería Fina', description: 'Piezas únicas con metales preciosos y gemas seleccionadas a mano. Certificado de autenticidad.' },
      { icon: HeartPulse, title: 'Estética Premium', description: 'Tratamientos de rejuvenecimiento y cuidado personal con tecnología de punta en un ambiente relajante.' }
    ],
    articles: [
      { title: 'Tendencias de Alta Costura para la Temporada 2026', category: 'Estilo', readTime: '5 min' },
      { title: 'Cómo Elegir Joyas que Resalten tu Estilo Personal', category: 'Joyería', readTime: '4 min' },
      { title: 'El Arte del Cuidado de la Piel: Rutinas de Lujo', category: 'Belleza', readTime: '6 min' }
    ],
    isClassic: true
  },
  {
    id: 'titan',
    name: 'TITAN',
    niche: 'Industria, Logística & Licores',
    badge: '// SERIE CLASSIC ROBUSTA',
    accentColor: 'blue',
    accentHex: '#3b82f6',
    heroImage: '/hero/titan.jpg',
    heroTitle: 'Infraestructura Robusta. Fuerza Industrial.',
    heroSubtitle: 'Soluciones corporativas de gran escala en logística, transporte, construcción pesada y distribución de marcas premium con trazabilidad total.',
    primaryCTA: 'VER PROYECTOS',
    secondaryCTA: 'COTIZAR SERVICIO',
    servicesTitle: 'Capacidad de Operación',
    services: [
      { icon: Hammer, title: 'Manufactura Pesada', description: 'Procesos industriales certificados ISO 9001 para garantizar calidad estructural y durabilidad.' },
      { icon: Briefcase, title: 'Logística Inteligente', description: 'Distribución automatizada con monitoreo de flotas en tiempo real en más de 50 rutas nacionales.' },
      { icon: TrendingUp, title: 'Distribución Premium', description: 'Suministro a gran escala de insumos industriales y bebidas de alta gama con control de temperatura.' }
    ],
    articles: [
      { title: 'Optimización de Cadenas de Suministro en la Era Digital', category: 'Logística', readTime: '7 min' },
      { title: 'Nuevos Estándares de Seguridad Industrial en 2026', category: 'Seguridad', readTime: '5 min' },
      { title: 'Distribución Mayorista: Claves para el Éxito Comercial', category: 'Distribución', readTime: '6 min' }
    ],
    isClassic: true
  },
  {
    id: 'aura-classic',
    name: 'AURA CLASSIC',
    niche: 'Wellness, Yoga & Meditación',
    badge: '// SERIE CLASSIC ETÉREA',
    accentColor: 'purple',
    accentHex: '#a78bfa',
    heroImage: '/hero/aura.jpg',
    heroTitle: 'Paz Interior. Armonía Total.',
    heroSubtitle: 'Espacios diseñados para reconectar cuerpo, mente y espíritu a través del yoga, meditación y terapias naturales para una vida equilibrada.',
    primaryCTA: 'COMPRAR PAQUETE',
    secondaryCTA: 'VER RITUALES',
    servicesTitle: 'Terapias y Programas',
    services: [
      { icon: Flower2, title: 'Yoga Dinámico', description: 'Clases guiadas por maestros expertos para todos los niveles. Mejora flexibilidad, fuerza y control mental.' },
      { icon: Leaf, title: 'Meditación Zen', description: 'Sesiones semanales de respiración y mindfulness para reducir el estrés diario y aumentar el enfoque.' },
      { icon: Hand, title: 'Masajes Holísticos', description: 'Tratamientos corporales relajantes que combinan aceites orgánicos y técnicas ancestrales.' }
    ],
    articles: [
      { title: '5 Posturas de Yoga para Comenzar el Día sin Estrés', category: 'Yoga', readTime: '5 min' },
      { title: 'Beneficios de la Meditación Guiada en el Trabajo', category: 'Mindfulness', readTime: '6 min' },
      { title: 'Guía Completa sobre Terapias de Relajación Natural', category: 'Wellness', readTime: '7 min' }
    ],
    isClassic: true
  },
  {
    id: 'forge-classic',
    name: 'FORGE CLASSIC',
    niche: 'Software, DevTools & SaaS',
    badge: '// SERIE CLASSIC TECNOLÓGICA',
    accentColor: 'green',
    accentHex: '#10b981',
    heroImage: '/hero/forge-classic.jpg',
    heroTitle: 'Código de Alto Rendimiento.',
    heroSubtitle: 'Desarrollo a medida de plataformas web, aplicaciones móviles seguras e integraciones de inteligencia artificial para automatizar tus operaciones.',
    primaryCTA: 'VER PROYECTOS',
    secondaryCTA: 'HABLAR CON EXPERTO',
    servicesTitle: 'Líneas de Desarrollo',
    services: [
      { icon: Cpu, title: 'Desarrollo Web & App', description: 'Soluciones escalables creadas con React, Node.js y Next.js. Código limpio y optimizado para SEO.' },
      { icon: Settings, title: 'Integraciones de IA', description: 'Conexión nativa de APIs inteligentes (LLMs, RAG) para automatizar la atención a clientes y procesos.' },
      { icon: Activity, title: 'Arquitectura Cloud', description: 'Despliegue e infraestructura en AWS y Google Cloud con redundancia total y máxima velocidad.' }
    ],
    articles: [
      { title: 'Por qué Next.js es el Framework Líder para Startups', category: 'SaaS', readTime: '6 min' },
      { title: 'Cómo Integrar Inteligencia Artificial en tu Backend', category: 'Tech', readTime: '8 min' },
      { title: 'Guía Práctica para la Seguridad de Datos en la Nube', category: 'Cloud', readTime: '5 min' }
    ],
    isClassic: true
  },
  {
    id: 'nebula',
    name: 'NEBULA',
    niche: 'Agencias IA & Nightlife',
    badge: '// SERIE CLASSIC NEÓN',
    accentColor: 'orange',
    accentHex: '#f97316',
    heroImage: '/hero/nebula.jpg',
    heroTitle: 'Experiencia Inmersiva. Cyberpunk.',
    heroSubtitle: 'Orquestamos experiencias futuristas para marcas de entretenimiento, discotecas exclusivas y agencias de inteligencia artificial con impacto visual neón.',
    primaryCTA: 'VER PORTAFOLIO',
    secondaryCTA: 'RESERVAR VIP',
    servicesTitle: 'Experiencias de Impacto',
    services: [
      { icon: Sparkles, title: 'Agencia de Diseño IA', description: 'Creación de campañas visuales disruptivas y prompts cinematográficos para marcas que lideran la nueva era.' },
      { icon: Wine, title: 'Club de Entretenimiento', description: 'Eventos inmersivos, DJs internacionales y sistemas de sonido de última generación en el corazón de la ciudad.' },
      { icon: Zap, title: 'Estanco Neón', description: 'Venta y distribución de bebidas importadas y experiencias exclusivas listas para el consumo premium.' }
    ],
    articles: [
      { title: 'El Futuro del Entretenimiento Nocturno Inmersivo', category: 'Tendencias', readTime: '6 min' },
      { title: 'Diseño Cyberpunk: De la Ciencia Ficción a las Marcas', category: 'Estilo', readTime: '5 min' },
      { title: 'Cómo la IA está Cambiando las Campañas de Marketing', category: 'Tecnología', readTime: '6 min' }
    ],
    isClassic: true
  },
  {
    id: 'sage',
    name: 'SAGE',
    niche: 'Gastronomía & Café Orgánico',
    badge: '// SERIE CLASSIC ACEDERA',
    accentColor: 'green',
    accentHex: '#84cc16',
    heroImage: '/hero/sage.jpg',
    heroTitle: 'Ingredientes Orgánicos. Cocina con Alma.',
    heroSubtitle: 'Gastronomía saludable inspirada en la naturaleza. Platos gourmet elaborados con insumos locales, orgánicos y libres de químicos.',
    primaryCTA: 'VER MENÚ',
    secondaryCTA: 'HACER PEDIDO',
    servicesTitle: 'Servicios Gourmet',
    services: [
      { icon: UtensilsCrossed, title: 'Restaurante Saludable', description: 'Menú de temporada con opciones veganas, vegetarianas y libres de gluten diseñadas por nutriólogos.' },
      { icon: Coffee, title: 'Café de Especialidad', description: 'Granos orgánicos tostados a fuego lento por baristas galardonados. Sabor puro y notas florales.' },
      { icon: Leaf, title: 'Mercado Orgánico', description: 'Venta directa de frutas, verduras y productos artesanales de agricultores locales comprometidos.' }
    ],
    articles: [
      { title: 'Beneficios de Consumir Alimentos Locales y de Temporada', category: 'Orgánico', readTime: '5 min' },
      { title: 'La Guía Definitiva del Café de Especialidad', category: 'Café', readTime: '6 min' },
      { title: 'Recetas Saludables y Rápidas para toda la Semana', category: 'Cocina', readTime: '4 min' }
    ],
    isClassic: true
  },
  {
    id: 'apex-classic',
    name: 'APEX CLASSIC',
    niche: 'Finanzas, Real Estate & Legal',
    badge: '// SERIE CLASSIC CORPORATIVA',
    accentColor: 'slate',
    accentHex: '#1e293b',
    heroImage: '/hero/apex-classic.jpg',
    heroTitle: 'Asesoría Estratégica. Consultoría.',
    heroSubtitle: 'Consultores de negocios especializados en derecho corporativo, inversiones inmobiliarias de alto rendimiento y estructuración financiera internacional.',
    primaryCTA: 'VER SERVICIOS',
    secondaryCTA: 'HABLAR CON ASESOR',
    servicesTitle: 'Consultoría Estratégica',
    services: [
      { icon: Briefcase, title: 'Estructura Corporativa', description: 'Constitución de empresas, contratos comerciales internacionales y blindaje legal integral.' },
      { icon: TrendingUp, title: 'Inversión Inmobiliaria', description: 'Análisis de plusvalía y estructuración de fondos de inversión en bienes raíces de lujo.' },
      { icon: Calculator, title: 'Consultoría Financiera', description: 'Planificación de recursos fiscales, fusiones y adquisiciones estratégicas con auditoría E2E.' }
    ],
    articles: [
      { title: 'Cómo Estructurar una Startup para Atraer Inversionistas', category: 'Finanzas', readTime: '7 min' },
      { title: 'Tendencias del Mercado Inmobiliario Corporativo 2026', category: 'Real Estate', readTime: '6 min' },
      { title: 'Protección Patrimonial: Estrategias Legales Clave', category: 'Corporativo', readTime: '5 min' }
    ],
    isClassic: true
  },
  {
    id: 'nova',
    name: 'NOVA',
    niche: 'E-commerce & Smart Gadgets',
    badge: '// SERIE CLASSIC COMERCIAL',
    accentColor: 'red',
    accentHex: '#ef4444',
    heroImage: '/hero/nova.jpg',
    heroTitle: 'Tecnología al Límite. Ventas.',
    heroSubtitle: 'La tienda de gadgets tecnológicos y artículos inteligentes más avanzada. Envío exprés a todo el país y garantía total de satisfacción en cada compra.',
    primaryCTA: 'COMPRAR AHORA',
    secondaryCTA: 'VER OFERTAS',
    servicesTitle: 'Línea de Productos',
    services: [
      { icon: Cpu, title: 'Gadgets Inteligentes', description: 'Relojes, audífonos, domótica y accesorios de última tecnología de las mejores marcas globales.' },
      { icon: Gamepad2, title: 'Hardware Gaming', description: 'Componentes para PC, tarjetas gráficas, procesadores y periféricos optimizados para competencia.' },
      { icon: ShieldPlus, title: 'Garantía Nova', description: 'Todos nuestros productos cuentan con garantía de cambio inmediato por 12 meses.' }
    ],
    articles: [
      { title: 'Los Gadgets que no te Pueden Faltar en 2026', category: 'Gadgets', readTime: '5 min' },
      { title: 'Cómo Armar una PC Gaming con Presupuesto Inteligente', category: 'Gaming', readTime: '6 min' },
      { title: 'Domótica en el Hogar: Convierte tu Casa en una Smart Home', category: 'Domótica', readTime: '4 min' }
    ],
    isClassic: true
  },
  {
    id: 'orbit',
    name: 'ORBIT',
    niche: 'Educación & Academias Online',
    badge: '// SERIE CLASSIC EDUCATIVA',
    accentColor: 'cyan',
    accentHex: '#06b6d4',
    heroImage: '/hero/orbit.jpg',
    heroTitle: 'Educación sin Límites. Crecimiento.',
    heroSubtitle: 'Plataforma de educación online con cursos prácticos, certificaciones oficiales y mentores expertos para impulsar tu carrera en la economía digital.',
    primaryCTA: 'EXPLORAR CURSOS',
    secondaryCTA: 'VER PLANES',
    servicesTitle: 'Nuestra Oferta',
    services: [
      { icon: BookOpen, title: 'Cursos Prácticos', description: 'Formación acelerada en marketing digital, diseño, programación, ventas y liderazgo.' },
      { icon: Users, title: 'Mentoría en Vivo', description: 'Sesiones semanales con instructores certificados para resolver dudas y revisar proyectos reales.' },
      { icon: ShieldPlus, title: 'Certificación Oficial', description: 'Acredita tus conocimientos con diplomas digitales válidos en la industria tecnológica.' }
    ],
    articles: [
      { title: 'Habilidades Más Demandadas por las Empresas en 2026', category: 'Carrera', readTime: '6 min' },
      { title: 'Cómo Mantener el Foco Estudiando de Forma Online', category: 'Tips', readTime: '5 min' },
      { title: 'Estrategias de Aprendizaje Acelerado para Adultos', category: 'Estudio', readTime: '7 min' }
    ],
    isClassic: true
  },
  {
    id: 'prism-classic',
    name: 'PRISM CLASSIC',
    niche: 'Fotografía & Arte Visual',
    badge: '// SERIE CLASSIC VISUAL',
    accentColor: 'pink',
    accentHex: '#ec4899',
    heroImage: '/hero/prism-classic.jpg',
    heroTitle: 'Capturando Momentos. Arte.',
    heroSubtitle: 'Estudio fotográfico profesional especializado en retratos editoriales, bodas de lujo, comerciales de televisión y cobertura de eventos exclusivos.',
    primaryCTA: 'VER PORTAFOLIO',
    secondaryCTA: 'COTIZAR ESTUDIO',
    servicesTitle: 'Nuestros Servicios',
    services: [
      { icon: Palette, title: 'Fotografía Editorial', description: 'Sesiones de estudio personalizadas para modelos, marcas de ropa y retratos corporativos.' },
      { icon: Gamepad2, title: 'Producción de Video', description: 'Grabación y edición en formato 4K para comerciales de televisión, redes sociales y videoclips.' },
      { icon: Crown, title: 'Bodas & Eventos', description: 'Cobertura artística y documental completa de momentos especiales con equipo de alta gama.' }
    ],
    articles: [
      { title: 'Cómo Prepararte para tu Primera Sesión de Fotos Profesional', category: 'Fotografía', readTime: '5 min' },
      { title: 'Tendencias en Fotografía Editorial y de Moda 2026', category: 'Moda', readTime: '6 min' },
      { title: 'Consejos de Composición para Principiantes', category: 'Arte', readTime: '4 min' }
    ],
    isClassic: true
  },
  {
    id: 'summit',
    name: 'SUMMIT',
    niche: 'Deportes, Gimnasio & Aventura',
    badge: '// SERIE CLASSIC ENERGÉTICA',
    accentColor: 'yellow',
    accentHex: '#facc15',
    heroImage: '/hero/summit.jpg',
    heroTitle: 'Supera tus Límites. Alcanza la Cima.',
    heroSubtitle: 'Programas deportivos de alto rendimiento, entrenamientos al aire libre, CrossFit extremo y preparación física especializada para atletas competitivos.',
    primaryCTA: 'CLASE GRATIS',
    secondaryCTA: 'VER PROGRAMAS',
    servicesTitle: 'Programas de Élite',
    services: [
      { icon: Dumbbell, title: 'Entrenamiento de Fuerza', description: 'Musculación y acondicionamiento general guiado por atletas de nivel nacional.' },
      { icon: Activity, title: 'CrossFit Extremo', description: 'Clases intensas y WODs desafiantes que llevarán tu condición cardiovascular al siguiente nivel.' },
      { icon: UserCheck, title: 'Coaching Deportivo', description: 'Monitoreo nutricional, planes de recuperación muscular y psicología del deporte.' }
    ],
    articles: [
      { title: '5 Suplementos Esenciales para Mejorar el Rendimiento Físico', category: 'Deporte', readTime: '5 min' },
      { title: 'Cómo Evitar Lesiones Comunes al Entrenar Fuerza', category: 'Seguridad', readTime: '6 min' },
      { title: 'La Importancia del Descanso en el Crecimiento Muscular', category: 'Recuperación', readTime: '5 min' }
    ],
    isClassic: true
  },
  {
    id: 'muse',
    name: 'MUSE',
    niche: 'Escritura & Periodismo de Opinión',
    badge: '// SERIE CLASSIC EDITORIAL',
    accentColor: 'gray',
    accentHex: '#4b5563',
    heroImage: '/hero/muse.jpg',
    heroTitle: 'Palabras que Inspiran. Historias.',
    heroSubtitle: 'Un espacio dedicado a la literatura contemporánea, el periodismo de investigación de calidad y la reflexión sobre la cultura contemporánea y la sociedad.',
    primaryCTA: 'LEER BLOG',
    secondaryCTA: 'SUSCRIBIRSE',
    servicesTitle: 'Secciones Editoriales',
    services: [
      { icon: FileText, title: 'Periodismo Crítico', description: 'Investigaciones profundas sobre temas sociales, económicos y culturales de actualidad.' },
      { icon: Palette, title: 'Reseñas de Arte', description: 'Análisis de libros, exposiciones, cine y teatro en una redacción cuidada y rigurosa.' },
      { icon: Users, title: 'Comunidad Literaria', description: 'Encuentros literarios, talleres de escritura creativa y foros de discusión mensual.' }
    ],
    articles: [
      { title: 'El Renacimiento del Periodismo de Investigación en Internet', category: 'Cultura', readTime: '7 min' },
      { title: 'Cómo Desarrollar el Hábito de la Escritura Diaria', category: 'Creación', readTime: '5 min' },
      { title: 'Los Mejores Libros de Ficción de la Primera Mitad del Año', category: 'Libros', readTime: '6 min' }
    ],
    isClassic: true
  },
  {
    id: 'vero',
    name: 'VERO',
    niche: 'Servicios, Reparaciones & Oficios',
    badge: '// SERIE CLASSIC PRÁCTICA',
    accentColor: 'amber',
    accentHex: '#fbbf24',
    heroImage: '/hero/vero.jpg',
    heroTitle: 'Soluciones del Hogar. Confianza.',
    heroSubtitle: 'Servicio técnico integral de plomería, electricidad, pintura y reparaciones generales para hogares, oficinas y locales comerciales con garantía total.',
    primaryCTA: 'SOLICITAR TÉCNICO',
    secondaryCTA: 'VER COSTOS',
    servicesTitle: 'Servicios Integrales',
    services: [
      { icon: Settings, title: 'Electricidad General', description: 'Instalación de iluminación, reparación de cortos, cableado estructurado y tableros eléctricos.' },
      { icon: Droplet, title: 'Plomería Profesional', description: 'Detección de fugas de agua, reparación de bombas, lavado de cisternas e instalaciones sanitarias.' },
      { icon: Hammer, title: 'Pintura & Acabados', description: 'Aplicación de pintura vinílica e impermeabilizantes de alta duración en fachadas e interiores.' }
    ],
    articles: [
      { title: 'Cómo Detectar Fugas de Agua Invisibles en Casa', category: 'Hogar', readTime: '5 min' },
      { title: 'Mantenimiento Eléctrico Preventivo para Negocios', category: 'Seguridad', readTime: '6 min' },
      { title: 'Guía para Impermeabilizar tu Techo antes de Lluvias', category: 'Técnica', readTime: '5 min' }
    ],
    isClassic: true
  },
  {
    id: 'haven-classic',
    name: 'HAVEN CLASSIC',
    niche: 'Arquitectura & Interiorismo',
    badge: '// SERIE CLASSIC GEOMÉTRICA',
    accentColor: 'amber',
    accentHex: '#78350f',
    heroImage: '/hero/haven-classic.jpg',
    heroTitle: 'Espacios Exclusivos. Interiorismo.',
    heroSubtitle: 'Diseño arquitectónico contemporáneo, interiorismo residencial de lujo y remodelación de espacios comerciales con un enfoque funcional y estético.',
    primaryCTA: 'VER PROYECTOS',
    secondaryCTA: 'COTIZAR DISEÑO',
    servicesTitle: 'Líneas de Diseño',
    services: [
      { icon: Home, title: 'Diseño Residencial', description: 'Planificación y construcción de casas personalizadas que combinan ecología y elegancia.' },
      { icon: Palette, title: 'Interiorismo Comercial', description: 'Decoración y optimización de espacios en restaurantes, oficinas y boutiques exclusivas.' },
      { icon: Settings, title: 'Remodelación Integral', description: 'Transformación completa de baños, cocinas y áreas comunes con materiales de lujo.' }
    ],
    articles: [
      { title: 'Tendencias en Interiorismo Sostenible para el 2026', category: 'Diseño', readTime: '6 min' },
      { title: 'Cómo Aprovechar al Máximo la Luz Natural en Casa', category: 'Arquitectura', readTime: '5 min' },
      { title: 'Claves del Diseño Minimalista para Espacios Pequeños', category: 'Interior', readTime: '5 min' }
    ],
    isClassic: true
  },
  {
    id: 'edison',
    name: 'EDISON',
    niche: 'Ciencia, Innovación & Energía',
    badge: '// SERIE CLASSIC VISIONARIA',
    accentColor: 'blue',
    accentHex: '#2563eb',
    heroImage: '/hero/edison.jpg',
    heroTitle: 'Energías Renovables. Innovación.',
    heroSubtitle: 'Soluciones de ingeniería en energía solar, automatización industrial, desarrollo de prototipos científicos y consultoría para proyectos de impacto ecológico.',
    primaryCTA: 'VER SOLUCIONES',
    secondaryCTA: 'COTIZAR PROYECTO',
    servicesTitle: 'Áreas de Ingeniería',
    services: [
      { icon: Zap, title: 'Solar Fotovoltaica', description: 'Instalación de paneles solares residenciales e industriales para reducir tu recibo de luz hasta un 98%.' },
      { icon: Cpu, title: 'Automatización IoT', description: 'Sensores e instrumentación a medida para el control remoto de procesos industriales en tiempo real.' },
      { icon: Briefcase, title: 'Consultoría Ecológica', description: 'Auditorías de huella de carbono y diseño de estrategias de transición energética sostenible.' }
    ],
    articles: [
      { title: 'El Futuro de la Energía Solar en América Latina', category: 'Energía', readTime: '6 min' },
      { title: 'Cómo el Internet de las Cosas (IoT) Optimiza Fábricas', category: 'IoT', readTime: '5 min' },
      { title: 'Estrategias de Sostenibilidad y Ahorro para Empresas', category: 'Sostenible', readTime: '6 min' }
    ],
    isClassic: true
  },
  {
    id: 'homeservices',
    name: 'HOMEPRO',
    niche: 'Servicios del Hogar',
    badge: '// SOLUCIONES PROFESIONALES PARA TU HOGAR',
    accentColor: 'cyan',
    accentHex: '#06B6D4',
    heroImage: '',
    heroTitle: 'Expertos en tu Hogar, Siempre',
    heroSubtitle: 'Soluciones integrales de plomería, aire acondicionado, electricidad y limpieza con técnicos certificados y garantía real.',
    primaryCTA: 'COTIZAR AHORA',
    secondaryCTA: 'VER SERVICIOS',
    servicesTitle: 'Servicios Profesionales para tu Hogar',
    services: [
      { icon: Wrench, title: 'Plomería Especializada', description: 'Reparación de fugas, destapes, instalación de calentadores y remodelaciones de baño y cocina con garantía por escrito.' },
      { icon: AirVent, title: 'Aire Acondicionado y Climatización', description: 'Instalación, mantenimiento preventivo y reparación de sistemas HVAC para hogares y oficinas con técnicos certificados.' },
      { icon: Zap, title: 'Electricidad Residencial', description: 'Instalaciones eléctricas, tableros, cableado estructurado, acometidas y soluciones de respaldo energético seguro.' },
      { icon: Sparkles, title: 'Limpieza Profesional', description: 'Servicio de limpieza profunda, sanitización, limpieza post-obra y mantenimiento periódico para hogares y comercios.' }
    ],
    articles: [
      { title: '5 señales de que tu sistema de aire acondicionado necesita mantenimiento urgente', category: 'HVAC', readTime: '5 min' },
      { title: 'Cómo prevenir fugas de agua: guía práctica para propietarios', category: 'Plomería', readTime: '4 min' },
      { title: 'Instalaciones eléctricas seguras: normativas actualizadas 2025', category: 'Electricidad', readTime: '6 min' }
    ],
    isClassic: true
  },
  {
    id: 'esteticaavanzada',
    name: 'AESTHETICA',
    niche: 'Estética Avanzada',
    badge: '// MEDICINA ESTÉTICA Y CIRUGÍA PLÁSTICA',
    accentColor: 'purple',
    accentHex: '#A855F7',
    heroImage: '',
    heroTitle: 'Transforma tu Imagen, Eleva tu Confianza',
    heroSubtitle: 'Tratamientos de medicina estética y cirugía plástica con tecnología de vanguardia y médicos certificados en un entorno premium.',
    primaryCTA: 'AGENDAR VALORACIÓN',
    secondaryCTA: 'EXPLORAR TRATAMIENTOS',
    servicesTitle: 'Tratamientos de Excelencia Médica',
    services: [
      { icon: ScanFace, title: 'Depilación Láser y Rejuvenecimiento', description: 'Tecnología láser de última generación para depilación permanente, tratamiento de manchas y rejuvenecimiento facial no invasivo.' },
      { icon: Sparkles, title: 'Dermatología Clínica y Cosmética', description: 'Diagnóstico y tratamiento de afecciones cutáneas, peelings químicos, mesoterapia y protocolos personalizados de skincare médico.' },
      { icon: HeartPulse, title: 'Cirugía Plástica y Reconstructiva', description: 'Procedimientos quirúrgicos faciales y corporales realizados por cirujanos plásticos certificados con enfoque en resultados naturales.' },
      { icon: Gem, title: 'Medicina Antienvejecimiento', description: 'Tratamientos con toxina botulínica, ácido hialurónico, hilos tensores y terapias regenerativas para una apariencia fresca y natural.' }
    ],
    articles: [
      { title: 'Depilación láser: mitos y realidades que debes conocer antes de tu primera sesión', category: 'Belleza', readTime: '7 min' },
      { title: 'Rutina de skincare médico: el protocolo dermatológico definitivo', category: 'Dermatología', readTime: '5 min' },
      { title: 'Cirugía plástica segura: cómo elegir al cirujano correcto', category: 'Salud', readTime: '8 min' }
    ],
    isClassic: true
  },
  {
    id: 'psicologia',
    name: 'MINDCARE',
    niche: 'Psicología y Salud Mental',
    badge: '// BIENESTAR EMOCIONAL Y MENTAL',
    accentColor: 'green',
    accentHex: '#10B981',
    heroImage: '',
    heroTitle: 'Tu Mente Importa. Empieza Hoy',
    heroSubtitle: 'Terapia psicológica profesional presencial y online con psicólogos certificados. Un espacio seguro para tu crecimiento personal.',
    primaryCTA: 'RESERVAR SESIÓN',
    secondaryCTA: 'CONOCER ENFOQUES',
    servicesTitle: 'Especialidades Terapéuticas',
    services: [
      { icon: Brain, title: 'Terapia Cognitivo-Conductual', description: 'Tratamiento basado en evidencia para ansiedad, depresión, trastornos obsesivos y manejo del estrés con resultados medibles.' },
      { icon: HeartHandshake, title: 'Psicología Clínica y Online', description: 'Atención psicológica individual para adultos, adolescentes y parejas. Sesiones presenciales y terapia online con total privacidad.' },
      { icon: BookOpen, title: 'Evaluaciones Psicológicas', description: 'Evaluaciones neuropsicológicas, diagnóstico de TDAH, perfil de personalidad e informes psicológicos para procesos legales.' },
      { icon: Sparkles, title: 'Bienestar y Crecimiento Personal', description: 'Coaching de vida, manejo de emociones, desarrollo de habilidades sociales y programas de mindfulness para el rendimiento óptimo.' }
    ],
    articles: [
      { title: 'Ansiedad generalizada: señales de alerta y cuándo buscar ayuda profesional', category: 'Salud Mental', readTime: '6 min' },
      { title: 'Terapia online vs presencial: qué modelo se adapta mejor a tu estilo de vida', category: 'Bienestar', readTime: '5 min' },
      { title: 'Mindfulness científico: técnicas probadas para reducir el estrés laboral', category: 'Productividad', readTime: '4 min' }
    ],
    isClassic: true
  },
  {
    id: 'detailing',
    name: 'AUTOLUXE',
    niche: 'Estética Automotriz',
    badge: '// CUIDADO PREMIUM PARA TU VEHÍCULO',
    accentColor: 'amber',
    accentHex: '#F59E0B',
    heroImage: '',
    heroTitle: 'Tu Auto, Como Nuevo Siempre',
    heroSubtitle: 'Car wash premium, ceramic coating, polarizado y personalización con productos de grado profesional y técnicos especializados.',
    primaryCTA: 'RESERVAR TURNO',
    secondaryCTA: 'VER TRATAMIENTOS',
    servicesTitle: 'Servicios de Estética Automotriz',
    services: [
      { icon: Car, title: 'Car Wash y Detailing Premium', description: 'Lavado profesional con productos pH neutros, descontaminación de pintura, pulido y encerado para un acabado de concesionario.' },
      { icon: Droplets, title: 'Ceramic Coating y Protección de Pintura', description: 'Aplicación de recubrimientos cerámicos de alta duración que protegen la pintura de rayones UV, químicos y contaminantes ambientales.' },
      { icon: Sun, title: 'Polarizado y Protección Solar', description: 'Instalación de láminas de polarizado de alta calidad con protección UV 99%, reducción de calor y privacidad garantizada.' },
      { icon: Paintbrush, title: 'Personalización y Tuning Estético', description: 'Wrapping vinílico, pintura de calipers, restauración de faros, instalación de body kits y modificaciones estéticas personalizadas.' }
    ],
    articles: [
      { title: 'Ceramic coating vs cera tradicional: diferencias, durabilidad y costos reales', category: 'Automotriz', readTime: '6 min' },
      { title: 'Guía de mantenimiento post-detailing: cómo conservar el acabado por más tiempo', category: 'Cuidado', readTime: '4 min' },
      { title: 'Polarizado legal: normativas, porcentajes permitidos y multas vigentes', category: 'Legal', readTime: '5 min' }
    ],
    isClassic: true
  },
  {
    id: 'eventos',
    name: 'EVENTUS',
    niche: 'Eventos y Producción',
    badge: '// PRODUCCIÓN DE EVENTOS INOLVIDABLES',
    accentColor: 'red',
    accentHex: '#EF4444',
    heroImage: '',
    heroTitle: 'Creamos Momentos que Perduran',
    heroSubtitle: 'Producción integral de bodas, eventos corporativos y celebraciones con diseño personalizado, fotografía profesional y entretenimiento de clase mundial.',
    primaryCTA: 'COTIZAR MI EVENTO',
    secondaryCTA: 'VER PORTAFOLIO',
    servicesTitle: 'Servicios de Producción Integral',
    services: [
      { icon: Calendar, title: 'Wedding Planning y Coordinación', description: 'Planificación completa de bodas desde el concepto hasta el día del evento: coordinación de proveedores, cronograma y gestión de cada detalle.' },
      { icon: Camera, title: 'Fotografía y Cinematografía Profesional', description: 'Cobertura fotográfica y cinematográfica de eventos con edición profesional, álbumes impresos y videos de alta producción.' },
      { icon: Music, title: 'DJ, Sonido e Iluminación', description: 'Servicio de DJ profesional con equipos de sonido e iluminación de alta gama para crear la atmósfera perfecta en cada momento.' },
      { icon: PartyPopper, title: 'Decoración y Diseño de Ambientación', description: 'Diseño floral, mobiliario, iluminación decorativa y ambientación temática personalizada para eventos corporativos y sociales.' }
    ],
    articles: [
      { title: 'Presupuesto de boda 2025: guía realista para planificar sin estrés financiero', category: 'Bodas', readTime: '8 min' },
      { title: 'Tendencias en fotografía de eventos: estilos que dominarán este año', category: 'Tendencias', readTime: '5 min' },
      { title: 'Eventos corporativos exitosos: claves de producción que impresionan a tu equipo', category: 'Corporativo', readTime: '6 min' }
    ],
    isClassic: true
  }
];

export function getTemplateById(id: string): TemplateData | undefined {
  return templates.find(t => t.id === id);
}
