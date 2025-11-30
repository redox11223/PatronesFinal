package com.example.demo.pagos.pasarelas;

import com.example.demo.pagos.Pago;
import com.example.demo.pagos.serviciosExternos.PaypalService;
import org.springframework.stereotype.Service;

@Service
public class PasarelaPaypal implements PasarelaPago {

  private final PaypalService paypalService;

  public PasarelaPaypal() {
    this.paypalService = new PaypalService();
  }

  @Override
  public boolean procesarPago(Pago pago) {
    return paypalService.pay(pago.getMonto(), pago.getPedido().getUsuario().getEmail());
  }

  @Override
  public String getNombrePasarela() {
    return "PAYPAL";
  }
}


