package com.tanstackplayground.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for bookmarking topics or managing bookmarks")
public class BookmarkRequest {

    @Schema(description = "Topic slug or UUID (e.g. devtools-inspection)", example = "devtools-inspection")
    private String topicId;

    @Schema(description = "Topic slug (e.g. devtools-inspection)", example = "devtools-inspection")
    private String topicSlug;

    @Schema(description = "Existing Bookmark UUID if referencing a bookmark directly", example = "b0000000-0000-0000-0000-000000000001")
    private UUID bookmarkId;
}
