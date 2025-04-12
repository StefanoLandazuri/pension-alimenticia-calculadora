import React from 'react';
import './CornerTips.css';

const CornerTip = ({ position, content, imageSrc }) => {
  return (
    <div className={`corner-tip corner-tip-${position}`}>
      <div className="corner-tip-container">
        {imageSrc && (
          <div className="corner-tip-image">
            <img src={imageSrc} alt="Consejo legal" />
          </div>
        )}
        <div className="corner-tip-content">
          <p className="corner-tip-text">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default CornerTip;