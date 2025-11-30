package com.example.demo.pagos.pasarelas;

import com.example.demo.pagos.Pago;
import com.example.demo.pagos.serviciosExternos.YapeService;
import org.springframework.stereotype.Service;

@Service
public class PasarelaYape implements PasarelaPago {

  private final YapeService yapeService;

  public PasarelaYape() {
    this.yapeService = new YapeService();
  }

  @Override
  public boolean procesarPago(Pago pago) {
    return yapeService.pago(pago.getMonto(), pago.getPedido().getId());
  }

  @Override
  public String getNombrePasarela() {
    return "YAPE";
  }
}



