package com.tanstackplayground.service;

import com.tanstackplayground.dto.AuthResponse;
import com.tanstackplayground.dto.LoginRequest;
import com.tanstackplayground.dto.RegisterRequest;
import com.tanstackplayground.dto.UserResponse;
import com.tanstackplayground.entity.User;
import com.tanstackplayground.entity.UserPreference;
import com.tanstackplayground.exception.ConflictException;
import com.tanstackplayground.exception.ResourceNotFoundException;
import com.tanstackplayground.mapper.EntityDtoMapper;
import com.tanstackplayground.repository.UserPreferenceRepository;
import com.tanstackplayground.repository.UserRepository;
import com.tanstackplayground.security.JwtAuthenticationFilter;
import com.tanstackplayground.security.JwtTokenProvider;
import com.tanstackplayground.security.UserPrincipal;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EntityDtoMapper mapper;

    @Value("${jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    @Value("${cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${cookie.same-site:Lax}")
    private String cookieSameSite;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .build();

        User savedUser = userRepository.save(user);

        // Initialize default user preferences
        UserPreference defaultPreference = UserPreference.builder()
                .user(savedUser)
                .theme("dark")
                .editorFontSize(14)
                .editorWordWrap(true)
                .previewLayout("side-by-side")
                .build();
        userPreferenceRepository.save(defaultPreference);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String token = tokenProvider.generateToken(principal);

        setTokenCookie(response, token, Duration.ofMillis(jwtExpirationMs));

        return AuthResponse.builder()
                .token(token)
                .user(mapper.toUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(principal);

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));

        setTokenCookie(response, token, Duration.ofMillis(jwtExpirationMs));

        return AuthResponse.builder()
                .token(token)
                .user(mapper.toUserResponse(user))
                .build();
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSameSite)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        SecurityContextHolder.clearContext();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapper.toUserResponse(user);
    }

    private void setTokenCookie(HttpServletResponse response, String token, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(JwtAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAge)
                .sameSite(cookieSameSite)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

