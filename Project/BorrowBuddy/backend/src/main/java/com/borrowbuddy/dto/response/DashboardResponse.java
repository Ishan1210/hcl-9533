package com.borrowbuddy.dto.response;

import java.util.List;

public record DashboardResponse(
        UserResponse user,
        List<ItemResponse> items,
        List<BorrowResponse> borrowing,
        List<BorrowResponse> lending
) {
}