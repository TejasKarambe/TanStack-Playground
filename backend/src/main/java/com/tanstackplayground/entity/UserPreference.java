package com.tanstackplayground.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String theme = "dark";

    @Column(name = "editor_font_size", nullable = false)
    @Builder.Default
    private Integer editorFontSize = 14;

    @Column(name = "editor_word_wrap", nullable = false)
    @Builder.Default
    private Boolean editorWordWrap = true;

    @Column(name = "preview_layout", nullable = false, length = 30)
    @Builder.Default
    private String previewLayout = "side-by-side";

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

