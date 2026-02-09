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
import java.time.LocalDate;
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
        
        // 1. Calculate Date for Overdue check (Today)
        // This fixes the timezone issue by using the server's current date
        LocalDate today = LocalDate.now();

        // 2. Fetch Lifetime Totals
        BigDecimal totalIncome = incomeRepository.sumByUserId(user.getId());
        BigDecimal totalExpense = expenseRepository.sumByUserId(user.getId());
        BigDecimal totalBorrowed = borrowingRepository.sumByUserId(user.getId());
        BigDecimal totalLent = lendingRepository.sumByUserId(user.getId());
        
        // 3. Fetch Overdue Totals using the new repository method that accepts 'today'
        BigDecimal totalOverdueBorrowed = borrowingRepository.sumOverdueByUserId(user.getId(), today);
        BigDecimal totalOverdueLent = lendingRepository.sumOverdueByUserId(user.getId(), today);

        // 4. Handle Nulls (Default to 0.00 if no records found)
        totalIncome = (totalIncome == null) ? BigDecimal.ZERO : totalIncome;
        totalExpense = (totalExpense == null) ? BigDecimal.ZERO : totalExpense;
        totalBorrowed = (totalBorrowed == null) ? BigDecimal.ZERO : totalBorrowed;
        totalLent = (totalLent == null) ? BigDecimal.ZERO : totalLent;
        totalOverdueBorrowed = (totalOverdueBorrowed == null) ? BigDecimal.ZERO : totalOverdueBorrowed;
        totalOverdueLent = (totalOverdueLent == null) ? BigDecimal.ZERO : totalOverdueLent;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        // 5. Prepare Response Map with ALL ALIASES to ensure frontend finds the data
        Map<String, Double> stats = new HashMap<>();

        // Income
        stats.put("totalIncome", totalIncome.doubleValue());
        stats.put("income", totalIncome.doubleValue());
        stats.put("total_income", totalIncome.doubleValue());

        // Expense
        stats.put("totalExpense", totalExpense.doubleValue());
        stats.put("totalExpenses", totalExpense.doubleValue());
        stats.put("expense", totalExpense.doubleValue());
        stats.put("expenses", totalExpense.doubleValue());

        // Borrowing
        stats.put("totalBorrowed", totalBorrowed.doubleValue());
        stats.put("borrowed", totalBorrowed.doubleValue());
        stats.put("borrowings", totalBorrowed.doubleValue());

        // Lending
        stats.put("totalLent", totalLent.doubleValue());
        stats.put("lent", totalLent.doubleValue());
        stats.put("lendings", totalLent.doubleValue());

        // Balance
        stats.put("balance", balance.doubleValue());
        stats.put("availableBalance", balance.doubleValue());
        stats.put("totalBalance", balance.doubleValue());

        // --- OVERDUE (Sending multiple keys to catch frontend mismatch) ---
        stats.put("overdueBorrowed", totalOverdueBorrowed.doubleValue());
        stats.put("totalOverdueBorrowed", totalOverdueBorrowed.doubleValue());
        stats.put("overdue_borrowed", totalOverdueBorrowed.doubleValue());

        stats.put("overdueLent", totalOverdueLent.doubleValue());
        stats.put("totalOverdueLent", totalOverdueLent.doubleValue());
        stats.put("overdue_lent", totalOverdueLent.doubleValue());

        return stats;
    }
}