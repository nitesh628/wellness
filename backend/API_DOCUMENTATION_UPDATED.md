# Wellness Backend API Documentation

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://wellness-fuel.vercel.app`
- **API Version**: v1

## Authentication

Most endpoints require authentication via JWT token stored in cookies. Use the `isLogin` middleware to protect routes.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users & Doctors & Influencers](#users--doctors--influencers)
3. [Products](#products)
4. [Orders](#orders)
5. [Appointments](#appointments)
6. [Blogs](#blogs)
7. [Categories](#categories)
8. [Ratings & Reviews](#ratings--reviews)
9. [Addresses](#addresses)
10. [Coupons](#coupons)
11. [Payment Methods & Razorpay](#payment-methods--razorpay)
12. [Customers](#customers)
13. [Prescriptions & Reports](#prescriptions--reports)
14. [Influencer Features](#influencer-features)
15. [Public vs Protected](#public-vs-protected-endpoints)
16. [Additional Routes](#additional-api-routes)
17. [Status Codes](#response-status-codes-reference)
18. [Examples](#requestresponse-examples)

---

## Authentication

### Login

**POST** `/v1/auth/login`

Login to the system with credentials.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

### Register/Signup

**POST** `/v1/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "new_user_id",
    "email": "newuser@example.com",
    "name": "John Doe"
  }
}
```

---

### Check Authentication Status

**POST** `/v1/auth/check` (Requires Login)

Verify if user is authenticated.

**Response:** `200 OK`

```json
{
  "authenticated": true,
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer"
  }
}
```

---

### Logout

**POST** `/v1/auth/logout` (Requires Login)

Logout the current user.

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

### Reset Password

**POST** `/v1/auth/resetpassword` (Requires Login)

Reset user password.

**Request Body:**

```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset successfully"
}
```

---

## Users & Doctors & Influencers

### Users

#### Create User

**POST** `/v1/users`

Create a new user. Supports image upload.

**Request Body (Form Data):**

- `name`: string (required)
- `email`: string (required)
- `password`: string (required)
- `imageUrl`: file (optional)
- `phone`: string (optional)
- `role`: string (optional) - "customer", "doctor", "influencer"

**Response:** `201 Created`

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "imageUrl": "s3_url"
}
```

---

#### Get All Users

**GET** `/v1/users`

Retrieve all users.

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)
- `role`: string (optional) - Filter by user role

**Response:** `200 OK`

```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

#### Get User by ID

**GET** `/v1/users/:id`

Retrieve a specific user by ID.

**Response:** `200 OK`

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "role": "customer",
  "imageUrl": "s3_url",
  "createdAt": "2026-01-28T10:00:00Z"
}
```

---

#### Update User

**PUT** `/v1/users/:id`

Update user details. Supports image upload.

**Request Body (Form Data):**

- `name`: string (optional)
- `email`: string (optional)
- `phone`: string (optional)
- `imageUrl`: file (optional)

**Response:** `200 OK`

```json
{
  "_id": "user_id",
  "name": "Updated Name",
  "email": "john@example.com"
}
```

---

#### Delete User

**DELETE** `/v1/users/:id`

Delete a user.

**Response:** `200 OK`

```json
{
  "message": "User deleted successfully"
}
```

---

### Doctors

#### Create Doctor

**POST** `/v1/users/doctor`

Create a doctor account.

**Request Body:**

```json
{
  "name": "Dr. Smith",
  "email": "doctor@example.com",
  "password": "password123",
  "specialization": "Cardiology",
  "licenseNumber": "12345",
  "experience": 5,
  "phone": "555-5678"
}
```

**Response:** `201 Created`

---

#### Get All Doctors

**GET** `/v1/users/doctor`

Retrieve all doctors with pagination.

**Query Parameters:**

- `page`: number
- `limit`: number
- `specialization`: string (optional)

**Response:** `200 OK`

---

#### Get Doctor by ID

**GET** `/v1/users/doctor/:id`

Retrieve a specific doctor.

**Response:** `200 OK`

```json
{
  "_id": "doctor_id",
  "name": "Dr. Smith",
  "email": "doctor@example.com",
  "specialization": "Cardiology",
  "experience": 5,
  "isActive": true
}
```

---

#### Update Doctor

**PUT** `/v1/users/doctor/:id`

Update doctor details.

**Request Body:**

```json
{
  "specialization": "Neurology",
  "experience": 6
}
```

**Response:** `200 OK`

---

#### Toggle Doctor Status

**GET** `/v1/users/doctor/isactive/:id`

Toggle doctor active/inactive status.

**Response:** `200 OK`

```json
{
  "message": "Doctor status updated",
  "isActive": true
}
```

---

### Influencers

#### Create Influencer

**POST** `/v1/users/influencer`

Create an influencer account.

**Request Body:**

```json
{
  "name": "Influencer Name",
  "email": "influencer@example.com",
  "password": "password123",
  "followers": 50000,
  "niche": "Health & Wellness",
  "instagramHandle": "@influencer",
  "bio": "Health enthusiast"
}
```

**Response:** `201 Created`

---

#### Get All Influencers

**GET** `/v1/users/influencer`

Retrieve all influencers.

**Query Parameters:**

- `page`: number
- `limit`: number
- `niche`: string (optional)

**Response:** `200 OK`

---

#### Get Influencer by ID

**GET** `/v1/users/influencer/:id`

Retrieve a specific influencer.

**Response:** `200 OK`

```json
{
  "_id": "influencer_id",
  "name": "Influencer Name",
  "email": "influencer@example.com",
  "followers": 50000,
  "niche": "Health & Wellness",
  "isActive": true
}
```

---

#### Update Influencer

**PUT** `/v1/users/influencer/:id`

Update influencer details.

**Request Body:**

```json
{
  "followers": 55000,
  "niche": "Wellness & Fitness"
}
```

**Response:** `200 OK`

---

#### Toggle Influencer Status

**GET** `/v1/users/influencer/isactive/:id`

Toggle influencer active/inactive status.

**Response:** `200 OK`

```json
{
  "message": "Influencer status updated",
  "isActive": false
}
```

---

## Products

### Product Model Fields

| Field                  | Type     | Required | Unique | Description              |
| ---------------------- | -------- | -------- | ------ | ------------------------ |
| name                   | String   | Yes      | No     | Name of the product      |
| slug                   | String   | Yes      | Yes    | URL-friendly identifier  |
| category               | String   | Yes      | No     | Product category         |
| price.amount           | Number   | Yes      | No     | Price amount             |
| price.currency         | String   | No       | No     | Currency (default: 'Rs') |
| price.mrp              | Number   | No       | No     | Maximum retail price     |
| stockQuantity          | Number   | Yes      | No     | Stock available          |
| shortDescription       | String   | Yes      | No     | Brief description        |
| longDescription        | String   | Yes      | No     | Detailed description     |
| expiryDate             | Date     | Yes      | No     | Product expiry date      |
| ingredients            | [String] | No       | No     | List of ingredients      |
| benefits               | [String] | No       | No     | Product benefits         |
| dosageInstructions     | String   | Yes      | No     | Dosage instructions      |
| manufacturer           | String   | Yes      | No     | Manufacturer name        |
| images                 | [String] | No       | No     | Image URLs               |
| dosageForm.value       | String   | No       | No     | Dosage value             |
| dosageForm.unit        | String   | No       | No     | Dosage unit              |
| isPrescriptionRequired | Boolean  | No       | No     | Requires prescription    |
| sideEffects            | [String] | No       | No     | Possible side effects    |
| contraindications      | [String] | No       | No     | Contraindications        |

---

#### Create Product

**POST** `/v1/products`

Create a new product.

**Request Body:**

```json
{
  "name": "Vitamin C 500mg",
  "slug": "vitamin-c-500mg",
  "category": "vitamins",
  "price": {
    "amount": 299,
    "currency": "Rs",
    "mrp": 399
  },
  "stockQuantity": 100,
  "shortDescription": "High potency vitamin C supplement",
  "longDescription": "Detailed description here",
  "expiryDate": "2027-12-31",
  "dosageInstructions": "Take 1 tablet daily",
  "manufacturer": "HealthCo",
  "ingredients": ["Vitamin C", "Cellulose"],
  "benefits": ["Immunity boost", "Antioxidant"],
  "isPrescriptionRequired": false
}
```

**Response:** `201 Created`

---

#### Get All Products

**GET** `/v1/products`

Retrieve all products with pagination and filtering.

**Query Parameters:**

- `page`: number
- `limit`: number
- `category`: string
- `search`: string
- `sortBy`: string ("price", "name", "newest")

**Response:** `200 OK`

```json
{
  "products": [...],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

---

#### Get All Products (Public)

**GET** `/v1/products/public`

Get products for public view (filtered/limited).

**Response:** `200 OK`

---

#### Get Product by ID

**GET** `/v1/products/:id`

Retrieve a specific product.

**Response:** `200 OK`

```json
{
  "_id": "product_id",
  "name": "Vitamin C 500mg",
  "price": { "amount": 299, "currency": "Rs" },
  "stockQuantity": 100,
  "description": "...",
  "images": ["url1", "url2"]
}
```

---

#### Get Product by Slug

**GET** `/v1/products/slug/:slug`

Retrieve a product by its URL slug.

**Response:** `200 OK`

---

#### Get Products by Category

**GET** `/v1/products/category/:category`

Retrieve all products in a category.

**Query Parameters:**

- `page`: number
- `limit`: number

**Response:** `200 OK`

---

#### Update Product

**PUT** `/v1/products/:id`

Update product details.

**Request Body:**

```json
{
  "name": "Updated Name",
  "price": { "amount": 399 },
  "stockQuantity": 150
}
```

**Response:** `200 OK`

---

#### Update Stock

**PATCH** `/v1/products/:id/stock`

Update product stock quantity.

**Request Body:**

```json
{
  "quantity": 200
}
```

**Response:** `200 OK`

```json
{
  "message": "Stock updated",
  "stockQuantity": 200
}
```

---

#### Delete Product

**DELETE** `/v1/products/:id`

Delete a product.

**Response:** `200 OK`

---

## Orders

### Create Order

**POST** `/v1/orders`

Create a new order.

**Request Body:**

```json
{
  "userId": "user_id",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 299
    }
  ],
  "totalAmount": 598,
  "shippingAddress": "address_id",
  "paymentMethod": "razorpay",
  "couponCode": "SAVE20",
  "notes": "Deliver after 5 PM"
}
```

**Response:** `201 Created`

```json
{
  "_id": "order_id",
  "userId": "user_id",
  "items": [...],
  "totalAmount": 598,
  "status": "pending",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

---

### Get All Orders

**GET** `/v1/orders`

Retrieve all orders with filtering.

**Query Parameters:**

- `page`: number
- `limit`: number
- `status`: string ("pending", "processing", "shipped", "delivered", "cancelled")
- `userId`: string

**Response:** `200 OK`

```json
{
  "orders": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

### Get Order by ID

**GET** `/v1/orders/:id`

Retrieve a specific order.

**Response:** `200 OK`

```json
{
  "_id": "order_id",
  "userId": "user_id",
  "items": [...],
  "totalAmount": 598,
  "status": "shipped",
  "trackingNumber": "TRACK123",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

---

### Update Order

**PUT** `/v1/orders/:id`

Update order details (status, tracking, etc).

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "track123",
  "notes": "Order shipped"
}
```

**Response:** `200 OK`

---

### Delete Order

**DELETE** `/v1/orders/:id`

Delete an order.

**Response:** `200 OK`

---

## Appointments

### Create Appointment

**POST** `/v1/appointments` (Requires Login)

Create a new appointment.

**Request Body:**

```json
{
  "doctorId": "doctor_id",
  "userId": "user_id",
  "date": "2026-02-15",
  "time": "10:00 AM",
  "reason": "Consultation",
  "notes": "Follow-up appointment"
}
```

**Response:** `201 Created`

```json
{
  "_id": "appointment_id",
  "doctorId": "doctor_id",
  "userId": "user_id",
  "date": "2026-02-15",
  "time": "10:00 AM",
  "status": "scheduled",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

---

### Get All Appointments

**GET** `/v1/appointments` (Requires Login)

Retrieve all appointments.

**Query Parameters:**

- `page`: number
- `limit`: number
- `doctorId`: string
- `userId`: string
- `status`: string ("scheduled", "completed", "cancelled")

**Response:** `200 OK`

---

### Get Appointment by ID

**GET** `/v1/appointments/:id` (Requires Login)

Retrieve a specific appointment.

**Response:** `200 OK`

---

### Update Appointment

**PUT** `/v1/appointments/:id` (Requires Login)

Update appointment details.

**Request Body:**

```json
{
  "status": "completed",
  "date": "2026-02-15",
  "time": "10:30 AM",
  "notes": "Appointment completed"
}
```

**Response:** `200 OK`

---

### Delete Appointment

**DELETE** `/v1/appointments/:id` (Requires Login)

Delete an appointment.

**Response:** `200 OK`

---

### Get Appointment Stats

**GET** `/v1/appointments/stats` (Requires Login)

Retrieve appointment statistics.

**Response:** `200 OK`

```json
{
  "totalAppointments": 150,
  "completed": 120,
  "pending": 20,
  "cancelled": 10,
  "thisMonth": 25,
  "thisWeek": 8
}
```

---

### Export Appointments

**GET** `/v1/appointments/export` (Requires Login)

Export appointments as CSV or PDF.

**Query Parameters:**

- `format`: "csv" or "pdf"
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)

**Response:** File download

---

## Blogs

### Create Blog

**POST** `/v1/blogs/create` (Requires Login)

Create a new blog post.

**Request Body:**

```json
{
  "title": "10 Tips for Better Health",
  "content": "Blog content in markdown or HTML",
  "author": "Author Name",
  "tags": ["health", "wellness", "tips"],
  "featured": true,
  "coverImage": "image_url"
}
```

**Response:** `201 Created`

---

### Get All Blogs

**GET** `/v1/blogs` (Requires Login)

Retrieve all blog posts.

**Query Parameters:**

- `page`: number
- `limit`: number
- `search`: string
- `tags`: string (comma-separated)
- `author`: string

**Response:** `200 OK`

---

### Get Blog by ID

**GET** `/v1/blogs/:id` (Requires Login)

Retrieve a specific blog post.

**Response:** `200 OK`

```json
{
  "_id": "blog_id",
  "title": "10 Tips for Better Health",
  "content": "...",
  "author": "Author Name",
  "tags": ["health", "wellness"],
  "views": 500,
  "createdAt": "2026-01-28T10:00:00Z"
}
```

---

### Update Blog

**PUT** `/v1/blogs/:id` (Requires Login)

Update blog post.

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "tags": ["wellness"]
}
```

**Response:** `200 OK`

---

### Delete Blog

**DELETE** `/v1/blogs/:id` (Requires Login)

Delete a blog post.

**Response:** `200 OK`

---

## Categories

### Get All Categories

**GET** `/v1/categories`

Retrieve all product categories.

**Response:** `200 OK`

```json
{
  "categories": [
    {
      "_id": "id1",
      "name": "Vitamins & Supplements",
      "description": "Essential vitamins",
      "imageUrl": "url"
    },
    {
      "_id": "id2",
      "name": "Health Products",
      "description": "Wellness products"
    }
  ]
}
```

---

### Get Category by ID

**GET** `/v1/categories/:id`

Retrieve a specific category.

**Response:** `200 OK`

---

### Create Category

**POST** `/v1/categories`

Create a new category.

**Request Body:**

```json
{
  "name": "New Category",
  "description": "Category description",
  "imageUrl": "category_image_url"
}
```

**Response:** `201 Created`

---

### Update Category

**PUT** `/v1/categories/:id`

Update category details.

**Request Body:**

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`

---

### Delete Category

**DELETE** `/v1/categories/:id`

Delete a category.

**Response:** `200 OK`

---

## Ratings & Reviews

### Create Rating

**POST** `/v1/ratings`

Create a product rating.

**Request Body:**

```json
{
  "productId": "product_id",
  "userId": "user_id",
  "rating": 4.5,
  "review": "Great product! Very effective."
}
```

**Response:** `201 Created`

```json
{
  "_id": "rating_id",
  "productId": "product_id",
  "rating": 4.5,
  "review": "Great product!",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

---

### Get Ratings

**GET** `/v1/ratings`

Retrieve all ratings.

**Query Parameters:**

- `productId`: string
- `page`: number
- `limit`: number

**Response:** `200 OK`

```json
{
  "ratings": [...],
  "averageRating": 4.2,
  "totalRatings": 50,
  "page": 1
}
```

---

### Create Review

**POST** `/v1/reviews`

Create a product review.

**Request Body:**

```json
{
  "productId": "product_id",
  "userId": "user_id",
  "title": "Excellent Product",
  "content": "Detailed review content",
  "rating": 5,
  "verified": true
}
```

**Response:** `201 Created`

---

### Get Reviews

**GET** `/v1/reviews`

Retrieve all reviews.

**Query Parameters:**

- `productId`: string
- `rating`: number
- `verified`: boolean
- `page`: number
- `limit`: number

**Response:** `200 OK`

```json
{
  "reviews": [...],
  "total": 100,
  "page": 1
}
```

---

## Addresses

### Create Address

**POST** `/v1/addresses`

Create a user address.

**Request Body:**

```json
{
  "userId": "user_id",
  "label": "Home",
  "street": "123 Main St",
  "apartment": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "phone": "555-1234",
  "isDefault": true
}
```

**Response:** `201 Created`

---

### Get Addresses

**GET** `/v1/addresses`

Retrieve user addresses.

**Query Parameters:**

- `userId`: string

**Response:** `200 OK`

```json
{
  "addresses": [
    {
      "_id": "address_id",
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "isDefault": true
    }
  ]
}
```

---

### Get Address by ID

**GET** `/v1/addresses/:id`

Retrieve a specific address.

**Response:** `200 OK`

---

### Update Address

**PUT** `/v1/addresses/:id`

Update address details.

**Request Body:**

```json
{
  "street": "456 Oak St",
  "city": "Boston",
  "postalCode": "02101"
}
```

**Response:** `200 OK`

---

### Delete Address

**DELETE** `/v1/addresses/:id`

Delete an address.

**Response:** `200 OK`

---

## Coupons

### Create Coupon

**POST** `/v1/coupons`

Create a discount coupon.

**Request Body:**

```json
{
  "code": "SAVE20",
  "description": "20% off on all products",
  "discountType": "percentage",
  "discountValue": 20,
  "expiryDate": "2026-12-31",
  "maxUses": 100,
  "usedCount": 0,
  "minOrderAmount": 500,
  "isActive": true
}
```

**Response:** `201 Created`

---

### Get All Coupons

**GET** `/v1/coupons`

Retrieve all coupons.

**Query Parameters:**

- `page`: number
- `limit`: number
- `isActive`: boolean

**Response:** `200 OK`

```json
{
  "coupons": [
    {
      "_id": "coupon_id",
      "code": "SAVE20",
      "discountValue": 20,
      "expiryDate": "2026-12-31",
      "isActive": true
    }
  ]
}
```

---

### Get Coupon by Code

**GET** `/v1/coupons/:code`

Retrieve a coupon by code.

**Response:** `200 OK`

```json
{
  "_id": "coupon_id",
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderAmount": 500,
  "isActive": true,
  "canUse": true,
  "message": "Valid coupon"
}
```

---

### Update Coupon

**PUT** `/v1/coupons/:id`

Update coupon details.

**Request Body:**

```json
{
  "discountValue": 25,
  "maxUses": 150
}
```

**Response:** `200 OK`

---

### Delete Coupon

**DELETE** `/v1/coupons/:id`

Delete a coupon.

**Response:** `200 OK`

---

## Payment Methods & Razorpay

### Create Payment Method

**POST** `/v1/payment-methods`

Add a payment method.

**Request Body:**

```json
{
  "userId": "user_id",
  "type": "card",
  "cardNumber": "****1234",
  "cardHolder": "John Doe",
  "expiryDate": "12/25",
  "cvv": "***",
  "isDefault": true
}
```

**Response:** `201 Created`

---

### Get Payment Methods

**GET** `/v1/payment-methods`

Retrieve user payment methods.

**Query Parameters:**

- `userId`: string

**Response:** `200 OK`

```json
{
  "paymentMethods": [
    {
      "_id": "method_id",
      "type": "card",
      "cardNumber": "****1234",
      "cardHolder": "John Doe",
      "isDefault": true
    }
  ]
}
```

---

### Create Razorpay Order

**POST** `/v1/razorpay/order`

Create a Razorpay payment order.

**Request Body:**

```json
{
  "amount": 100,
  "currency": "INR",
  "receipt": "receipt_id"
}
```

**Response:** `200 OK`

```json
{
  "id": "order_123456",
  "entity": "order",
  "amount": 10000,
  "amount_paid": 0,
  "amount_due": 10000,
  "currency": "INR",
  "receipt": "receipt_id",
  "status": "created"
}
```

---

### Verify Razorpay Payment

**POST** `/v1/razorpay/verify`

Verify a Razorpay payment signature.

**Request Body:**

```json
{
  "razorpayOrderId": "order_123456",
  "razorpayPaymentId": "pay_123456",
  "razorpaySignature": "signature_value",
  "orderId": "db_order_id"
}
```

**Response:** `200 OK`

```json
{
  "verified": true,
  "message": "Payment verified successfully",
  "orderId": "db_order_id",
  "status": "paid"
}
```

---

## Customers

### Get Customer Stats

**GET** `/v1/customer/stats` (Requires Login)

Get customer statistics and analytics.

**Response:** `200 OK`

```json
{
  "totalOrders": 15,
  "totalSpent": 5000,
  "averageOrderValue": 333.33,
  "loyaltyPoints": 500,
  "memberSince": "2025-01-15"
}
```

---

### Get My Appointments

**GET** `/v1/customer/appointments` (Requires Login)

Get customer's appointments.

**Response:** `200 OK`

---

### Get My Prescriptions

**GET** `/v1/customer/prescriptions` (Requires Login)

Get customer's prescriptions.

**Response:** `200 OK`

---

### Download My Data

**GET** `/v1/customer/download-data` (Requires Login)

Download customer's personal data.

**Response:** File download (JSON format)

---

## Prescriptions & Reports

### Create Prescription

**POST** `/v1/prescriptions`

Create a medical prescription. Patient can be identified by either Patient ID (PI######) or MongoDB ObjectId.

**Request Body:**

```json
{
  "patientId": "PI000123",
  "diagnosis": "Type 2 Diabetes",
  "symptoms": "Increased thirst, frequent urination",
  "medications": [
    {
      "product": "product_id",
      "productName": "Metformin 500mg",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "30 days",
      "quantity": 60,
      "instructions": "Take with meals"
    }
  ],
  "generalInstructions": "Follow regular diet and exercise",
  "followUpDate": "2026-03-04"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "prescription_id",
    "patient": {
      "_id": "patient_mongo_id",
      "firstName": "John",
      "lastName": "Doe",
      "patientId": "PI000123"
    },
    "doctor": {
      "_id": "doctor_id",
      "firstName": "Dr.",
      "lastName": "Smith"
    },
    "diagnosis": "Type 2 Diabetes",
    "prescriptionDate": "2026-02-04T10:30:00Z",
    "status": "active",
    "medications": [...]
  }
}
```

**Notes:**

- `patientId` can be either the Patient ID (PI######) or MongoDB ObjectId
- Automatically searches by Patient ID first, then falls back to ObjectId
- Patient ID is displayed as `PI######` format (e.g., PI000123, PI348921)

---

### Get Prescriptions

**GET** `/v1/prescriptions`

Retrieve all prescriptions created by the doctor.

**Query Parameters:**

- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (active, completed, cancelled)
- `search`: string (searches by patient name, patientId, email, or diagnosis)
- `sortBy`: string (default: prescriptionDate)
- `sortOrder`: string (asc or desc)

**Response:** `200 OK`

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "prescription_id",
      "patient": {
        "_id": "patient_id",
        "firstName": "John",
        "lastName": "Doe",
        "patientId": "PI000123",
        "email": "john@example.com"
      },
      "diagnosis": "Type 2 Diabetes",
      "prescriptionDate": "2026-02-04T10:30:00Z",
      "status": "active",
      "medications": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### Get Prescription by ID

**GET** `/v1/prescriptions/:id`

Retrieve a specific prescription.

**Response:** `200 OK`

---

### Update Prescription

**PUT** `/v1/prescriptions/:id`

Update a prescription.

**Response:** `200 OK`

---

### Delete Prescription

**DELETE** `/v1/prescriptions/:id`

Delete a prescription.

**Response:** `200 OK`

---

### Export Prescriptions

**GET** `/v1/prescriptions/export`

Export all prescriptions as CSV file. Includes Patient ID in export.

**Response:** CSV file download

**CSV Columns:**

- ID
- Patient ID (PI######)
- Patient Name
- Patient Email
- Date
- Diagnosis
- Status
- Medications
- Follow Up

---

## Patients & Patient Management

**GET** `/v1/prescriptions/:id`

Retrieve a specific prescription.

**Response:** `200 OK`

---

### Update Prescription

**PUT** `/v1/prescriptions/:id`

Update prescription details.

**Response:** `200 OK`

---

### Create Report

**POST** `/v1/reports`

Create a medical report.

**Request Body:**

```json
{
  "doctorId": "doctor_id",
  "patientId": "patient_id",
  "reportType": "Lab Test",
  "findings": "Test results and findings",
  "recommendations": "Doctor recommendations",
  "date": "2026-01-28"
}
```

**Response:** `201 Created`

---

### Get Reports

**GET** `/v1/reports`

Retrieve all reports.

**Query Parameters:**

- `patientId`: string
- `reportType`: string
- `page`: number

**Response:** `200 OK`

---

### Get Report by ID

**GET** `/v1/reports/:id`

Retrieve a specific report.

**Response:** `200 OK`

---

## Influencer Features

### Influencer Referrals

#### Get Referral Dashboard

**GET** `/v1/influencer-referrals/dashboard` (Requires Login)

Get referral dashboard data and statistics.

**Response:** `200 OK`

```json
{
  "totalReferrals": 25,
  "successfulReferrals": 18,
  "totalCommission": 2500,
  "pendingCommission": 500,
  "referralLink": "https://wellness.com/ref/influencer_id"
}
```

---

#### Create Dummy Referral

**POST** `/v1/influencer-referrals/create-dummy`

Create a dummy referral for testing.

**Request Body:**

```json
{
  "influencerId": "influencer_id",
  "referredUserId": "user_id"
}
```

**Response:** `201 Created`

---

### Influencer Notes

#### Create Note

**POST** `/v1/influencer-notes` (Requires Login)

Create an influencer note.

**Request Body:**

```json
{
  "content": "Note about campaign or collaboration",
  "noteType": "campaign",
  "relatedTo": "product_id"
}
```

**Response:** `201 Created`

---

#### Get Notes

**GET** `/v1/influencer-notes` (Requires Login)

Get all influencer notes.

**Query Parameters:**

- `noteType`: string
- `page`: number

**Response:** `200 OK`

---

### Influencer Reports

#### Create Report

**POST** `/v1/influencer-reports` (Requires Login)

Create an influencer performance report.

**Request Body:**

```json
{
  "reportType": "monthly",
  "period": "2026-01",
  "engagement": 5000,
  "reach": 50000,
  "conversions": 150
}
```

**Response:** `201 Created`

---

#### Get Reports

**GET** `/v1/influencer-reports` (Requires Login)

Get all influencer reports.

**Response:** `200 OK`

---

### Influencer Settings

#### Get Settings

**GET** `/v1/influencer-settings` (Requires Login)

Get influencer account settings.

**Response:** `200 OK`

```json
{
  "bankDetails": {...},
  "commissionRate": 10,
  "paymentPreference": "monthly",
  "notifications": {...}
}
```

---

#### Update Settings

**PUT** `/v1/influencer-settings` (Requires Login)

Update influencer settings.

**Request Body:**

```json
{
  "commissionRate": 12,
  "bankAccount": "****1234",
  "paymentPreference": "bi-weekly"
}
```

**Response:** `200 OK`

---

### Influencer Dashboard

#### Get Dashboard

**GET** `/v1/influencer-dashboard` (Requires Login)

Get influencer dashboard data.

**Response:** `200 OK`

```json
{
  "activeCollaborations": 5,
  "totalEarnings": 15000,
  "monthlyEarnings": 2500,
  "performanceMetrics": {...}
}
```

---

#### Create Activity

**POST** `/v1/influencer-dashboard/activity` (Requires Login)

Log an influencer activity.

**Request Body:**

```json
{
  "activityType": "post",
  "description": "Posted about wellness",
  "platform": "instagram",
  "engagement": 1500
}
```

**Response:** `201 Created`

---

## Public vs Protected Endpoints

### Public Endpoints (No Authentication Required)

- `GET /v1/products` - Get all products
- `GET /v1/products/public` - Get products for public view
- `GET /v1/products/:id` - Get product by ID
- `GET /v1/products/slug/:slug` - Get product by slug
- `GET /v1/products/category/:category` - Get products by category
- `GET /v1/categories` - Get all categories
- `POST /v1/auth/login` - Login
- `POST /v1/auth/register` - Register
- `GET /v1/popups` - Get all popups
- `POST /v1/leads` - Create lead
- `POST /v1/newsletters` - Subscribe to newsletter

### Protected Endpoints (Require isLogin Middleware)

All other endpoints typically require authentication. Include the JWT token in cookies with requests.

---

## Additional API Routes

### Patients

**POST** `/v1/patients` (Requires Login)
Create a patient profile.

**GET** `/v1/patients` (Requires Login)
Get all patients.

**GET** `/v1/patients/:id` (Requires Login)
Get patient by ID.

**PUT** `/v1/patients/:id` (Requires Login)
Update patient.

**DELETE** `/v1/patients/:id` (Requires Login)
Delete patient.

---

### Sessions

**POST** `/v1/sessions` (Requires Login)
Create a session.

**GET** `/v1/sessions` (Requires Login)
Get all sessions.

**GET** `/v1/sessions/:id` (Requires Login)
Get session by ID.

**DELETE** `/v1/sessions/:id` (Requires Login)
Delete session.

---

### Newsletter

**POST** `/v1/newsletters`
Subscribe to newsletter.

**GET** `/v1/newsletters` (Requires Login)
Get all subscribers.

**DELETE** `/v1/newsletters/:id` (Requires Login)
Unsubscribe.

---

### Popups

**GET** `/v1/popups`
Get all active popups.

**POST** `/v1/popups` (Requires Login)
Create popup.

**PUT** `/v1/popups/:id` (Requires Login)
Update popup.

**DELETE** `/v1/popups/:id` (Requires Login)
Delete popup.

---

### Notes

**POST** `/v1/notes` (Requires Login)
Create note.

**GET** `/v1/notes` (Requires Login)
Get all notes.

**GET** `/v1/notes/:id` (Requires Login)
Get note by ID.

**PUT** `/v1/notes/:id` (Requires Login)
Update note.

**DELETE** `/v1/notes/:id` (Requires Login)
Delete note.

---

### Settings

**GET** `/v1/settings` (Requires Login)
Get application settings.

**PUT** `/v1/settings/:id` (Requires Login)
Update settings.

---

### Dashboard

**GET** `/v1/dashboard` (Requires Login)
Get dashboard data.

---

### Leads

**POST** `/v1/leads`
Create lead.

**GET** `/v1/leads` (Requires Login)
Get all leads.

**GET** `/v1/leads/:id` (Requires Login)
Get lead by ID.

**PUT** `/v1/leads/:id` (Requires Login)
Update lead.

**DELETE** `/v1/leads/:id` (Requires Login)
Delete lead.

---

## Response Status Codes Reference

| Code | Meaning               | Usage                                         |
| ---- | --------------------- | --------------------------------------------- |
| 200  | OK                    | Successful GET/PUT/PATCH request              |
| 201  | Created               | Successful POST request creating new resource |
| 204  | No Content            | Successful DELETE request                     |
| 400  | Bad Request           | Invalid request body or parameters            |
| 401  | Unauthorized          | Missing or invalid authentication token       |
| 403  | Forbidden             | User lacks required permissions               |
| 404  | Not Found             | Resource doesn't exist                        |
| 409  | Conflict              | Resource already exists or conflict detected  |
| 500  | Internal Server Error | Server-side error occurred                    |

---

## Request/Response Examples

### Successful Request

```javascript
fetch("http://localhost:5000/v1/products", {
  method: "GET",
  credentials: "include", // Include cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### Protected Endpoint Request

```javascript
// Login first
const loginRes = await fetch("http://localhost:5000/v1/auth/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

// Then make authenticated requests
const appointmentsRes = await fetch("http://localhost:5000/v1/appointments", {
  method: "GET",
  credentials: "include", // Cookies are automatically included
  headers: { "Content-Type": "application/json" },
});
```

### Error Response

```json
{
  "error": "Unauthorized",
  "code": "AUTH_REQUIRED",
  "message": "Please login to access this resource",
  "statusCode": 401
}
```

---

## Pagination

Endpoints that support pagination typically use:

**Query Parameters:**

- `page`: Page number (default: 1, starts from 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## File Upload

Endpoints supporting file uploads use `FormData`:

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("name", "Product Name");
formData.append("description", "Product description");

fetch("http://localhost:5000/v1/products", {
  method: "POST",
  credentials: "include",
  body: formData, // Don't set Content-Type header for FormData
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

**Important Notes:**

- Do NOT set `Content-Type` header when using FormData
- Maximum file size: 50MB
- Supported formats depend on the endpoint

---

## Rate Limiting

Currently no rate limiting is implemented. Recommended to implement for production:

- API endpoints: 100 requests per minute per IP
- Authentication endpoints: 5 requests per minute per IP

---

## CORS Configuration

The API allows requests from:

- `http://localhost:3000` (Development)
- `https://wellness-fuel.vercel.app` (Production)

Requests include credentials (cookies):

```javascript
credentials: "include";
```

---

## Environment Variables Required

```
MONGODB_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
NODE_ENV=development
S3_BUCKET_NAME=your_s3_bucket
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
```

---

## Webhook Events (Planned)

Planned webhooks for future implementation:

- `order.created` - When a new order is placed
- `order.shipped` - When order is shipped
- `appointment.booked` - When an appointment is booked
- `appointment.completed` - When appointment is completed
- `payment.completed` - When payment is successful
- `payment.failed` - When payment fails
- `user.registered` - When a new user registers
- `prescription.created` - When prescription is created

---

## SDK & Client Libraries

### JavaScript/Node.js Example

```javascript
// Simple API client wrapper
const apiClient = {
  baseURL: "http://localhost:5000/v1",

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  },

  // User endpoints
  async getUser(id) {
    return this.request(`/users/${id}`);
  },

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Product endpoints
  async getProducts(page = 1, limit = 10) {
    return this.request(`/products?page=${page}&limit=${limit}`);
  },

  async getProductBySlug(slug) {
    return this.request(`/products/slug/${slug}`);
  },

  // Order endpoints
  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // Authentication
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return this.request("/auth/logout", { method: "POST" });
  },
};

// Usage
await apiClient.login("user@example.com", "password123");
const products = await apiClient.getProducts();
```

---

## Troubleshooting

### Common Issues

**Issue**: 401 Unauthorized on protected routes

- **Cause**: Not authenticated or token expired
- **Solution**:
  - Ensure you're logged in first
  - Use `credentials: 'include'` in fetch requests
  - Check that cookies are being sent
  - Verify JWT token is not expired

**Issue**: CORS errors

- **Cause**: Frontend URL not in allowed origins
- **Solution**:
  - Check that your frontend URL is in the allowed origins list
  - Frontend URL must match exactly (including protocol and port)
  - Modify allowed origins in `backend/index.js` if needed

**Issue**: File upload fails

- **Cause**: Incorrect Content-Type or file size
- **Solution**:
  - Use FormData and don't set Content-Type header
  - Ensure file size is less than 50MB
  - Check that form fields match endpoint requirements

**Issue**: 400 Bad Request

- **Cause**: Invalid request body or missing required fields
- **Solution**:
  - Verify all required fields are included
  - Check request body structure matches documentation
  - Use browser DevTools to inspect actual request
  - Check backend console for specific error details

**Issue**: 404 Not Found

- **Cause**: Resource doesn't exist or endpoint path is wrong
- **Solution**:
  - Verify resource ID exists in database
  - Check endpoint URL spelling
  - Ensure you're using the correct HTTP method

**Issue**: 500 Internal Server Error

- **Cause**: Server-side error
- **Solution**:
  - Check backend server logs for details
  - Ensure database connection is working
  - Verify environment variables are set correctly
  - Check for database errors or timeouts

---

## Support & References

For API issues or questions:

- Review this documentation first
- Check controller implementations in `backend/controllers/`
- Review route definitions in `backend/routes/`
- Examine data models in `backend/models/`
- Check middleware in `backend/middleWares/`

### Key Files

| File                             | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `backend/index.js`               | Express app setup and route registration |
| `backend/config/db.js`           | MongoDB connection configuration         |
| `backend/config/s3Config.js`     | AWS S3 file upload configuration         |
| `backend/middleWares/isLogin.js` | Authentication middleware                |
| `backend/controllers/`           | Business logic for each endpoint         |
| `backend/routes/`                | Route definitions                        |
| `backend/models/`                | MongoDB schema definitions               |

---

## API Best Practices

1. **Always use HTTPS in production**
2. **Include credentials with authenticated requests**: `credentials: 'include'`
3. **Handle errors gracefully** - Check response status and error messages
4. **Use pagination** - Don't fetch all records at once
5. **Validate input data** - Perform client-side validation before sending
6. **Handle token expiration** - Redirect to login on 401 response
7. **Use appropriate HTTP methods**: GET (retrieve), POST (create), PUT (update), DELETE (remove)
8. **Include meaningful error messages** in responses

---

## Version History

| Version | Date       | Changes                                       |
| ------- | ---------- | --------------------------------------------- |
| 1.0     | 2026-02-01 | Complete API documentation with all endpoints |
| -       | 2026-01-28 | Initial API documentation                     |

---

**Last Updated:** February 1, 2026  
**API Version:** v1  
**Node Version:** v16+ recommended  
**Database:** MongoDB  
**Authentication:** JWT (stored in cookies)  
**Maintained by:** Wellness Backend Team  
**Documentation URL:** Available at `backend/API_DOCUMENTATION_UPDATED.md`
