package com.example.webapp.controller;

import com.example.webapp.dto.BuyerRequest;
import com.example.webapp.dto.BuyerResponse;
import com.example.webapp.entity.Buyer;
import com.example.webapp.service.BuyerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buyers")
public class BuyerController {

    private final BuyerService buyerService;

    public BuyerController(BuyerService buyerService) {
        this.buyerService = buyerService;
    }

    @GetMapping
    public List<BuyerResponse> getAllBuyers() {
        return buyerService.getAll().stream()
                .map(BuyerResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BuyerResponse getBuyerById(@PathVariable Long id) {
        Buyer buyer = buyerService.getById(id);
        return new BuyerResponse(buyer);
    }

    @PostMapping
    public BuyerResponse createBuyer(@RequestBody BuyerRequest buyerRequest) {
        Buyer buyer = buyerService.createFromDto(buyerRequest);
        return new BuyerResponse(buyer);
    }

    @PutMapping("/{id}")
    public BuyerResponse updateBuyer(@PathVariable Long id, @RequestBody BuyerRequest buyerRequest) {
        Buyer buyer = buyerService.updateFromDto(id, buyerRequest);
        return new BuyerResponse(buyer);
    }

    @DeleteMapping("/{id}")
    public void deleteBuyer(@PathVariable Long id) {
        buyerService.delete(id);
    }
}
