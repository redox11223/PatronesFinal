package com.example.demo.pagos;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetodoPagoServiceImpl implements MetodoPagoService {

  private final MetodoPagoRepo metodoPagoRepo;

  @Override
  public MetodoPago saveMetodoPago(MetodoPago metodoPago) {
    if (metodoPagoRepo.existsByNombre(metodoPago.getNombre())) {
      throw new IllegalArgumentException("Ya existe un método de pago con ese nombre");
    }
    return metodoPagoRepo.save(metodoPago);
  }

  @Override
  public List<MetodoPago> getAllMetodosPago() {
    return metodoPagoRepo.findAll();
  }

  @Override
  public MetodoPago cambiarEstado(Long id, boolean activo) {
    MetodoPago metodoPago = metodoPagoRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Método de pago no encontrado"));
    metodoPago.setActivo(activo);
    return metodoPagoRepo.save(metodoPago);
  }
}


