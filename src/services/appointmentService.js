import { api, useMocks } from './api.js';
import { createRecord, readRecords, writeRecords } from './mockStore.js';

const RESOURCE = '/appointments';

export const appointmentService = {
  list: () => useMocks ? Promise.resolve(readRecords('appointments')) : api.get(RESOURCE),
  create: (data) => {
    if (!useMocks) return api.post(RESOURCE, data);
    const records = readRecords('appointments');
    const conflict = records.find((record) =>
      record.status !== 'Cancelada' &&
      data.status !== 'Cancelada' &&
      new Date(record.date).getTime() === new Date(data.date).getTime() &&
      (record.dentistId === data.dentistId || record.patientId === data.patientId)
    );
    if (conflict) throw new Error('El horario seleccionado ya no está disponible para este odontólogo o paciente.');
    const created = createRecord(data);
    writeRecords('appointments', [created, ...records]);
    return Promise.resolve(created);
  },
  update: (id, data) => {
    if (!useMocks) return api.put(`${RESOURCE}/${id}`, data);
    const currentRecords = readRecords('appointments');
    const merged = currentRecords.find((record) => record.id === id);
    const next = merged ? { ...merged, ...data } : data;
    const conflict = currentRecords.find((record) =>
      record.id !== id &&
      record.status !== 'Cancelada' &&
      next.status !== 'Cancelada' &&
      new Date(record.date).getTime() === new Date(next.date).getTime() &&
      (record.dentistId === next.dentistId || record.patientId === next.patientId)
    );
    if (conflict) throw new Error('El horario seleccionado ya no está disponible para este odontólogo o paciente.');
    const records = currentRecords.map((record) => record.id === id ? next : record);
    writeRecords('appointments', records);
    return Promise.resolve(records.find((record) => record.id === id));
  },
  remove: (id) => {
    if (!useMocks) return api.delete(`${RESOURCE}/${id}`);
    writeRecords('appointments', readRecords('appointments').filter((record) => record.id !== id));
    return Promise.resolve();
  },
};