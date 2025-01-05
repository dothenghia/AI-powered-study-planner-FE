import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideFooter?: boolean;
  hideTitle?: boolean;
  containerClassName?: string;
  preventCloseOnOutsideClick?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, footer, hideFooter = false, hideTitle = false, containerClassName, preventCloseOnOutsideClick = false }: ModalProps) => {
  const modalRoot = document.getElementById('modal-root');
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !preventCloseOnOutsideClick) {
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
  }, [isOpen, onClose, preventCloseOnOutsideClick]);

  // Return null if modal is not open or modal root is not found
  if (!isOpen || !modalRoot) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!preventCloseOnOutsideClick) {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleOverlayClick} />
        <div
          ref={modalRef}
          className={`relative w-full max-w-lg transform rounded-lg bg-white p-6 pb-1 shadow-xl transition-all ${containerClassName}`}
        >
          {!hideTitle && (
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="mb-6">{children}</div>
          {!hideFooter && (
            footer || (
              <div className="flex justify-end space-x-3">
                <Button variant="gray" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" form="modal-form">
                  Confirm
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
};
