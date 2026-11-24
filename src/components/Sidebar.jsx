import { Link, NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, UsersRound, UserRound, Settings2, LogOut, UserCog, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/dental-mark.svg';

const linksByRole = {
  ADMINISTRADOR: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/appointments', label: 'Citas', icon: CalendarDays },
    { to: '/patients', label: 'Pacientes', icon: UsersRound },
    { to: '/dentists', label: 'Odontólogos', icon: UserRound },
    { to: '/users', label: 'Usuarios', icon: UserCog },
  ],
  ODONTOLOGO: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/appointments', label: 'Mis citas', icon: CalendarDays },
    { to: '/patients', label: 'Mis pacientes', icon: UsersRound },
  ],
  RECEPCIONISTA: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/appointments', label: 'Citas', icon: CalendarDays },
    { to: '/patients', label: 'Pacientes', icon: UsersRound },
  ],
  PACIENTE: [
    { to: '/appointments', label: 'Mis citas', icon: CalendarDays },
    { to: '/dentists', label: 'Odontólogos', icon: UserRound },
    { to: '/profile', label: 'Mi perfil', icon: UserCircle },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = linksByRole[user?.role] ?? [];

  return (
    <aside className="sidebar">
      <Link className="brand" to={user?.role === 'PACIENTE' ? '/appointments' : '/dashboard'}><img src={logo} alt="" /><span>nova<span>dent</span><small>CLÍNICA ODONTOLÓGICA</small></span></Link>
      <div className="nav-caption">MENÚ PRINCIPAL</div>
      <nav className="side-nav" aria-label="Navegación principal">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="note-dot" /><span><strong>Clínica activa</strong><small>Agenda actualizada</small></span></div>
        <button className="nav-link signout-link" type="button" onClick={logout}><LogOut size={18} /><span>Cerrar sesión</span></button>
        <div className="sidebar-footer"><Settings2 size={14} /> Panel administrativo</div>
      </div>
    </aside>
  );
}