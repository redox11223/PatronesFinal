package com.example.demo.pedidos;

import com.example.demo.clientes.Cliente;
import com.example.demo.pagos.Pago;
import com.example.demo.usuarios.Usuario;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter @Setter
@Entity
@AllArgsConstructor
public class Pedido {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull(message = "El total no puede ser nulo")
  @PositiveOrZero(message = "El total debe ser positivo o cero")
  private Double total;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @NotNull(message = "El estado no puede ser nulo")
  private PedidoEstado estado;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id", nullable = false)
  @NotNull(message = "El usuario no puede ser nulo")
  private Usuario usuario;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cliente_id", nullable = false)
  @NotNull(message = "El cliente no puede ser nulo")
  private Cliente cliente;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<PedidoDetalle> detalles = new ArrayList<>();

  @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
  private Pago pago;

  @CreationTimestamp
  @Column(name="fecha_creacion", updatable = false)
  private LocalDateTime fechaCreacion;

  @UpdateTimestamp
  @Column(name="fecha_actualizacion")
  private LocalDateTime fechaActualizacion;

  @PositiveOrZero(message = "El descuento debe ser positivo o cero")
  private Double descuento;



}
