package com.example.webapp.dto;

import com.example.webapp.entity.Deal;

import java.time.LocalDateTime;

public class DealResponse {
    private Long id;
    private Integer quantityPurchased;
    private LocalDateTime dealDate;

    private Long buyerId;
    private String buyerFullName;

    private Long shareId;
    private String shareCompanyName;

    public DealResponse(Deal deal) {
        this.id = deal.getId();
        this.quantityPurchased = deal.getQuantityPurchased();
        this.dealDate = deal.getDealDate();

        System.out.println(">>> Buyer: " + deal.getBuyer());
        System.out.println(">>> Share: " + deal.getShare());

        if (deal.getBuyer() != null) {
            this.buyerId = deal.getBuyer().getId();
            this.buyerFullName = deal.getBuyer().getFullName();
        }

        if (deal.getShare() != null) {
            this.shareId = deal.getShare().getId();
            this.shareCompanyName = deal.getShare().getCompanyName();
        }
    }

    public Long getId() {
        return id;
    }

    public Integer getQuantityPurchased() {
        return quantityPurchased;
    }

    public LocalDateTime getDealDate() {
        return dealDate;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public String getBuyerFullName() {
        return buyerFullName;
    }

    public Long getShareId() {
        return shareId;
    }

    public String getShareCompanyName() {
        return shareCompanyName;
    }
}
