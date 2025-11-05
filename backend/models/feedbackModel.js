// backend/models/feedbackModel.js
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, default: 0 },
  message: { type: String, required: true },
  image: { type: String },
  steps: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
