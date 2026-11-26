package com.borrowbuddy.repository;
import com.borrowbuddy.entity.BorrowRequest;
import com.borrowbuddy.enums.BorrowStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    List<BorrowRequest> findByBorrowerIdOrderByCreatedAtDesc(Long id);
    List<BorrowRequest> findByItemOwnerIdOrderByCreatedAtDesc(Long id);
    @Query("select r.item.id from BorrowRequest r where r.id = :id")
    Optional<Long> findItemId(@Param("id") Long id);
    @Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from BorrowRequest r where r.item.id = :id")
    List<BorrowRequest> findForUpdate(@Param("id") Long id);
}
