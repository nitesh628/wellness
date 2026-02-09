import { Router } from "express";
import {
    countOrders,
    createOrder,
    deleteOrder,
    getOrderById,
    listOrders,
    updateOrder,
    getUserOrders
} from "../controllers/orderController.js";
import { isLogin } from "../middleWares/isLogin.js";
import { isAdmin } from "../middleWares/isAdmin.js";

const router = Router();

/**
 * Order Routes with Role-Based Access Control
 * 
 * Public Routes: None
 * User Routes: Create order, view own orders
 * Admin Routes: View all orders, update/delete orders
 */

// ==== USER ROUTES (Authenticated users) ====

// Create Order - User creates their own order
// POST /v1/orders
router.post('/', isLogin, createOrder);

// ⚠️ IMPORTANT: Define literal paths BEFORE parameterized paths (:id)
// This prevents /v1/orders from matching as /:id where id="orders"

// Get User's Own Orders - Users can only see their own orders
// GET /v1/orders/user/my-orders
router.get('/user/my-orders', isLogin, getUserOrders);

// ==== ADMIN ROUTES (Authenticated + Admin role) ====

// Count Orders - Admin only
// GET /v1/orders/admin/count
router.get('/admin/count', isLogin, isAdmin, countOrders);

// Get Orders - Users see their own, admins see all
// GET /v1/orders (MUST come before /:id)
// Note: isAdmin check is done inside the controller based on user role
router.get('/', isLogin, listOrders);

// Get Single Order - Owner or Admin can view
// GET /v1/orders/:id (PARAMETERIZED - comes last to avoid matching /orders)
router.get('/:id', isLogin, getOrderById);

// Update Order - Admin only
// PUT /v1/orders/:id
router.put('/:id', isLogin, isAdmin, updateOrder);

// Delete Order - Admin only
// DELETE /v1/orders/:id
router.delete('/:id', isLogin, isAdmin, deleteOrder);

export default router;
