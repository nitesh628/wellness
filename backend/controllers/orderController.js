import mongoose from 'mongoose';
import Order from '../models/orderModel.js';

const isId = (id) => mongoose.isValidObjectId(id);

 
export async function createOrder(req, res) {
  try {
    console.log('📥 Received order data from user:', req.user._id);

    const userId = req.user._id;

    if (!req.body.orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required'
      });
    }

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item'
      });
    }

    const productIds = req.body.items.map(item => item.product);
    if (new Set(productIds).size !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate products in order'
      });
    }

    // Validate each item has valid quantity and price
    for (let item of req.body.items) {
      if (!item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for item ${item.product}`
        });
      }
      if (item.price === undefined || item.price < 0 || !Number.isFinite(item.price)) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for item ${item.product}`
        });
      }
    }

    if (!req.body.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    const orderData = {
      ...req.body,
      user: userId
    };

    // Create the order
    const order = await Order.create(orderData);
    console.log('✅ Order created with ID:', order._id);

    // Populate references
    const populated = await Order.findById(order._id)
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price imageUrl' });

    console.log('✅ Order saved and populated successfully');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populated
    });

  } catch (err) {
    console.error('❌ Error creating order:', err);

    // Handle duplicate orderNumber
    if (err.code === 11000 && err.keyPattern?.orderNumber) {
      return res.status(409).json({
        success: false,
        message: 'Order number already exists'
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid ${err.path}: ${err.value}`
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

/**
 * Get User's Own Orders - Users can only see their own orders
 * 
 * @route GET /v1/orders/user/my-orders
 * @access Private - Authenticated users
 * @query {page, limit, status, paymentStatus, sort}
 */
export async function getUserOrders(req, res) {
  try {
    const MAX_LIMIT = 100;
    const userId = req.user._id;

    let {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      sort = '-createdAt'
    } = req.query;

    // Enforce max limit
    limit = Math.min(Number(limit) || 10, MAX_LIMIT);
    page = Math.max(Number(page) || 1, 1);

    console.log('📋 Fetching orders for user:', userId);

    // Build filter with user's ID
    const filter = { user: userId };

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate({ path: 'user', select: 'firstName lastName email' })
        .populate({ path: 'items.product', select: 'name price imageUrl' })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    console.log(`✅ Found ${orders.length} orders for user`);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (err) {
    console.error('❌ Error fetching user orders:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch orders'
    });
  }
}

/**
 * Get All Orders - Admin only endpoint
 * 
 * @route GET /v1/orders
 * @access Private - Admin users only
 * @query {page, limit, userId, status, paymentStatus, q, from, to, sort}
 */
export async function listOrders(req, res) {
  try {
    const MAX_LIMIT = 100;

    let {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      user,
      q,
      from,
      to,
      sort = '-createdAt'
    } = req.query;

    // Enforce max limit
    limit = Math.min(Number(limit) || 10, MAX_LIMIT);
    page = Math.max(Number(page) || 1, 1);

    const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';

    if (isAdmin) {
      console.log('📊 Admin fetching all orders');
    } else {
      console.log('📋 Regular user fetching their orders');
    }

    const filter = {};

    // Regular users can only see their own orders
    if (!isAdmin) {
      filter.user = req.user._id;
    } else if (user && isId(user)) {
      // Admins can filter by specific user if provided
      filter.user = user;
    }

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (q) {
      filter.$or = [
        { orderNumber: new RegExp(q, 'i') },
        { trackingNumber: new RegExp(q, 'i') }
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate({ path: 'user', select: 'firstName lastName email' })
        .populate({ path: 'items.product', select: 'name price imageUrl' })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter)
    ]);

    console.log(`✅ Found ${orders.length} ${isAdmin ? 'total' : 'user'} orders`);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch orders'
    });
  }
}

/**
 * Count Orders - Admin only
 * 
 * @route GET /v1/orders/admin/count
 * @access Private - Admin only
 */
export const countOrders = async (req, res) => {
  try {
    const userRole = req.user.role;

    // Check if user is admin
    const isAdmin = ['super_admin', 'admin'].includes(userRole);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view order counts'
      });
    }

    const count = await Order.countDocuments();
    console.log('✅ Total orders count retrieved:', count);

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('❌ Error counting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to count orders',
      error: error.message
    });
  }
};

/**
 * Get Single Order by ID - With access control
 * 
 * @route GET /v1/orders/:id
 * @access Private - Owner or Admin
 * @param {string} id - Order ID
 */
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!isId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.findById(id)
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price imageUrl' });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Access control: Check if user is owner or admin
    const isAdmin = ['super_admin', 'admin'].includes(userRole);
    const isOwner = order.user._id.toString() === userId.toString();

    if (!isAdmin && !isOwner) {
      console.warn('⚠️ Unauthorized order access attempt by user:', userId);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }

    console.log('✅ Order retrieved:', order._id);

    res.json({
      success: true,
      data: order
    });

  } catch (err) {
    console.error('❌ Error fetching order:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch order'
    });
  }
}

/**
 * Update Order - Admin only (or limited user updates for status)
 * 
 * @route PUT /v1/orders/:id
 * @access Private - Admin only
 * @param {string} id - Order ID
 * @body {status, paymentStatus, notes, etc.}
 */
export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (!isId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    // Check if user is admin
    const isAdmin = ['super_admin', 'admin'].includes(userRole);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update orders'
      });
    }

    // Prevent updating sensitive fields
    const restrictedFields = ['user', 'totalAmount', 'subtotal'];
    const updateData = { ...req.body };

    restrictedFields.forEach(field => {
      delete updateData[field];
    });

    const updated = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price imageUrl' });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('✅ Order updated:', id);

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('❌ Error updating order:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update order'
    });
  }
}

/**
 * Delete Order - Admin only
 * 
 * @route DELETE /v1/orders/:id
 * @access Private - Admin only
 * @param {string} id - Order ID
 */
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const adminUserId = req.user._id;

    if (!isId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const isAdmin = ['super_admin', 'admin'].includes(userRole);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete orders'
      });
    }

    // Soft delete: Mark as deleted instead of removing
    const deleted = await Order.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: adminUserId
      },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('✅ Order soft-deleted:', id, 'by admin:', adminUserId);

    res.json({
      success: true,
      message: 'Order deleted successfully',
      id
    });
  } catch (err) {
    console.error('❌ Error deleting order:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete order'
    });
  }
}