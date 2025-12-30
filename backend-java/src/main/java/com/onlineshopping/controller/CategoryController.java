package com.onlineshopping.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onlineshopping.dao.CategoryDao;
import com.onlineshopping.model.Category;

@RestController
@RequestMapping("api/category")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class CategoryController {

    @Autowired
    private CategoryDao categoryDao;

    // Get all categories
    @GetMapping("all")
    public ResponseEntity<List<Category>> getAllCategories() {
        System.out.println("Request received for getting all categories");
        List<Category> categories = categoryDao.findAll();
        System.out.println("Response sent");
        return ResponseEntity.ok(categories);
    }

    // Add a new category
    @PostMapping("add")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        System.out.println("Request received for adding a category: " + category);

        if (category.getTitle() == null || category.getTitle().isEmpty() ||
            category.getDescription() == null || category.getDescription().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Title and Description are required!");
        }

        try {
            Category savedCategory = categoryDao.save(category);
            System.out.println("Category saved successfully: " + savedCategory);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            System.err.println("Error saving category: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add category!");
        }
    }
}
