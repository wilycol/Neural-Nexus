#!/bin/bash

# Neural Feed Deploy Script
# Uso: ./deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}

echo "🚀 Neural Feed Deploy Script"
echo "=============================="
echo "Environment: $ENVIRONMENT"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI no está instalado${NC}"
    echo "Instalando..."
    npm i -g vercel
fi

# Check if user is logged in
echo -e "${YELLOW}🔑 Verificando login de Vercel...${NC}"
vercel whoami || (echo -e "${RED}❌ No estás logueado. Ejecuta: vercel login${NC}" && exit 1)

# Install dependencies
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install

# Run type check
echo -e "${YELLOW}🔍 Verificando tipos...${NC}"
npx tsc --noEmit

# Run lint
echo -e "${YELLOW}🧹 Ejecutando linter...${NC}"
npm run lint

# Build
echo -e "${YELLOW}🏗️  Construyendo...${NC}"
if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod
else
    vercel
fi

echo ""
echo -e "${GREEN}✅ Deploy completado!${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Configura las variables de entorno en el dashboard de Vercel"
echo "2. Configura el cron job en Settings → Cron Jobs"
echo "3. Verifica que Supabase esté configurado correctamente"
echo ""
echo "URLs útiles:"
echo "- Dashboard: https://vercel.com/dashboard"
echo "- Project: https://vercel.com/your-project"
