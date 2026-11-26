package com.borrowbuddy.controller;
import com.borrowbuddy.dto.request.ItemRequest;
import com.borrowbuddy.dto.response.ItemResponse;
import com.borrowbuddy.enums.ItemStatus;
import com.borrowbuddy.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
@RestController @RequestMapping("/api/v1/items") public class ItemController {
 private final ItemService itemService;
 public ItemController(ItemService itemService){this.itemService=itemService;}
 @PostMapping public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest request,Principal principal){return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createItem(request,principal.getName()));}
 @GetMapping public List<ItemResponse> getAllItems(@RequestParam(required=false) String search,@RequestParam(required=false) Long categoryId,@RequestParam(required=false) Double latitude,@RequestParam(required=false) Double longitude,@RequestParam(required=false) Double radius){return itemService.getAllItems(search,categoryId,latitude,longitude,radius);}
 @GetMapping("/my") public List<ItemResponse> getMyItems(Principal principal){return itemService.getMyItems(principal.getName());}
 @GetMapping("/{id}") public ItemResponse getItemById(@PathVariable Long id){return itemService.getItemById(id);}
 @PutMapping("/{id}") public ItemResponse updateItem(@PathVariable Long id,@Valid @RequestBody ItemRequest request,Principal principal){return itemService.updateItem(id,request,principal.getName());}
 @PatchMapping("/{id}/status") public ItemResponse updateStatus(@PathVariable Long id,@RequestParam ItemStatus status,Principal principal){return itemService.updateStatus(id,status,principal.getName());}
 @DeleteMapping("/{id}") public ResponseEntity<Void> deleteItem(@PathVariable Long id,Principal principal){itemService.deleteItem(id,principal.getName());return ResponseEntity.noContent().build();}
}
