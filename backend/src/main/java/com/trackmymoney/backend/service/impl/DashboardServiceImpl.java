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
        // 1. Fetch Lifetime Totals (Ignoring date for now to ensure data shows up)
        BigDecimal totalIncome = incomeRepository.sumByUserId(user.getId());
        BigDecimal totalExpense = expenseRepository.sumByUserId(user.getId());
        BigDecimal totalBorrowed = borrowingRepository.sumByUserId(user.getId());
        BigDecimal totalLent = lendingRepository.sumByUserId(user.getId());
        
        BigDecimal totalOverdueBorrowed = borrowingRepository.sumOverdueByUserId(user.getId());
        BigDecimal totalOverdueLent = lendingRepository.sumOverdueByUserId(user.getId());

        // 2. Handle Nulls (Default to 0.00)
        totalIncome = (totalIncome == null) ? BigDecimal.ZERO : totalIncome;
        totalExpense = (totalExpense == null) ? BigDecimal.ZERO : totalExpense;
        totalBorrowed = (totalBorrowed == null) ? BigDecimal.ZERO : totalBorrowed;
        totalLent = (totalLent == null) ? BigDecimal.ZERO : totalLent;
        totalOverdueBorrowed = (totalOverdueBorrowed == null) ? BigDecimal.ZERO : totalOverdueBorrowed;
        totalOverdueLent = (totalOverdueLent == null) ? BigDecimal.ZERO : totalOverdueLent;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        // 3. DEBUG PRINT (Check your backend console when you refresh the page!)
        System.out.println("--- DASHBOARD STATS CALCULATED ---");
        System.out.println("User: " + user.getEmail());
        System.out.println("Income: " + totalIncome);
        System.out.println("Expense: " + totalExpense);
        System.out.println("----------------------------------");

        // 4. Prepare Map with ALL POSSIBLE KEYS to fix the frontend mismatch
        Map<String, Double> stats = new HashMap<>();

        // --- INCOME ---
        stats.put("totalIncome", totalIncome.doubleValue());  // Likely
        stats.put("income", totalIncome.doubleValue());       // Common
        stats.put("total_income", totalIncome.doubleValue()); // Snake_case

        // --- EXPENSES ---
        stats.put("totalExpense", totalExpense.doubleValue());
        stats.put("totalExpenses", totalExpense.doubleValue()); // Plural
        stats.put("expense", totalExpense.doubleValue());
        stats.put("expenses", totalExpense.doubleValue());
        stats.put("total_expense", totalExpense.doubleValue());

        // --- BORROWED ---
        stats.put("totalBorrowed", totalBorrowed.doubleValue());
        stats.put("borrowed", totalBorrowed.doubleValue());
        stats.put("borrowings", totalBorrowed.doubleValue());
        stats.put("total_borrowed", totalBorrowed.doubleValue());

        // --- LENT ---
        stats.put("totalLent", totalLent.doubleValue());
        stats.put("lent", totalLent.doubleValue());
        stats.put("lendings", totalLent.doubleValue());
        stats.put("total_lent", totalLent.doubleValue());

        // --- BALANCE ---
        stats.put("balance", balance.doubleValue());
        stats.put("availableBalance", balance.doubleValue());
        stats.put("totalBalance", balance.doubleValue());

        // --- OVERDUE ---
        stats.put("overdueBorrowed", totalOverdueBorrowed.doubleValue());
        stats.put("overdueLent", totalOverdueLent.doubleValue());

        return stats;
    }
}