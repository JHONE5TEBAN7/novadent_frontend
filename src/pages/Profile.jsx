import { useEffect, useState } from 'react';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { useAuth } from '../context/AuthContext.jsx';
import { patientService } from '../services/patientService.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const patient = (await patientService.list()).find((item) => item.id === user?.patientId);
      if (patient) setForm({ name: patient.name, phone: patient.phone, email: patient.email });
    }
    load();
  }, [user]);

  async function save(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!isPossiblePhoneNumber(form.phone)) return setError('Ingresa un teléfono válido.');
    await patientService.update(user.patientId, form);
    setNotice('Tus datos fueron actualizados.');
  }

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">CUENTA PERSONAL</span><h1>Mi perfil</h1><p>Consulta y actualiza tus datos permitidos.</p></div></div>
      <section className="surface profile-panel"><form className="entity-form" onSubmit={save}>
        <Input id="profile-name" label="Nombre completo" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <label className="field"><span className="field-label">Teléfono</span><PhoneInput international defaultCountry="CO" countryCallingCodeEditable={false} value={form.phone} onChange={(phone) => setForm({ ...form, phone: phone ?? '' })} /></label>
        <Input id="profile-email" label="Correo electrónico" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        {error && <p className="form-alert">{error}</p>}
        {notice && <p className="form-notice">{notice}</p>}
        <div className="modal-actions"><Button type="submit">Guardar datos</Button></div>
      </form></section>
    </>
  );
}
