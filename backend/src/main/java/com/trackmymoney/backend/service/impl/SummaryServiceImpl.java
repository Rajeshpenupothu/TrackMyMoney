package com.trackmymoney.backend.service.impl;

import com.trackmymoney.backend.dto.MonthlySummaryResponse;
import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.exception.UserNotFoundException;
import com.trackmymoney.backend.repository.BorrowingRepository;
import com.trackmymoney.backend.repository.ExpenseRepository;
import com.trackmymoney.backend.repository.IncomeRepository;
import com.trackmymoney.backend.repository.LendingRepository;
import com.trackmymoney.backend.repository.UserRepository;
import com.trackmymoney.backend.security.SecurityUtils;
import com.trackmymoney.backend.service.SummaryService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class SummaryServiceImpl implements SummaryService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BorrowingRepository borrowingRepository;
    private final LendingRepository lendingRepository;
    private final UserRepository userRepository;

    public SummaryServiceImpl(
            ExpenseRepository expenseRepository,
            IncomeRepository incomeRepository,
            BorrowingRepository borrowingRepository,
            LendingRepository lendingRepository,
            UserRepository userRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.borrowingRepository = borrowingRepository;
        this.lendingRepository = lendingRepository;
        this.userRepository = userRepository;
    }

    @Override
    public MonthlySummaryResponse getMonthlySummary(int year, int month) {

        User user = getLoggedInUser();

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        BigDecimal totalIncome = incomeRepository
                .findByUserAndIncomeDateBetween(user, start, end)
                .stream()
                .map(i -> i.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = expenseRepository
                .findByUserAndExpenseDateBetween(user, start, end)
                .stream()
                .map(e -> e.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fetch borrowings for this month
        BigDecimal borrowed = borrowingRepository
                .findByUser(user)
                .stream()
                .filter(b -> {
                    LocalDate borrowDate = b.getBorrowDate();
                    return borrowDate != null && !borrowDate.isBefore(start) && !borrowDate.isAfter(end);
                })
                .map(b -> b.getAmount() != null ? b.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fetch lendings for this month
        BigDecimal lent = lendingRepository
                .findByUser(user)
                .stream()
                .filter(l -> {
                    LocalDate lendDate = l.getLendDate();
                    return lendDate != null && !lendDate.isBefore(start) && !lendDate.isAfter(end);
                })
                // FIX: l.getAmount() is already BigDecimal. No need to cast to Double.
                .map(l -> l.getAmount() != null ? l.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate unsettled amount
        BigDecimal unsettledBorrowed = borrowingRepository
                .findByUserAndSettledFalse(user)
                .stream()
                .map(b -> b.getAmount() != null ? b.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal unsettledLent = lendingRepository
                .findByUser(user)
                .stream()
                .filter(l -> !l.isSettled())
                // FIX: l.getAmount() is already BigDecimal.
                .map(l -> l.getAmount() != null ? l.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal unsettled = unsettledBorrowed.add(unsettledLent);

        BigDecimal savings = totalIncome.subtract(totalExpense);

        return new MonthlySummaryResponse(
                totalIncome,
                totalExpense,
                savings,
                borrowed,
                lent,
                unsettled
        );
    }

    private User getLoggedInUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }
}