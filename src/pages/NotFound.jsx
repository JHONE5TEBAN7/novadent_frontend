import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return <section className="not-found surface"><span className="not-found-icon"><SearchX size={25} /></span><span className="eyebrow">ERROR 404</span><h1>No encontramos esta página</h1><p>La dirección puede haber cambiado o no está disponible.</p><Link to="/dashboard"><Button icon={ArrowLeft}>Volver al Dashboard</Button></Link></section>;
}