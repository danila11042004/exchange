package com.example.webapp.service;

import com.example.webapp.dto.ShareRequest;
import com.example.webapp.entity.Share;
import com.example.webapp.repository.ShareRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShareService {

    private final ShareRepository shareRepository;

    public ShareService(ShareRepository shareRepository) {
        this.shareRepository = shareRepository;
    }

    public List<Share> getAll() {
        return shareRepository.findAll();
    }

    public Share getById(Long id) {
        return shareRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Share not found"));
    }

    public Share create(Share share) {
        return shareRepository.save(share);
    }

    public Share update(Long id, Share updatedShare) {
        Share existing = getById(id);
        existing.setCompanyName(updatedShare.getCompanyName());
        existing.setCompanyAddress(updatedShare.getCompanyAddress());
        existing.setPrice(updatedShare.getPrice());
        existing.setQuantityAvailable(updatedShare.getQuantityAvailable());
        existing.setControlStakeSize(updatedShare.getControlStakeSize());
        return shareRepository.save(existing);
    }

    public void delete(Long id) {
        shareRepository.deleteById(id);
    }

    public Share createFromDto(ShareRequest dto) {
        Share share = new Share();
        share.setCompanyName(dto.getCompanyName());
        share.setCompanyAddress(dto.getCompanyAddress());
        share.setPrice(dto.getPrice());
        share.setQuantityAvailable(dto.getQuantityAvailable());
        share.setControlStakeSize(dto.getControlStakeSize());
        return shareRepository.save(share);
    }

    public Share updateFromDto(Long id, ShareRequest dto) {
        Share share = getById(id);
        share.setCompanyName(dto.getCompanyName());
        share.setCompanyAddress(dto.getCompanyAddress());
        share.setPrice(dto.getPrice());
        share.setQuantityAvailable(dto.getQuantityAvailable());
        share.setControlStakeSize(dto.getControlStakeSize());
        return shareRepository.save(share);
    }
}
