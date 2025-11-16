#!/bin/bash

# Script de ayuda para comandos Docker comunes
# Uso: ./docker-helper.sh [comando]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Docker Helper - TP Desarrollo de Software${NC}\n"

case "$1" in
  build)
    echo -e "${YELLOW}📦 Construyendo imágenes Docker...${NC}"
    docker compose build
    echo -e "${GREEN}✅ Imágenes construidas exitosamente${NC}"
    ;;
  
  up)
    echo -e "${YELLOW}🚀 Iniciando contenedores...${NC}"
    docker compose up -d
    echo -e "${GREEN}✅ Contenedores iniciados${NC}"
    echo -e "${BLUE}Frontend: http://localhost${NC}"
    echo -e "${BLUE}Backend: http://localhost:3000/api${NC}"
    echo -e "${BLUE}Swagger: http://localhost:3000/api-docs${NC}"
    ;;
  
  down)
    echo -e "${YELLOW}🛑 Deteniendo contenedores...${NC}"
    docker compose down
    echo -e "${GREEN}✅ Contenedores detenidos${NC}"
    ;;
  
  restart)
    echo -e "${YELLOW}🔄 Reiniciando contenedores...${NC}"
    docker compose restart
    echo -e "${GREEN}✅ Contenedores reiniciados${NC}"
    ;;
  
  logs)
    if [ -z "$2" ]; then
      echo -e "${YELLOW}📋 Mostrando logs de todos los servicios...${NC}"
      docker compose logs -f
    else
      echo -e "${YELLOW}📋 Mostrando logs de $2...${NC}"
      docker compose logs -f "$2"
    fi
    ;;
  
  status)
    echo -e "${YELLOW}📊 Estado de los contenedores:${NC}"
    docker compose ps
    echo ""
    echo -e "${YELLOW}💾 Uso de recursos:${NC}"
    docker stats --no-stream
    ;;
  
  clean)
    echo -e "${RED}🧹 Limpiando contenedores y volúmenes...${NC}"
    read -p "¿Estás seguro? Esto eliminará TODOS los datos de MongoDB (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker compose down -v
      echo -e "${GREEN}✅ Limpieza completada${NC}"
    else
      echo -e "${YELLOW}⚠️  Operación cancelada${NC}"
    fi
    ;;
  
  reset)
    echo -e "${RED}🔄 Reset completo (rebuild desde cero)...${NC}"
    read -p "¿Estás seguro? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker compose down -v
      docker compose build --no-cache
      docker compose up -d
      echo -e "${GREEN}✅ Reset completado${NC}"
    else
      echo -e "${YELLOW}⚠️  Operación cancelada${NC}"
    fi
    ;;
  
  mongo)
    echo -e "${YELLOW}🍃 Conectando a MongoDB...${NC}"
    docker compose exec mongodb mongosh -u admin -p admin123 tienda_db
    ;;
  
  backend-shell)
    echo -e "${YELLOW}🔧 Abriendo shell en backend...${NC}"
    docker compose exec backend sh
    ;;
  
  test)
    echo -e "${YELLOW}🧪 Ejecutando tests...${NC}"
    echo -e "${BLUE}Tests de Integración:${NC}"
    docker compose exec backend npm test
    ;;
  
  help|*)
    echo -e "${BLUE}Comandos disponibles:${NC}\n"
    echo -e "  ${GREEN}build${NC}           - Construir imágenes Docker"
    echo -e "  ${GREEN}up${NC}              - Iniciar todos los contenedores"
    echo -e "  ${GREEN}down${NC}            - Detener todos los contenedores"
    echo -e "  ${GREEN}restart${NC}         - Reiniciar todos los contenedores"
    echo -e "  ${GREEN}logs [servicio]${NC} - Ver logs (backend, frontend, mongodb)"
    echo -e "  ${GREEN}status${NC}          - Ver estado y uso de recursos"
    echo -e "  ${GREEN}clean${NC}           - Limpiar contenedores y volúmenes"
    echo -e "  ${GREEN}reset${NC}           - Reset completo (rebuild desde cero)"
    echo -e "  ${GREEN}mongo${NC}           - Conectar a MongoDB shell"
    echo -e "  ${GREEN}backend-shell${NC}   - Abrir shell en contenedor backend"
    echo -e "  ${GREEN}test${NC}            - Ejecutar tests"
    echo -e "  ${GREEN}help${NC}            - Mostrar esta ayuda"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo -e "  ./docker-helper.sh build"
    echo -e "  ./docker-helper.sh up"
    echo -e "  ./docker-helper.sh logs backend"
    echo -e "  ./docker-helper.sh status"
    ;;
esac
