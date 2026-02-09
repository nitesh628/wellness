"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "@/lib/redux/features/authSlice";
import {
  Search,
  Grid3X3,
  List,
  Edit,
  Package,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { getApiV1Url } from "@/lib/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import NoData from "@/components/common/dashboard/NoData";
import Loader from "@/components/common/dashboard/Loader";
import Error from "@/components/common/dashboard/Error";
import { formatPrice } from "@/lib/formatters";

const orderStatuses = [
  "all",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
] as const;
const paymentStatuses = [
  "all",
  "Paid",
  "Pending",
  "Refunded",
  "Failed",
] as const;

interface OrderItem {
  product: string | { name: string; image?: string };
  name?: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: string | { name: string; email: string };
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: any;
  billingAddress?: string;
  trackingNumber?: string;
  notes?: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
  });
  const currentUser = useAppSelector(selectUser);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      if (!currentUser) {
        setOrders([]);
        setError("User not logged in");
        setIsLoading(false);
        return;
      }

      // Admins can see all orders, regular users only see their own
      // Check for lowercase admin roles from backend (admin, super_admin)
      const isAdmin =
        currentUser.role === "admin" ||
        currentUser.role === "super_admin" ||
        currentUser.role === "Admin";
      const apiUrl = isAdmin
        ? getApiV1Url(`/orders`)
        : getApiV1Url(`/orders?user=${currentUser._id}`);

      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });
      console.log("Orders API response:", response.data);
      let ordersData = [];
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data?.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (response.data?.data) {
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (typeof response.data.data === "object") {
          ordersData = [response.data.data];
        }
      }
      setOrders(ordersData);
      setError("");
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on mount and when filters change
  useEffect(() => {
    fetchOrders();
    // refetch when user changes (e.g., login/logout)
  }, [currentUser]);

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => {
      const userName =
        typeof order.user === "string" ? order.user : order.user?.name || "";
      const orderNumber = order.orderNumber || "";
      const matchesSearch =
        orderNumber
          .toLowerCase()
          .includes(filters.search?.toLowerCase() || "") ||
        userName.toLowerCase().includes(filters.search?.toLowerCase() || "");
      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesPaymentStatus =
        !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [orders, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"],
    trackingNumber?: string,
  ) => {
    try {
      await axios.put(
        getApiV1Url(`/orders/${orderId}`),
        { status: newStatus, trackingNumber },
        { withCredentials: true },
      );
      await fetchOrders();
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const openViewModal = async (order: Order) => {
    try {
      const response = await axios.get(getApiV1Url(`/orders/${order._id}`), {
        withCredentials: true,
      });
      const orderData =
        response.data.order || response.data.data || response.data;
      setSelectedOrder(orderData);
      setShowViewModal(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Processing":
        return <Package className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      case "Returned":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Processing":
        return "secondary";
      case "Shipped":
        return "default";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "destructive";
      case "Returned":
        return "default";
      default:
        return "secondary";
    }
  };

  const renderUser = (user: Order["user"]) => {
    if (typeof user === "string") return user;
    return user?.name || "Unknown User";
  };

  const renderAddress = (address: any) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    return address.address || address.name || JSON.stringify(address);
  };

  const renderProduct = (item: OrderItem) => {
    if (item.name) return item.name;
    if (
      item.product &&
      typeof item.product === "object" &&
      "name" in item.product
    ) {
      return item.product.name;
    }
    return typeof item.product === "string" ? item.product : "Unknown Product";
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {error ? (
          <Error title="Error loading orders" message={error} />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Orders</h1>
                <p className="text-muted-foreground">
                  Manage customer orders and fulfillment
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {orders.length}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pending Orders
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {orders.filter((o) => o.status === "Pending").length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Delivered Orders
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {orders.filter((o) => o.status === "Delivered").length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatPrice(
                          orders.reduce((sum, o) => sum + o.totalAmount, 0),
                        )}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search orders..."
                      value={filters.search || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Status" : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Payment Status Filter */}
                  <Select
                    value={filters.paymentStatus || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        paymentStatus: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Payment Status" : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex border border-input rounded-lg overflow-hidden">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="icon"
                          onClick={() => setViewMode("grid")}
                          className="rounded-none"
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Grid view</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="icon"
                          onClick={() => setViewMode("list")}
                          className="rounded-none"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>List view</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {isLoading ? (
              <Loader variant="skeleton" message="Loading orders..." />
            ) : filteredOrders.length === 0 ? (
              <NoData
                message="No orders found"
                description="Orders will appear here once customers start making purchases"
                icon={
                  <Package className="w-full h-full text-muted-foreground/60" />
                }
                size="lg"
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {order.orderNumber}
                        </CardTitle>
                        <Badge
                          variant={
                            getStatusColor(order.status) as
                              | "default"
                              | "secondary"
                              | "destructive"
                              | "outline"
                          }
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        {renderUser(order.user)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Order Date:
                          </span>
                          <span className="text-sm font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Total Amount:
                          </span>
                          <span className="text-lg font-bold text-foreground">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Payment:
                          </span>
                          <Badge
                            variant={
                              order.paymentStatus === "Paid"
                                ? "success"
                                : order.paymentStatus === "Refunded"
                                  ? "default"
                                  : "warning"
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Items:
                          </span>
                          <span className="text-sm font-medium">
                            {order.items.length} items
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 mt-auto">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => openViewModal(order)}
                              className="flex-1 gap-2"
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View order details</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => openEditModal(order)}
                              className="flex-1 gap-2"
                              size="sm"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit order status</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !isLoading ? (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} items
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {renderUser(order.user)}
                            </p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {renderAddress(order.shippingAddress)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              getStatusColor(order.status) as
                                | "default"
                                | "secondary"
                                | "destructive"
                                | "outline"
                            }
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.paymentStatus === "Paid"
                                ? "success"
                                : order.paymentStatus === "Refunded"
                                  ? "default"
                                  : "warning"
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => openViewModal(order)}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View order</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => openEditModal(order)}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit order</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : null}

            {/* Pagination */}
            {!isLoading && filteredOrders.length > 0 && totalPages > 1 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredOrders.length)} of{" "}
                      {filteredOrders.length} orders
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* View Order Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Order Details - {selectedOrder?.orderNumber}
              </DialogTitle>
              <DialogDescription>
                Complete order information and details.
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Order Number:
                        </span>
                        <span className="font-medium">
                          {selectedOrder.orderNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Order Date:
                        </span>
                        <span className="font-medium">
                          {new Date(
                            selectedOrder.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={
                            getStatusColor(selectedOrder.status) as
                              | "default"
                              | "secondary"
                              | "destructive"
                              | "outline"
                          }
                        >
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-1">{selectedOrder.status}</span>
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Amount:
                        </span>
                        <span className="font-bold text-lg">
                          {formatPrice(selectedOrder.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Payment Method:
                        </span>
                        <span className="font-medium">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Payment Status:
                        </span>
                        <Badge
                          variant={
                            selectedOrder.paymentStatus === "Paid"
                              ? "success"
                              : selectedOrder.paymentStatus === "Refunded"
                                ? "default"
                                : "warning"
                          }
                        >
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Tracking Number:
                          </span>
                          <span className="font-medium">
                            {selectedOrder.trackingNumber}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User ID:</span>
                        <span className="font-medium">
                          {renderUser(selectedOrder.user)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Shipping Address:
                        </span>
                        <span className="font-medium">
                          {renderAddress(selectedOrder.shippingAddress)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Billing Address:
                        </span>
                        <span className="font-medium">
                          {selectedOrder.billingAddress}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{renderProduct(item)}</p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(item.price)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: {formatPrice(item.total)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedOrder.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {selectedOrder.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Order Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status of order {selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="order-status" className="mb-2 block">
                    Order Status
                  </Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      setSelectedOrder({ ...selectedOrder, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.slice(1).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tracking-number" className="mb-2 block">
                    Tracking Number
                  </Label>
                  <Input
                    id="tracking-number"
                    type="text"
                    placeholder="Enter tracking number"
                    value={selectedOrder.trackingNumber || ""}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        trackingNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="order-notes" className="mb-2 block">
                    Notes
                  </Label>
                  <Textarea
                    id="order-notes"
                    placeholder="Add order notes"
                    value={selectedOrder.notes || ""}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedOrder) {
                    handleUpdateOrderStatus(
                      selectedOrder._id!,
                      selectedOrder.status,
                      selectedOrder.trackingNumber,
                    );
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Order"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default OrdersPage;
