package com.insuranceagent.product;

import com.insuranceagent.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/product-categories")
@Tag(name = "Product Categories")
public class ProductCategoryController {

    private final ProductCategoryService categoryService;

    public ProductCategoryController(ProductCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @Operation(summary = "Create a product category")
    public ResponseEntity<ApiResponse<ProductCategoryResponse>> create(
            @Valid @RequestBody ProductCategoryCreateRequest request) {
        ProductCategoryResponse response = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product category created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all product categories")
    public ResponseEntity<ApiResponse<List<ProductCategoryResponse>>> getAll() {
        List<ProductCategoryResponse> responses = categoryService.getAll();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product category by ID")
    public ResponseEntity<ApiResponse<ProductCategoryResponse>> getById(@PathVariable UUID id) {
        ProductCategoryResponse response = categoryService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product category")
    public ResponseEntity<ApiResponse<ProductCategoryResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductCategoryCreateRequest request) {
        ProductCategoryResponse response = categoryService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product category updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product category")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        categoryService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
