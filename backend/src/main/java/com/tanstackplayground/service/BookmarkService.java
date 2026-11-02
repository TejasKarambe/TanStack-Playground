package com.tanstackplayground.service;

import com.tanstackplayground.dto.BookmarkResponse;
import com.tanstackplayground.entity.Bookmark;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.entity.User;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.BookmarkRepository;
import com.tanstackplayground.repository.TopicRepository;
import com.tanstackplayground.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final EntityDtoMapper mapper;

    public Topic findTopicByIdOrSlug(String identifier) {
        try {
            UUID id = UUID.fromString(identifier);
            return topicRepository.findById(id)
                    .or(() -> topicRepository.findBySlug(identifier))
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id or slug: " + identifier));
        } catch (IllegalArgumentException e) {
            return topicRepository.findBySlug(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with slug: " + identifier));
        }
    }

    @Transactional
    public BookmarkResponse addBookmark(UUID userId, UUID topicId) {
        return addBookmark(userId, topicId.toString());
    }

    @Transactional
    public BookmarkResponse addBookmark(UUID userId, String topicIdentifier) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Topic topic = findTopicByIdOrSlug(topicIdentifier);

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
    public void removeBookmark(UUID userId, String topicIdentifier) {
        Topic topic = findTopicByIdOrSlug(topicIdentifier);
        if (bookmarkRepository.existsByUserIdAndTopicId(userId, topic.getId())) {
            bookmarkRepository.deleteByUserIdAndTopicId(userId, topic.getId());
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

