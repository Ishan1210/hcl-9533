package com.borrowbuddy.config;
import com.borrowbuddy.entity.Category;
import com.borrowbuddy.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
@Component public class CategoryInitializer implements CommandLineRunner {
 private final CategoryRepository categoryRepository;
 public CategoryInitializer(CategoryRepository categoryRepository){this.categoryRepository=categoryRepository;}
 public void run(String... args){
 String[] categories={"Electronics","Tools & Equipment","Books & Study Materials","Sports & Fitness","Travel & Camping","Home & Kitchen","Photography","Musical Instruments","Party & Events","Others"};
 for(String name:categories) if(!categoryRepository.existsByName(name)) categoryRepository.save(new Category(name));
 }
}
