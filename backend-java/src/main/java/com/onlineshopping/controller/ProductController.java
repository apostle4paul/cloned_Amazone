package com.onlineshopping.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.onlineshopping.dao.CategoryDao;
import com.onlineshopping.dao.ProductDao;
import com.onlineshopping.dto.ProductAddRequest;
import com.onlineshopping.model.Category;
import com.onlineshopping.model.Product;
import com.onlineshopping.service.ProductService;

@RestController
@RequestMapping("api/product")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private CategoryDao categoryDao;

    @PostMapping("add")
    public ResponseEntity<?> addProduct(@ModelAttribute ProductAddRequest productDto) {
        try {
            // Convert DTO to Entity
            Product product = ProductAddRequest.toEntity(productDto);

            Optional<Category> optionalCategory = categoryDao.findById(productDto.getCategoryId());
            product.setCategory(optionalCategory.orElse(null));

            // Save product and handle image
            productService.addProduct(product, productDto.getImage());

            return ResponseEntity.ok(product);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to add product: " + e.getMessage());
        }
    }

    @GetMapping("all")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productDao.findAll());
    }
}
