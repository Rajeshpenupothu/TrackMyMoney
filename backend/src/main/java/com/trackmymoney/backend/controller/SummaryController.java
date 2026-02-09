package com.trackmymoney.backend.controller;

import com.trackmymoney.backend.dto.DashboardSummaryDTO;
import com.trackmymoney.backend.service.DashboardService;
import com.trackmymoney.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary") // Matching your frontend call
public class SummaryController {

    @Autowired private DashboardService dashboardService;
    @Autowired private UserService userService;

    @GetMapping("/monthly")
    public ResponseEntity<?> getSummary() {
        try {
            // 1. Extract email from JWT token in Security Context
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            
            // 2. Fetch the Long ID using the email
            Long userId = userService.findIdByEmail(email);
            
            // 3. Get the summary totals
            DashboardSummaryDTO dashboard = dashboardService.getSummary(userId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            // Log the error so we can see what went wrong in server logs
            System.err.println("Error in /api/summary/monthly: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                "{\"error\": \"" + e.getMessage() + "\"}"
            );
        }
    }
}

