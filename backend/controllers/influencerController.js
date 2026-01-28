import { validationResult } from 'express-validator';
import User from '../models/userModel.js';

// Create a new influencer
export async function createInfluencer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const influencerData = {
      ...req.body,
      role: 'Influencer'
    };
    
    const influencer = new User(influencerData);
    const savedInfluencer = await influencer.save();
    
    // Remove password from response
    const { password, ...influencerResponse } = savedInfluencer.toObject();
    res.status(201).json(influencerResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update influencer by ID
export async function updateInfluencer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedInfluencer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Influencer' },
      req.body,
      { new: true }
    ).select('-password');
    
    if (!updatedInfluencer) return res.status(404).json({ error: 'Influencer not found' });
    res.json(updatedInfluencer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Toggle influencer isActive status
export async function toggleInfluencerStatus(req, res) {
  try {
    const influencer = await User.findOne({ _id: req.params.id, role: 'Influencer' });
    if (!influencer) return res.status(404).json({ error: 'Influencer not found' });
    
    influencer.isActive = !influencer.isActive;
    await influencer.save();
    
    res.json({ 
      message: `Influencer ${influencer.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: influencer.isActive 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all influencers
export async function getAllInfluencers(req, res) {
  try {
    const influencers = await User.find({ role: 'Influencer' }).select('-password');
    res.json(influencers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get influencer by ID
export async function getInfluencerById(req, res) {
  try {
    const influencer = await User.findOne({ _id: req.params.id, role: 'Influencer' }).select('-password');
    if (!influencer) return res.status(404).json({ error: 'Influencer not found' });
    res.json(influencer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
