package com.tanstackplayground.repository;

import com.tanstackplayground.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    Optional<UserProgress> findByUserIdAndTopicId(UUID userId, UUID topicId);
    List<UserProgress> findByUserId(UUID userId);
    long countByUserIdAndCompletedTrue(UUID userId);
}

