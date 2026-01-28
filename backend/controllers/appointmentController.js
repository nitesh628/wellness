import mongoose from 'mongoose';
import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import { Parser } from 'json2csv';

const isId = (id) => mongoose.isValidObjectId(id);

export const createAppointment = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId, appointmentDate, appointmentTime, duration, type, reason, fee, paymentStatus } = req.body;

    if (!isId(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    const patientExists = await User.findById(patientId);
    if (!patientExists || patientExists.role !== 'Customer') {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    const appointment = await Appointment.create({
      ...req.body,
      doctor: doctorId,
      patient: patientId
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
        .populate('patient', 'firstName lastName email phone imageUrl')
        .populate('doctor', 'firstName lastName specialization');

    res.status(201).json({ success: true, data: populatedAppointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const {
      page = 1,
      limit = 10,
      status,
      type,
      search,
      sortBy = 'appointmentDate',
      sortOrder = 'asc',
      date
    } = req.query;

    const filter = { doctor: new mongoose.Types.ObjectId(doctorId) };
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (date && date !== 'all') {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const sortOptions = {};
    if (sortBy === 'patientName') {
      sortOptions['patient.firstName'] = sortOrder === 'asc' ? 1 : -1;
      sortOptions['patient.lastName'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const aggregationPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: '$patient' },
      {
        $lookup: {
            from: 'users',
            localField: 'doctor',
            foreignField: '_id',
            as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
    ];
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      aggregationPipeline.push({
        $match: {
          $or: [
            { 'patient.firstName': searchRegex },
            { 'patient.lastName': searchRegex },
            { 'patient.email': searchRegex },
            { 'patient.phone': searchRegex },
            { reason: searchRegex }
          ]
        }
      });
    }

    const countPipeline = [...aggregationPipeline, { $count: 'total' }];
    const dataPipeline = [
        ...aggregationPipeline,
        { $sort: sortOptions },
        { $skip: (page - 1) * limit },
        { $limit: Number(limit) },
        {
          $project: {
              'patient.password': 0,
              'doctor.password': 0
          }
        }
    ];

    const [[{ total = 0 } = {}], appointments] = await Promise.all([
        Appointment.aggregate(countPipeline),
        Appointment.aggregate(dataPipeline)
    ]);
    
    res.json({
      success: true,
      data: appointments,
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


export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const appointment = await Appointment.findOne({ _id: id, doctor: req.user._id })
      .populate('patient', 'firstName lastName email phone imageUrl')
      .populate('doctor', 'firstName lastName specialization');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id, doctor: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    .populate('patient', 'firstName lastName email phone imageUrl')
    .populate('doctor', 'firstName lastName specialization');

    if (!updatedAppointment) return res.status(404).json({ success: false, message: 'Appointment not found or you are not authorized' });
    res.json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const deletedAppointment = await Appointment.findOneAndDelete({ _id: id, doctor: req.user._id });

    if (!deletedAppointment) return res.status(404).json({ success: false, message: 'Appointment not found or you are not authorized' });
    res.json({ success: true, message: 'Appointment deleted successfully', id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAppointmentStats = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            todaysAppointments,
            totalAppointments,
            pendingAppointments,
            revenueResult
        ] = await Promise.all([
            Appointment.countDocuments({ doctor: doctorId, appointmentDate: { $gte: today, $lt: tomorrow } }),
            Appointment.countDocuments({ doctor: doctorId }),
            Appointment.countDocuments({ doctor: doctorId, status: 'pending' }),
            Appointment.aggregate([
                { $match: { doctor: new mongoose.Types.ObjectId(doctorId), paymentStatus: 'paid' } },
                { $group: { _id: null, totalRevenue: { $sum: '$fee' } } }
            ])
        ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        const totalCompleted = await Appointment.countDocuments({ doctor: doctorId, status: 'completed' });
        const confirmedToday = await Appointment.countDocuments({ doctor: doctorId, status: 'confirmed', appointmentDate: { $gte: today, $lt: tomorrow } })


        res.json({
            success: true,
            data: {
                todaysAppointments,
                totalAppointments,
                pendingAppointments,
                totalRevenue,
                totalCompleted,
                confirmedToday
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


export const exportAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    // Hum wahi filters/search use karenge jo getAppointments mein hain
    const { status, type, search, sortBy = 'appointmentDate', sortOrder = 'asc', date } = req.query;

    const filter = { doctor: new mongoose.Types.ObjectId(doctorId) };
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (date && date !== 'all') {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const sortOptions = {};
    if (sortBy === 'patientName') {
      sortOptions['patient.firstName'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const aggregationPipeline = [
      { $match: filter },
      { $lookup: { from: 'users', localField: 'patient', foreignField: '_id', as: 'patient' } },
      { $unwind: '$patient' },
      { $sort: sortOptions }
    ];

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      aggregationPipeline.push({
        $match: {
          $or: [
            { 'patient.firstName': searchRegex },
            { 'patient.lastName': searchRegex },
            { reason: searchRegex }
          ]
        }
      });
    }

    // Yahan pagination (limit/skip) nahi hoga, humein saara data chahiye
    const appointments = await Appointment.aggregate(aggregationPipeline);

    if (appointments.length === 0) {
      return res.status(404).json({ success: false, message: 'No appointments found to export' });
    }

    // CSV ke liye data taiyaar karna
    const fields = [
        { label: 'Patient Name', value: 'patient.fullName' },
        { label: 'Patient Email', value: 'patient.email' },
        { label: 'Patient Phone', value: 'patient.phone' },
        { label: 'Appointment Date', value: 'appointmentDate' },
        { label: 'Appointment Time', value: 'appointmentTime' },
        { label: 'Duration (min)', value: 'duration' },
        { label: 'Type', value: 'type' },
        { label: 'Status', value: 'status' },
        { label: 'Reason', value: 'reason' },
        { label: 'Fee', value: 'fee' },
        { label: 'Payment Status', value: 'paymentStatus' },
        { label: 'Notes', value: 'notes' }
    ];
    
    // Har appointment object ko flat karna
    const formattedData = appointments.map(app => ({
        ...app,
        patient: {
            ...app.patient,
            fullName: `${app.patient.firstName} ${app.patient.lastName}`
        },
        appointmentDate: new Date(app.appointmentDate).toLocaleDateString()
    }));

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedData);
    
    const fileName = `appointments-${new Date().toISOString().split('T')[0]}.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export data', error: error.message });
  }
};