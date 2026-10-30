package com.tanstackplayground.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_topic_progress", columnNames = {"user_id", "topic_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(nullable = false)
    @Builder.Default
    private Boolean completed = false;

    @Column(name = "last_visited_at")
    private Instant lastVisitedAt;

    @Column(name = "completed_at")
    private Instant completedAt;
}

