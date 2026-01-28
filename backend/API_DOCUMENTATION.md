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
15. [Other Endpoints](#other-endpoints)

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
    /* user details */
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

---

### Check Authentication Status

**POST** `/v1/auth/check`

Verify if user is authenticated. Requires login.

**Response:** `200 OK`

```json
{
  "authenticated": true,
  "user": {
    /* user details */
  }
}
```

---

### Logout

**POST** `/v1/auth/logout`

Logout the current user. Requires login.

**Response:** `200 OK`

---

### Reset Password

**POST** `/v1/auth/resetpassword`

Reset user password. Requires login.

**Request Body:**

```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response:** `200 OK`

---

## Users & Doctors & Influencers

### Users

#### Create User

**POST** `/v1/users`

Create a new user. Supports image upload.

**Request Body (Form Data):**

- `name`: string
- `email`: string
- `password`: string
- `imageUrl`: file (optional)

**Response:** `201 Created`

---

#### Get All Users

**GET** `/v1/users`

Retrieve all users.

**Query Parameters:**

- `page`: number (optional)
- `limit`: number (optional)

**Response:** `200 OK`

```json
{
  "users": [
    /* array of users */
  ],
  "total": 100
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
  "imageUrl": "url"
}
```

---

#### Update User

**PUT** `/v1/users/:id`

Update user details. Supports image upload.

**Request Body (Form Data):**

- `name`: string (optional)
- `email`: string (optional)
- `imageUrl`: file (optional)

**Response:** `200 OK`

---

#### Delete User

**DELETE** `/v1/users/:id`

Delete a user.

**Response:** `200 OK` / `204 No Content`

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
  "specialization": "Cardiology",
  "licenseNumber": "12345"
}
```

**Response:** `201 Created`

---

#### Get All Doctors

**GET** `/v1/users/doctor`

Retrieve all doctors.

**Response:** `200 OK`

---

#### Get Doctor by ID

**GET** `/v1/users/doctor/:id`

Retrieve a specific doctor.

**Response:** `200 OK`

---

#### Update Doctor

**PUT** `/v1/users/doctor/:id`

Update doctor details.

**Response:** `200 OK`

---

#### Toggle Doctor Status

**GET** `/v1/users/doctor/isactive/:id`

Toggle doctor active/inactive status.

**Response:** `200 OK`

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
  "followers": 50000,
  "niche": "Health & Wellness"
}
```

**Response:** `201 Created`

---

#### Get All Influencers

**GET** `/v1/users/influencer`

Retrieve all influencers.

**Response:** `200 OK`

---

#### Get Influencer by ID

**GET** `/v1/users/influencer/:id`

Retrieve a specific influencer.

**Response:** `200 OK`

---

#### Update Influencer

**PUT** `/v1/users/influencer/:id`

Update influencer details.

**Response:** `200 OK`

---

#### Toggle Influencer Status

**GET** `/v1/users/influencer/isactive/:id`

Toggle influencer active/inactive status.

**Response:** `200 OK`

---

## Products

### Create Product

**POST** `/v1/products`

Create a new product.

**Request Body:**

```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "category_id",
  "stock": 50,
  "images": ["url1", "url2"]
}
```

**Response:** `201 Created`

---

### Get All Products

**GET** `/v1/products`

Retrieve all products with pagination and filtering.

**Query Parameters:**

- `page`: number
- `limit`: number
- `category`: string
- `search`: string

**Response:** `200 OK`

---

### Get Product by ID

**GET** `/v1/products/:id`

Retrieve a specific product.

**Response:** `200 OK`

---

### Get Product by Slug

**GET** `/v1/products/slug/:slug`

Retrieve a product by its slug.

**Response:** `200 OK`

---

### Get Products by Category

**GET** `/v1/products/category/:category`

Retrieve all products in a specific category.

**Response:** `200 OK`

---

### Update Product

**PUT** `/v1/products/:id`

Update product details.

**Request Body:**

```json
{
  "name": "Updated Name",
  "price": 109.99
}
```

**Response:** `200 OK`

---

### Update Stock

**PATCH** `/v1/products/:id/stock`

Update product stock quantity.

**Request Body:**

```json
{
  "quantity": 100
}
```

**Response:** `200 OK`

---

### Delete Product

**DELETE** `/v1/products/:id`

Delete a product.

**Response:** `200 OK` / `204 No Content`

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
      "price": 99.99
    }
  ],
  "totalAmount": 199.98,
  "status": "pending"
}
```

**Response:** `201 Created`

---

### Get All Orders

**GET** `/v1/orders`

Retrieve all orders.

**Query Parameters:**

- `page`: number
- `limit`: number
- `status`: string

**Response:** `200 OK`

---

### Get Order by ID

**GET** `/v1/orders/:id`

Retrieve a specific order.

**Response:** `200 OK`

---

### Update Order

**PUT** `/v1/orders/:id`

Update order details.

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "track123"
}
```

**Response:** `200 OK`

---

### Delete Order

**DELETE** `/v1/orders/:id`

Delete an order.

**Response:** `200 OK` / `204 No Content`

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
  "reason": "Consultation"
}
```

**Response:** `201 Created`

---

### Get All Appointments

**GET** `/v1/appointments` (Requires Login)

Retrieve all appointments.

**Query Parameters:**

- `page`: number
- `limit`: number
- `doctorId`: string
- `status`: string

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
  "time": "10:30 AM"
}
```

**Response:** `200 OK`

---

### Delete Appointment

**DELETE** `/v1/appointments/:id` (Requires Login)

Delete an appointment.

**Response:** `200 OK` / `204 No Content`

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
  "cancelled": 10
}
```

---

### Export Appointments

**GET** `/v1/appointments/export` (Requires Login)

Export appointments as CSV/PDF.

**Query Parameters:**

- `format`: "csv" or "pdf"

**Response:** File download

---

## Blogs

### Create Blog

**POST** `/v1/blogs/create` (Requires Login)

Create a new blog post.

**Request Body:**

```json
{
  "title": "Blog Title",
  "content": "Blog content here",
  "author": "Author Name",
  "tags": ["tag1", "tag2"]
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

**Response:** `200 OK`

---

### Get Blog by ID

**GET** `/v1/blogs/:id` (Requires Login)

Retrieve a specific blog post.

**Response:** `200 OK`

---

### Update Blog

**PUT** `/v1/blogs/:id` (Requires Login)

Update blog post.

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:** `200 OK`

---

### Delete Blog

**DELETE** `/v1/blogs/:id` (Requires Login)

Delete a blog post.

**Response:** `200 OK` / `204 No Content`

---

## Categories

### Get All Categories

**GET** `/v1/categories`

Retrieve all product categories.

**Response:** `200 OK`

```json
{
  "categories": [
    { "_id": "id1", "name": "Electronics" },
    { "_id": "id2", "name": "Health" }
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
  "description": "Category description"
}
```

**Response:** `201 Created`

---

### Update Category

**PUT** `/v1/categories/:id`

Update category details.

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
  "review": "Great product!"
}
```

**Response:** `201 Created`

---

### Get Ratings

**GET** `/v1/ratings`

Retrieve all ratings.

**Query Parameters:**

- `productId`: string

**Response:** `200 OK`

---

### Create Review

**POST** `/v1/reviews`

Create a product review.

**Request Body:**

```json
{
  "productId": "product_id",
  "userId": "user_id",
  "title": "Review Title",
  "content": "Review content",
  "rating": 4
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

**Response:** `200 OK`

---

## Addresses

### Create Address

**POST** `/v1/addresses`

Create a user address.

**Request Body:**

```json
{
  "userId": "user_id",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
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

---

### Get Address by ID

**GET** `/v1/addresses/:id`

Retrieve a specific address.

**Response:** `200 OK`

---

### Update Address

**PUT** `/v1/addresses/:id`

Update address details.

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
  "discountPercentage": 20,
  "expiryDate": "2026-12-31",
  "maxUses": 100,
  "minOrderAmount": 50
}
```

**Response:** `201 Created`

---

### Get All Coupons

**GET** `/v1/coupons`

Retrieve all coupons.

**Response:** `200 OK`

---

### Get Coupon by Code

**GET** `/v1/coupons/:code`

Retrieve a coupon by code.

**Response:** `200 OK`

---

### Update Coupon

**PUT** `/v1/coupons/:id`

Update coupon details.

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
  "expiryDate": "12/25"
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

---

### Create Razorpay Order

**POST** `/v1/razorpay/order`

Create a Razorpay payment order.

**Request Body:**

```json
{
  "amount": 100,
  "currency": "INR"
}
```

**Response:** `200 OK`

```json
{
  "id": "order_123456",
  "amount": 10000,
  "currency": "INR"
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
  "message": "Payment verified successfully"
}
```

---

## Customers

### Create Customer

**POST** `/v1/customer`

Create a customer profile.

**Request Body:**

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "555-1234"
}
```

**Response:** `201 Created`

---

### Get Customers

**GET** `/v1/customer`

Retrieve all customers.

**Response:** `200 OK`

---

### Get Customer by ID

**GET** `/v1/customer/:id`

Retrieve a specific customer.

**Response:** `200 OK`

---

### Update Customer

**PUT** `/v1/customer/:id`

Update customer details.

**Response:** `200 OK`

---

### Delete Customer

**DELETE** `/v1/customer/:id`

Delete a customer.

**Response:** `200 OK`

---

## Prescriptions & Reports

### Create Prescription

**POST** `/v1/prescriptions`

Create a medical prescription.

**Request Body:**

```json
{
  "doctorId": "doctor_id",
  "patientId": "patient_id",
  "medicines": ["medicine1", "medicine2"],
  "dosage": "2 times daily",
  "duration": "7 days"
}
```

**Response:** `201 Created`

---

### Get Prescriptions

**GET** `/v1/prescriptions`

Retrieve all prescriptions.

**Response:** `200 OK`

---

### Get Prescription by ID

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
  "findings": "Report findings",
  "date": "2026-01-28"
}
```

**Response:** `201 Created`

---

### Get Reports

**GET** `/v1/reports`

Retrieve all reports.

**Response:** `200 OK`

---

### Get Report by ID

**GET** `/v1/reports/:id`

Retrieve a specific report.

**Response:** `200 OK`

---

## Influencer Features

### Influencer Referrals

**POST** `/v1/influencer-referrals`

Create an influencer referral.

**Request Body:**

```json
{
  "influencerId": "influencer_id",
  "referredUserId": "user_id",
  "commission": 5.0
}
```

**Response:** `201 Created`

---

**GET** `/v1/influencer-referrals`

Get all referrals.

**Response:** `200 OK`

---

### Influencer Notes

**POST** `/v1/influencer-notes`

Create an influencer note.

**Request Body:**

```json
{
  "influencerId": "influencer_id",
  "content": "Note content"
}
```

**Response:** `201 Created`

---

**GET** `/v1/influencer-notes`

Get all notes.

**Response:** `200 OK`

---

### Influencer Reports

**POST** `/v1/influencer-reports`

Create an influencer report.

**Request Body:**

```json
{
  "influencerId": "influencer_id",
  "reportData": {}
}
```

**Response:** `201 Created`

---

**GET** `/v1/influencer-reports`

Get all reports.

**Response:** `200 OK`

---

### Influencer Settings

**GET** `/v1/influencer-settings/:influencerId`

Get influencer settings.

**Response:** `200 OK`

---

**PUT** `/v1/influencer-settings/:influencerId`

Update influencer settings.

**Response:** `200 OK`

---

## Other Endpoints

### Patients

**POST** `/v1/patients` - Create patient
**GET** `/v1/patients` - Get all patients
**GET** `/v1/patients/:id` - Get patient by ID
**PUT** `/v1/patients/:id` - Update patient
**DELETE** `/v1/patients/:id` - Delete patient

---

### Sessions

**POST** `/v1/sessions` - Create session
**GET** `/v1/sessions` - Get all sessions
**GET** `/v1/sessions/:id` - Get session by ID
**DELETE** `/v1/sessions/:id` - Delete session

---

### Newsletter

**POST** `/v1/newsletters` - Subscribe to newsletter
**GET** `/v1/newsletters` - Get subscribers
**DELETE** `/v1/newsletters/:id` - Unsubscribe

---

### Popups

**GET** `/v1/popups` - Get all popups
**POST** `/v1/popups` - Create popup
**PUT** `/v1/popups/:id` - Update popup
**DELETE** `/v1/popups/:id` - Delete popup

---

### Notes

**POST** `/v1/notes` - Create note
**GET** `/v1/notes` - Get all notes
**GET** `/v1/notes/:id` - Get note by ID
**PUT** `/v1/notes/:id` - Update note
**DELETE** `/v1/notes/:id` - Delete note

---

### Settings

**GET** `/v1/settings` - Get settings
**PUT** `/v1/settings/:id` - Update settings

---

### Dashboard

**GET** `/v1/dashboard` - Get dashboard data
**GET** `/v1/dashboard/stats` - Get dashboard statistics

---

### Leads

**POST** `/v1/leads` - Create lead
**GET** `/v1/leads` - Get all leads
**GET** `/v1/leads/:id` - Get lead by ID
**PUT** `/v1/leads/:id` - Update lead
**DELETE** `/v1/leads/:id` - Delete lead

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Successful GET/PUT/PATCH request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## CORS Configuration

The API allows requests from:

- `http://localhost:3000` (Development)
- `https://wellness-fuel.vercel.app` (Production)

Requests include credentials (cookies).

---

## Environment Variables Required

```
MONGODB_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
```

---

**Last Updated:** January 28, 2026
