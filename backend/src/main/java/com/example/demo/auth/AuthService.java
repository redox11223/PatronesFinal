package com.example.demo.auth;

import com.example.demo.usuarios.Rol;
import com.example.demo.usuarios.Usuario;
import com.example.demo.usuarios.UsuarioRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UsuarioRepo usuarioRepository;
  private final PasswordEncoder passwordEncoder;

  public Usuario registrarUsuario(String username, String password, String email, String nombreRol) {
    if (usuarioRepository.existsByUsername(username)) {
      throw new RuntimeException("El usuario ya existe");
    }

    Rol rol = new Rol();
    rol.setNombre(nombreRol);

    Usuario usuario = new Usuario();
    usuario.setUsername(username);
    usuario.setPassword(passwordEncoder.encode(password));
    usuario.setEmail(email);
    usuario.setRol(rol);
    usuario.setActivo(true);

    return usuarioRepository.save(usuario);
  }
}