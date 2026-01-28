import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
// Create a new doctor
export async function createDoctor(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const doctorData = {
      ...req.body,
      role: 'Doctor'
    };
    
    const doctor = new User(doctorData);
    const savedDoctor = await doctor.save();
    
    // Remove password from response
    const { password, ...doctorResponse } = savedDoctor.toObject();
    res.status(201).json(doctorResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update doctor by ID
export async function updateDoctor(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedDoctor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Doctor' },
      req.body,
      { new: true }
    ).select('-password');
    
    if (!updatedDoctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Toggle doctor isActive status
export async function toggleDoctorStatus(req, res) {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'Doctor' });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    
    doctor.isActive = !doctor.isActive;
    await doctor.save();
    
    res.json({ 
      message: `Doctor ${doctor.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: doctor.isActive 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all doctors
export async function getAllDoctors(req, res) {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get doctor by ID
export async function getDoctorById(req, res) {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'Doctor' }).select('-password');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

