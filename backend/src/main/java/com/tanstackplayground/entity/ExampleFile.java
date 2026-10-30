package com.tanstackplayground.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "example_files", uniqueConstraints = {
    @UniqueConstraint(name = "uq_example_file_path", columnNames = {"example_id", "file_path"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExampleFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "example_id", nullable = false)
    private Example example;

    @Column(name = "file_name", nullable = false, length = 120)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String language = "typescript";

    @Column(name = "source_code", nullable = false, columnDefinition = "TEXT")
    private String sourceCode;

    @Column(name = "order_index", nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;
}

