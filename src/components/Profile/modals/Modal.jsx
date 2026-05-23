import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import "../../../styles/Profile/modals/Modal.css";

const Modal = ({ isOpen, onClose, title, children, maxWidth = 520 }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="profile-attr-mbk" onClick={onClose}></div>
            <div
                className={`profile-attr-modal ${isOpen ? 'open' : ''}`}
                style={{ maxWidth: `${maxWidth}px` }}
            >
                <div className="profile-attr-mhdr">
                    <div className="profile-attr-mtit">{title}</div>
                    <button className="profile-attr-mcls" onClick={onClose}>
                        <X/>
                    </button>
                </div>
                <div className="profile-attr-mbdy">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Modal;