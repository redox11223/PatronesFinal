package com.example.demo.pagos.serviciosExternos;

public class PlinService {

  public boolean pagando(Double monto) {
    return monto != null && monto > 0;
  }
}


