import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import axios from "axios";
import { getApiV1BaseUrl } from "../../utils/api";

const API_BASE_URL = getApiV1BaseUrl();

// Define the Order type
export interface Order {
  _id?: string;
  orderNumber: string;
  user: string;
  shippingAddress: string;
  billingAddress: string;
  items: [
    {
      product: string;
      quantity: number;
      price: number;
      total: number;
    },
  ];
  paymentMethod: "Credit Card" | "Debit Card" | "UPI" | "Net Banking" | "COD";
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed";
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Returned";
  trackingNumber?: string;
  shippingCost: string;
  subTotal: number;
  totalAmount: number;
  notes?: string;
  isCouponApplied: boolean;
  couponCode?: string;
  couponDiscount: number;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  createdAt: string;
  updatedAt: string;
}

// Define the state structure
interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status:
      | ""
      | "Pending"
      | "Processing"
      | "Shipped"
      | "Delivered"
      | "Cancelled"
      | "Returned";
    paymentStatus: "" | "Paid" | "Pending" | "Refunded" | "Failed";
    dateRange?: {
      from: string;
      to: string;
    };
    search?: string;
  };
}

// Initial state
const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  filters: {
    status: "",
    paymentStatus: "",
  },
};

// Create the slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrdersData: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedOrder: (state, action: PayloadAction<Order>) => {
      state.selectedOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setOrderLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<OrderState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

// Export actions
export const {
  setOrdersData,
  setSelectedOrder,
  setOrderLoading,
  setOrderError,
  clearSelectedOrder,
  setFilters,
  clearFilters,
} = orderSlice.actions;

// Error handler utility
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Fetch orders with filters
export const fetchOrdersData =
  () =>
  async (dispatch: AppDispatch, getState: () => { order: OrderState }) => {
    dispatch(setOrderLoading());
    try {
      const { filters } = getState().order;
      const queryParams = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.status) {
        queryParams.append("status", filters.status);
      }
      if (filters.paymentStatus) {
        queryParams.append("paymentStatus", filters.paymentStatus);
      }
      if (filters.search) {
        queryParams.append("q", filters.search);
      }
      if (filters.dateRange) {
        queryParams.append("fromDate", filters.dateRange.from);
        queryParams.append("toDate", filters.dateRange.to);
      }

      const queryString = queryParams.toString();
      const url = queryString
        ? `${API_BASE_URL}/orders?${queryString}`
        : `${API_BASE_URL}/orders`;

      const response = await axios.get(url);

      if (response.data?.success) {
        dispatch(setOrdersData(response.data.data));
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to fetch orders");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Fetch order by ID
export const fetchOrderById =
  (orderId: string) => async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      if (response.data?.success) {
        dispatch(setSelectedOrder(response.data.data));
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to fetch order");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Create new order
export const createOrder =
  (orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) =>
  async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      if (response.data?.success) {
        dispatch(setSelectedOrder(response.data.data));
        return response.data.data;
      } else {
        throw new Error(response.data?.message || "Failed to create order");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Update order status
export const updateOrderStatus =
  (orderId: string, status: Order["status"], trackingNumber?: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, {
        status,
        trackingNumber,
      });
      if (response.data?.success) {
        dispatch(setSelectedOrder(response.data.data));
        return true;
      } else {
        throw new Error(
          response.data?.message || "Failed to update order status",
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Update payment status
export const updatePaymentStatus =
  (orderId: string, paymentStatus: Order["paymentStatus"]) =>
  async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, {
        paymentStatus,
      });
      if (response.data?.success) {
        dispatch(setSelectedOrder(response.data.data));
        return true;
      } else {
        throw new Error(
          response.data?.message || "Failed to update payment status",
        );
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Cancel order
export const cancelOrder =
  (orderId: string, reason: string) => async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, {
        status: "Cancelled",
        cancelReason: reason,
      });
      if (response.data?.success) {
        dispatch(setSelectedOrder(response.data.data));
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to cancel order");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Return order
export const returnOrder =
  (orderId: string, reason: string) => async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading());
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, {
        status: "Returned",
        returnReason: reason,
      });
      if (response.data?.success) {
        dispatch(setSelectedOrder(response.data.data));
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to return order");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setOrderError(errorMessage));
      return false;
    }
  };

// Selectors
export const selectOrders = (state: { order: OrderState }) =>
  state.order.orders;
export const selectSelectedOrder = (state: { order: OrderState }) =>
  state.order.selectedOrder;
export const selectOrderLoading = (state: { order: OrderState }) =>
  state.order.isLoading;
export const selectOrderError = (state: { order: OrderState }) =>
  state.order.error;
export const selectOrderFilters = (state: { order: OrderState }) =>
  state.order.filters;

// Export the reducer
export default orderSlice.reducer;
