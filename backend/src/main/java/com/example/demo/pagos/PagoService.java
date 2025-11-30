package com.example.demo.pagos;

import java.util.List;

public interface PagoService {
  Pago procesarPago(Pago pago);
  Pago getPagoById(Long id);
  Pago getPagoByPedidoId(Long pedidoId);
  List<Pago> getAllPagos();
}


