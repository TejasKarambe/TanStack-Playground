package com.tanstackplayground.controller;

import com.tanstackplayground.dto.LibraryResponse;
import com.tanstackplayground.dto.TopicResponse;
import com.tanstackplayground.service.LibraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libraries")
@RequiredArgsConstructor
@Tag(name = "Libraries", description = "Endpoints for exploring TanStack libraries")
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    @Operation(summary = "List all TanStack libraries", description = "Returns all available libraries and topic counts")
    public ResponseEntity<List<LibraryResponse>> getAllLibraries() {
        return ResponseEntity.ok(libraryService.getAllLibraries());
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get library details by slug", description = "Returns metadata and status for a library")
    public ResponseEntity<LibraryResponse> getLibraryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(libraryService.getLibraryBySlug(slug));
    }

    @GetMapping("/{slug}/topics")
    @Operation(summary = "Get topics for a library", description = "Returns ordered topics/lessons belonging to a library")
    public ResponseEntity<List<TopicResponse>> getTopicsByLibrarySlug(@PathVariable String slug) {
        return ResponseEntity.ok(libraryService.getTopicsByLibrarySlug(slug));
    }
}

