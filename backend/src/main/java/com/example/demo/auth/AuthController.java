package com.example.demo.auth;

import com.example.demo.shared.ApiResponse;
import com.example.demo.usuarios.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final AuthenticationManager authenticationManager;

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<AuthData>> login(@RequestBody LoginRequest loginRequest) {
    try {
      Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                      loginRequest.username(),
                       loginRequest.password()
              )
      );

      String rol = authentication.getAuthorities().stream()
              .findFirst()
              .map(GrantedAuthority::getAuthority)
              .orElse("");

      AuthData authData = new AuthData(authentication.getName(), rol);

      return ResponseEntity.ok(
              ApiResponse.ok("Login exitoso. Guarda tus credenciales para futuras peticiones.", authData)
      );

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(ApiResponse.success(401, "Credenciales inválidas", null));
    }
  }

  @PostMapping("/registro")
  public ResponseEntity<ApiResponse<AuthData>> registro(@RequestBody RegistroRequest registroRequest) {
    try {
      Usuario usuario = authService.registrarUsuario(
              registroRequest.username(),
              registroRequest.password(),
              registroRequest.email(),
              registroRequest.rol().getNombre()
      );

      AuthData authData = new AuthData(usuario.getUsername(), usuario.getRol().getNombre());

      return ResponseEntity.status(HttpStatus.CREATED)
              .body(ApiResponse.created("Usuario registrado. Usa HTTP Basic Auth para autenticarte", authData));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
              .body(ApiResponse.success(400, "Error: " + e.getMessage(), null));
    }
  }
}
