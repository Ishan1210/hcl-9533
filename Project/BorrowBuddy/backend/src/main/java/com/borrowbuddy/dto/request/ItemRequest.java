package com.borrowbuddy.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public class ItemRequest {
 @NotBlank @Size(max=150) private String name;
 @NotBlank @Size(max=1000) private String description;
 @NotNull @Positive private Long categoryId;
 @NotNull @DecimalMin("0.00") @Digits(integer=8,fraction=2) private BigDecimal pricePerDay;
 @NotBlank @Size(max=150) private String locality;
 @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") private Double latitude;
 @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") private Double longitude;
 @Size(max=1000) private String imageUrl;
 public String getName(){return name;} public void setName(String name){this.name=name;}
 public String getDescription(){return description;} public void setDescription(String description){this.description=description;}
 public Long getCategoryId(){return categoryId;} public void setCategoryId(Long categoryId){this.categoryId=categoryId;}
 public BigDecimal getPricePerDay(){return pricePerDay;} public void setPricePerDay(BigDecimal pricePerDay){this.pricePerDay=pricePerDay;}
 public String getLocality(){return locality;} public void setLocality(String locality){this.locality=locality;}
 public Double getLatitude(){return latitude;} public void setLatitude(Double latitude){this.latitude=latitude;}
 public Double getLongitude(){return longitude;} public void setLongitude(Double longitude){this.longitude=longitude;}
 public String getImageUrl(){return imageUrl;} public void setImageUrl(String imageUrl){this.imageUrl=imageUrl;}
}
