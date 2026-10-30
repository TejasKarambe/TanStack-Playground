package com.tanstackplayground.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExampleFileResponse {
    private UUID id;
    private UUID exampleId;
    private String fileName;
    private String filePath;
    private String language;
    private String sourceCode;
    private Integer orderIndex;
}

