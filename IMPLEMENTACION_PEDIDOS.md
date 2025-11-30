# 📋 Implementación Completa de Pedidos y PedidoDetalle

## ✅ Resumen de la Implementación

### **Entidades Actualizadas:**

#### 1️⃣ **Pedido.java**
- ✅ Agregado `@Id` y `@GeneratedValue`
- ✅ Validaciones Jakarta:
  - `@NotNull` en total, estado, usuario
  - `@PositiveOrZero` en total y descuento
- ✅ Cambio de tipo `int total` → `Double total`
- ✅ Anotación `@JsonManagedReference` en detalles (evita referencia circular)
- ✅ Campos con timestamps: `fechaCreacion`, `fechaActualizacion`

#### 2️⃣ **PedidoDetalle.java**
- ✅ Validaciones Jakarta:
  - `@NotNull` y `@Positive` en cantidad, precioUnitario, subtotal, producto
- ✅ Anotación `@JsonBackReference` en pedido (evita referencia circular)
- ✅ Relaciones correctas con Pedido y Producto

#### 3️⃣ **PedidoEstado.java**
- ✅ Enum con valores: PENDIENTE, EN_PROCESO, COMPLETADO, CANCELADO

---

### **Repositorio:**

#### 4️⃣ **PedidoRepo.java**
```java
public interface PedidoRepo extends JpaRepository<Pedido, Long> {
  List<Pedido> findByUsuarioId(Long usuarioId);
  List<Pedido> findByEstado(PedidoEstado estado);
}
```

---

### **Servicio:**

#### 5️⃣ **PedidoService.java** (Interfaz)
Métodos:
- `savePedido(Pedido pedido)`
- `getAllPedidos()`
- `getPedidoById(Long id)`
- `updatePedido(Long id, Pedido pedido)`
- `cancelarPedido(Long id)` ⭐ NUEVO
- `getPedidosByUsuarioId(Long usuarioId)` ⭐ NUEVO
- `getPedidosByEstado(PedidoEstado estado)` ⭐ NUEVO

#### 6️⃣ **PedidoServiceImpl.java** (Implementación completa)

**Funcionalidades implementadas:**

1. **`savePedido()`**:
   - ✅ Valida que el usuario existe
   - ✅ Establece estado inicial como PENDIENTE
   - ✅ Valida que haya al menos un detalle
   - ✅ Valida stock disponible para cada producto
   - ✅ Calcula precio unitario y subtotal automáticamente
   - ✅ Actualiza el stock de productos (resta cantidad vendida)
   - ✅ Calcula el total del pedido
   - ✅ Aplica descuento si existe
   - ✅ Usa `@Transactional` para garantizar consistencia

2. **`getAllPedidos()`**:
   - ✅ Devuelve todos los pedidos

3. **`getPedidoById()`**:
   - ✅ Busca pedido por ID
   - ✅ Lanza excepción si no existe

4. **`updatePedido()`**:
   - ✅ Permite actualizar estado del pedido
   - ✅ Permite actualizar descuento
   - ✅ Recalcula total si cambia el descuento
   - ✅ Usa `@Transactional`

5. **`cancelarPedido()`** ⭐:
   - ✅ Valida que no esté COMPLETADO
   - ✅ Valida que no esté ya CANCELADO
   - ✅ Devuelve stock a los productos
   - ✅ Cambia estado a CANCELADO
   - ✅ Usa `@Transactional`

6. **`getPedidosByUsuarioId()`** ⭐:
   - ✅ Filtra pedidos por usuario

7. **`getPedidosByEstado()`** ⭐:
   - ✅ Filtra pedidos por estado

---

### **Controlador:**

#### 7️⃣ **PedidoController.java** ⭐ NUEVO

**Endpoints implementados:**

| Método | Endpoint | Descripción | Seguridad |
|--------|----------|-------------|-----------|
| POST | `/v1/pedidos` | Crear pedido | USER, ADMIN |
| GET | `/v1/pedidos` | Obtener todos los pedidos | ADMIN |
| GET | `/v1/pedidos/{id}` | Obtener pedido por ID | USER, ADMIN |
| PUT | `/v1/pedidos/{id}` | Actualizar pedido | ADMIN |
| PATCH | `/v1/pedidos/{id}/cancelar` | Cancelar pedido | USER, ADMIN |
| GET | `/v1/pedidos/usuario/{usuarioId}` | Pedidos por usuario | USER, ADMIN |
| GET | `/v1/pedidos/estado/{estado}` | Pedidos por estado | ADMIN |

**Características:**
- ✅ Usa `ApiResponse<T>` de la carpeta shared
- ✅ Validación con `@Valid` en el body
- ✅ Seguridad con `@PreAuthorize`
- ✅ Respuestas consistentes (201 Created, 200 OK)
- ✅ Mensajes descriptivos

---

### **Manejo de Excepciones:**

#### 8️⃣ **GlobalException.java** (Actualizado)

**Manejadores implementados:**

1. **`handleIllegalArgumentException`**:
   - Captura errores de validación de negocio
   - Retorna 400 BAD_REQUEST con ApiResponse

2. **`handleValidationExceptions`**:
   - Captura errores de validación Jakarta (`@Valid`)
   - Retorna mapa de errores por campo
   - Retorna 400 BAD_REQUEST con ApiResponse

3. **`handleRuntimeException`**:
   - Captura errores en tiempo de ejecución
   - Retorna 500 INTERNAL_SERVER_ERROR con ApiResponse

4. **`handleGenericException`**:
   - Captura cualquier otra excepción
   - Retorna 500 INTERNAL_SERVER_ERROR con ApiResponse

---

## 🧪 Ejemplos de Uso en Postman

### **1. Crear un Pedido:**

**POST** `http://localhost:8080/v1/pedidos`

**Headers:**
```
Content-Type: application/json
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

**Body:**
```json
{
  "usuario": {
    "id": 1
  },
  "descuento": 0,
  "detalles": [
    {
      "producto": {
        "id": 1
      },
      "cantidad": 2
    },
    {
      "producto": {
        "id": 2
      },
      "cantidad": 1
    }
  ]
}
```

**Respuesta esperada (201 Created):**
```json
{
  "timestamp": "2025-11-29T18:00:00",
  "status": 201,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "total": 150.50,
    "estado": "PENDIENTE",
    "usuario": {
      "id": 1,
      "username": "admin"
    },
    "detalles": [
      {
        "id": 1,
        "cantidad": 2,
        "precioUnitario": 50.00,
        "subtotal": 100.00,
        "producto": {
          "id": 1,
          "nombre": "Laptop HP"
        }
      },
      {
        "id": 2,
        "cantidad": 1,
        "precioUnitario": 50.50,
        "subtotal": 50.50,
        "producto": {
          "id": 2,
          "nombre": "Mouse Logitech"
        }
      }
    ],
    "descuento": 0,
    "fechaCreacion": "2025-11-29T18:00:00",
    "fechaActualizacion": "2025-11-29T18:00:00"
  }
}
```

---

### **2. Obtener Todos los Pedidos (ADMIN):**

**GET** `http://localhost:8080/v1/pedidos`

**Headers:**
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

---

### **3. Obtener Pedido por ID:**

**GET** `http://localhost:8080/v1/pedidos/1`

---

### **4. Actualizar Estado del Pedido:**

**PUT** `http://localhost:8080/v1/pedidos/1`

**Body:**
```json
{
  "estado": "EN_PROCESO"
}
```

---

### **5. Cancelar Pedido:**

**PATCH** `http://localhost:8080/v1/pedidos/1/cancelar`

Esto:
- ✅ Devuelve el stock a los productos
- ✅ Cambia el estado a CANCELADO

---

### **6. Obtener Pedidos por Usuario:**

**GET** `http://localhost:8080/v1/pedidos/usuario/1`

---

### **7. Obtener Pedidos por Estado:**

**GET** `http://localhost:8080/v1/pedidos/estado/PENDIENTE`

---

## 📊 Validaciones Implementadas

### **En Pedido:**
- ✅ `total`: No nulo, positivo o cero
- ✅ `estado`: No nulo
- ✅ `usuario`: No nulo
- ✅ `descuento`: Positivo o cero

### **En PedidoDetalle:**
- ✅ `cantidad`: No nulo, positivo
- ✅ `precioUnitario`: No nulo, positivo
- ✅ `subtotal`: No nulo, positivo
- ✅ `producto`: No nulo

### **Validaciones de Negocio en el Servicio:**
- ✅ Usuario debe existir
- ✅ Producto debe existir
- ✅ Stock debe ser suficiente
- ✅ Pedido debe tener al menos un detalle
- ✅ No se puede cancelar un pedido COMPLETADO
- ✅ No se puede cancelar un pedido ya CANCELADO

---

## 🔐 Seguridad

- ✅ **USER y ADMIN** pueden crear pedidos
- ✅ **USER y ADMIN** pueden ver sus pedidos
- ✅ **USER y ADMIN** pueden cancelar pedidos
- ✅ **Solo ADMIN** puede ver todos los pedidos
- ✅ **Solo ADMIN** puede actualizar pedidos
- ✅ **Solo ADMIN** puede filtrar por estado

---

## ✅ Características Adicionales

- ✅ **Transaccionalidad**: Operaciones atómicas con `@Transactional`
- ✅ **Gestión de Stock**: Actualización automática de inventario
- ✅ **Cálculos Automáticos**: Precio unitario, subtotal y total
- ✅ **Descuentos**: Soporte para aplicar descuentos
- ✅ **Auditoría**: Timestamps de creación y actualización
- ✅ **Referencias JSON**: Evita ciclos infinitos en serialización
- ✅ **Manejo de Errores**: Respuestas consistentes con ApiResponse

---

## 🎯 Resumen Final

✅ **Sin errores de compilación**  
✅ **Todas las validaciones implementadas en las entidades**  
✅ **Sin DTOs (usa directamente las entidades)**  
✅ **ApiResponse usado en todos los endpoints**  
✅ **Patrón consistente con ProductoController**  
✅ **Manejo completo de excepciones**  
✅ **Seguridad implementada con @PreAuthorize**  
✅ **Lógica de negocio robusta en el servicio**  

🚀 **LISTO PARA USAR**

