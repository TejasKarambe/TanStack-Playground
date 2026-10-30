package com.tanstackplayground.repository;

import com.tanstackplayground.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LibraryRepository extends JpaRepository<Library, UUID> {
    Optional<Library> findBySlug(String slug);
    boolean existsBySlug(String slug);
}

