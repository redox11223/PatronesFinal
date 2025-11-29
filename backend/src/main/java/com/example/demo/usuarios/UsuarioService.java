package com.example.demo.usuarios;

import java.util.List;

public interface UsuarioService {
  Usuario findById(Long id);
  List<Usuario> findAll();
  Usuario update(Long id, Usuario usuario);
}
