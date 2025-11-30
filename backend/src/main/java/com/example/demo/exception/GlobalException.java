package com.example.demo.exception;

import com.example.demo.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex) {
    ApiResponse<String> response = ApiResponse.success(
            400,
            ex.getMessage(),
            null
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
          MethodArgumentNotValidException ex
  ) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    ApiResponse<Map<String, String>> response = ApiResponse.success(
            400,
            "Error de validación",
            errors
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
    ApiResponse<String> response = ApiResponse.success(
            500,
            "Error interno del servidor: " + ex.getMessage(),
            null
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<String>> handleGenericException(Exception ex) {
    ApiResponse<String> response = ApiResponse.success(
            500,
            "Error inesperado: " + ex.getMessage(),
            null
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}
