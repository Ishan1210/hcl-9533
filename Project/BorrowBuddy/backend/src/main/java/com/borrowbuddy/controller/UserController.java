package com.borrowbuddy.controller;

import com.borrowbuddy.dto.response.UserResponse;
import com.borrowbuddy.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            Principal principal) {

        return ResponseEntity.ok(
                authService.getCurrentUser(principal.getName()));
    }
}