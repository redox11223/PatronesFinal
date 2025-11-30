package com.example.demo.pagos;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagoRepo extends JpaRepository<Pago, Long> {
  Optional<Pago> findByPedidoId(Long pedidoId);
}


