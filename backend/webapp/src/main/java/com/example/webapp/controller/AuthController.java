package com.example.webapp.controller;
import java.util.UUID;
import com.example.webapp.dto.AuthRequest;
import com.example.webapp.dto.AuthResponse;
import com.example.webapp.dto.RegisterRequest;
import com.example.webapp.entity.Buyer;
import com.example.webapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    private static final String ADMIN_CODE = "123"; // Генерация один раз при запуске

    @GetMapping("/admin-code")
    public ResponseEntity<String> getAdminCode() {
        return ResponseEntity.ok(ADMIN_CODE);
    }

    @PostMapping("/verify-admin")
    public ResponseEntity<Boolean> verifyAdmin(@RequestBody String code) {
        return ResponseEntity.ok(ADMIN_CODE.equals(code));
    }
    @PostMapping("/register")
    public ResponseEntity<Buyer> register(@RequestBody RegisterRequest request) {
        Buyer created = userService.register(request);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
}