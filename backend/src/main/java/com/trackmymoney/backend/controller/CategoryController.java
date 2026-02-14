package com.trackmymoney.backend.controller;

import com.trackmymoney.backend.entity.Category;
import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.repository.CategoryRepository;
import com.trackmymoney.backend.repository.UserRepository;
import com.trackmymoney.backend.security.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryController(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Category> getCategories(@RequestParam String type) {
        if (!type.equals("EXPENSE") && !type.equals("INCOME")) {
            throw new IllegalArgumentException("Type must be EXPENSE or INCOME");
        }
        User user = getLoggedInUser();
        return categoryRepository.findByUserAndType(user, type);
    }

    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        User user = getLoggedInUser();

        if (categoryRepository.existsByUserAndNameAndType(user, category.getName(), category.getType())) {
            throw new RuntimeException("Category already exists");
        }

        category.setUser(user);
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        User user = getLoggedInUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot delete this category");
        }

        categoryRepository.delete(category);
        return ResponseEntity.noContent().build();
    }

    private User getLoggedInUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
