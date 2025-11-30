package com.example.demo.pagos;

import com.example.demo.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/metodos-pago")
@RequiredArgsConstructor
public class MetodoPagoController {

  private final MetodoPagoService metodoPagoService;

  @PostMapping
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<MetodoPago>> crearMetodoPago(@Valid @RequestBody MetodoPago metodoPago) {
    MetodoPago nuevoMetodoPago = metodoPagoService.saveMetodoPago(metodoPago);
    return ResponseEntity.status(201).body(
            ApiResponse.created("Método de pago creado", nuevoMetodoPago)
    );
  }

  @GetMapping
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<ApiResponse<List<MetodoPago>>> obtenerTodosMetodosPago() {
    List<MetodoPago> metodosPago = metodoPagoService.getAllMetodosPago();
    return ResponseEntity.ok(
            ApiResponse.ok("Métodos de pago obtenidos", metodosPago)
    );
  }

  @PatchMapping("/{id}/estado")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<MetodoPago>> cambiarEstado(
          @PathVariable Long id,
          @RequestParam boolean activo
  ) {
    MetodoPago metodoPago = metodoPagoService.cambiarEstado(id, activo);
    return ResponseEntity.ok(
            ApiResponse.ok("Estado actualizado", metodoPago)
    );
  }
}


