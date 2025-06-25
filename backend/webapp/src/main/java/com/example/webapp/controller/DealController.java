package com.example.webapp.controller;

import com.example.webapp.dto.DealRequest;
import com.example.webapp.dto.DealResponse;
import com.example.webapp.entity.Deal;
import com.example.webapp.service.DealService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    public List<DealResponse> getAllDeals() {
        return dealService.getAll();
    }


    @GetMapping("/by-user/{userId}")
    public List<DealResponse> getDealsByUserId(@PathVariable Long userId) {
        return dealService.getAllForBuyer(userId);
    }

    @GetMapping("/my")
    public List<DealResponse> getDealsForCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        return dealService.getAllForBuyer(userId);
    }

    @GetMapping("/{id}")
    public DealResponse getDealById(@PathVariable Long id) {
        Deal deal = dealService.getById(id);
        return new DealResponse(deal);
    }

    @PostMapping
    public DealResponse createDeal(
            @RequestBody DealRequest dealRequest,
            @RequestHeader("X-User-Id") Long userId
    ) {
        Deal deal = dealService.createForUser(userId, dealRequest);
        return new DealResponse(deal);
    }

    @PutMapping("/{id}")
    public DealResponse updateDeal(@PathVariable Long id, @RequestBody DealRequest dealRequest) {
        Deal deal = dealService.updateFromDto(id, dealRequest);
        return new DealResponse(deal);
    }

    @DeleteMapping("/{id}")
    public void deleteDeal(@PathVariable Long id) {
        dealService.delete(id);
    }
}

