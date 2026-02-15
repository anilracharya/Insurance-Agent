package com.insuranceagent.product;

import com.insuranceagent.common.BaseEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(length = 100)
    private String premiumRange;

    @Column(length = 100)
    private String coverageAmount;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "product")
    private List<ProductDocument> documents = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public String getPremiumRange() {
        return premiumRange;
    }

    public void setPremiumRange(String premiumRange) {
        this.premiumRange = premiumRange;
    }

    public String getCoverageAmount() {
        return coverageAmount;
    }

    public void setCoverageAmount(String coverageAmount) {
        this.coverageAmount = coverageAmount;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<ProductDocument> getDocuments() {
        return documents;
    }

    public void setDocuments(List<ProductDocument> documents) {
        this.documents = documents;
    }
}
