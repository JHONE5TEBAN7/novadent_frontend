import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Appointments from './pages/Appointments.jsx';
import Patients from './pages/Patients.jsx';
import Dentists from './pages/Dentists.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx';
import Users from './pages/Users.jsx';
import AccessDenied from './pages/AccessDenied.jsx';

const routeRoles = {
  '/dashboard': ['ADMINISTRADOR', 'ODONTOLOGO', 'RECEPCIONISTA'],
  '/appointments': ['ADMINISTRADOR', 'ODONTOLOGO', 'RECEPCIONISTA', 'PACIENTE'],
  '/patients': ['ADMINISTRADOR', 'ODONTOLOGO', 'RECEPCIONISTA'],
  '/dentists': ['ADMINISTRADOR', 'PACIENTE'],
  '/profile': ['PACIENTE'],
  '/users': ['ADMINISTRADOR'],
};

function RoleRoute({ allowed, children }) {
  const { user } = useAuth();
  if (!allowed.includes(user?.role)) return <AccessDenied />;
  return children;
}

function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to={user.role === 'PACIENTE' ? '/appointments' : '/dashboard'} replace />} />
            <Route path="/dashboard" element={<RoleRoute allowed={routeRoles['/dashboard']}><Dashboard /></RoleRoute>} />
            <Route path="/appointments" element={<RoleRoute allowed={routeRoles['/appointments']}><Appointments /></RoleRoute>} />
            <Route path="/patients" element={<RoleRoute allowed={routeRoles['/patients']}><Patients /></RoleRoute>} />
            <Route path="/dentists" element={<RoleRoute allowed={routeRoles['/dentists']}><Dentists /></RoleRoute>} />
            <Route path="/profile" element={<RoleRoute allowed={routeRoles['/profile']}><Profile /></RoleRoute>} />
            <Route path="/users" element={<RoleRoute allowed={routeRoles['/users']}><Users /></RoleRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'PACIENTE' ? '/appointments' : '/dashboard'} replace /> : <Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}