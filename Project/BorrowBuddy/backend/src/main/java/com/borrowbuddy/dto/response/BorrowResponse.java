package com.borrowbuddy.dto.response;
import com.borrowbuddy.entity.BorrowRequest;
import com.borrowbuddy.enums.BorrowStatus;
import java.math.BigDecimal;
import java.time.*;
public record BorrowResponse(Long id, Long itemId, String itemName, Long ownerId, String ownerName,
    Long borrowerId, String borrowerName, LocalDate startDate, LocalDate endDate,
    BigDecimal pricePerDay, BigDecimal totalPrice, BorrowStatus status, boolean overdue,
    Instant createdAt, Instant borrowedAt, Instant returnedAt) {
    public BorrowResponse(BorrowRequest r, LocalDate today) {
        this(r.getId(), r.getItem().getId(), r.getItem().getName(), r.getItem().getOwner().getId(),
            r.getItem().getOwner().getName(), r.getBorrower().getId(), r.getBorrower().getName(),
            r.getStartDate(), r.getEndDate(), r.getPricePerDay(), r.getTotalPrice(), r.getStatus(),
            (r.getStatus() == BorrowStatus.BORROWED || r.getStatus() == BorrowStatus.RETURN_REQUESTED)
                && today.isAfter(r.getEndDate()), r.getCreatedAt(), r.getBorrowedAt(), r.getReturnedAt());
    }
}
