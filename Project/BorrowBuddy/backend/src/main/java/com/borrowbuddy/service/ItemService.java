package com.borrowbuddy.service;
import com.borrowbuddy.dto.request.ItemRequest;
import com.borrowbuddy.dto.response.ItemResponse;
import com.borrowbuddy.entity.*;
import com.borrowbuddy.enums.ItemStatus;
import com.borrowbuddy.enums.BorrowStatus;
import com.borrowbuddy.repository.*;
import com.borrowbuddy.util.DistanceUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
@Service @Transactional public class ItemService {
 private final ItemRepository itemRepository;
 private final CategoryRepository categoryRepository;
 private final UserRepository userRepository;
 private final BorrowRequestRepository borrowRequests;
 public ItemService(ItemRepository itemRepository,CategoryRepository categoryRepository,UserRepository userRepository,BorrowRequestRepository borrowRequests){this.borrowRequests=borrowRequests;this.itemRepository=itemRepository;this.categoryRepository=categoryRepository;this.userRepository=userRepository;}
 private User getUser(String email){return userRepository.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));}
 private Item getOwnedItem(Long id,String email){
 Item item=itemRepository.findByIdForUpdate(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item not found"));
 if(!item.getOwner().getEmail().equals(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"You do not own this item");
 if(item.getStatus()==ItemStatus.ARCHIVED) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Item has been archived");
 return item;
 }
 private void setItemDetails(Item item,ItemRequest request){
 item.setName(request.getName().trim()); item.setDescription(request.getDescription().trim());
 item.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Category not found")));
 item.setPricePerDay(request.getPricePerDay()); item.setLocality(request.getLocality().trim());
 if(!Double.isFinite(request.getLatitude())||!Double.isFinite(request.getLongitude())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid coordinates");
 item.setLatitude(request.getLatitude()); item.setLongitude(request.getLongitude()); item.setImageUrl(request.getImageUrl());
 }
 public ItemResponse createItem(ItemRequest request,String email){Item item=new Item();setItemDetails(item,request);item.setOwner(getUser(email));item.setStatus(ItemStatus.ACTIVE);return new ItemResponse(itemRepository.save(item),null);}
 @Transactional(readOnly=true) public ItemResponse getItemById(Long id){Item item=itemRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item not found"));if(item.getStatus()!=ItemStatus.ACTIVE) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Item is not available for browsing");return new ItemResponse(item,null);}
 @Transactional(readOnly=true) public List<ItemResponse> getAllItems(String search,Long categoryId,Double latitude,Double longitude,Double radius){
 boolean locationSearch=latitude!=null||longitude!=null||radius!=null;
 if(locationSearch){if(latitude==null||longitude==null||radius==null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Latitude, longitude and radius are required");
 if(!Double.isFinite(latitude)||!Double.isFinite(longitude)||!Double.isFinite(radius)||Math.abs(latitude)>90||Math.abs(longitude)>180||radius<=0||radius>50) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid location or search radius");}
 List<ItemResponse> result=new ArrayList<>();
 for(Item item:itemRepository.findByStatus(ItemStatus.ACTIVE)){
 if(categoryId!=null&&!item.getCategory().getId().equals(categoryId)) continue;
 if(search!=null&&!search.isBlank()){String keyword=search.trim().toLowerCase(Locale.ROOT);if(!item.getName().toLowerCase(Locale.ROOT).contains(keyword)&&!item.getDescription().toLowerCase(Locale.ROOT).contains(keyword)) continue;}
 Double distance=null; if(locationSearch){distance=DistanceUtil.calculateDistance(latitude,longitude,item.getLatitude(),item.getLongitude());if(distance>radius) continue;}
 result.add(new ItemResponse(item,distance));}
 if(locationSearch) result.sort(Comparator.comparing(ItemResponse::getDistanceKm));else result.sort(Comparator.comparing(ItemResponse::getCreatedAt).reversed());return result;
 }
 @Transactional(readOnly=true) public List<ItemResponse> getMyItems(String email){return itemRepository.findByOwnerIdAndStatusNot(getUser(email).getId(),ItemStatus.ARCHIVED).stream().map(item->new ItemResponse(item,null)).toList();}
 private void ensureNoReservations(Item item){
 for(BorrowRequest r:borrowRequests.findForUpdate(item.getId())){
 if(r.getStatus()==BorrowStatus.APPROVED||r.getStatus()==BorrowStatus.BORROWED||r.getStatus()==BorrowStatus.RETURN_REQUESTED) throw new ResponseStatusException(HttpStatus.CONFLICT,"Item has an approved reservation or active loan");
 }
 }
 public ItemResponse updateItem(Long id,ItemRequest request,String email){Item item=getOwnedItem(id,email);ensureNoReservations(item);setItemDetails(item,request);return new ItemResponse(itemRepository.save(item),null);}
 public ItemResponse updateStatus(Long id,ItemStatus status,String email){Item item=getOwnedItem(id,email);if(status==null||status==ItemStatus.ARCHIVED) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Status must be ACTIVE or INACTIVE");if(status==ItemStatus.INACTIVE) ensureNoReservations(item);item.setStatus(status);return new ItemResponse(itemRepository.save(item),null);}
 public void deleteItem(Long id,String email){Item item=getOwnedItem(id,email);ensureNoReservations(item);for(BorrowRequest r:borrowRequests.findForUpdate(id)){if(r.getStatus()==BorrowStatus.PENDING) r.setStatus(BorrowStatus.CANCELLED);}item.setStatus(ItemStatus.ARCHIVED);itemRepository.save(item);}
}
