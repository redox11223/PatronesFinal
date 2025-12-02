# Sistema de Gestion - Patrones de Diseno

Aplicacion web para gestion de productos, pedidos, clientes y pagos con Spring Boot y Angular.

## Requisitos Previos

- JDK 21 o superior
- PostgreSQL 12 o superior
- Maven (incluido via Maven Wrapper)

## Inicio Rapido

### 1. Configurar Base de Datos

```sql
CREATE DATABASE patronestest1;
```

Editar `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/patronestest1
spring.datasource.username=postgres
spring.datasource.password=tu_contrasena
```

### 2. Ejecutar el Backend

```cmd
cd backend
.\mvnw.cmd spring-boot:run
```

Servidor disponible en: `http://localhost:8080`

### 3. Acceder a Swagger

```
http://localhost:8080/swagger-ui/index.html
```

## Pruebas Rapidas

### Registrar Usuario (Postman)

POST `http://localhost:8080/api/auth/registro`

```json
{
    "username": "admin",
    "password": "password123",
    "email": "admin@techsolutions.com",
    "rol": {"nombre": "ADMIN"}
}
```

### Login

POST `http://localhost:8080/api/auth/login`

```json
{
    "username": "admin",
    "password": "password123"
}
```

Usar Basic Auth con `username:password` para endpoints protegidos.

## Endpoints Principales

- GET/POST/PUT/DELETE `/v1/productos` - Gestion de productos
- GET/POST/PUT `/v1/pedidos` - Gestion de pedidos
- GET/POST/PUT `/v1/clientes` - Gestion de clientes

## Tecnologias

- Java 21
- Spring Boot 3.5.8
- PostgreSQL
- Spring Security
- SpringDoc OpenAPI 2.2.0

## Comandos Utiles

```cmd
.\mvnw.cmd clean install          # Compilar
.\mvnw.cmd spring-boot:run        # Ejecutar
.\mvnw.cmd clean package -DskipTests  # Generar JAR
```

## Frontend (Angular)

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Ejecutar el Frontend

```cmd
cd frontend
npm install
npm start
```

Aplicacion disponible en: `http://localhost:4200`

### Estructura Principal

```
frontend/src/app/
├── core/
│   ├── guards/          # Proteccion de rutas
│   ├── interceptors/    # Interceptor HTTP para auth
│   ├── services/        # Servicios de API
│   └── models/          # Modelos de datos
├── features/
│   ├── auth/            # Login y registro
│   ├── catalogo/        # Listado de productos
│   ├── inventario/      # Gestion de productos
│   ├── pedidos/         # Gestion de pedidos
│   └── dashboard/       # Panel principal
```

### Tecnologias Frontend

- Angular 20.3
- TypeScript
- Tailwind CSS
- Spartan UI Components

### Comandos Frontend

```cmd
npm install              # Instalar dependencias
npm start                # Ejecutar en desarrollo
npm run build            # Compilar para produccion
```

### Configuracion de API

Editar la URL del backend en los servicios (`src/app/core/services/*.service.ts`):

```typescript
private apiUrl = 'http://localhost:8080';
```

## Solucion Problemas

### Backend

- Puerto 8080 ocupado: Cambiar `server.port` en `application.properties`
- Error de conexion BD: Verificar credenciales y que PostgreSQL este corriendo
- Swagger error 500: Verificar version SpringDoc 2.2.0 en `pom.xml`

### Frontend

- Error de dependencias: Ejecutar `npm install --legacy-peer-deps`
- Puerto 4200 ocupado: Cambiar puerto en `angular.json` o usar `ng serve --port 4201`
- Error de CORS: Verificar configuracion CORS en `SecurityConfig.java` del backend

