import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    closePosition?: 'left' | 'right';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, closePosition = 'right' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className={`modal-header ${closePosition === 'left' ? 'close-left' : ''}`}>
                    <button className="modal-close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {title && <h3 className="modal-title">{title}</h3>}
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
