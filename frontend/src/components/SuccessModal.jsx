import React from "react";

export default function SuccessModal({
  open,
  title,
  message,
  onAction
}){

  if(!open){
    return null;
  }

  return(
    <div className="success-modal-overlay">

      <div className="success-modal">

        <div className="success-icon">
          ✓
        </div>

        <h2>
          {title}
        </h2>

        <p>
          {message}
        </p>

        <button
          className="success-modal-button"
          onClick={onAction}
        >
          Continue to Login →
        </button>

      </div>

    </div>
  );
}