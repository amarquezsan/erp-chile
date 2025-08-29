# ERP Chile
Sistema ERP desarrollado para empresas chilenas
# ERP Chile - Sistema de Gestión Empresarial

Sistema ERP desarrollado específicamente para empresas chilenas con soporte completo para facturación electrónica y cumplimiento con normativas del SII.

## 🚀 Características Principales

- **Facturación Electrónica**: Compatible con DTE y SII
- **Dashboard Analítico**: KPIs y métricas en tiempo real
- **Gestión de Inventario**: Control completo de productos y stock
- **CRM Integrado**: Gestión de clientes y proveedores
- **Contabilidad**: Módulo contable completo
- **Reportes**: Informes detallados y análisis
- **Diseño Moderno**: Interfaz profesional y responsiva

## 🛠 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Gráficos**: Chart.js, Recharts

## 📦 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/amarquezsan/erp-chile.git
   cd erp-chile
   ```

2. Instalar dependencias:
   ```bash
   yarn install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. Ejecutar migraciones de base de datos:
   ```bash
   yarn prisma migrate dev
   ```

5. Sembrar datos de prueba:
   ```bash
   yarn prisma db seed
   ```

6. Iniciar servidor de desarrollo:
   ```bash
   yarn dev
   ```

## 🌐 Despliegue

Este proyecto está optimizado para desplegarse en Vercel:

1. Conectar repositorio con Vercel
2. Configurar variables de entorno en Vercel
3. El deployment será automático

## 📄 Variables de Entorno

```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="tu-clave-secreta"
```

## 🤝 Contribución

Este proyecto está en desarrollo activo. Para contribuir o reportar problemas, por favor contacta al desarrollador.

## 📜 Licencia

Desarrollado para empresas chilenas - Todos los derechos reservados.
