package com.tanstackplayground.controller;

import com.tanstackplayground.dto.ExampleResponse;
import com.tanstackplayground.dto.TopicContentResponse;
import com.tanstackplayground.dto.TopicResponse;
import com.tanstackplayground.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Tag(name = "Topics", description = "Endpoints for topics, concepts, and educational lessons")
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/{slug}")
    @Operation(summary = "Get topic metadata by slug", description = "Returns metadata, difficulty, and estimated time for a topic")
    public ResponseEntity<TopicResponse> getTopicBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getTopicBySlug(slug));
    }

    @GetMapping("/{slug}/content")
    @Operation(summary = "Get topic content", description = "Returns introduction, learning objectives, explanation, and key concepts")
    public ResponseEntity<TopicContentResponse> getTopicContent(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getTopicContent(slug));
    }

    @GetMapping("/{slug}/examples")
    @Operation(summary = "Get executable examples for topic", description = "Returns all code sandbox examples associated with a topic")
    public ResponseEntity<List<ExampleResponse>> getExamplesByTopicSlug(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getExamplesByTopicSlug(slug));
    }
}

