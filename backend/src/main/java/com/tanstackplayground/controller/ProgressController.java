package com.tanstackplayground.controller;

import com.tanstackplayground.dto.ProgressSummaryResponse;
import com.tanstackplayground.dto.UserProgressResponse;
import com.tanstackplayground.security.UserPrincipal;
import com.tanstackplayground.service.UserProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "Endpoints for tracking user topic progress and completion")
@SecurityRequirement(name = "bearerAuth")
@SecurityRequirement(name = "cookieAuth")
public class ProgressController {

    private final UserProgressService userProgressService;

    @PostMapping("/{topicId}/complete")
    @Operation(summary = "Mark topic as completed", description = "Marks a learning topic as completed for the authenticated user")
    public ResponseEntity<UserProgressResponse> markTopicCompleted(
            @PathVariable UUID topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.markTopicCompleted(principal.getId(), topicId));
    }

    @PostMapping("/{topicId}/visit")
    @Operation(summary = "Record topic visit", description = "Updates the last visited timestamp for the given topic")
    public ResponseEntity<UserProgressResponse> recordTopicVisit(
            @PathVariable UUID topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.recordTopicVisit(principal.getId(), topicId));
    }

    @GetMapping
    @Operation(summary = "Get user progress", description = "Returns all tracked topics and completion state for the authenticated user")
    public ResponseEntity<List<UserProgressResponse>> getUserProgress(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.getUserProgress(principal.getId()));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get learning progress summary", description = "Returns total count, completed count, and overall progress percentage")
    public ResponseEntity<ProgressSummaryResponse> getProgressSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userProgressService.getProgressSummary(principal.getId()));
    }
}

