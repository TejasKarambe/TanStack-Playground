package com.tanstackplayground.service;

import com.tanstackplayground.dto.LibraryResponse;
import com.tanstackplayground.dto.TopicResponse;
import com.tanstackplayground.entity.Library;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.LibraryRepository;
import com.tanstackplayground.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final TopicRepository topicRepository;
    private final EntityDtoMapper mapper;

    public List<LibraryResponse> getAllLibraries() {
        return libraryRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(lib -> {
                    List<Topic> topics = topicRepository.findByLibraryIdOrderByOrderIndexAsc(lib.getId());
                    return mapper.toLibraryResponse(lib, topics.size());
                })
                .collect(Collectors.toList());
    }

    public LibraryResponse getLibraryBySlug(String slug) {
        Library library = libraryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Library not found with slug: " + slug));
        List<Topic> topics = topicRepository.findByLibraryIdOrderByOrderIndexAsc(library.getId());
        return mapper.toLibraryResponse(library, topics.size());
    }

    public List<TopicResponse> getTopicsByLibrarySlug(String slug) {
        if (!libraryRepository.existsBySlug(slug)) {
            throw new ResourceNotFoundException("Library not found with slug: " + slug);
        }
        return topicRepository.findByLibrarySlugOrderByOrderIndexAsc(slug)
                .stream()
                .map(topic -> mapper.toTopicResponse(topic, false, false))
                .collect(Collectors.toList());
    }
}

