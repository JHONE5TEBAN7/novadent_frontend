import Calendar from 'react-calendar';

export default function AppointmentCalendar({ value, onChange, occupiedDates = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const occupied = new Set(occupiedDates.map((date) => new Date(date).toDateString()));

  return (
    <div className="appointment-calendar">
      <Calendar
        locale="es-CO"
        value={value ? new Date(`${value}T12:00:00`) : null}
        onChange={(date) => onChange(date.toISOString().slice(0, 10))}
        minDate={today}
        tileDisabled={({ date }) => {
          const occupiedAtDate = occupiedDates.filter((item) => new Date(item).toDateString() === date.toDateString()).length;
          return occupiedAtDate >= 16;
        }}
        tileClassName={({ date }) => occupied.has(date.toDateString()) ? 'calendar-busy' : 'calendar-available'}
      />
    </div>
  );
}
