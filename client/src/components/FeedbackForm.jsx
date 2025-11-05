import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './FeedbackForm.css';
import InputField from './InputField';
import Comments from './Comments';

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    message: '',
  });

  const [image, setImage] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [comments, setComments] = useState([{ id: generateUniqueId(), content: '', image: null }]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected && (selected.type === 'image/jpeg' || selected.type === 'image/png')) {
      setImage(selected);
      setPreviewName(selected.name);
    } else {
      Swal.fire('Error', 'Only JPG and PNG images are allowed.', 'error');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      const response = await axios.post('http://localhost:5000/api/feedback', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Feedback submitted successfully!',
          showConfirmButton: false,
          timer: 2000
        });
        
        // Reset form
        setFormData({ name: '', email: '', rating: '', message: '' });
        setImage(null);
        setPreviewName('');
        setComments([{ id: generateUniqueId(), content: '', image: null }]);
        
        // Navigate to feedback data page
        navigate('/feedbackdata');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to submit feedback. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <form onSubmit={handleSubmit} className="feedback-container feedback-form">
            <div className="text-center mb-4">
              <h2 className="feedback-title">
                <i className="bi bi-pencil-square me-2"></i>
                Submit Your Feedback
              </h2>
              <p className="text-muted">We value your opinion! Please share your thoughts with us.</p>
            </div>

            <div className="row">
              <div className="col-md-6">
                <InputField 
                  label="Name" 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="col-md-6">
                <InputField 
                  label="Email" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <label className="feedback-label">
              Rating:
              <select name="rating" value={formData.rating} onChange={handleChange} required>
                <option value="">Select Rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Bad</option>
              </select>
            </label>

            <label className="feedback-label">
              Message:
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                rows="4" 
                required 
                placeholder="Share your detailed feedback here..."
              />
            </label>

            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <i className="bi bi-cloud-upload fs-1 text-primary mb-2"></i>
              {isDragActive ? (
                <p className="mb-0">Drop the image here...</p>
              ) : (
                <p className="mb-0">Drag & drop main image or click to select JPG/PNG</p>
              )}
              {previewName && (
                <div className="mt-2">
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Selected: {previewName}
                  </span>
                </div>
              )}
            </div>

            <div className="right-container">
              <h5 className="mb-3">
                <i className="bi bi-list-ol me-2"></i>
                Step-wise Comments (Optional)
              </h5>
              <Comments comments={comments} setComments={setComments} />
            </div>

            <div className="d-flex gap-3 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg flex-grow-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill me-2"></i>
                    Submit Feedback
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-lg"
                onClick={() => navigate('/feedbackdata')}
              >
                <i className="bi bi-table me-2"></i>
                View All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;