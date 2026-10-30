package com.tanstackplayground.controller;

import com.tanstackplayground.dto.BookmarkResponse;
import com.tanstackplayground.security.UserPrincipal;
import com.tanstackplayground.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@Tag(name = "Bookmarks", description = "Endpoints for bookmarking topics for later reference")
@SecurityRequirement(name = "bearerAuth")
@SecurityRequirement(name = "cookieAuth")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{topicId}")
    @Operation(summary = "Bookmark a topic", description = "Saves a topic bookmark for the authenticated user")
    public ResponseEntity<BookmarkResponse> addBookmark(
            @PathVariable UUID topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmarkService.addBookmark(principal.getId(), topicId));
    }

    @DeleteMapping("/{topicId}")
    @Operation(summary = "Remove a bookmark", description = "Deletes a topic bookmark for the authenticated user")
    public ResponseEntity<Void> removeBookmark(
            @PathVariable UUID topicId,
            @AuthenticationPrincipal UserPrincipal principal) {
        bookmarkService.removeBookmark(principal.getId(), topicId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get user bookmarks", description = "Returns all bookmarked topics for the authenticated user")
    public ResponseEntity<List<BookmarkResponse>> getUserBookmarks(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(principal.getId()));
    }
}

