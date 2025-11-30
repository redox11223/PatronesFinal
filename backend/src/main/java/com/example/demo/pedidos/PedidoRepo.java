package com.example.demo.pedidos;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepo extends JpaRepository<Pedido,Long> {
  List<Pedido> findByUsuarioId(Long usuarioId);
  List<Pedido> findByEstado(PedidoEstado estado);
}
