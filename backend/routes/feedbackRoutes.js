import express from 'express';
import Feedback from '../models/feedbackModel.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const newFeedback = new Feedback({
      name,
      email,
      message,
      image: req.file ? req.file.filename : null,
      createdAt: new Date(),
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const query = search
      ? { message: { $regex: search, $options: 'i' } }
      : {};

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('❌ Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('❌ Error fetching feedback by ID:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
