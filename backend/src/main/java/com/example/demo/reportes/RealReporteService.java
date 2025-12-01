package com.example.demo.reportes;

import com.example.demo.pedidos.PedidoRepo;
import com.example.demo.pagos.PagoRepo;
import com.example.demo.productos.ProductoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service("realReporteService")
@RequiredArgsConstructor
public class RealReporteService implements ReporteService {

  private final PedidoRepo pedidoRepo;
  private final PagoRepo pagoRepo;
  private final ProductoRepo productoRepo;

  @Override
  public String generateFinancialReport() {
    long totalPedidos = pedidoRepo.count();
    long totalPagos = pagoRepo.count();
    long totalProductos = productoRepo.count();

    double totalIngresos = pagoRepo.findAll().stream()
            .filter(pago -> pago.isExitoso())
            .mapToDouble(pago -> pago.getMonto())
            .sum();

    return String.format(
            """
                    === REPORTE FINANCIERO ===
                    Total de Pedidos: %d
                    Total de Pagos Exitosos: %d
                    Total de Productos: %d
                    Ingresos Totales: $%.2f
                    """,
            totalPedidos, totalPagos, totalProductos, totalIngresos
    );
  }

  @Override
  public String generateSimpleReport() {
    long totalPedidos = pedidoRepo.count();
    long totalProductos = productoRepo.count();

    return String.format(
            """
                    === REPORTE BASICO===
                    Total de Pedidos: %d
                    Total de Productos: %d
                    """,
            totalPedidos, totalProductos
    );
  }
}

