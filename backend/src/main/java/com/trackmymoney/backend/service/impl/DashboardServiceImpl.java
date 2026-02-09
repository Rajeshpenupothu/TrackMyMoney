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
    public Map<String, Double> getDashboardStats(User user, Integer year, String monthStr) {
        // NOTE: We are ignoring 'year' and 'monthStr' to show LIFETIME totals.
        // This ensures data always appears on the dashboard.

        // 1. Fetch Lifetime Totals
        BigDecimal totalIncome = incomeRepository.sumByUserId(user.getId());
        BigDecimal totalExpense = expenseRepository.sumByUserId(user.getId());
        BigDecimal totalBorrowed = borrowingRepository.sumByUserId(user.getId());
        BigDecimal totalLent = lendingRepository.sumByUserId(user.getId());

        // 2. Fetch Overdue Totals
        BigDecimal totalOverdueBorrowed = borrowingRepository.sumOverdueByUserId(user.getId());
        BigDecimal totalOverdueLent = lendingRepository.sumOverdueByUserId(user.getId());

        // 3. Handle Nulls (convert null -> 0.0)
        totalIncome = (totalIncome == null) ? BigDecimal.ZERO : totalIncome;
        totalExpense = (totalExpense == null) ? BigDecimal.ZERO : totalExpense;
        totalBorrowed = (totalBorrowed == null) ? BigDecimal.ZERO : totalBorrowed;
        totalLent = (totalLent == null) ? BigDecimal.ZERO : totalLent;
        totalOverdueBorrowed = (totalOverdueBorrowed == null) ? BigDecimal.ZERO : totalOverdueBorrowed;
        totalOverdueLent = (totalOverdueLent == null) ? BigDecimal.ZERO : totalOverdueLent;

        // 4. Calculate Balance
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // 5. Prepare Map with ALL possible keys frontend might use
        Map<String, Double> stats = new HashMap<>();
        
        // Income
        stats.put("totalIncome", totalIncome.doubleValue());
        
        // Expenses (sending both singular and plural keys to be safe)
        stats.put("totalExpense", totalExpense.doubleValue());
        stats.put("totalExpenses", totalExpense.doubleValue()); 

        // Borrowing
        stats.put("totalBorrowed", totalBorrowed.doubleValue());
        stats.put("overdueBorrowed", totalOverdueBorrowed.doubleValue());

        // Lending
        stats.put("totalLent", totalLent.doubleValue());
        stats.put("overdueLent", totalOverdueLent.doubleValue());

        // Balance (sending multiple alias keys)
        stats.put("balance", balance.doubleValue());
        stats.put("availableBalance", balance.doubleValue());
        stats.put("totalBalance", balance.doubleValue());

        return stats;
    }
}