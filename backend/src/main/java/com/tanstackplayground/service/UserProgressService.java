package com.tanstackplayground.service;

import com.tanstackplayground.dto.ProgressSummaryResponse;
import com.tanstackplayground.dto.UserProgressResponse;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.entity.User;
import com.tanstackplayground.entity.UserProgress;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.TopicRepository;
import com.tanstackplayground.repository.UserProgressRepository;
import com.tanstackplayground.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final EntityDtoMapper mapper;

    @Transactional
    public UserProgressResponse markTopicCompleted(UUID userId, UUID topicId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));

        UserProgress progress = userProgressRepository.findByUserIdAndTopicId(userId, topicId)
                .orElse(UserProgress.builder()
                        .user(user)
                        .topic(topic)
                        .completed(false)
                        .build());

        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        progress.setLastVisitedAt(Instant.now());

        UserProgress saved = userProgressRepository.save(progress);
        return mapper.toUserProgressResponse(saved);
    }

    @Transactional
    public UserProgressResponse recordTopicVisit(UUID userId, UUID topicId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));

        UserProgress progress = userProgressRepository.findByUserIdAndTopicId(userId, topicId)
                .orElse(UserProgress.builder()
                        .user(user)
                        .topic(topic)
                        .completed(false)
                        .build());

        progress.setLastVisitedAt(Instant.now());
        UserProgress saved = userProgressRepository.save(progress);
        return mapper.toUserProgressResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserProgressResponse> getUserProgress(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return userProgressRepository.findByUserId(userId)
                .stream()
                .map(mapper::toUserProgressResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProgressSummaryResponse getProgressSummary(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        long totalTopics = topicRepository.count();
        long completedTopics = userProgressRepository.countByUserIdAndCompletedTrue(userId);
        int completionPercentage = totalTopics > 0
                ? (int) Math.round(((double) completedTopics / totalTopics) * 100)
                : 0;

        return ProgressSummaryResponse.builder()
                .totalTopics(totalTopics)
                .completedTopics(completedTopics)
                .completionPercentage(completionPercentage)
                .build();
    }
}

