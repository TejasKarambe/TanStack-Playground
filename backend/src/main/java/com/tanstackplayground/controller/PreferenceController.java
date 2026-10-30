package com.tanstackplayground.controller;

import com.tanstackplayground.dto.PreferenceResponse;
import com.tanstackplayground.dto.PreferenceUpdateRequest;
import com.tanstackplayground.security.UserPrincipal;
import com.tanstackplayground.service.PreferenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
@Tag(name = "Preferences", description = "Endpoints for managing user workspace preferences")
@SecurityRequirement(name = "bearerAuth")
@SecurityRequirement(name = "cookieAuth")
public class PreferenceController {

    private final PreferenceService preferenceService;

    @GetMapping
    @Operation(summary = "Get user preferences", description = "Returns editor and UI preferences for the authenticated user")
    public ResponseEntity<PreferenceResponse> getUserPreference(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(preferenceService.getUserPreference(principal.getId()));
    }

    @PutMapping
    @Operation(summary = "Update user preferences", description = "Updates theme, font size, word wrap, and layout")
    public ResponseEntity<PreferenceResponse> updateUserPreference(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PreferenceUpdateRequest request) {
        return ResponseEntity.ok(preferenceService.updateUserPreference(principal.getId(), request));
    }
}

