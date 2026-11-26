package com.borrowbuddy.dto.response;
import com.borrowbuddy.entity.Category;
public class CategoryResponse { private final Long id; private final String name; public CategoryResponse(Category c){id=c.getId();name=c.getName();} public Long getId(){return id;} public String getName(){return name;} }
