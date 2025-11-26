package com.example.demo.productos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Productos {
   @Id
   @GeneratedValue(strategy = GenerationType.SEQUENCE)
   private Long id;

   @Column(nullable = false)
   private String nombre;

   @Column(nullable = false)
   private Double precio;

   @Column(nullable = false)
   private Integer stock;

   @CreationTimestamp
   @Column(name="fecha_creacion", updatable = false)
   private LocalDateTime fechaCreacion;

   @UpdateTimestamp
   @Column(name="fecha_actualizacion")
   private LocalDateTime fechaActualizacion;

   private Integer categoria;

   @Enumerated(EnumType.STRING)
   @Column(name="estado_producto")
   private ProductoEstado estado;

   private Integer stockminimo;
   private String descripcion;


}
