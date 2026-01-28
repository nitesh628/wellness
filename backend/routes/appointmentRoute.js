import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  exportAppointments 
} from '../controllers/appointmentController.js';
import { isLogin } from '../middleWares/isLogin.js';

const router = Router();

router.use(isLogin);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/export', exportAppointments);
router.get('/stats', getAppointmentStats);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;