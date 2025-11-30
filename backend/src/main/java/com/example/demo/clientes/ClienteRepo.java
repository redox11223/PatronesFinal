package com.example.demo.clientes;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepo extends JpaRepository<Cliente,Long> {
    boolean existsByNombre(String nombre);
}
