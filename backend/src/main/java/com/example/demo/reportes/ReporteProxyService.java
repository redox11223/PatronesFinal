package com.example.demo.reportes;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReporteProxyService implements ReporteService {

  private final RealReporteService realReporteService;

  @Override
  public String generateFinancialReport() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ADMIN"));

    if (!isAdmin) {
      throw new AccessDeniedException("Solo usuarios con rol ADMIN pueden acceder a reportes financieros");
    }

    return realReporteService.generateFinancialReport();
  }

  @Override
  public String generateSimpleReport() {
    return realReporteService.generateSimpleReport();
  }
}

