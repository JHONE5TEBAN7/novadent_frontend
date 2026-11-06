import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarPlus, CalendarCheck2, Clock3, UsersRound, UserRound, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard.jsx';
import Button from '../components/Button.jsx';
import { appointmentService } from '../services/appointmentService.js';
import { patientService } from '../services/patientService.js';
import { dentistService } from '../services/dentistService.js';

const weekday = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Dashboard() {
  const [data, setData] = useState({ appointments: [], patients: [], dentists: [] });

  useEffect(() => {
    Promise.all([appointmentService.list(), patientService.list(), dentistService.list()]).then(([appointments, patients, dentists]) => setData({ appointments, patients, dentists }));
  }, []);

  const today = new Date();
  const upcoming = data.appointments.filter((item) => new Date(item.date) >= new Date(today.setHours(0, 0, 0, 0)) && item.status !== 'Cancelada').sort((a, b) => new Date(a.date) - new Date(b.date));
  const pending = data.appointments.filter((item) => item.status === 'Pendiente').length;
  const appointmentCount = data.appointments.length;
  const byId = (items) => Object.fromEntries(items.map((item) => [item.id, item.name]));
  const patientNames = byId(data.patients);
  const dentistNames = byId(data.dentists);
  const metrics = [
    { label: 'Total de pacientes', value: data.patients.length, detail: 'Pacientes registrados', icon: UsersRound, tone: 'sky' },
    { label: 'Odontólogos', value: data.dentists.length, detail: 'Equipo clínico activo', icon: UserRound, tone: 'mint' },
    { label: 'Citas programadas', value: appointmentCount, detail: 'En toda la agenda', icon: CalendarCheck2, tone: 'blue' },
    { label: 'Citas pendientes', value: pending, detail: 'Requieren confirmación', icon: Clock3, tone: 'peach' },
  ];

  return (
    <>
      <div className="page-heading dashboard-heading"><div><span className="eyebrow">{weekday.format(new Date()).toUpperCase()}</span><h1>Hola, qué bueno verte <span className="wave">✳</span></h1><p>Este es el resumen de tu clínica para hoy.</p></div><Link to="/appointments"><Button icon={CalendarPlus}>Agendar una cita</Button></Link></div>
      <section className="metrics-grid" aria-label="Resumen de la clínica">
        {metrics.map(({ label, value, detail, icon: Icon, tone }) => <article className="metric-card surface" key={label}><div className={`metric-icon metric-${tone}`}><Icon size={19} /></div><div className="metric-value">{value}</div><div className="metric-label">{label}</div><div className="metric-detail">{detail}</div><span className="metric-arrow"><ArrowUpRight size={16} /></span></article>)}
      </section>
      <section className="dashboard-lower">
        <div className="surface agenda-panel"><header className="panel-heading"><div><h2 className="section-title">Próximas citas</h2><p>Lo que viene en tu agenda</p></div><Link className="subtle-link" to="/appointments">Ver agenda <ArrowUpRight size={15} /></Link></header>
          {upcoming.length ? <div className="upcoming-list">{upcoming.slice(0, 4).map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} patientName={patientNames[appointment.patientId]} dentistName={dentistNames[appointment.dentistId]} />)}</div> : <div className="empty-state">No hay citas próximas en la agenda.</div>}
        </div>
        <aside className="dashboard-aside">
          <div className="welcome-card"><div className="welcome-icon"><Sparkles size={18} /></div><span className="eyebrow">TU CLÍNICA, EN ORDEN</span><h2>Un día a la vez,<br />una sonrisa a la vez.</h2><p>La agenda está lista para ayudarte a coordinar cada atención.</p><div className="welcome-foot"><span><i /> Sistema operativo</span><span>NovaDent</span></div></div>
          <div className="quick-card surface"><h3 className="section-title">Accesos rápidos</h3><Link to="/patients"><UsersRound size={17} /><span>Registrar paciente</span><ArrowUpRight size={15} /></Link><Link to="/dentists"><UserRound size={17} /><span>Ver equipo clínico</span><ArrowUpRight size={15} /></Link></div>
        </aside>
      </section>
    </>
  );
}