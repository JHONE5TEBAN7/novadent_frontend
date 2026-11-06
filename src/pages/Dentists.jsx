import { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, UserRound } from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import { dentistService } from '../services/dentistService.js';

const emptyForm = { name: '', specialty: '', phone: '', email: '' };

export default function Dentists() {
  const [dentists, setDentists] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadDentists() { setDentists(await dentistService.list()); }
  useEffect(() => { loadDentists(); }, []);

  function openForm(dentist = null) {
    setEditing(dentist);
    setFormOpen(true);
    setForm(dentist ? { name: dentist.name, specialty: dentist.specialty, phone: dentist.phone, email: dentist.email } : { ...emptyForm });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (editing) await dentistService.update(editing.id, form);
    else await dentistService.create(form);
    setFormOpen(false);
    setEditing(null);
    setForm({ ...emptyForm });
    await loadDentists();
  }

  async function removeDentist(dentist) {
    if (!window.confirm(`¿Eliminar a ${dentist.name} del equipo?`)) return;
    await dentistService.remove(dentist.id);
    await loadDentists();
  }

  const filtered = dentists.filter((dentist) => `${dentist.name} ${dentist.specialty}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">EQUIPO CLÍNICO</span><h1>Odontólogos</h1><p>Administra los perfiles y especialidades de tu equipo.</p></div><Button icon={Plus} onClick={() => openForm()}>Agregar odontólogo</Button></div>
      <section className="surface table-panel">
        <div className="table-toolbar"><div className="toolbar-title"><h2 className="section-title">Equipo clínico</h2><span className="count-badge">{dentists.length}</span></div><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o especialidad" aria-label="Buscar odontólogos" /></label></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Odontólogo</th><th>Especialidad</th><th>Teléfono</th><th>Correo electrónico</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((dentist) => <tr key={dentist.id}><td><div className="person-cell"><span className="person-avatar dentist-avatar">{dentist.name.replace(/^(Dra?\.\s*)/, '').split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="person-name">{dentist.name}</span></div></td><td>{dentist.specialty}</td><td>{dentist.phone}</td><td>{dentist.email}</td><td><span className="status-pill status-activo">Activo</span></td><td><div className="row-actions"><button className="icon-button" type="button" title="Editar odontólogo" aria-label="Editar odontólogo" onClick={() => openForm(dentist)}><Pencil size={16} /></button><button className="icon-button danger" type="button" title="Eliminar odontólogo" aria-label="Eliminar odontólogo" onClick={() => removeDentist(dentist)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>
          {!filtered.length && <div className="empty-state"><UserRound size={24} /><p>{search ? 'No hay resultados para tu búsqueda.' : 'Aún no hay odontólogos registrados.'}</p></div>}</div>
      </section>
      {formOpen && <Modal title={editing ? 'Editar odontólogo' : 'Agregar odontólogo'} onClose={() => setFormOpen(false)}>
        <form className="entity-form" onSubmit={handleSubmit}>
          <Input id="dentist-name" label="Nombre completo" placeholder="Ej. Dra. Mariana López" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={3} />
          <Input id="dentist-specialty" label="Especialidad" placeholder="Ej. Ortodoncia" value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} required />
          <Input id="dentist-phone" label="Teléfono" type="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          <Input id="dentist-email" label="Correo electrónico" type="email" placeholder="nombre@novadent.co" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <div className="modal-actions"><Button variant="secondary" type="button" onClick={() => setFormOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Guardar cambios' : 'Agregar odontólogo'}</Button></div>
        </form>
      </Modal>}
    </>
  );
}