import React from 'react';
import '../css/ErrorBox.css'; // Ensure you create this CSS file for styling

const ErrorBox = ({ errorMessage, onClose }) => {
  if (!errorMessage) return null; // Do not render if there's no error message

  return (
    <div className="error-overlay">
      <div className="error-content">
        <p>{errorMessage}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorBox;
