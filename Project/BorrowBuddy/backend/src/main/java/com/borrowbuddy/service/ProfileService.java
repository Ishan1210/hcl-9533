package com.borrowbuddy.service;

import com.borrowbuddy.dto.request.UpdateProfileRequest;
import com.borrowbuddy.dto.response.UserResponse;
import com.borrowbuddy.dto.response.OwnedItemDetails;
import com.borrowbuddy.entity.User;
import com.borrowbuddy.entity.Item;
import com.borrowbuddy.enums.ItemStatus;
import com.borrowbuddy.repository.UserRepository;
import com.borrowbuddy.repository.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {
    private final UserRepository users;
    private final ItemRepository items;

    public ProfileService(UserRepository users, ItemRepository items) {
        this.users = users;
        this.items = items;
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = users.findByEmail(email).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setName(request.name().trim());
        return new UserResponse(users.save(user));
    }

    @Transactional(readOnly = true)
    public OwnedItemDetails getOwnedItem(Long id, String email) {
        Item item = items.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));
        if (!item.getOwner().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this item");
        }
        if (item.getStatus() == ItemStatus.ARCHIVED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item has been archived");
        }
        return new OwnedItemDetails(item);
    }
}
