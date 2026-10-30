package com.tanstackplayground.controller;

import com.tanstackplayground.dto.ExampleFileResponse;
import com.tanstackplayground.dto.ExampleResponse;
import com.tanstackplayground.service.ExampleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/examples")
@RequiredArgsConstructor
@Tag(name = "Examples", description = "Endpoints for sandbox code examples and files")
public class ExampleController {

    private final ExampleService exampleService;

    @GetMapping("/{id}")
    @Operation(summary = "Get full example by ID", description = "Returns code example with all virtual files and package dependencies")
    public ResponseEntity<ExampleResponse> getExampleById(@PathVariable UUID id) {
        return ResponseEntity.ok(exampleService.getExampleById(id));
    }

    @GetMapping("/{id}/files")
    @Operation(summary = "Get files for an example", description = "Returns individual file tree with source code")
    public ResponseEntity<List<ExampleFileResponse>> getExampleFiles(@PathVariable UUID id) {
        return ResponseEntity.ok(exampleService.getExampleFiles(id));
    }
}

