package com.tanstackplayground;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanstackplayground.dto.LoginRequest;
import com.tanstackplayground.dto.RegisterRequest;
import com.tanstackplayground.repository.UserRepository;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("learner@tanstack.com")
                .password("Password123!")
                .displayName("TanStack Explorer")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value("learner@tanstack.com"))
                .andExpect(jsonPath("$.user.displayName").value("TanStack Explorer"))
                .andExpect(cookie().exists(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME))
                .andExpect(cookie().httpOnly(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME, true));
    }

    @Test
    void testRegisterDuplicateEmailFails() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("duplicate@tanstack.com")
                .password("Password123!")
                .displayName("User One")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value(containsString("already registered")));
    }

    @Test
    void testLoginSuccess() throws Exception {
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("login@tanstack.com")
                .password("SecurePass456!")
                .displayName("Login Tester")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = LoginRequest.builder()
                .email("login@tanstack.com")
                .password("SecurePass456!")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("login@tanstack.com"))
                .andExpect(cookie().exists(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME));
    }

    @Test
    void testGetCurrentUserWithCookieAndBearerToken() throws Exception {
        RegisterRequest registerReq = RegisterRequest.builder()
                .email("me@tanstack.com")
                .password("SecurePass789!")
                .displayName("Me Explorer")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andReturn();

        jakarta.servlet.http.Cookie cookie = result.getResponse().getCookie(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME);
        assert cookie != null;

        // 1. Authenticate with HttpOnly Cookie
        mockMvc.perform(get("/api/auth/me")
                        .cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("me@tanstack.com"))
                .andExpect(jsonPath("$.displayName").value("Me Explorer"));

        // 2. Authenticate with Bearer token header
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + cookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("me@tanstack.com"));

        // 3. Unauthorized request without credentials
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLogoutClearsCookie() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME, 0));
    }
}

