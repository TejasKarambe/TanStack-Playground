package com.tanstackplayground.mapper;

import com.tanstackplayground.dto.*;
import com.tanstackplayground.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public LibraryResponse toLibraryResponse(Library library, Integer topicCount) {
        if (library == null) return null;
        return LibraryResponse.builder()
                .id(library.getId())
                .slug(library.getSlug())
                .name(library.getName())
                .description(library.getDescription())
                .packageName(library.getPackageName())
                .icon(library.getIcon())
                .documentationUrl(library.getDocumentationUrl())
                .status(library.getStatus())
                .topicCount(topicCount != null ? topicCount : (library.getTopics() != null ? library.getTopics().size() : 0))
                .createdAt(library.getCreatedAt())
                .updatedAt(library.getUpdatedAt())
                .build();
    }

    public TopicResponse toTopicResponse(Topic topic, Boolean isCompleted, Boolean isBookmarked) {
        if (topic == null) return null;
        return TopicResponse.builder()
                .id(topic.getId())
                .libraryId(topic.getLibrary() != null ? topic.getLibrary().getId() : null)
                .librarySlug(topic.getLibrary() != null ? topic.getLibrary().getSlug() : null)
                .slug(topic.getSlug())
                .title(topic.getTitle())
                .description(topic.getDescription())
                .difficulty(topic.getDifficulty())
                .estimatedMinutes(topic.getEstimatedMinutes())
                .orderIndex(topic.getOrderIndex())
                .documentationUrl(topic.getDocumentationUrl())
                .isCompleted(isCompleted != null ? isCompleted : false)
                .isBookmarked(isBookmarked != null ? isBookmarked : false)
                .createdAt(topic.getCreatedAt())
                .updatedAt(topic.getUpdatedAt())
                .build();
    }

    public TopicContentResponse toTopicContentResponse(TopicContent content) {
        if (content == null) return null;
        return TopicContentResponse.builder()
                .id(content.getId())
                .topicId(content.getTopic() != null ? content.getTopic().getId() : null)
                .topicSlug(content.getTopic() != null ? content.getTopic().getSlug() : null)
                .introduction(content.getIntroduction())
                .learningObjectives(content.getLearningObjectives())
                .explanation(content.getExplanation())
                .keyConcepts(content.getKeyConcepts())
                .exampleNotes(content.getExampleNotes())
                .build();
    }

    public ExampleFileResponse toExampleFileResponse(ExampleFile file) {
        if (file == null) return null;
        return ExampleFileResponse.builder()
                .id(file.getId())
                .exampleId(file.getExample() != null ? file.getExample().getId() : null)
                .fileName(file.getFileName())
                .filePath(file.getFilePath())
                .language(file.getLanguage())
                .sourceCode(file.getSourceCode())
                .orderIndex(file.getOrderIndex())
                .build();
    }

    public ExampleResponse toExampleResponse(Example example) {
        if (example == null) return null;
        List<ExampleFileResponse> fileResponses = example.getFiles() != null
                ? example.getFiles().stream().map(this::toExampleFileResponse).collect(Collectors.toList())
                : Collections.emptyList();

        return ExampleResponse.builder()
                .id(example.getId())
                .topicId(example.getTopic() != null ? example.getTopic().getId() : null)
                .title(example.getTitle())
                .description(example.getDescription())
                .difficulty(example.getDifficulty())
                .defaultFile(example.getDefaultFile())
                .dependenciesJson(example.getDependenciesJson())
                .isActive(example.getIsActive())
                .files(fileResponses)
                .build();
    }

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserProgressResponse toUserProgressResponse(UserProgress progress) {
        if (progress == null) return null;
        return UserProgressResponse.builder()
                .id(progress.getId())
                .topicId(progress.getTopic() != null ? progress.getTopic().getId() : null)
                .topicSlug(progress.getTopic() != null ? progress.getTopic().getSlug() : null)
                .topicTitle(progress.getTopic() != null ? progress.getTopic().getTitle() : null)
                .librarySlug((progress.getTopic() != null && progress.getTopic().getLibrary() != null)
                        ? progress.getTopic().getLibrary().getSlug() : null)
                .completed(progress.getCompleted())
                .lastVisitedAt(progress.getLastVisitedAt())
                .completedAt(progress.getCompletedAt())
                .build();
    }

    public BookmarkResponse toBookmarkResponse(Bookmark bookmark) {
        if (bookmark == null) return null;
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .topicId(bookmark.getTopic() != null ? bookmark.getTopic().getId() : null)
                .topicSlug(bookmark.getTopic() != null ? bookmark.getTopic().getSlug() : null)
                .topicTitle(bookmark.getTopic() != null ? bookmark.getTopic().getTitle() : null)
                .librarySlug((bookmark.getTopic() != null && bookmark.getTopic().getLibrary() != null)
                        ? bookmark.getTopic().getLibrary().getSlug() : null)
                .createdAt(bookmark.getCreatedAt())
                .build();
    }

    public PreferenceResponse toPreferenceResponse(UserPreference preference) {
        if (preference == null) return null;
        return PreferenceResponse.builder()
                .id(preference.getId())
                .theme(preference.getTheme())
                .editorFontSize(preference.getEditorFontSize())
                .editorWordWrap(preference.getEditorWordWrap())
                .previewLayout(preference.getPreviewLayout())
                .updatedAt(preference.getUpdatedAt())
                .build();
    }
}

