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
import java.time.Month;
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
        // 1. Calculate Date Range (Start and End of the selected month)
        LocalDate start, end;
        try {
            int y = (year != null) ? year : LocalDate.now().getYear();
            String m = (monthStr != null) ? monthStr : LocalDate.now().getMonth().name();
            Month month = Month.valueOf(m.toUpperCase());
            
            start = LocalDate.of(y, month, 1);
            end = start.withDayOfMonth(start.lengthOfMonth());
        } catch (Exception e) {
            // Fallback to current month if parsing fails
            start = LocalDate.now().withDayOfMonth(1);
            end = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        }

        // 2. Fetch filtered sums using the "DateBetween" methods we created earlier
        BigDecimal totalIncome = incomeRepository
                .findByUserAndIncomeDateBetween(user, start, end)
                .stream().map(i -> i.getAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = expenseRepository
                .findByUserAndExpenseDateBetween(user, start, end)
                .stream().map(e -> e.getAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);

        // For Borrow/Lend, we sum items created/due in this month (or total overdue depending on your logic)
        // Here we filter by Date range to match the "Overview" dropdown context
        BigDecimal totalBorrowed = borrowingRepository
                .findByUserAndDueDateBetween(user, start, end)
                .stream().map(b -> b.getAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLent = lendingRepository
                .findByUserAndDueDateBetween(user, start, end)
                .stream().map(l -> l.getAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Overdue Calculations (These are usually cumulative, regardless of month selection, 
        // but we can keep them global or filter them. Typically "Overdue" implies "Right Now").
        BigDecimal totalOverdueBorrowed = borrowingRepository.sumOverdueByUserId(user.getId());
        BigDecimal totalOverdueLent = lendingRepository.sumOverdueByUserId(user.getId());

        // Handle nulls
        totalOverdueBorrowed = (totalOverdueBorrowed == null) ? BigDecimal.ZERO : totalOverdueBorrowed;
        totalOverdueLent = (totalOverdueLent == null) ? BigDecimal.ZERO : totalOverdueLent;

        BigDecimal balance = totalIncome.subtract(totalExpense);

        // 4. Construct Response Map
        Map<String, Double> stats = new HashMap<>();
        
        // Standard keys
        stats.put("totalIncome", totalIncome.doubleValue());
        stats.put("totalExpense", totalExpense.doubleValue());
        stats.put("totalExpenses", totalExpense.doubleValue()); // Add Plural key just in case frontend expects it
        
        stats.put("balance", balance.doubleValue());
        stats.put("availableBalance", balance.doubleValue()); // Add alias
        
        stats.put("totalBorrowed", totalBorrowed.doubleValue());
        stats.put("totalLent", totalLent.doubleValue());
        
        stats.put("overdueBorrowed", totalOverdueBorrowed.doubleValue());
        stats.put("overdueLent", totalOverdueLent.doubleValue());

        return stats;
    }
}