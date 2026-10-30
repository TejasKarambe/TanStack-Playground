package com.tanstackplayground.service;

import com.tanstackplayground.dto.ExampleResponse;
import com.tanstackplayground.dto.TopicContentResponse;
import com.tanstackplayground.dto.TopicResponse;
import com.tanstackplayground.entity.Example;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.entity.TopicContent;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.ExampleRepository;
import com.tanstackplayground.repository.TopicContentRepository;
import com.tanstackplayground.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TopicService {

    private final TopicRepository topicRepository;
    private final TopicContentRepository topicContentRepository;
    private final ExampleRepository exampleRepository;
    private final EntityDtoMapper mapper;

    public TopicResponse getTopicBySlug(String slug) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with slug: " + slug));
        return mapper.toTopicResponse(topic, false, false);
    }

    public TopicContentResponse getTopicContent(String topicSlug) {
        Topic topic = topicRepository.findBySlug(topicSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with slug: " + topicSlug));

        TopicContent content = topicContentRepository.findByTopicId(topic.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Content not found for topic: " + topicSlug));

        return mapper.toTopicContentResponse(content);
    }

    public List<ExampleResponse> getExamplesByTopicSlug(String topicSlug) {
        Topic topic = topicRepository.findBySlug(topicSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with slug: " + topicSlug));

        List<Example> examples = exampleRepository.findByTopicIdAndIsActiveTrue(topic.getId());
        return examples.stream()
                .map(mapper::toExampleResponse)
                .collect(Collectors.toList());
    }
}

