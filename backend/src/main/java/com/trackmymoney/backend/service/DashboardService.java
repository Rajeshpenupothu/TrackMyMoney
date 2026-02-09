package com.trackmymoney.backend.service;

import com.trackmymoney.backend.dto.DashboardSummaryDTO;

public interface DashboardService {
    DashboardSummaryDTO getSummary(Long userId);
}
