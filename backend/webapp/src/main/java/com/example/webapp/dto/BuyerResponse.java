package com.example.webapp.dto;

import com.example.webapp.entity.Buyer;

public class BuyerResponse {
    private Long id;
    private String fullName;
    private String address;
    private String phone;
    private String email;

    public BuyerResponse(Buyer buyer) {
        this.id = buyer.getId();
        this.fullName = buyer.getFullName();
        this.address = buyer.getAddress();
        this.phone = buyer.getPhone();
        this.email = buyer.getEmail();
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
