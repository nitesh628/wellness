// import { model, Schema } from 'mongoose';

// const OrderItemSchema = new Schema(
//   {
//     product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//     quantity: { type: Number, required: true, default: 1 },
//     price: { type: Number, required: true },
//     total: { type: Number, required: true }
//   },
//   { _id: false }
// );

// const OrderSchema = new Schema(
//   {
//     orderNumber: { type: String, required: true, unique: true },
//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     shippingAddress: {
//       type: Schema.Types.ObjectId,
//       ref: 'Address'
//     },
//     razorpayOrderId: { type: String },
//     razorpayPaymentId: { type: String },
//     razorpaySignature: { type: String },
//     items: { type: [OrderItemSchema], default: [] },
//     paymentMethod: {
//       type: String,
//       enum: ['Credit Card', 'Debit Card', 'NetBanking', 'UPI', 'COD'],
//       default: 'Credit Card'
//     },
//     paymentStatus: {
//       type: String,
//       enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
//       default: 'Pending'
//     },
//     status: {
//       type: String,
//       enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
//       default: 'Pending'
//     },
//     trackingNumber: { type: String },
//     shippingCost: { type: Number, default: 0 },
//     subtotal: { type: Number, default: 0 },
//     totalAmount: { type: Number, default: 0 },
//     notes: { type: String },
//     isCouponApplied: { type: Boolean, default: false },
//     couponCode: { type: String },
//     discountType: { type: String, enum: ['Percentage', 'Fixed'] },
//     discountValue: { type: Number, default: 0 },
//     billingAddress: { type: Schema.Types.ObjectId, ref: 'Address' }
//   },
//   { timestamps: true }
// );

// // Compute subtotal and total before validation/save
// OrderSchema.pre('validate', function (next) {
//   try {
//     if (Array.isArray(this.items) && this.items.length > 0) {
//       this.subtotal = this.items.reduce((sum, it) => {
//         const itemTotal = typeof it.total === 'number' ? it.total : (it.price || 0) * (it.quantity || 0);
//         return sum + itemTotal;
//       }, 0);
//     } else {
//       this.subtotal = 0;
//     }

//     this.totalAmount = this.subtotal + (this.shippingCost || 0);
//     this.isPaid = this.paymentStatus === 'Paid';
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// const Order = model('Order', OrderSchema);

// export default Order;


import { model, Schema } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const OrderAddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  landmark: { type: String }
}, { _id: false });

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      trim: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    shippingAddress: {
      type: OrderAddressSchema,
      required: true
    },
    billingAddress: {
      type: OrderAddressSchema
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    items: {
      type: [OrderItemSchema],
      default: [],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['Credit Card', 'Debit Card', 'NetBanking', 'UPI', 'COD', 'Online'],
        message: '{VALUE} is not a valid payment method'
      },
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Paid', 'Pending', 'Failed', 'Refunded'],
        message: '{VALUE} is not a valid payment status'
      },
      default: 'Pending'
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'Pending'
    },
    trackingNumber: { type: String, trim: true },
    shippingCost: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true },
    isCouponApplied: { type: Boolean, default: false },
    couponCode: { type: String, trim: true },
    discountType: {
      type: String,
      enum: ['Percentage', 'Fixed']
    },
    discountValue: { type: Number, default: 0, min: 0 },
    isPaid: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// FIXED: Use pre('save') instead of pre('validate')
// This ensures calculations happen before saving
OrderSchema.pre('save', function (next) {
  try {
    console.log('🔄 Running pre-save hook for order:', this.orderNumber);

    // Calculate item totals
    if (Array.isArray(this.items) && this.items.length > 0) {
      this.items.forEach(item => {
        item.total = (item.price || 0) * (item.quantity || 0);
      });

      // Calculate subtotal
      this.subtotal = this.items.reduce((sum, item) => {
        return sum + (item.total || 0);
      }, 0);
    } else {
      this.subtotal = 0;
    }

    // Apply discount if coupon is applied
    let discountAmount = 0;
    if (this.isCouponApplied && this.discountValue > 0) {
      if (this.discountType === 'Percentage') {
        discountAmount = (this.subtotal * this.discountValue) / 100;
      } else if (this.discountType === 'Fixed') {
        discountAmount = this.discountValue;
      }
    }

    // Calculate total
    this.totalAmount = Math.max(0, this.subtotal - discountAmount + (this.shippingCost || 0));

    // Set isPaid based on payment status
    this.isPaid = this.paymentStatus === 'Paid';

    console.log('💰 Calculated values:', {
      subtotal: this.subtotal,
      discount: discountAmount,
      shipping: this.shippingCost,
      total: this.totalAmount
    });

    next();
  } catch (err) {
    console.error('❌ Error in pre-save hook:', err);
    next(err);
  }
});

// Index for faster queries
// OrderSchema.index({ orderNumber: 1 }); // Removed to avoid duplicate index warning
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual for order age
OrderSchema.virtual('orderAge').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

const Order = model('Order', OrderSchema);

export default Order;