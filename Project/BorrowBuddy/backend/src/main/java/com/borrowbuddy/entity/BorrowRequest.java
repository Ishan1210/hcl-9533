package com.borrowbuddy.entity;
import com.borrowbuddy.enums.BorrowStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity
@Table(name="borrow_requests")
public class BorrowRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="item_id", nullable=false)
    private Item item;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="borrower_id", nullable=false)
    private User borrower;
    @Column(nullable=false)
    private LocalDate startDate;
    @Column(nullable=false)
    private LocalDate endDate;
    @Column(nullable=false, precision=10, scale=2)
    private BigDecimal pricePerDay;
    @Column(nullable=false, precision=12, scale=2)
    private BigDecimal totalPrice;
    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private BorrowStatus status = BorrowStatus.PENDING;
    @Column(nullable=false, updatable=false)
    private Instant createdAt = Instant.now();
    
    private Instant borrowedAt;
    
    private Instant returnedAt;
    public Long getId() { return id; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public User getBorrower() { return borrower; }
    public void setBorrower(User borrower) { this.borrower = borrower; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public BigDecimal getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    public BorrowStatus getStatus() { return status; }
    public void setStatus(BorrowStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getBorrowedAt() { return borrowedAt; }
    public void setBorrowedAt(Instant borrowedAt) { this.borrowedAt = borrowedAt; }
    public Instant getReturnedAt() { return returnedAt; }
    public void setReturnedAt(Instant returnedAt) { this.returnedAt = returnedAt; }
}
