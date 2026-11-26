package com.borrowbuddy.dto.response;

import com.borrowbuddy.entity.Item;
import java.math.BigDecimal;

// Only returned to the owner, never from public item endpoints.
public record OwnedItemDetails(Long id, String name, String description,
        Long categoryId, BigDecimal pricePerDay, String locality,
        Double latitude, Double longitude, String imageUrl) {
    public OwnedItemDetails(Item item) {
        this(item.getId(), item.getName(), item.getDescription(),
                item.getCategory().getId(), item.getPricePerDay(),
                item.getLocality(), item.getLatitude(), item.getLongitude(),
                item.getImageUrl());
    }
}
