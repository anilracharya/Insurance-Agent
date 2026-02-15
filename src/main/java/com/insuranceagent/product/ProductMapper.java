package com.insuranceagent.product;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductCategoryResponse toCategoryResponse(ProductCategory category);

    List<ProductCategoryResponse> toCategoryResponseList(List<ProductCategory> categories);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toProductResponseList(List<Product> products);

    @Mapping(source = "product.id", target = "productId")
    ProductDocumentResponse toDocumentResponse(ProductDocument document);

    List<ProductDocumentResponse> toDocumentResponseList(List<ProductDocument> documents);
}
