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
public class TopicContentResponse {
    private UUID id;
    private UUID topicId;
    private String topicSlug;
    private String introduction;
    private String learningObjectives;
    private String explanation;
    private String keyConcepts;
    private String exampleNotes;
}

