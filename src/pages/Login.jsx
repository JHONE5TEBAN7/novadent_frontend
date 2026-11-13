import { useState } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/dental-mark.svg';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@novadent.co');
  const [password, setPassword] = useState('novadent2026');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Ingresa un correo electrónico válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    await login({ email, password });
    navigate('/dashboard', { replace: true });
  }

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-brand"><img src={logo} alt="" /><span>nova<span>dent</span></span></div>
        <div className="story-copy">
          <span className="story-kicker"><span /> CUIDAMOS CADA DETALLE</span>
          <h1>Una sonrisa<br />saludable empieza<br />con <em>un buen cuidado.</em></h1>
          <p>La gestión de tu clínica, más clara y cerca de ti.</p>
          <div className="story-perks"><span><Check size={15} /> Agenda organizada</span><span><Check size={15} /> Atención coordinada</span></div>
        </div>
        <div className="story-orbit orbit-one" /><div className="story-orbit orbit-two" />
        <div className="story-footer"><ShieldCheck size={15} /> Acceso seguro para el equipo clínico <span>·</span> © 2026 NovaDent</div>
      </section>
      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="mobile-login-brand"><img src={logo} alt="" /><span>nova<span>dent</span></span></div>
          <div className="login-welcome"><span className="eyebrow">BIENVENIDO DE NUEVO</span><h2>Inicia sesión</h2><p>Ingresa tus datos para acceder al panel de tu clínica.</p></div>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <Input id="login-email" label="Correo electrónico" type="email" autoComplete="email" placeholder="nombre@clinica.com" onChange={(event) => setEmail(event.target.value)} required />
            <Input id="login-password" label="Contraseña" type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña" onChange={(event) => setPassword(event.target.value)} required />
            <div className="login-options"><label className="remember-option"><input type="checkbox" defaultChecked /> <span>Recordarme</span></label><button type="button" className="text-button" onClick={() => setNotice('Contacta al administrador de tu clínica para restablecer el acceso.')}>¿Olvidaste tu contraseña?</button></div>
            {error && <p className="form-alert" role="alert">{error}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <Button type="submit" className="login-submit">Ingresar al panel <ArrowRight size={17} /></Button>
          </form>
          <div className="login-legal">Al continuar, confirmas que eres parte del equipo de NovaDent.</div>
        </div>
      </section>
    </main>
  );
}