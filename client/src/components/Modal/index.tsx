import Header from '@/components/Header';
import { X } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    name: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ name, isOpen, onClose,children}: ModalProps) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50"
            onClick={handleOutsideClick}
        >
            <div className="dark:bg-dark-secondary bg-white font-medium dark:text-white rounded-lg shadow-lg max-w-96 p-4">
                <Header
                    name={name}
                    isSmallText
                    buttonComponent={
                        <button title="Close" className="hover:bg-slate-400" onClick={onClose}>
                            <X className="h-6 w-6" />
                        </button>
                    }
                />
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;