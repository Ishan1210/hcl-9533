package com.borrowbuddy.dto.response;
import com.borrowbuddy.entity.Item;
import com.borrowbuddy.enums.ItemStatus;
import java.math.BigDecimal;
import java.time.Instant;
public class ItemResponse {
 private final Long id;
 private final String name;
 private final String description;
 private final BigDecimal pricePerDay;
 private final String locality;
 private final String imageUrl;
 private final ItemStatus status;
 private final Instant createdAt;
 private final Long ownerId;
 private final String ownerName;
 private final Long categoryId;
 private final String categoryName;
 private final Double distanceKm;
 public ItemResponse(Item item, Double distanceKm){
 this.id = item.getId();
 this.name = item.getName();
 this.description = item.getDescription();
 this.pricePerDay = item.getPricePerDay();
 this.locality = item.getLocality();
 this.imageUrl = item.getImageUrl();
 this.status = item.getStatus();
 this.createdAt = item.getCreatedAt();
 this.ownerId = item.getOwner().getId();
 this.ownerName = item.getOwner().getName();
 this.categoryId = item.getCategory().getId();
 this.categoryName = item.getCategory().getName();
 this.distanceKm = distanceKm == null ? null : Math.round(distanceKm * 10.0) / 10.0;
 }
 public Long getId(){return id;}
 public String getName(){return name;}
 public String getDescription(){return description;}
 public BigDecimal getPricePerDay(){return pricePerDay;}
 public String getLocality(){return locality;}
 public String getImageUrl(){return imageUrl;}
 public ItemStatus getStatus(){return status;}
 public Instant getCreatedAt(){return createdAt;}
 public Long getOwnerId(){return ownerId;}
 public String getOwnerName(){return ownerName;}
 public Long getCategoryId(){return categoryId;}
 public String getCategoryName(){return categoryName;}
 public Double getDistanceKm(){return distanceKm;}
}
