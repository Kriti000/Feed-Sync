// backend/routes/feedbackRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Feedback from '../models/feedbackModel.js';

const router = express.Router();

// Ensure images directory exists
const imagesDir = path.join(process.cwd(), 'backend', 'images');
fs.mkdirSync(imagesDir, { recursive: true });

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});
const upload = multer({ storage });

// ➤ POST: Add new feedback
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, message, rating, steps } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Please fill all required fields.' });

    const newFeedback = new Feedback({
      name,
      email,
      message,
      rating: rating ? Number(rating) : 0,
      image: req.file ? req.file.filename : null,
      steps: steps ? JSON.parse(steps) : [],
      createdAt: new Date(),
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ➤ GET: All feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// ➤ GET: Single feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ error: 'Feedback not found' });
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
