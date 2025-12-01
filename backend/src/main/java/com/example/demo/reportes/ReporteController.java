package com.example.demo.reportes;

import com.example.demo.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/reportes")
@RequiredArgsConstructor
public class ReporteController {

  private final ReporteProxyService reporteProxyService;

  @GetMapping("/financiero")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<ApiResponse<String>> getFinancialReport() {
    String reporte = reporteProxyService.generateFinancialReport();
    return ResponseEntity.ok(
            ApiResponse.ok("Reporte financiero generado exitosamente", reporte)
    );
  }

  @GetMapping("/simple")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<ApiResponse<String>> getSimpleReport() {
    String reporte = reporteProxyService.generateSimpleReport();
    return ResponseEntity.ok(
            ApiResponse.ok("Reporte simple generado exitosamente", reporte)
    );
  }
}

