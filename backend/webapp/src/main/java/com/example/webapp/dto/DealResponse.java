package com.example.webapp.dto;

import com.example.webapp.entity.Deal;
import com.example.webapp.entity.Buyer;
import com.example.webapp.entity.Deal;
import com.example.webapp.entity.Share;

import java.time.LocalDateTime;
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

        if (deal.getBuyer() != null) {
            Buyer buyer = deal.getBuyer();
            this.buyerId = buyer.getId();
            this.buyerFullName = buyer.getFullName();
        } else {
            this.buyerId = null;
            this.buyerFullName = "неизвестно";
        }

        if (deal.getShare() != null) {
            Share share = deal.getShare();
            this.shareId = share.getId();
            this.shareCompanyName = share.getCompanyName();
        } else {
            this.shareId = null;
            this.shareCompanyName = "неизвестно";
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
