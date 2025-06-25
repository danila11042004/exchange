package com.example.webapp.service;

import java.util.NoSuchElementException;
import com.example.webapp.dto.AuthRequest;
import com.example.webapp.dto.AuthResponse;
import com.example.webapp.dto.RegisterRequest;
import com.example.webapp.entity.Buyer;
import com.example.webapp.repository.BuyerRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final BuyerRepository buyerRepository;

    public UserService(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
    }

    public Buyer register(RegisterRequest request) {
        Buyer buyer = new Buyer();
        buyer.setFullName(request.getFullName());
        buyer.setEmail(request.getEmail());
        buyer.setPhone(request.getPhone());
        buyer.setAddress(request.getAddress());
        buyer.setPassword(request.getPassword());
        return buyerRepository.save(buyer);
    }

    public AuthResponse login(AuthRequest request) {
        Buyer buyer = buyerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!buyer.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        return new AuthResponse(buyer.getId(), buyer.getFullName());
    }
}