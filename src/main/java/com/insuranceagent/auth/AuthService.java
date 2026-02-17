package com.insuranceagent.auth;

import com.insuranceagent.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        AppUser user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole());
    }

    @Transactional
    public AgentResponse createAgent(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setRole(Role.AGENT);

        userRepository.save(user);

        return new AgentResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), user.getCreatedAt());
    }

    public List<AgentResponse> listAgents() {
        return userRepository.findAll().stream()
                .map(u -> new AgentResponse(u.getId(), u.getUsername(), u.getEmail(),
                        u.getFullName(), u.getRole(), u.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void deleteAgent(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("Agent not found");
        }
        userRepository.deleteById(id);
    }
}
