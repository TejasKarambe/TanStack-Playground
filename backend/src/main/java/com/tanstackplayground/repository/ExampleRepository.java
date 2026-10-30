package com.tanstackplayground.repository;

import com.tanstackplayground.entity.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExampleRepository extends JpaRepository<Example, UUID> {
    List<Example> findByTopicSlugAndIsActiveTrue(String topicSlug);
    List<Example> findByTopicIdAndIsActiveTrue(UUID topicId);
}

