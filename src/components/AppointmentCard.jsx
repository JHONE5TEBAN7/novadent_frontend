import { CalendarDays, Clock3 } from 'lucide-react';

const timeFormatter = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' });

export default function AppointmentCard({ appointment, patientName, dentistName }) {
  const date = new Date(appointment.date);
  return (
    <article className="appointment-card">
      <div className="appointment-date"><span>{date.toLocaleDateString('es-CO', { day: '2-digit' })}</span><small>{date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}</small></div>
      <div className="appointment-info">
        <strong>{patientName || 'Paciente'}</strong>
        <span>{dentistName || 'Odontólogo'} · {appointment.reason}</span>
        <div className="appointment-meta"><span><Clock3 size={13} />{timeFormatter.format(date)}</span><span><CalendarDays size={13} />{date.toLocaleDateString('es-CO', { weekday: 'long' })}</span></div>
      </div>
      <span className={`status-pill status-${appointment.status.toLowerCase().replaceAll(' ', '-')}`}>{appointment.status}</span>
    </article>
  );
}