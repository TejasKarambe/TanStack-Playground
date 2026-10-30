package com.tanstackplayground.repository;

import com.tanstackplayground.entity.ExampleFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExampleFileRepository extends JpaRepository<ExampleFile, UUID> {
    List<ExampleFile> findByExampleIdOrderByOrderIndexAsc(UUID exampleId);
}

