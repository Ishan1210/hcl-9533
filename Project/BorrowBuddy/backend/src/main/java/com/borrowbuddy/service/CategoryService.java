package com.borrowbuddy.service;
import com.borrowbuddy.dto.response.CategoryResponse;
import com.borrowbuddy.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service public class CategoryService {
 private final CategoryRepository categoryRepository;
 public CategoryService(CategoryRepository categoryRepository){this.categoryRepository=categoryRepository;}
 public List<CategoryResponse> getAllCategories(){return categoryRepository.findAll().stream().map(CategoryResponse::new).toList();}
}
