package com.tanstackplayground.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExampleResponse {
    private UUID id;
    private UUID topicId;
    private String title;
    private String description;
    private String difficulty;
    private String defaultFile;
    private String dependenciesJson;
    private Boolean isActive;
    @Builder.Default
    private List<ExampleFileResponse> files = new ArrayList<>();
}

