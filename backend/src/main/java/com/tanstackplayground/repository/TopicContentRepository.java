package com.tanstackplayground.repository;

import com.tanstackplayground.entity.TopicContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TopicContentRepository extends JpaRepository<TopicContent, UUID> {
    Optional<TopicContent> findByTopicId(UUID topicId);
    Optional<TopicContent> findByTopicSlug(String topicSlug);
}

