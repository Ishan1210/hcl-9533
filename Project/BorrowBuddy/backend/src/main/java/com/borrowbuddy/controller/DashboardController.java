package com.borrowbuddy.controller;

import com.borrowbuddy.dto.response.DashboardResponse;
import com.borrowbuddy.service.AuthService;
import com.borrowbuddy.service.ItemService;
import com.borrowbuddy.service.BorrowService;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final AuthService auth;
    private final ItemService items;
    private final BorrowService requests;

    public DashboardController(AuthService auth, ItemService items, BorrowService requests) {
        this.auth = auth;
        this.items = items;
        this.requests = requests;
    }

    @GetMapping
    public DashboardResponse dashboard(Principal principal) {
        String email = principal.getName();
        return new DashboardResponse(auth.getCurrentUser(email), items.getMyItems(email),
                requests.mine(email, false), requests.mine(email, true));
    }
}
