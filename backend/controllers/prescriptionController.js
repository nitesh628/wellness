import mongoose from 'mongoose';
import Prescription from '../models/prescriptionModel.js';
import User from '../models/userModel.js';
import { Parser } from 'json2csv';

const isId = (id) => mongoose.isValidObjectId(id);

export const createPrescription = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { patientId, ...restOfBody } = req.body;
        
        if (!isId(patientId)) {
            return res.status(400).json({ success: false, message: 'Invalid Patient ID' });
        }
        
        const prescriptionData = {
            ...restOfBody,
            doctor: doctorId,
            patient: patientId,
        };
        
        const newPrescription = await Prescription.create(prescriptionData);
        const populatedPrescription = await Prescription.findById(newPrescription._id)
            .populate('patient', 'firstName lastName')
            .populate('doctor', 'firstName lastName');

        res.status(201).json({ success: true, data: populatedPrescription });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { page = 1, limit = 10, status, search, sortBy = 'prescriptionDate', sortOrder = 'desc' } = req.query;

        const filter = { doctor: new mongoose.Types.ObjectId(doctorId) };
        if (status && status !== 'all') filter.status = status;

        const aggregationPipeline = [
            { $match: filter },
            { $lookup: { from: 'users', localField: 'patient', foreignField: '_id', as: 'patientInfo' } },
            { $unwind: '$patientInfo' },
            {
                $project: {
                    'patientInfo.password': 0
                }
            }
        ];

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            aggregationPipeline.push({
                $match: {
                    $or: [
                        { 'patientInfo.firstName': searchRegex },
                        { 'patientInfo.lastName': searchRegex },
                        { 'patientInfo.email': searchRegex },
                        { diagnosis: searchRegex }
                    ]
                }
            });
        }
        
        const sortOptions = {};
        sortOptions[sortBy === 'patientName' ? 'patientInfo.firstName' : sortBy] = sortOrder === 'asc' ? 1 : -1;

        const countPipeline = [...aggregationPipeline, { $count: 'total' }];
        const dataPipeline = [
            ...aggregationPipeline,
            { $sort: sortOptions },
            { $skip: (page - 1) * limit },
            { $limit: Number(limit) }
        ];

        const [[{ total = 0 } = {}], prescriptions] = await Promise.all([
            Prescription.aggregate(countPipeline),
            Prescription.aggregate(dataPipeline)
        ]);

        res.json({
            success: true,
            data: prescriptions,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

        const prescription = await Prescription.findOne({ _id: id, doctor: req.user._id })
            .populate('patient', '-password')
            .populate('doctor', 'firstName lastName specialization')
            .populate('medications.product');
            
        if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
        res.json({ success: true, data: prescription });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
        
        const updatedPrescription = await Prescription.findOneAndUpdate(
            { _id: id, doctor: req.user._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('patient', 'firstName lastName');
        
        if (!updatedPrescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
        res.json({ success: true, data: updatedPrescription });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

        const deleted = await Prescription.findOneAndDelete({ _id: id, doctor: req.user._id });

        if (!deleted) return res.status(404).json({ success: false, message: 'Prescription not found' });
        res.json({ success: true, message: 'Prescription deleted', id });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPrescriptionStats = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const [
            totalPrescriptions,
            activePrescriptions
        ] = await Promise.all([
            Prescription.countDocuments({ doctor: doctorId }),
            Prescription.countDocuments({ doctor: doctorId, status: 'active' }),
        ]);

        res.json({
            success: true,
            data: {
                totalPrescriptions,
                activePrescriptions
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const exportPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const prescriptions = await Prescription.find({ doctor: doctorId })
            .populate('patient', 'firstName lastName email')
            .lean();

        if (prescriptions.length === 0) {
            return res.status(404).json({ success: false, message: 'No prescriptions to export' });
        }
        
        const formattedData = prescriptions.map(p => ({
            prescriptionId: p._id,
            patientName: `${p.patient.firstName} ${p.patient.lastName}`,
            patientEmail: p.patient.email,
            date: new Date(p.prescriptionDate).toLocaleDateString(),
            diagnosis: p.diagnosis,
            status: p.status,
            medications: p.medications.map(m => `${m.productName} (${m.dosage}, ${m.frequency})`).join(' | '),
            followUp: p.followUpDate ? new Date(p.followUpDate).toLocaleDateString() : 'N/A'
        }));

        const fields = [
            { label: 'ID', value: 'prescriptionId' },
            { label: 'Patient Name', value: 'patientName' },
            { label: 'Patient Email', value: 'patientEmail' },
            { label: 'Date', value: 'date' },
            { label: 'Diagnosis', value: 'diagnosis' },
            { label: 'Status', value: 'status' },
            { label: 'Medications', value: 'medications' },
            { label: 'Follow Up', value: 'followUp' }
        ];
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(formattedData);

        res.header('Content-Type', 'text/csv');
        res.attachment(`prescriptions-export-${new Date().toISOString()}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to export', error: error.message });
    }
};