import closeIcon from '../../assets/close.svg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-500 bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-slate-400 border border-slate-600 rounded-lg shadow-lg max-w-2xl w-full text-white">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Night Plan</h2>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
          >
            <img src={closeIcon} alt="Close" className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
