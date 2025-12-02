# Frontend - Sistema de Gestión

Aplicación frontend desarrollada con Angular 20.3.5 para la gestión de productos, pedidos, clientes y métodos de pago.

## Características

- **Autenticación y Autorización**: Sistema de login con JWT y guards de protección de rutas
- **Gestión de Catálogo**: Visualización y administración de productos
- **Gestión de Pedidos**: Creación y seguimiento de pedidos con estrategias de precios dinámicas
- **Gestión de Inventario**: Control de stock de productos
- **Dashboard**: Panel de control con métricas del sistema
- **UI Moderna**: Implementación con Tailwind CSS y componentes reutilizables

## Tecnologías

- Angular 20.3.5
- TypeScript
- Tailwind CSS
- RxJS
- Angular Router con Guards

## Servidor de Desarrollo

Para iniciar el servidor de desarrollo local, ejecuta:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`. Se recargará automáticamente cuando modifiques los archivos fuente.

## Generación de Código

Angular CLI incluye herramientas de scaffolding. Para generar un nuevo componente:

```bash
ng generate component nombre-componente
```

Para ver la lista completa de esquemáticos disponibles (`components`, `directives`, `pipes`):

```bash
ng generate --help
```

## Construcción

Para construir el proyecto ejecuta:

```bash
ng build
```

Los artefactos de construcción se almacenarán en el directorio `dist/`. Por defecto, la construcción de producción optimiza la aplicación para rendimiento.

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios, guards, interceptors, modelos
│   │   ├── guards/          # Protección de rutas (auth, role)
│   │   ├── interceptors/    # Interceptor de autenticación
│   │   ├── models/          # Modelos de datos
│   │   ├── services/        # Servicios de API
│   │   └── layout/          # Componentes de layout y UI
│   └── features/            # Módulos de funcionalidades
│       ├── auth/            # Login y autenticación
│       ├── catalogo/        # Catálogo de productos
│       ├── inventario/      # Gestión de inventario
│       ├── pedidos/         # Gestión de pedidos
│       ├── config/          # Configuraciones (gateways, pricing)
│       └── dashboard/       # Panel de control
```

## Conexión con Backend

El frontend se conecta al backend Spring Boot en `http://localhost:8080/api`. Asegúrate de que el backend esté ejecutándose antes de iniciar la aplicación.

## Más Información

Para más información sobre Angular CLI:
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev)
