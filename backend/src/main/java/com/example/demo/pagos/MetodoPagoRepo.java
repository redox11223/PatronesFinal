package com.example.demo.pagos;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MetodoPagoRepo extends JpaRepository<MetodoPago, Long> {
  Optional<MetodoPago> findByNombre(String nombre);
  boolean existsByNombre(String nombre);
}


