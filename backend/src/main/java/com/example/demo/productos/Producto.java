package com.example.demo.productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Producto {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false)
   @NotBlank( message = "El nombre no puede estar vacio" )
   private String nombre;

   @Column(nullable = false)
   @NotNull( message = "El precio no puede ser nulo" )
   private Double precio;

   @Column(nullable = false)
   @NotNull( message = "El stock no puede ser nulo" )
   private Integer stock;

   @CreationTimestamp
   @Column(name="fecha_creacion", updatable = false)
   private LocalDateTime fechaCreacion;

   @UpdateTimestamp
   @Column(name="fecha_actualizacion")
   private LocalDateTime fechaActualizacion;

   @Enumerated(EnumType.STRING)
   @Column(name="categoria_producto", nullable = false)
   @NotNull( message = "La categoria no puede estar vacia" )
   private ProductoCategorias categoria;

   @Enumerated(EnumType.STRING)
   @Column(name="estado_producto")
   private ProductoEstado estado=ProductoEstado.DISPONIBLE;

   private Integer stockminimo;

   private String descripcion;


}
