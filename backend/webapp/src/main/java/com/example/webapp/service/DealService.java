package com.example.webapp.service;

import com.example.webapp.dto.DealRequest;
import com.example.webapp.entity.Buyer;
import com.example.webapp.entity.Deal;
import com.example.webapp.entity.Share;
import com.example.webapp.repository.BuyerRepository;
import com.example.webapp.repository.DealRepository;
import com.example.webapp.repository.ShareRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.example.webapp.dto.DealResponse;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final ShareRepository shareRepository;
    private final BuyerRepository buyerRepository;

    public DealService(DealRepository dealRepository,
                       ShareRepository shareRepository,
                       BuyerRepository buyerRepository) {
        this.dealRepository = dealRepository;
        this.shareRepository = shareRepository;
        this.buyerRepository = buyerRepository;
    }
    @Transactional(readOnly = true)
    public List<DealResponse> getAll() {
        List<Deal> deals = dealRepository.findAll();
        return deals.stream()
                .map(DealResponse::new)
                .toList();
    }

    public Deal getById(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));
    }
    public List<DealResponse> getAllForBuyer(Long buyerId) {
        List<Deal> deals = dealRepository.findByBuyerId(buyerId);
        return deals.stream().map(DealResponse::new).toList();
    }



    public void delete(Long id) {
        dealRepository.deleteById(id);
    }

    public Deal createFromDto(DealRequest dealRequest) {
        Deal deal = new Deal();
        deal.setQuantityPurchased(dealRequest.getQuantity());
        deal.setDealDate(LocalDateTime.now());

        Buyer buyer = buyerRepository.findById(dealRequest.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Покупатель не найден"));
        Share share = shareRepository.findById(dealRequest.getShareId())
                .orElseThrow(() -> new RuntimeException("Акция не найдена"));

        deal.setBuyer(buyer);
        deal.setShare(share);

        return dealRepository.save(deal);
    }

    public Deal updateFromDto(Long id, DealRequest dto) {
        Deal deal = getById(id);

        Share share = shareRepository.findById(dto.getShareId())
                .orElseThrow(() -> new RuntimeException("Share not found"));

        Buyer buyer = buyerRepository.findById(dto.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        deal.setShare(share);
        deal.setBuyer(buyer);
        deal.setQuantityPurchased(dto.getQuantity());
        deal.setDealDate(LocalDateTime.now());

        return dealRepository.save(deal);
    }
    public Deal createForUser(Long buyerId, DealRequest dealRequest) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Покупатель не найден"));

        Share share = shareRepository.findById(dealRequest.getShareId())
                .orElseThrow(() -> new RuntimeException("Акция не найдена"));

        Deal deal = new Deal();
        deal.setBuyer(buyer);
        deal.setShare(share);
        deal.setQuantityPurchased(dealRequest.getQuantity());
        deal.setDealDate(LocalDateTime.now());

        return dealRepository.save(deal);
    }
}
