# Neural Feed - Portal de Noticias de IA

![Neural Feed Logo](./public/logo.png)

> Tu fuente automática de noticias sobre Inteligencia Artificial. Resúmenes generados por IA, análisis profundos y las últimas novedades del ecosistema de IA.

## Características

- **Scroll Infinito**: Feed de noticias con carga infinita
- **Top 5 Diario**: Posts largos generados por IA con las noticias más virales
- **Autenticación**: Login con Google/Email + nickname único
- **Social Features**: Likes, comentarios, shares y favoritos
- **Gamificación**: Contador de shares por usuario
- **Dark/Light Mode**: Tema adaptable
- **Automatización**: Crawler + IA (Groq) para procesar noticias
- **Premium**: Suscripción sin anuncios

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Base de Datos**: Supabase
- **IA**: Groq (Llama 3.1 8B)
- **Deploy**: Vercel

## Estructura del Proyecto

```
neural-feed/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── news/         # Endpoints de noticias
│   │   ├── blog/         # Endpoints de blog
│   │   ├── auth/         # Autenticación
│   │   └── cron/         # Cron jobs
│   ├── login/            # Página de login
│   ├── registro/         # Página de registro
│   ├── page.tsx          # Página principal
│   └── layout.tsx        # Layout raíz
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── logo.tsx          # Logo SVG
│   ├── header.tsx        # Header
│   ├── sidebar.tsx       # Sidebar
│   ├── news-card.tsx     # Tarjeta de noticia
│   ├── news-feed.tsx     # Feed de noticias
│   └── top5-section.tsx  # Sección Top 5
├── lib/                   # Utilidades
│   ├── supabase.ts       # Cliente Supabase
│   ├── groq.ts           # Integración Groq
│   └── utils.ts          # Utilidades generales
├── hooks/                 # Custom hooks
│   └── use-infinite-news.ts
├── types/                 # Tipos TypeScript
│   ├── index.ts          # Tipos generales
│   └── database.ts       # Tipos de Supabase
└── public/               # Assets estáticos
```

## Configuración Local

### 1. Clonar y Instalar

```bash
git clone <repo-url>
cd neural-feed
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Groq AI
GROQ_API_KEY=tu_groq_api_key

# Cron (opcional)
CRON_SECRET=tu_cron_secret
```

### 3. Configurar Supabase

#### Tablas necesarias:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  share_count INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user'
);

-- Tabla de noticias
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_icon TEXT,
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  relevance_score FLOAT DEFAULT 0.5,
  mention_count INTEGER DEFAULT 1,
  is_top_story BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE NOT NULL
);

-- Tabla de blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id TEXT NOT NULL,
  author_nickname TEXT NOT NULL,
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  related_news UUID[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE
);

-- Tabla de likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, news_id),
  UNIQUE(user_id, blog_post_id)
);

-- Tabla de comentarios
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_nickname TEXT NOT NULL,
  user_avatar TEXT,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_moderated BOOLEAN DEFAULT FALSE,
  toxicity_score FLOAT
);

-- Tabla de favoritos
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, news_id)
);

-- Tabla de shares
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de fuentes de noticias
CREATE TABLE news_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  rss_url TEXT NOT NULL,
  icon_url TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  last_fetch_at TIMESTAMP,
  fetch_count INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 1
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  plan TEXT DEFAULT 'monthly',
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  payment_method TEXT
);
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy a Vercel

### 1. Configurar proyecto

```bash
npm i -g vercel
vercel login
vercel
```

### 2. Variables de entorno en Vercel

Configura las mismas variables en el dashboard de Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `CRON_SECRET`

### 3. Cron Job (Automatización)

Configura un cron job en Vercel para ejecutar cada 15 minutos:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/process",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

O usa el panel de Vercel: Settings → Cron Jobs

### 4. Deploy

```bash
vercel --prod
```

## Agregar Nuevas Fuentes

### 1. Por interfaz (próximamente)

Panel de admin para agregar fuentes RSS.

### 2. Directamente en base de datos

```sql
INSERT INTO news_sources (name, rss_url, category, priority)
VALUES (
  'Nueva Fuente',
  'https://nuevafuente.com/feed.xml',
  'general',
  1
);
```

### 3. Fuentes RSS soportadas

- TechCrunch AI
- OpenAI Blog
- Anthropic
- Google DeepMind
- Hugging Face
- MIT Technology Review
- VentureBeat AI
- Wired AI
- AI Trends

## Escalar IA

### Cambiar modelo de Groq

En `lib/groq.ts`:

```typescript
const completion = await groq.chat.completions.create({
  model: 'llama-3.1-70b-instant', // Modelo más grande
  // ...
});
```

Modelos disponibles:
- `llama-3.1-8b-instant` (rápido, económico)
- `llama-3.1-70b-instant` (más preciso)
- `mixtral-8x7b-32768` (alternativa)
- `gemma-7b-it` (ligero)

### Ajustar parámetros

```typescript
const completion = await groq.chat.completions.create({
  temperature: 0.3,  // Más bajo = más determinista
  max_tokens: 4000,  // Más largo = más contenido
  // ...
});
```

## Roadmap

- [ ] Panel de administración
- [ ] Sistema de notificaciones push
- [ ] App móvil (PWA)
- [ ] Integración con más fuentes (X/Twitter)
- [ ] Sistema de recomendaciones personalizadas
- [ ] Newsletter automatizado
- [ ] API pública
- [ ] Webhooks

## Contribuir

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -am 'Add nueva feature'`)
4. Push al branch (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## Contacto

- Twitter: [@neuralfeed](https://twitter.com/neuralfeed)
- Email: hola@neuralfeed.ai

---

<p align="center">
  Hecho con ❤️ y 🤖 por el equipo de Neural Feed
</p>
