package com.trackmymoney.backend.service;

import com.trackmymoney.backend.entity.User;
import java.util.Map;

public interface DashboardService {
    Map<String, Double> getDashboardStats(User user);
}