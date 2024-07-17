import React from 'react';
import '../css/ErrorBox.css'; // Ensure you create this CSS file for styling

const ErrorBoxWithLink = ({ errorMessage, link, linkText }) => {
  if (!errorMessage) return null; // Do not render if there's no error message
  return (
    <div className="error-overlay">
      <div className="error-content">
        <p>{errorMessage}</p><a href={link}>{linkText}</a>
      </div>
    </div>
  );
};

export default ErrorBoxWithLink;