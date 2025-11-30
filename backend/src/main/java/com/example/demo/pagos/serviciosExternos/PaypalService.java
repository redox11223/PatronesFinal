package com.example.demo.pagos.serviciosExternos;

public class PaypalService {

  public boolean pay(Double monto, String email) {
    return monto != null && monto > 0 && email != null && !email.isEmpty();
  }
}


