package com.example.demo.pagos.serviciosExternos;

public class YapeService {

  public boolean pago(Double monto, Long pedidoId) {
    return monto != null && monto > 0;
  }
}



