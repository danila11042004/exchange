package com.example.webapp.dto;

import com.example.webapp.entity.Share;

import java.math.BigDecimal;

public class ShareResponse {
    private Long id;
    private String companyName;
    private String companyAddress;
    private BigDecimal price;
    private Integer quantityAvailable;
    private Integer controlStakeSize;

    public ShareResponse(Share share) {
        this.id = share.getId();
        this.companyName = share.getCompanyName();
        this.companyAddress = share.getCompanyAddress();
        this.price = share.getPrice();
        this.quantityAvailable = share.getQuantityAvailable();
        this.controlStakeSize = share.getControlStakeSize();
    }

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public Integer getControlStakeSize() {
        return controlStakeSize;
    }
}
