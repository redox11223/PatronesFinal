package com.example.demo.pagos;

import com.example.demo.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/pagos")
@RequiredArgsConstructor
public class PagoController {

  private final PagoService pagoService;

  @PostMapping
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<ApiResponse<Pago>> procesarPago(@Valid @RequestBody Pago pago) {
    Pago nuevoPago = pagoService.procesarPago(pago);
    return ResponseEntity.status(201).body(
            ApiResponse.created("Pago procesado exitosamente", nuevoPago)
    );
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<ApiResponse<Pago>> obtenerPagoPorId(@PathVariable Long id) {
    Pago pago = pagoService.getPagoById(id);
    return ResponseEntity.ok(
            ApiResponse.ok("Pago obtenido exitosamente", pago)
    );
  }

  @GetMapping("/pedido/{pedidoId}")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<ApiResponse<Pago>> obtenerPagoPorPedido(@PathVariable Long pedidoId) {
    Pago pago = pagoService.getPagoByPedidoId(pedidoId);
    return ResponseEntity.ok(
            ApiResponse.ok("Pago del pedido obtenido", pago)
    );
  }

  @GetMapping
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<List<Pago>>> obtenerTodosPagos() {
    List<Pago> pagos = pagoService.getAllPagos();
    return ResponseEntity.ok(
            ApiResponse.ok("Pagos obtenidos", pagos)
    );
  }
}

