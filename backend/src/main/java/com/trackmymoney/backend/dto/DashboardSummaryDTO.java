package com.trackmymoney.backend.dto;

public class DashboardSummaryDTO {
    private Double income;
    private Double expense;
    private Double borrowed;
    private Double lent;

    public DashboardSummaryDTO(Double income, Double expense, Double borrowed, Double lent) {
        this.income = income;
        this.expense = expense;
        this.borrowed = borrowed;
        this.lent = lent;
    }

    public Double getIncome() { 
        return income; 
    }

    public Double getExpense() { 
        return expense; 
    }

    public Double getBorrowed() { 
        return borrowed; 
    }

    public Double getLent() { 
        return lent; 
    }

    public void setIncome(Double income) { 
        this.income = income; 
    }

    public void setExpense(Double expense) { 
        this.expense = expense; 
    }

    public void setBorrowed(Double borrowed) { 
        this.borrowed = borrowed; 
    }

    public void setLent(Double lent) { 
        this.lent = lent; 
    }
}
