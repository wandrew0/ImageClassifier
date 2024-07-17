import React, { useState } from 'react';
import ErrorBox from './ErrorBox';

const SignupWin = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleErrorClose = () => {
    setErrorMessage(''); // Clear the error message, hiding the error box
  };

  // Example function that might set an error message
  const triggerError = () => {
    setErrorMessage('An unexpected error occurred. Please try again.');
  };
  
  return (
    <div>
      <ErrorBox errorMessage="error" onClose={handleErrorClose} />
      
    </div>
  );
};

export default SignupWin;
