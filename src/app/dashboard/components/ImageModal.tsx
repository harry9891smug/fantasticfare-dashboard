// components/ImageModal.tsx
import React from 'react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null; // Don't render the modal if there's no image URL

  return (
    <div className="modal show" style={{ display: 'block' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <img src={imageUrl} alt="Country Image" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
