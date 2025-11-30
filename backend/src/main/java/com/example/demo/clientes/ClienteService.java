package com.example.demo.clientes;

import com.example.demo.productos.Producto;

import java.util.List;

public interface ClienteService {
    Cliente saveCliente(Cliente cliente);
    Cliente getClienteById(Long id);
    Cliente updateCliente(Long id, Cliente cliente);
    List<Cliente> findAll();

}
