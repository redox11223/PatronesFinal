package com.example.demo.pagos;

import com.example.demo.pagos.pasarelas.PasarelaPago;
import com.example.demo.pedidos.Pedido;
import com.example.demo.pedidos.PedidoEstado;
import com.example.demo.pedidos.PedidoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {

  private final PagoRepo pagoRepo;
  private final PedidoRepo pedidoRepo;
  private final MetodoPagoRepo metodoPagoRepo;
  private final List<PasarelaPago> pasarelas;

  private PasarelaPago obtenerPasarela(String nombreMetodoPago) {
    String nombreBuscado = nombreMetodoPago.toUpperCase().trim();

    for (PasarelaPago pasarela : pasarelas) {
      if (pasarela.getNombrePasarela().equalsIgnoreCase(nombreBuscado)) {
        return pasarela;
      }
    }

    throw new IllegalArgumentException("Método de pago no soportado: " + nombreMetodoPago);
  }

  @Override
  @Transactional
  public Pago procesarPago(Pago pago) {
    Pedido pedido = validarPedido(pago.getPedido().getId());
    MetodoPago metodoPago = validarMetodoPago(pago.getMetodoPago().getId());
    validarMonto(pago.getMonto(), pedido.getTotal());

    pago.setPedido(pedido);
    pago.setMetodoPago(metodoPago);

    PasarelaPago pasarela = obtenerPasarela(metodoPago.getNombre());
    boolean pagoExitoso = pasarela.procesarPago(pago);
    pago.setExitoso(pagoExitoso);

    if (pagoExitoso) {
      pedido.setEstado(PedidoEstado.COMPLETADO);
      pedidoRepo.save(pedido);
    }

    return pagoRepo.save(pago);
  }

  private Pedido validarPedido(Long pedidoId) {
    Pedido pedido = pedidoRepo.findById(pedidoId)
            .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));

    if (pedido.getEstado() == PedidoEstado.CANCELADO) {
      throw new IllegalArgumentException("No se puede procesar pago para un pedido cancelado");
    }

    pagoRepo.findByPedidoId(pedido.getId()).ifPresent(pagoExistente -> {
      if (pagoExistente.isExitoso()) {
        throw new IllegalArgumentException("El pedido ya tiene un pago exitoso");
      }
    });

    return pedido;
  }

  private MetodoPago validarMetodoPago(Long metodoPagoId) {
    MetodoPago metodoPago = metodoPagoRepo.findById(metodoPagoId)
            .orElseThrow(() -> new IllegalArgumentException("Método de pago no encontrado"));

    if (!metodoPago.isActivo()) {
      throw new IllegalArgumentException("El método de pago no está activo");
    }

    return metodoPago;
  }

  private void validarMonto(Double monto, Double totalPedido) {
    if (!monto.equals(totalPedido)) {
      throw new IllegalArgumentException("El monto del pago no coincide con el total del pedido");
    }
  }

  @Override
  public Pago getPagoById(Long id) {
    return pagoRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Pago no encontrado"));
  }

  @Override
  public List<Pago> getAllPagos() {
    return pagoRepo.findAll();
  }

  @Override
  public Pago getPagoByPedidoId(Long pedidoId) {
    return pagoRepo.findByPedidoId(pedidoId)
            .orElseThrow(() -> new IllegalArgumentException("No se encontró pago para el pedido"));
  }
}

