package com.borrowbuddy.service;
import com.borrowbuddy.entity.*;
import com.borrowbuddy.enums.*;
import com.borrowbuddy.repository.*;
import com.borrowbuddy.dto.request.CreateBorrowRequest;
import com.borrowbuddy.dto.response.BorrowResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;
import java.util.*;
@Service
@Transactional
public class BorrowService {
    private final BorrowRequestRepository requests;
    private final ItemRepository items;
    private final UserRepository users;
    public BorrowService(BorrowRequestRepository requests, ItemRepository items, UserRepository users) {
        this.requests = requests; this.items = items; this.users = users;
    }
    private LocalDate today() { return LocalDate.now(ZoneId.of("Asia/Kolkata")); }
    private ResponseStatusException error(HttpStatus status, String message) { return new ResponseStatusException(status, message); }
    private User user(String email) { return users.findByEmail(email).orElseThrow(() -> error(HttpStatus.NOT_FOUND,"User not found")); }
    private Item lockItem(Long id) { return items.findByIdForUpdate(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Item not found")); }
    private boolean holding(BorrowRequest r) { return r.getStatus()==BorrowStatus.BORROWED || r.getStatus()==BorrowStatus.RETURN_REQUESTED; }
    private boolean reserved(BorrowRequest r) { return r.getStatus()==BorrowStatus.APPROVED || holding(r); }
    private boolean overlaps(BorrowRequest r, LocalDate start, LocalDate end) {
        return !r.getEndDate().isBefore(start) && !r.getStartDate().isAfter(end);
    }
    public BorrowResponse create(CreateBorrowRequest dto, String email) {
        Item item = lockItem(dto.getItemId());
        User borrower = user(email);
        LocalDate start = dto.getStartDate(), end = dto.getEndDate(), now = today();
        long days = ChronoUnit.DAYS.between(start,end)+1;
        if(start.isBefore(now) || start.isAfter(now.plusDays(90)) || days<1 || days>30)
            throw error(HttpStatus.BAD_REQUEST,"Invalid rental dates (1-30 days, start within 90 days)");
        if(item.getOwner().getId().equals(borrower.getId())) throw error(HttpStatus.BAD_REQUEST,"Cannot borrow your own item");
        if(item.getStatus()!=ItemStatus.ACTIVE) throw error(HttpStatus.CONFLICT,"Item is not active");
        for(BorrowRequest r : requests.findForUpdate(item.getId())) {
            if(reserved(r) && overlaps(r,start,end)) throw error(HttpStatus.CONFLICT,"Dates already reserved");
            if(r.getStatus()==BorrowStatus.PENDING && r.getBorrower().getId().equals(borrower.getId()) && overlaps(r,start,end))
                throw error(HttpStatus.CONFLICT,"You already have an overlapping pending request");
        }
        BorrowRequest r = new BorrowRequest();
        r.setItem(item); r.setBorrower(borrower); r.setStartDate(start); r.setEndDate(end);
        r.setPricePerDay(item.getPricePerDay()); r.setTotalPrice(item.getPricePerDay().multiply(BigDecimal.valueOf(days)));
        return new BorrowResponse(requests.save(r),now);
    }
    @Transactional(readOnly=true)
    public List<BorrowResponse> mine(String email, boolean incoming) {
        Long id=user(email).getId();
        List<BorrowRequest> list=incoming?requests.findByItemOwnerIdOrderByCreatedAtDesc(id):requests.findByBorrowerIdOrderByCreatedAtDesc(id);
        return list.stream().map(r -> new BorrowResponse(r,today())).toList();
    }
    public BorrowResponse action(Long id, String action, String email) {
        Long itemId=requests.findItemId(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Request not found"));
        Item item=lockItem(itemId);
        List<BorrowRequest> all=requests.findForUpdate(itemId);
        BorrowRequest r=all.stream().filter(x -> x.getId().equals(id)).findFirst().orElseThrow(() -> error(HttpStatus.NOT_FOUND,"Request not found"));
        boolean owner=item.getOwner().getEmail().equals(email), borrower=r.getBorrower().getEmail().equals(email);
        LocalDate now=today();
        switch(action) {
            case "approve" -> {
                require(owner); state(r,BorrowStatus.PENDING);
                if(item.getStatus()!=ItemStatus.ACTIVE || r.getStartDate().isBefore(now)) throw error(HttpStatus.CONFLICT,"Item inactive or start date passed");
                for(BorrowRequest other:all) if(!other.getId().equals(id) && reserved(other) && overlaps(other,r.getStartDate(),r.getEndDate())) throw error(HttpStatus.CONFLICT,"Dates already reserved");
                r.setStatus(BorrowStatus.APPROVED);
            }
            case "reject" -> { require(owner); state(r,BorrowStatus.PENDING); r.setStatus(BorrowStatus.REJECTED); }
            case "cancel" -> {
                require(owner || borrower);
                if(r.getStatus()!=BorrowStatus.PENDING && r.getStatus()!=BorrowStatus.APPROVED) throw error(HttpStatus.CONFLICT,"Cannot cancel this request");
                r.setStatus(BorrowStatus.CANCELLED);
            }
            case "handover" -> {
                require(owner); state(r,BorrowStatus.APPROVED);
                if(now.isBefore(r.getStartDate()) || now.isAfter(r.getEndDate())) throw error(HttpStatus.CONFLICT,"Outside reservation dates");
                for(BorrowRequest other:all) if(!other.getId().equals(id) && holding(other)) throw error(HttpStatus.CONFLICT,"Item has not been returned");
                r.setStatus(BorrowStatus.BORROWED); r.setBorrowedAt(Instant.now());
            }
            case "request-return" -> { require(borrower); state(r,BorrowStatus.BORROWED); r.setStatus(BorrowStatus.RETURN_REQUESTED); }
            case "confirm-return" -> { require(owner); state(r,BorrowStatus.RETURN_REQUESTED); r.setStatus(BorrowStatus.COMPLETED); r.setReturnedAt(Instant.now()); }
            default -> throw error(HttpStatus.BAD_REQUEST,"Unknown action");
        }
        return new BorrowResponse(requests.save(r),now);
    }
    private void require(boolean allowed) { if(!allowed) throw error(HttpStatus.FORBIDDEN,"Action not allowed for this user"); }
    private void state(BorrowRequest r,BorrowStatus expected) { if(r.getStatus()!=expected) throw error(HttpStatus.CONFLICT,"Invalid request status"); }
}
