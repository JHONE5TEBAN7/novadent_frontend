import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user } = useAuth();
  const displayName = user?.name?.replace(/[._-]/g, ' ') || 'Administración';

  return (
    <header className="topbar">
      <div className="topbar-actions">
        <button className="icon-button notification-button" type="button" aria-label="Notificaciones"><Bell size={18} /><i /></button>
        <div className="topbar-divider" />
        <div className="profile-chip"><span className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</span><span className="profile-copy"><strong>{displayName}</strong><small>Administrador</small></span><ChevronDown size={14} className="profile-chevron" /></div>
      </div>
    </header>
  );
}