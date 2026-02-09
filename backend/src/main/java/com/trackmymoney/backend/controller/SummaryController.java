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
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<Map<String, Double>> getSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String month
    ) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Pass the year and month to the service (handles filtering)
        Map<String, Double> stats = dashboardService.getDashboardStats(user, year, month);

        return ResponseEntity.ok(stats);
    }
}