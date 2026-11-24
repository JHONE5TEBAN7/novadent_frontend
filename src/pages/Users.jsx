import { useEffect, useState } from 'react';
import { listUsers, updateUserRole } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const roles = ['ADMINISTRADOR', 'ODONTOLOGO', 'RECEPCIONISTA', 'PACIENTE'];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { user, setUser } = useAuth();

  async function load() {
    try { setUsers(await listUsers()); } catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function changeRole(id, role) {
    try {
      const updated = await updateUserRole(id, role);
      await load();
      if (user?.id === id) setUser(updated);
    } catch (e) { setError(e.message); }
  }

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">SEGURIDAD</span><h1>Usuarios y roles</h1><p>Administra las cuentas autorizadas del sistema.</p></div></div>
      <section className="surface table-panel">
        {error && <p className="form-alert">{error}</p>}
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th></tr></thead><tbody>
          {users.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.email}</td><td><select className="filter-select" value={item.role} onChange={(event) => changeRole(item.id, event.target.value)}>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></td></tr>)}
        </tbody></table></div>
      </section>
    </>
  );
}
