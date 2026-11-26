package com.borrowbuddy.controller;

import com.borrowbuddy.dto.request.UpdateProfileRequest;
import com.borrowbuddy.dto.response.UserResponse;
import com.borrowbuddy.dto.response.OwnedItemDetails;
import com.borrowbuddy.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users/me")
public class ProfileController {
    private final ProfileService profiles;

    public ProfileController(ProfileService profiles) {
        this.profiles = profiles;
    }

    @PutMapping
    public UserResponse update(@Valid @RequestBody UpdateProfileRequest request,
                               Principal principal) {
        return profiles.updateProfile(principal.getName(), request);
    }

    @GetMapping("/items/{id}")
    public OwnedItemDetails getOwnedItem(@PathVariable Long id, Principal principal) {
        return profiles.getOwnedItem(id, principal.getName());
    }
}
