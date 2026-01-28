import { Router } from 'express';
import {
    getMyStats,
    getMyAppointments,
    getMyPrescriptions,
    downloadMyData
} from '../controllers/customerController.js';
import { isLogin } from '../middleWares/isLogin.js';

const router = Router();

router.use(isLogin);

router.get('/stats', getMyStats);
router.get('/appointments', getMyAppointments);
router.get('/prescriptions', getMyPrescriptions);
router.get('/download-data', downloadMyData);

export default router;