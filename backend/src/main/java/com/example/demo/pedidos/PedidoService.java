package com.example.demo.pedidos;


import java.util.List;

public interface PedidoService {
  Pedido savePedido(Pedido pedido);
  List<Pedido> getAllPedidos();
  Pedido getPedidoById(Long id);
  Pedido updatePedido(Long id, Pedido pedido);
  Pedido cancelarPedido(Long id);
  List<Pedido> getPedidosByUsuarioId(Long usuarioId);
  List<Pedido> getPedidosByEstado(PedidoEstado estado);
}
