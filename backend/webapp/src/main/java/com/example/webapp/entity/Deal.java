package com.example.webapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantityPurchased;

    private LocalDateTime dealDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "share_id")
    private Share share;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantityPurchased() {
        return quantityPurchased;
    }

    public void setQuantityPurchased(Integer quantityPurchased) {
        this.quantityPurchased = quantityPurchased;
    }

    public LocalDateTime getDealDate() {
        return dealDate;
    }

    public void setDealDate(LocalDateTime dealDate) {
        this.dealDate = dealDate;
    }

    public Share getShare() {
        return share;
    }

    public void setShare(Share share) {
        this.share = share;
    }

    public Buyer getBuyer() {
        return buyer;
    }

    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
    }
}