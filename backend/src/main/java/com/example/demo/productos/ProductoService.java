package com.example.demo.productos;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductoService {
    Producto save (Producto producto);
    Producto findById (Long id);
    List<Producto> findAll();
    Producto update (Long id, Producto producto);
    Producto changeState (Long id, String estado);

    Page<Producto> findAllWithFilters(
            ProductoCategorias categoria,
            Double precioMin,
            Double precioMax,
            Pageable pageable
    );
}
