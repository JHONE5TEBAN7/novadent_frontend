import { useEffect, useState } from 'react';
import { Ban, CalendarPlus, Clock3, Pencil, Plus, Search } from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import { appointmentService } from '../services/appointmentService.js';
import { patientService } from '../services/patientService.js';
import { dentistService } from '../services/dentistService.js';

const emptyForm = { patientId: '', dentistId: '', date: '', status: 'Pendiente', reason: '' };
const dateFormatter = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' });

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  async function loadData() {
    const [nextAppointments, nextPatients, nextDentists] = await Promise.all([appointmentService.list(), patientService.list(), dentistService.list()]);
    setAppointments(nextAppointments.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setPatients(nextPatients);
    setDentists(nextDentists);
  }

  useEffect(() => { loadData(); }, []);

  function openForm(appointment = null) {
    setEditing(appointment);
    setFormOpen(true);
    setError('');
    setForm(appointment ? { ...appointment, date: new Date(appointment.date).toISOString().slice(0, 16) } : { ...emptyForm, patientId: patients[0]?.id ?? '', dentistId: dentists[0]?.id ?? '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (new Date(form.date) < new Date()) return setError('Selecciona una fecha y hora futuras.');
    const payload = { ...form, date: new Date(form.date).toISOString() };
    if (editing) await appointmentService.update(editing.id, payload);
    else await appointmentService.create(payload);
    setEditing(null);
    setFormOpen(false);
    await loadData();
  }

  async function cancelAppointment(appointment) {
    if (appointment.status === 'Cancelada' || !window.confirm(`¿Cancelar la cita de ${patientName(appointment.patientId)}?`)) return;
    await appointmentService.update(appointment.id, { status: 'Cancelada' });
    await loadData();
  }

  function patientName(id) { return patients.find((item) => item.id === id)?.name ?? 'Paciente eliminado'; }
  function dentistName(id) { return dentists.find((item) => item.id === id)?.name ?? 'Sin asignar'; }

  const filtered = appointments.filter((appointment) => {
    const matchesText = `${patientName(appointment.patientId)} ${dentistName(appointment.dentistId)}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (filter === 'Todas' || appointment.status === filter);
  });

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">AGENDA CLÍNICA</span><h1>Citas</h1><p>Organiza y da seguimiento a las atenciones de tu clínica.</p></div><Button icon={Plus} onClick={() => openForm()} disabled={!patients.length || !dentists.length}>Nueva cita</Button></div>
      <section className="surface table-panel">
        <div className="table-toolbar"><div className="toolbar-title"><h2 className="section-title">Agenda de citas</h2><span className="count-badge">{filtered.length}</span></div><div className="table-tools"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar paciente u odontólogo" aria-label="Buscar paciente u odontólogo" /></label><select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrar por estado"><option>Todas</option><option>Confirmada</option><option>Pendiente</option><option>Cancelada</option></select></div></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Paciente</th><th>Odontólogo</th><th>Fecha y hora</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
          {filtered.map((appointment) => <tr key={appointment.id}><td><div className="person-cell"><span className="person-avatar">{patientName(appointment.patientId).slice(0, 1)}</span><span className="person-name">{patientName(appointment.patientId)}</span></div></td><td>{dentistName(appointment.dentistId)}</td><td><span className="date-cell"><strong>{dateFormatter.format(new Date(appointment.date))}</strong><small><Clock3 size={12} />{timeFormatter.format(new Date(appointment.date))}</small></span></td><td>{appointment.reason}</td><td><span className={`status-pill status-${appointment.status.toLowerCase()}`}>{appointment.status}</span></td><td><div className="row-actions"><button className="icon-button" type="button" title="Editar cita" aria-label="Editar cita" onClick={() => openForm(appointment)}><Pencil size={16} /></button><button className="icon-button danger" type="button" title="Cancelar cita" aria-label="Cancelar cita" disabled={appointment.status === 'Cancelada'} onClick={() => cancelAppointment(appointment)}><Ban size={16} /></button></div></td></tr>)}
        </tbody></table>{!filtered.length && <div className="empty-state">No encontramos citas para este filtro.</div>}</div>
      </section>
      {formOpen && <Modal title={editing ? 'Editar cita' : 'Agendar una cita'} onClose={() => setFormOpen(false)}>
        <form className="entity-form" onSubmit={handleSubmit}>
          <label className="field"><span className="field-label">Paciente</span><select className="field-control" required value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })}><option value="" disabled>Selecciona un paciente</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></label>
          <label className="field"><span className="field-label">Odontólogo</span><select className="field-control" required value={form.dentistId} onChange={(event) => setForm({ ...form, dentistId: event.target.value })}><option value="" disabled>Selecciona un odontólogo</option>{dentists.map((dentist) => <option key={dentist.id} value={dentist.id}>{dentist.name} · {dentist.specialty}</option>)}</select></label>
          <Input id="appointment-date" label="Fecha y hora" type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
          <label className="field"><span className="field-label">Estado</span><select className="field-control" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Pendiente</option><option>Confirmada</option><option>Cancelada</option></select></label>
          <Input id="appointment-reason" label="Motivo de consulta" placeholder="Ej. Control de ortodoncia" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required />
          {error && <p className="form-alert" role="alert">{error}</p>}
          <div className="modal-actions"><Button variant="secondary" type="button" onClick={() => setFormOpen(false)}>Volver</Button><Button type="submit" icon={CalendarPlus}>{editing ? 'Guardar cambios' : 'Agendar cita'}</Button></div>
        </form>
      </Modal>}
    </>
  );
}