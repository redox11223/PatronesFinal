package com.example.demo.productos;


import com.example.demo.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping( "/v1/productos" )
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService productoService;

    @PostMapping
    public ResponseEntity<ApiResponse<Producto>> saveProducto(@Valid @RequestBody Producto producto){
        Producto newProducto = productoService.save(producto);
        ApiResponse<Producto> response = ApiResponse.created(
                "Producto creado exitosamente",
                newProducto
        );
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Producto>>> getAllProductos(
            @RequestParam(required = false) ProductoCategorias categoria,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Producto> productos = productoService.findAllWithFilters(
                categoria,
                precioMin,
                precioMax,
                pageable
        );

        return ResponseEntity.ok(ApiResponse.ok("Productos obtenidos", productos));
    }


    @GetMapping( "/{id}" )
    public ResponseEntity<ApiResponse<Producto>> getProducto(@PathVariable Long id) {
        Producto Producto = productoService.findById(id);
        ApiResponse<Producto> response = ApiResponse.ok(
                "Producto obtenido exitosamente",
                Producto
        );
        return ResponseEntity.ok(response);
    }


     @PutMapping( "/{id}" )
    public ResponseEntity<ApiResponse<Producto>> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
         Producto newProducto = productoService.update(id, producto);
         ApiResponse<Producto> response = ApiResponse.ok(
                 "Producto actualizado exitosamente",
                 newProducto
         );
         return ResponseEntity.ok(response);
     }


}
