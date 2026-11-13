# NovaDent

Frontend para la gestión de citas odontológicas, construido con React y Vite.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Inicio

```bash
npm install

npm run dev
```

La aplicación se abre en la URL que muestra Vite, normalmente `http://localhost:5173`.

## Configuración de API

Copia `.env.example` como `.env.local` y define `VITE_API_URL` cuando el backend esté disponible. La interfaz usa datos simulados guardados en el navegador mientras `VITE_USE_MOCKS` sea `true`.

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCKS=true
```

Los servicios bajo `src/services/` aíslan los datos simulados del cliente HTTP. Las rutas de recursos son una convención provisional y deben acordarse con el backend antes de desactivar los mocks.

## Navegación

Inicia sesión con cualquier correo válido y una contraseña de al menos seis caracteres. La sesión de demostración se guarda en el navegador. El menú lateral permite acceder al Dashboard, Citas, Pacientes y Odontólogos.
