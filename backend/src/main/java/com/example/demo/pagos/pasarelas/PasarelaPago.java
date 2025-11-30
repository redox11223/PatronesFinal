package com.example.demo.pagos.pasarelas;

public interface PasarelaPago {
  boolean procesarPago(com.example.demo.pagos.Pago pago);
  String getNombrePasarela();
}

