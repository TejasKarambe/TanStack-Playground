package com.tanstackplayground;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanstackplayground.dto.PreferenceUpdateRequest;
import com.tanstackplayground.dto.RegisterRequest;
import com.tanstackplayground.entity.Library;
import com.tanstackplayground.entity.Topic;
import com.tanstackplayground.repository.*;
import com.tanstackplayground.security.JwtAuthenticationFilter;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserFeaturesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    private Cookie authCookie;
    private Topic testTopic;

    @BeforeEach
    void setUp() throws Exception {
        bookmarkRepository.deleteAll();
        userProgressRepository.deleteAll();
        userRepository.deleteAll();
        topicRepository.deleteAll();
        libraryRepository.deleteAll();

        // 1. Create Library & Topic
        Library lib = libraryRepository.save(Library.builder()
                .slug("table")
                .name("TanStack Table")
                .description("Headless UI for tables and datagrids.")
                .packageName("@tanstack/react-table")
                .icon("Table")
                .documentationUrl("https://tanstack.com/table/latest")
                .status("STABLE")
                .build());

        testTopic = topicRepository.save(Topic.builder()
                .library(lib)
                .slug("column-defs")
                .title("Column Definitions")
                .description("Creating column definitions with createColumnHelper.")
                .difficulty("BEGINNER")
                .estimatedMinutes(10)
                .orderIndex(1)
                .build());

        // 2. Register user & obtain auth cookie
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("features@tanstack.com")
                .password("Password123!")
                .displayName("Feature Tester")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andReturn();

        authCookie = result.getResponse().getCookie(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME);
    }

    @Test
    void testProgressFlow() throws Exception {
        // Record visit
        mockMvc.perform(post("/api/progress/" + testTopic.getId() + "/visit")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topicSlug").value("column-defs"))
                .andExpect(jsonPath("$.completed").value(false));

        // Mark completed
        mockMvc.perform(post("/api/progress/" + testTopic.getId() + "/complete")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        // Get progress list
        mockMvc.perform(get("/api/progress")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].completed").value(true));

        // Get progress summary
        mockMvc.perform(get("/api/progress/summary")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTopics").value(1))
                .andExpect(jsonPath("$.completedTopics").value(1))
                .andExpect(jsonPath("$.completionPercentage").value(100));
    }

    @Test
    void testBookmarkFlow() throws Exception {
        // Add bookmark
        mockMvc.perform(post("/api/bookmarks/" + testTopic.getId())
                        .cookie(authCookie))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.topicSlug").value("column-defs"));

        // List bookmarks
        mockMvc.perform(get("/api/bookmarks")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].topicSlug").value("column-defs"));

        // Delete bookmark
        mockMvc.perform(delete("/api/bookmarks/" + testTopic.getId())
                        .cookie(authCookie))
                .andExpect(status().isNoContent());

        // Verify empty
        mockMvc.perform(get("/api/bookmarks")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testUserPreferencesFlow() throws Exception {
        // Get initial preferences (default)
        mockMvc.perform(get("/api/preferences")
                        .cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme").value("dark"))
                .andExpect(jsonPath("$.editorFontSize").value(14));

        // Update preferences
        PreferenceUpdateRequest updateReq = PreferenceUpdateRequest.builder()
                .theme("light")
                .editorFontSize(16)
                .editorWordWrap(false)
                .previewLayout("tabbed")
                .build();

        mockMvc.perform(put("/api/preferences")
                        .cookie(authCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.theme").value("light"))
                .andExpect(jsonPath("$.editorFontSize").value(16))
                .andExpect(jsonPath("$.editorWordWrap").value(false))
                .andExpect(jsonPath("$.previewLayout").value("tabbed"));
    }
}

