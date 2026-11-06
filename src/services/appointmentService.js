import { api, useMocks } from './api.js';
import { createRecord, readRecords, writeRecords } from './mockStore.js';

const RESOURCE = '/appointments';

export const appointmentService = {
  list: () => useMocks ? Promise.resolve(readRecords('appointments')) : api.get(RESOURCE),
  create: (data) => {
    if (!useMocks) return api.post(RESOURCE, data);
    const records = readRecords('appointments');
    const created = createRecord(data);
    writeRecords('appointments', [created, ...records]);
    return Promise.resolve(created);
  },
  update: (id, data) => {
    if (!useMocks) return api.put(`${RESOURCE}/${id}`, data);
    const records = readRecords('appointments').map((record) => record.id === id ? { ...record, ...data } : record);
    writeRecords('appointments', records);
    return Promise.resolve(records.find((record) => record.id === id));
  },
  remove: (id) => {
    if (!useMocks) return api.delete(`${RESOURCE}/${id}`);
    writeRecords('appointments', readRecords('appointments').filter((record) => record.id !== id));
    return Promise.resolve();
  },
};