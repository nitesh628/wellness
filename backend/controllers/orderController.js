// import mongoose from 'mongoose';
// import Order from '../models/orderModel.js';


// const isId = (id) => mongoose.isValidObjectId(id);

// // Create
// export async function createOrder(req, res) {
//   try {
//     const order = await Order.create(req.body);
//     const saved = await order.populate([
//       { path: 'user', select: 'firstName lastName email' },
//       { path: 'items.product', select: 'name price' },
//       { path: 'address', select: 'address state city pinCode' }
//     ]);
//     res.status(201).json({ success: true, data: saved });
//   } catch (err) {
//     if (err.code === 11000 && err.keyPattern?.orderNumber) {
//       return res.status(409).json({ success: false, message: 'Order number already exists' });
//     }
//     res.status(400).json({ success: false, message: err.message });
//   }
// }

// // List with filters and pagination
// export async function listOrders(req, res) {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       status,
//       paymentStatus,
//       user,
//       q,
//       from,
//       to,
//       sort = '-createdAt'
//     } = req.query;

//     const filter = {};
//     if (status) filter.status = status;
//     if (paymentStatus) filter.paymentStatus = paymentStatus;
//     if (user && isId(user)) filter.user = user;
//     if (q) {
//       filter.$or = [
//         { orderNumber: new RegExp(q, 'i') },
//         { trackingNumber: new RegExp(q, 'i') }
//       ];
//     }
//     if (from || to) {
//       filter.createdAt = {};
//       if (from) filter.createdAt.$gte = new Date(from);
//       if (to) filter.createdAt.$lte = new Date(to);
//     }

//     const [orders, total] = await Promise.all([
//       Order.find(filter)
//         .populate({ path: 'user', select: 'firstName lastName email' })
//         .populate({ path: 'items.product', select: 'name price' })
//         .populate({ path: 'address', select: 'address state city pinCode' })
//         .sort(sort)
//         .skip((page - 1) * limit)
//         .limit(Number(limit)),
//       Order.countDocuments(filter)
//     ]);

//     res.json({
//       success: true,
//       data: orders,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       }
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// }

// // Get one
// export async function getOrderById(req, res) {
//   try {
//     const { id } = req.params;
//     if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

//     const order = await Order.findById(id)
//       .populate({ path: 'user', select: 'firstName lastName email' })
//       .populate({ path: 'items.product', select: 'name price' })
//       .populate({ path: 'address', select: 'address state city pinCode' });

//     if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
//     res.json({ success: true, data: order });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// }

// // Update
// export async function updateOrder(req, res) {
//   try {
//     const { id } = req.params;
//     if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

//     const updated = await Order.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true
//     })
//       .populate({ path: 'user', select: 'firstName lastName email' })
//       .populate({ path: 'items.product', select: 'name price' })
//       .populate({ path: 'address', select: 'address state city pinCode' });

//     if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
//     res.json({ success: true, message: 'Order updated', data: updated });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// }

// // Delete
// export async function deleteOrder(req, res) {
//   try {
//     const { id } = req.params;
//     if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid id' });

//     const deleted = await Order.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
//     res.json({ success: true, message: 'Order deleted', id });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// }


import mongoose from 'mongoose';
import Order from '../models/orderModel.js';

const isId = (id) => mongoose.isValidObjectId(id);

// Create Order - FIXED VERSION
export async function createOrder(req, res) {
  try {
    console.log('📥 Received order data:', JSON.stringify(req.body, null, 2));

    // Validate required fields before creating
    if (!req.body.orderNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order number is required' 
      });
    }

    if (!req.body.user || !isId(req.body.user)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid user ID is required' 
      });
    }

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order must have at least one item' 
      });
    }

    // Create the order (this already saves to DB)
    const order = await Order.create(req.body);
    console.log('✅ Order created with ID:', order._id);

    // Populate references
    const populated = await Order.findById(order._id)
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price' })
      .populate({ path: 'shippingAddress', select: 'address state city pinCode' })
      .populate({ path: 'billingAddress', select: 'address state city pinCode' });

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

// List with filters and pagination
export async function listOrders(req, res) {
  try {
    const {
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

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (user && isId(user)) filter.user = user;
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
        .populate({ path: 'items.product', select: 'name price' })
        .populate({ path: 'shippingAddress', select: 'address state city pinCode' })
        .populate({ path: 'billingAddress', select: 'address state city pinCode' })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
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

// Count the no. of Order
export const countOrders = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to count orders',
      error: error.message
    });
  }
};

// Get one
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    if (!isId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order ID' 
      });
    }

    const order = await Order.findById(id)
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price' })
      .populate({ path: 'shippingAddress', select: 'address state city pinCode' })
      .populate({ path: 'billingAddress', select: 'address state city pinCode' });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('❌ Error fetching order:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Failed to fetch order' 
    });
  }
}

// Update
export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    if (!isId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order ID' 
      });
    }

    const updated = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price' })
      .populate({ path: 'shippingAddress', select: 'address state city pinCode' })
      .populate({ path: 'billingAddress', select: 'address state city pinCode' });

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

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

// Delete
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    if (!isId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order ID' 
      });
    }

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

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