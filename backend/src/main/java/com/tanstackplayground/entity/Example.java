package com.tanstackplayground.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "examples")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Example {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String difficulty = "BEGINNER";

    @Column(name = "default_file", nullable = false, length = 255)
    @Builder.Default
    private String defaultFile = "/App.tsx";

    @Column(name = "dependencies_json", nullable = false, columnDefinition = "TEXT")
    @Builder.Default
    private String dependenciesJson = "{}";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "example", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<ExampleFile> files = new ArrayList<>();
}

