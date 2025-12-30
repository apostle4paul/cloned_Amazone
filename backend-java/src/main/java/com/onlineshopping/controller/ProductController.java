package com.onlineshopping.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.onlineshopping.dao.CategoryDao;
import com.onlineshopping.dao.ProductDao;
import com.onlineshopping.dao.UserDao;
import com.onlineshopping.dto.ProductAddRequest;
import com.onlineshopping.model.Category;
import com.onlineshopping.model.Product;
import com.onlineshopping.service.ProductService;
import com.onlineshopping.utility.StorageService;

@RestController
@RequestMapping("api/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private CategoryDao categoryDao;
	
	@Autowired
	private StorageService storageService;
	
	@Autowired
	private UserDao userDao;
	
	@PostMapping("add")
	public ResponseEntity<?> addProduct(ProductAddRequest productDto) {
		System.out.println("Received request for ADD PRODUCT");
		System.out.println(productDto);
		
		Product product = ProductAddRequest.toEntity(productDto);
		
		Optional<Category> optional = categoryDao.findById(productDto.getCategoryId());
		Category category = optional.orElse(null);
		
		product.setCategory(category);
		productService.addProduct(product, productDto.getImage());
		
		System.out.println("Response sent!!!");
		return ResponseEntity.ok(product);
	}
	
	@GetMapping("all")
	public ResponseEntity<?> getAllProducts() {
		System.out.println("Request came for getting all products");
		List<Product> products = productDao.findAll();
		System.out.println("Response sent!!!");
		return ResponseEntity.ok(products);
	}
	
	@GetMapping("id")
	public ResponseEntity<?> getProductById(@RequestParam("productId") int productId) {
		System.out.println("Request came for getting Product by Product Id");
		Optional<Product> optional = productDao.findById(productId);
		Product product = optional.orElse(new Product());
		System.out.println("Response sent!!!");
		return ResponseEntity.ok(product);
	}
	
	@GetMapping("category")
	public ResponseEntity<?> getProductsByCategories(@RequestParam("categoryId") int categoryId) {
		System.out.println("Request came for getting all products by category");
		List<Product> products = productDao.findByCategoryId(categoryId);
		System.out.println("Response sent!!!");
		return ResponseEntity.ok(products);
	}
	
	@GetMapping(value="/{productImageName}", produces = "image/*")
	public void fetchProductImage(@PathVariable("productImageName") String productImageName, HttpServletResponse resp) {
		System.out.println("Request came for fetching product pic");
		System.out.println("Loading file: " + productImageName);
		
		Resource resource = storageService.load(productImageName);
		if(resource != null) {
			try (InputStream in = resource.getInputStream()) {
				ServletOutputStream out = resp.getOutputStream();
				FileCopyUtils.copy(in, out);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		System.out.println("Response sent!");
	}
}
