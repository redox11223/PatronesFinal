package com.example.demo.productos;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductoRepo extends JpaRepository<Producto,Long> {

    boolean existsByNombre(String nombre);

    Page<Producto> findByCategoria(ProductoCategorias categoria, Pageable pageable);

    Page<Producto> findByPrecioBetween(Double precioMin, Double precioMax, Pageable pageable);

    Page<Producto> findByCategoriaAndPrecioBetween(
            ProductoCategorias categoria,
            Double precioMin,
            Double precioMax,
            Pageable pageable
    );

}

