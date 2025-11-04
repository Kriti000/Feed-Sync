import Feedback from '../models/feedbackModel.js'; 
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG images are allowed'), false);
  }
};

export const upload = multer({ storage, fileFilter });

export const getFeedbackData = (req, res) => {
  Feedback.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: "Failed to fetch users", details: err }));
};

export const createFeedback = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    const image = req.file ? req.file.filename : null;
    const newFeedback = new Feedback({ name, email, rating, message, image, comments });
    const savedFeedback = await newFeedback.save(); 

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: savedFeedback
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteFeedbackData = async (req,res) => {
  const {email} = req.body;

  try{
    const result=await Feedback.deleteOne({email});

    if(result.deletedCount>0){
      res.status(200).json({message: "User Deleted Successfully"});
    } else{
      res.status(404).json({message: "User not found"});
    }
  }
  catch(error){
    console.error("Error deleting user:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
};

export const ping = (req, res) => {
  res.json({ message: 'Backend is working!' });
};