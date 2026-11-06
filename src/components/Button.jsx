export default function Button({ children, variant = 'primary', size = '', icon: Icon, className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${size ? `button-${size}` : ''} ${className}`.trim()} {...props}>
      {Icon && <Icon size={17} strokeWidth={2} />}
      {children}
    </button>
  );
}