package com.insuranceagent.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductDocumentRepository extends JpaRepository<ProductDocument, UUID> {

    List<ProductDocument> findByProductId(UUID productId);
}
