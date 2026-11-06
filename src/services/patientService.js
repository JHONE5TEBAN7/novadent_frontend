import { api, useMocks } from './api.js';
import { createRecord, readRecords, writeRecords } from './mockStore.js';

const RESOURCE = '/patients';

export const patientService = {
  list: () => useMocks ? Promise.resolve(readRecords('patients')) : api.get(RESOURCE),
  create: (data) => {
    if (!useMocks) return api.post(RESOURCE, data);
    const created = createRecord(data);
    writeRecords('patients', [created, ...readRecords('patients')]);
    return Promise.resolve(created);
  },
  update: (id, data) => {
    if (!useMocks) return api.put(`${RESOURCE}/${id}`, data);
    const records = readRecords('patients').map((record) => record.id === id ? { ...record, ...data } : record);
    writeRecords('patients', records);
    return Promise.resolve(records.find((record) => record.id === id));
  },
  remove: (id) => {
    if (!useMocks) return api.delete(`${RESOURCE}/${id}`);
    writeRecords('patients', readRecords('patients').filter((record) => record.id !== id));
    return Promise.resolve();
  },
};