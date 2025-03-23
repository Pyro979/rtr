import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import './ErrorBoundary.css';

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="error-message">
        {error.statusText || error.message || "Unknown error"}
      </p>
      <div className="error-actions">
        <Link to="/" className="home-button">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
