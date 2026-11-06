export default function Input({ label, id, error, className = '', ...props }) {
  return (
    <label className={`field ${className}`} htmlFor={id}>
      {label && <span className="field-label">{label}</span>}
      <input id={id} className={`field-control ${error ? 'field-error' : ''}`} aria-invalid={Boolean(error)} {...props} />
      {error && <span className="field-error-text">{error}</span>}
    </label>
  );
}