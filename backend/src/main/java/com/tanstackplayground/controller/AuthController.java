package com.tanstackplayground.controller;

import com.tanstackplayground.dto.AuthResponse;
import com.tanstackplayground.dto.LoginRequest;
import com.tanstackplayground.dto.RegisterRequest;
import com.tanstackplayground.dto.UserResponse;
import com.tanstackplayground.security.UserPrincipal;
import com.tanstackplayground.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, login, logout, and session profile")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates account, generates JWT, and sets secure HttpOnly cookie")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request, response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates credentials, generates JWT, and sets secure HttpOnly cookie")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(request, response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Clears session and expires the HttpOnly authentication cookie")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user", description = "Returns user profile details for current session")
    @SecurityRequirement(name = "bearerAuth")
    @SecurityRequirement(name = "cookieAuth")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.getCurrentUser(principal.getId()));
    }
}

