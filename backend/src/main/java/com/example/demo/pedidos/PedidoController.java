package com.example.demo.pedidos;

import com.example.demo.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/pedidos")
@RequiredArgsConstructor
public class PedidoController {

  private final PedidoService pedidoService;

  @PostMapping
  public ResponseEntity<ApiResponse<Pedido>> savePedido(@Valid @RequestBody Pedido pedido) {
    Pedido nuevoPedido = pedidoService.savePedido(pedido);
    ApiResponse<Pedido> response = ApiResponse.created(
            "Pedido creado exitosamente",
            nuevoPedido
    );
    return ResponseEntity.status(201).body(response);
  }

  @GetMapping
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<List<Pedido>>> getAllPedidos() {
    List<Pedido> pedidos = pedidoService.getAllPedidos();
    ApiResponse<List<Pedido>> response = ApiResponse.ok(
            "Pedidos obtenidos exitosamente",
            pedidos
    );
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<Pedido>> getPedido(@PathVariable Long id) {
    Pedido pedido = pedidoService.getPedidoById(id);
    ApiResponse<Pedido> response = ApiResponse.ok(
            "Pedido obtenido exitosamente",
            pedido
    );
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<Pedido>> updatePedido(
          @PathVariable Long id,
          @Valid @RequestBody Pedido pedido
  ) {
    Pedido pedidoActualizado = pedidoService.updatePedido(id, pedido);
    ApiResponse<Pedido> response = ApiResponse.ok(
            "Pedido actualizado exitosamente",
            pedidoActualizado
    );
    return ResponseEntity.ok(response);
  }

  @PatchMapping("/{id}/cancelar")
  public ResponseEntity<ApiResponse<Pedido>> cancelPedido(@PathVariable Long id) {
    Pedido pedidoCancelado = pedidoService.cancelarPedido(id);
    ApiResponse<Pedido> response = ApiResponse.ok(
            "Pedido cancelado exitosamente",
            pedidoCancelado
    );
    return ResponseEntity.ok(response);
  }

  @GetMapping("/usuario/{usuarioId}")
  public ResponseEntity<ApiResponse<List<Pedido>>> getPedidosByUsuario(
          @PathVariable Long usuarioId
  ) {
    List<Pedido> pedidos = pedidoService.getPedidosByUsuarioId(usuarioId);
    ApiResponse<List<Pedido>> response = ApiResponse.ok(
            "Pedidos del usuario obtenidos exitosamente",
            pedidos
    );
    return ResponseEntity.ok(response);
  }

  @GetMapping("/estado/{estado}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<List<Pedido>>> getPedidosByEstado(
          @PathVariable PedidoEstado estado
  ) {
    List<Pedido> pedidos = pedidoService.getPedidosByEstado(estado);
    ApiResponse<List<Pedido>> response = ApiResponse.ok(
            "Pedidos filtrados por estado obtenidos exitosamente",
            pedidos
    );
    return ResponseEntity.ok(response);
  }
}

