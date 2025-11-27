package com.example.demo.productos;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService{
    private final ProductoRepo productoRepo;

    @Override
    public Producto save(Producto producto) {
        if( productoRepo.existsByNombre(producto.getNombre())){
            throw new IllegalArgumentException("El producto ya existe");
        }
        return productoRepo.save(producto);
    }

    @Override
    public Producto findById(Long id) {
        return productoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + id));
    }

    @Override
    public List<Producto> findAll() {
        return productoRepo.findAll();
    }

    @Override
    public Producto update(Long id, Producto producto) {
       Producto productoExistente = findById(id);

       productoExistente.setNombre(producto.getNombre());
       productoExistente.setDescripcion(producto.getDescripcion());
       productoExistente.setPrecio(producto.getPrecio());
       productoExistente.setStock(producto.getStock());
       productoExistente.setCategoria(producto.getCategoria());
       productoExistente.setEstado(producto.getEstado());
       productoExistente.setStockminimo(producto.getStockminimo());
       return productoRepo.save(productoExistente);

    }

    @Override
    public Producto changeState(Long id, String estado) {
        Producto productoExistente = findById(id);
        productoExistente.setEstado(ProductoEstado.valueOf(estado));

        return productoRepo.save(productoExistente);
    }


    @Override
    public Page<Producto> findAllWithFilters(
            ProductoCategorias categoria,
            Double precioMin,
            Double precioMax,
            Pageable pageable
    ) {

        if (categoria != null && precioMin != null && precioMax != null) {
            return productoRepo.findByCategoriaAndPrecioBetween(categoria, precioMin, precioMax, pageable);
        }
        if (categoria != null) {
            return productoRepo.findByCategoria(categoria, pageable);
        }
        if (precioMin != null && precioMax != null) {
            return productoRepo.findByPrecioBetween(precioMin, precioMax, pageable);
        }
        return productoRepo.findAll(pageable);
    }
    }
