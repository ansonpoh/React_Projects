

export default function SideModal({ isOpen, onClose, children }) {
  return (
    <div className={`drawer_overlay ${isOpen ? 'open' : ''}`}>
      <div className={`drawer ${isOpen ? 'slide-in' : 'slide-out'}`}>
        <button className="close_button" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}
