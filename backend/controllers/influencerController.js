import { validationResult } from 'express-validator';
import Influencer from '../models/influencerModel.js';

// Create a new influencer
export async function createInfluencer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const influencer = new Influencer(req.body);
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
    const updatedInfluencer = await Influencer.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedInfluencer) return res.status(404).json({ error: 'Influencer not found' });
    res.json(updatedInfluencer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Toggle influencer status
export async function toggleInfluencerStatus(req, res) {
  try {
    const influencer = await Influencer.findOne({ _id: req.params.id });
    if (!influencer) return res.status(404).json({ error: 'Influencer not found' });

    const newStatus = influencer.status === 'active' ? 'inactive' : 'active';
    influencer.status = newStatus;
    await influencer.save();

    res.json({
      message: `Influencer ${newStatus} successfully`,
      status: influencer.status
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all influencers
export async function getAllInfluencers(req, res) {
  try {
    const influencers = await Influencer.find().select('-password');
    res.json(influencers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get influencer by ID
export async function getInfluencerById(req, res) {
  try {
    const influencer = await Influencer.findOne({ _id: req.params.id }).select('-password');
    if (!influencer) return res.status(404).json({ error: 'Influencer not found' });
    res.json(influencer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
