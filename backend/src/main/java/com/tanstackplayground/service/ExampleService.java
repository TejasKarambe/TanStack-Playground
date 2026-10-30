package com.tanstackplayground.service;

import com.tanstackplayground.dto.ExampleFileResponse;
import com.tanstackplayground.dto.ExampleResponse;
import com.tanstackplayground.entity.Example;
import com.tanstackplayground.entity.ExampleFile;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.ExampleFileRepository;
import com.tanstackplayground.repository.ExampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExampleService {

    private final ExampleRepository exampleRepository;
    private final ExampleFileRepository exampleFileRepository;
    private final EntityDtoMapper mapper;

    public ExampleResponse getExampleById(UUID id) {
        Example example = exampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Example not found with id: " + id));
        return mapper.toExampleResponse(example);
    }

    public List<ExampleFileResponse> getExampleFiles(UUID exampleId) {
        if (!exampleRepository.existsById(exampleId)) {
            throw new ResourceNotFoundException("Example not found with id: " + exampleId);
        }
        List<ExampleFile> files = exampleFileRepository.findByExampleIdOrderByOrderIndexAsc(exampleId);
        return files.stream()
                .map(mapper::toExampleFileResponse)
                .collect(Collectors.toList());
    }
}

