package com.example.demo.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest1(
    @NotBlank String username,
    @NotBlank @Size(min = 4) String password
) {
}