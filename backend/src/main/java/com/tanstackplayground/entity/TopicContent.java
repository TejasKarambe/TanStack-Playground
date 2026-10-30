package com.tanstackplayground.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "topic_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicContent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false, unique = true)
    private Topic topic;

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Column(name = "learning_objectives", columnDefinition = "TEXT")
    private String learningObjectives;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "key_concepts", columnDefinition = "TEXT")
    private String keyConcepts;

    @Column(name = "example_notes", columnDefinition = "TEXT")
    private String exampleNotes;
}

