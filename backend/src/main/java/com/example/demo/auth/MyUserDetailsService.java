package com.example.demo.auth;

import com.example.demo.usuarios.Usuario;
import com.example.demo.usuarios.UsuarioRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

  private final UsuarioRepo usuarioRepo;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    Usuario usuario = usuarioRepo.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

    GrantedAuthority authority = new SimpleGrantedAuthority(usuario.getRol().getNombre());
    List<GrantedAuthority> authorities = Collections.singletonList(authority);

    return new User(
            usuario.getUsername(),
            usuario.getPassword(),
            usuario.isActivo(),
            true,
            true,
            true,
            authorities
    );
  }
}
