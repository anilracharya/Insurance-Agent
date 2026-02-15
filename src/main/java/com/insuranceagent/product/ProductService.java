package com.insuranceagent.product;

import com.insuranceagent.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductDocumentRepository documentRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository,
                          ProductCategoryRepository categoryRepository,
                          ProductDocumentRepository documentRepository,
                          ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.documentRepository = documentRepository;
        this.productMapper = productMapper;
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        ProductCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", request.categoryId()));

        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setCategory(category);
        product.setPremiumRange(request.premiumRange());
        product.setCoverageAmount(request.coverageAmount());
        product.setFeatures(request.features());

        Product saved = productRepository.save(product);
        return productMapper.toProductResponse(saved);
    }

    public List<ProductResponse> getAllProducts() {
        return productMapper.toProductResponseList(productRepository.findAll());
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return productMapper.toProductResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        if (request.name() != null) {
            product.setName(request.name());
        }
        if (request.description() != null) {
            product.setDescription(request.description());
        }
        if (request.categoryId() != null) {
            ProductCategory category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", request.categoryId()));
            product.setCategory(category);
        }
        if (request.premiumRange() != null) {
            product.setPremiumRange(request.premiumRange());
        }
        if (request.coverageAmount() != null) {
            product.setCoverageAmount(request.coverageAmount());
        }
        if (request.features() != null) {
            product.setFeatures(request.features());
        }
        if (request.active() != null) {
            product.setActive(request.active());
        }

        Product saved = productRepository.save(product);
        return productMapper.toProductResponse(saved);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        productRepository.delete(product);
    }

    public List<ProductResponse> getProductsByCategory(UUID categoryId) {
        return productMapper.toProductResponseList(productRepository.findByCategoryId(categoryId));
    }

    @Transactional
    public ProductDocumentResponse addDocument(UUID productId, ProductDocumentCreateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        ProductDocument document = new ProductDocument();
        document.setProduct(product);
        document.setFileName(request.fileName());
        document.setFileUrl(request.fileUrl());
        document.setDocumentType(request.documentType());

        ProductDocument saved = documentRepository.save(document);
        return productMapper.toDocumentResponse(saved);
    }

    public List<ProductDocumentResponse> getDocuments(UUID productId) {
        return productMapper.toDocumentResponseList(documentRepository.findByProductId(productId));
    }
}
