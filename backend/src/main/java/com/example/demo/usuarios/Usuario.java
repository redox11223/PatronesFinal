package com.example.demo.usuarios;

import com.example.demo.pedidos.Pedido;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  @JsonIgnore
  private String password;

  @Column(nullable = false, unique = true)
  private String email;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "rol_id", nullable = false)
  private Rol rol;

  @OneToMany(mappedBy = "usuario",cascade = CascadeType.ALL)
  @JsonIgnore
  private List<Pedido> pedidos = new ArrayList<>();

  @CreationTimestamp
  @Column(name="fecha_creacion", updatable = false)
  private LocalDateTime fechaCreacion;

  @Column(nullable = false)
  private boolean activo = true;
}
