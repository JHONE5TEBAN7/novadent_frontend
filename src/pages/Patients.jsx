import { useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2, UsersRound } from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import { patientService } from '../services/patientService.js';

const emptyForm = { name: '', document: '', phone: '', email: '' };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  async function loadPatients() { setPatients(await patientService.list()); }
  useEffect(() => { loadPatients(); }, []);

  function openForm(patient = null) {
    setEditing(patient);
    setFormOpen(true);
    setForm(patient ? { name: patient.name, document: patient.document, phone: patient.phone, email: patient.email } : { ...emptyForm });
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const duplicate = patients.some((patient) => patient.document === form.document && patient.id !== editing?.id);
    if (duplicate) return setError('Ya existe un paciente con ese documento.');
    if (editing) await patientService.update(editing.id, form);
    else await patientService.create(form);
    setEditing(null);
    setFormOpen(false);
    setForm({ ...emptyForm });
    await loadPatients();
  }

  async function removePatient(patient) {
    if (!window.confirm(`¿Eliminar el registro de ${patient.name}?`)) return;
    await patientService.remove(patient.id);
    await loadPatients();
  }

  const filtered = patients.filter((patient) => `${patient.name} ${patient.document} ${patient.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">DIRECTORIO CLÍNICO</span><h1>Pacientes</h1><p>Consulta y administra la información de tus pacientes.</p></div><Button icon={Plus} onClick={() => openForm()}>Registrar paciente</Button></div>
      <section className="surface table-panel">
        <div className="table-toolbar"><div className="toolbar-title"><h2 className="section-title">Todos los pacientes</h2><span className="count-badge">{patients.length}</span></div><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, documento o correo" aria-label="Buscar pacientes" /></label></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Paciente</th><th>Documento</th><th>Teléfono</th><th>Correo electrónico</th><th>Acciones</th></tr></thead><tbody>{filtered.map((patient) => <tr key={patient.id}><td><div className="person-cell"><span className="person-avatar">{patient.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="person-name">{patient.name}</span></div></td><td>{patient.document}</td><td>{patient.phone}</td><td>{patient.email}</td><td><div className="row-actions"><button className="icon-button" type="button" title="Editar paciente" aria-label="Editar paciente" onClick={() => openForm(patient)}><Pencil size={16} /></button><button className="icon-button danger" type="button" title="Eliminar paciente" aria-label="Eliminar paciente" onClick={() => removePatient(patient)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>
          {!filtered.length && <div className="empty-state"><UsersRound size={24} /><p>{search ? 'No hay resultados para tu búsqueda.' : 'Aún no hay pacientes registrados.'}</p></div>}</div>
      </section>
      {formOpen && <Modal title={editing ? 'Editar paciente' : 'Registrar paciente'} onClose={() => { setFormOpen(false); setEditing(null); setForm({ ...emptyForm }); }}>
        <form className="entity-form" onSubmit={handleSubmit}>
          <Input id="patient-name" label="Nombre completo" placeholder="Ej. Andrea Ramírez" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={3} />
          <Input id="patient-document" label="Documento" placeholder="Número de identificación" value={form.document} onChange={(event) => setForm({ ...form, document: event.target.value })} required />
          <Input id="patient-phone" label="Teléfono" type="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          <Input id="patient-email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          {error && <p className="form-alert" role="alert">{error}</p>}
          <div className="modal-actions"><Button variant="secondary" type="button" onClick={() => { setFormOpen(false); setEditing(null); setForm({ ...emptyForm }); }}>Cancelar</Button><Button type="submit">{editing ? 'Guardar cambios' : 'Registrar paciente'}</Button></div>
        </form>
      </Modal>}
    </>
  );
}
