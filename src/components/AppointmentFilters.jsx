import { Search } from 'lucide-react';

export default function AppointmentFilters({ search, onSearch, filter, onFilter }) {
  return (
    <div className="table-tools">
      <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar paciente u odontólogo" aria-label="Buscar paciente u odontólogo" /></label>
      <select className="filter-select" value={filter} onChange={(event) => onFilter(event.target.value)} aria-label="Filtrar por estado">
        <option>Todas</option><option>Confirmada</option><option>Pendiente</option><option>Atendida</option><option>Cancelada</option>
      </select>
    </div>
  );
}
