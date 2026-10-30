package com.tanstackplayground.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponse {
    private UUID id;
    private UUID libraryId;
    private String librarySlug;
    private String slug;
    private String title;
    private String description;
    private String difficulty;
    private Integer estimatedMinutes;
    private Integer orderIndex;
    private String documentationUrl;
    private Boolean isCompleted;
    private Boolean isBookmarked;
    private Instant createdAt;
    private Instant updatedAt;
}

