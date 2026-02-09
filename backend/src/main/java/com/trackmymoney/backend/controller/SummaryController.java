package com.trackmymoney.backend.controller;

import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.exception.UserNotFoundException;
import com.trackmymoney.backend.repository.UserRepository;
import com.trackmymoney.backend.security.SecurityUtils;
import com.trackmymoney.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Double>> getSummary() {
        // 1. Get the logged-in user's email
        String email = SecurityUtils.getCurrentUserEmail();

        // 2. Fetch the User entity
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // 3. Call the correct method: getDashboardStats(User)
        // (Old code was calling getSummary(id), which didn't exist)
        Map<String, Double> stats = dashboardService.getDashboardStats(user);

        return ResponseEntity.ok(stats);
    }
}