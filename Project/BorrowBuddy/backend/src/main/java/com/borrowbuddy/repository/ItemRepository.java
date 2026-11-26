package com.borrowbuddy.repository;
import com.borrowbuddy.entity.Item;
import com.borrowbuddy.enums.ItemStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface ItemRepository extends JpaRepository<Item,Long>{
 List<Item> findByStatus(ItemStatus status);
 List<Item> findByOwnerIdAndStatusNot(Long ownerId,ItemStatus status);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("SELECT i FROM Item i WHERE i.id = :id")
 Optional<Item> findByIdForUpdate(@Param("id") Long id);
}
