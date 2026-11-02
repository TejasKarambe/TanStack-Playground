package com.tanstackplayground.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Health Check", description = "Public health monitoring and keep-alive ping endpoint (no authentication required)")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    @GetMapping
    @Operation(
        summary = "Check server and database status",
        description = "Returns real-time status of backend API server and database connection. Ideal for UptimeRobot, Render keep-alive pings, and status monitors."
    )
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "TanStack Playground REST API");
        response.put("timestamp", Instant.now().toString());

        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            response.put("database", "CONNECTED");
        } catch (Exception e) {
            response.put("database", "DISCONNECTED");
            response.put("databaseError", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
