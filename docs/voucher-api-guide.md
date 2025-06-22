# API Test Instructions for Voucher Endpoints

## 1. Create Voucher (Admin Only)
```
POST /api/vouchers
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "SUMMER2025",
  "name": "Summer Discount 2025",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderAmount": 100000,
  "maxDiscountAmount": 50000,
  "usageLimit": 100,
  "startDate": "2025-06-01T00:00:00",
  "endDate": "2025-08-31T23:59:59",
  "isActive": true
}
```

## 2. Create Fixed Amount Voucher (Admin Only)
```
POST /api/vouchers
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "WELCOME50K",
  "name": "Welcome Discount 50K",
  "discountType": "fixed_amount",
  "discountValue": 50000,
  "minOrderAmount": 200000,
  "usageLimit": 50,
  "startDate": "2025-06-01T00:00:00",
  "endDate": "2025-07-31T23:59:59",
  "isActive": true
}
```

## 3. Get All Vouchers (Admin Only)
```
GET /api/vouchers?page=0&size=10&sortBy=createdAt&sortDir=desc
Authorization: Bearer {admin_token}
```

## 4. Get Active Vouchers (Public)
```
GET /api/vouchers/active
```

## 5. Get Valid Vouchers (Public)
```
GET /api/vouchers/valid
```

## 6. Get Voucher by ID
```
GET /api/vouchers/{voucher_id}
Authorization: Bearer {token}
```

## 7. Update Voucher (Admin Only)
```
PUT /api/vouchers/{voucher_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Voucher Name",
  "discountValue": 25,
  "usageLimit": 200,
  "endDate": "2025-09-30T23:59:59"
}
```

## 8. Deactivate Voucher (Admin Only)
```
PATCH /api/vouchers/{voucher_id}/deactivate
Authorization: Bearer {admin_token}
```

## 9. Delete Voucher (Admin Only)
```
DELETE /api/vouchers/{voucher_id}
Authorization: Bearer {admin_token}
```

## 10. Validate Voucher (Public)
```
POST /api/vouchers/validate
Content-Type: application/json

{
  "code": "SUMMER2025"
}
```

## Sample cURL Commands

### Create Voucher
```bash
curl -X POST http://localhost:8080/api/vouchers \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2025",
    "name": "Summer Discount 2025",
    "discountType": "percentage",
    "discountValue": 20,
    "minOrderAmount": 100000,
    "maxDiscountAmount": 50000,
    "usageLimit": 100,
    "startDate": "2025-06-01T00:00:00",
    "endDate": "2025-08-31T23:59:59",
    "isActive": true
  }'
```

### Get Active Vouchers
```bash
curl -X GET http://localhost:8080/api/vouchers/active
```

### Validate Voucher
```bash
curl -X POST http://localhost:8080/api/vouchers/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2025"
  }'
```
