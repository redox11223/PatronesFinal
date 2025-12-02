package com.example.demo.pedidos;

import com.example.demo.productos.Producto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter @Setter
@Entity
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PedidoDetalle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull(message = "La cantidad no puede ser nula")
  @Positive(message = "La cantidad debe ser mayor a cero")
  private Integer cantidad;

  @NotNull(message = "El precio unitario no puede ser nulo")
  @Positive(message = "El precio unitario debe ser mayor a cero")
  private Double precioUnitario;

  @NotNull(message = "El subtotal no puede ser nulo")
  @Positive(message = "El subtotal debe ser mayor a cero")
  private Double subtotal;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pedido_id", nullable = false)
  @JsonBackReference
  private Pedido pedido;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "producto_id", nullable = false)
  @NotNull(message = "El producto no puede ser nulo")
  private Producto producto;

}
