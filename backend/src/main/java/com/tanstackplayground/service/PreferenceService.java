package com.tanstackplayground.service;

import com.tanstackplayground.dto.PreferenceResponse;
import com.tanstackplayground.dto.PreferenceUpdateRequest;
import com.tanstackplayground.entity.User;
import com.tanstackplayground.entity.UserPreference;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.UserPreferenceRepository;
import com.tanstackplayground.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    @Transactional
    public PreferenceResponse getUserPreference(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreference defaultPref = UserPreference.builder()
                            .user(user)
                            .theme("dark")
                            .editorFontSize(14)
                            .editorWordWrap(true)
                            .previewLayout("side-by-side")
                            .build();
                    return userPreferenceRepository.save(defaultPref);
                });

        return mapper.toPreferenceResponse(preference);
    }

    @Transactional
    public PreferenceResponse updateUserPreference(UUID userId, PreferenceUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> UserPreference.builder().user(user).build());

        if (request.getTheme() != null) {
            preference.setTheme(request.getTheme());
        }
        if (request.getEditorFontSize() != null) {
            preference.setEditorFontSize(request.getEditorFontSize());
        }
        if (request.getEditorWordWrap() != null) {
            preference.setEditorWordWrap(request.getEditorWordWrap());
        }
        if (request.getPreviewLayout() != null) {
            preference.setPreviewLayout(request.getPreviewLayout());
        }

        UserPreference saved = userPreferenceRepository.save(preference);
        return mapper.toPreferenceResponse(saved);
    }
}

