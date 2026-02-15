package com.insuranceagent.product;

import com.insuranceagent.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ProductCategoryService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductCategoryService(ProductCategoryRepository categoryRepository,
                                  ProductMapper productMapper) {
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Transactional
    public ProductCategoryResponse create(ProductCategoryCreateRequest request) {
        ProductCategory category = new ProductCategory();
        category.setName(request.name());
        category.setDescription(request.description());
        ProductCategory saved = categoryRepository.save(category);
        return productMapper.toCategoryResponse(saved);
    }

    public List<ProductCategoryResponse> getAll() {
        return productMapper.toCategoryResponseList(categoryRepository.findAll());
    }

    public ProductCategoryResponse getById(UUID id) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", id));
        return productMapper.toCategoryResponse(category);
    }

    @Transactional
    public ProductCategoryResponse update(UUID id, ProductCategoryCreateRequest request) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", id));

        if (request.name() != null) {
            category.setName(request.name());
        }
        if (request.description() != null) {
            category.setDescription(request.description());
        }

        ProductCategory saved = categoryRepository.save(category);
        return productMapper.toCategoryResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", id));
        categoryRepository.delete(category);
    }
}
