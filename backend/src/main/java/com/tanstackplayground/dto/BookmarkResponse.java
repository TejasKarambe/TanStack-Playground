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
public class BookmarkResponse {
    private UUID id;
    private UUID topicId;
    private String topicSlug;
    private String topicTitle;
    private String librarySlug;
    private Instant createdAt;
}

