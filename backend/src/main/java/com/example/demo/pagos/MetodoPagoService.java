package com.example.demo.pagos;

import java.util.List;

public interface MetodoPagoService {
  MetodoPago saveMetodoPago(MetodoPago metodoPago);
  List<MetodoPago> getAllMetodosPago();
  MetodoPago cambiarEstado(Long id, boolean activo);
}


