import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Appointment from '../models/appointmentModel.js';
import { Parser } from 'json2csv';

const isId = (id) => mongoose.isValidObjectId(id);

export const createPatient = async (req, res) => {
    try {
        const patientData = {
            ...req.body,
            role: 'Customer'
        };

        if (patientData.password) {
            patientData.password = await bcrypt.hash(patientData.password, 10);
        } else {
            const tempPassword = Math.random().toString(36).slice(-8);
            patientData.password = tempPassword;
        }

        const newPatient = await User.create(patientData);
        newPatient.password = undefined;

        res.status(201).json({ success: true, data: newPatient });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Email or phone already exists.' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPatients = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            patientType,
            search,
            sortBy = 'firstName',
            sortOrder = 'asc'
        } = req.query;

        const filter = { role: 'Customer' };
        if (status && status !== 'all') filter.status = status;
        if (patientType && patientType !== 'all') filter.patientType = patientType;

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { bloodGroup: searchRegex }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const patients = await User.find(filter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select('-password');
            
        const total = await User.countDocuments(filter);
        
        const patientIds = patients.map(p => p._id);

        const appointmentStats = await Appointment.aggregate([
            { $match: { patient: { $in: patientIds } } },
            {
                $group: {
                    _id: '$patient',
                    totalVisits: { $sum: 1 },
                    totalFees: { $sum: '$fee' },
                    lastVisit: { $max: '$appointmentDate' }
                }
            }
        ]);
        
        const statsMap = appointmentStats.reduce((acc, stat) => {
            acc[stat._id] = stat;
            return acc;
        }, {});

        const populatedPatients = patients.map(p => {
            const stats = statsMap[p._id] || { totalVisits: 0, totalFees: 0, lastVisit: null };
            return {
                ...p.toObject(),
                ...stats,
            };
        });

        res.json({
            success: true,
            data: populatedPatients,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

        const patient = await User.findOne({ _id: id, role: 'Customer' }).select('-password');
        if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

        const stats = await Appointment.aggregate([
            { $match: { patient: patient._id } },
            {
                $group: {
                    _id: null,
                    totalVisits: { $sum: 1 },
                    totalFees: { $sum: '$fee' },
                    lastVisit: { $max: '$appointmentDate' }
                }
            }
        ]);
        
        const finalPatientData = {
            ...patient.toObject(),
            ...(stats[0] || { totalVisits: 0, totalFees: 0, lastVisit: null })
        };
        delete finalPatientData._id;

        res.json({ success: true, data: finalPatientData });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
        
        const updateData = req.body;
        delete updateData.password; // Prevent password update through this route
        
        const updatedPatient = await User.findOneAndUpdate(
            { _id: id, role: 'Customer' },
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedPatient) return res.status(404).json({ success: false, message: 'Patient not found' });
        res.json({ success: true, data: updatedPatient });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
        
        // Soft delete can also be an option by setting status to 'inactive'
        const deletedPatient = await User.findOneAndDelete({ _id: id, role: 'Customer' });
        
        if (!deletedPatient) return res.status(404).json({ success: false, message: 'Patient not found' });
        
        // Also delete related appointments
        await Appointment.deleteMany({ patient: id });
        
        res.json({ success: true, message: 'Patient and related appointments deleted successfully', id });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const getPatientStats = async (req, res) => {
    try {
        const [
            totalPatients,
            activePatients,
            vipPatients,
            visitStats
        ] = await Promise.all([
            User.countDocuments({ role: 'Customer' }),
            User.countDocuments({ role: 'Customer', status: 'active' }),
            User.countDocuments({ role: 'Customer', patientType: 'vip' }),
            Appointment.aggregate([
                { $group: { _id: null, totalVisits: { $sum: 1 }, totalFees: { $sum: '$fee' } } }
            ])
        ]);

        const { totalVisits = 0, totalFees = 0 } = visitStats[0] || {};
        const avgVisitFee = totalVisits > 0 ? Math.round(totalFees / totalVisits) : 0;

        res.json({
            success: true,
            data: {
                totalPatients,
                activePatients,
                vipPatients,
                avgVisitFee
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const exportPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: 'Customer' }).select('-password').lean();
        
        if (patients.length === 0) {
            return res.status(404).json({ success: false, message: 'No patients found to export' });
        }
        
        const fields = [
            'firstName', 'lastName', 'email', 'phone', 'status', 
            'patientType', 'age', 'bloodGroup', 'location', 
            'medicalHistory', 'currentMedications', 'allergies', 
            'emergencyContact.phone', 'insuranceProvider', 'tags'
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(patients);
        
        res.header('Content-Type', 'text/csv');
        res.attachment(`patients-export-${new Date().toISOString()}.csv`);
        res.send(csv);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to export data', error: error.message });
    }
};