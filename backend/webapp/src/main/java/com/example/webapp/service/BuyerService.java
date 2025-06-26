package com.example.webapp.service;

import com.example.webapp.dto.BuyerRequest;
import com.example.webapp.entity.Buyer;
import com.example.webapp.repository.BuyerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;

    public BuyerService(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
    }

    public List<Buyer> getAll() {
        return buyerRepository.findAll();
    }

    public Buyer getById(Long id) {
        return buyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
    }

    public void delete(Long id) {
        buyerRepository.deleteById(id);
    }

    public Buyer createFromDto(BuyerRequest dto) {
        Buyer buyer = new Buyer();
        buyer.setFullName(dto.getFullName());
        buyer.setAddress(dto.getAddress());
        buyer.setPhone(dto.getPhone());
        buyer.setEmail(dto.getEmail());
        return buyerRepository.save(buyer);
    }

    public Buyer updateFromDto(Long id, BuyerRequest dto) {
        Buyer buyer = getById(id);
        buyer.setFullName(dto.getFullName());
        buyer.setAddress(dto.getAddress());
        buyer.setPhone(dto.getPhone());
        buyer.setEmail(dto.getEmail());
        return buyerRepository.save(buyer);
    }
}
