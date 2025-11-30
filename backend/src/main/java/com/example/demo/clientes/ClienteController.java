package com.example.demo.clientes;

import com.example.demo.productos.Producto;
import com.example.demo.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping( "/v1/clientes" )
@RequiredArgsConstructor
public class ClienteController {
   private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ApiResponse<Cliente>> saveCliente (@Valid @RequestBody Cliente cliente){
        Cliente newCliente = clienteService.saveCliente(cliente);
        ApiResponse<Cliente> response = ApiResponse.created(
                "Cliente creado exitosamente",
                newCliente
        );
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cliente>>> getAllClientes() {
        List<Cliente> clientes = clienteService.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Clientes obtenidos", clientes));


    }

}
