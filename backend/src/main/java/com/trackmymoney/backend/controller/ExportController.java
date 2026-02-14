package com.trackmymoney.backend.controller;

import com.trackmymoney.backend.entity.User;
import com.trackmymoney.backend.repository.UserRepository;
import com.trackmymoney.backend.security.SecurityUtils;
import com.trackmymoney.backend.service.ExportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;
    private final UserRepository userRepository;

    public ExportController(ExportService exportService, UserRepository userRepository) {
        this.exportService = exportService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{type}/csv")
    public ResponseEntity<Resource> exportCsv(
            @PathVariable String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        User user = getLoggedInUser();
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusYears(1);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

        String filename = type + "_report_" + LocalDate.now() + ".csv";
        ByteArrayInputStream data = exportService.exportDataToCsv(type, start, end, user.getId());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(new InputStreamResource(data));
    }

    @GetMapping("/{type}/pdf")
    public ResponseEntity<Resource> exportPdf(
            @PathVariable String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        User user = getLoggedInUser();
        LocalDate start = (startDate != null) ? startDate : LocalDate.now().minusYears(1);
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();

        String filename = type + "_report_" + LocalDate.now() + ".pdf";
        ByteArrayInputStream data = exportService.exportDataToPdf(type, start, end, user.getId());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(data));
    }

    private User getLoggedInUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
