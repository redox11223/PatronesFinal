package com.example.demo.auth;

import com.example.demo.usuarios.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
    @NotBlank String username,
    @NotBlank @Size(min = 4) String password,
    @Email @NotBlank String email,
    @NotNull Rol rol
) {
}
