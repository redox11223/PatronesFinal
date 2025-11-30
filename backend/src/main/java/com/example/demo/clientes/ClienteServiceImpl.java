package com.example.demo.clientes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService{
    private final ClienteRepo clienteRepo;

    @Override
    public Cliente saveCliente(Cliente cliente) {
        if( clienteRepo.existsByNombre(cliente.getNombre())){
            throw new IllegalArgumentException("El cliente ya existe");
        }
        return clienteRepo.save(cliente);
    }

    @Override
    public Cliente getClienteById(Long id) {
        return clienteRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con id: " + id));
    }

    @Override
    public Cliente updateCliente(Long id, Cliente cliente) {
         Cliente clienteExistente = getClienteById(id);
         clienteExistente.setNombre(cliente.getNombre());
         return clienteRepo.save(clienteExistente);
    }

    @Override
    public List<Cliente> findAll() {
        return clienteRepo.findAll();
    }


}
