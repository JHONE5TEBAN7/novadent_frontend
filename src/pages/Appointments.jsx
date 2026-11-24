import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import AppointmentFilters from '../components/AppointmentFilters.jsx';
import AppointmentTable from '../components/AppointmentTable.jsx';
import AppointmentForm from '../components/AppointmentForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { appointmentService } from '../services/appointmentService.js';
import { patientService } from '../services/patientService.js';
import { dentistService } from '../services/dentistService.js';

const emptyForm = { patientId: '', dentistId: '', date: '', status: 'Pendiente', reason: '' };

export default function Appointments() {
  const { user } = useAuth();
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

  function patientName(id) { return patients.find((item) => item.id === id)?.name ?? 'Paciente eliminado'; }
  function dentistName(id) { return dentists.find((item) => item.id === id)?.name ?? 'Sin asignar'; }

  function openForm(appointment = null) {
    setEditing(appointment);
    setError('');
    if (appointment) {
      setForm({ ...appointment, date: new Date(appointment.date).toISOString().slice(0, 16) });
    } else {
      const patientId = user?.role === 'PACIENTE' ? user.patientId : (patients[0]?.id ?? '');
      const dentistId = user?.role === 'ODONTOLOGO' ? user.dentistId : (dentists[0]?.id ?? '');
      setForm({ ...emptyForm, patientId, dentistId });
    }
    setFormOpen(true);
  }

  async function handleSubmit(event) {
    event.preventEvent?.();
    event.preventDefault();
    setError('');
    if (!form.date || new Date(form.date) < new Date()) return setError('Selecciona una fecha y hora futuras.');
    const payload = { ...form, date: new Date(form.date).toISOString() };
    try {
      if (editing) await appointmentService.update(editing.id, payload);
      else await appointmentService.create(payload);
      setEditing(null);
      setFormOpen(false);
      await loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No fue posible guardar la cita.');
    }
  }

  async function cancelAppointment(appointment) {
    if (appointment.status === 'Cancelada' || !window.confirm(`¿Cancelar la cita de ${patientName(appointment.patientId)}?`)) return;
    await appointmentService.update(appointment.id, { status: 'Cancelada' });
    await loadData();
  }

  const roleAppointments = appointments.filter((appointment) => {
    if (user?.role === 'PACIENTE') return appointment.patientId === user.patientId;
    if (user?.role === 'ODONTOLOGO') return appointment.dentistId === user.dentistId;
    return true;
  });
  const filtered = roleAppointments.filter((appointment) => {
    const matchesText = `${patientName(appointment.patientId)} ${dentistName(appointment.dentistId)}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (filter === 'Todas' || appointment.status === filter);
  });
  const canManage = ['ADMINISTRADOR', 'RECEPCIONISTA'].includes(user?.role);
  const canStatus = user?.role === 'ODONTOLOGO';
  const canCancel = user?.role === 'PACIENTE';
  const formPatients = user?.role === 'ODONTOLOGO'
    ? patients.filter((patient) => user.patientIds?.includes(patient.id))
    : patients;

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">AGENDA CLÍNICA</span><h1>{user?.role === 'PACIENTE' ? 'Mis citas' : user?.role === 'ODONTOLOGO' ? 'Mis citas programadas' : 'Citas'}</h1><p>Organiza y da seguimiento a las atenciones de tu clínica.</p></div><Button icon={Plus} onClick={() => openForm()} disabled={!patients.length || !dentists.length}>{user?.role === 'PACIENTE' ? 'Agendar mi cita' : 'Nueva cita'}</Button></div>
      <section className="surface table-panel">
        <div className="table-toolbar"><div className="toolbar-title"><h2 className="section-title">Agenda de citas</h2><span className="count-badge">{filtered.length}</span></div><AppointmentFilters search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} /></div>
        <AppointmentTable appointments={filtered} patientName={patientName} dentistName={dentistName} onEdit={openForm} onCancel={cancelAppointment} canManage={canManage} canStatus={canStatus} canCancel={canCancel} />
        {!filtered.length && <div className="empty-state">No encontramos citas para este filtro.</div>}
      </section>
      {formOpen && <Modal title={editing ? 'Editar cita' : 'Agendar una cita'} onClose={() => setFormOpen(false)}>
        <AppointmentForm form={form} setForm={setForm} onSubmit={handleSubmit} onClose={() => setFormOpen(false)} editing={editing} patients={formPatients} dentists={dentists} appointments={appointments} error={error} isPatient={user?.role === 'PACIENTE'} isDentist={user?.role === 'ODONTOLOGO'} />
      </Modal>}
    </>
  );
}
