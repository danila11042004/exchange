package com.example.webapp.controller;

import com.example.webapp.dto.ShareRequest;
import com.example.webapp.dto.ShareResponse;
import com.example.webapp.entity.Share;
import com.example.webapp.service.ShareService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shares")
public class ShareController {

    private final ShareService shareService;

    public ShareController(ShareService shareService) {
        this.shareService = shareService;
    }

    @GetMapping
    public List<ShareResponse> getAllShares() {
        return shareService.getAll().stream()
                .map(ShareResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ShareResponse getShareById(@PathVariable Long id) {
        Share share = shareService.getById(id);
        return new ShareResponse(share);
    }

    @PostMapping
    public ShareResponse createShare(@RequestBody ShareRequest shareRequest) {
        Share share = shareService.createFromDto(shareRequest);
        return new ShareResponse(share);
    }

    @PutMapping("/{id}")
    public ShareResponse updateShare(@PathVariable Long id, @RequestBody ShareRequest shareRequest) {
        Share share = shareService.updateFromDto(id, shareRequest);
        return new ShareResponse(share);
    }

    @DeleteMapping("/{id}")
    public void deleteShare(@PathVariable Long id) {
        shareService.delete(id);
    }
}
