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
public class PreferenceResponse {
    private UUID id;
    private String theme;
    private Integer editorFontSize;
    private Boolean editorWordWrap;
    private String previewLayout;
    private Instant updatedAt;
}

