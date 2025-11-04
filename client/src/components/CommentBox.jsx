import React from 'react';
import './CommentBox.css';

function CommentBox({ comment, commentNumber, onRemove, onUpdateContent }) {
  return (
    <div className="comment-box">
      <label htmlFor={`comment-input-${comment.id}`}>
        Comment {commentNumber}:
      </label>
      <input
        type="text"
        id={`comment-input-${comment.id}`}
        className="comment-input"
        value={comment.content}
        onChange={(e) => onUpdateContent(comment.id, e.target.value)}
        placeholder="Type"
      />
      <button onClick={() => onRemove(comment.id)} className="remove-button">
        Remove
      </button>
    </div>
  );
}

export default CommentBox;