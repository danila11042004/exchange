package com.example.webapp.dto;
import java.math.BigDecimal;
public class ShareRequest {

    private String companyName;
    private String companyAddress;
    private BigDecimal price;
    private Integer quantityAvailable;
    private Integer controlStakeSize;

    public ShareRequest() {
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public Integer getControlStakeSize() {
        return controlStakeSize;
    }

    public void setControlStakeSize(Integer controlStakeSize) {
        this.controlStakeSize = controlStakeSize;
    }
}
