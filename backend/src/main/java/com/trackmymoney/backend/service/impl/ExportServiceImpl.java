package com.trackmymoney.backend.service.impl;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.opencsv.CSVWriter;
import com.trackmymoney.backend.entity.Expense;
import com.trackmymoney.backend.entity.Income;
import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.repository.ExpenseRepository;
import com.trackmymoney.backend.repository.IncomeRepository;
import com.trackmymoney.backend.repository.UserRepository;
import com.trackmymoney.backend.service.ExportService;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExportServiceImpl implements ExportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public ExportServiceImpl(ExpenseRepository expenseRepository, 
                             IncomeRepository incomeRepository,
                             UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ByteArrayInputStream exportDataToCsv(String exportType, LocalDate startDate, LocalDate endDate, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {
            if ("expenses".equalsIgnoreCase(exportType)) {
                List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetween(user, startDate, endDate);
                writer.writeNext(new String[]{"ID", "Date", "Category", "Description", "Amount"});
                for (Expense expense : expenses) {
                    writer.writeNext(new String[]{
                        String.valueOf(expense.getId()),
                        expense.getExpenseDate().toString(),
                        expense.getCategory(),
                        expense.getDescription(),
                        expense.getAmount().toString()
                    });
                }
            } else if ("incomes".equalsIgnoreCase(exportType)) {
                List<Income> incomes = incomeRepository.findByUserAndIncomeDateBetween(user, startDate, endDate);
                writer.writeNext(new String[]{"ID", "Date", "Source", "Description", "Amount"});
                for (Income income : incomes) {
                    writer.writeNext(new String[]{
                        String.valueOf(income.getId()),
                        income.getIncomeDate().toString(),
                        income.getSource(),
                        income.getDescription(),
                        income.getAmount().toString()
                    });
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error exporting CSV: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportDataToPdf(String exportType, LocalDate startDate, LocalDate endDate, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph(exportType.toUpperCase() + " Report")
                    .setBold().setFontSize(18).setTextAlignment(TextAlignment.CENTER));
            
            document.add(new Paragraph("From: " + startDate + " To: " + endDate)
                    .setTextAlignment(TextAlignment.CENTER).setMarginBottom(20));

            float[] pointColumnWidths = {50F, 100F, 100F, 150F, 100F};
            Table table = new Table(pointColumnWidths);

            // Headers
            if ("expenses".equalsIgnoreCase(exportType)) {
                addTableHeader(table, "ID", "Date", "Category", "Description", "Amount");
                List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetween(user, startDate, endDate);
                for (Expense expense : expenses) {
                    table.addCell(String.valueOf(expense.getId()));
                    table.addCell(expense.getExpenseDate().toString());
                    table.addCell(expense.getCategory());
                    table.addCell(expense.getDescription() != null ? expense.getDescription() : "");
                    table.addCell("$" + expense.getAmount().toString());
                }
            } else if ("incomes".equalsIgnoreCase(exportType)) {
                addTableHeader(table, "ID", "Date", "Source", "Description", "Amount");
                List<Income> incomes = incomeRepository.findByUserAndIncomeDateBetween(user, startDate, endDate);
                for (Income income : incomes) {
                    table.addCell(String.valueOf(income.getId()));
                    table.addCell(income.getIncomeDate().toString());
                    table.addCell(income.getSource());
                    table.addCell(income.getDescription() != null ? income.getDescription() : "");
                    table.addCell("$" + income.getAmount().toString());
                }
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error exporting PDF: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableHeader(Table table, String... headers) {
        for (String header : headers) {
            Cell cell = new Cell();
            cell.add(new Paragraph(header));
            cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
            cell.setBold();
            table.addHeaderCell(cell);
        }
    }
}
