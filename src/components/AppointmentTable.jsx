import { Ban, Clock3, Pencil } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' });

export default function AppointmentTable({ appointments, patientName, dentistName, onEdit, onCancel, canManage, canStatus, canCancel }) {
  return (
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Paciente</th><th>Odontólogo</th><th>Fecha y hora</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
      {appointments.map((appointment) => <tr key={appointment.id}>
        <td><div className="person-cell"><span className="person-avatar">{patientName(appointment.patientId).slice(0, 1)}</span><span className="person-name">{patientName(appointment.patientId)}</span></div></td>
        <td>{dentistName(appointment.dentistId)}</td>
        <td><span className="date-cell"><strong>{dateFormatter.format(new Date(appointment.date))}</strong><small><Clock3 size={12} />{timeFormatter.format(new Date(appointment.date))}</small></span></td>
        <td>{appointment.reason}</td>
        <td><span className={`status-pill status-${appointment.status.toLowerCase()}`}>{appointment.status}</span></td>
        <td><div className="row-actions">
          {(canManage || canStatus) && <button className="icon-button" type="button" title="Editar cita" onClick={() => onEdit(appointment)}><Pencil size={16} /></button>}
          {(canManage || canCancel) && <button className="icon-button danger" type="button" title="Cancelar cita" disabled={appointment.status === 'Cancelada'} onClick={() => onCancel(appointment)}><Ban size={16} /></button>}
        </div></td>
      </tr>)}
    </tbody></table></div>
  );
}
