import React, { useState } from 'react';

function RatingForm({ onSubmit }) {
  const [code, setCode] = useState('');
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ code, score, feedback });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
      <div className="mb-3">
        <label className="form-label">Confirmation Code</label>
        <input type="text" className="form-control" value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Rating (1-5)</label>
        <input type="number" className="form-control" value={score} onChange={(e) => setScore(e.target.value)} min="1" max="5" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Feedback</label>
        <textarea className="form-control" value={feedback} onChange={(e) => setFeedback(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Submit Rating</button>
    </form>
  );
}

export default RatingForm;