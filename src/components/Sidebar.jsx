import { Link, NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, UsersRound, UserRound, Settings2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/dental-mark.svg';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/appointments', label: 'Citas', icon: CalendarDays },
  { to: '/patients', label: 'Pacientes', icon: UsersRound },
  { to: '/dentists', label: 'Odontólogos', icon: UserRound },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <Link className="brand" to="/dashboard"><img src={logo} alt="" /><span>nova<span>dent</span><small>CLÍNICA ODONTOLÓGICA</small></span></Link>
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