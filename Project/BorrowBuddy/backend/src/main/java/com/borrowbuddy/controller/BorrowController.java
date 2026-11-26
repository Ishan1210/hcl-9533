package com.borrowbuddy.controller;
import com.borrowbuddy.dto.request.CreateBorrowRequest;
import com.borrowbuddy.dto.response.BorrowResponse;
import com.borrowbuddy.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
@RestController
@RequestMapping("/api/v1/borrow-requests")
public class BorrowController {
    private final BorrowService service;
    public BorrowController(BorrowService service) { this.service=service; }
    @PostMapping
    public ResponseEntity<BorrowResponse> create(@Valid @RequestBody CreateBorrowRequest request, Principal p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request,p.getName()));
    }
    @GetMapping("/my")
    public List<BorrowResponse> mine(Principal p) { return service.mine(p.getName(),false); }
    @GetMapping("/incoming")
    public List<BorrowResponse> incoming(Principal p) { return service.mine(p.getName(),true); }
    @PatchMapping("/{id}/{action}")
    public BorrowResponse action(@PathVariable Long id,@PathVariable String action,Principal p) { return service.action(id,action,p.getName()); }
}
