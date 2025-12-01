package com.example.demo.pagos.pasarelas;

import com.example.demo.pagos.Pago;
import com.example.demo.pagos.serviciosExternos.PlinService;
import org.springframework.stereotype.Service;

@Service
public class PasarelaPlin implements PasarelaPago {

  private final PlinService plinService;

  public PasarelaPlin() {
    this.plinService = new PlinService();
  }

  @Override
  public boolean procesarPago(Pago pago) {
    return plinService.pagando(pago.getMonto());
  }

  @Override
  public String getNombrePasarela() {
    return "PLIN";
  }
}


