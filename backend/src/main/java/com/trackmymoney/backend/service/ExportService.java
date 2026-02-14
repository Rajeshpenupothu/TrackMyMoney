package com.trackmymoney.backend.service;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

public interface ExportService {
    ByteArrayInputStream exportDataToCsv(String exportType, LocalDate startDate, LocalDate endDate, Long userId);
    ByteArrayInputStream exportDataToPdf(String exportType, LocalDate startDate, LocalDate endDate, Long userId);
}
