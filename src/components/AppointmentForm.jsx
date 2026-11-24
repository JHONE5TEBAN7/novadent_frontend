import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import Button from './Button.jsx';
import Input from './Input.jsx';
import AppointmentCalendar from './AppointmentCalendar.jsx';

const timeSlots = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

export default function AppointmentForm({ form, setForm, onSubmit, onClose, editing, patients, dentists, appointments, error, isPatient, isDentist }) {
  const initialDate = form.date ? form.date.slice(0, 10) : '';
  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    if (selectedDate) setForm((current) => ({ ...current, date: `${selectedDate}${current.date?.slice(10) ?? 'T09:00'}` }));
  }, [selectedDate]);

  const occupied = useMemo(() => appointments
    .filter((item) => item.status !== 'Cancelada' && item.dentistId === form.dentistId)
    .map((item) => item.date), [appointments, form.dentistId]);

  const availableSlots = timeSlots.filter((time) => {
    if (!selectedDate) return true;
    const candidate = new Date(`${selectedDate}T${time}:00`).getTime();
    return !occupied.some((date) => {
      const occupiedDate = new Date(date);
      return occupiedDate.getTime() === candidate;
    });
  });

  function changeTime(time) {
    setForm((current) => ({ ...current, date: `${selectedDate}T${time}` }));
  }

  return (
    <form className="entity-form" onSubmit={onSubmit}>
      {!isPatient && <label className="field"><span className="field-label">Paciente</span><select className="field-control" required disabled={isDentist && !editing} value={form.patientId} onChange={(event) => setForm({ ...form, patientId: event.target.value })}><option value="" disabled>Selecciona un paciente</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</select></label>}
      {!isDentist && <label className="field"><span className="field-label">Odontólogo</span><select className="field-control" required value={form.dentistId} onChange={(event) => setForm({ ...form, dentistId: event.target.value })}><option value="" disabled>Selecciona un odontólogo</option>{dentists.map((dentist) => <option key={dentist.id} value={dentist.id}>{dentist.name} · {dentist.specialty}</option>)}</select></label>}
      {isDentist && <Input id="appointment-dentist" label="Odontólogo" value={dentists.find((item) => item.id === form.dentistId)?.name ?? 'Mi agenda'} disabled />}
      <div className="appointment-calendar-field">
        <span className="field-label">Fecha</span>
        <AppointmentCalendar value={selectedDate} onChange={setSelectedDate} occupiedDates={occupied} />
      </div>
      <label className="field"><span className="field-label">Hora disponible</span><select className="field-control" required value={form.date?.slice(11, 16) ?? ''} onChange={(event) => changeTime(event.target.value)} disabled={!selectedDate || !availableSlots.length}><option value="" disabled>Selecciona una hora</option>{availableSlots.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
      <label className="field"><span className="field-label">Estado</span><select className="field-control" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Pendiente</option><option>Confirmada</option><option>Atendida</option><option>Cancelada</option></select></label>
      <Input id="appointment-reason" label="Motivo de consulta" placeholder="Ej. Control de ortodoncia" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required />
      {error && <p className="form-alert" role="alert">{error}</p>}
      <div className="modal-actions"><Button variant="secondary" type="button" onClick={onClose}>Volver</Button><Button type="submit" icon={CalendarPlus}>{editing ? 'Guardar cambios' : 'Agendar cita'}</Button></div>
    </form>
  );
}
