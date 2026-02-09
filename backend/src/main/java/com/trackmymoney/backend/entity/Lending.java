package com.trackmymoney.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "lendings")
public class Lending {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // CHANGED: Double -> BigDecimal to match other entities
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private LocalDate lendDate;
    private LocalDate dueDate;

    @Column(nullable = false)
    private boolean settled = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getAmount() { return amount; } // Updated return type
    public LocalDate getLendDate() { return lendDate; }
    public LocalDate getDueDate() { return dueDate; }
    public boolean isSettled() { return settled; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAmount(BigDecimal amount) { this.amount = amount; } // Updated parameter type
    public void setLendDate(LocalDate lendDate) { this.lendDate = lendDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setSettled(boolean settled) { this.settled = settled; }
    public void setUser(User user) { this.user = user; }
}