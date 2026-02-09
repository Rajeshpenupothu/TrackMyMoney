package com.trackmymoney.backend.service.impl;

import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.repository.BorrowingRepository;
import com.trackmymoney.backend.repository.ExpenseRepository;
import com.trackmymoney.backend.repository.IncomeRepository;
import com.trackmymoney.backend.repository.LendingRepository;
import com.trackmymoney.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired private IncomeRepository incomeRepository;
    @Autowired private ExpenseRepository expenseRepository;
    @Autowired private BorrowingRepository borrowingRepository;
    @Autowired private LendingRepository lendingRepository;

    @Override
    public Map<String, Double> getDashboardStats(User user) {
        // Fetch sums as BigDecimal (handling nulls if DB returns null for empty tables)
        BigDecimal totalIncome = incomeRepository.sumByUserId(user.getId());
        BigDecimal totalExpense = expenseRepository.sumByUserId(user.getId());
        BigDecimal totalBorrowed = borrowingRepository.sumByUserId(user.getId());
        BigDecimal totalLent = lendingRepository.sumByUserId(user.getId());
        
        // Optional: If you have overdue methods
        BigDecimal totalOverdueBorrowed = borrowingRepository.sumOverdueByUserId(user.getId());
        BigDecimal totalOverdueLent = lendingRepository.sumOverdueByUserId(user.getId());

        // Null checks: If no records exist, BigDecimal will be null. Convert to ZERO.
        totalIncome = (totalIncome == null) ? BigDecimal.ZERO : totalIncome;
        totalExpense = (totalExpense == null) ? BigDecimal.ZERO : totalExpense;
        totalBorrowed = (totalBorrowed == null) ? BigDecimal.ZERO : totalBorrowed;
        totalLent = (totalLent == null) ? BigDecimal.ZERO : totalLent;
        totalOverdueBorrowed = (totalOverdueBorrowed == null) ? BigDecimal.ZERO : totalOverdueBorrowed;
        totalOverdueLent = (totalOverdueLent == null) ? BigDecimal.ZERO : totalOverdueLent;

        // Calculate Balance
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Prepare Response Map (Convert back to Double for frontend compatibility)
        Map<String, Double> stats = new HashMap<>();
        stats.put("totalIncome", totalIncome.doubleValue());
        stats.put("totalExpense", totalExpense.doubleValue());
        stats.put("balance", balance.doubleValue());
        stats.put("totalBorrowed", totalBorrowed.doubleValue());
        stats.put("totalLent", totalLent.doubleValue());
        
        // Add these only if your frontend expects them
        stats.put("overdueBorrowed", totalOverdueBorrowed.doubleValue());
        stats.put("overdueLent", totalOverdueLent.doubleValue());

        return stats;
    }
}