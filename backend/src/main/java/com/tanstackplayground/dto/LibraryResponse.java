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
public class LibraryResponse {
    private UUID id;
    private String slug;
    private String name;
    private String description;
    private String packageName;
    private String icon;
    private String documentationUrl;
    private String status;
    private Integer topicCount;
    private Instant createdAt;
    private Instant updatedAt;
}

