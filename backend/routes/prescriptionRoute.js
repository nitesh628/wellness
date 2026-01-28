import { Router } from 'express';
import {
    createPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription,
    getPrescriptionStats,
    exportPrescriptions
} from '../controllers/prescriptionController.js';
import { isLogin } from '../middleWares/isLogin.js';

const router = Router();

router.use(isLogin);

router.post('/', createPrescription);
router.get('/', getPrescriptions);
router.get('/stats', getPrescriptionStats);
router.get('/export', exportPrescriptions);
router.get('/:id', getPrescriptionById);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;