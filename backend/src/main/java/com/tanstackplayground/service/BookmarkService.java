package com.tanstackplayground.service;

import com.tanstackplayground.dto.BookmarkResponse;
import com.tanstackplayground.entity.Bookmark;
import com.tanstackplayground.entity.Library;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.entity.User;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.BookmarkRepository;
import com.tanstackplayground.repository.LibraryRepository;
import com.tanstackplayground.repository.TopicRepository;
import com.tanstackplayground.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final LibraryRepository libraryRepository;
    private final EntityDtoMapper mapper;

    public Topic findTopicByIdOrSlug(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new ResourceNotFoundException("Identifier cannot be empty");
        }

        try {
            UUID id = UUID.fromString(identifier);
            return topicRepository.findById(id)
                    .or(() -> topicRepository.findBySlug(identifier))
                    .orElseGet(() -> autoProvisionTopic(identifier));
        } catch (IllegalArgumentException e) {
            return topicRepository.findBySlug(identifier)
                    .orElseGet(() -> autoProvisionTopic(identifier));
        }
    }

    public Topic autoProvisionTopic(String slug) {
        log.info("Auto-provisioning topic for slug: {}", slug);

        String librarySlug = "query";
        if (slug.startsWith("devtools-")) {
            librarySlug = "devtools";
        } else if (slug.startsWith("table-") || slug.contains("-table") || slug.equals("sorting") || slug.equals("filtering") || slug.equals("expanding") || slug.equals("editable-cells")) {
            librarySlug = "table";
        } else if (slug.startsWith("router-") || slug.startsWith("route-") || slug.equals("navigation") || slug.equals("loaders") || slug.equals("auth-guards") || slug.equals("dynamic-params") || slug.equals("search-params")) {
            librarySlug = "router";
        } else if (slug.startsWith("form-") || slug.contains("-form") || slug.contains("-field") || slug.contains("-validation") || slug.equals("form-submission")) {
            librarySlug = "form";
        } else if (slug.startsWith("virtual-") || slug.equals("large-dataset") || slug.equals("variable-height") || slug.equals("horizontal-virtual") || slug.equals("grid-virtualization")) {
            librarySlug = "virtual";
        } else if (slug.startsWith("start-") || slug.equals("server-functions")) {
            librarySlug = "start";
        } else if (slug.startsWith("db-") || slug.equals("collections")) {
            librarySlug = "db";
        } else if (slug.startsWith("store-")) {
            librarySlug = "store";
        } else if (slug.startsWith("pacer-") || slug.equals("debouncing")) {
            librarySlug = "pacer";
        } else if (slug.startsWith("ranger-") || slug.equals("multi-slider")) {
            librarySlug = "ranger";
        } else if (slug.startsWith("hotkey-") || slug.equals("key-sequences")) {
            librarySlug = "hotkeys";
        } else if (slug.startsWith("ai-") || slug.equals("streaming-chat")) {
            librarySlug = "ai";
        }

        final String targetLibSlug = librarySlug;
        Library library = libraryRepository.findBySlug(targetLibSlug)
                .orElseGet(() -> libraryRepository.save(Library.builder()
                        .slug(targetLibSlug)
                        .name("TanStack " + Character.toUpperCase(targetLibSlug.charAt(0)) + targetLibSlug.substring(1))
                        .packageName("@tanstack/" + (targetLibSlug.equals("devtools") ? "react-query-devtools" : targetLibSlug))
                        .icon("Layers")
                        .status("STABLE")
                        .build()));

        String title = Arrays.stream(slug.split("[-_]"))
                .filter(w -> !w.isBlank())
                .map(w -> Character.toUpperCase(w.charAt(0)) + (w.length() > 1 ? w.substring(1).toLowerCase() : ""))
                .collect(Collectors.joining(" "));

        int maxOrder = topicRepository.findByLibraryIdOrderByOrderIndexAsc(library.getId())
                .stream()
                .mapToInt(Topic::getOrderIndex)
                .max()
                .orElse(-1);
        int nextOrderIndex = maxOrder + 1;

        Topic newTopic = Topic.builder()
                .library(library)
                .slug(slug)
                .title(title)
                .difficulty("BEGINNER")
                .estimatedMinutes(15)
                .orderIndex(nextOrderIndex)
                .documentationUrl("https://tanstack.com")
                .build();

        return topicRepository.save(newTopic);
    }

    @Transactional
    public BookmarkResponse addBookmark(UUID userId, UUID topicId) {
        return addBookmark(userId, topicId.toString());
    }

    @Transactional
    public BookmarkResponse addBookmark(UUID userId, String identifier) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if identifier is an existing bookmark UUID
        try {
            UUID possibleBookmarkId = UUID.fromString(identifier);
            Optional<Bookmark> byBookmarkId = bookmarkRepository.findByIdAndUserId(possibleBookmarkId, userId);
            if (byBookmarkId.isPresent()) {
                return mapper.toBookmarkResponse(byBookmarkId.get());
            }
        } catch (IllegalArgumentException ignored) {
            // Not a UUID, proceed
        }

        Topic topic = findTopicByIdOrSlug(identifier);

        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndTopicId(userId, topic.getId());
        if (existing.isPresent()) {
            return mapper.toBookmarkResponse(existing.get());
        }

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .topic(topic)
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);
        return mapper.toBookmarkResponse(saved);
    }

    @Transactional
    public void removeBookmark(UUID userId, UUID topicId) {
        removeBookmark(userId, topicId.toString());
    }

    @Transactional
    public void removeBookmark(UUID userId, String identifier) {
        if (identifier == null || identifier.isBlank()) return;

        // 1. Check if identifier is a Bookmark UUID directly
        try {
            UUID possibleBookmarkId = UUID.fromString(identifier);
            if (bookmarkRepository.existsByIdAndUserId(possibleBookmarkId, userId)) {
                bookmarkRepository.deleteByIdAndUserId(possibleBookmarkId, userId);
                return;
            }
            if (bookmarkRepository.existsByUserIdAndTopicId(userId, possibleBookmarkId)) {
                bookmarkRepository.deleteByUserIdAndTopicId(userId, possibleBookmarkId);
                return;
            }
        } catch (IllegalArgumentException ignored) {
            // Not a UUID, continue to slug check
        }

        // 2. Check if identifier is a Topic Slug
        Optional<Topic> topicOpt = topicRepository.findBySlug(identifier);
        if (topicOpt.isPresent()) {
            UUID topicId = topicOpt.get().getId();
            if (bookmarkRepository.existsByUserIdAndTopicId(userId, topicId)) {
                bookmarkRepository.deleteByUserIdAndTopicId(userId, topicId);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<BookmarkResponse> getUserBookmarks(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(mapper::toBookmarkResponse)
                .collect(Collectors.toList());
    }
}
