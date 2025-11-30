package com.example.demo.pagos;

import com.example.demo.pedidos.Pedido;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull(message = "El monto no puede ser nulo")
  @PositiveOrZero(message = "El monto debe ser positivo o cero")
  private Double monto;

  private boolean exitoso;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "metodo_pago_id")
  @NotNull(message = "El método de pago no puede ser nulo")
  private MetodoPago metodoPago;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pedido_id", nullable = false)
  @NotNull(message = "El pedido no puede ser nulo")
  private Pedido pedido;

  @CreationTimestamp
  @Column(name="fecha_creacion", updatable = false)
  private LocalDateTime fechaCreacion;
}
