import { ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export default function AccessDenied() {
  return (
    <section className="not-found">
      <div className="not-found-icon"><ShieldX size={24} /></div>
      <span className="eyebrow">CONTROL DE ACCESO</span>
      <h1>No tienes permisos para esta sección</h1>
      <p>Tu rol no puede consultar o modificar este recurso.</p>
      <Link to="/"><Button>Volver al inicio</Button></Link>
    </section>
  );
}
