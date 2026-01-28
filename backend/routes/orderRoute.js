import { Router } from "express";
import { createOrder, deleteOrder, getOrderById, listOrders, updateOrder,  } from "../controllers/orderController.js";



const router = Router();

// CRUD
router.post('/', createOrder);
router.get('/', listOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);




export default router;
