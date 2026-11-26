package com.borrowbuddy.entity;
import jakarta.persistence.*;
import com.borrowbuddy.enums.ItemStatus;
import java.math.BigDecimal;
import java.time.Instant;
@Entity @Table(name="items") public class Item {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=150) private String name;
 @Column(nullable=false,length=1000) private String description;
 @Column(nullable=false,precision=10,scale=2) private BigDecimal pricePerDay;
 @Column(nullable=false,length=150) private String locality;
 @Column(nullable=false) private Double latitude;
 @Column(nullable=false) private Double longitude;
 @Column(length=1000) private String imageUrl;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private ItemStatus status = ItemStatus.ACTIVE;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="owner_id",nullable=false) private User owner;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="category_id",nullable=false) private Category category;
 @Column(nullable=false,updatable=false) private Instant createdAt = Instant.now();
 public Long getId(){return id;}
 public String getName(){return name;} public void setName(String name){this.name=name;}
 public String getDescription(){return description;} public void setDescription(String description){this.description=description;}
 public BigDecimal getPricePerDay(){return pricePerDay;} public void setPricePerDay(BigDecimal pricePerDay){this.pricePerDay=pricePerDay;}
 public String getLocality(){return locality;} public void setLocality(String locality){this.locality=locality;}
 public Double getLatitude(){return latitude;} public void setLatitude(Double latitude){this.latitude=latitude;}
 public Double getLongitude(){return longitude;} public void setLongitude(Double longitude){this.longitude=longitude;}
 public String getImageUrl(){return imageUrl;} public void setImageUrl(String imageUrl){this.imageUrl=imageUrl;}
 public ItemStatus getStatus(){return status;} public void setStatus(ItemStatus status){this.status=status;}
 public User getOwner(){return owner;} public void setOwner(User owner){this.owner=owner;}
 public Category getCategory(){return category;} public void setCategory(Category category){this.category=category;}
 public Instant getCreatedAt(){return createdAt;}
}
