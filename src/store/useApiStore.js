import { create } from 'zustand';
import axios from 'axios';

export const base_url = 'http://localhost:5000/api';

export const useApiStore = create((set, get) => ({
  endpoints: [],
  domains: [],
  restApis: [],
  statusFilter: '',

  setStatusFilter: (status) => set({ statusFilter: status }),

  // ENDPOINTS

  fetchEndpoints: async () => {
    try {
      const res = await axios.get(`${base_url}/get`);

      const endpointsWithArrayWebsites = res.data.map(ep => ({
        ...ep,
        websites: typeof ep.websites === 'string'
          ? ep.websites.split(',').map(w => w.trim())
          : ep.websites || [],
      }));

      console.log('Endpoints dari server:', endpointsWithArrayWebsites);
      set({ endpoints: endpointsWithArrayWebsites });
    } catch (err) {
      console.error('Gagal fetch endpoints:', err.message);
    }
  },

  addEndpoint: async (endpoint) => {
    try {
      const res = await axios.post(`${base_url}/post`, endpoint);
      get().fetchEndpoints();
      return res.data;
    } catch (err) {
      console.error('Gagal menambahkan endpoint:', err.message);
    }
  },

  updateEndpoint: async (id, updatedData) => {
    try {
      await axios.put(`${base_url}/put/${id}`, updatedData);
      get().fetchEndpoints();
    } catch (err) {
      console.error('Gagal update endpoint:', err.message);
    }
  },

  deleteEndpoint: async (id) => {
    try {
      await axios.delete(`${base_url}/delete/${id}`);
      get().fetchEndpoints();
    } catch (err) {
      console.error('Gagal hapus endpoint:', err.message);
    }
  },

  generateResponseJson: async (tableName = 'endpoints') => {
    try {
      const res = await axios.get(`${base_url}/describe/${tableName}`);
      if (res.data.success) {
        return res.data.data;
      } else {
        console.error('Respon describe gagal:', res.data.message);
        return null;
      }
    } catch (err) {
      console.error('Gagal generate response dari DB:', err.message);
      return null;
    }
  },

  // DOMAINS

  fetchDomains: async () => {
    try {
      const res = await axios.get(`${base_url}/domain/get`);
      set({ domains: res.data.map((d) => d.url) });
    } catch (err) {
      console.error('Gagal fetch domains:', err.message);
    }
  },

  addDomain: async (url) => {
    try {
      await axios.post(`${base_url}/domain/post`, { url });
      get().fetchDomains();
    } catch (err) {
      console.error('Gagal tambah domain:', err.message);
    }
  },

  // REST APIs

  fetchRestApis: async () => {
    try {
      const res = await axios.get(`${base_url}/restapi/get`);
      set({ restApis: res.data });
    } catch (err) {
      console.error("❌ Gagal fetch REST APIs:", err?.response?.data?.error || err.message);
    }
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

      console.log("🚀 Payload yang dikirim:", payload);

      const res = await axios.post(`${base_url}/restapi/post`, payload);

      await get().fetchRestApis();

      return res.data;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Gagal menambahkan REST API";
      console.error("❌ Gagal tambah REST API:", errorMsg);
      throw new Error(errorMsg);
    }
  },

  deleteRestApi: async (id) => {
    try {
      await axios.delete(`${base_url}/restapi/delete/${id}`);
      await get().fetchRestApis();
    } catch (err) {
      console.error("❌ Gagal hapus REST API:", err?.response?.data?.error || err.message);
    }
  },
}));
