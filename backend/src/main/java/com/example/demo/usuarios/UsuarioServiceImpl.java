package com.example.demo.usuarios;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService{

  private final UsuarioRepo usuarioRepo;


  @Override
  public Usuario findById(Long id) {
    return usuarioRepo.findById(id).orElseThrow(()-> new RuntimeException("Usuario no encontrado con id: " + id));
  }

  @Override
  public List<Usuario> findAll() {
    return usuarioRepo.findAll();
  }

  @Override
  public Usuario update(Long id, Usuario usuario) {
     Usuario usuario1=findById(id);
      usuario1.setUsername(usuario.getUsername());
      usuario1.setPassword(usuario.getPassword());
      usuario1.setActivo(usuario.isActivo());
      usuario1.setRol(usuario.getRol());

    return null;
  }
}
