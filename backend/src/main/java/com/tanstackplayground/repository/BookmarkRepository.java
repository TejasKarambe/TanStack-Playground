package com.tanstackplayground.repository;

import com.tanstackplayground.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {
    Optional<Bookmark> findByUserIdAndTopicId(UUID userId, UUID topicId);
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(UUID userId);
    boolean existsByUserIdAndTopicId(UUID userId, UUID topicId);
    void deleteByUserIdAndTopicId(UUID userId, UUID topicId);
    Optional<Bookmark> findByIdAndUserId(UUID id, UUID userId);
    boolean existsByIdAndUserId(UUID id, UUID userId);
    void deleteByIdAndUserId(UUID id, UUID userId);
}

