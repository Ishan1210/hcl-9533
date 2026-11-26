package com.borrowbuddy.dto.response;

import com.borrowbuddy.entity.User;
import com.borrowbuddy.enums.Role;

public class UserResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final Role role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}