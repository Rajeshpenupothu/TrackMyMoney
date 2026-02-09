package com.trackmymoney.backend.repository;

import com.trackmymoney.backend.entity.Expense;
import com.trackmymoney.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

    List<Expense> findByUserAndExpenseDateBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );

    Optional<Expense> findByIdAndUser(Long id, User user);
    
    // This allows the DB to sum everything in one go instead of fetching all records
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    Double sumByUserId(@Param("userId") Long userId);
}
