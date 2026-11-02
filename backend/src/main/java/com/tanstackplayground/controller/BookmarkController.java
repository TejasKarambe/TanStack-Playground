package com.tanstackplayground.controller;

import com.tanstackplayground.dto.BookmarkRequest;
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

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@Tag(name = "Bookmarks", description = "Endpoints for bookmarking topics for later reference")
@SecurityRequirement(name = "bearerAuth")
@SecurityRequirement(name = "cookieAuth")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{identifier}")
    @Operation(summary = "Bookmark a topic or identifier", description = "Saves a bookmark for authenticated user by bookmark ID, topic UUID, or slug (e.g. devtools-inspection)")
    public ResponseEntity<BookmarkResponse> addBookmark(
            @PathVariable String identifier,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmarkService.addBookmark(principal.getId(), identifier));
    }

    @PostMapping
    @Operation(summary = "Bookmark a topic via body", description = "Saves a topic bookmark from request body (topicId, topicSlug, or bookmarkId)")
    public ResponseEntity<BookmarkResponse> addBookmarkByBody(
            @RequestBody(required = false) BookmarkRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String identifier = null;
        if (request != null) {
            if (request.getTopicId() != null && !request.getTopicId().isBlank()) {
                identifier = request.getTopicId();
            } else if (request.getTopicSlug() != null && !request.getTopicSlug().isBlank()) {
                identifier = request.getTopicSlug();
            } else if (request.getBookmarkId() != null) {
                identifier = request.getBookmarkId().toString();
            }
        }
        if (identifier == null) {
            throw new IllegalArgumentException("topicId, topicSlug, or bookmarkId must be provided in request body");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmarkService.addBookmark(principal.getId(), identifier));
    }

    @DeleteMapping("/{identifier}")
    @Operation(summary = "Remove a bookmark", description = "Deletes a topic bookmark for authenticated user by Bookmark ID, topic UUID, or slug")
    public ResponseEntity<Void> removeBookmark(
            @PathVariable String identifier,
            @AuthenticationPrincipal UserPrincipal principal) {
        bookmarkService.removeBookmark(principal.getId(), identifier);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get user bookmarks", description = "Returns all bookmarked topics for the authenticated user")
    public ResponseEntity<List<BookmarkResponse>> getUserBookmarks(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(principal.getId()));
    }
}
