package com.borrowbuddy.controller;
import com.borrowbuddy.dto.response.CategoryResponse;
import com.borrowbuddy.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/categories") public class CategoryController {
 private final CategoryService categoryService;
 public CategoryController(CategoryService categoryService){this.categoryService=categoryService;}
 @GetMapping public List<CategoryResponse> getAllCategories(){return categoryService.getAllCategories();}
}
