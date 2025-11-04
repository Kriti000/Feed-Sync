import React from "react";
import "./CommentBox.css";

const Comments = ({ comments, setComments }) => {
  const handleChange = (id, value) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, content: value } : c))
    );
  };

  const handleImageUpload = (id, file) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, image: file } : c))
    );
  };

  const addComment = () => {
    setComments(prev => [
      ...prev,
      { id: Date.now().toString(), content: "", image: null }
    ]);
  };

  const removeComment = (id) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  return (
    <>
      {comments.map((c, idx) => (
        <div key={c.id} className="comment-box">
          <label>Step {idx + 1}</label>
          <input
            className="comment-input"
            type="text"
            value={c.content}
            onChange={e => handleChange(c.id, e.target.value)}
            placeholder="Enter comment"
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleImageUpload(c.id, e.target.files[0])}
          />
          <button className="remove-button" onClick={() => removeComment(c.id)}>
            Remove
          </button>
        </div>
      ))}
      <button className="add-button" type="button" onClick={addComment}>Add Comment</button>
    </>
  );
};

export default Comments;
