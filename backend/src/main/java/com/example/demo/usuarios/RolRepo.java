package com.example.demo.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepo extends JpaRepository<Rol, Long> {
    java.util.Optional<Rol> findByNombre(String nombre);
}
