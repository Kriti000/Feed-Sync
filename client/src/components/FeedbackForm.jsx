import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FeedbackForm.css';
import InputField from './InputField';
import Comments from './Comments';

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

const FeedbackForm = ({ editUser, setShowForm, fetchData }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    rating: '',
    message: '',
  });

  const [image, setImage] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [comments, setComments] = useState([{ id: generateUniqueId(), content: '', image: null }]);

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected && (selected.type === 'image/jpeg' || selected.type === 'image/png')) {
      setImage(selected);
      setPreviewName(selected.name);
    } else {
      alert('Only JPG and PNG images are allowed.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] }
  });

  useEffect(() => {
    if (editUser) {
      setFormData({
        _id: editUser._id,
        name: editUser.name,
        email: editUser.email,
        rating: editUser.rating,
        message: editUser.message,
      });

      if (Array.isArray(editUser.steps) && editUser.steps.length > 0) {
        setComments(
          editUser.steps.map((step) => ({
            id: generateUniqueId(),
            content: step.comment,
            image: null 
          }))
        );
      }
    }
  }, [editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('rating', formData.rating);
      form.append('message', formData.message);

      if (image) {
        form.append('image', image);
      }

      const stepData = [];
      comments.forEach((comment, index) => {
        stepData.push({ comment: comment.content });
        if (comment.image) {
          form.append(`stepImage-${index}`, comment.image);
        }
      });

      form.append('steps', JSON.stringify(stepData));

      let response;
      if (formData._id) {
        response = await axios.put(`http://localhost:5000/api/feedback/${formData._id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      } else {
        response = await axios.post('http://localhost:5000/api/feedback', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      }

      if (response.status === 200 || response.status === 201) {
        alert('Feedback saved successfully!');
        setFormData({ name: '', email: '', rating: '', message: '' });
        setImage(null);
        setPreviewName('');
        setComments([{ id: generateUniqueId(), content: '', image: null }]);
        if (fetchData) fetchData();
        if (setShowForm) setShowForm(false);
      } else {
        alert('Failed to save feedback.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-container feedback-form">
      <h2 className="feedback-title">
        {formData._id ? 'Edit Feedback' : 'Feedback Form'}
      </h2>

      <InputField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} required />
      <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label className="feedback-label">
        Rating:
        <select name="rating" value={formData.rating} onChange={handleChange} required>
          <option value="">Select Rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Bad</option>
        </select>
      </label>

      <label className="feedback-label">
        Message:
        <textarea name="message" value={formData.message} onChange={handleChange} rows="4" required />
      </label>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop main image or click to select JPG/PNG</p>}
        {previewName && <p>Selected: {previewName}</p>}
      </div>

      <div className="right-container">
        <h2>Step-wise Comments</h2>
        <Comments comments={comments} setComments={setComments} />
      </div>

      <button type="submit" className="feedback-submit-button">
        {formData._id ? 'Update Feedback' : 'Submit'}
      </button>
    </form>
  );
};

export default FeedbackForm;
