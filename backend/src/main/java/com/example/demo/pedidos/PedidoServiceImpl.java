package com.example.demo.pedidos;

import com.example.demo.productos.Producto;
import com.example.demo.productos.ProductoRepo;
import com.example.demo.usuarios.Usuario;
import com.example.demo.usuarios.UsuarioRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

  private final PedidoRepo pedidoRepo;
  private final ProductoRepo productoRepo;
  private final UsuarioRepo usuarioRepo;

  @Override
  @Transactional
  public Pedido savePedido(Pedido pedido) {
    Usuario usuario = usuarioRepo.findById(pedido.getUsuario().getId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + pedido.getUsuario().getId()));

    pedido.setUsuario(usuario);
    pedido.setEstado(PedidoEstado.PENDIENTE);

    if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
      throw new IllegalArgumentException("El pedido debe tener al menos un detalle");
    }

    double totalCalculado = 0.0;

    for (PedidoDetalle detalle : pedido.getDetalles()) {
      Producto producto = productoRepo.findById(detalle.getProducto().getId())
              .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con id: " + detalle.getProducto().getId()));

      if (producto.getStock() < detalle.getCantidad()) {
        throw new IllegalArgumentException("Stock insuficiente para el producto: " + producto.getNombre());
      }

      detalle.setPrecioUnitario(producto.getPrecio());
      detalle.setSubtotal(producto.getPrecio() * detalle.getCantidad());
      detalle.setPedido(pedido);
      detalle.setProducto(producto);

      // Actualizando stock
      producto.setStock(producto.getStock() - detalle.getCantidad());
      productoRepo.save(producto);

      totalCalculado += detalle.getSubtotal();
    }

    // Aplica descuento si existe
    if (pedido.getDescuento() != null && pedido.getDescuento() > 0) {
      totalCalculado -= pedido.getDescuento();
    }

    pedido.setTotal(totalCalculado);

    return pedidoRepo.save(pedido);
  }

  @Override
  public List<Pedido> getAllPedidos() {
    return pedidoRepo.findAll();
  }

  @Override
  public Pedido getPedidoById(Long id) {
    return pedidoRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con id: " + id));
  }

  @Override
  @Transactional
  public Pedido updatePedido(Long id, Pedido pedido) {
    Pedido pedidoExistente = getPedidoById(id);

    // Solo permitir actualizar el estado y descuento
    if (pedido.getEstado() != null) {
      pedidoExistente.setEstado(pedido.getEstado());
    }

    if (pedido.getDescuento() != null) {
      pedidoExistente.setDescuento(pedido.getDescuento());

      // Recalcula total con descuento
      double nuevoTotal = 0.0;
      for (PedidoDetalle detalle : pedidoExistente.getDetalles()) {
        nuevoTotal += detalle.getSubtotal();
      }
      nuevoTotal -= pedido.getDescuento();
      pedidoExistente.setTotal(nuevoTotal);
    }

    return pedidoRepo.save(pedidoExistente);
  }

  @Override
  @Transactional
  public Pedido cancelarPedido(Long id) {
    Pedido pedido = getPedidoById(id);

    if (pedido.getEstado() == PedidoEstado.COMPLETADO) {
      throw new IllegalArgumentException("No se puede cancelar un pedido completado");
    }

    if (pedido.getEstado() == PedidoEstado.CANCELADO) {
      throw new IllegalArgumentException("El pedido ya está cancelado");
    }

    // Devuelve stock a los productos
    for (PedidoDetalle detalle : pedido.getDetalles()) {
      Producto producto = detalle.getProducto();
      producto.setStock(producto.getStock() + detalle.getCantidad());
      productoRepo.save(producto);
    }

    pedido.setEstado(PedidoEstado.CANCELADO);
    return pedidoRepo.save(pedido);
  }

  @Override
  public List<Pedido> getPedidosByUsuarioId(Long usuarioId) {
    return pedidoRepo.findByUsuarioId(usuarioId);
  }

  @Override
  public List<Pedido> getPedidosByEstado(PedidoEstado estado) {
    return pedidoRepo.findByEstado(estado);
  }
}
