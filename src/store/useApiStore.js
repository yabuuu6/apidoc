import { create } from 'zustand';
import axios from 'axios';

export const base_url = 'http://localhost:5000/api';

export const useApiStore = create((set, get) => ({
  endpoints: [],
  domains: [],
  restApis: [],
  statusFilter: '',

  setStatusFilter: (status) => set({ statusFilter: status }),

  getData: async (path, key, mapper) => {
    try {
      const res = await axios.get(`${base_url}/${path}`);
      const data = typeof mapper === 'function' ? res.data.map(mapper) : res.data;
      set({ [key]: data });
    } catch (err) {
      console.error(`Gagal Menampilkan Data ${key}:`, err.message);
    }
  },

  deleteData: async (path, id, fetchFunc) => {
    try {
      await axios.delete(`${base_url}/${path}/${id}`);
      if (typeof fetchFunc === 'function') await fetchFunc();
    } catch (err) {
      console.error(`Gagal Hapus Data ${path}:`, err?.response?.data?.error || err.message);
    }
  },

  // ENDPOINTS
  fetchEndpoints: async () => {
    await get().getData('get', 'endpoints', (ep) => ({
      ...ep,
      websites: typeof ep.websites === 'string'
        ? ep.websites.split(',').map(w => w.trim())
        : ep.websites || [],
    }));
  },

  addEndpoint: async (endpoint) => {
    try {
      const res = await axios.post(`${base_url}/post`, endpoint);
      await get().fetchEndpoints();
      return res.data;
    } catch (err) {
      console.error('Gagal menambahkan endpoint:', err.message);
    }
  },

  updateEndpoint: async (id, updatedData) => {
    try {
      await axios.put(`${base_url}/put/${id}`, updatedData);
      await get().fetchEndpoints();
    } catch (err) {
      console.error('Gagal update endpoint:', err.message);
    }
  },

  deleteEndpoint: async (id) => {
    await get().deleteData('delete', id, get().fetchEndpoints);
  },

  generateResponseJson: async (tableName = 'endpoints') => {
    try {
      const res = await axios.get(`${base_url}/describe/${tableName}`);
      return res.data.success ? res.data.data : null;
    } catch (err) {
      console.error('Gagal generate response dari DB:', err.message);
      return null;
    }
  },

  // DOMAINS
  fetchDomains: async () => {
    await get().getData('domain/get', 'domains', (d) => d.url);
  },

  addDomain: async (url) => {
    try {
      await axios.post(`${base_url}/domain/post`, { url });
      await get().fetchDomains();
    } catch (err) {
      console.error('Gagal tambah domain:', err.message);
    }
  },

  // REST APIs
  fetchRestApis: async () => {
    await get().getData('restapi/get', 'restApis');
  },

  addRestApi: async (data) => {
    try {
      const payload = {
        projectName: typeof data.projectName === "string" ? data.projectName.trim() : "",
        engine: typeof data.engine === "string" ? data.engine.trim() : "",
        ip: typeof data.ip === "string" ? data.ip.trim() : "",
        port: data.port ? parseInt(data.port, 10) : undefined,
        username: typeof data.username === "string" ? data.username.trim() : "",
        password: typeof data.password === "string" ? data.password : "",
        database_name: typeof data.database_name === "string" ? data.database_name.trim() : "",
      };

      console.log("Payload yang dikirim:", payload);

      const res = await axios.post(`${base_url}/restapi/post`, payload);
      await get().fetchRestApis();
      return res.data;
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.message || "Gagal menambahkan REST API";
      console.error("Gagal tambah REST API:", errorMsg);
      throw new Error(errorMsg);
    }
  },

  deleteRestApi: async (id) => {
    await get().deleteData('restapi/delete', id, get().fetchRestApis);
  },
}));
