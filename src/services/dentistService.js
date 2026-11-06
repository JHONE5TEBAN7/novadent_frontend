import { api, useMocks } from './api.js';
import { createRecord, readRecords, writeRecords } from './mockStore.js';

const RESOURCE = '/dentists';

export const dentistService = {
  list: () => useMocks ? Promise.resolve(readRecords('dentists')) : api.get(RESOURCE),
  create: (data) => {
    if (!useMocks) return api.post(RESOURCE, data);
    const created = createRecord({ ...data, active: true });
    writeRecords('dentists', [created, ...readRecords('dentists')]);
    return Promise.resolve(created);
  },
  update: (id, data) => {
    if (!useMocks) return api.put(`${RESOURCE}/${id}`, data);
    const records = readRecords('dentists').map((record) => record.id === id ? { ...record, ...data } : record);
    writeRecords('dentists', records);
    return Promise.resolve(records.find((record) => record.id === id));
  },
  remove: (id) => {
    if (!useMocks) return api.delete(`${RESOURCE}/${id}`);
    writeRecords('dentists', readRecords('dentists').filter((record) => record.id !== id));
    return Promise.resolve();
  },
};