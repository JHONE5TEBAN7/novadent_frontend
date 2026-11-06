const STORAGE_PREFIX = 'novadent:';

function dateOffset(days, hour = 9, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

const seeds = {
  patients: [
    { id: 'p-1001', name: 'Valentina Rojas', document: '1028457612', phone: '+57 310 482 1690', email: 'valentina.rojas@mail.com', createdAt: dateOffset(-75) },
    { id: 'p-1002', name: 'Mateo Castillo', document: '1003198476', phone: '+57 315 704 2281', email: 'mateo.castillo@mail.com', createdAt: dateOffset(-62) },
    { id: 'p-1003', name: 'Camila Herrera', document: '1019654228', phone: '+57 320 198 4472', email: 'camila.herrera@mail.com', createdAt: dateOffset(-49) },
    { id: 'p-1004', name: 'Samuel Torres', document: '987640321', phone: '+57 301 522 0394', email: 'samuel.torres@mail.com', createdAt: dateOffset(-37) },
    { id: 'p-1005', name: 'Lucía Méndez', document: '1033225180', phone: '+57 318 603 9145', email: 'lucia.mendez@mail.com', createdAt: dateOffset(-21) },
    { id: 'p-1006', name: 'Nicolás Vargas', document: '1020119365', phone: '+57 300 469 7812', email: 'nicolas.vargas@mail.com', createdAt: dateOffset(-8) },
  ],
  dentists: [
    { id: 'd-2001', name: 'Dra. Laura Gómez', specialty: 'Ortodoncia', phone: '+57 311 407 8250', email: 'laura.gomez@novadent.co', active: true },
    { id: 'd-2002', name: 'Dr. Andrés Molina', specialty: 'Endodoncia', phone: '+57 314 638 2071', email: 'andres.molina@novadent.co', active: true },
    { id: 'd-2003', name: 'Dra. Sofía Castro', specialty: 'Odontología general', phone: '+57 321 750 6824', email: 'sofia.castro@novadent.co', active: true },
    { id: 'd-2004', name: 'Dr. Felipe Navarro', specialty: 'Rehabilitación oral', phone: '+57 302 194 5563', email: 'felipe.navarro@novadent.co', active: true },
  ],
  appointments: [
    { id: 'a-3001', patientId: 'p-1001', dentistId: 'd-2001', date: dateOffset(0, 9), status: 'Confirmada', reason: 'Control de ortodoncia' },
    { id: 'a-3002', patientId: 'p-1003', dentistId: 'd-2003', date: dateOffset(0, 10, 30), status: 'Pendiente', reason: 'Valoración general' },
    { id: 'a-3003', patientId: 'p-1002', dentistId: 'd-2002', date: dateOffset(0, 12), status: 'Confirmada', reason: 'Revisión de conducto' },
    { id: 'a-3004', patientId: 'p-1005', dentistId: 'd-2004', date: dateOffset(1, 8, 30), status: 'Pendiente', reason: 'Consulta de rehabilitación' },
    { id: 'a-3005', patientId: 'p-1004', dentistId: 'd-2003', date: dateOffset(1, 11), status: 'Confirmada', reason: 'Limpieza dental' },
    { id: 'a-3006', patientId: 'p-1006', dentistId: 'd-2001', date: dateOffset(2, 14), status: 'Pendiente', reason: 'Ajuste de brackets' },
    { id: 'a-3007', patientId: 'p-1003', dentistId: 'd-2004', date: dateOffset(3, 10), status: 'Confirmada', reason: 'Diseño de sonrisa' },
  ],
};

export function readRecords(key) {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(seeds[key] ?? []));
  } catch {
    return [...(seeds[key] ?? [])];
  }
  return [...(seeds[key] ?? [])];
}

export function writeRecords(key, records) {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(records));
  return records;
}

export function createRecord(record) {
  return { ...record, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
}