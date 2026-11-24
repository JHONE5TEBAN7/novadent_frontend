import { useState } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/dental-mark.svg';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { registerPatient } from '../services/authService.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@novadent.co');
  const [password, setPassword] = useState('novadent2026');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState('login');
  const [registerForm, setRegisterForm] = useState({ name: '', documentType: 'CC', document: '', birthDate: '', phone: '', email: '', password: '', confirmPassword: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Ingresa un correo electrónico válido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    try {
      const loggedUser = await login({ email, password });
      navigate(loggedUser.role === 'PACIENTE' ? '/appointments' : '/dashboard', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No fue posible iniciar sesión.');
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (registerForm.password !== registerForm.confirmPassword) return setError('Las contraseñas no coinciden.');
    if (registerForm.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (!registerForm.phone || !isPossiblePhoneNumber(registerForm.phone)) return setError('Ingresa un teléfono válido.');
    try {
      await registerPatient(registerForm);
      setNotice('Registro exitoso. Ya puedes iniciar sesión como paciente.');
      setMode('login');
      setEmail(registerForm.email);
      setPassword('');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'No fue posible completar el registro.');
    }
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
          <div className="auth-tabs"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Iniciar sesión</button><button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); setNotice(''); }}>Registrarse</button></div>
          {mode === 'login' ? <form className="login-form" onSubmit={handleSubmit} noValidate>
            <Input id="login-email" label="Correo electrónico" type="email" autoComplete="email" value={email} placeholder="nombre@clinica.com" onChange={(event) => setEmail(event.target.value)} required />
            <Input id="login-password" label="Contraseña" type="password" autoComplete="current-password" value={password} placeholder="Ingresa tu contraseña" onChange={(event) => setPassword(event.target.value)} required />
            <div className="login-options"><label className="remember-option"><input type="checkbox" defaultChecked /> <span>Recordarme</span></label><button type="button" className="text-button" onClick={() => setNotice('Contacta al administrador de tu clínica para restablecer el acceso.')}>¿Olvidaste tu contraseña?</button></div>
            {error && <p className="form-alert" role="alert">{error}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <Button type="submit" className="login-submit">Ingresar al panel <ArrowRight size={17} /></Button>
          </form> : <form className="register-form" onSubmit={handleRegister} noValidate>
            <Input id="register-name" label="Nombre completo" value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} required />
            <div className="register-grid">
              <label className="field"><span className="field-label">Tipo de documento</span><select className="field-control" value={registerForm.documentType} onChange={(event) => setRegisterForm({ ...registerForm, documentType: event.target.value })}><option value="CC">Cédula de ciudadanía</option><option value="CE">Cédula de extranjería</option><option value="TI">Tarjeta de identidad</option><option value="PAS">Pasaporte</option></select></label>
              <Input id="register-document" label="Número de documento" value={registerForm.document} onChange={(event) => setRegisterForm({ ...registerForm, document: event.target.value })} required />
            </div>
            <Input id="register-birth" label="Fecha de nacimiento" type="date" value={registerForm.birthDate} onChange={(event) => setRegisterForm({ ...registerForm, birthDate: event.target.value })} required />
            <label className="field"><span className="field-label">Teléfono</span><PhoneInput international defaultCountry="CO" countryCallingCodeEditable={false} value={registerForm.phone} onChange={(phone) => setRegisterForm({ ...registerForm, phone: phone ?? '' })} /></label>
            <Input id="register-email" label="Correo electrónico" type="email" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} required />
            <div className="register-grid">
              <Input id="register-password" label="Contraseña" type="password" value={registerForm.password} onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })} required />
              <Input id="register-confirm" label="Confirmar contraseña" type="password" value={registerForm.confirmPassword} onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })} required />
            </div>
            {error && <p className="form-alert" role="alert">{error}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <Button type="submit" className="login-submit">Crear cuenta de paciente <ArrowRight size={17} /></Button>
          </form>}
          <div className="login-legal">Al continuar, confirmas que eres parte del equipo de NovaDent.</div>
        </div>
      </section>
    </main>
  );
}